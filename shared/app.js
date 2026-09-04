/* ===========================================================
   Portfolio engine — shared behaviour
   Reads config from window.SITE and window.PROJECTS
   (defined per-portfolio in data.js)

   Routes
   ------
     #space          — 3-D scattered gallery  (Space View)
     #index          — numbered project list  (Index View)
     #project/<slug> — individual project page
     #about          — about page
     #contact        — contact page

   Backward-compat redirects
     #home → #space   (saved links won't break)
     #work → #space
   =========================================================== */

(function () {
  const SITE = window.SITE;
  const PROJECTS = window.PROJECTS;
  const app = document.getElementById('app');
  let activeView = 'space';
  let lastNavigatedView = 'space';

  // MASTER CONFIG: Single source of truth for numeric & timing constants across modules
  const CONFIG = {
    // CONTEXT Baseline Typography Scale Tokens (px equivalents for JS/Canvas computations)
    SIZE_NAME_PX: 24,                  // 1.5rem — top-center name
    SIZE_ROLE_PX: 12,                  // 0.75rem — role subtitle
    SIZE_HERO_DESKTOP_PX: 28,          // 1.75rem — desktop resting hero line
    SIZE_HERO_MOBILE_PX: 18.4,         // 1.15rem — mobile hero line
    SIZE_SPLASH_DESKTOP_PX: 32,        // 2rem — splash line
    SIZE_SPLASH_MOBILE_PX: 20,         // 1.25rem — mobile splash line
    SIZE_SPLASH_SKIP_PX: 11.2,         // 0.7rem — enter without sound
    SIZE_CAPTION_TITLE_DESKTOP_PX: 24, // 1.5rem — hovered tile title
    SIZE_CAPTION_TITLE_MOBILE_PX: 17.6,// 1.1rem — mobile hovered tile title
    SIZE_CAPTION_DESC_PX: 12,          // 0.75rem — tile description text
    SIZE_CAPTION_CTA_PX: 11.2,         // 0.7rem — learn more label
    SIZE_INDEX_NUMBER_PX: 11.2,        // 0.7rem — index row number
    SIZE_NAV_PX: 12,                   // 0.75rem — footer nav
    SIZE_NAV_CONNECTOR_PX: 10.4,       // 0.65rem — connector words
    SIZE_ABOUT_BODY_PX: 17.6,          // 1.1rem — about bio text

    // CONTEXT Baseline Spacing & Positions
    HEADER_TOP_OFFSET_PX: 40,          // 40px viewport top offset
    FOOTER_BOTTOM_OFFSET_PX: 32,       // 32px viewport bottom offset
    INDEX_TOGGLE_PLUS_PX: 14,          // 14px font size for "+"
    INDEX_TOGGLE_LABEL_PX: 11.2,       // 0.7rem (11.2px) for label
    INDEX_TOGGLE_GAP_PX: 8,            // 8px gap between "+" and label
    SOUND_TOGGLE_SIZE_PX: 20,          // 20px icon
    SOUND_TOGGLE_OFFSET_PX: 24,        // 24px from bottom & right edge

    // Splash Screen Drops
    SPLASH_DROP_DESKTOP: 18,
    SPLASH_DROP_MOBILE: 10,

    // Cursor Panning, Motion Blur & Parallax Tilt (MODULE 6 Tokens)
    PAN_DEAD_RADIUS: 0.05,          // 0.0-0.5, center dead zone
    PAN_MAX_SPEED: 42,              // px/frame max pan velocity
    PAN_POWER_CURVE: 1.1,           // exponent, 1.0 = linear
    PAN_SMOOTHING: 0.12,            // inertia interpolation factor
    BLUR_MULTIPLIER: 0.07,          // panSpeed * this = blur px
    BLUR_MAX: 1.8,                  // px, upper cap on blur
    TILT_GLOBAL_X: 15,              // global cursor parallax tilt, deg
    TILT_GLOBAL_Y: -18,             // deg
    TILT_TILE_HOVER: 18,            // deg, per-tile hover tilt magnitude

    // Tile Rest & Hover Interaction Tokens (MODULE 7 & Section 5 Tokens)
    TILE_REST_OPACITY: 0.45,
    TILE_REST_BRIGHTNESS: 0.38,
    TILE_REST_SATURATE: 0.65,
    TILE_REST_BLUR_PX: 1.5,
    HOVER_INTENT_DELAY: 260,       // ms, intent delay desktop
    HOVER_TOUCH_DELAY: 120,        // ms, intent delay touch
    HOVER_EXIT_DELAY: 80,          // ms, exit grace period
    HOVER_TRANSITION_MS: 320,
    TOGGLE_FADE_TRANSITION_MS: 200,

    // 3D Stage Perspective, Dome Depth & Floating Motion (MODULE 5 Tokens)
    STAGE_PERSPECTIVE: 1200,       // px, .home-stage perspective
    DOME_CURVE_COEFF: 230,         // curvature multiplier by distance from visual center
    DEPTH_Z_SCALE: 120,            // depth * this = base Z offset
    PITCH_COEFF: 26,               // vertical tilt from center, deg
    YAW_COEFF: -32,                // horizontal tilt from center, deg
    FLOAT_Y_AMP: 0,                // px, primary vertical float (disabled per user preference)
    FLOAT_Y_AMP_2: 0,              // px, secondary vertical float
    FLOAT_X_AMP: 0,                // px, horizontal drift
    FLOAT_Z_AMP: 0,                // px, depth oscillation
    FLOAT_RX_AMP: 0,               // deg
    FLOAT_RY_AMP: 0,               // deg
    FLOAT_RZ_AMP: 0,               // deg
    FLOAT_FREQ: 0,                 // base time frequency
    MOBILE_MOTION_SCALE: { dome: 0.5, float: 0.6 },

    // Motion Blur Physics

    // Intro Animation Sequence
    INTRO_DURATION_MS: 8000,
    INTRO_Z_START: -580,

    // Space Gallery Tiles & Scale
    MOBILE_TILE_SCALE: 0.55,
    SPACE_TILE_MIN_W: 160,
    SPACE_TILE_MAX_W: 310,
    RESTING_TILE_BRIGHTNESS: 0.65,
    RESTING_TILE_OPACITY: 0.68,
    RESTING_TILE_BLUR_PX: 0.5
  };

  /* ──────────────────────────────────────────────────────────
     PERSISTENT CHROME
     All text pulled from SITE object — no hardcoded names.
     ────────────────────────────────────────────────────────── */

  /* Scramble / decode animation on first load (Section 1 spec) */
  function scrambleText(el, finalStr) {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.textContent = finalStr;
      return;
    }
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const len = finalStr.length;
    const startTimes = Array.from({ length: len }, (_, i) => i * 15);
    const durations = Array.from({ length: len }, () => 60 + Math.floor(Math.random() * 60));
    const startTime = performance.now();
    const totalDuration = 420;

    function step(now) {
      const elapsed = now - startTime;
      let result = '';
      for (let i = 0; i < len; i++) {
        if (finalStr[i] === ' ') {
          result += ' ';
          continue;
        }
        if (elapsed < startTimes[i]) {
          result += chars[Math.floor(Math.random() * chars.length)];
        } else if (elapsed < startTimes[i] + durations[i]) {
          result += chars[Math.floor(Math.random() * chars.length)];
        } else {
          result += finalStr[i];
        }
      }
      el.textContent = result;
      if (elapsed < totalDuration) {
        requestAnimationFrame(step);
      } else {
        el.textContent = finalStr;
      }
    }
    requestAnimationFrame(step);
  }

  document.title = `${SITE.name} — ${SITE.role}`;

  const brand = document.createElement('div');
  brand.className = 'brand';
  brand.innerHTML = `<span class="name">${SITE.name}</span><span class="role">${SITE.role}</span>`;
  if (activeView === 'index') {
    brand.style.setProperty('display', 'none', 'important');
  }
  document.body.appendChild(brand);

  const nameEl = brand.querySelector('.name');
  if (nameEl && !sessionStorage.getItem('name-scrambled')) {
    sessionStorage.setItem('name-scrambled', 'true');
    scrambleText(nameEl, SITE.name);
  }

  const footerNav = document.createElement('div');
  footerNav.className = 'footer-nav';
  footerNav.innerHTML = `
    <span class="lead">${SITE.navLead1 || 'the'}</span>
    <button data-nav="space" data-cursor="Explore">${SITE.navWork || 'Work'}</button>
    <span class="joiner">${SITE.navLead2 || 'and'}</span>
    <button data-nav="about" data-cursor="Explore">About</button>
    <span class="joiner" data-nav="about">me</span>
    <br/>
    <span class="joiner">${SITE.navLead3 || 'or'}</span>
    <button data-nav="contact" data-cursor="Contact">${SITE.navContact || 'Contact'}</button>
  `;
  document.body.appendChild(footerNav);

  if (SITE.soundBadgeText) {
    const badge = document.createElement('div');
    badge.className = 'sound-badge';
    badge.id = 'audio-vizualizer-target';
    badge.innerHTML = buildSoundBadge(SITE.soundBadgeText);
    badge.addEventListener('click', () => go('space'));
    document.body.appendChild(badge);
  }

  // "+  Index View" toggle — centered in viewport (50%/50%), + rotates 45deg to x on hover over 200ms
  const indexToggle = document.createElement('div');
  indexToggle.className = 'index-toggle';
  indexToggle.setAttribute('data-cursor', 'Open');
  indexToggle.innerHTML = `<span class="plus">+</span><span class="label">INDEX VIEW</span>`;
  indexToggle.addEventListener('click', () => go('index'));
  document.body.appendChild(indexToggle);

  footerNav.querySelectorAll('[data-nav]').forEach(btn => {
    btn.addEventListener('click', () => go(btn.dataset.nav));
  });

  /* ══════════════════════════════════════════════════════════
     AMBIENT SOUND SYSTEM
     Single looping track that persists across all views/routes.
     Speaker toggle lives at bottom-right.
     State is saved in localStorage so it survives page reloads.

     TODO: drop your track at  D:/portfolio/media/ambient.mp3
           Formats: .mp3  .ogg  .wav  |  Aim for ≤ 3 MB, loops cleanly.
           The engine handles a missing file silently — no errors
           until you add the file and the user clicks the toggle.
     ══════════════════════════════════════════════════════════ */

  // TODO: change path below if you rename / relocate the track
  const AMBIENT_SRC = 'media/ambient.mp3';

  const ambientAudio = document.createElement('audio');
  ambientAudio.loop = true;
  ambientAudio.preload = 'none'; // don't fetch until play() is called
  ambientAudio.volume = 0.35;
  ambientAudio.src = AMBIENT_SRC;
  document.body.appendChild(ambientAudio);

  // Restore saved preference.  Default = off (browsers block autoplay anyway).
  let soundOn = localStorage.getItem('ambient-sound') === 'on';

  // Speaker SVG — "on" (with two arcs) / "off" (with X cross)
  const SVG_SPEAKER_ON = `<svg viewBox="0 0 24 24" fill="none"
      stroke="currentColor" stroke-width="1.5"
      stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <path d="M11 5 6 9H2v6h4l5 4V5z"/>
    <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
    <path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
  </svg>`;

  const SVG_SPEAKER_OFF = `<svg viewBox="0 0 24 24" fill="none"
      stroke="currentColor" stroke-width="1.5"
      stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <path d="M11 5 6 9H2v6h4l5 4V5z"/>
    <line x1="23" y1="9"  x2="17" y2="15"/>
    <line x1="17" y1="9"  x2="23" y2="15"/>
  </svg>`;

  const soundBtn = document.createElement('button');
  soundBtn.className = 'sound-toggle';
  soundBtn.id = 'soundToggle';
  soundBtn.setAttribute('aria-label', 'Toggle ambient sound');
  soundBtn.setAttribute('aria-pressed', soundOn ? 'true' : 'false');
  soundBtn.setAttribute('data-cursor', 'Sound');
  document.body.appendChild(soundBtn);

  function syncSoundUI() {
    soundBtn.innerHTML = soundOn ? SVG_SPEAKER_ON : SVG_SPEAKER_OFF;
    soundBtn.classList.toggle('is-on', soundOn);
    soundBtn.setAttribute('aria-pressed', soundOn ? 'true' : 'false');
    soundBtn.title = soundOn ? 'Sound on — click to mute' : 'Sound off — click to enable';

    const vizTarget = document.getElementById('audio-vizualizer-target');
    if (vizTarget) {
      vizTarget.classList.toggle('is-playing', soundOn);
    }
  }

  async function applyAmbient() {
    if (soundOn) {
      try {
        await ambientAudio.play();
      } catch (err) {
        // File missing or browser policy — silently ignore.
        // Add media/ambient.mp3 to the project root to enable audio.
      }
    } else {
      ambientAudio.pause();
    }
  }

  soundBtn.addEventListener('click', async () => {
    soundOn = !soundOn;
    localStorage.setItem('ambient-sound', soundOn ? 'on' : 'off');
    syncSoundUI();
    await applyAmbient();
  });

  // If the visitor had sound enabled last session, resume on their very next
  // gesture (browsers require a user interaction before play() can succeed).
  if (soundOn) {
    const resumeOnGesture = () => {
      applyAmbient();
      document.removeEventListener('click', resumeOnGesture);
      document.removeEventListener('touchstart', resumeOnGesture);
    };
    document.addEventListener('click', resumeOnGesture, { once: true });
    document.addEventListener('touchstart', resumeOnGesture, { once: true });
  }

  syncSoundUI(); // set initial icon

  /* ──────────────────────────────────────────────────────────
     SCATTERED DIAGONAL TYPOGRAPHY & ENTRY SPLASH SCREEN
     ────────────────────────────────────────────────────────── */
  function createScatteredTextHTML(text, customClass = '') {
    if (!text) return '';
    const words = text.split(' ');
    const totalWords = words.length;
    let html = `<div class="scattered-text ${customClass}">`;
    let globalCharIndex = 0;

    words.forEach((word, wIdx) => {
      const dropDesk = (wIdx * CONFIG.SPLASH_DROP_DESKTOP).toFixed(1) + 'px';
      const dropMob = (wIdx * CONFIG.SPLASH_DROP_MOBILE).toFixed(1) + 'px';
      const wordDx = (wIdx * 18).toFixed(1) + 'px';

      html += `<span class="scatter-word" style="--wdx:${wordDx}; --wdy-desk:${dropDesk}; --wdy-mob:${dropMob};">`;
      Array.from(word).forEach((ch, cIdx) => {
        const rot = ((globalCharIndex % 2 === 0 ? 1 : -1) * (1.5 + (globalCharIndex % 3) * 1.5)).toFixed(1) + 'deg';
        const delay = (globalCharIndex * 0.03).toFixed(3) + 's';
        html += `<span class="scatter-char" style="--rot:${rot}; --delay:${delay};">${ch}</span>`;
        globalCharIndex++;
      });
      html += `</span>`;
      if (wIdx < totalWords - 1) {
        html += `<span class="scatter-space">&nbsp;</span>`;
      }
    });
    html += `</div>`;
    return html;
  }

  function renderScatterText(el, text, options = {}) {
    if (!el) return;
    const customClass = options.class || '';
    el.innerHTML = createScatteredTextHTML(text, customClass);
  }

  window.renderScatterText = renderScatterText;

  function initSplashScreen() {
    if (sessionStorage.getItem('splash-dismissed') === 'true') return;

    const splashText = (window.SITE && window.SITE.splashText) ? window.SITE.splashText : "CLICK ANYWHERE TO TURN ON YOUR SOUND";

    const splash = document.createElement('div');
    splash.className = 'splash-screen';

    const splashKicker = document.createElement('p');
    splashKicker.className = 'splash-kicker';
    splashKicker.textContent = 'SOUND EXPERIENCE';
    splash.appendChild(splashKicker);

    const promptContainer = document.createElement('div');
    promptContainer.className = 'splash-prompt';
    renderScatterText(promptContainer, splashText);
    splash.appendChild(promptContainer);

    const optionsDiv = document.createElement('div');
    optionsDiv.className = 'splash-options';
    optionsDiv.innerHTML = `<button class="splash-btn splash-no">enter without sound</button>`;
    splash.appendChild(optionsDiv);

    document.body.appendChild(splash);

    async function dismiss(enableSound) {
      sessionStorage.setItem('splash-dismissed', 'true');
      soundOn = enableSound;
      localStorage.setItem('ambient-sound', soundOn ? 'on' : 'off');
      syncSoundUI();
      if (soundOn) {
        await applyAmbient();
      } else {
        ambientAudio.pause();
      }
      splash.classList.add('fade-out');
      const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const timeoutDuration = isReducedMotion ? 0 : 850;
      setTimeout(() => {
        if (splash.parentNode) splash.parentNode.removeChild(splash);
      }, timeoutDuration);
    }

    splash.addEventListener('click', (e) => {
      if (e.target && e.target.closest('.splash-no')) {
        e.stopPropagation();
        dismiss(false);
      } else {
        dismiss(true);
      }
    });
  }

  // Trigger splash screen on app boot
  initSplashScreen();

  /* ──────────────────────────────────────────────────────────
     HELPER — circular spinning-text badge
     ────────────────────────────────────────────────────────── */
  function buildSoundBadge(text) {
    const id = 'circlePath';
    return `
      <svg viewBox="0 0 100 100">
        <defs><path id="${id}" d="M 50,50 m -38,0 a 38,38 0 1,1 76,0 a 38,38 0 1,1 -76,0"/></defs>
        <circle class="dot" cx="50" cy="10" r="2.2"></circle>
        <text><textPath href="#${id}" startOffset="0%">${text}</textPath></text>
      </svg>
    `;
  }

  /* ──────────────────────────────────────────────────────────
     VIEW FACTORY
     ────────────────────────────────────────────────────────── */
  const views = {};
  function makeView(name) {
    const el = document.createElement('div');
    el.className = 'view';
    el.dataset.view = name;
    app.appendChild(el);
    views[name] = el;
    return el;
  }

  /* ══════════�  // Module B: Deterministic 3D Field Layout (16 Curated Floating Positions)
  // 4 Size classes: small (~100-180w), medium (~180-320w), large (~320-520w), extra-large (~500-650w)
  // Rotation: stable -5deg to +4deg per element
  // Spacing: asymmetrical, unequal, overlapping, clear center for Index View toggle
  const LAYOUT = [
    // Top-Left & Far Upper Wing
    { x: -115, y: -95,  sizeClass: 'small',       w: 160, h: 110, rx: -3, ry: 4,  rz: -4, depth: .3 },
    { x: -35,  y: -110, sizeClass: 'medium',      w: 260, h: 175, rx: 4,  ry: -3, rz: 2,  depth: .7 },

    // Top-Right & Upper Outer Wing
    { x: 75,   y: -120, sizeClass: 'large',       w: 440, h: 280, rx: -5, ry: 2,  rz: -2, depth: .6 },
    { x: 185,  y: -100, sizeClass: 'medium',      w: 300, h: 195, rx: 2,  ry: -4, rz: 3,  depth: .8 },

    // Mid-Left & Far Offscreen Left
    { x: -150, y: -15,  sizeClass: 'large',       w: 480, h: 300, rx: 3,  ry: -5, rz: 1,  depth: .85 },
    { x: -75,  y: 15,   sizeClass: 'small',       w: 170, h: 115, rx: -4, ry: 3,  rz: -3, depth: .4 },

    // Off-Center Viewport (Keeping Center 50%, 50% Clear for Index Toggle)
    { x: -22,  y: -30,  sizeClass: 'small',       w: 140, h: 95,  rx: -2, ry: 2,  rz: -1, depth: .35 },
    { x: 130,  y: -20,  sizeClass: 'extra-large', w: 560, h: 350, rx: 4,  ry: -3, rz: 2,  depth: .9 },

    // Mid-Right & Outer Right Wing
    { x: 205,  y: 50,   sizeClass: 'medium',      w: 320, h: 210, rx: -3, ry: 4,  rz: -2, depth: .65 },
    { x: 255,  y: 125,  sizeClass: 'small',       w: 180, h: 120, rx: 2,  ry: -2, rz: 4,  depth: .5 },

    // Lower-Center & Mid Bottom Floor
    { x: -45,  y: 115,  sizeClass: 'extra-large', w: 580, h: 360, rx: -4, ry: 3,  rz: -3, depth: .9 },
    { x: 50,   y: 105,  sizeClass: 'medium',      w: 310, h: 200, rx: 3,  ry: -4, rz: 2,  depth: .7 },

    // Bottom-Left & Lower Edge Boundary
    { x: -135, y: 165,  sizeClass: 'medium',      w: 340, h: 220, rx: -2, ry: 4,  rz: -1, depth: .6 },
    { x: 18,   y: 180,  sizeClass: 'small',       w: 160, h: 105, rx: 4,  ry: -3, rz: 3,  depth: .4 },

    // Bottom-Right & Far Outer Boundary
    { x: 145,  y: 190,  sizeClass: 'large',       w: 460, h: 290, rx: -5, ry: 2,  rz: -2, depth: .75 },
    { x: 235,  y: 215,  sizeClass: 'small',       w: 185, h: 125, rx: 2,  ry: -4, rz: 1,  depth: .45 }
  ];

  function getTileMedia(p, i) {
    if (p && p.thumb) {
      return p.thumbType === 'video'
        ? `<video src="${p.thumb}" muted loop playsinline autoplay></video>`
        : `<img src="${p.thumb}" alt="${p.title || ''}" loading="lazy"/>`;
    }
    const palettes = [
      ['#1a1c29', '#0d0f18', '#3a2e4c'],
      ['#1f1414', '#2a1a15', '#4a2820'],
      ['#0f1f1d', '#0a1413', '#1e4039'],
      ['#1c1a24', '#121019', '#2e283d'],
      ['#161d24', '#0d1217', '#253545'],
      ['#241b18', '#140f0d', '#3d2a23']
    ];
    const g = palettes[i % palettes.length];
    const categoryLabel = (p && p.category ? p.category : 'WORK').toUpperCase();
    const title = p && p.title ? p.title : 'PROJECT';
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="360" height="240" viewBox="0 0 360 240">
      <defs>
        <linearGradient id="bg${i}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${g[0]}"/>
          <stop offset="50%" stop-color="${g[1]}"/>
          <stop offset="100%" stop-color="${g[2]}"/>
        </linearGradient>
      </defs>
      <rect width="360" height="240" fill="url(#bg${i})"/>
      <circle cx="${130 + (i * 45) % 150}" cy="${80 + (i * 35) % 100}" r="90" fill="none" stroke="rgba(255,255,255,0.07)" stroke-width="2"/>
      <rect x="25" y="25" width="310" height="190" fill="none" stroke="rgba(255,255,255,0.09)" stroke-width="1"/>
      <text x="50%" y="42%" dominant-baseline="middle" text-anchor="middle" fill="rgba(201,168,117,0.7)" font-family="sans-serif" font-size="10" letter-spacing="3">${categoryLabel}</text>
      <text x="50%" y="58%" dominant-baseline="middle" text-anchor="middle" fill="rgba(233,231,226,0.85)" font-family="serif" font-size="19" letter-spacing="2">${title}</text>
    </svg>`;
    return `<img src="data:image/svg+xml;utf8,${encodeURIComponent(svg)}" alt="${title}"/>`;
  }

  let hoverIntentTimer = null;
  let hoverExitTimer = null;
  let activeHoveredTile = null;

  function renderField() {
    if (!field) return;
    field.style.display = 'block';
    field.innerHTML = '';
    const isMobile = window.innerWidth < 768;
    const tileScale = isMobile ? 0.40 : 0.65;
    const totalSlots = LAYOUT.length;
    for (let i = 0; i < totalSlots; i++) {
      const p = PROJECTS[i % PROJECTS.length];
      const pos = LAYOUT[i];
      if (!p || !pos) continue;
      const tile = document.createElement('div');
      tile.className = `tile tile-${pos.sizeClass || 'small'}`;
      tile.style.left = (pos.x !== undefined ? pos.x : 50) + '%';
      tile.style.top = (pos.y !== undefined ? pos.y : 50) + '%';
      tile.style.zIndex = Math.round((pos.depth || 0.5) * 100);
      if (pos.w) tile.style.width = Math.round(pos.w * tileScale) + 'px';
      if (pos.h) tile.style.height = Math.round(pos.h * tileScale) + 'px';
      if (pos.aspect) {
        tile.style.aspectRatio = pos.aspect;
        tile.style.height = 'auto';
      }
      tile.dataset.slug = p.slug || '';
      tile.dataset.x = pos.x !== undefined ? pos.x : 50;
      tile.dataset.y = pos.y !== undefined ? pos.y : 50;
      tile.dataset.depth = pos.depth || 0.5;
      tile.dataset.index = i;
      tile.dataset.rx = pos.rx || 0;
      tile.dataset.ry = pos.ry || 0;
      tile.dataset.rz = pos.rz || 0;
      tile.setAttribute('data-cursor', 'Learn More');amily="serif" font-size="19" letter-spacing="2">${title}</text>
    </svg>`;
    return `<img src="data:image/svg+xml;utf8,${encodeURIComponent(svg)}" alt="${title}"/>`;
  }

  let hoverIntentTimer = null;
  let hoverExitTimer = null;
  let activeHoveredTile = null;

  function renderField() {
    if (!field) return;
    field.style.display = 'block';
    field.innerHTML = '';
    const isMobile = window.innerWidth < 768;
    const tileScale = isMobile ? 0.40 : 0.65;
    const totalSlots = LAYOUT.length;
    for (let i = 0; i < totalSlots; i++) {
      const p = PROJECTS[i % PROJECTS.length];
      const pos = LAYOUT[i];
      if (!p || !pos) continue;
      const tile = document.createElement('div');
      tile.className = `tile tile-${pos.sizeClass || 'small'}`;
      tile.style.left = (pos.x !== undefined ? pos.x : 50) + '%';
      tile.style.top = (pos.y !== undefined ? pos.y : 50) + '%';
      tile.style.zIndex = Math.round((pos.depth || 0.5) * 100);
      if (pos.w) tile.style.width = Math.round(pos.w * tileScale) + 'px';
      if (pos.h) tile.style.height = Math.round(pos.h * tileScale) + 'px';
      if (pos.aspect) {
        tile.style.aspectRatio = pos.aspect;
        tile.style.height = 'auto';
      }
      tile.dataset.slug = p.slug || '';
      tile.dataset.x = pos.x !== undefined ? pos.x : 50;
      tile.dataset.y = pos.y !== undefined ? pos.y : 50;
      tile.dataset.depth = pos.depth || 0.5;
      tile.dataset.index = i;
      tile.setAttribute('data-cursor', 'Learn More');

      const media = getTileMedia(p, i);

      tile.innerHTML = `
        <div class="frame">
          ${media}
          <div class="cap">
            <div class="cap-content">
              <span class="more">Learn More</span>
              <h3 class="t">${p.title || ''}</h3>
              ${(p.short || p.description) ? `<p class="d">${p.short || p.description}</p>` : ''}
            </div>
          </div>
        </div>
      `;

      const slug = p.slug || '';
      const startHover = (isTouch) => {
        if (hoverExitTimer) {
          clearTimeout(hoverExitTimer);
          hoverExitTimer = null;
        }
        if (hoverIntentTimer) {
          clearTimeout(hoverIntentTimer);
        }
        const delay = isTouch ? CONFIG.HOVER_TOUCH_DELAY : CONFIG.HOVER_INTENT_DELAY;
        hoverIntentTimer = setTimeout(() => {
          activeHoveredTile = tile;
          tile.dataset.isHovered = 'true';
          if (indexToggle) indexToggle.classList.add('hide-on-hover');

          // Cluster hover (all tiles sharing same project brighten together)
          if (slug) {
            field.querySelectorAll(`.tile[data-slug="${slug}"]`).forEach(t => t.classList.add('is-hovered'));
          } else {
            tile.classList.add('is-hovered');
          }
        }, delay);
      };

      const endHover = () => {
        if (hoverIntentTimer) {
          clearTimeout(hoverIntentTimer);
          hoverIntentTimer = null;
        }
        hoverExitTimer = setTimeout(() => {
          if (activeHoveredTile === tile) {
            activeHoveredTile = null;
          }
          if (indexToggle && !field.querySelector('.tile.is-hovered')) {
            indexToggle.classList.remove('hide-on-hover');
          }
          if (slug) {
            field.querySelectorAll(`.tile[data-slug="${slug}"]`).forEach(t => {
              t.classList.remove('is-hovered');
              delete t.dataset.isHovered;
            });
          } else {
            tile.classList.remove('is-hovered');
            delete tile.dataset.isHovered;
          }
        }, CONFIG.HOVER_EXIT_DELAY);
      };

      tile.addEventListener('mouseenter', () => startHover(false));
      tile.addEventListener('mouseleave', endHover);
      tile.addEventListener('touchstart', () => startHover(true), { passive: true });
      tile.addEventListener('touchend', endHover);
      tile.addEventListener('click', () => go('project', p.slug));
      field.appendChild(tile);
    }
  }
  renderField();

  let lastWasMobile = window.innerWidth < 768;
  window.addEventListener('resize', () => {
    const currentIsMobile = window.innerWidth < 768;
    if (currentIsMobile !== lastWasMobile) {
      lastWasMobile = currentIsMobile;
      renderField();
    }
  });

  let cameraX = 0;
  let cameraY = 0;
  let targetMouseX = 0;
  let targetMouseY = 0;

  const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function updateEdgePanning(e) {
    if (isReducedMotion) return;
    if (e.target && e.target.closest('.index-toggle, .brand, .footer-nav, .sound-toggle')) {
      return;
    }
    const normX = (e.clientX / window.innerWidth) - 0.5;
    const normY = (e.clientY / window.innerHeight) - 0.5;

    targetMouseX = normX;
    targetMouseY = normY;
  }

  window.addEventListener('mousemove', updateEdgePanning);

  function spaceLoop() {
    const isMobile = window.innerWidth < 768;
    const targetCamX = isMobile ? 0 : targetMouseX * 1200;
    const targetCamY = isMobile ? 0 : targetMouseY * 650;

    cameraX += (targetCamX - cameraX) * 0.14;
    cameraY += (targetCamY - cameraY) * 0.14;

    if (field) {
      field.style.transform = `translate3d(${(-cameraX).toFixed(1)}px, ${(-cameraY).toFixed(1)}px, 0px)`;

      field.querySelectorAll('.tile').forEach((t) => {
        const posX = parseFloat(t.dataset.x || '50');
        const posY = parseFloat(t.dataset.y || '50');
        const idx = parseInt(t.dataset.index || '0', 10);

        const normX = (posX - 50) / 120; // -2.2 to +2.5 expanded arc position
        const normY = (posY - 50) / 90;  // -1.8 to +2.0 expanded arc position

        const maxAngle = isMobile ? 0.25 : 0.62;
        const theta = normX * maxAngle; // arc angle in radians (~35deg max)

        // 1800R CURVED MONITOR GEOMETRY (STABLE STATE)
        const concaveFactor = 1 - Math.cos(theta); // 0 at center, ~0.18 at edges
        const domeCoeff = isMobile ? CONFIG.DOME_CURVE_COEFF * CONFIG.MOBILE_MOTION_SCALE.dome : CONFIG.DOME_CURVE_COEFF;
        const cylZ = - (concaveFactor * domeCoeff * 3.4); // Center = 0px, Edges recede away

        // Tangent Y-rotation and X pitch
        const pitchCoeff = isMobile ? CONFIG.PITCH_COEFF * 0.5 : CONFIG.PITCH_COEFF;
        const yawCoeff = isMobile ? CONFIG.YAW_COEFF * 0.5 : CONFIG.YAW_COEFF;
        const cylRotY = (normX) * yawCoeff; // degrees
        const cylRotX = Math.max(-1.0, Math.min(1.0, normY)) * pitchCoeff * 0.35; // degrees

        t.style.transform = `translate(-50%,-50%) translate3d(0px, 0px, ${cylZ.toFixed(1)}px) rotateX(${cylRotX.toFixed(2)}deg) rotateY(${cylRotY.toFixed(2)}deg)`;
      });
    }

    if (views.space && views.space.classList.contains('active')) {
      requestAnimationFrame(spaceLoop);
    }
  }

  /* ══════════════════════════════════════════════════════════
     INDEX VIEW  (#index)
     Numbered project list — full route, not an overlay.
     Hover over a row previews that project's thumb as a faint
     full-screen background behind the list.
     ══════════════════════════════════════════════════════════ */
  let animFrameId = null;

  const indexView = makeView('index');
  indexView.innerHTML = `
    <a class="back-link" href="#space" data-cursor="Close" aria-label="Close Index View and return to main gallery">
      <span class="t1"><span class="arrow">&larr;&nbsp;</span>BACK</span>
      <span class="t2">TO SPACE VIEW</span>
    </a>
    <div class="index-bg" id="indexBg" aria-hidden="true">
      <img class="index-bg-media" id="indexBgImg" alt="">
      <video class="index-bg-media" id="indexBgVid" muted loop playsinline></video>
    </div>
    <div class="index-page-inner">
      <div class="index-list">
        ${PROJECTS.map((p, i) => `
          <div class="row" data-slug="${p.slug}" data-cursor="Open" role="button" tabindex="0"
               aria-label="Open project ${p.title}" style="animation-delay: ${(0.06 + i * 0.05).toFixed(2)}s">
            <span class="n">${String(i + 1).padStart(3, '0').split('').join(' ')}</span>
            <span class="name">${p.title}</span>
          </div>
        `).join('')}
      </div>
    </div>
  `;

  // Row click / keyboard → project page
  indexView.addEventListener('click', (e) => {
    const row = e.target.closest('[data-slug]');
    if (row) go('project', row.dataset.slug);
  });
  indexView.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const row = e.target.closest('[data-slug]');
      if (row) go('project', row.dataset.slug);
    }
  });

  // Hover preview — faint full-screen thumb behind the row list
  const indexBg = indexView.querySelector('#indexBg');
  const indexBgImg = indexView.querySelector('#indexBgImg');
  const indexBgVid = indexView.querySelector('#indexBgVid');

  indexView.querySelectorAll('.row[data-slug]').forEach(row => {
    const proj = PROJECTS.find(p => p.slug === row.dataset.slug);
    row.addEventListener('mouseenter', () => {
      if (!proj || !proj.thumb) { indexBg.classList.remove('show'); return; }
      if (proj.thumbType === 'video') {
        indexBgImg.classList.remove('visible');
        if (indexBgVid.getAttribute('src') !== proj.thumb) {
          indexBgVid.src = proj.thumb;
          indexBgVid.play().catch(() => { });
        }
        indexBgVid.classList.add('visible');
      } else {
        indexBgVid.classList.remove('visible');
        if (indexBgImg.getAttribute('src') !== proj.thumb) {
          indexBgImg.src = proj.thumb;
        }
        indexBgImg.classList.add('visible');
      }
      indexBg.classList.add('show');
    });
    row.addEventListener('mouseleave', () => {
      indexBg.classList.remove('show');
      indexBgImg.classList.remove('visible');
      indexBgVid.classList.remove('visible');
    });
  });

  /* ══════════════════════════════════════════════════════════
     PROJECT VIEW  (#project/<slug>)
     "Back" always returns to Index View.
     ══════════════════════════════════════════════════════════ */
  const projectView = makeView('project');

  function renderProject(slug) {
    const idx = PROJECTS.findIndex(p => p.slug === slug);
    const p = PROJECTS[idx] || PROJECTS[0];
    const next = PROJECTS[(idx + 1) % PROJECTS.length];

    const returnTarget = (lastNavigatedView === 'index') ? 'index' : 'space';
    const returnLabel = (lastNavigatedView === 'index') ? 'To Index View' : 'To Main Gallery';

    const mediaBlock = p.media
      ? (p.media.type === 'video'
        ? `<video src="${p.media.src}" controls poster="${p.media.poster || ''}" playsinline muted data-cursor="View"></video>`
        : `<img src="${p.media.src}" alt="${p.title}" loading="lazy" data-cursor="View"/>`)
      : (p.thumb
        ? `<img src="${p.thumb}" alt="${p.title}" loading="lazy" data-cursor="View"/>`
        : `<div class="ph">
               <span>+ ${p.title} FEATURED MEDIA</span>
               <span style="font-size:9px;letter-spacing:.1em;opacity:.7">Update media path in data.js</span>
             </div>`);

    const metaItems = [];
    if (p.role) metaItems.push({ label: 'ROLE', value: p.role });
    if (p.client) metaItems.push({ label: 'CLIENT', value: p.client });
    if (p.tools) metaItems.push({ label: 'TOOLS', value: Array.isArray(p.tools) ? p.tools.join(', ') : p.tools });
    if (p.mediaKind || p.category) metaItems.push({ label: 'TYPE', value: (p.mediaKind || p.category).toUpperCase() });

    const metaGridHtml = metaItems.length > 0 ? `
      <div class="proj-meta-grid">
        ${metaItems.map(m => `
          <div class="proj-meta-item">
            <span class="pmi-label">${m.label}</span>
            <span class="pmi-val">${m.value}</span>
          </div>
        `).join('')}
      </div>
    ` : '';

    const rows = (p.items || []).map((it, i) => `
      <div class="track-row ${it.type === 'view' ? 'view' : ''}" data-idx="${i}" data-cursor="${it.type === 'view' ? 'View' : 'Play'}">
        <span class="num">${String(i + 1).padStart(2, '0')}</span>
        <span class="tname">${it.title}</span>
        <button class="playmini" aria-label="${it.type === 'view' ? 'View item' : 'Play ' + it.title}">${
          it.type === 'view' 
            ? '<span>View</span>' 
            : `<svg viewBox="0 0 24 24" class="icon-play"><polygon points="8,5 19,12 8,19"/></svg><svg viewBox="0 0 24 24" class="icon-pause"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>`
        }</button>
        <span class="time">${it.meta || '0:00'}</span>
      </div>
    `).join('');

    projectView.innerHTML = `
      <a class="back-link" href="#${returnTarget}" data-cursor="Close" aria-label="Close project view and return">
        <span class="t1"><span class="arrow">&larr;</span>Back</span>
        <span class="t2">${returnLabel}</span>
      </a>
      <div class="proj-head">
        <div class="proj-category">${(p.category || '').toUpperCase()}${p.year ? ' &bull; ' + p.year : ''}</div>
        <h1 class="title">${p.title}</h1>
        ${p.short ? `<div class="proj-short">${p.short}</div>` : ''}
        ${p.description ? `<div class="desc">${p.description}</div>` : ''}
        ${metaGridHtml}
        ${p.moreInfo ? `
          <button class="more-info-toggle" data-more data-cursor="Open">
            <span class="plus">+</span>More info
          </button>
          <div class="more-info-panel" id="moreInfoPanel">${p.moreInfo}</div>
        ` : ''}
      </div>
      <div class="proj-media">
        ${mediaBlock}
        ${p.media && p.media.type === 'video' ? `<div class="play-btn"></div><div class="play-label">Play ${p.mediaKind || 'video'}</div>` : ''}
      </div>
      ${rows ? `<div class="track-list">${rows}</div>` : ''}
      <div class="next-project" data-next data-cursor="View" role="button" tabindex="0" aria-label="Navigate to next project ${next.title}">
        <div class="lbl">Next ${SITE.singularLabel || 'project'}</div>
        <div class="np-title">${next.title}</div>
      </div>
    `;

    projectView.querySelector('[data-next]').addEventListener('click', () => go('project', next.slug));
    const moreBtn = projectView.querySelector('[data-more]');
    if (moreBtn) {
      moreBtn.addEventListener('click', () => {
        document.getElementById('moreInfoPanel').classList.toggle('open');
      });
    }

    projectView.querySelectorAll('.track-row').forEach(row => {
      row.addEventListener('click', () => {
        if (row.classList.contains('view')) return;
        const isPlaying = row.classList.contains('is-playing');
        projectView.querySelectorAll('.track-row').forEach(r => r.classList.remove('is-playing'));
        if (!isPlaying) {
          row.classList.add('is-playing');
        }
      });
    });
  }

  // Keyboard accessibility: Escape key returns to active origin view (Index or Space)
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (views.project && views.project.classList.contains('active')) {
        go(lastNavigatedView === 'index' ? 'index' : 'space');
      } else if (views.index && views.index.classList.contains('active')) {
        go('space');
      } else if (views.about && views.about.classList.contains('active')) {
        go('space');
      } else if (views.contact && views.contact.classList.contains('active')) {
        go('space');
      }
    }
  });

  /* ══════════════════════════════════════════════════════════
     ABOUT VIEW  (#about)
     Four scrollable sections, driven by SITE fields in data.js.
     ══════════════════════════════════════════════════════════ */
  const aboutView = makeView('about');

  const headlineHtml = (SITE.aboutHeadline || []).map(f =>
    `<span class="about-frag about-frag--${f.size}">${f.text}</span>`
  ).join(' ');

  const defaultIntro = 'Multidisciplinary designer operating at the intersection of video editing, UI/UX product design, and visual craft. Specializing in stunt riding films, interactive digital experiences, and brand narratives.';
  const introText = (SITE.aboutIntro && !SITE.aboutIntro.startsWith('TODO')) ? SITE.aboutIntro : defaultIntro;

  const defaultBio = 'Bringing together narrative motion picture cutting, user-centered interface architecture, and graphic typography into a single unified practice. Driven by rhythm, visual clarity, and intentional motion.';
  const bioText = (SITE.aboutBio && !SITE.aboutBio.startsWith('TODO')) ? SITE.aboutBio : defaultBio;

  const toolsHtml = (SITE.aboutTools || []).map(col => `
    <div class="about-tools-col">
      <div class="about-tools-disc">${col.discipline}</div>
      <ul class="about-tools-list">
        ${col.tools.map(t => `<li>${t}</li>`).join('')}
      </ul>
    </div>`).join('');

  const SECTION_COUNT = 4;
  const ticksHtml = Array.from({ length: SECTION_COUNT }, (_, i) =>
    `<button class="ap-tick" data-tick="${i}" data-cursor="Explore" aria-label="Section ${i + 1}"></button>`
  ).join('');

  aboutView.innerHTML = `
    <a class="back-link" href="#space" data-cursor="Close" aria-label="Close About view and return to main gallery">
      <span class="t1"><span class="arrow">&larr;</span>SPACE VIEW</span>
      <span class="t2">BACK TO GALLERY</span>
    </a>

    <nav class="about-progress" id="aboutProgress" aria-label="Page sections">
      ${ticksHtml}
    </nav>

    <div class="about-wrap">
      <section class="about-section about-section--hero" data-section="0">
        <div class="about-bg-layer" id="aboutBgLayer">
          ${SITE.aboutBg ? (SITE.aboutBgType === 'video'
      ? `<video src="${SITE.aboutBg}" muted loop playsinline autoplay class="about-bg-media"></video>`
      : `<img src="${SITE.aboutBg}" alt="" class="about-bg-media">`)
      : `<div class="about-bg-ph">
                 <span>MULTIDISCIPLINARY STUDIO</span>
                 <span class="about-bg-ph-hint">Video Editing &bull; UI/UX Design &bull; Graphic Craft</span>
               </div>`}
        </div>
        <div class="about-headline-wrap">
          <h1 class="about-headline" aria-label="About statement">${headlineHtml}</h1>
          <div class="about-scroll-hint">Scroll down &darr;</div>
        </div>
      </section>

      <section class="about-section about-section--intro" data-section="1">
        <div class="about-section-inner">
          <div class="as-eyebrow">Statement</div>
          <p class="about-intro-text">${introText}</p>
        </div>
      </section>

      <section class="about-section about-section--tools" data-section="2">
        <div class="about-section-inner">
          <div class="as-eyebrow">Tools &amp; Disciplines</div>
          <div class="about-tools-grid">${toolsHtml}</div>
        </div>
      </section>

      <section class="about-section about-section--bio" data-section="3">
        <div class="about-section-inner">
          <div class="as-eyebrow">Background</div>
          <p class="about-bio-text">${bioText}</p>
        </div>
      </section>
    </div>
  `;

  {
    const progressEl = aboutView.querySelector('#aboutProgress');
    const sectionEls = aboutView.querySelectorAll('.about-section');
    const tickEls = progressEl ? Array.from(progressEl.querySelectorAll('.ap-tick')) : [];

    tickEls.forEach((tick, i) => {
      tick.addEventListener('click', () => {
        const sec = sectionEls[i];
        if (sec) aboutView.scrollTo({ top: sec.offsetTop, behavior: 'smooth' });
      });
    });

    if (typeof IntersectionObserver !== 'undefined') {
      const obs = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const idx = parseInt(entry.target.dataset.section, 10);
            tickEls.forEach((t, i) => t.classList.toggle('is-active', i === idx));
          }
        });
      }, { root: aboutView, threshold: 0.45 });
      sectionEls.forEach(s => obs.observe(s));
    }

    const scrollHint = aboutView.querySelector('.about-scroll-hint');
    if (scrollHint) {
      aboutView.addEventListener('scroll', () => { scrollHint.style.opacity = '0'; }, { once: true });
    }
  }

  /* ══════════════════════════════════════════════════════════
     CONTACT VIEW  (#contact)
     ══════════════════════════════════════════════════════════ */
  const contactView = makeView('contact');

  const linksHtml = (SITE.contactLinks || []).map(l =>
    `<a href="${l.href}" data-cursor="Open" target="_blank" rel="noopener" class="contact-pill-link">${l.label}</a>`
  ).join('');

  contactView.innerHTML = `
    <a class="back-link" href="#space" data-cursor="Close" aria-label="Close Contact view and return to main gallery">
      <span class="t1"><span class="arrow">&larr;</span>SPACE VIEW</span>
      <span class="t2">BACK TO GALLERY</span>
    </a>
    <div class="contact-hero-wrap">
      <div class="contact-box">
        <div class="contact-eyebrow">${(SITE.role || 'MULTIDISCIPLINARY DESIGNER').toUpperCase()} &bull; GET IN TOUCH</div>
        <h1 class="contact-main-heading">LET'S CREATE TOGETHER</h1>
        <p class="contact-desc">${SITE.contactText || 'For edits, designs, collabs, or the full reel — reach out.'}</p>
        
        <div class="contact-email-container">
          <a href="mailto:${SITE.email || 'sriram.mj@example.com'}" class="contact-email-btn" data-cursor="Open">
            ${(SITE.email || 'SRIRAM.MJ@EXAMPLE.COM').toUpperCase()}
          </a>
        </div>

        <div class="contact-pills-grid">
          ${linksHtml}
          <a class="contact-pill-link contact-pill-link--highlight" href="#" data-cursor="Open" onclick="alert('Downloading Sriram Resume / Reel'); return false;">
            RESUME / REEL &darr;
          </a>
        </div>

        <div class="contact-signature">
          <span class="cs-name">${(SITE.name || 'SRIRAM MJ').toUpperCase()}</span>
          <span class="cs-dot">&bull;</span>
          <span class="cs-role">MULTIDISCIPLINARY DESIGNER</span>
        </div>
      </div>
    </div>
  `;

  /* ══════════════════════════════════════════════════════════
     ROUTER
     ══════════════════════════════════════════════════════════ */
  function go(view, arg) {
    // Backward-compat redirects
    if (view === 'home' || view === 'work') view = 'space';

    if (view !== activeView) {
      if (activeView !== 'project') {
        lastNavigatedView = activeView;
      }
      activeView = view;
    }

    // Deactivate all views
    Object.values(views).forEach(v => v.classList.remove('active'));

    // Render dynamic content if needed
    if (view === 'project') renderProject(arg);

    // Activate target view (fall back to space)
    const target = views[view] || views.space;
    target.classList.add('active');

    // Update active underline state for bottom navigation links
    if (footerNav) {
      footerNav.querySelectorAll('[data-nav]').forEach(btn => {
        const isWorkNav = btn.dataset.nav === 'space' && (view === 'space' || view === 'index' || view === 'project');
        const isMatch = (btn.dataset.nav === view) || isWorkNav;
        btn.classList.toggle('active', isMatch);
      });
    }

    if (view === 'space' || !view) {
      if (animFrameId) cancelAnimationFrame(animFrameId);
      animFrameId = requestAnimationFrame(spaceLoop);
    } else {
      if (animFrameId) cancelAnimationFrame(animFrameId);
    }

    // About hero background: reveal on arrive (1.2s dwell), reset on leave
    {
      const bgLayer = document.getElementById('aboutBgLayer');
      if (bgLayer) {
        if (view === 'about') setTimeout(() => bgLayer.classList.add('revealed'), 1200);
        else bgLayer.classList.remove('revealed');
      }
    }

    // Reset scroll position for scrollable views
    target.scrollTop = 0;
    const inner = target.querySelector('.index-page-inner');
    if (inner) inner.scrollTop = 0;

    // "+ Index View" toggle only shown while on Space View
    indexToggle.classList.toggle('show', view === 'space');
    const brandEl = document.querySelector('.brand');
    if (brandEl) {
      if (view === 'index') {
        brandEl.style.setProperty('display', 'none', 'important');
      } else {
        brandEl.style.removeProperty('display');
      }
    }

    // Update URL hash (guard prevents double-firing hashchange)
    const newHash = arg ? `${view}/${arg}` : view;
    if (location.hash !== '#' + newHash) location.hash = newHash;
  }

  function routeFromHash() {
    const raw = location.hash.replace('#', '') || 'space';
    const [view, arg] = raw.split('/');
    go(view, arg);
  }

  window.addEventListener('hashchange', routeFromHash);
  // Execute initial routing on script load
  routeFromHash();

  /* ══════════════════════════════════════════════════════════
     CLEAN CONTENT MANAGER / PORTFOLIO EDITOR
     Allows the user to easily add/edit projects and media
     ══════════════════════════════════════════════════════════ */
  const adminBtn = document.createElement('button');
  adminBtn.className = 'admin-trigger';
  adminBtn.innerHTML = `⚡ Manage Content`;
  document.body.appendChild(adminBtn);

  const adminModal = document.createElement('div');
  adminModal.className = 'admin-modal';
  adminModal.innerHTML = `
    <div class="admin-modal-content">
      <div class="admin-header">
        <h2>Portfolio Content Manager</h2>
        <span class="admin-close">&times;</span>
      </div>
      <div class="admin-body">
        <div class="admin-form-group">
          <label>Select Project to Edit or Add New</label>
          <select id="adminProjSelect">
            <option value="__new__">+ Add New Project</option>
            ${PROJECTS.map((p, idx) => `<option value="${idx}">${p.title} (${p.category})</option>`).join('')}
          </select>
        </div>
        <div class="admin-form-group">
          <label>Project Title</label>
          <input type="text" id="adminTitle" placeholder="e.g. NIGHT RIDE" />
        </div>
        <div class="admin-form-group">
          <label>Category</label>
          <select id="adminCategory">
            <option value="Video">Video Editing</option>
            <option value="UI/UX">UI/UX Design</option>
            <option value="Graphic Design">Graphic Design</option>
          </select>
        </div>
        <div class="admin-form-group">
          <label>Short Caption (Hover Subtitle)</label>
          <input type="text" id="adminShort" placeholder="e.g. A night stunt run cut to a driving score" />
        </div>
        <div class="admin-form-group">
          <label>Full Description</label>
          <textarea id="adminDesc" rows="3" placeholder="Describe the concept, tools, story..."></textarea>
        </div>
        <div class="admin-form-group">
          <label>Thumbnail Media Path / URL (e.g. media/night-ride.jpg)</label>
          <input type="text" id="adminThumb" placeholder="media/filename.jpg" />
        </div>
      </div>
      <div class="admin-actions">
        <button class="admin-btn admin-btn-secondary" id="adminCloseBtn">Cancel</button>
        <button class="admin-btn admin-btn-primary" id="adminSaveBtn">Save & Apply Live</button>
      </div>
    </div>
  `;
  document.body.appendChild(adminModal);

  const adminProjSelect = adminModal.querySelector('#adminProjSelect');
  const adminTitle = adminModal.querySelector('#adminTitle');
  const adminCategory = adminModal.querySelector('#adminCategory');
  const adminShort = adminModal.querySelector('#adminShort');
  const adminDesc = adminModal.querySelector('#adminDesc');
  const adminThumb = adminModal.querySelector('#adminThumb');

  function populateAdminForm() {
    const val = adminProjSelect.value;
    if (val === '__new__') {
      adminTitle.value = '';
      adminCategory.value = 'Video';
      adminShort.value = '';
      adminDesc.value = '';
      adminThumb.value = '';
    } else {
      const p = PROJECTS[parseInt(val, 10)];
      if (p) {
        adminTitle.value = p.title || '';
        adminCategory.value = p.category || 'Video';
        adminShort.value = p.short || '';
        adminDesc.value = p.description || '';
        adminThumb.value = p.thumb || '';
      }
    }
  }

  adminProjSelect.addEventListener('change', populateAdminForm);

  adminBtn.addEventListener('click', () => {
    populateAdminForm();
    adminModal.classList.add('open');
  });

  const closeModal = () => adminModal.classList.remove('open');
  adminModal.querySelector('.admin-close').addEventListener('click', closeModal);
  adminModal.querySelector('#adminCloseBtn').addEventListener('click', closeModal);

  adminModal.querySelector('#adminSaveBtn').addEventListener('click', () => {
    const val = adminProjSelect.value;
    const titleVal = adminTitle.value.trim();
    if (!titleVal) { alert('Please enter a project title'); return; }

    const slug = titleVal.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const projData = {
      slug: slug,
      title: titleVal,
      category: adminCategory.value,
      short: adminShort.value,
      description: adminDesc.value,
      thumb: adminThumb.value,
      items: [{ title: 'Main View', type: 'play', meta: '0:00' }]
    };

    if (val === '__new__') {
      PROJECTS.push(projData);
    } else {
      const idx = parseInt(val, 10);
      PROJECTS[idx] = { ...PROJECTS[idx], ...projData };
    }

    renderField();
    closeModal();
  });

  window.addEventListener('hashchange', routeFromHash);
  routeFromHash(); // initial render

  /* ══════════════════════════════════════════════════════════
     CUSTOM TYPOGRAPHIC CURSOR (STEP 1)
     Desktop-only trailing text cursor with per-character inertia
     ══════════════════════════════════════════════════════════ */
  function initCustomCursor() {
    // Desktop only — check for fine pointer and hover capabilities
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
    let charData = []; // [{ el, baseOffsetX, x, y, opacity, targetOpacity }]

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

      // Temporary element to measure character width and base offset
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

          // Per-character inertia easing (char 0 fastest, trailing chars decay)
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

    // Global Event Delegation for data-cursor attribute
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

  initCustomCursor();

})();
