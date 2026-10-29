import React, { useMemo, useRef, useEffect, useState, useCallback } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { useWindowSize } from '../../hooks/useWindowSize';
import { PROJECTS, TILE_LAYOUTS, SPACE_CONFIG } from '../../data/portfolioData';
import { ComputedTile, Project } from '../../types/portfolio';
import { Tile } from './Tile';
import { CenterDescription } from './CenterDescription';

export const SpaceView: React.FC = () => {
  const { activeView, activeHoveredProject, setActiveHoveredProject, navigate, isGatePassed, isGateExiting } = usePortfolio();
  const { isMobile, scaleFactor, perspective } = useWindowSize();

  const fieldRef = useRef<HTMLDivElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);

  const [hoveredSlug, setHoveredSlug] = useState<string | null>(null);

  const hoverIntentTimer = useRef<number | null>(null);
  const hoverExitTimer = useRef<number | null>(null);
  const activeHoveredTileRef = useRef<HTMLElement | null>(null);

  // Direct DOM camera coordinates for smooth continuous inertia
  const cameraXRef = useRef(0);
  const cameraYRef = useRef(0);
  const fieldRotXRef = useRef(0);
  const fieldRotYRef = useRef(0);

  // Panoramic canvas pan & drag navigation engine
  const panXRef = useRef(0);
  const panYRef = useRef(0);
  const targetPanXRef = useRef(0);
  const targetPanYRef = useRef(0);
  const panVelocityXRef = useRef(0);
  const panVelocityYRef = useRef(0);
  const isPointerDownRef = useRef(false);
  const isPointerDraggingRef = useRef(false);
  const lastDragXRef = useRef(0);
  const lastDragYRef = useRef(0);
  const dragDistanceRef = useRef(0);

  const targetMouseXRef = useRef(0);
  const targetMouseYRef = useRef(0);

  const isFlyingInRef = useRef(false);
  const entranceStartTimeRef = useRef(isGatePassed ? 1 : 0);
  const prevActiveViewRef = useRef(activeView);
  const isViewTransitioningRef = useRef(false);
  const viewTransitionStartTimeRef = useRef(0);

  // Trigger fly-in immediately when gate begins exiting or if gate passed
  useEffect(() => {
    if ((isGateExiting || isGatePassed) && entranceStartTimeRef.current === 0) {
      isFlyingInRef.current = true;
      entranceStartTimeRef.current = performance.now();
    }
  }, [isGateExiting, isGatePassed]);

  // Smooth cinematic glide whenever navigating back to 3D space from other pages
  useEffect(() => {
    if (prevActiveViewRef.current !== 'space' && activeView === 'space') {
      isViewTransitioningRef.current = true;
      viewTransitionStartTimeRef.current = performance.now();
    }
    prevActiveViewRef.current = activeView;
  }, [activeView]);

  // High-precision luxury quintic ease-out curve (continuous derivative, zero jerk)
  const luxuryEase = (t: number) => {
    const clamped = Math.max(0, Math.min(1, t));
    return 1 - Math.pow(1 - clamped, 4);
  };

  // Precalculate static 3D geometry once per window resize / scaleFactor change
  const computedTiles: ComputedTile[] = useMemo(() => {
    const totalSlots = PROJECTS.length;
    const list: ComputedTile[] = [];

    // Match 3D layout slots (1..30)
    const slottedProjects = PROJECTS.some(p => typeof p.slot === 'number')
      ? [...PROJECTS].sort((a, b) => (a.slot || 0) - (b.slot || 0))
      : PROJECTS;

    for (let i = 0; i < totalSlots; i++) {
      const pos = TILE_LAYOUTS[i] || {
        x: Math.round(Math.sin((((i - 32) * 37) % 240 - 120) * (Math.PI / 180)) * (1800 + ((i * 120) % 600))),
        y: ((i * 190) % 1400) - 700,
        w: 260,
        h: 180,
        zPx: -80 - ((i * 35) % 200),
        rx: 0,
        ry: 0,
        rz: 0,
        sizeClass: 'small' as const
      };
      const project = slottedProjects[i] || PROJECTS[i];

      const rawX = pos.x;
      const rawY = pos.y;
      const baseZ = pos.zPx;
      const baseRx = pos.rx || 0;
      const baseRy = pos.ry || 0;
      const baseRz = pos.rz || 0;

      const posX = rawX * scaleFactor;
      const posY = rawY * scaleFactor;

      // Normalized distance across reference canvas
      const normX = posX / (720 * scaleFactor);
      const normY = posY / (420 * scaleFactor);

      // Inverted circular arc depth (outer edges flare forward)
      const radius = 3400 * scaleFactor;
      const clampedX = Math.min(Math.abs(posX), radius * 0.94);
      const cylZ = (radius - Math.sqrt(radius * radius - clampedX * clampedX)) * 0.18;
      const vertZ = Math.min(60, (posY * posY) / (3600 * scaleFactor));
      const totalZ = baseZ + cylZ + vertZ;

      // Inverted tilts along arc
      const cylRotY = baseRy + normX * SPACE_CONFIG.YAW_COEFF;
      const cylRotX = baseRx + normY * SPACE_CONFIG.PITCH_COEFF;
      const cylRotZ = baseRz;

      const normZ = Math.max(0, Math.min(1, (totalZ + 400) / 600));
      const depthOpacity = Number((0.78 + normZ * 0.20).toFixed(2));
      const uniqueStackIndex = Math.round((totalZ + 2000) * 10) + i;

      const TILE_SCALE = 1.25 * 1.10; // 1.375 (+10% expansion)
      const width = Math.round((pos.w || 220) * scaleFactor * TILE_SCALE);
      const height = pos.h ? Math.round(pos.h * scaleFactor * TILE_SCALE) : Math.round(width * 0.65);

      list.push({
        project,
        index: i,
        posX,
        posY,
        totalZ,
        cylRotX,
        cylRotY,
        cylRotZ,
        depthOpacity,
        uniqueStackIndex,
        width,
        height,
        sizeClass: pos.sizeClass || 'medium'
      });
    }

    return list;
  }, [scaleFactor]);

  // Continuous 60fps RAF space loop matching shared/app_engine.js:
  // Panoramic canvas pan, momentum, and camera sway engine
  useEffect(() => {
    let rafId: number;

    const spaceLoop = () => {
      // 1. Continuous edge acceleration (only while active on 3D space view)
      if (activeView === 'space' && !isPointerDownRef.current) {
        const edgeThresholdX = 0.74;
        const edgeThresholdY = 0.78;
        if (targetMouseXRef.current > edgeThresholdX) {
          const factor = (targetMouseXRef.current - edgeThresholdX) / (1 - edgeThresholdX);
          targetPanXRef.current += factor * 26 * scaleFactor;
        } else if (targetMouseXRef.current < -edgeThresholdX) {
          const factor = (-edgeThresholdX - targetMouseXRef.current) / (1 - edgeThresholdX);
          targetPanXRef.current -= factor * 26 * scaleFactor;
        }

        if (targetMouseYRef.current > edgeThresholdY) {
          const factor = (targetMouseYRef.current - edgeThresholdY) / (1 - edgeThresholdY);
          targetPanYRef.current += factor * 18 * scaleFactor;
        } else if (targetMouseYRef.current < -edgeThresholdY) {
          const factor = (-edgeThresholdY - targetMouseYRef.current) / (1 - edgeThresholdY);
          targetPanYRef.current -= factor * 18 * scaleFactor;
        }
      }

      // 2. Momentum coasting
      if (activeView === 'space' && !isPointerDownRef.current && (Math.abs(panVelocityXRef.current) > 0.05 || Math.abs(panVelocityYRef.current) > 0.05)) {
        targetPanXRef.current += panVelocityXRef.current;
        targetPanYRef.current += panVelocityYRef.current;
        panVelocityXRef.current *= 0.90;
        panVelocityYRef.current *= 0.90;
      }

      // 3. Expanded canvas boundaries reaching all 30 slots (Slot 27 at -3100 to Slot 29 at +3350)
      const minPanX = -3600 * scaleFactor;
      const maxPanX = 3800 * scaleFactor;
      const minPanY = -650 * scaleFactor;
      const maxPanY = 650 * scaleFactor;

      targetPanXRef.current = Math.max(minPanX, Math.min(maxPanX, targetPanXRef.current));
      targetPanYRef.current = Math.max(minPanY, Math.min(maxPanY, targetPanYRef.current));

      // Smooth pan easing
      panXRef.current += (targetPanXRef.current - panXRef.current) * 0.085;
      panYRef.current += (targetPanYRef.current - panYRef.current) * 0.085;

      // 4. Dynamic mouse sway around the current pan position (quiescent when on other views)
      const swayCamX = (isMobile || activeView !== 'space') ? 0 : targetMouseXRef.current * (scaleFactor * 160);
      const swayCamY = (isMobile || activeView !== 'space') ? 0 : targetMouseYRef.current * (scaleFactor * 120);
      const swayRotY = (isMobile || activeView !== 'space') ? 0 : targetMouseXRef.current * 18.0;

      // 5. Tangent cylinder arc yaw as camera pans along the curve
      const arcYaw = (-panXRef.current / (3400 * scaleFactor)) * (180 / Math.PI) * 0.50;

      const totalTargetCamX = panXRef.current + swayCamX;
      const totalTargetCamY = panYRef.current + swayCamY;
      const totalTargetRotY = arcYaw + swayRotY;

      cameraXRef.current += (totalTargetCamX - cameraXRef.current) * 0.065;
      cameraYRef.current += (totalTargetCamY - cameraYRef.current) * 0.065;
      fieldRotYRef.current += (totalTargetRotY - fieldRotYRef.current) * 0.065;
      fieldRotXRef.current = 0;

      // 6. Dolly Fly-In Entrance & Inter-view Transitions
      let initialFlyInEase = 1.0;
      if (!isGatePassed && !isGateExiting) {
        initialFlyInEase = 0.0;
      } else if (isFlyingInRef.current) {
        const elapsed = (performance.now() - entranceStartTimeRef.current) / 2400;
        if (elapsed >= 1.0) {
          isFlyingInRef.current = false;
          initialFlyInEase = 1.0;
        } else {
          initialFlyInEase = luxuryEase(elapsed);
        }
      }

      let viewTransitionEase = 1.0;
      if (activeView !== 'space') {
        viewTransitionEase = 0.0;
      } else if (isViewTransitioningRef.current) {
        const elapsed = (performance.now() - viewTransitionStartTimeRef.current) / 1400;
        if (elapsed >= 1.0) {
          isViewTransitioningRef.current = false;
          viewTransitionEase = 1.0;
        } else {
          viewTransitionEase = luxuryEase(elapsed);
        }
      }

      const combinedTransitionEase = Math.min(initialFlyInEase, viewTransitionEase);

      if (fieldRef.current) {
        const flyInZ = (1.0 - combinedTransitionEase) * -440;
        const flyInScale = 0.78 + (0.22 * combinedTransitionEase);
        fieldRef.current.style.transform = `translate3d(${-cameraXRef.current.toFixed(1)}px, ${-cameraYRef.current.toFixed(1)}px, ${flyInZ.toFixed(1)}px) rotateY(${fieldRotYRef.current.toFixed(2)}deg) scale(${flyInScale.toFixed(3)})`;
      }

      rafId = requestAnimationFrame(spaceLoop);
    };

    rafId = requestAnimationFrame(spaceLoop);
    return () => cancelAnimationFrame(rafId);
  }, [activeView, isMobile, scaleFactor, isGatePassed, isGateExiting]);

  const showCenterDesc = useCallback((proj: Project) => {
    const descEl = document.getElementById('spaceCenterDesc');
    const indexToggleEl = document.querySelector('.index-toggle');
    if (!descEl || !proj) return;

    const targetSlug = proj.targetSlug || proj.slug;
    const targetProj = PROJECTS.find(p => p.slug === targetSlug) || proj;

    const titleEl = document.getElementById('spaceCenterTitle');
    const descTextEl = document.getElementById('spaceCenterDescText');

    if (titleEl) titleEl.textContent = targetProj.title || '';
    if (descTextEl) descTextEl.textContent = targetProj.short || targetProj.description || '';

    descEl.dataset.slug = targetProj.slug || '';
    descEl.classList.add('is-active');
    if (indexToggleEl) indexToggleEl.classList.add('hide-for-desc');
    setHoveredSlug(targetProj.slug);
    setActiveHoveredProject(targetProj);
  }, [setActiveHoveredProject]);

  const hideCenterDesc = useCallback(() => {
    const descEl = document.getElementById('spaceCenterDesc');
    const indexToggleEl = document.querySelector('.index-toggle');
    if (descEl) descEl.classList.remove('is-active');
    if (indexToggleEl) indexToggleEl.classList.remove('hide-for-desc');
    setHoveredSlug(null);
    setActiveHoveredProject(null);
  }, [setActiveHoveredProject]);

  // Precise 3D Spatial Hit-Testing, Drag-to-Pan, Wheel, and Recenter Engine
  useEffect(() => {
    const handlePointerDown = (e: PointerEvent) => {
      if (activeView !== 'space') return;
      const target = e.target as HTMLElement | null;
      if (target?.closest('button, a, .fixed-footer, .brand-header, .index-toggle, .audio-toggle, .space-center-desc')) {
        return;
      }
      isPointerDownRef.current = true;
      lastDragXRef.current = e.clientX;
      lastDragYRef.current = e.clientY;
      dragDistanceRef.current = 0;
      panVelocityXRef.current = 0;
      panVelocityYRef.current = 0;
    };

    const handlePointerMove = (e: PointerEvent) => {
      targetMouseXRef.current = (e.clientX / window.innerWidth) * 2 - 1;
      targetMouseYRef.current = (e.clientY / window.innerHeight) * 2 - 1;

      if (activeView !== 'space' || !fieldRef.current) return;

      if (isPointerDownRef.current) {
        const dx = e.clientX - lastDragXRef.current;
        const dy = e.clientY - lastDragYRef.current;
        dragDistanceRef.current += Math.hypot(dx, dy);

        if (dragDistanceRef.current > 6) {
          isPointerDraggingRef.current = true;
          if (stageRef.current) stageRef.current.classList.add('is-dragging');
        }

        targetPanXRef.current -= dx * 1.5;
        targetPanYRef.current -= dy * 1.5;
        panVelocityXRef.current = -dx * 1.5;
        panVelocityYRef.current = -dy * 1.5;

        lastDragXRef.current = e.clientX;
        lastDragYRef.current = e.clientY;
      }

      if (isPointerDraggingRef.current) {
        if (activeHoveredTileRef.current) {
          activeHoveredTileRef.current = null;
          fieldRef.current?.classList.remove('has-hover');
          fieldRef.current?.querySelectorAll('.tile').forEach((t) => {
            t.classList.remove('is-hovered');
          });
          hideCenterDesc();
        }
        return;
      }

      const hitElement = document.elementFromPoint(e.clientX, e.clientY);
      const hitTile = hitElement ? (hitElement.closest('.tile') as HTMLElement | null) : null;

      if (hitTile) {
        if (activeHoveredTileRef.current !== hitTile) {
          if (hoverExitTimer.current) window.clearTimeout(hoverExitTimer.current);
          if (hoverIntentTimer.current) window.clearTimeout(hoverIntentTimer.current);

          hoverIntentTimer.current = window.setTimeout(() => {
            activeHoveredTileRef.current = hitTile;
            const targetSlug = hitTile.dataset.slug;
            const hitProj = PROJECTS.find((p) => p.slug === targetSlug) || null;

            fieldRef.current?.classList.add('has-hover');
            fieldRef.current?.querySelectorAll('.tile').forEach((t) => {
              if (t === hitTile) {
                t.classList.add('is-hovered');
              } else {
                t.classList.remove('is-hovered');
              }
            });

            if (hitProj) {
              showCenterDesc(hitProj);
            }
          }, SPACE_CONFIG.HOVER_INTENT_DELAY);
        }
      } else if (activeHoveredTileRef.current) {
        if (hoverIntentTimer.current) window.clearTimeout(hoverIntentTimer.current);
        if (hoverExitTimer.current) window.clearTimeout(hoverExitTimer.current);

        hoverExitTimer.current = window.setTimeout(() => {
          activeHoveredTileRef.current = null;
          fieldRef.current?.classList.remove('has-hover');
          fieldRef.current?.querySelectorAll('.tile').forEach((t) => {
            t.classList.remove('is-hovered');
          });

          hideCenterDesc();
        }, SPACE_CONFIG.HOVER_EXIT_DELAY);
      }
    };

    const handlePointerUp = () => {
      if (!isPointerDownRef.current) return;
      isPointerDownRef.current = false;
      if (stageRef.current) stageRef.current.classList.remove('is-dragging');
      window.setTimeout(() => {
        isPointerDraggingRef.current = false;
      }, 60);
    };

    const handlePointerCancel = () => {
      isPointerDownRef.current = false;
      if (stageRef.current) stageRef.current.classList.remove('is-dragging');
      isPointerDraggingRef.current = false;
    };

    const handleDblClick = (e: MouseEvent) => {
      if (activeView !== 'space') return;
      const target = e.target as HTMLElement | null;
      if (target?.closest('button, a, .fixed-footer, .brand-header, .index-toggle, .audio-toggle, .tile')) return;
      targetPanXRef.current = 0;
      targetPanYRef.current = 0;
      panVelocityXRef.current = 0;
      panVelocityYRef.current = 0;
    };

    const handleWheel = (e: WheelEvent) => {
      if (activeView !== 'space') return;
      const target = e.target as HTMLElement | null;
      if (target?.closest('.project-page, .about-page, .contact-view, .index-page-inner')) return;

      e.preventDefault();
      const mult = 1.0;
      if (Math.abs(e.deltaX) > 0.5) {
        targetPanXRef.current += e.deltaX * mult;
      }
      if (Math.abs(e.deltaY) > 0.5) {
        if (e.shiftKey || Math.abs(e.deltaX) === 0) {
          targetPanXRef.current += e.deltaY * 1.1;
          targetPanYRef.current += (e.deltaY * 0.25);
        } else {
          targetPanYRef.current += e.deltaY * mult;
        }
      }
    };

    window.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('pointercancel', handlePointerCancel);
    window.addEventListener('dblclick', handleDblClick);
    window.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('pointercancel', handlePointerCancel);
      window.removeEventListener('dblclick', handleDblClick);
      window.removeEventListener('wheel', handleWheel);
      if (hoverIntentTimer.current) window.clearTimeout(hoverIntentTimer.current);
      if (hoverExitTimer.current) window.clearTimeout(hoverExitTimer.current);
    };
  }, [activeView, showCenterDesc, hideCenterDesc]);

  // Clean up hover state when switching away from space view
  useEffect(() => {
    if (activeView !== 'space') {
      activeHoveredTileRef.current = null;
      fieldRef.current?.classList.remove('has-hover');
      fieldRef.current?.querySelectorAll('.tile').forEach((t) => {
        t.classList.remove('is-hovered');
      });
      hideCenterDesc();
    }
  }, [activeView, hideCenterDesc]);

  const handleTileClick = useCallback(
    (project: Project) => {
      if (isPointerDraggingRef.current || dragDistanceRef.current > 6) return;
      navigate('project', project.targetSlug || project.slug);
    },
    [navigate]
  );

  const handleFieldClick = useCallback(
    (e: React.MouseEvent) => {
      if (isPointerDraggingRef.current || dragDistanceRef.current > 6) return;
      const target = (e.target as HTMLElement).closest('.tile') as HTMLElement | null;
      if (target) {
        const dest = target.dataset.targetSlug || target.dataset.slug;
        if (dest) {
          navigate('project', dest);
        }
      }
    },
    [navigate]
  );

  const handleCenterDescClick = useCallback(() => {
    if (activeHoveredProject) {
      navigate('project', activeHoveredProject.targetSlug || activeHoveredProject.slug);
      return;
    }
    const descEl = document.getElementById('spaceCenterDesc');
    const slug = descEl?.dataset.slug;
    if (slug) {
      navigate('project', slug);
    }
  }, [activeHoveredProject, navigate]);

  return (
    <div
      className={`view ${activeView === 'space' ? 'active' : 'space-receded'}`}
      data-view="space"
    >
      <div
        ref={stageRef}
        className="home-stage"
        style={{ perspective: `${perspective}px` }}
      >
        <div
          ref={fieldRef}
          className={`field ${hoveredSlug ? 'has-hover' : ''}`}
          id="field"
          onClick={handleFieldClick}
        >
          {computedTiles.map((tile) => (
            <Tile
              key={tile.project.slug}
              computed={tile}
              isHovered={hoveredSlug === tile.project.slug}
              onClick={handleTileClick}
            />
          ))}
        </div>
      </div>

      <CenterDescription
        project={activeHoveredProject}
        onClick={handleCenterDescClick}
      />
    </div>
  );
};
