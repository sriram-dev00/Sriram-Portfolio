/* ═══════════════════════════════════════════════════════════════════════════
   PORTFOLIO ENGINE — Shared SPA Router, 3D Space Field & Navigation
   ═══════════════════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  // Global project & site fallback declarations
  const SITE = window.SITE || {};
  const PROJECTS = window.PROJECTS || [];

  // Configuration Constants — Michael Gatt-style 3D Spatial Field
  const CONFIG = {
    // Reference Space View Dimensions (Discovered from Michael Gatt source: CcN6nvJA.js)
    REF_WIDTH: 5760,              // Reference space field horizontal length (px)
    REF_HEIGHT: 3100,             // Reference space field vertical length (px)
    REF_ASPECT: 5760 / 3100,      // 1.8580645 reference aspect ratio
    REF_MOBILE_WIDTH: 2137,       // Mobile horizontal length (px)
    REF_MOBILE_HEIGHT: 1644,      // Mobile vertical length (px)
    REF_MOBILE_ASPECT: 2137 / 1644, // 1.299878 mobile aspect ratio

    // 3D Spatial Field Geometry (matching reference cylinder)
    CYLINDER_MIN_RADIUS: 2500,
    CYLINDER_MAX_RADIUS: 5500,
    POPULATED_ANGLE: 270,          // deg

    STAGE_PERSPECTIVE: 1100,       // px, expansive 3D camera perspective field
    CONCAVE_CURVE_STRENGTH: 180,   // px, subtle concave fisheye depth
    PITCH_COEFF: 5.5,              // deg, gentle pitch tilt along concave curve
    YAW_COEFF: -9.5,               // deg, subtle inward horizontal yaw rotation

    // Hover Interaction Timing
    HOVER_INTENT_DELAY: 25,        // ms
    HOVER_TOUCH_DELAY: 25,         // ms
    HOVER_EXIT_DELAY: 60,          // ms

    TILE_REST_BRIGHTNESS: 0.55,
    TILE_REST_SATURATE: 0.75,
  };

  // State Management
  let activeView = 'space';
  let previousView = 'space';
  let isAudioPlaying = false;
  let audioInstance = null;
  let animationFrameId = null;
  let targetMouseX = 0;
  let targetMouseY = 0;
  let lastMouseX = null;
  let lastMouseY = null;
  let rawMouseSpeed = 0;
  let smoothMouseSpeed = 0;
  let mouseVelTimer = null;
  let cameraX = 0;
  let cameraY = 0;
  let activeHoveredTile = null;
  let hoverIntentTimer = null;
  let hoverExitTimer = null;

  // DOM Containers
  const appContainer = document.getElementById('app') || document.body;
  let views = {};
  let field = null;
  let stage = null;

  /* ═══════════════════════════════════════════════════════════════════════════
     1. PERSISTENT CHROME (Brand Header, Footer Nav, Index Toggle, Sound)
     ═══════════════════════════════════════════════════════════════════════════ */

  function scrambleText(el, finalStr) {
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.textContent = finalStr;
      return;
    }
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    const duration = 420;
    const startTime = performance.now();

    function update(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1.0);
      let result = '';
      for (let i = 0; i < finalStr.length; i++) {
        if (finalStr[i] === ' ') {
          result += ' ';
          continue;
        }
        const letterProgress = Math.max(0, (progress - (i * 0.03)) / (1.0 - (i * 0.03)));
        if (letterProgress >= 1.0) {
          result += finalStr[i];
        } else {
          result += chars[Math.floor(Math.random() * chars.length)];
        }
      }
      el.textContent = result;
      if (progress < 1.0) {
        requestAnimationFrame(update);
      }
    }
    requestAnimationFrame(update);
  }

  function initPersistentChrome() {
    document.title = `${SITE.name || 'Portfolio'} — ${SITE.role || 'Designer'}`;

    // Brand Header
    const brand = document.createElement('div');
    brand.className = 'brand';
    brand.innerHTML = `<span class="name"></span><span class="role">${SITE.role || ''}</span>`;
    brand.addEventListener('click', () => go('space'));
    brand.style.cursor = 'pointer';
    brand.style.pointerEvents = 'auto';
    document.body.appendChild(brand);

    const nameEl = brand.querySelector('.name');
    scrambleText(nameEl, SITE.name || 'Sriram MJ');

    // Index View Toggle (Center + to X)
    const indexToggle = document.createElement('div');
    indexToggle.className = 'index-toggle show';
    indexToggle.setAttribute('aria-label', 'Toggle Index View');
    indexToggle.innerHTML = `
      <span class="plus"></span>
      <span class="label">INDEX VIEW</span>
    `;
    indexToggle.addEventListener('click', () => {
      if (activeView === 'space') {
        go('index');
      } else {
        go('space');
      }
    });
    document.body.appendChild(indexToggle);

    // Footer Navigation
    const footerNav = document.createElement('nav');
    footerNav.className = 'footer-nav';
    footerNav.innerHTML = `
      <div class="footer-row">
        <span class="lead">${SITE.navLead1 || 'THE'}</span>
        <button class="nav-btn ${activeView === 'space' || activeView === 'index' ? 'active' : ''}" data-target="space">${SITE.navWork || 'WORK'}</button>
        <span class="joiner">${SITE.navLead2 || 'AND'}</span>
        <button class="nav-btn ${activeView === 'about' ? 'active' : ''}" data-target="about">ABOUT</button>
        <span class="joiner">ME</span>
      </div>
      <div class="footer-row">
        <span class="joiner">${SITE.navLead3 || 'OR'}</span>
        <button class="nav-btn ${activeView === 'contact' ? 'active' : ''}" data-target="contact">${SITE.navContact || 'CONTACT'}</button>
      </div>
    `;
    footerNav.querySelectorAll('.nav-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const target = e.currentTarget.dataset.target;
        go(target);
      });
    });
    document.body.appendChild(footerNav);

    // Sound Toggle (Bottom-Right)
    const soundToggle = document.createElement('button');
    soundToggle.className = 'sound-toggle';
    soundToggle.setAttribute('aria-label', 'Toggle Ambient Audio');
    soundToggle.innerHTML = `
      <svg class="icon-on" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
        <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
      </svg>
      <svg class="icon-off" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="display:none;">
        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
        <line x1="23" y1="9" x2="17" y2="15"></line>
        <line x1="17" y1="9" x2="23" y2="15"></line>
      </svg>
    `;
    soundToggle.addEventListener('click', toggleAudio);
    document.body.appendChild(soundToggle);

    // Init Audio persistence
    const savedAudio = localStorage.getItem('portfolio_audio');
    if (savedAudio === 'enabled') {
      enableAudio(false);
    }
  }

  function toggleAudio() {
    if (isAudioPlaying) {
      disableAudio();
    } else {
      enableAudio(true);
    }
  }

  function enableAudio(userInitiated) {
    if (!audioInstance) {
      const isSubsite = window.location.pathname.includes('/uiux/') || window.location.pathname.includes('/video-editor/');
      const basePath = isSubsite ? '../' : './';
      audioInstance = new Audio(`${basePath}media/ambient.mp3`);
      audioInstance.loop = true;
      audioInstance.volume = 0.4;
    }
    audioInstance.play().then(() => {
      isAudioPlaying = true;
      localStorage.setItem('portfolio_audio', 'enabled');
      updateAudioUI();
    }).catch(err => {
      isAudioPlaying = false;
      updateAudioUI();
      if (userInitiated) {
        console.warn('Audio playback unavailable or missing media/ambient.mp3 file:', err);
      }
    });
  }

  function disableAudio() {
    if (audioInstance) {
      audioInstance.pause();
    }
    isAudioPlaying = false;
    localStorage.setItem('portfolio_audio', 'disabled');
    updateAudioUI();
  }

  function updateAudioUI() {
    const soundToggle = document.querySelector('.sound-toggle');
    if (!soundToggle) return;
    const iconOn = soundToggle.querySelector('.icon-on');
    const iconOff = soundToggle.querySelector('.icon-off');
    if (isAudioPlaying) {
      if (iconOn) iconOn.style.display = 'block';
      if (iconOff) iconOff.style.display = 'none';
      soundToggle.classList.add('is-playing');
    } else {
      if (iconOn) iconOn.style.display = 'none';
      if (iconOff) iconOff.style.display = 'block';
      soundToggle.classList.remove('is-playing');
    }
  }

  /* ═══════════════════════════════════════════════════════════════════════════
     2. 3D FIELD LAYOUT — Mapped within reference 5760x3100 space view canvas
     ═══════════════════════════════════════════════════════════════════════════ */

  const LAYOUT = [
    // 0. NIGHT RIDE — Tall vertical portrait anchor on far left edge
    { refX: 1200, refY: 1510, refW: 460, refH: 690, x: -920, y: -20, w: 240, h: 360, zPx: 180, rx: 1.5, ry: -5.5, rz: -1.5, sizeClass: 'large' },
    // 1. WHEELIE CITY — Motorcycle upper-center-left
    { refX: 2390, refY: 1170, refW: 510, refH: 330, x: -320, y: -220, w: 280, h: 180, zPx: 120, rx: -2.0, ry: 2.5, rz: 1.2, sizeClass: 'medium' },
    // 2. BURNOUT — White car on highway upper-mid-right
    { refX: 3500, refY: 1150, refW: 530, refH: 350, x: 380, y: -230, w: 290, h: 190, zPx: 140, rx: -2.5, ry: -3.5, rz: -1.8, sizeClass: 'medium' },
    // 3. BEHIND THE LENS — Clapperboard in desert lower-mid-left
    { refX: 2280, refY: 1930, refW: 510, refH: 340, x: -360, y: 220, w: 280, h: 185, zPx: 150, rx: 2.0, ry: 2.2, rz: 1.0, sizeClass: 'medium' },
    // 4. REEL 2026 — Neon cinema facade lower-center below index toggle
    { refX: 2935, refY: 2020, refW: 450, refH: 350, x: 40, y: 250, w: 250, h: 190, zPx: 110, rx: 2.0, ry: -1.0, rz: -0.5, sizeClass: 'medium' },
    // 5. LUMINAL HR — Dark analytics screen under car
    { refX: 3780, refY: 1410, refW: 290, refH: 210, x: 490, y: -80, w: 160, h: 115, zPx: -60, rx: 2.5, ry: -3.0, rz: -1.5, sizeClass: 'small' },
    // 6. HR ADMIN FLOW — Desk laptop mid-far-right
    { refX: 4320, refY: 1730, refW: 330, refH: 240, x: 740, y: 110, w: 180, h: 130, zPx: 60, rx: -1.8, ry: -4.5, rz: 1.2, sizeClass: 'small' },
    // 7. MANAGER FLOW — Cafe laptop lower-left under clapperboard
    { refX: 1980, refY: 2150, refW: 255, refH: 310, x: -550, y: 290, w: 140, h: 170, zPx: 30, rx: 2.8, ry: 4.5, rz: -1.8, sizeClass: 'small' },
    // 8. EMPLOYEE FLOW — Sketches hands top-left distant
    { refX: 1860, refY: 1080, refW: 240, refH: 170, x: -620, y: -230, w: 130, h: 95, zPx: -220, rx: 1.8, ry: 3.5, rz: -1.0, sizeClass: 'small' },
    // 9. POSTER SERIES — Poster series bottom-mid-right
    { refX: 3520, refY: 2280, refW: 270, refH: 330, x: 360, y: 350, w: 150, h: 180, zPx: 50, rx: 2.0, ry: -2.8, rz: -1.0, sizeClass: 'small' },
    // 10. BRAND IDENTITY — Wireframes & sketches top-center distant
    { refX: 2990, refY: 880, refW: 220, refH: 165, x: 70, y: -320, w: 120, h: 90, zPx: -250, rx: -1.2, ry: 1.2, rz: 0.8, sizeClass: 'small' },
    // 11. ILLUSTRATION SET — Art peaking from lower-left under cinema
    { refX: 2580, refY: 2250, refW: 255, refH: 180, x: -160, y: 340, w: 140, h: 100, zPx: -120, rx: 2.2, ry: -2.8, rz: -1.5, sizeClass: 'small' },
    // 12. CINEMA STILLS — Open book & glasses above motorcycle
    { refX: 2320, refY: 780, refW: 255, refH: 170, x: -330, y: -380, w: 140, h: 95, zPx: -200, rx: -2.5, ry: 3.0, rz: 1.2, sizeClass: 'small' },
    // 13. INTERFACE CRAFT — Far upper-left wing
    { refX: 1320, refY: 860, refW: 270, refH: 190, x: -880, y: -340, w: 150, h: 105, zPx: -180, rx: -2.2, ry: 4.8, rz: 1.5, sizeClass: 'small' },
    // 14. EDITORIAL LAYOUT — Far upper-right wing
    { refX: 4420, refY: 880, refW: 270, refH: 190, x: 860, y: -330, w: 150, h: 105, zPx: -190, rx: 2.6, ry: -4.8, rz: -1.5, sizeClass: 'small' },
    // 15. MOTION GRAPHICS — Synth console far-lower-right
    { refX: 4220, refY: 2180, refW: 255, refH: 180, x: 780, y: 280, w: 140, h: 100, zPx: -80, rx: 2.5, ry: -4.2, rz: -1.5, sizeClass: 'small' }
  ];

  /* ═══════════════════════════════════════════════════════════════════════════
     3. TILE MEDIA GENERATOR
     ═══════════════════════════════════════════════════════════════════════════ */

  function getTileMedia(proj, index) {
    if (!proj) return '';
    const src = proj.thumb || (proj.media && proj.media.src) || '';
    const isVideo = proj.thumbType === 'video' || (proj.media && proj.media.type === 'video');

    if (isVideo) {
      return `<video src="${src}" autoplay loop muted playsinline poster="${proj.media ? proj.media.poster || '' : ''}"></video>`;
    }

    if (src) {
      return `<img src="${src}" alt="${proj.title || ''}" loading="lazy" />`;
    }

    // High-fidelity fallback SVG thumbnail
    const colors = ['#1a1918', '#22201e', '#1c1b1a', '#242220', '#1e1c1b'];
    const bgCol = colors[index % colors.length];
    return `
      <svg width="100%" height="100%" viewBox="0 0 400 260" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
        <rect width="400" height="260" fill="${bgCol}"/>
        <circle cx="200" cy="130" r="70" fill="none" stroke="rgba(201,168,117,0.15)" stroke-width="1.5"/>
        <path d="M160 130 L240 130 M200 90 L200 170" stroke="rgba(233,231,226,0.2)" stroke-width="1"/>
        <text x="200" y="134" font-family="Cinzel, serif" font-size="12" fill="#c9a875" letter-spacing="3" text-anchor="middle" opacity="0.6">${(proj.title || 'PROJECT').toUpperCase()}</text>
      </svg>
    `;
  }

  /* ═══════════════════════════════════════════════════════════════════════════
     4. RENDER SPACE FIELD & CENTER DESCRIPTION FADE-IN SYSTEM
     ═══════════════════════════════════════════════════════════════════════════ */

  function showCenterDesc(proj) {
    const descEl = document.getElementById('spaceCenterDesc');
    const indexToggleEl = document.querySelector('.index-toggle');
    if (!descEl || !proj) return;

    const titleEl = document.getElementById('spaceCenterTitle');
    const descTextEl = document.getElementById('spaceCenterDescText');

    if (titleEl) titleEl.textContent = proj.title || '';
    if (descTextEl) descTextEl.textContent = proj.short || proj.description || '';

    descEl.dataset.slug = proj.slug || '';
    descEl.classList.add('is-active');
    if (indexToggleEl) indexToggleEl.classList.add('hide-for-desc');
  }

  function hideCenterDesc() {
    const descEl = document.getElementById('spaceCenterDesc');
    const indexToggleEl = document.querySelector('.index-toggle');
    if (descEl) descEl.classList.remove('is-active');
    if (indexToggleEl) indexToggleEl.classList.remove('hide-for-desc');
  }

  /* ═══════════════════════════════════════════════════════════════════════════
     ASPECT-RATIO & REFERENCE SPACE GEOMETRY ENGINE
     Calibrated against Michael Gatt's 5760x3100 space view canvas
     ═══════════════════════════════════════════════════════════════════════════ */
  function getSpatialScaleFactor() {
    const isMobile = window.innerWidth < 768;
    const refW = isMobile ? CONFIG.REF_MOBILE_WIDTH : CONFIG.REF_WIDTH;
    const refH = isMobile ? CONFIG.REF_MOBILE_HEIGHT : CONFIG.REF_HEIGHT;
    const refAspect = refW / refH;

    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const vpAspect = vw / vh;

    // Visible viewport window in reference space corresponds to 25% (1/4) of the 5760x3100 field
    const baseW = refW * 0.25; // 1440px desktop, 534.25px mobile
    const baseH = refH * 0.25; // 775px desktop, 411px mobile

    // Aspect-ratio-aware scaling relative to reference dimensions
    const baseScale = vpAspect > refAspect
      ? (vh / baseH)
      : (vw / baseW);

    return isMobile ? 0.72 : Math.max(0.78, Math.min(1.28, baseScale));
  }

  function renderField() {
    if (!field) return;
    field.style.display = 'block';
    field.innerHTML = '';

    const isMobile = window.innerWidth < 768;
    const scaleFactor = getSpatialScaleFactor();
    const totalSlots = Math.min(LAYOUT.length, PROJECTS.length);

    for (let i = 0; i < totalSlots; i++) {
      const pos = LAYOUT[i];
      const proj = PROJECTS[i] || {};

      const tile = document.createElement('div');
      tile.className = `tile ${pos.sizeClass || 'medium'}`;
      tile.dataset.slug = proj.slug || '';
      tile.dataset.x = pos.x;
      tile.dataset.y = pos.y;
      tile.dataset.zpx = pos.zPx;
      tile.dataset.rx = pos.rx || 0;
      tile.dataset.ry = pos.ry || 0;
      tile.dataset.rz = pos.rz || 0;
      tile.dataset.index = i;
      tile.setAttribute('data-cursor', 'Learn More');
      if (pos.x > 35) {
        tile.setAttribute('data-x-pos', 'right');
      }

      // Responsive tile dimensions
      const finalW = Math.round((pos.w || 220) * scaleFactor);
      const finalH = pos.h ? Math.round(pos.h * scaleFactor) : Math.round(finalW * 0.65);
      tile.style.setProperty('--tile-w', `${finalW}px`);
      tile.style.setProperty('--tile-h', `${finalH}px`);

      const mediaHTML = getTileMedia(proj, i);

      tile.innerHTML = `
        <div class="frame">
          ${mediaHTML}
        </div>
      `;

      // Hover event handling (triggers smooth fade-in of description in the center)
      tile.addEventListener('mouseenter', () => {
        clearTimeout(hoverExitTimer);
        hoverIntentTimer = setTimeout(() => {
          activeHoveredTile = tile;
          field.classList.add('has-hover');
          field.querySelectorAll('.tile').forEach(t => {
            if (t === tile) {
              t.classList.add('is-hovered');
            } else {
              t.classList.remove('is-hovered');
            }
          });
          showCenterDesc(proj);
        }, CONFIG.HOVER_INTENT_DELAY);
      });

      tile.addEventListener('mouseleave', () => {
        clearTimeout(hoverIntentTimer);
        hoverExitTimer = setTimeout(() => {
          if (activeHoveredTile === tile) {
            activeHoveredTile = null;
          }
          field.classList.remove('has-hover');
          field.querySelectorAll('.tile').forEach(t => t.classList.remove('is-hovered'));
          hideCenterDesc();
        }, CONFIG.HOVER_EXIT_DELAY);
      });

      // Navigation click
      tile.addEventListener('click', () => {
        if (proj.slug) {
          go('project', proj.slug);
        }
      });

      field.appendChild(tile);
    }
  }

  /* Precise 3D Spatial Hit-Testing Engine for Overlapping Back Tiles & Camera Sway */
  document.addEventListener('pointermove', (e) => {
    // Track normalized mouse coordinates across reference space (-1.0 to +1.0)
    targetMouseX = (e.clientX / window.innerWidth) * 2 - 1;
    targetMouseY = (e.clientY / window.innerHeight) * 2 - 1;

    if (activeView !== 'space' || !field) return;

    const hitElement = document.elementFromPoint(e.clientX, e.clientY);
    const hitTile = hitElement ? hitElement.closest('.tile') : null;

    if (hitTile) {
      if (activeHoveredTile !== hitTile) {
        clearTimeout(hoverExitTimer);
        clearTimeout(hoverIntentTimer);

        hoverIntentTimer = setTimeout(() => {
          activeHoveredTile = hitTile;
          field.classList.add('has-hover');
          field.querySelectorAll('.tile').forEach(t => {
            if (t === hitTile) {
              t.classList.add('is-hovered');
            } else {
              t.classList.remove('is-hovered');
            }
          });
          const targetSlug = hitTile.dataset.slug;
          const hitProj = PROJECTS.find(p => p.slug === targetSlug);
          if (hitProj) showCenterDesc(hitProj);
        }, 20);
      }
    } else if (activeHoveredTile) {
      clearTimeout(hoverIntentTimer);
      clearTimeout(hoverExitTimer);
      hoverExitTimer = setTimeout(() => {
        activeHoveredTile = null;
        field.classList.remove('has-hover');
        field.querySelectorAll('.tile').forEach(t => t.classList.remove('is-hovered'));
        hideCenterDesc();
      }, CONFIG.HOVER_EXIT_DELAY);
    }
  });

  /* ═══════════════════════════════════════════════════════════════════════════
     5. 3D CONCAVE SPACE ANIMATION LOOP
     ═══════════════════════════════════════════════════════════════════════════ */

  let fieldRotX = 0;
  let fieldRotY = 0;

  function spaceLoop() {
    if (activeView !== 'space') return;

    const isMobile = window.innerWidth < 768;
    const scaleFactor = getSpatialScaleFactor();

    // Michael Gatt-style camera sway across full 5760x3100 spatial gallery field
    // Full horizontal and vertical camera travel with generous yaw/pitch and luxurious inertia
    const targetCamX = isMobile ? 0 : targetMouseX * (scaleFactor * 460);
    const targetCamY = isMobile ? 0 : targetMouseY * (scaleFactor * 280);
    const targetRotY = isMobile ? 0 : targetMouseX * 10.5;
    const targetRotX = isMobile ? 0 : -targetMouseY * 6.5;

    // Power4.out deceleration easing (lerp factor 0.045 for smooth cinematic movement)
    cameraX += (targetCamX - cameraX) * 0.045;
    cameraY += (targetCamY - cameraY) * 0.045;
    fieldRotY += (targetRotY - fieldRotY) * 0.045;
    fieldRotX += (targetRotX - fieldRotX) * 0.045;

    if (field) {
      field.style.transform = `translate3d(${-cameraX.toFixed(1)}px, ${-cameraY.toFixed(1)}px, 0px) rotateX(${fieldRotX.toFixed(2)}deg) rotateY(${fieldRotY.toFixed(2)}deg)`;

      field.querySelectorAll('.tile').forEach((t, i) => {
        const rawX = isNaN(parseFloat(t.dataset.x)) ? 0 : parseFloat(t.dataset.x);
        const rawY = isNaN(parseFloat(t.dataset.y)) ? 0 : parseFloat(t.dataset.y);
        const baseZ = isNaN(parseFloat(t.dataset.zpx)) ? 0 : parseFloat(t.dataset.zpx);

        const baseRx = isNaN(parseFloat(t.dataset.rx)) ? 0 : parseFloat(t.dataset.rx);
        const baseRy = isNaN(parseFloat(t.dataset.ry)) ? 0 : parseFloat(t.dataset.ry);
        const baseRz = isNaN(parseFloat(t.dataset.rz)) ? 0 : parseFloat(t.dataset.rz);

        const posX = rawX * scaleFactor;
        const posY = rawY * scaleFactor;

        // Normalized distance from center for fisheye concave curve relative to reference canvas
        const normX = posX / (720 * scaleFactor);
        const normY = posY / (390 * scaleFactor);
        const distSq = (normX * normX) + (normY * normY * 0.65);

        // Concave curvature pushing peripheral tiles deeper into space
        const concaveZ = - distSq * CONFIG.CONCAVE_CURVE_STRENGTH;
        const totalZ = baseZ + concaveZ;

        // Subtle inward facing tilts along concave arc
        const cylRotY = baseRy + (normX * CONFIG.YAW_COEFF);
        const cylRotX = baseRx + (-normY * CONFIG.PITCH_COEFF);
        const cylRotZ = baseRz;

        const isHovered = t.classList.contains('is-hovered');
        const hoverScale = isHovered ? 1.05 : 1.0;

        // Depth-based opacity: Far (~0.38), Mid (~0.55), Near (~0.75), Hovered (1.0)
        const normZ = Math.max(0, Math.min(1, (totalZ + 380) / 600));
        const depthOpacity = 0.38 + normZ * 0.40;
        t.style.opacity = isHovered ? '1.0' : depthOpacity.toFixed(2);

        // Dynamic 3D Z-index: Derived directly from computed 3D depth
        const uniqueStackIndex = Math.round((totalZ + 2000) * 10) + i;
        t.style.zIndex = isHovered ? 9999 : uniqueStackIndex;

        // Visual depth filter
        t.style.filter = isHovered
          ? 'brightness(1.05) saturate(1.0) drop-shadow(0px 14px 36px rgba(0,0,0,0.95))'
          : `brightness(${CONFIG.TILE_REST_BRIGHTNESS}) saturate(${CONFIG.TILE_REST_SATURATE}) drop-shadow(0px 10px 24px rgba(0,0,0,0.5))`;

        // Pure 3D transform: center-anchored translate(-50%, -50%) + translate3d(X, Y, Z) + 3D rotations + hover scale
        t.style.transform = `translate(-50%, -50%) translate3d(${posX.toFixed(1)}px, ${posY.toFixed(1)}px, ${totalZ.toFixed(1)}px) rotateX(${cylRotX.toFixed(2)}deg) rotateY(${cylRotY.toFixed(2)}deg) rotateZ(${cylRotZ.toFixed(2)}deg) scale(${hoverScale})`;
      });
    }

    animationFrameId = requestAnimationFrame(spaceLoop);
  }

  /* ═══════════════════════════════════════════════════════════════════════════
     6. VIEW FACTORIES & SPA ROUTER
     ═══════════════════════════════════════════════════════════════════════════ */

  function makeView(name) {
    let v = document.getElementById(`view-${name}`);
    if (!v) {
      v = document.createElement('div');
      v.id = `view-${name}`;
      v.className = 'view';
      v.setAttribute('data-view', name);
      appContainer.appendChild(v);
    } else if (!v.getAttribute('data-view')) {
      v.setAttribute('data-view', name);
    }
    views[name] = v;
    return v;
  }

  function setupSpaceView() {
    const spaceV = makeView('space');
    spaceV.innerHTML = `
      <div class="home-stage">
        <div class="field" id="field"></div>
      </div>
      <div class="space-center-desc" id="spaceCenterDesc" aria-live="polite">
        <h2 class="sc-title" id="spaceCenterTitle">TITLE</h2>
        <p class="sc-desc" id="spaceCenterDescText">Description</p>
      </div>
    `;
    stage = spaceV.querySelector('.home-stage');
    if (stage) {
      updateStagePerspective();
    }
    field = spaceV.querySelector('#field');

    const centerDesc = spaceV.querySelector('#spaceCenterDesc');
    if (centerDesc) {
      centerDesc.addEventListener('click', () => {
        const slug = centerDesc.dataset.slug;
        if (slug) go('project', slug);
      });
    }

    renderField();
  }

  function updateStagePerspective() {
    if (!stage) return;
    const vh = window.innerHeight;
    // 50° vertical FOV matching Three.js reference camera
    const fovRad = (50 / 2) * (Math.PI / 180);
    const cameraDist = Math.round((vh / 2) / Math.tan(fovRad));
    const finalPerspective = Math.max(760, Math.min(1200, cameraDist));
    stage.style.perspective = `${finalPerspective}px`;
    stage.style.setProperty('--stage-perspective', `${finalPerspective}px`);
  }

  let resizeTimer = null;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      updateStagePerspective();
      if (activeView === 'space') {
        renderField();
      }
    }, 120);
  });

  function setupIndexView() {
    const indexV = makeView('index');
    indexV.innerHTML = `
      <button class="index-back-btn a-arrow-text" aria-label="Back to space view" data-cursor="Back">
        <svg class="a-arrow-text_arrow" viewBox="0 0 9 8" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path d="M1.17188 4.08594H8.67188" stroke="currentColor" stroke-width="1.2"/>
          <path d="M4.08564 7.17218L0.999396 4.08594L4.08564 0.999698" stroke="currentColor" stroke-width="1.2"/>
        </svg>
        <span class="a-arrow-text_title">BACK</span>
        <span class="a-arrow-text_caption">TO SPACE VIEW</span>
      </button>
      <div class="index-hover-preview" id="indexHoverPreview">
        <img class="index-preview-img" id="indexPreviewImg" alt="" />
      </div>
      <div class="index-page-inner">
        <div class="index-list">
          ${PROJECTS.map((p, i) => {
      const bgSrc = p.thumb || (p.media ? p.media.src : '');
      return `
              <div class="row" data-slug="${p.slug}" data-bg="${bgSrc}" data-cursor="Open" role="button" tabindex="0" aria-label="Open project ${p.title}">
                <span class="n">${String(i + 1).padStart(3, '0')}</span>
                <span class="name">${p.title}</span>
              </div>
            `;
    }).join('')}
        </div>
      </div>
    `;

    const backBtn = indexV.querySelector('.index-back-btn');
    if (backBtn) {
      backBtn.addEventListener('click', () => go('space'));
    }

    const previewImg = indexV.querySelector('#indexPreviewImg');
    const indexList = indexV.querySelector('.index-list');
    const inner = indexV.querySelector('.index-page-inner');

    indexV.querySelectorAll('.row[data-slug]').forEach(row => {
      row.addEventListener('mouseenter', () => {
        const bgSrc = row.dataset.bg;
        if (!bgSrc || !previewImg) return;

        const rect = row.getBoundingClientRect();
        const rowCenterY = rect.top + rect.height / 2;

        previewImg.src = bgSrc;
        previewImg.style.top = `${rowCenterY.toFixed(1)}px`;
        previewImg.classList.add('visible');
      });

      row.addEventListener('click', () => {
        go('project', row.dataset.slug);
      });

      row.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          go('project', row.dataset.slug);
        }
      });
    });

    if (indexList && previewImg) {
      indexList.addEventListener('mouseleave', () => {
        previewImg.classList.remove('visible');
      });
    }

    if (inner && previewImg) {
      inner.addEventListener('scroll', () => {
        const hoveredRow = indexV.querySelector('.row:hover');
        if (hoveredRow) {
          const rect = hoveredRow.getBoundingClientRect();
          const rowCenterY = rect.top + rect.height / 2;
          previewImg.style.top = `${rowCenterY.toFixed(1)}px`;
        } else {
          previewImg.classList.remove('visible');
        }
      }, { passive: true });
    }
  }

  function setupProjectView(slug) {
    const projV = makeView('project');
    const p = PROJECTS.find(item => item.slug === slug) || PROJECTS[0];
    if (!p) return;

    const projIndex = PROJECTS.findIndex(item => item.slug === p.slug);
    const nextProj = PROJECTS[(projIndex + 1) % PROJECTS.length];

    const mediaSrc = (p.media && p.media.src) ? p.media.src : (p.thumb || '');
    const isVideo = (p.media && p.media.type === 'video') || p.thumbType === 'video' || (mediaSrc && mediaSrc.endsWith('.mp4'));

    const mediaHTML = isVideo
      ? `<video src="${mediaSrc}" controls autoplay loop muted playsinline poster="${p.media ? p.media.poster || '' : ''}"></video>`
      : (mediaSrc ? `<img src="${mediaSrc}" alt="${p.title}" />` : `<div class="ph"><span>${p.title}</span></div>`);

    const itemsHTML = (p.items || []).map((it, i) => `
      <div class="track-row ${it.type === 'view' ? 'view' : ''}" data-idx="${i}">
        <span class="num">${String(i + 1).padStart(2, '0')}</span>
        <button class="playmini" aria-label="${it.type === 'view' ? 'View' : 'Play'}">
          ${it.type === 'view'
        ? `<span>${it.meta || 'VIEW'}</span>`
        : `
              <svg class="icon-play" viewBox="0 0 24 24"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
              <svg class="icon-pause" viewBox="0 0 24 24" style="display:none;"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>
            `
      }
        </button>
        <span class="tname">${it.title}</span>
        <span class="time">${it.meta || ''}</span>
      </div>
    `).join('');

    projV.innerHTML = `
      <div class="project-page">
        <button class="back-link">← BACK</button>
        <header class="proj-head">
          <div class="proj-category">${p.category || 'PROJECT'}</div>
          <h1 class="title">${p.title}</h1>
          ${p.short ? `<p class="proj-short">${p.short}</p>` : ''}
          ${p.description ? `<p class="desc">${p.description}</p>` : ''}
          ${p.moreInfo ? `
            <button class="more-info-toggle"><span class="plus">+</span>MORE INFO</button>
            <div class="more-info-panel"><p>${p.moreInfo}</p></div>
          ` : ''}
        </header>
        <div class="proj-media">
          ${mediaHTML}
        </div>
        ${itemsHTML ? `<div class="track-list">${itemsHTML}</div>` : ''}
        <div class="next-project" data-slug="${nextProj.slug}">
          <span class="lbl">NEXT PROJECT</span>
          <span class="np-title">${nextProj.title} →</span>
        </div>
      </div>
    `;

    projV.querySelector('.back-link').addEventListener('click', () => {
      go(previousView === 'index' ? 'index' : 'space');
    });

    const moreToggle = projV.querySelector('.more-info-toggle');
    if (moreToggle) {
      moreToggle.addEventListener('click', () => {
        const panel = projV.querySelector('.more-info-panel');
        if (panel) panel.classList.toggle('open');
      });
    }

    projV.querySelector('.next-project').addEventListener('click', () => {
      go('project', nextProj.slug);
    });

    projV.querySelectorAll('.track-row').forEach(row => {
      row.addEventListener('click', () => {
        const idx = parseInt(row.dataset.idx, 10);
        const itemData = (p.items || [])[idx];
        if (row.classList.contains('view')) {
          if (itemData && itemData.url) {
            window.open(itemData.url, '_blank', 'noopener,noreferrer');
          }
          return;
        }
        const btn = row.querySelector('.playmini');
        if (!btn) return;
        const iconPlay = btn.querySelector('.icon-play');
        const iconPause = btn.querySelector('.icon-pause');
        const isPlaying = row.classList.contains('is-playing');

        projV.querySelectorAll('.track-row').forEach(r => {
          r.classList.remove('is-playing');
          const p = r.querySelector('.icon-play');
          const pa = r.querySelector('.icon-pause');
          if (p) p.style.display = 'block';
          if (pa) pa.style.display = 'none';
        });

        if (!isPlaying) {
          row.classList.add('is-playing');
          if (iconPlay) iconPlay.style.display = 'none';
          if (iconPause) iconPause.style.display = 'block';
        }
      });
    });
  }

  function setupAboutView() {
    const aboutV = makeView('about');

    // Build Zapf-Humanist Headline
    let headlineHTML = '';
    const hl = SITE.aboutHeadline;
    if (hl && typeof hl === 'object' && hl.line1 && hl.line2) {
      const line1 = `<div class="about-hero-line about-hero-line--1">
        <span class="zapf-display">${hl.line1.name || 'SRIRAM'}</span>
        <span class="about-connector">${hl.line1.connector || 'IS A'}</span>
      </div>`;
      const line2 = `<div class="about-hero-line about-hero-line--2">
        <span class="zapf-display">${hl.line2.role || 'DESIGNER'}</span>
        <span class="about-connector">${hl.line2.connector || 'FOR'}</span>
        <span class="zapf-display">${hl.line2.media || 'ALL MEDIA'}</span>
      </div>`;
      const sublineItems = Array.isArray(hl.subline) ? hl.subline.map(item => `
        <span class="about-connector">${item.connector}</span>
        <span class="zapf-sub-display">${item.text}</span>
      `).join(' ') : '';
      const subline = sublineItems ? `<div class="about-hero-subline">${sublineItems}</div>` : '';
      headlineHTML = line1 + line2 + subline;
    } else if (Array.isArray(hl)) {
      headlineHTML = hl.map(frag => {
        if (typeof frag === 'string') return `<span class="zapf-display">${frag}</span>`;
        return frag.size === 'small'
          ? `<span class="about-connector">${frag.text}</span>`
          : `<span class="zapf-display">${frag.text}</span>`;
      }).join(' ');
    } else {
      headlineHTML = `
        <div class="about-hero-line about-hero-line--1">
          <span class="zapf-display">SRIRAM</span>
          <span class="about-connector">IS A</span>
        </div>
        <div class="about-hero-line about-hero-line--2">
          <span class="zapf-display">DESIGNER</span>
          <span class="about-connector">FOR</span>
          <span class="zapf-display">ALL MEDIA</span>
        </div>
        <div class="about-hero-subline">
          <span class="about-connector">AS WELL AS</span>
          <span class="zapf-sub-display">VIDEO EDITOR</span>
          <span class="about-connector">AND</span>
          <span class="zapf-sub-display">VISUAL CRAFTSMAN</span>
        </div>
      `;
    }

    // Top projects for orbit cards in Section 3
    const orbitSlugs = ['night-ride', 'luminal-hr', 'burnout', 'wheelie-city', 'behind-the-lens', 'reel-2026'];
    const orbitProjects = orbitSlugs.map(slug => PROJECTS.find(p => p.slug === slug)).filter(Boolean);
    const orbitCardsHTML = orbitProjects.map((p, i) => {
      const thumb = p.thumb || (p.media && p.media.src) || '';
      return `
        <div class="about-orbit-card about-orbit-card--${i + 1}" data-slug="${p.slug}" tabindex="0" role="button" aria-label="View project ${p.title}">
          <div class="orbit-card-inner">
            <div class="orbit-card-thumb-wrap">
              <img src="${thumb}" alt="${p.title}" class="orbit-card-img" loading="lazy" />
            </div>
            <div class="orbit-card-meta">
              <span class="orbit-card-num">00${i + 1}</span>
              <span class="orbit-card-title">${p.title}</span>
              <span class="orbit-card-cat">${p.category}</span>
            </div>
          </div>
        </div>
      `;
    }).join('');

    aboutV.innerHTML = `
      <div class="about-page">
        <!-- Vertical Right-Side Section Indicator matching o-about-section-indicator -->
        <div class="o-about-section-indicator" aria-label="Page Sections Navigation">
          <div class="line-wrapper">
            <div class="o-about-section-indicator-item is-active" data-sec-idx="0" role="button" tabindex="0">
              <span class="item-indicator"></span>
              <span class="item-title">ALL MEDIA</span>
            </div>
            <div class="o-about-section-indicator-item" data-sec-idx="1" role="button" tabindex="0">
              <span class="item-indicator"></span>
              <span class="item-title">FOUNDATIONS & RHYTHM</span>
            </div>
            <div class="o-about-section-indicator-item" data-sec-idx="2" role="button" tabindex="0">
              <span class="item-indicator"></span>
              <span class="item-title">INTERFACE ARCHITECTURE</span>
            </div>
            <div class="o-about-section-indicator-item" data-sec-idx="3" role="button" tabindex="0">
              <span class="item-indicator"></span>
              <span class="item-title">DISCIPLINES ORBIT</span>
            </div>
            <div class="o-about-section-indicator-item" data-sec-idx="4" role="button" tabindex="0">
              <span class="item-indicator"></span>
              <span class="item-title">OUTREACH & CONNECT</span>
            </div>
            <div class="current-section-indicator"></div>
          </div>
        </div>

        <!-- Section 0: Fullscreen Hero -->
        <section class="about-section-wrap about-section-wrap--hero" id="about-sec-0">
          <div class="about-bg-layer revealed">
            <img class="about-bg-media" src="${SITE.aboutBg || 'media/about-hero-bg.jpg'}" alt="Sriram MJ Multidisciplinary Designer" />
            <div class="about-bg-vignette"></div>
          </div>
          <div class="about-hero-content">
            <div class="about-hero-headline-wrap">
              <h1 class="about-hero-headline">${headlineHTML}</h1>
            </div>
          </div>
          <div class="about-scroll-hint" role="presentation">
            <span>SCROLL TO EXPLORE</span>
            <div class="scroll-arrow">↓</div>
          </div>
        </section>

        <!-- Section 1: Stepped Typography (Foundations & Rhythm) -->
        <section class="about-section-wrap about-section-wrap--stepped" id="about-sec-1">
          <div class="about-section-inner">
            <div class="about-sec-eyebrow">EARLY CRAFT & PACING</div>
            <div class="stepped-typography" aria-label="SRIRAM BEGAN CRAFTING AND EDITING STORIES FROM DAY ONE">
              <div class="stepped-row step-0"><span class="zapf-step">SRIRAM</span></div>
              <div class="stepped-row step-1"><span class="zapf-step">BEGAN</span></div>
              <div class="stepped-row step-2"><span class="zapf-step">CRAFTING</span></div>
              <div class="stepped-row step-3"><span class="zapf-step">AND EDITING</span></div>
              <div class="stepped-row step-4"><span class="zapf-step">STORIES</span></div>
              <div class="stepped-row step-5"><span class="zapf-step">FROM DAY ONE</span></div>
            </div>
            <div class="about-editorial-text-wrap">
              <p class="about-editorial-p">
                Starting in the high-velocity domain of motorcycle stunt riding and action cinematography, Sriram developed an instinctive intuition for kinetic rhythm, precise cut timing, and atmospheric color grading. Every transition is engineered with sound, momentum, and visceral emotional resonance.
              </p>
            </div>
          </div>
        </section>

        <!-- Section 2: Stepped Typography (Interface Architecture) -->
        <section class="about-section-wrap about-section-wrap--stepped about-section-wrap--interface" id="about-sec-2">
          <div class="about-section-inner">
            <div class="about-sec-eyebrow">SYSTEMATIC INTERACTION DESIGN</div>
            <div class="stepped-typography stepped-typography--alt" aria-label="BRIDGING RAW KINETIC CINEMA WITH SYSTEMATIC DIGITAL ARCHITECTURE">
              <div class="stepped-row step-alt-0"><span class="zapf-step">BRIDGING</span></div>
              <div class="stepped-row step-alt-1"><span class="zapf-step">RAW KINETIC CINEMA</span></div>
              <div class="stepped-row step-alt-2"><span class="zapf-step">WITH SYSTEMATIC</span></div>
              <div class="stepped-row step-alt-3"><span class="zapf-step">DIGITAL ARCHITECTURE</span></div>
            </div>
            <div class="about-editorial-text-wrap">
              <p class="about-editorial-p">
                Translating cinematic motion into cohesive digital experiences. From multi-persona enterprise dashboards like Luminal HR to high-velocity mobile interactions, Sriram approaches product design with systematic rigor — pairing scalable component architectures with fluid, intentional micro-interactions.
              </p>
            </div>
          </div>
        </section>

        <!-- Section 3: Disciplines Orbit (Showcase Cards) -->
        <section class="about-section-wrap about-section-wrap--orbit" id="about-sec-3">
          <div class="about-section-inner about-section-inner--wide">
            <div class="about-sec-eyebrow text-center">DISCIPLINES & SHOWCASE</div>
            <div class="about-orbit-center-statement">
              <h2 class="orbit-lead-text">EDITING, ARCHITECTING, AND CRAFTING ACROSS ALL MEDIA</h2>
              <p class="orbit-sub-text">COMBINING HIGH-OCTANE VIDEO EDITING, SYSTEMIC PRODUCT DESIGN, AND EXPERIMENTAL VISUALS</p>
            </div>
            <div class="about-orbit-grid">
              ${orbitCardsHTML}
            </div>
          </div>
        </section>

        <!-- Section 4: Socials & Outreach -->
        <section class="about-section-wrap about-section-wrap--socials" id="about-sec-4">
          <div class="about-section-inner">
            <div class="about-sec-eyebrow text-center">COLLABORATIONS & OUTREACH</div>
            <div class="about-socials-block">
              <div class="about-socials-lead">FOR</div>
              <div class="about-socials-display">MORE UPDATES</div>
              <div class="about-socials-sub">FOLLOW SRIRAM ON</div>
              <div class="about-socials-row">
                <a href="https://instagram.com/delusional.efx" target="_blank" rel="noopener noreferrer" class="about-social-pill">INSTAGRAM</a>
                <span class="about-social-or">OR</span>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" class="about-social-pill">LINKEDIN</a>
              </div>
              <div class="about-cta-actions">
                <button class="about-action-btn about-action-btn--primary" data-nav="contact">GET IN TOUCH / CONTACT ME →</button>
                <button class="about-action-btn about-action-btn--secondary" data-nav="space">EXPLORE 3D SPACE VIEW ↗</button>
              </div>
            </div>
          </div>
        </section>
      </div>
    `;

    // Interaction & Scroll Sync with o-about-section-indicator
    const sections = aboutV.querySelectorAll('.about-section-wrap');
    const indicator = aboutV.querySelector('.o-about-section-indicator');
    const indicatorItems = indicator ? indicator.querySelectorAll('.o-about-section-indicator-item') : [];
    const currentIndicatorBox = indicator ? indicator.querySelector('.current-section-indicator') : null;

    let activeIdx = 0;
    function setActiveSection(idx) {
      if (idx === activeIdx && indicatorItems[idx] && indicatorItems[idx].classList.contains('is-active')) return;
      activeIdx = idx;
      indicatorItems.forEach((item, i) => {
        if (i === idx) {
          item.classList.add('is-active');
        } else {
          item.classList.remove('is-active');
        }
      });
      if (currentIndicatorBox) {
        currentIndicatorBox.style.transform = `translateY(${idx * 64}px)`;
      }
    }

    // Scroll listener on aboutV container
    let scrollTicking = false;
    aboutV.addEventListener('scroll', () => {
      if (!scrollTicking) {
        requestAnimationFrame(() => {
          const viewRect = aboutV.getBoundingClientRect();
          const viewCenter = viewRect.top + viewRect.height * 0.45;
          let closestIdx = 0;
          let minDistance = Infinity;

          sections.forEach((sec, idx) => {
            const rect = sec.getBoundingClientRect();
            const secCenter = rect.top + rect.height * 0.4;
            const dist = Math.abs(secCenter - viewCenter);
            if (dist < minDistance) {
              minDistance = dist;
              closestIdx = idx;
            }
          });

          setActiveSection(closestIdx);
          scrollTicking = false;
        });
        scrollTicking = true;
      }
    }, { passive: true });

    // Click on indicator tick items
    indicatorItems.forEach(item => {
      item.addEventListener('click', () => {
        const idx = parseInt(item.dataset.secIdx, 10);
        const targetSec = sections[idx];
        if (targetSec) {
          targetSec.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
      item.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          item.click();
        }
      });
    });

    // Orbit card clicks
    aboutV.querySelectorAll('.about-orbit-card').forEach(card => {
      card.addEventListener('click', () => {
        const slug = card.dataset.slug;
        if (slug) go('project', slug);
      });
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          card.click();
        }
      });
    });

    // Outro CTA buttons
    aboutV.querySelectorAll('.about-action-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const target = btn.dataset.nav;
        if (target) go(target);
      });
    });
  }

  function setupContactView() {
    const contactV = makeView('contact');
    const linksHTML = Array.isArray(SITE.contactLinks)
      ? SITE.contactLinks.map(link => {
        const href = link.href || link.url || '#';
        const label = link.label || link.name || 'LINK';
        return `<a href="${href}" target="_blank" rel="noopener noreferrer" class="contact-pill-link">${label}</a>`;
      }).join('')
      : '';

    contactV.innerHTML = `
      <div class="contact-page">
        <div class="contact-hero-wrap">
          <div class="contact-box">
            <div class="contact-eyebrow">CONTACT & COLLABORATIONS</div>
            <h1 class="contact-main-heading">GET IN TOUCH</h1>
            <p class="contact-desc">${SITE.contactText || 'Open for select freelance projects and design leadership roles.'}</p>
            <div class="contact-pills-grid">
              ${linksHTML}
            </div>
          </div>
        </div>
      </div>
    `;
  }

  /* ═══════════════════════════════════════════════════════════════════════════
     7. ROUTING ENGINE
     ═══════════════════════════════════════════════════════════════════════════ */

  function go(viewName, arg) {
    hideCenterDesc();
    if (activeView !== viewName) {
      previousView = activeView;
    }
    activeView = viewName;
    cancelAnimationFrame(animationFrameId);

    const hashTarget = viewName === 'space' ? '#' : `#${viewName}${arg ? '/' + arg : ''}`;
    if (location.hash !== hashTarget && !(viewName === 'space' && (location.hash === '' || location.hash === '#'))) {
      history.pushState(null, '', hashTarget);
    }

    // Toggle scroll permissions
    if (viewName === 'space' || viewName === 'index') {
      document.body.classList.remove('scroll-ok');
    } else {
      document.body.classList.add('scroll-ok');
    }

    // Hide all view containers
    Object.keys(views).forEach(k => {
      if (views[k]) views[k].classList.remove('active');
    });

    // Update nav button active states
    document.querySelectorAll('.footer-nav .nav-btn').forEach(btn => {
      const target = btn.dataset.target;
      if (target === 'space' && (viewName === 'space' || viewName === 'index')) {
        btn.classList.add('active');
      } else if (target === viewName) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    // Update index toggle button state
    const indexToggle = document.querySelector('.index-toggle');
    if (indexToggle) {
      if (viewName === 'space') {
        indexToggle.style.display = 'block';
        indexToggle.classList.add('show');
      } else {
        indexToggle.style.display = 'none';
        indexToggle.classList.remove('show');
      }
    }

    if (viewName === 'space') {
      if (!views.space) setupSpaceView();
      views.space.classList.add('active');
      spaceLoop();
    } else if (viewName === 'index') {
      if (!views.index) setupIndexView();
      views.index.classList.add('active');
    } else if (viewName === 'project') {
      setupProjectView(arg);
      views.project.classList.add('active');
      window.scrollTo(0, 0);
    } else if (viewName === 'about') {
      setupAboutView();
      views.about.classList.add('active');
      views.about.scrollTop = 0;
      window.scrollTo(0, 0);
    } else if (viewName === 'contact') {
      setupContactView();
      views.contact.classList.add('active');
      window.scrollTo(0, 0);
    }
  }

  function routeFromHash() {
    const raw = location.hash.replace('#', '') || 'space';
    const parts = raw.split('/');
    let view = parts[0];
    let arg = parts[1];

    if (view === 'home' || view === 'work') view = 'space';
    if (!['space', 'index', 'project', 'about', 'contact'].includes(view)) {
      view = 'space';
    }
    go(view, arg);
  }

  /* ═══════════════════════════════════════════════════════════════════════════
     8. GLOBAL EVENT LISTENERS & BOOTSTRAP
     ═══════════════════════════════════════════════════════════════════════════ */

  window.addEventListener('mousemove', (e) => {
    const normX = (e.clientX / window.innerWidth) * 2 - 1;
    const normY = (e.clientY / window.innerHeight) * 2 - 1;

    if (lastMouseX !== null && lastMouseY !== null) {
      const dx = e.clientX - lastMouseX;
      const dy = e.clientY - lastMouseY;
      rawMouseSpeed = Math.sqrt(dx * dx + dy * dy);
    }
    lastMouseX = e.clientX;
    lastMouseY = e.clientY;

    targetMouseX = normX;
    targetMouseY = normY;

    clearTimeout(mouseVelTimer);
    mouseVelTimer = setTimeout(() => {
      rawMouseSpeed = 0;
    }, 45);
  });

  window.addEventListener('resize', () => {
    if (activeView === 'space') {
      renderField();
    }
  });

  window.addEventListener('hashchange', routeFromHash);

  /* ═══════════════════════════════════════════════════════════════════════════
     9. CUSTOM TYPOGRAPHIC CURSOR
     Desktop trailing text cursor with per-character inertia
     ═══════════════════════════════════════════════════════════════════════════ */

  function initCustomCursor() {
    const isFinePointer = window.matchMedia('(pointer: fine)').matches && window.matchMedia('(hover: hover)').matches;
    if (!isFinePointer) return;

    const cursorContainer = document.createElement('div');
    cursorContainer.className = 'a-cursor';
    cursorContainer.setAttribute('aria-hidden', 'true');
    document.body.appendChild(cursorContainer);

    let mouseX = -1000;
    let mouseY = -1000;
    let hasMovedMouse = false;
    let currentText = '';
    let isVisible = false;
    let charData = [];

    window.addEventListener('pointermove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      hasMovedMouse = true;
    }, { passive: true });

    function setCursorText(text) {
      if (text === currentText) return;
      currentText = text;

      cursorContainer.innerHTML = '';
      charData = [];

      if (!text) return;

      const measurer = document.createElement('div');
      measurer.className = 'custom-cursor-measurer';

      const chars = Array.from(text);
      const tempSpans = chars.map(ch => {
        const span = document.createElement('span');
        span.className = 'cursor-char';
        span.textContent = ch === ' ' ? '\u00A0' : ch;
        measurer.appendChild(span);
        return span;
      });

      cursorContainer.appendChild(measurer);
      const baseOffsets = tempSpans.map(s => s.offsetLeft);
      cursorContainer.removeChild(measurer);

      chars.forEach((ch, i) => {
        const span = document.createElement('span');
        span.className = 'cursor-char';
        span.textContent = ch === ' ' ? '\u00A0' : ch;
        cursorContainer.appendChild(span);

        const baseOffX = baseOffsets[i] || (i * 8);
        const initX = mouseX + baseOffX + 14;
        const initY = mouseY + 14;

        span.style.transform = `translate3d(${initX.toFixed(2)}px, ${initY.toFixed(2)}px, 0)`;
        span.style.opacity = '0';

        charData.push({
          el: span,
          baseOffsetX: baseOffX,
          x: initX,
          y: initY,
          opacity: 0,
          targetOpacity: isVisible ? 1 : 0
        });
      });
    }

    function showCursor(text) {
      if (!text) {
        hideCursor();
        return;
      }
      if (currentText !== text) {
        setCursorText(text);
      }
      isVisible = true;
      charData.forEach(cd => cd.targetOpacity = 1);
    }

    function hideCursor() {
      isVisible = false;
      charData.forEach(cd => cd.targetOpacity = 0);
    }

    const OFFSET_X = 14;
    const OFFSET_Y = 14;

    function renderCursor() {
      if (hasMovedMouse && charData.length > 0) {
        const totalW = charData.length > 0 ? (charData[charData.length - 1].baseOffsetX + 16) : 0;
        let startX = mouseX + OFFSET_X;
        if (mouseX + totalW + 24 > window.innerWidth) {
          startX = mouseX - totalW - 14;
        }
        let targetBaseY = mouseY + OFFSET_Y;
        if (mouseY + 32 > window.innerHeight) {
          targetBaseY = mouseY - 24;
        }

        charData.forEach((cd, i) => {
          const targetX = startX + cd.baseOffsetX;
          const targetY = targetBaseY;
          const easing = Math.max(0.06, 0.22 * Math.pow(0.86, i));

          cd.x += (targetX - cd.x) * easing;
          cd.y += (targetY - cd.y) * easing;
          cd.opacity += (cd.targetOpacity - cd.opacity) * 0.2;

          cd.el.style.transform = `translate3d(${cd.x.toFixed(2)}px, ${cd.y.toFixed(2)}px, 0)`;
          cd.el.style.opacity = cd.opacity.toFixed(3);
        });
      }

      requestAnimationFrame(renderCursor);
    }

    requestAnimationFrame(renderCursor);

    document.addEventListener('pointerover', (e) => {
      const target = e.target.closest('[data-cursor]');
      if (target) {
        const text = target.getAttribute('data-cursor');
        if (text) showCursor(text);
      }
    }, { passive: true });

    document.addEventListener('pointerout', (e) => {
      const target = e.target.closest('[data-cursor]');
      if (target) {
        const related = e.relatedTarget ? e.relatedTarget.closest('[data-cursor]') : null;
        if (related) {
          const text = related.getAttribute('data-cursor');
          if (text) showCursor(text);
          else hideCursor();
        } else {
          hideCursor();
        }
      }
    }, { passive: true });
  }

  // Initialize on DOM ready
  document.addEventListener('DOMContentLoaded', () => {
    initPersistentChrome();
    initCustomCursor();
    setupSpaceView();
    setupIndexView();
    setupAboutView();
    setupContactView();
    routeFromHash();
  });

})();
