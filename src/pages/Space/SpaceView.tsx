import React, { useMemo, useRef, useEffect, useState, useCallback } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { useWindowSize } from '../../hooks/useWindowSize';
import { PROJECTS, TILE_LAYOUTS, SPACE_CONFIG } from '../../data/portfolioData';
import { ComputedTile, Project } from '../../types/portfolio';
import { Tile } from './Tile';
import { CenterDescription } from './CenterDescription';

export const SpaceView: React.FC = () => {
  const { activeView, activeHoveredProject, setActiveHoveredProject, navigate } = usePortfolio();
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

  const targetMouseXRef = useRef(0);
  const targetMouseYRef = useRef(0);

  // Precalculate static 3D geometry once per window resize / scaleFactor change
  const computedTiles: ComputedTile[] = useMemo(() => {
    const totalSlots = Math.min(TILE_LAYOUTS.length, PROJECTS.length);
    const list: ComputedTile[] = [];

    for (let i = 0; i < totalSlots; i++) {
      const pos = TILE_LAYOUTS[i];
      const project = PROJECTS[i];

      const rawX = pos.x;
      const rawY = pos.y;
      const baseZ = pos.zPx;
      const baseRx = pos.rx || 0;
      const baseRy = pos.ry || 0;
      const baseRz = pos.rz || 0;

      const posX = rawX * scaleFactor;
      const posY = rawY * scaleFactor;

      // Normalized distance from center for fisheye concave curve relative to reference canvas
      const normX = posX / (720 * scaleFactor);
      const normY = posY / (390 * scaleFactor);
      const distSq = normX * normX + normY * normY * 0.65;

      const concaveZ = -distSq * SPACE_CONFIG.CONCAVE_CURVE_STRENGTH;
      const totalZ = baseZ + concaveZ;

      // Subtle inward facing tilts along concave arc
      const cylRotY = baseRy + normX * SPACE_CONFIG.YAW_COEFF;
      const cylRotX = baseRx + -normY * SPACE_CONFIG.PITCH_COEFF;
      const cylRotZ = baseRz;

      const normZ = Math.max(0, Math.min(1, (totalZ + 380) / 600));
      const depthOpacity = Number((0.38 + normZ * 0.4).toFixed(2));
      const uniqueStackIndex = Math.round((totalZ + 2000) * 10) + i;

      const width = Math.round((pos.w || 220) * scaleFactor);
      const height = pos.h ? Math.round(pos.h * scaleFactor) : Math.round(width * 0.65);

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
  // Decelerates camera sway with 0.045 lerp factor and applies pure 3D transforms
  useEffect(() => {
    if (activeView !== 'space') return;

    let rafId: number;

    const spaceLoop = () => {
      const targetCamX = isMobile ? 0 : targetMouseXRef.current * (scaleFactor * 460);
      const targetCamY = isMobile ? 0 : targetMouseYRef.current * (scaleFactor * 280);
      const targetRotY = isMobile ? 0 : targetMouseXRef.current * 10.5;
      const targetRotX = isMobile ? 0 : -targetMouseYRef.current * 6.5;

      cameraXRef.current += (targetCamX - cameraXRef.current) * SPACE_CONFIG.CAMERA_LERP;
      cameraYRef.current += (targetCamY - cameraYRef.current) * SPACE_CONFIG.CAMERA_LERP;
      fieldRotYRef.current += (targetRotY - fieldRotYRef.current) * SPACE_CONFIG.CAMERA_LERP;
      fieldRotXRef.current += (targetRotX - fieldRotXRef.current) * SPACE_CONFIG.CAMERA_LERP;

      if (fieldRef.current) {
        fieldRef.current.style.transform = `translate3d(${-cameraXRef.current.toFixed(1)}px, ${-cameraYRef.current.toFixed(1)}px, 0px) rotateX(${fieldRotXRef.current.toFixed(2)}deg) rotateY(${fieldRotYRef.current.toFixed(2)}deg)`;
      }

      rafId = requestAnimationFrame(spaceLoop);
    };

    rafId = requestAnimationFrame(spaceLoop);
    return () => cancelAnimationFrame(rafId);
  }, [activeView, isMobile, scaleFactor]);

  const showCenterDesc = useCallback((proj: Project) => {
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
    setHoveredSlug(proj.slug);
    setActiveHoveredProject(proj);
  }, [setActiveHoveredProject]);

  const hideCenterDesc = useCallback(() => {
    const descEl = document.getElementById('spaceCenterDesc');
    const indexToggleEl = document.querySelector('.index-toggle');
    if (descEl) descEl.classList.remove('is-active');
    if (indexToggleEl) indexToggleEl.classList.remove('hide-for-desc');
    setHoveredSlug(null);
    setActiveHoveredProject(null);
  }, [setActiveHoveredProject]);

  // Precise 3D Spatial Hit-Testing Engine for Overlapping Back Tiles & Camera Sway
  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      // Track normalized mouse coordinates across reference space (-1.0 to +1.0)
      targetMouseXRef.current = (e.clientX / window.innerWidth) * 2 - 1;
      targetMouseYRef.current = (e.clientY / window.innerHeight) * 2 - 1;

      if (activeView !== 'space' || !fieldRef.current) return;

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

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
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
      navigate('project', project.slug);
    },
    [navigate]
  );

  const handleFieldClick = useCallback(
    (e: React.MouseEvent) => {
      const target = (e.target as HTMLElement).closest('.tile') as HTMLElement | null;
      if (target && target.dataset.slug) {
        navigate('project', target.dataset.slug);
      }
    },
    [navigate]
  );

  const handleCenterDescClick = useCallback(() => {
    const descEl = document.getElementById('spaceCenterDesc');
    const slug = descEl?.dataset.slug;
    if (slug) {
      navigate('project', slug);
    }
  }, [navigate]);

  return (
    <div
      className={`view ${activeView === 'space' ? 'active' : ''}`}
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
