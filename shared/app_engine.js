/* ═══════════════════════════════════════════════════════════════════════════
   PORTFOLIO ENGINE — Shared SPA Router, 3D Space Field & Navigation
   ═══════════════════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  // Global project & site fallback declarations
  const SITE = window.SITE || {};
  const PROJECTS = window.PROJECTS || [];

  // Configuration Constants — Subtle Cinematic 3D Spatial Field
  const CONFIG = {
    STAGE_PERSPECTIVE: 750,        // px, tight 3D perspective field
    CONCAVE_CURVE_STRENGTH: 520,   // px, deep continuous IMAX concave wall depth recession
    PITCH_COEFF: 14,               // deg, pitch tilt along concave curve
    YAW_COEFF: -20,                // deg, strong inward horizontal yaw rotation
    
    // Idle Floating Motion (disabled per user request)
    FLOAT_Y_AMP: 0,
    FLOAT_Y_AMP_2: 0,
    FLOAT_X_AMP: 0,
    FLOAT_Z_AMP: 0,
    FLOAT_RX_AMP: 0,
    FLOAT_RY_AMP: 0,
    FLOAT_RZ_AMP: 0,
    FLOAT_FREQ: 0,

    MOBILE_MOTION_SCALE: { dome: 0.5, float: 0.0 },
    MOBILE_TILE_SCALE: 0.38,
    DESKTOP_TILE_SCALE: 0.46,

    // Hover Interaction Timing (Fast responsive activation)
    HOVER_INTENT_DELAY: 40,        // ms
    HOVER_TOUCH_DELAY: 40,         // ms
    HOVER_EXIT_DELAY: 60,          // ms
    TILE_HOVER_TRANSITION_MS: 320,

    TILE_REST_OPACITY: 0.48,
    TILE_REST_BRIGHTNESS: 0.40,
    TILE_REST_SATURATE: 0.68,
    TILE_REST_BLUR_PX: 1.2,
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
      audioInstance = new Audio('./media/ambient.mp3');
      audioInstance.loop = true;
      audioInstance.volume = 0.4;
    }
    audioInstance.play().then(() => {
      isAudioPlaying = true;
      localStorage.setItem('portfolio_audio', 'enabled');
      updateAudioUI();
    }).catch(err => {
      if (userInitiated) console.warn('Audio playback blocked:', err);
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
     2. 3D FIELD LAYOUT (Explicit Tiered Z-Depth translateZ Positions)
     ═══════════════════════════════════════════════════════════════════════════ */

  const LAYOUT = [
    // 0. LARGE TILE (~6% class, 1 per viewport — Tall vertical background anchor e.g. 335x397px)
    { x: -92, y: -45, sizeClass: 'large',  w: 335, h: 397, rx: 2.5, ry: -3.8, rz: -2.2, zPx: 310, distType: 'bow-center' },

    // 1-4. MEDIUM TILES (~29% class — 240-335px wide)
    { x: -22, y: -38, sizeClass: 'medium', w: 290, h: 185, rx: -2.1, ry: 2.4,  rz: 1.8,  zPx: 120, distType: 'bow-center' },
    { x: 36,  y: -48, sizeClass: 'medium', w: 275, h: 175, rx: -3.2, ry: 3.6,  rz: 2.1,  zPx: 180, distType: 'bow-center' },
    { x: -32, y: 14,  sizeClass: 'medium', w: 310, h: 200, rx: 1.8,  ry: -2.2, rz: -1.4, zPx: 240, distType: 'bow-center' },
    { x: 6,   y: 10,  sizeClass: 'medium', w: 320, h: 195, rx: -2.4, ry: 2.1,  rz: 1.2,  zPx: 190, distType: 'bow-center' },

    // 5-15. SMALL TILES (~65% majority class — 70-190px wide portrait/landscape)
    { x: 52,  y: -26, sizeClass: 'small',  w: 145, h: 95,  rx: 3.1,  ry: -2.8, rz: -1.9, zPx: -40, distType: 'bow-center' },
    { x: 62,  y: 8,   sizeClass: 'small',  w: 165, h: 110, rx: -1.9, ry: 2.5,  rz: 1.5,  zPx: 80,  distType: 'bow-center' },
    { x: -54, y: 46,  sizeClass: 'small',  w: 130, h: 185, rx: 3.4,  ry: -3.6, rz: -2.1, zPx: 140, distType: 'bow-center' },
    { x: -8,  y: 62,  sizeClass: 'small',  w: 155, h: 105, rx: -1.2, ry: 1.4,  rz: 0.8,  zPx: -140, distType: 'bow-center' },
    { x: 48,  y: 64,  sizeClass: 'small',  w: 170, h: 170, rx: 2.2,  ry: -2.1, rz: -1.2, zPx: 60,  distType: 'bow-center' },
    { x: 102, y: -16, sizeClass: 'small',  w: 180, h: 120, rx: -2.8, ry: 4.2,  rz: 2.4,  zPx: 260, distType: 'bow-center' },
    { x: -68, y: 86,  sizeClass: 'small',  w: 140, h: 90,  rx: 2.1,  ry: -2.9, rz: -1.5, zPx: -220, distType: 'bow-center' },
    { x: -78, y: -18, sizeClass: 'small',  w: 160, h: 105, rx: -2.4, ry: 3.1,  rz: 1.7,  zPx: -180, distType: 'bow-center' },
    { x: 18,  y: -72, sizeClass: 'small',  w: 135, h: 90,  rx: 1.9,  ry: -2.1, rz: -1.1, zPx: -260, distType: 'bow-center' },
    { x: -42, y: -78, sizeClass: 'small',  w: 150, h: 100, rx: -2.6, ry: 2.8,  rz: 1.4,  zPx: -320, distType: 'bow-center' },
    { x: 82,  y: 44,  sizeClass: 'small',  w: 125, h: 175, rx: 2.8,  ry: -3.2, rz: -1.8, zPx: -120, distType: 'bow-center' }
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
     4. RENDER SPACE FIELD & HOVER INTENT SYSTEM
     ═══════════════════════════════════════════════════════════════════════════ */

  function setCaptionState(isCaptionVisible, proj) {
    const heroCopy = document.getElementById('heroCopy');
    const indexToggle = document.querySelector('.index-toggle');
    const heroMeta = document.getElementById('heroMeta');
    const heroTitle = document.getElementById('heroTitle');
    const heroDesc = document.getElementById('heroDesc');

    if (isCaptionVisible && proj) {
      if (heroMeta) heroMeta.textContent = 'LEARN MORE';
      if (heroTitle) heroTitle.textContent = proj.title || '';
      if (heroDesc) heroDesc.textContent = proj.description || proj.short || '';
      if (heroCopy) heroCopy.classList.add('hover-active');
      if (indexToggle) indexToggle.classList.add('hide-on-hover');
      document.body.classList.add('caption-active');
    } else {
      if (heroCopy) heroCopy.classList.remove('hover-active');
      if (indexToggle) indexToggle.classList.remove('hide-on-hover');
      document.body.classList.remove('caption-active');
    }
  }

  function renderField() {
    if (!field) return;
    field.style.display = 'block';
    field.innerHTML = '';

    const isMobile = window.innerWidth < 768;
    const tileScale = isMobile ? CONFIG.MOBILE_TILE_SCALE : CONFIG.DESKTOP_TILE_SCALE;
    const totalSlots = Math.min(LAYOUT.length, PROJECTS.length);

    for (let i = 0; i < totalSlots; i++) {
      const pos = LAYOUT[i];
      const proj = PROJECTS[i] || {};
      
      const tile = document.createElement('div');
      tile.className = `tile ${pos.sizeClass || 'medium'} distort-${pos.distType || 'bow-center'}`;
      tile.dataset.slug = proj.slug || '';
      tile.dataset.x = pos.x;
      tile.dataset.y = pos.y;
      tile.dataset.zpx = pos.zPx;
      tile.dataset.depth = pos.depth || 0.5;
      tile.dataset.rx = pos.rx || 0;
      tile.dataset.ry = pos.ry || 0;
      tile.dataset.rz = pos.rz || 0;
      tile.dataset.index = i;
      tile.setAttribute('data-cursor', 'Learn More');
      if (pos.x > 0) tile.setAttribute('data-x-pos', 'right');

      // Initial viewport position positioning (prevents (0,0) top-left flash)
      const halfW = window.innerWidth / 2;
      const halfH = window.innerHeight / 2;
      const leftPx = halfW + (pos.x / 100) * halfW;
      const topPx = halfH + (pos.y / 100) * halfH;

      tile.style.left = `${leftPx.toFixed(1)}px`;
      tile.style.top = `${topPx.toFixed(1)}px`;

      // Explicit 3D Z-index stacking
      tile.style.zIndex = Math.round((pos.zPx + 2000) / 10);

      // Tile dimensions
      const finalW = Math.round((pos.w || 220) * tileScale);
      tile.style.setProperty('--tile-w', `${finalW}px`);

      const mediaHTML = getTileMedia(proj, i);

      tile.innerHTML = `
        <div class="frame">
          ${mediaHTML}
        </div>
      `;

      // Intent-based hover event handling
      tile.addEventListener('mouseenter', (e) => {
        clearTimeout(hoverExitTimer);
        const delay = e.pointerType === 'touch' ? CONFIG.HOVER_TOUCH_DELAY : CONFIG.HOVER_INTENT_DELAY;
        
        hoverIntentTimer = setTimeout(() => {
          activeHoveredTile = tile;
          const targetSlug = tile.dataset.slug;
          
          // Highlight cluster of related tiles
          field.querySelectorAll('.tile').forEach(t => {
            if (t.dataset.slug === targetSlug) {
              t.classList.add('is-hovered');
            } else {
              t.classList.remove('is-hovered');
            }
          });

          // Atomic 1:1 state change — caption visible -> index toggle hidden
          setCaptionState(true, proj);
        }, delay);
      });

      tile.addEventListener('mouseleave', () => {
        clearTimeout(hoverIntentTimer);
        hoverExitTimer = setTimeout(() => {
          if (activeHoveredTile === tile) {
            activeHoveredTile = null;
          }
          field.querySelectorAll('.tile').forEach(t => t.classList.remove('is-hovered'));

          // Atomic 1:1 state change — caption hidden -> index toggle restored
          setCaptionState(false);
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

  /* Precise 3D Spatial Hit-Testing Engine for Overlapping Back Tiles */
  document.addEventListener('pointermove', (e) => {
    if (activeView !== 'space' || !field) return;

    // Use GPU elementFromPoint hit testing to find exact visible element under cursor
    const hitElement = document.elementFromPoint(e.clientX, e.clientY);
    const hitTile = hitElement ? hitElement.closest('.tile') : null;

    if (hitTile) {
      if (activeHoveredTile !== hitTile) {
        clearTimeout(hoverExitTimer);
        clearTimeout(hoverIntentTimer);

        hoverIntentTimer = setTimeout(() => {
          activeHoveredTile = hitTile;
          const targetSlug = hitTile.dataset.slug;

          field.querySelectorAll('.tile').forEach(t => {
            if (t.dataset.slug === targetSlug) {
              t.classList.add('is-hovered');
            } else {
              t.classList.remove('is-hovered');
            }
          });

          const proj = PROJECTS.find(p => p.slug === targetSlug);
          setCaptionState(true, proj);
        }, 20);
      }
    } else if (activeHoveredTile) {
      clearTimeout(hoverIntentTimer);
      clearTimeout(hoverExitTimer);
      hoverExitTimer = setTimeout(() => {
        activeHoveredTile = null;
        field.querySelectorAll('.tile').forEach(t => t.classList.remove('is-hovered'));
        setCaptionState(false);
      }, CONFIG.HOVER_EXIT_DELAY);
    }
  });

  /* ═══════════════════════════════════════════════════════════════════════════
     5. 3D CONCAVE SPACE ANIMATION LOOP (1800R Concave Projection Surface)
     ═══════════════════════════════════════════════════════════════════════════ */

  let fieldRotX = 0;
  let fieldRotY = 0;

  function spaceLoop() {
    if (activeView !== 'space') return;

    const isMobile = window.innerWidth < 768;
    
    // Subtle camera panning across continuous concave spatial wall
    const targetCamX = isMobile ? 0 : targetMouseX * 420;
    const targetCamY = isMobile ? 0 : targetMouseY * 260;
    const targetRotY = isMobile ? 0 : targetMouseX * 3;
    const targetRotX = isMobile ? 0 : -targetMouseY * 2;

    cameraX += (targetCamX - cameraX) * 0.07;
    cameraY += (targetCamY - cameraY) * 0.07;
    fieldRotY += (targetRotY - fieldRotY) * 0.07;
    fieldRotX += (targetRotX - fieldRotX) * 0.07;

    if (field) {
      field.style.transform = `translate3d(${-cameraX.toFixed(1)}px, ${-cameraY.toFixed(1)}px, 0px) rotateX(${fieldRotX.toFixed(2)}deg) rotateY(${fieldRotY.toFixed(2)}deg)`;
    }

    // Smoothly interpolate cursor velocity for subtle motion blur (max ~2.5px during cursor movement, decaying to 0px at rest)
    smoothMouseSpeed += (rawMouseSpeed - smoothMouseSpeed) * 0.12;
    if (smoothMouseSpeed < 0.05) smoothMouseSpeed = 0;
    const motionBlurPx = Math.min(smoothMouseSpeed * 0.05, 2.5);

    const time = performance.now() * CONFIG.FLOAT_FREQ;

    if (field) {
      const halfW = window.innerWidth / 2;
      const halfH = window.innerHeight / 2;
      const hasActiveHover = !!activeHoveredTile;

      field.querySelectorAll('.tile').forEach((t, i) => {
        const posX = isNaN(parseFloat(t.dataset.x)) ? 0 : parseFloat(t.dataset.x);
        const posY = isNaN(parseFloat(t.dataset.y)) ? 0 : parseFloat(t.dataset.y);
        const baseZ = isNaN(parseFloat(t.dataset.zpx)) ? 0 : parseFloat(t.dataset.zpx);
        
        const baseRx = isNaN(parseFloat(t.dataset.rx)) ? 0 : parseFloat(t.dataset.rx);
        const baseRy = isNaN(parseFloat(t.dataset.ry)) ? 0 : parseFloat(t.dataset.ry);
        const baseRz = isNaN(parseFloat(t.dataset.rz)) ? 0 : parseFloat(t.dataset.rz);

        // Absolute viewport center positioning (100% static at rest)
        const leftPx = halfW + (posX / 100) * halfW;
        const topPx = halfH + (posY / 100) * halfH;

        t.style.left = `${leftPx.toFixed(1)}px`;
        t.style.top = `${topPx.toFixed(1)}px`;

        // Normalized spread
        const normX = posX / 100;
        const normY = posY / 80;

        // ═══════════════════════════════════════════════════════════════════════════
        // TWO-LAYER CURVE ENGINE (Per-Tile Independent Scatter + Whole-Field Concave Arc)
        // ═══════════════════════════════════════════════════════════════════════════

        const isHovered = t.classList.contains('is-hovered');
        const hoverScale = isHovered ? 1.04 : 1.0;

        // LAYER 2: Whole-field concave arc (subtle collective lean toward center near edges)
        const concaveZ = - (normX * normX) * CONFIG.CONCAVE_CURVE_STRENGTH - (normY * normY) * (CONFIG.CONCAVE_CURVE_STRENGTH * 0.35);
        const cylZ = baseZ + concaveZ;

        // Position-based concave adjustment LAYERED ON TOP of same tile's independent rotation
        const cylRotY = baseRy + (normX * CONFIG.YAW_COEFF);   // Inward horizontal lean added to baseRy
        const cylRotX = baseRx + (-normY * CONFIG.PITCH_COEFF); // Inward vertical tilt added to baseRx
        const cylRotZ = baseRz;                                 // Preserved independent scatter angle

        // Depth-based opacity: Far (0.28-0.42), Mid (0.45-0.68), Near (0.70-0.88), Hovered (1.0)
        const normZ = Math.max(0, Math.min(1, (baseZ + 600) / 750));
        const depthOpacity = 0.28 + normZ * 0.54;
        t.style.opacity = isHovered ? '1.0' : depthOpacity.toFixed(2);

        // Dynamic unique z-index: Derived directly from exact computed 3D depth (cylZ) + index tie-breaker
        const uniqueStackIndex = Math.round((cylZ + 2000) * 10) + i;
        t.style.zIndex = isHovered ? 9999 : uniqueStackIndex;

        // Dynamic motion blur & drop shadow
        const activeBlur = isHovered ? 0 : motionBlurPx;
        t.style.filter = isHovered
          ? 'brightness(1.0) saturate(1.0) blur(0px) drop-shadow(0px 14px 32px rgba(0,0,0,0.85))'
          : `brightness(${CONFIG.TILE_REST_BRIGHTNESS}) saturate(${CONFIG.TILE_REST_SATURATE}) blur(${activeBlur.toFixed(2)}px) drop-shadow(0px 10px 24px rgba(0,0,0,0.45))`;

        // 3D transform combining Layer 1 independent rotation + Layer 2 whole-field concave arc + hover scale
        t.style.transform = `translate(-50%,-50%) translate3d(0px, 0px, ${cylZ.toFixed(1)}px) rotateX(${cylRotX.toFixed(2)}deg) rotateY(${cylRotY.toFixed(2)}deg) rotateZ(${cylRotZ.toFixed(2)}deg) scale(${hoverScale})`;
      });
    }

    // Direct mathematical function: index-toggle visibility is bound 1:1 to heroCopy caption visibility
    const heroCopyEl = document.getElementById('heroCopy');
    const indexToggleEl = document.querySelector('.index-toggle');
    if (indexToggleEl && heroCopyEl) {
      const isCaptionVisible = heroCopyEl.classList.contains('hover-active');
      indexToggleEl.classList.toggle('hide-on-hover', isCaptionVisible);
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
      appContainer.appendChild(v);
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
      <div class="hero-copy fade" id="heroCopy" aria-live="polite">
        <span class="small" id="heroMeta">VIEW PROJECT</span>
        <h2 class="big" id="heroTitle">PROJECT TITLE</h2>
        <p class="desc" id="heroDesc">Project Description</p>
      </div>
    `;
    stage = spaceV.querySelector('.home-stage');
    if (stage) {
      stage.style.perspective = `${CONFIG.STAGE_PERSPECTIVE}px`;
      stage.style.setProperty('--stage-perspective', `${CONFIG.STAGE_PERSPECTIVE}px`);
    }
    field = spaceV.querySelector('#field');
    renderField();
  }

  function setupIndexView() {
    const indexV = makeView('index');
    indexV.innerHTML = `
      <div class="index-bg" id="indexBg"></div>
      <div class="index-page-inner">
        <div class="index-close-bar">
          <button class="index-close-btn" aria-label="Return to 3D Space View">✕ SPACE VIEW</button>
        </div>
        <div class="index-list">
          ${PROJECTS.map((p, i) => {
            const bgMedia = p.thumb || (p.media ? p.media.src : '');
            return `
              <div class="row" data-slug="${p.slug}" data-bg="${bgMedia}" data-cursor="Open" role="button" tabindex="0" aria-label="Open project ${p.title}">
                <span class="n">${String(i + 1).padStart(2, '0')}</span>
                <span class="name">${p.title}</span>
                <span class="cat">${p.category || 'DESIGN'}</span>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;

    const indexBg = indexV.querySelector('#indexBg');
    const closeBtn = indexV.querySelector('.index-close-btn');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => go('space'));
    }

    // Row hover background preview — centered behind hovered row spanning ~3 rows
    indexV.querySelectorAll('.row[data-slug]').forEach(row => {
      row.addEventListener('mouseenter', () => {
        const bgSrc = row.dataset.bg;
        if (!bgSrc) return;

        const rect = row.getBoundingClientRect();
        const rowCenterY = rect.top + rect.height / 2;

        indexBg.innerHTML = `<img src="${bgSrc}" class="index-bg-media visible" alt="Preview" />`;
        const mediaEl = indexBg.querySelector('.index-bg-media');
        if (mediaEl) {
          mediaEl.style.top = `${rowCenterY.toFixed(1)}px`;
        }
        indexBg.classList.add('show');
      });

      row.addEventListener('mouseleave', () => {
        indexBg.classList.remove('show');
      });

      row.addEventListener('click', () => {
        go('project', row.dataset.slug);
      });
    });
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
        const btn = row.querySelector('.playmini');
        if (!btn || row.classList.contains('view')) return;
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
    let headlineHTML = '';
    if (Array.isArray(SITE.aboutHeadline)) {
      headlineHTML = SITE.aboutHeadline.map(frag => {
        if (typeof frag === 'string') return `<span class="about-frag about-frag--large">${frag}</span>`;
        return `<span class="about-frag about-frag--${frag.size || 'large'}">${frag.text}</span>`;
      }).join(' ');
    } else {
      headlineHTML = `<span class="about-frag about-frag--large">${SITE.aboutHeadline || SITE.aboutText || 'PRODUCT & VISUAL DESIGNER'}</span>`;
    }

    let toolsHTML = '';
    if (Array.isArray(SITE.aboutTools)) {
      toolsHTML = SITE.aboutTools.map(item => {
        if (typeof item === 'string') {
          return `<div class="about-tools-column"><div class="about-tools-disc">${item}</div></div>`;
        }
        const toolsList = (item.tools || []).map(t => `<li>${t}</li>`).join('');
        return `
          <div class="about-tools-column">
            <div class="about-tools-disc">${item.discipline || ''}</div>
            <ul class="about-tools-list">${toolsList}</ul>
          </div>
        `;
      }).join('');
    }

    aboutV.innerHTML = `
      <div class="about-page">
        <section class="about-section about-section--hero">
          <div class="about-bg-layer ${SITE.aboutBg ? 'revealed' : ''}">
            ${SITE.aboutBg ? (
              SITE.aboutBgType === 'video'
                ? `<video class="about-bg-media" src="${SITE.aboutBg}" autoplay loop muted playsinline></video>`
                : `<img class="about-bg-media" src="${SITE.aboutBg}" alt="About background" />`
            ) : `<div class="about-bg-ph"><span>${SITE.name || 'PORTFOLIO'}</span><span class="about-bg-ph-hint">${SITE.role || ''}</span></div>`}
          </div>
          <div class="about-headline-wrap">
            <h1 class="about-headline">${headlineHTML}</h1>
          </div>
        </section>
        ${SITE.aboutIntro ? `
          <section class="about-section">
            <div class="about-section-inner">
              <div class="as-eyebrow">APPROACH & INTRO</div>
              <p class="about-intro-text">${SITE.aboutIntro}</p>
            </div>
          </section>
        ` : ''}
        ${toolsHTML ? `
          <section class="about-section">
            <div class="about-section-inner">
              <div class="as-eyebrow">DISCIPLINES & TOOLS</div>
              <div class="about-tools-grid">${toolsHTML}</div>
            </div>
          </section>
        ` : ''}
        ${SITE.aboutBio ? `
          <section class="about-section about-section--bio">
            <div class="about-section-inner">
              <div class="as-eyebrow">BIOGRAPHY</div>
              <p class="about-bio-text">${SITE.aboutBio}</p>
            </div>
          </section>
        ` : ''}
      </div>
    `;
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

  // Initialize on DOM ready
  document.addEventListener('DOMContentLoaded', () => {
    initPersistentChrome();
    setupSpaceView();
    setupIndexView();
    setupAboutView();
    setupContactView();
    routeFromHash();
  });

})();
