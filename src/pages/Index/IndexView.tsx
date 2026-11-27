import React, { useState, useRef, useEffect, useCallback } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { PROJECTS } from '../../data/portfolioData';
import { Project } from '../../types/portfolio';

export const IndexView: React.FC = () => {
  const { activeView, navigate } = usePortfolio();
  const [activeSlug, setActiveSlug] = useState<string | null>(null);
  const [activeMedia, setActiveMedia] = useState<{
    src: string;
    isVid: boolean;
    poster?: string;
    title: string;
  } | null>(null);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);

  const cardRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const posRef = useRef({ currentX: 0, currentY: 0, targetX: 0, targetY: 0 });
  const listRef = useRef<HTMLDivElement | null>(null);

  const indexProjects = PROJECTS.filter((p) => !p.isTileOnly && !p.targetSlug);

  // Smooth frame-rate independent delta-time lerp tracking loop
  useEffect(() => {
    if (activeView !== 'index') {
      setIsVisible(false);
      return;
    }

    let lastTime = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(0.05, Math.max(0.001, (now - lastTime) / 1000));
      lastTime = now;
      const alpha = 1 - Math.exp(-7.0 * dt);

      const p = posRef.current;
      const dx = p.targetX - p.currentX;
      const dy = p.targetY - p.currentY;
      if (Math.abs(dx) > 0.08 || Math.abs(dy) > 0.08) {
        p.currentX += dx * alpha;
        p.currentY += dy * alpha;
        if (cardRef.current) {
          cardRef.current.style.transform = `translate3d(${p.currentX.toFixed(1)}px, ${p.currentY.toFixed(1)}px, 0)`;
        }
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [activeView]);

  // Preload adjacent project images for instant synchronization
  const preloadAdjacent = useCallback((idx: number) => {
    if (!indexProjects.length) return;
    const nextIdx = (idx + 1) % indexProjects.length;
    const prevIdx = (idx - 1 + indexProjects.length) % indexProjects.length;
    [nextIdx, prevIdx].forEach((i) => {
      const p = indexProjects[i];
      const src = p.indexThumb || p.thumb || p.media?.src || '';
      if (src && !src.endsWith('.mp4') && !src.endsWith('.webm')) {
        const img = new Image();
        img.src = src;
      }
    });
  }, [indexProjects]);

  const updateSelectedMedia = (p: Project, idx?: number) => {
    const rawSrc = p.indexThumb || p.thumb || p.media?.src || '';
    const isVid = Boolean(rawSrc && (rawSrc.endsWith('.mp4') || rawSrc.endsWith('.webm')));
    const poster = p.media?.poster || p.thumb || '';

    setActiveSlug(p.slug);
    setActiveMedia({
      src: rawSrc,
      isVid,
      poster,
      title: p.title
    });

    if (typeof idx === 'number') {
      preloadAdjacent(idx);
    }
  };

  const updateCardPosition = (rect: DOMRect, clientX: number, clientY: number) => {
    const cardW = 380;
    const cardH = 214;
    const cursorX = clientX > 0 ? clientX : rect.left + rect.width / 2;
    const cursorY = clientY > 0 ? clientY : rect.top + rect.height / 2;

    const rawTargetX = cursorX - cardW / 2;
    const boundedX = Math.max(20, Math.min(window.innerWidth - cardW - 20, rawTargetX));
    const rowCenterY = rect.top + rect.height / 2;
    const rawTargetY = rowCenterY - cardH / 2 + (cursorY - rowCenterY) * 0.15;
    const boundedY = Math.max(20, Math.min(window.innerHeight - cardH - 20, rawTargetY));

    posRef.current.targetX = boundedX;
    posRef.current.targetY = boundedY;

    if (!isVisible) {
      posRef.current.currentX = boundedX;
      posRef.current.currentY = boundedY;
      setIsVisible(true);
    }
  };

  const handleRowEnter = (e: React.MouseEvent<HTMLDivElement>, p: Project, idx: number) => {
    updateSelectedMedia(p, idx);
    setSelectedIndex(idx);
    const rect = e.currentTarget.getBoundingClientRect();
    updateCardPosition(rect, e.clientX, e.clientY);
  };

  const handleRowMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    updateCardPosition(rect, e.clientX, e.clientY);
  };

  // Keyboard navigation & accessibility (Arrow keys, Enter, Escape)
  useEffect(() => {
    if (activeView !== 'index') return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => {
          const next = (prev + 1) % indexProjects.length;
          const proj = indexProjects[next];
          updateSelectedMedia(proj, next);
          setIsVisible(true);
          return next;
        });
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => {
          const next = (prev - 1 + indexProjects.length) % indexProjects.length;
          const proj = indexProjects[next];
          updateSelectedMedia(proj, next);
          setIsVisible(true);
          return next;
        });
      } else if (e.key === 'Enter' || e.key === ' ') {
        if (selectedIndex >= 0 && selectedIndex < indexProjects.length) {
          e.preventDefault();
          navigate('project', indexProjects[selectedIndex].slug);
        }
      } else if (e.key === 'Escape') {
        navigate('space');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeView, indexProjects, selectedIndex, navigate]);

  return (
    <div
      className={`view ${activeView === 'index' ? 'active' : ''}`}
      data-view="index"
    >
      {/* Back button to space */}
      <button
        className="index-back-btn a-arrow-text"
        aria-label="Back to space view"
        data-cursor="Back"
        onClick={() => navigate('space')}
      >
        <svg
          className="a-arrow-text_arrow"
          viewBox="0 0 9 8"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path d="M1.17188 4.08594H8.67188" stroke="currentColor" strokeWidth="1.2" />
          <path d="M4.08564 7.17218L0.999396 4.08594L4.08564 0.999698" stroke="currentColor" strokeWidth="1.2" />
        </svg>
        <span className="a-arrow-text_title">BACK</span>
        <span className="a-arrow-text_caption">TO SPACE VIEW</span>
      </button>

      {/* Floating Dynamic Media Preview / Play Box Container */}
      <div className={`index-hover-preview ${isVisible && activeMedia ? 'visible' : ''}`} aria-hidden="true">
        <div ref={cardRef} className="index-preview-card" id="indexPreviewCard">
          {activeMedia && (
            <div key={activeMedia.src} className="index-preview-content">
              {/* Undistorted Native Foreground Media Layer */}
              <div className="index-preview-foreground-wrapper">
                {activeMedia.isVid ? (
                  <video
                    className="index-preview-media vid"
                    src={activeMedia.src}
                    poster={activeMedia.poster}
                    autoPlay
                    loop
                    muted
                    playsInline
                  />
                ) : (
                  <img
                    className="index-preview-media img"
                    src={activeMedia.src}
                    alt={activeMedia.title}
                    decoding="async"
                  />
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Index Project List */}
      <div
        className="index-page-inner"
        onMouseLeave={() => {
          setIsVisible(false);
          setActiveSlug(null);
          setActiveMedia(null);
          setSelectedIndex(-1);
        }}
      >
        <div
          ref={listRef}
          className="index-list"
          onMouseLeave={() => {
            setIsVisible(false);
            setActiveSlug(null);
            setActiveMedia(null);
            setSelectedIndex(-1);
          }}
        >
          {indexProjects.map((p, i) => {
            const isHovered = activeSlug === p.slug || selectedIndex === i;
            return (
              <div
                key={p.slug}
                className={`row ${isHovered ? 'is-hovered' : ''}`}
                data-slug={p.slug}
                data-cursor="Open"
                role="button"
                tabIndex={0}
                aria-label={`Open project ${p.title}`}
                onMouseEnter={(e) => handleRowEnter(e, p, i)}
                onMouseMove={handleRowMove}
                onClick={() => navigate('project', p.slug)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    navigate('project', p.slug);
                  }
                }}
              >
                <span className="n">{String(i + 1).padStart(3, '0').split('').join(' ')}</span>
                <span className="name">{p.title}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
