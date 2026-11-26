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

    STAGE_PERSPECTIVE: 1150,       // px, expansive 3D camera perspective field
    CONCAVE_CURVE_STRENGTH: 160,   // px, subtle concave fisheye depth
    PITCH_COEFF: 5.5,              // deg, gentle pitch tilt along concave curve
    YAW_COEFF: -14.0,              // deg, inverted yaw rotation matching reference
    
    // Hover Interaction Timing
    HOVER_INTENT_DELAY: 25,        // ms
    HOVER_TOUCH_DELAY: 25,         // ms
    HOVER_EXIT_DELAY: 60,          // ms

    TILE_REST_BRIGHTNESS: 0.92,
    TILE_REST_SATURATE: 1.00,
  };

  // State Management
  let activeView = 'intro';
  let previousView = 'intro';
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

  // Panoramic canvas pan & drag navigation engine
  let panX = 0;
  let panY = 0;
  let targetPanX = 0;
  let targetPanY = 0;
  let panVelocityX = 0;
  let panVelocityY = 0;
  let isPointerDown = false;
  let isPointerDragging = false;
  let dragStartX = 0;
  let dragStartY = 0;
  let lastDragX = 0;
  let lastDragY = 0;
  let dragDistance = 0;

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
    brand.addEventListener('click', () => go('intro'));
    brand.style.cursor = 'pointer';
    brand.style.pointerEvents = 'auto';
    brand.setAttribute('data-cursor', 'Intro');
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
        <button class="nav-btn ${activeView === 'intro' ? 'active' : ''}" data-target="intro">${SITE.navIntro || 'INTRO'}</button>
        <span class="joiner">·</span>
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
    if (soundToggle) {
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

    const introAudioBtn = document.querySelector('#introAudioBtn');
    if (introAudioBtn) {
      introAudioBtn.classList.toggle('is-playing', isAudioPlaying);
      const textEl = introAudioBtn.querySelector('.intro-audio-text');
      const introData = SITE.intro || {};
      if (textEl) {
        textEl.textContent = isAudioPlaying ? 'SOUND PLAYING ♫' : (introData.soundPrompt || 'SOUND EXPERIENCE');
      }
    }
  }

  /* ═══════════════════════════════════════════════════════════════════════════
     2. 3D FIELD LAYOUT — Mapped within reference 5760x3100 space view canvas
     ═══════════════════════════════════════════════════════════════════════════ */

  const LAYOUT = [
    // Slot 1 (TNE Hero Portrait — Right Flank, like Pig in Michael Gatt reference)
    { slot: 1,  x: 380,   y: 70,   w: 265, h: 410, zPx: 80,   rx: 0.6,  ry: 0,   rz: -0.8, sizeClass: 'large' },
    // Slot 2 (Wheelie City — Far Upper-Left edge still, like Shark in reference)
    { slot: 2,  x: -1080, y: -300, w: 290, h: 190, zPx: 20,   rx: -1.6, ry: 0,   rz: 0.8,  sizeClass: 'medium' },
    // Slot 3 (Burnout — Far Upper-Right edge still, like Car in reference right view)
    { slot: 3,  x: 1080,  y: -230, w: 290, h: 190, zPx: 30,   rx: -1.8, ry: 0,   rz: -0.8, sizeClass: 'medium' },
    // Slot 4 (Behind The Lens — Lower-Left feature still, like Batman in reference)
    { slot: 4,  x: -560,  y: 270,  w: 310, h: 205, zPx: 60,   rx: 1.5,  ry: 0,   rz: 0.8,  sizeClass: 'medium' },
    // Slot 5 (Reel 2026 — Mid-Right lower flank)
    { slot: 5,  x: 1320,  y: 240,  w: 280, h: 185, zPx: 40,   rx: 1.5,  ry: 0,   rz: -0.8, sizeClass: 'medium' },
    // Slot 6 (Luminal HR — Upper-Right peeking accent, tucked behind Pig like Joker in reference)
    { slot: 6,  x: 540,   y: -160, w: 185, h: 135, zPx: -50,  rx: 0.8,  ry: 0,   rz: -0.8, sizeClass: 'small' },
    // Slot 7 (HR Admin Flow — Mid-Right upper flank)
    { slot: 7,  x: 1560,  y: -320, w: 240, h: 160, zPx: -70,  rx: -1.8, ry: 0,   rz: 0.8,  sizeClass: 'small' },
    // Slot 8 (Manager Flow — Mid-Left flank)
    { slot: 8,  x: -1420, y: 180,  w: 240, h: 160, zPx: -50,  rx: 1.2,  ry: 0,   rz: -1.0, sizeClass: 'small' },
    // Slot 9 (Employee Flow — Mid-Left upper flank)
    { slot: 9,  x: -1550, y: -260, w: 230, h: 155, zPx: -80,  rx: -1.5, ry: 0,   rz: -0.8, sizeClass: 'small' },
    // Slot 10 (Hero Portrait Left / Poster Series)
    { slot: 10, x: -1850, y: -20,  w: 260, h: 420, zPx: 70,   rx: 0.8,  ry: 0,   rz: -1.0, sizeClass: 'large' },
    // Slot 11 (Brand Identity — Top-Center distant accent, like Building in reference)
    { slot: 11, x: -140,  y: -390, w: 220, h: 150, zPx: -190, rx: -1.5, ry: 0,   rz: 0.5,  sizeClass: 'small' },
    // Slot 12 (Illustration Set — Mid-Left outer upper)
    { slot: 12, x: -2120, y: -340, w: 230, h: 155, zPx: -120, rx: -1.5, ry: 0,   rz: 1.0,  sizeClass: 'small' },
    // Slot 13 (Cinema Stills — Far-Left lower wing)
    { slot: 13, x: -2350, y: 300,  w: 230, h: 155, zPx: -140, rx: 1.8,  ry: 0,   rz: -1.0, sizeClass: 'small' },
    // Slot 14 (Interface Craft — Far-Left mid wing)
    { slot: 14, x: -2600, y: -60,  w: 220, h: 150, zPx: -180, rx: 0.0,  ry: 0,   rz: 1.0,  sizeClass: 'small' },
    // Slot 15 (Editorial Layout — Far-Left upper wing)
    { slot: 15, x: -2850, y: -340, w: 220, h: 150, zPx: -210, rx: -1.8, ry: 0,   rz: 0.8,  sizeClass: 'small' },
    // Slot 16 (Motion Graphics — Under-Center dark still, like Dragon in reference)
    { slot: 16, x: -30,   y: 380,  w: 310, h: 200, zPx: 10,   rx: 1.6,  ry: 0,   rz: -0.5, sizeClass: 'medium' },
    // Slot 17 (Hero Right Still / TNE Precision Cut)
    { slot: 17, x: 1750,  y: -10,  w: 270, h: 180, zPx: 40,   rx: 0.6,  ry: 0,   rz: -0.8, sizeClass: 'medium' },
    // Slot 18 (Night Drift — Upper-Right mid flank)
    { slot: 18, x: 1860,  y: -300, w: 260, h: 175, zPx: -40,  rx: -1.6, ry: 0,   rz: -1.0, sizeClass: 'medium' },
    // Slot 19 (Stunt Telemetry HUD — Mid-Left peeking still, like Darkseid in reference)
    { slot: 19, x: -680,  y: -80,  w: 260, h: 175, zPx: 30,   rx: 0.5,  ry: 0,   rz: 0.8,  sizeClass: 'small' },
    // Slot 20 (Urban Velocity — Far-Left deep ceiling)
    { slot: 20, x: -1720, y: -480, w: 210, h: 140, zPx: -150, rx: -2.0, ry: 0,   rz: -0.8, sizeClass: 'small' },
    // Slot 21 (Sound Design Lab — Mid-Right mid flank)
    { slot: 21, x: 2050,  y: 120,  w: 240, h: 160, zPx: -60,  rx: -0.5, ry: 0,   rz: -0.8, sizeClass: 'small' },
    // Slot 22 (Aperture Study — Far-Right upper wing)
    { slot: 22, x: 2320,  y: -320, w: 230, h: 155, zPx: -130, rx: -1.8, ry: 0,   rz: 1.0,  sizeClass: 'small' },
    // Slot 23 (Chromatic Flow — Far-Right lower wing)
    { slot: 23, x: 2420,  y: 340,  w: 230, h: 155, zPx: -140, rx: 1.8,  ry: 0,   rz: -1.0, sizeClass: 'small' },
    // Slot 24 (Slow-Mo Mechanics — Under-Center delicate accent, like Minion in reference)
    { slot: 24, x: -45,   y: 165,  w: 90,   h: 125, zPx: -90,  rx: 0.5,  ry: 0,   rz: 0.5,  sizeClass: 'small' },
    // Slot 25 (Telemetry Dashboard — Mid-Right outer lower)
    { slot: 25, x: 2680,  y: 180,  w: 220, h: 150, zPx: -170, rx: 1.2,  ry: 0,   rz: -0.8, sizeClass: 'small' },
    // Slot 26 (Atmospheric Foley — Far-Right mid wing)
    { slot: 26, x: 2920,  y: -70,  w: 210, h: 140, zPx: -200, rx: 0.0,  ry: 0,   rz: -1.0, sizeClass: 'small' },
    // Slot 27 (Street Optics — Far-Left deep horizon)
    { slot: 27, x: -3100, y: 150,  w: 200, h: 135, zPx: -240, rx: 1.0,  ry: 0,   rz: 0.5,  sizeClass: 'small' },
    // Slot 28 (Lighting Architecture — Far-Right deep ceiling)
    { slot: 28, x: 3150,  y: -260, w: 200, h: 135, zPx: -230, rx: -1.5, ry: 0,   rz: 0.8,  sizeClass: 'small' },
    // Slot 29 (Kinetic Titles — Far-Right deep floor)
    { slot: 29, x: 3350,  y: 220,  w: 190, h: 130, zPx: -250, rx: 1.5,  ry: 0,   rz: -0.8, sizeClass: 'small' },
    // Slot 30 (Raw Velocity — Mid-Right foreground accent)
    { slot: 30, x: 1880,  y: 260,  w: 260, h: 175, zPx: 50,   rx: 1.0,  ry: 0,   rz: -0.8, sizeClass: 'medium' }
  ];

  /* ═══════════════════════════════════════════════════════════════════════════
     3. TILE MEDIA GENERATOR
     ═══════════════════════════════════════════════════════════════════════════ */

  /* Helper to retrieve 3D space tiles:
     Renders individual images from the project groups in window.PROJECTS (each project containing title, description, category, images[]).
     Supports slot assignment (1 to 30) or sequential layout, and falls back to window.SPACE_TILES or PROJECTS if images[] is omitted. */
  function getSpaceTiles() {
    const collectedFromProjects = [];
    PROJECTS.forEach(proj => {
      if (Array.isArray(proj.images) && proj.images.length > 0) {
        proj.images.forEach(img => {
          const imgSrc = typeof img === 'string' ? img : (img.src || img.thumb || img.image || '');
          const imgObj = typeof img === 'object' && img !== null ? img : {};
          collectedFromProjects.push({
            ...imgObj,
            id: imgObj.id || (collectedFromProjects.length + 1),
            thumb: imgSrc,
            src: imgSrc,
            targetSlug: proj.slug,
            projectSlug: proj.slug,
            projectTitle: proj.title,
            projectDesc: proj.description || proj.short,
            projectCategory: proj.category
          });
        });
      }
    });

    if (collectedFromProjects.length > 0) {
      const maxSlots = Math.max(collectedFromProjects.length, 30);
      const slotted = new Array(maxSlots);
      const unslotted = [];

      collectedFromProjects.forEach(tile => {
        if (typeof tile.slot === 'number' && tile.slot >= 1 && tile.slot <= maxSlots && !slotted[tile.slot - 1]) {
          slotted[tile.slot - 1] = tile;
        } else {
          unslotted.push(tile);
        }
      });

      let unslottedIdx = 0;
      for (let i = 0; i < maxSlots; i++) {
        if (!slotted[i] && unslottedIdx < unslotted.length) {
          slotted[i] = unslotted[unslottedIdx++];
        }
      }
      return slotted.filter(Boolean);
    }

    if (window.SPACE_TILES && Array.isArray(window.SPACE_TILES) && window.SPACE_TILES.length > 0) {
      return window.SPACE_TILES;
    }

    return PROJECTS;
  }

  /* Helper to retrieve Index View projects: only primary description titles (not tile-only / targetSlug items) */
  function getIndexProjects() {
    return PROJECTS.filter(p => !p.isTileOnly && !p.targetSlug);
  }

  /* ═══════════════════════════════════════════════════════════════════════════
     3. TILE MEDIA GENERATOR
     ═══════════════════════════════════════════════════════════════════════════ */

  function getTileMedia(proj, index) {
    if (!proj) return '';
    const src = proj.thumb || proj.image || proj.src || (proj.media && proj.media.src) || '';
    const isVideo = proj.thumbType === 'video' || proj.type === 'video' || (proj.media && proj.media.type === 'video') || (typeof src === 'string' && src.endsWith('.mp4'));

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

    // Resolve connected primary description title project
    const targetSlug = proj.targetSlug || proj.targetProject || proj.project || proj.slug || '';
    const targetProj = PROJECTS.find(p => p.slug === targetSlug) || proj;

    const titleEl = document.getElementById('spaceCenterTitle');
    const descTextEl = document.getElementById('spaceCenterDescText') || descEl.querySelector('.sc-desc');
    const catEl = document.getElementById('spaceCenterCat') || descEl.querySelector('.sc-cat');

    if (titleEl) titleEl.textContent = targetProj.title || proj.title || '';
    if (descTextEl) descTextEl.textContent = targetProj.description || targetProj.short || proj.description || proj.short || '';
    if (catEl) catEl.textContent = targetProj.category || proj.category || '';

    descEl.dataset.slug = targetProj.slug || targetSlug || proj.slug || '';
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
     Calibrated for extended ultra-wide 8640x4800 spatial canvas
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

    const baseScale = vpAspect > refAspect
      ? (vh / baseH)
      : (vw / baseW);

    return isMobile ? 0.72 : Math.max(0.78, Math.min(1.15, baseScale));
  }

  function renderField() {
    if (!field) return;
    field.style.display = 'block';
    field.innerHTML = '';

    const isMobile = window.innerWidth < 768;
    const scaleFactor = getSpatialScaleFactor();
    const tiles = getSpaceTiles();
    const totalSlots = tiles.length;

    for (let i = 0; i < totalSlots; i++) {
      const rawPos = LAYOUT[i];
      const pos = rawPos || { x: 0, y: 0, w: 300, h: 200, zPx: -100 };
      const tileData = tiles[i] || {};
      const targetSlug = tileData.targetSlug || tileData.targetProject || tileData.project || tileData.slug || '';
      const targetProj = PROJECTS.find(p => p.slug === targetSlug) || tileData;
      
      const sizeClass = tileData.sizeClass || pos.sizeClass || 'medium';
      const tile = document.createElement('div');
      tile.className = `tile ${sizeClass}${tileData.orientation ? ' ' + tileData.orientation : ''}`;
      tile.dataset.slug = tileData.slug || targetSlug;
      tile.dataset.targetSlug = targetSlug;
      tile.dataset.x = pos.x;
      tile.dataset.y = pos.y;
      tile.dataset.zpx = pos.zPx;
      tile.dataset.rx = pos.rx || 0;
      tile.dataset.ry = pos.ry || 0;
      tile.dataset.rz = pos.rz || 0;
      tile.dataset.index = i;
      tile.setAttribute('data-cursor', 'Learn More');
      if (pos.x > 60) {
        tile.setAttribute('data-x-pos', 'right');
      }

      // Responsive tile dimensions (+10% expansion)
      const TILE_SCALE = 1.375;
      const finalW = Math.round((tileData.w || pos.w || 220) * scaleFactor * TILE_SCALE);
      let finalH = (tileData.h || pos.h) ? Math.round((tileData.h || pos.h) * scaleFactor * TILE_SCALE) : Math.round(finalW * 0.65);
      if (tileData.orientation === 'portrait' && pos.sizeClass !== 'large' && !tileData.h) {
        finalH = Math.round(finalW * 1.35);
      }
      tile.style.setProperty('--tile-w', `${finalW}px`);
      tile.style.setProperty('--tile-h', `${finalH}px`);

      const mediaHTML = getTileMedia(tileData, i);

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
          showCenterDesc(targetProj);
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

      // Navigation click: routes to connected description title project page
      tile.addEventListener('click', (e) => {
        if (isPointerDragging || dragDistance > 6) {
          e.preventDefault();
          e.stopPropagation();
          return;
        }
        const dest = targetSlug || tileData.slug;
        if (dest) {
          go('project', dest);
        }
      });

      field.appendChild(tile);
    }
  }

  /* ═══════════════════════════════════════════════════════════════════════════
     EXPANDED PANORAMIC CANVAS & HIT-TESTING ENGINE
     Supports click & drag, wheel/trackpad scrolling, edge-panning, and double-click recenter
     ═══════════════════════════════════════════════════════════════════════════ */

  window.addEventListener('pointerdown', (e) => {
    if (activeView !== 'space') return;
    const targetEl = (e.target && typeof e.target.closest === 'function') ? e.target : null;
    if (targetEl && targetEl.closest('button, a, .fixed-footer, .brand-header, .index-toggle, .audio-toggle, .space-center-desc')) {
      return;
    }
    isPointerDown = true;
    dragStartX = e.clientX;
    dragStartY = e.clientY;
    lastDragX = e.clientX;
    lastDragY = e.clientY;
    dragDistance = 0;
    panVelocityX = 0;
    panVelocityY = 0;
  });

  window.addEventListener('pointermove', (e) => {
    // Track normalized mouse coordinates across reference space (-1.0 to +1.0)
    targetMouseX = (e.clientX / window.innerWidth) * 2 - 1;
    targetMouseY = (e.clientY / window.innerHeight) * 2 - 1;

    if (activeView !== 'space' || !field) return;

    if (isPointerDown) {
      const dx = e.clientX - lastDragX;
      const dy = e.clientY - lastDragY;
      dragDistance += Math.hypot(dx, dy);

      if (dragDistance > 6) {
        isPointerDragging = true;
        if (stage) stage.classList.add('is-dragging');
      }

      // Moving cursor right moves camera right (reveals left tiles, panX decreases)
      // Moving cursor left moves camera left (reveals right tiles, panX increases)
      targetPanX -= dx * 1.5;
      targetPanY -= dy * 1.5;
      panVelocityX = -dx * 1.5;
      panVelocityY = -dy * 1.5;

      lastDragX = e.clientX;
      lastDragY = e.clientY;
    }

    if (isPointerDragging) {
      if (activeHoveredTile) {
        activeHoveredTile = null;
        field.classList.remove('has-hover');
        field.querySelectorAll('.tile').forEach(t => t.classList.remove('is-hovered'));
        hideCenterDesc();
      }
      return;
    }

    const hitElement = document.elementFromPoint(e.clientX, e.clientY);
    const hitTile = (hitElement && typeof hitElement.closest === 'function') ? hitElement.closest('.tile') : null;

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
          const targetSlug = hitTile.dataset.targetSlug || hitTile.dataset.slug;
          const hitProj = PROJECTS.find(p => p.slug === targetSlug) || getSpaceTiles().find(t => (t.slug === targetSlug || t.targetSlug === targetSlug));
          if (hitProj) {
            const resolved = PROJECTS.find(p => p.slug === (hitProj.targetSlug || hitProj.slug)) || hitProj;
            showCenterDesc(resolved);
          }
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

  window.addEventListener('pointerup', () => {
    if (!isPointerDown) return;
    isPointerDown = false;
    if (stage) stage.classList.remove('is-dragging');
    setTimeout(() => {
      isPointerDragging = false;
    }, 60);
  });

  window.addEventListener('pointercancel', () => {
    isPointerDown = false;
    if (stage) stage.classList.remove('is-dragging');
    isPointerDragging = false;
  });

  // Double-click anywhere on empty stage to smoothly recenter canvas
  window.addEventListener('dblclick', (e) => {
    if (activeView !== 'space') return;
    const targetEl = (e.target && typeof e.target.closest === 'function') ? e.target : null;
    if (targetEl && targetEl.closest('button, a, .fixed-footer, .brand-header, .index-toggle, .audio-toggle, .tile')) return;
    targetPanX = 0;
    targetPanY = 0;
    panVelocityX = 0;
    panVelocityY = 0;
  });

  // Wheel and trackpad gesture support for panning across wide canvas
  window.addEventListener('wheel', (e) => {
    if (activeView !== 'space') return;
    const targetEl = (e.target && typeof e.target.closest === 'function') ? e.target : null;
    if (targetEl && targetEl.closest('.project-page, .about-page, .contact-view, .index-page-inner')) return;

    e.preventDefault();
    const mult = 1.0;
    if (Math.abs(e.deltaX) > 0.5) {
      targetPanX += e.deltaX * mult;
    }
    if (Math.abs(e.deltaY) > 0.5) {
      if (e.shiftKey || Math.abs(e.deltaX) === 0) {
        // Normal mouse wheel: horizontal canvas navigation with slight vertical tracking
        targetPanX += e.deltaY * 1.1;
        targetPanY += (e.deltaY * 0.25);
      } else {
        targetPanY += e.deltaY * mult;
      }
    }
  }, { passive: false });

  /* ═══════════════════════════════════════════════════════════════════════════
     5. 3D CONCAVE SPACE ANIMATION LOOP
     ═══════════════════════════════════════════════════════════════════════════ */

  let fieldRotX = 0;
  let fieldRotY = 0;

  function spaceLoop() {
    if (activeView !== 'space') return;

    const isMobile = window.innerWidth < 768;
    const scaleFactor = getSpatialScaleFactor();

    // 1. Continuous edge acceleration: holding cursor near screen margins smoothly glides toward the ends
    if (!isPointerDown) {
      const edgeThresholdX = 0.74;
      const edgeThresholdY = 0.78;
      if (targetMouseX > edgeThresholdX) {
        const factor = (targetMouseX - edgeThresholdX) / (1 - edgeThresholdX);
        targetPanX += factor * 26 * scaleFactor;
      } else if (targetMouseX < -edgeThresholdX) {
        const factor = (-edgeThresholdX - targetMouseX) / (1 - edgeThresholdX);
        targetPanX -= factor * 26 * scaleFactor;
      }

      if (targetMouseY > edgeThresholdY) {
        const factor = (targetMouseY - edgeThresholdY) / (1 - edgeThresholdY);
        targetPanY += factor * 18 * scaleFactor;
      } else if (targetMouseY < -edgeThresholdY) {
        const factor = (-edgeThresholdY - targetMouseY) / (1 - edgeThresholdY);
        targetPanY -= factor * 18 * scaleFactor;
      }
    }

    // 2. Momentum coasting
    if (!isPointerDown && (Math.abs(panVelocityX) > 0.05 || Math.abs(panVelocityY) > 0.05)) {
      targetPanX += panVelocityX;
      targetPanY += panVelocityY;
      panVelocityX *= 0.90;
      panVelocityY *= 0.90;
    }

    // 3. Expanded canvas boundaries reaching all 30 slots (Slot 27 at -3100 to Slot 29 at +3350)
    const minPanX = -3600 * scaleFactor;
    const maxPanX = 3800 * scaleFactor;
    const minPanY = -650 * scaleFactor;
    const maxPanY = 650 * scaleFactor;

    targetPanX = Math.max(minPanX, Math.min(maxPanX, targetPanX));
    targetPanY = Math.max(minPanY, Math.min(maxPanY, targetPanY));

    // Smooth pan easing
    panX += (targetPanX - panX) * 0.085;
    panY += (targetPanY - panY) * 0.085;

    // 4. Dynamic mouse sway around the current pan position
    const swayCamX = isMobile ? 0 : targetMouseX * (scaleFactor * 160);
    const swayCamY = isMobile ? 0 : targetMouseY * (scaleFactor * 120);
    const swayRotY = isMobile ? 0 : targetMouseX * 4.2;

    const totalTargetCamX = panX + swayCamX;
    const totalTargetCamY = panY + swayCamY;
    const totalTargetRotY = swayRotY;

    // Smooth cinematic camera easing with high initial responsiveness & smooth settling inertia
    cameraX += (totalTargetCamX - cameraX) * 0.065;
    cameraY += (totalTargetCamY - cameraY) * 0.065;
    fieldRotY += (totalTargetRotY - fieldRotY) * 0.065;
    fieldRotX = 0;

    if (field) {
      field.style.transform = `translate3d(${-cameraX.toFixed(1)}px, ${-cameraY.toFixed(1)}px, 0px) rotateY(${fieldRotY.toFixed(2)}deg)`;

      const halfW = (window.innerWidth * 0.5) || 720;
      const halfH = (window.innerHeight * 0.5) || 450;

      field.querySelectorAll('.tile').forEach((t, i) => {
        const rawX = isNaN(parseFloat(t.dataset.x)) ? 0 : parseFloat(t.dataset.x);
        const rawY = isNaN(parseFloat(t.dataset.y)) ? 0 : parseFloat(t.dataset.y);
        const baseZ = isNaN(parseFloat(t.dataset.zpx)) ? 0 : parseFloat(t.dataset.zpx);
        
        const baseRx = isNaN(parseFloat(t.dataset.rx)) ? 0 : parseFloat(t.dataset.rx);
        const baseRy = isNaN(parseFloat(t.dataset.ry)) ? 0 : parseFloat(t.dataset.ry);
        const baseRz = isNaN(parseFloat(t.dataset.rz)) ? 0 : parseFloat(t.dataset.rz);

        const posX = rawX * scaleFactor;
        const posY = rawY * scaleFactor;

        // Multi-tier depth parallax
        const parallaxOffset = -cameraX * (baseZ / 850);
        const tilePosX = posX + parallaxOffset;

        // Instantaneous screen-relative coordinates
        const screenX = posX - cameraX * (1.0 + baseZ / 850);
        const screenY = posY - cameraY;

        const normScreenX = screenX / (halfW * 0.92);
        const normScreenY = screenY / (halfH * 0.92);

        // Inverted cylindrical curvature & depth progression (outer edges flare forward)
        const radius = 3400 * scaleFactor;
        const clampedX = Math.min(Math.abs(screenX), radius * 0.94);
        const cylZ = (radius - Math.sqrt(radius * radius - clampedX * clampedX)) * 0.18;
        const vertZ = Math.min(60, (screenY * screenY) / (3600 * scaleFactor));
        const totalZ = Math.min(360, baseZ + cylZ + vertZ);

        // Inverted tilts along arc
        const cylRotY = baseRy + (normScreenX * CONFIG.YAW_COEFF);
        const cylRotX = baseRx + (normScreenY * CONFIG.PITCH_COEFF);
        const cylRotZ = baseRz;

        const isHovered = t.classList.contains('is-hovered');

        // Depth-based opacity: Far (~0.78), Mid (~0.88), Near (~0.98), Hovered (1.0)
        const normZ = Math.max(0, Math.min(1, (totalZ + 400) / 600));
        const depthOpacity = 0.78 + normZ * 0.20;
        const hasActiveHover = field.classList.contains('has-hover');
        const finalOpacity = isHovered ? 1.0 : (hasActiveHover ? depthOpacity * 0.22 : depthOpacity);
        t.style.opacity = finalOpacity.toFixed(3);

        // Dynamic 3D Z-index: Derived directly from computed 3D depth
        const uniqueStackIndex = Math.round((totalZ + 2000) * 10) + i;
        t.style.zIndex = isHovered ? 9999 : uniqueStackIndex;

        // Visual depth filter
        t.style.filter = isHovered
          ? 'brightness(1.08) saturate(1.05) drop-shadow(0px 18px 48px rgba(0,0,0,0.98))'
          : `brightness(${CONFIG.TILE_REST_BRIGHTNESS}) saturate(${CONFIG.TILE_REST_SATURATE}) drop-shadow(0px 16px 42px rgba(0,0,0,0.88))`;

        // Pure 3D transform without hover zoom (scale strictly 1)
        t.style.transform = `translate(-50%, -50%) translate3d(${tilePosX.toFixed(1)}px, ${posY.toFixed(1)}px, ${totalZ.toFixed(1)}px) rotateX(${cylRotX.toFixed(2)}deg) rotateY(${cylRotY.toFixed(2)}deg) rotateZ(${cylRotZ.toFixed(2)}deg) scale(1)`;
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

  function setupIntroView() {
    const introV = makeView('intro');
    const introData = SITE.intro || {};
    const disciplines = introData.disciplines || [];

    const pillarsHTML = disciplines.map((disc, idx) => `
      <div class="intro-pillar-card" data-slug="${disc.featuredSlug || ''}" data-cursor="Explore" tabindex="0" role="button" aria-label="Explore ${disc.title}">
        <div class="pillar-card-num">${disc.num || `0${idx + 1}`}</div>
        <div class="pillar-card-thumb-wrap">
          <img src="${disc.thumb || ''}" alt="${disc.title}" class="pillar-card-img" loading="lazy" />
          <div class="pillar-card-badge">${disc.tag || 'DISCIPLINE'}</div>
        </div>
        <div class="pillar-card-body">
          <h3 class="pillar-card-title">${disc.title}</h3>
          <p class="pillar-card-desc">${disc.desc}</p>
          <div class="pillar-card-footer">
            <span class="pillar-link-text">EXPLORE WORK</span>
            <span class="pillar-arrow">→</span>
          </div>
        </div>
      </div>
    `).join('');

    introV.innerHTML = `
      <div class="intro-page">
        <div class="intro-bg" aria-hidden="true">
          <div class="intro-bg-media"></div>
          <div class="intro-bg-glow"></div>
          <div class="intro-bg-vignette"></div>
          <div class="intro-bg-grid"></div>
        </div>

        <div class="intro-container">
          <header class="intro-header">
            <div class="intro-eyebrow">
              <span class="intro-dot"></span>
              <span>${introData.eyebrow || 'SRIRAM MJ — MULTIDISCIPLINARY DESIGNER'}</span>
              <span class="intro-year">© 2026</span>
            </div>

            <h1 class="intro-title" aria-label="Sriram MJ Multidisciplinary Designer">
              <div class="intro-title-line intro-title-line--1">
                <span class="intro-name-display">${SITE.name || 'SRIRAM MJ'}</span>
              </div>
              <div class="intro-title-line intro-title-line--2">
                <span class="intro-tag-pill">PORTFOLIO</span>
                <span class="intro-subtitle-serif">KINETIC FILMS & DIGITAL ARCHITECTURE</span>
              </div>
            </h1>

            <p class="intro-statement">
              ${introData.statement || 'Welcome to Sriram’s world of <em>stunt riding films</em>, systematic product architecture, and experimental visual craft.'}
            </p>

            <div class="intro-cta-hub">
              <button class="intro-cta-btn intro-cta-btn--primary" id="introEnterBtn" data-cursor="Enter" aria-label="Enter 3D Work Gallery">
                <span class="intro-cta-text">${introData.ctaPrimary || 'ENTER THE WORK'}</span>
                <svg class="intro-arrow-icon" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8H13M13 8L8.5 3.5M13 8L8.5 12.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </button>
              <button class="intro-cta-btn intro-cta-btn--secondary" id="introIndexBtn" data-cursor="Index" aria-label="View Project Index List">
                <span class="intro-plus-icon">+</span>
                <span class="intro-cta-text">${introData.ctaSecondary || 'INDEX VIEW'}</span>
              </button>
              <button class="intro-cta-btn intro-cta-btn--audio ${isAudioPlaying ? 'is-playing' : ''}" id="introAudioBtn" data-cursor="Sound" aria-label="Toggle Ambient Sound">
                <span class="intro-audio-indicator"></span>
                <span class="intro-audio-text">${isAudioPlaying ? 'SOUND PLAYING ♫' : (introData.soundPrompt || 'SOUND EXPERIENCE')}</span>
              </button>
            </div>
          </header>

          <section class="intro-pillars-section" aria-label="Disciplines Showcase">
            <div class="intro-section-label">
              <span class="intro-section-num">03 DISCIPLINES</span>
              <span class="intro-section-rule"></span>
              <span class="intro-section-desc">PRACTICE ACROSS MOTION, INTERFACE & GRAPHICS</span>
            </div>

            <div class="intro-pillars-grid">
              ${pillarsHTML}
            </div>
          </section>

          <footer class="intro-footer-details">
            <div class="if-status">
              <span class="if-dot"></span>
              <span>OPEN FOR SELECT COMMISSIONS & DESIGN ROLES</span>
            </div>
            <div class="if-links">
              <button class="if-link-btn" data-target="about">READ BIOGRAPHY & CRAFT →</button>
              <button class="if-link-btn" data-target="contact">GET IN TOUCH →</button>
            </div>
          </footer>
        </div>
      </div>
    `;

    // Event listeners
    const enterBtn = introV.querySelector('#introEnterBtn');
    if (enterBtn) {
      enterBtn.addEventListener('click', () => go('space'));
    }

    const indexBtn = introV.querySelector('#introIndexBtn');
    if (indexBtn) {
      indexBtn.addEventListener('click', () => go('index'));
    }

    const audioBtn = introV.querySelector('#introAudioBtn');
    if (audioBtn) {
      audioBtn.addEventListener('click', () => {
        toggleAudio();
      });
    }

    introV.querySelectorAll('.intro-pillar-card').forEach(card => {
      card.addEventListener('click', () => {
        const slug = card.dataset.slug;
        if (slug) {
          go('project', slug);
        } else {
          go('space');
        }
      });
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          card.click();
        }
      });
    });

    introV.querySelectorAll('.if-link-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const target = btn.dataset.target;
        if (target) go(target);
      });
    });
  }

  function setupSpaceView() {
    const spaceV = makeView('space');
    spaceV.innerHTML = `
      <div class="home-stage">
        <div class="field" id="field"></div>
      </div>
      <div class="space-center-desc" id="spaceCenterDesc" aria-live="polite">
        <h2 class="sc-title" id="spaceCenterTitle">TITLE</h2>
        <p class="sc-desc" id="spaceCenterDescText"></p>
        <div class="sc-cat" id="spaceCenterCat">CATEGORY</div>
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
          ${getIndexProjects().map((p, i) => {
            const firstImg = (Array.isArray(p.images) && p.images.length > 0)
              ? (typeof p.images[0] === 'string' ? p.images[0] : (p.images[0].src || p.images[0].thumb || ''))
              : '';
            const bgSrc = p.thumb || firstImg || (p.media ? p.media.src : '');
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
    const normalizedSlug = slug ? decodeURIComponent(slug).trim().toLowerCase().replace(/\s+/g, '-') : '';
    const p = PROJECTS.find(item => item.slug === slug || item.slug === normalizedSlug) || PROJECTS[0];
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
        <div class="track-left">
          <span class="num">${String(i + 1).padStart(3, '0')}</span>
          <span class="tname">${it.title}</span>
        </div>
        <button class="playmini" aria-label="${it.type === 'view' ? 'View' : 'Play'}">
          ${it.type === 'view' 
            ? `<span>${it.meta || 'VIEW'}</span>`
            : `
              <svg class="icon-play" viewBox="0 0 24 24"><polygon points="7 5 19 12 7 19 7 5"></polygon></svg>
              <svg class="icon-pause" viewBox="0 0 24 24" style="display:none;"><rect x="6" y="5" width="4" height="14"></rect><rect x="14" y="5" width="4" height="14"></rect></svg>
            `
          }
        </button>
        <span class="time">${it.meta || '0:00'}</span>
      </div>
    `).join('');

    projV.innerHTML = `
      <div class="project-page">
        <button class="back-link">
          <span class="back-arrow">← BACK</span>
          <span class="back-sub">TO ALL PROJECTS</span>
        </button>
        <div class="corner-badge" aria-hidden="true">
          <svg viewBox="0 0 100 100" class="badge-svg">
            <path id="projBadgeCircle" d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0" fill="transparent" />
            <text class="badge-text">
              <textPath href="#projBadgeCircle" startOffset="0%">
                ${SITE.soundBadgeText || 'THE SOUND BEHIND CO • THE SOUND BEHIND CO • '}
              </textPath>
            </text>
          </svg>
          <span class="badge-dot"></span>
        </div>
        <header class="proj-head">
          <h1 class="title">${p.title}</h1>
          ${p.short ? `<p class="proj-short">${p.short}</p>` : ''}
          ${(p.description || p.moreInfo) ? `
            <button class="more-info-toggle">
              <span class="plus">+</span>
              <span class="lbl">MORE INFO</span>
            </button>
            <div class="more-info-panel">
              ${p.description ? `<p class="desc">${p.description}</p>` : ''}
              ${p.moreInfo ? `<p>${p.moreInfo}</p>` : ''}
            </div>
          ` : ''}
        </header>
        <div class="proj-media">
          ${mediaHTML}
          <span class="play-label">${isVideo ? 'PLAY VIDEO' : 'VIEW MEDIA'}</span>
        </div>
        ${itemsHTML ? `<div class="track-list">${itemsHTML}</div>` : ''}
      </div>
    `;

    projV.querySelector('.back-link').addEventListener('click', () => {
      go(previousView === 'index' ? 'index' : 'space');
    });

    const moreToggle = projV.querySelector('.more-info-toggle');
    if (moreToggle) {
      moreToggle.addEventListener('click', () => {
        const panel = projV.querySelector('.more-info-panel');
        const plus = moreToggle.querySelector('.plus');
        if (panel) {
          panel.classList.toggle('open');
          if (plus) plus.textContent = panel.classList.contains('open') ? '−' : '+';
        }
      });
    }

    const nextProjBtn = projV.querySelector('.next-project');
    if (nextProjBtn) {
      nextProjBtn.addEventListener('click', () => {
        go('project', nextProj.slug);
      });
    }

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
    const orbitSlugs = ['team-never-enough', 'luminal-hr', 'burnout', 'wheelie-city', 'behind-the-lens', 'reel-2026'];
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
              <span class="item-title"></span>
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
            <div class="about-sec-eyebrow">MEANING IN EVERY DETAIL</div>
            <div class="stepped-typography" aria-label="SRIRAM BELIEVES EVERY COLOR HAS A STORY TO TELL">
              <div class="stepped-row step-0"><span class="zapf-step">SRIRAM</span></div>
              <div class="stepped-row step-1"><span class="zapf-step">BELIEVES EVERY</span></div>
              <div class="stepped-row step-2"><span class="zapf-step">COLOR HAS</span></div>
              <div class="stepped-row step-3"><span class="zapf-step">A STORY</span></div>
              <div class="stepped-row step-4"><span class="zapf-step">TO TELL</span></div>
            </div>
            <div class="about-editorial-text-wrap">
              <p class="about-editorial-p">
                Sriram has a strong belief that every color carries meaning, and every element has a purpose. He pays attention to even the smallest details, often embedding meaning within the tiniest parts of his work. He creates primarily for self-satisfaction and personal expression, which makes every production a reflection of his personality, perspective, and character.
              </p>
              <p class="about-editorial-quote">
                “My work is not just something I create; it is a reflection of who I am.”
              </p>
            </div>
          </div>
        </section>

        <!-- Section 2: Stepped Typography (Interface Architecture) -->
        <section class="about-section-wrap about-section-wrap--stepped about-section-wrap--interface" id="about-sec-2">
          <div class="about-section-inner">
            <div class="about-sec-eyebrow text-center">SYSTEMATIC INTERACTION DESIGN</div>
            <div class="stepped-typography stepped-typography--alt" aria-label="STRUCTURING IDEAS INTO UI/UX THROUGH DIGITAL ARCHITECTURE">
              <div class="stepped-row step-alt-0"><span class="zapf-step">STRUCTURING IDEAS</span></div>
              <div class="stepped-row step-alt-1"><span class="zapf-step">INTO UI/UX</span></div>
              <div class="stepped-row step-alt-2"><span class="zapf-step">THROUGH DIGITAL</span></div>
              <div class="stepped-row step-alt-3"><span class="zapf-step">ARCHITECTURE</span></div>
            </div>
            <div class="about-editorial-text-wrap">
              <p class="about-editorial-p">
                I begin by structuring the idea and breaking the work into meaningful components. This allows me to organize content, define how each element connects within the UI, and establish a clear direction before moving into design. I then execute the plan, refine the details, and continuously iterate until the final result feels clear, intentional, and complete.
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
                <a href="https://www.instagram.com/delusional.efx?stkn=MW82b2ttZW9vdnNuaw==" target="_blank" rel="noopener noreferrer" class="about-social-pill">INSTAGRAM</a>
                <span class="about-social-or">OR</span>
                <a href="https://www.linkedin.com/in/sriram-m-j-5491a7322/" target="_blank" rel="noopener noreferrer" class="about-social-pill">LINKEDIN</a>
                <span class="about-social-or">OR</span>
                <a href="mailto:srirammj221@gmail.com" class="about-social-pill">EMAIL</a>
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

    const hashTarget = viewName === 'intro' ? '#intro' : (viewName === 'space' ? '#work' : `#${viewName}${arg ? '/' + arg : ''}`);
    if (location.hash !== hashTarget && !(viewName === 'intro' && (location.hash === '' || location.hash === '#'))) {
      history.pushState(null, '', hashTarget);
    }

    // Toggle scroll permissions & project view body state
    document.body.classList.toggle('project-active', viewName === 'project');
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

    if (viewName === 'intro') {
      if (!views.intro) setupIntroView();
      views.intro.classList.add('active');
      views.intro.scrollTop = 0;
      window.scrollTo(0, 0);
    } else if (viewName === 'space') {
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
    const raw = location.hash.replace('#', '') || 'intro';
    const parts = raw.split('/');
    let view = parts[0];
    let arg = parts[1];

    if (view === 'home' || view === 'cover') view = 'intro';
    if (view === 'work') view = 'space';
    if (!['intro', 'space', 'index', 'project', 'about', 'contact'].includes(view)) {
      view = 'intro';
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
    setupIntroView();
    setupSpaceView();
    setupIndexView();
    setupAboutView();
    setupContactView();
    routeFromHash();
  });

})();
