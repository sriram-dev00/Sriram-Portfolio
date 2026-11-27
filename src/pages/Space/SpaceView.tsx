import React, { useMemo, useRef, useEffect, useState, useCallback } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { PROJECTS, TILE_LAYOUTS } from '../../data/portfolioData';
import { Project } from '../../types/portfolio';
import { CenterDescription } from './CenterDescription';

declare global {
  interface Window {
    SpaceEngine3D?: new (
      container: HTMLElement,
      options: {
        projects: unknown[];
        layout: unknown[];
        onHoverTile?: (proj: Project | null) => void;
        onClickTile?: (proj: Project | null) => void;
        onScrollProgress?: (progress: number) => void;
      }
    ) => {
      start: () => void;
      stop: () => void;
      destroy: () => void;
      triggerEntranceUnfold?: (opts?: { quick?: boolean }) => void;
      setScrollProgress?: (progress: number) => void;
    };
  }
}

export const SpaceView: React.FC = () => {
  const { activeView, activeHoveredProject, setActiveHoveredProject, navigate, isGatePassed, isGateExiting } = usePortfolio();

  const stageRef = useRef<HTMLDivElement | null>(null);
  const engineRef = useRef<InstanceType<NonNullable<Window['SpaceEngine3D']>> | null>(null);
  const scrollBarRef = useRef<HTMLDivElement | null>(null);
  const scrollThumbRef = useRef<HTMLDivElement | null>(null);
  const isScrubbingRef = useRef(false);
  const prevViewRef = useRef(activeView);
  const hasTriggeredGateUnfoldRef = useRef(false);
  const [scrollPct, setScrollPct] = useState(50);

  // Build 30-slot space tile list matching the central layout
  const spaceTiles = useMemo(() => {
    type ExtendedProject = Project & {
      id?: number;
      targetProject?: string;
      project?: string;
      images?: Array<{ id?: number; slot?: number; src?: string; thumb?: string; title?: string }>;
    };

    const projectsExt = PROJECTS as ExtendedProject[];
    const collected: ExtendedProject[] = [];
    projectsExt.forEach((proj) => {
      if (Array.isArray(proj.images) && proj.images.length > 0) {
        proj.images.forEach((imgObj) => {
          collected.push({
            ...proj,
            id: imgObj.id || collected.length + 1,
            slot: imgObj.slot,
            thumb: imgObj.src || imgObj.thumb || proj.thumb,
            title: imgObj.title || proj.title,
            targetSlug: proj.slug
          });
        });
      }
    });

    if (collected.length > 0) {
      const maxSlots = Math.max(collected.length, 30);
      const slotMap: Array<ExtendedProject | null> = new Array(maxSlots).fill(null);
      collected.forEach((tile) => {
        if (typeof tile.slot === 'number' && tile.slot >= 1 && tile.slot <= maxSlots && !slotMap[tile.slot - 1]) {
          slotMap[tile.slot - 1] = tile;
        }
      });
      collected.forEach((tile) => {
        if (typeof tile.slot !== 'number' || tile.slot < 1 || tile.slot > maxSlots || slotMap[tile.slot - 1] !== tile) {
          const emptyIdx = slotMap.indexOf(null);
          if (emptyIdx !== -1) slotMap[emptyIdx] = tile;
        }
      });
      return slotMap.filter((x): x is ExtendedProject => x !== null);
    }

    if (projectsExt.some((p) => typeof p.slot === 'number')) {
      const maxSlots = Math.max(projectsExt.length, 30);
      const slotMap: Array<ExtendedProject | null> = new Array(maxSlots).fill(null);
      projectsExt.forEach((tile) => {
        if (typeof tile.slot === 'number' && tile.slot >= 1 && tile.slot <= maxSlots && !slotMap[tile.slot - 1]) {
          slotMap[tile.slot - 1] = tile;
        }
      });
      projectsExt.forEach((tile) => {
        if (typeof tile.slot !== 'number' || tile.slot < 1 || tile.slot > maxSlots || slotMap[tile.slot - 1] !== tile) {
          const emptyIdx = slotMap.indexOf(null);
          if (emptyIdx !== -1) slotMap[emptyIdx] = tile;
        }
      });
      return slotMap.filter((x): x is ExtendedProject => x !== null);
    }

    return projectsExt;
  }, []);

  const updateScrollThumb = useCallback((progress: number) => {
    const pct = Math.max(0, Math.min(1, progress));
    if (scrollThumbRef.current) {
      scrollThumbRef.current.style.left = `calc(${(pct * 100).toFixed(2)}% - ${(pct * 36).toFixed(2)}px)`;
    }
    setScrollPct(Math.round(pct * 100));
  }, []);

  // Mount WebGL SpaceEngine3D once
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage || !window.SpaceEngine3D) return;

    const engine = new window.SpaceEngine3D(stage, {
      projects: spaceTiles,
      layout: TILE_LAYOUTS,
      onScrollProgress: updateScrollThumb,
      onHoverTile: (proj) => {
        if (proj) {
          const slug = proj.targetSlug || proj.slug || '';
          const resolved = PROJECTS.find((p) => p.slug === slug) || proj;
          setActiveHoveredProject(resolved);
        } else {
          setActiveHoveredProject(null);
        }
      },
      onClickTile: (proj) => {
        if (proj) {
          const slug = proj.targetSlug || proj.slug || '';
          if (slug) navigate('project', slug);
        }
      }
    });

    engineRef.current = engine;

    return () => {
      engine.destroy();
      engineRef.current = null;
    };
  }, [spaceTiles, navigate, setActiveHoveredProject, updateScrollThumb]);

  // Trigger Michael Gatt 3D space unfold when exiting Sound Gate
  useEffect(() => {
    if ((isGateExiting || isGatePassed) && !hasTriggeredGateUnfoldRef.current) {
      hasTriggeredGateUnfoldRef.current = true;
      const timer = window.setTimeout(() => {
        if (engineRef.current && typeof engineRef.current.triggerEntranceUnfold === 'function') {
          engineRef.current.triggerEntranceUnfold();
        }
      }, isGateExiting ? 260 : 0);
      return () => window.clearTimeout(timer);
    }
  }, [isGateExiting, isGatePassed]);

  // Pause WebGL loop off-screen; run quick unfold when returning to Space
  useEffect(() => {
    const engine = engineRef.current;
    if (!engine) {
      prevViewRef.current = activeView;
      return;
    }

    if (activeView === 'space') {
      if (prevViewRef.current !== 'space' && typeof engine.triggerEntranceUnfold === 'function') {
        engine.triggerEntranceUnfold({ quick: true });
      } else {
        engine.start();
      }
    } else if (activeView !== 'index') {
      // Keep running subtly as receded backdrop in Index view, pause in About/Contact/Project
      engine.stop();
    }

    prevViewRef.current = activeView;
  }, [activeView]);

  const scrubToClientX = useCallback((clientX: number) => {
    const bar = scrollBarRef.current;
    if (!bar) return;
    const rect = bar.getBoundingClientRect();
    if (!rect.width) return;
    const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    updateScrollThumb(ratio);
    if (engineRef.current && typeof engineRef.current.setScrollProgress === 'function') {
      engineRef.current.setScrollProgress(ratio);
    }
  }, [updateScrollThumb]);

  const viewClasses = ['view'];
  if (activeView === 'space') viewClasses.push('active');
  else if (activeView === 'index') viewClasses.push('space-receded');

  return (
    <div className={viewClasses.join(' ')} data-view="space">
      <div className="home-stage" ref={stageRef} />

      <CenterDescription
        project={activeHoveredProject}
        onClick={() => {
          if (activeHoveredProject) {
            const dest = activeHoveredProject.targetSlug || activeHoveredProject.slug;
            if (dest) navigate('project', dest);
          }
        }}
      />

      <div
        ref={scrollBarRef}
        className={`space-scrollbar ${isScrubbingRef.current ? 'is-dragging' : ''}`}
        id="spaceScrollBar"
        role="slider"
        aria-label="3D Space horizontal scroll"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={scrollPct}
        tabIndex={0}
        onPointerDown={(e) => {
          e.stopPropagation();
          isScrubbingRef.current = true;
          e.currentTarget.classList.add('is-dragging');
          scrubToClientX(e.clientX);
          try { e.currentTarget.setPointerCapture(e.pointerId); } catch (_) { /* ignore */ }
        }}
        onPointerMove={(e) => {
          if (!isScrubbingRef.current) return;
          e.stopPropagation();
          scrubToClientX(e.clientX);
        }}
        onPointerUp={(e) => {
          if (!isScrubbingRef.current) return;
          isScrubbingRef.current = false;
          e.currentTarget.classList.remove('is-dragging');
          try { e.currentTarget.releasePointerCapture(e.pointerId); } catch (_) { /* ignore */ }
        }}
        onPointerCancel={(e) => {
          isScrubbingRef.current = false;
          e.currentTarget.classList.remove('is-dragging');
        }}
      >
        <div className="space-scrollbar-track">
          <div ref={scrollThumbRef} className="space-scrollbar-thumb" id="spaceScrollThumb" />
        </div>
      </div>
    </div>
  );
};
