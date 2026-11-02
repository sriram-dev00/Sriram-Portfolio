/**
 * SpaceEngine3D — True Three.js WebGL Cylindrical Space Engine
 * Directly implements the 3D spatial geometry, shaders, camera orbit, and interaction
 * model of the reference design (michaelgatt.com).
 */

(function (window) {
  'use strict';

  if (typeof THREE === 'undefined') {
    console.error('Three.js is required for SpaceEngine3D.');
    return;
  }

  // ═════════════════════════════════════════════════════════════════════════════
  // 1. GLSL SHADERS (Matching Michael Gatt's vertex and fragment shaders)
  // ═════════════════════════════════════════════════════════════════════════════

  const vertexShader = `
    uniform float uCurveAmountX;
    uniform float uCurveAmountY;
    uniform float uImageWidth;
    uniform float uImageHeight;
    uniform float uSizeFactorX;
    uniform float uSizeFactorY;
    uniform float uTiltAngle;
    varying vec2 vUv;
    varying float fogDepth;

    void main() {
      vUv = uv;
      vec3 pos = position;

      // Parabolic surface bending matching Michael Gatt's 20x20 mesh curvature
      float percentageX = (abs(pos.x) / (uImageWidth * 0.5)) * 1000.0;
      float percentageY = (abs(pos.y) / (uImageHeight * 0.5)) * 1000.0;
      pos.z += uCurveAmountX * pow(percentageX, 2.0) * 0.003 * uSizeFactorX;
      pos.z += uCurveAmountY * pow(percentageY, 2.0) * 0.003 * uSizeFactorY;

      // Subtle dynamic tilt along mesh Y
      pos.z += pos.y * tan(uTiltAngle);

      vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
      fogDepth = -mvPosition.z;
      gl_Position = projectionMatrix * mvPosition;
    }
  `;

  const fragmentShader = `
    uniform sampler2D uTexture;
    uniform float uOpacity;
    uniform float uWarpProgress;
    uniform vec3 fogColor;
    uniform float fogNear;
    uniform float fogFar;
    varying vec2 vUv;
    varying float fogDepth;

    void main() {
      vec2 centeredUV = vUv - 0.5;
      float x = smoothstep(0.0, 1.0, (uWarpProgress * 2.0 + abs(centeredUV.y) * 2.0 - 1.0));
      vec2 warpedUV = mix(vUv, centeredUV * (1.0 - x) + 0.5, x);
      vec4 texColor = texture2D(uTexture, warpedUV);

      float warpOpacity = mix(1.0, 0.0, x);
      texColor.a *= uOpacity * warpOpacity;

      // Linear distance fog blending into the black void
      float fogFactor = smoothstep(fogNear, fogFar, fogDepth);
      texColor.rgb = mix(texColor.rgb, fogColor, fogFactor);

      gl_FragColor = texColor;
    }
  `;

  // ═════════════════════════════════════════════════════════════════════════════
  // 2. SPACE ENGINE CLASS
  // ═════════════════════════════════════════════════════════════════════════════

  class SpaceEngine3D {
    constructor(container, options = {}) {
      this.container = container;
      this.options = options;
      this.onHoverTile = options.onHoverTile || null;
      this.onClickTile = options.onClickTile || null;

      // Scene & Camera
      this.scene = null;
      this.camera = null;
      this.renderer = null;
      this.canvas = null;
      this.fog = null;

      // Interaction & Raycasting
      this.raycaster = new THREE.Raycaster();
      this.mouse = new THREE.Vector2(-1000, -1000);
      this.targetMouse = new THREE.Vector2(0, 0);
      this.smoothMouse = new THREE.Vector2(0, 0);

      // Camera sway & orbit
      this.targetRotY = 0;
      this.currentRotY = 0;
      this.targetPosY = 0;
      this.currentPosY = 0;
      this.maxRotY = 0;
      this.maxTravelY = 0;

      // Drag & touch navigation
      this.isPointerDown = false;
      this.isDragging = false;
      this.dragStartX = 0;
      this.dragStartY = 0;
      this.lastDragX = 0;
      this.lastDragY = 0;
      this.dragDistance = 0;
      this.dragVelocityY = 0;
      this.dragVelocityRotY = 0;

      // Dynamic movement curvature engine (curves ONLY when surfing mouse right or left)
      this.currentCurveAmountX = 0.0;
      this.targetCurveAmountX = 0.0;
      this.pointerSpeedX = 0.0;
      this.lastPointerX = null;
      this.lastPointerTime = null;
      this.pointerSpeedTimer = null;
      this.prevRotY = 0.0;
      this._wasCurved = false;

      // Mesh collection
      this.meshes = [];
      this.textureLoader = new THREE.TextureLoader();
      this.videoElements = [];
      this.activeHoveredMesh = null;
      this.hoverExitTimer = null;

      // Animation & Lifecycle
      this.isRunning = false;
      this.rafId = null;
      this.lastTime = performance.now();
      this.gatePassed = sessionStorage.getItem('portfolio_gate_passed') === 'true';
      this.isUnfolding = false;
      this.unfoldStartTime = 0;
      this.isCameraSwooping = false;
      this.cameraSwoopStartTime = 0;
      this.cameraSwoopFactor = this.gatePassed ? 1.0 : 0.0;
      this.isFlyingIn = false;
      this.entranceStartTime = 0;

      // Bound handlers
      this._onResize = this._onResize.bind(this);
      this._onPointerMove = this._onPointerMove.bind(this);
      this._onPointerDown = this._onPointerDown.bind(this);
      this._onPointerUp = this._onPointerUp.bind(this);
      this._onPointerCancel = this._onPointerCancel.bind(this);
      this._onWheel = this._onWheel.bind(this);
      this._onDblClick = this._onDblClick.bind(this);
      this._loop = this._loop.bind(this);

      this.init();
    }

    init() {
      const width = this.container.clientWidth || window.innerWidth;
      const height = this.container.clientHeight || window.innerHeight;

      // 1. Scene
      this.scene = new THREE.Scene();
      this.scene.background = new THREE.Color(0x000000);

      // Distance fog matching Michael Gatt (fades peripheral and background tiles into black void)
      this.fog = new THREE.Fog(0x000000, 2200, 5800);
      this.scene.fog = this.fog;

      // 2. Perspective Camera (50.0° vertical FOV matching reference)
      this.camera = new THREE.PerspectiveCamera(50, width / height, 10, 16000);
      this.camera.position.set(0, 0, 0);
      this.camera.rotation.set(0, 0, 0);

      // 3. WebGL Renderer
      this.renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: false,
        powerPreference: 'high-performance'
      });
      this.renderer.setSize(width, height);
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      this.canvas = this.renderer.domElement;
      this.container.appendChild(this.canvas);

      // 4. Update Camera Geometry Limits
      this._updateCameraLimits();

      // 5. Populate 270° Cylindrical World
      this._createCylindricalMeshes();

      // 6. Attach Event Listeners
      window.addEventListener('resize', this._onResize);
      window.addEventListener('pointermove', this._onPointerMove, { passive: true });
      window.addEventListener('pointerdown', this._onPointerDown);
      window.addEventListener('pointerup', this._onPointerUp);
      window.addEventListener('pointercancel', this._onPointerCancel);
      window.addEventListener('wheel', this._onWheel, { passive: false });
      window.addEventListener('dblclick', this._onDblClick);

      this.start();
    }

    _updateCameraLimits() {
      const width = this.container.clientWidth || window.innerWidth;
      const height = this.container.clientHeight || window.innerHeight;
      this.camera.aspect = width / height;
      this.camera.updateProjectionMatrix();

      // Reference canvas math: 5760x3100 coordinate space
      const isMobile = width < 768;
      const refW = isMobile ? 2137 : 5760;
      const refH = isMobile ? 1644 : 3100;
      const populatedAngle = isMobile ? 360 : 270;
      const minRadius = 2500;
      const circumference = 2 * Math.PI * minRadius;
      const usedCircumference = circumference * (populatedAngle / 360);
      const cylinderHeight = usedCircumference / (refW / refH);

      // Horizontal FOV calculation
      const vfovRad = (50 / 2) * (Math.PI / 180);
      const hfovRad = 2 * Math.atan(Math.tan(vfovRad) * this.camera.aspect);
      const hfovDeg = hfovRad * (180 / Math.PI);

      // Maximum yaw rotation: half populated angle minus half camera FOV
      // Allows camera to sweep across the full 270° cylinder without viewing empty space behind
      const halfAngle = populatedAngle / 2;
      this.maxRotY = THREE.MathUtils.degToRad(halfAngle - (hfovDeg / 2));

      // Vertical travel: half cylinder height minus viewport margin
      this.maxTravelY = (cylinderHeight / 2) - height * 0.45;
    }

    _createCylindricalMeshes() {
      const projects = this.options.projects || [];
      const layout = this.options.layout || [];
      const isMobile = window.innerWidth < 768;

      const refW = isMobile ? 2137 : 5760;
      const refH = isMobile ? 1644 : 3100;
      const minRadius = 2500;
      const maxRadius = 5500;
      const populatedAngle = isMobile ? 360 : 270;
      const halfPopulateAngleRad = THREE.MathUtils.degToRad(populatedAngle / 2);
      const circumference = 2 * Math.PI * minRadius;
      const usedCircumference = circumference * (populatedAngle / 360);
      const cylinderHeight = usedCircumference / (refW / refH);
      const scaleUpFactor = usedCircumference / refW;

      // Max anisotropy for razor-sharp textures at oblique angles
      const maxAniso = this.renderer.capabilities.getMaxAnisotropy ? this.renderer.capabilities.getMaxAnisotropy() : 4;

      layout.forEach((slot, i) => {
        const slotNum = slot.slot || (i + 1);
        const project = (projects && Array.isArray(projects) ? projects.find(p => p.slot === slotNum) : null) || projects[i] || {};
        const mediaSrc = project.thumb || project.image || project.src || (project.media && project.media.src) || '';
        if (!mediaSrc) return;

        const isVideo = project.mediaKind === 'video' || project.type === 'video' || (typeof mediaSrc === 'string' && mediaSrc.endsWith('.mp4'));

        // Proportional sizing enlarged by +25% and expanded by +10%
        const SIZE_SCALE = 1.25 * 1.10; // 1.375 (+10% expansion)
        const baseW = (slot.w || 240) * scaleUpFactor * 1.05 * 1.15 * SIZE_SCALE;
        const baseH = (slot.h || 160) * scaleUpFactor * 1.05 * 1.15 * SIZE_SCALE;

        // Depth distance: slots with lower zPx are pushed deeper into the cylinder radius
        const zNorm = THREE.MathUtils.clamp((slot.zPx + 250) / 350, 0, 1);
        const radius = minRadius + (maxRadius - minRadius) * (1.0 - zNorm * 0.42);

        // Normalized 2D canvas coordinates
        const normX = (slot.x / refW) + 0.5;
        const normY = (slot.y / refH) + 0.5;

        // Cylindrical polar angle
        const angleRad = -Math.PI / 2 + (normX * populatedAngle * (Math.PI / 180)) - halfPopulateAngleRad;

        // 3D position on cylinder surface
        const posX = radius * Math.cos(angleRad);
        const posY = (0.5 - normY) * cylinderHeight;
        const posZ = radius * Math.sin(angleRad);

        // Plane geometry (flat, uncurved, razor sharp)
        const geometry = new THREE.PlaneGeometry(baseW, baseH, 1, 1);

        // Helper to adjust geometry to the image's true natural aspect ratio
        const applyNaturalAspect = (nw, nh, targetMesh) => {
          if (!nw || !nh || !targetMesh) return;
          const imageAspect = nw / nh;
          const targetArea = baseW * baseH;
          const w = Math.sqrt(targetArea * imageAspect);
          const h = w / imageAspect;

          targetMesh.geometry.dispose();
          targetMesh.geometry = new THREE.PlaneGeometry(w, h, 1, 1);
          if (targetMesh.material.uniforms.uImageWidth) targetMesh.material.uniforms.uImageWidth.value = w;
          if (targetMesh.material.uniforms.uImageHeight) targetMesh.material.uniforms.uImageHeight.value = h;
          if (targetMesh.material.uniforms.uSizeFactorX) targetMesh.material.uniforms.uSizeFactorX.value = w / 2000;
          if (targetMesh.material.uniforms.uSizeFactorY) targetMesh.material.uniforms.uSizeFactorY.value = h / 2000;
        };

        // Texture creation
        let texture = null;
        let createdMesh = null;
        if (isVideo) {
          const video = document.createElement('video');
          video.src = mediaSrc;
          video.crossOrigin = 'anonymous';
          video.loop = true;
          video.muted = true;
          video.playsInline = true;
          video.addEventListener('loadedmetadata', () => {
            if (createdMesh) applyNaturalAspect(video.videoWidth, video.videoHeight, createdMesh);
          });
          video.play().catch(() => {});
          this.videoElements.push(video);
          texture = new THREE.VideoTexture(video);
          texture.minFilter = THREE.LinearFilter;
          texture.magFilter = THREE.LinearFilter;
          texture.format = THREE.RGBAFormat;
        } else {
          texture = this.textureLoader.load(mediaSrc, (loadedTex) => {
            if (loadedTex && loadedTex.image && createdMesh) {
              const nw = loadedTex.image.naturalWidth || loadedTex.image.width;
              const nh = loadedTex.image.naturalHeight || loadedTex.image.height;
              applyNaturalAspect(nw, nh, createdMesh);
            }
          });
          texture.generateMipmaps = true;
          texture.minFilter = THREE.LinearMipmapLinearFilter;
          texture.magFilter = THREE.LinearFilter;
        }

        if (texture && maxAniso) {
          texture.anisotropy = maxAniso;
        }

        // Custom Shader Material matching Michael Gatt
        const material = new THREE.ShaderMaterial({
          vertexShader: vertexShader,
          fragmentShader: fragmentShader,
          uniforms: {
            uTexture: { value: texture },
            uOpacity: { value: 0.92 },
            uWarpProgress: { value: 0.0 },
            uCurveAmountX: { value: 0.0 },
            uCurveAmountY: { value: 0.0 },
            uImageWidth: { value: baseW },
            uImageHeight: { value: baseH },
            uSizeFactorX: { value: baseW / 2000 },
            uSizeFactorY: { value: baseH / 2000 },
            uTiltAngle: { value: THREE.MathUtils.degToRad(slot.rx || 0) },
            fogColor: { value: this.fog.color },
            fogNear: { value: this.fog.near },
            fogFar: { value: this.fog.far }
          },
          transparent: true,
          side: THREE.DoubleSide,
          fog: true
        });

        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(posX, posY, posZ);
        createdMesh = mesh;

        // If texture image is already available in cache, apply natural aspect immediately
        if (texture.image && (texture.image.naturalWidth || texture.image.width)) {
          const nw = texture.image.naturalWidth || texture.image.width;
          const nh = texture.image.naturalHeight || texture.image.height;
          applyNaturalAspect(nw, nh, mesh);
        }

        // Physical lookAt: Mesh faces inward toward the central vertical cylinder axis (0, y, 0)
        mesh.lookAt(0, posY, 0);

        // Subtle slot tilt fine-tuning
        if (slot.rz) {
          mesh.rotation.z += THREE.MathUtils.degToRad(slot.rz);
        }

        mesh.updateMatrixWorld();
        mesh.originalQuaternion = mesh.quaternion.clone();

        // Reference Michael Gatt folded state (Q(6)):
        // 30 deg (PI / 6) outward cant based on camera projection
        const worldPos = new THREE.Vector3().setFromMatrixPosition(mesh.matrixWorld);
        const projectedX = worldPos.project(this.camera).x;
        const foldAngle = projectedX < 0 ? (Math.PI / 6) : -(Math.PI / 6);
        mesh.foldedQuaternion = mesh.originalQuaternion.clone().multiply(
          new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), foldAngle)
        );

        if (!this.gatePassed) {
          mesh.quaternion.copy(mesh.foldedQuaternion);
          mesh.material.uniforms.uOpacity.value = 0.50;
        } else {
          mesh.quaternion.copy(mesh.originalQuaternion);
          mesh.material.uniforms.uOpacity.value = 0.92;
        }

        mesh.userData = {
          slotIndex: i,
          slot: slot,
          project: project,
          slug: project.slug || project.targetSlug || '',
          baseScale: 1.0,
          baseOpacity: 0.92,
          originalRadius: radius
        };

        this.scene.add(mesh);
        this.meshes.push(mesh);
      });
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // 3. INTERACTION & CAMERA SWAY ENGINE
    // ═══════════════════════════════════════════════════════════════════════════

    _onPointerMove(e) {
      const width = window.innerWidth;
      const height = window.innerHeight;

      // Normalized coordinates (-1 to +1)
      this.targetMouse.x = (e.clientX / width) * 2 - 1;
      this.targetMouse.y = -(e.clientY / height) * 2 + 1;

      // Track horizontal pointer speed for dynamic surf curvature
      const now = performance.now();
      if (this.lastPointerX !== null && this.lastPointerTime !== null) {
        const dt = Math.max(1, now - this.lastPointerTime);
        const dx = e.clientX - this.lastPointerX;
        const instSpeed = Math.abs(dx) / dt;
        this.pointerSpeedX += (instSpeed - this.pointerSpeedX) * 0.45;
      }
      this.lastPointerX = e.clientX;
      this.lastPointerTime = now;
      clearTimeout(this.pointerSpeedTimer);
      this.pointerSpeedTimer = setTimeout(() => {
        this.pointerSpeedX = 0;
        this.lastPointerX = null;
        this.lastPointerTime = null;
      }, 70);

      if (!this.isRunning) return;

      if (this.isPointerDown) {
        const dx = e.clientX - this.lastDragX;
        const dy = e.clientY - this.lastDragY;
        this.dragDistance += Math.hypot(dx, dy);

        if (this.dragDistance > 6) {
          this.isDragging = true;
        }

        // Direct-manipulation dragging across the cylinder
        const rotDelta = -(dx / width) * this.maxRotY * 1.5;
        const posDelta = -(dy / height) * this.maxTravelY * 1.5;

        this.targetRotY += rotDelta;
        this.targetPosY += posDelta;
        this.dragVelocityRotY = rotDelta;
        this.dragVelocityY = posDelta;

        this.lastDragX = e.clientX;
        this.lastDragY = e.clientY;
      }

      // Raycast for hover testing
      this.mouse.x = (e.clientX / width) * 2 - 1;
      this.mouse.y = -(e.clientY / height) * 2 + 1;

      if (!this.isDragging) {
        this._checkIntersection();
      }
    }

    _onPointerDown(e) {
      const targetEl = (e.target && typeof e.target.closest === 'function') ? e.target : null;
      if (targetEl && targetEl.closest('button, a, .fixed-footer, .brand-header, .index-toggle, .audio-toggle, .space-center-desc')) {
        return;
      }
      this.isPointerDown = true;
      this.isDragging = false;
      this.dragStartX = e.clientX;
      this.dragStartY = e.clientY;
      this.lastDragX = e.clientX;
      this.lastDragY = e.clientY;
      this.dragDistance = 0;
      this.dragVelocityRotY = 0;
      this.dragVelocityY = 0;
    }

    _onPointerUp(e) {
      if (!this.isPointerDown) return;
      this.isPointerDown = false;

      // If clicked without dragging, trigger navigation
      if (this.dragDistance <= 6) {
        this._handleClick(e);
      }

      setTimeout(() => {
        this.isDragging = false;
      }, 50);
    }

    _onPointerCancel() {
      this.isPointerDown = false;
      this.isDragging = false;
    }

    _onWheel(e) {
      if (!this.isRunning) return;
      const targetEl = (e.target && typeof e.target.closest === 'function') ? e.target : null;
      if (targetEl && targetEl.closest('.project-page, .about-page, .contact-view, .index-page-inner')) return;

      e.preventDefault();
      // Trackpad 2-finger horizontal swipe or mouse wheel
      const swipeSpeed = Math.min(1.8, (Math.abs(e.deltaX) + Math.abs(e.deltaY)) / 45);
      this.pointerSpeedX = Math.max(this.pointerSpeedX || 0, swipeSpeed);
      clearTimeout(this.pointerSpeedTimer);
      this.pointerSpeedTimer = setTimeout(() => {
        this.pointerSpeedX = 0;
      }, 100);

      if (Math.abs(e.deltaX) > 0.5) {
        this.targetRotY -= (e.deltaX / window.innerWidth) * this.maxRotY * 0.8;
      }
      if (Math.abs(e.deltaY) > 0.5) {
        if (e.shiftKey || Math.abs(e.deltaX) === 0) {
          this.targetRotY -= (e.deltaY / window.innerWidth) * this.maxRotY * 0.8;
          this.targetPosY -= (e.deltaY / window.innerHeight) * this.maxTravelY * 0.2;
        } else {
          this.targetPosY -= (e.deltaY / window.innerHeight) * this.maxTravelY * 0.8;
        }
      }
    }

    _onDblClick(e) {
      const targetEl = (e.target && typeof e.target.closest === 'function') ? e.target : null;
      if (targetEl && targetEl.closest('button, a, .fixed-footer, .brand-header, .index-toggle, .audio-toggle')) return;
      // Recenter smoothly
      this.targetRotY = 0;
      this.targetPosY = 0;
      this.dragVelocityRotY = 0;
      this.dragVelocityY = 0;
    }

    _checkIntersection() {
      this.raycaster.setFromCamera(this.mouse, this.camera);
      const intersects = this.raycaster.intersectObjects(this.meshes);

      if (intersects.length > 0) {
        const hitMesh = intersects[0].object;
        if (this.activeHoveredMesh !== hitMesh) {
          clearTimeout(this.hoverExitTimer);
          this.activeHoveredMesh = hitMesh;

          // Apply Michael Gatt's hover spotlight: active category/tile stays 1.0, non-active dim to 0.20
          this.meshes.forEach((mesh) => {
            const isHovered = mesh === hitMesh;
            mesh.material.uniforms.uOpacity.value = isHovered ? 1.0 : 0.20;
            mesh.scale.set(isHovered ? 1.03 : 1.0, isHovered ? 1.03 : 1.0, 1.0);
          });

          if (this.onHoverTile && hitMesh.userData.project) {
            this.onHoverTile(hitMesh.userData.project);
          }
        }
      } else if (this.activeHoveredMesh) {
        clearTimeout(this.hoverExitTimer);
        this.hoverExitTimer = setTimeout(() => {
          this.activeHoveredMesh = null;
          this.meshes.forEach((mesh) => {
            mesh.material.uniforms.uOpacity.value = mesh.userData.baseOpacity;
            mesh.scale.set(1.0, 1.0, 1.0);
          });
          if (this.onHoverTile) {
            this.onHoverTile(null);
          }
        }, 60);
      }
    }

    _handleClick(e) {
      this.raycaster.setFromCamera(this.mouse, this.camera);
      const intersects = this.raycaster.intersectObjects(this.meshes);
      if (intersects.length > 0) {
        const hitMesh = intersects[0].object;
        const project = hitMesh.userData.project;
        if (this.onClickTile && project) {
          this.onClickTile(project);
        }
      }
    }

    _onResize() {
      if (!this.renderer || !this.camera) return;
      const width = this.container.clientWidth || window.innerWidth;
      const height = this.container.clientHeight || window.innerHeight;
      this.renderer.setSize(width, height);
      this._updateCameraLimits();
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // 4. ANIMATION & RENDER LOOP
    // ═══════════════════════════════════════════════════════════════════════════

    start() {
      if (this.isRunning) return;
      this.isRunning = true;
      this.videoElements.forEach((v) => v.play().catch(() => {}));
      this.rafId = requestAnimationFrame(this._loop);
    }

    triggerEntranceUnfold() {
      this.gatePassed = true;
      this.isUnfolding = true;
      this.unfoldStartTime = performance.now();
      this.isCameraSwooping = true;
      this.cameraSwoopStartTime = performance.now();
      this.camera.position.set(0, 0, 0);
      this.start();
    }

    stop() {
      this.isRunning = false;
      if (this.rafId) {
        cancelAnimationFrame(this.rafId);
        this.rafId = null;
      }
      this.videoElements.forEach((v) => v.pause());
    }

    _loop(now) {
      if (!this.isRunning) return;

      // 1. Smooth mouse coordinate interpolation
      this.smoothMouse.x += (this.targetMouse.x - this.smoothMouse.x) * 0.05;
      this.smoothMouse.y += (this.targetMouse.y - this.smoothMouse.y) * 0.05;

      // 2. Camera swoop dampening on initial entry (2.0s duration Power4.easeOut matching Michael Gatt)
      if (this.isCameraSwooping) {
        const elapsed = (now - this.cameraSwoopStartTime) / 2000;
        if (elapsed >= 1.0) {
          this.isCameraSwooping = false;
          this.cameraSwoopFactor = 1.0;
        } else {
          this.cameraSwoopFactor = 1 - Math.pow(1 - elapsed, 4); // Power4.easeOut
        }
      } else {
        this.cameraSwoopFactor = this.gatePassed ? 1.0 : 0.0;
      }

      // 3. Mouse sway calculations when not dragging
      if (!this.isPointerDown) {
        // Natural mouse sway across cylinder yaw
        const swayRotY = -this.smoothMouse.x * this.maxRotY * this.cameraSwoopFactor;
        const swayPosY = this.smoothMouse.y * this.maxTravelY * this.cameraSwoopFactor;

        // Inertia coasting after drag release
        if (Math.abs(this.dragVelocityRotY) > 0.0001 || Math.abs(this.dragVelocityY) > 0.1) {
          this.targetRotY += this.dragVelocityRotY;
          this.targetPosY += this.dragVelocityY;
          this.dragVelocityRotY *= 0.90;
          this.dragVelocityY *= 0.90;
        } else {
          // If no active drag, smooth towards resting mouse sway position
          this.targetRotY += (swayRotY - this.targetRotY) * 0.04;
          this.targetPosY += (swayPosY - this.targetPosY) * 0.04;
        }
      }

      // Clamp yaw within cylinder arc limits
      this.targetRotY = THREE.MathUtils.clamp(this.targetRotY, -this.maxRotY * 1.05, this.maxRotY * 1.05);
      this.targetPosY = THREE.MathUtils.clamp(this.targetPosY, -this.maxTravelY, this.maxTravelY);

      // Smooth camera interpolation
      this.currentRotY += (this.targetRotY - this.currentRotY) * 0.055;
      this.currentPosY += (this.targetPosY - this.currentPosY) * 0.055;

      // In-place camera yaw orbit matching Michael Gatt (camera.position is locked to 0)
      this.camera.rotation.y = this.currentRotY;
      this.camera.position.y = this.currentPosY;
      this.camera.position.x = 0;
      this.camera.position.z = 0;
      this.camera.rotation.x = 0;
      this.camera.rotation.z = 0;

      // 4. Origami Mesh Unfolding Animation (0.75s Power4.easeOut matching Michael Gatt)
      if (this.isUnfolding) {
        const elapsed = (now - this.unfoldStartTime) / 750;
        if (elapsed >= 1.0) {
          this.isUnfolding = false;
          this.meshes.forEach((m) => {
            if (m.originalQuaternion) m.quaternion.copy(m.originalQuaternion);
            if (m.material.uniforms.uOpacity) m.material.uniforms.uOpacity.value = m.userData.baseOpacity || 0.92;
          });
        } else {
          const ease = 1 - Math.pow(1 - elapsed, 4); // Power4.easeOut
          this.meshes.forEach((m) => {
            if (m.foldedQuaternion && m.originalQuaternion) {
              m.quaternion.slerpQuaternions(m.foldedQuaternion, m.originalQuaternion, ease);
            }
            if (m.material.uniforms.uOpacity) {
              const baseOp = m.userData.baseOpacity || 0.92;
              m.material.uniforms.uOpacity.value = 0.50 + (baseOp - 0.50) * ease;
            }
          });
        }
      }

      // Render Three.js WebGL scene
      this.renderer.render(this.scene, this.camera);

      this.rafId = requestAnimationFrame(this._loop);
    }

    destroy() {
      this.stop();
      window.removeEventListener('resize', this._onResize);
      window.removeEventListener('pointermove', this._onPointerMove);
      window.removeEventListener('pointerdown', this._onPointerDown);
      window.removeEventListener('pointerup', this._onPointerUp);
      window.removeEventListener('pointercancel', this._onPointerCancel);
      window.removeEventListener('wheel', this._onWheel);
      window.removeEventListener('dblclick', this._onDblClick);

      this.videoElements.forEach((v) => {
        v.pause();
        v.src = '';
        v.load();
      });
      this.videoElements = [];

      this.meshes.forEach((mesh) => {
        if (mesh.geometry) mesh.geometry.dispose();
        if (mesh.material) {
          if (mesh.material.uniforms && mesh.material.uniforms.uTexture && mesh.material.uniforms.uTexture.value) {
            mesh.material.uniforms.uTexture.value.dispose();
          }
          mesh.material.dispose();
        }
        this.scene.remove(mesh);
      });
      this.meshes = [];

      if (this.renderer) {
        this.renderer.dispose();
        if (this.canvas && this.canvas.parentNode) {
          this.canvas.parentNode.removeChild(this.canvas);
        }
      }
    }
  }

  window.SpaceEngine3D = SpaceEngine3D;

})(window);
