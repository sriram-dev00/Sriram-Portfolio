import React, { useState, useRef, useEffect, useCallback } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { PROJECTS } from '../../data/portfolioData';

interface CustomVideoPlayerProps {
  src: string;
  poster?: string;
  title: string;
  onPrev?: () => void;
  onNext?: () => void;
  hasMultipleVideos: boolean;
  counterText?: string;
}

const CustomVideoPlayer: React.FC<CustomVideoPlayerProps> = ({
  src,
  poster,
  title,
  onPrev,
  onNext,
  hasMultipleVideos,
  counterText
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const timelineRef = useRef<HTMLDivElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [progress, setProgress] = useState(0);
  const [buffered, setBuffered] = useState(0);
  const [isScrubbing, setIsScrubbing] = useState(false);
  const animFrameRef = useRef<number | null>(null);
  const touchStartXRef = useRef<number | null>(null);

  // Smooth 60fps playhead update using requestAnimationFrame
  const tick = useCallback(() => {
    const v = videoRef.current;
    if (v && v.duration) {
      setCurrentTime(v.currentTime);
      setProgress((v.currentTime / v.duration) * 100);
      if (v.buffered.length > 0) {
        setBuffered((v.buffered.end(v.buffered.length - 1) / v.duration) * 100);
      }
    }
    if (v && !v.paused && !v.ended) {
      animFrameRef.current = requestAnimationFrame(tick);
    }
  }, []);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    const handlePlay = () => {
      setIsPlaying(true);
      animFrameRef.current = requestAnimationFrame(tick);
    };
    const handlePause = () => {
      setIsPlaying(false);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
    const handleLoadedMetadata = () => {
      setDuration(v.duration);
      setCurrentTime(v.currentTime);
      if (v.buffered.length > 0) {
        setBuffered((v.buffered.end(v.buffered.length - 1) / v.duration) * 100);
      }
    };
    const handleProgress = () => {
      if (v.duration && v.buffered.length > 0) {
        setBuffered((v.buffered.end(v.buffered.length - 1) / v.duration) * 100);
      }
    };

    v.addEventListener('play', handlePlay);
    v.addEventListener('pause', handlePause);
    v.addEventListener('loadedmetadata', handleLoadedMetadata);
    v.addEventListener('progress', handleProgress);

    // Pause on slide change, then autoplay muted on active slide
    v.currentTime = 0;
    v.muted = true;
    v.play().catch(() => { });

    return () => {
      v.removeEventListener('play', handlePlay);
      v.removeEventListener('pause', handlePause);
      v.removeEventListener('loadedmetadata', handleLoadedMetadata);
      v.removeEventListener('progress', handleProgress);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [src, tick]);

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      v.play().catch(() => { });
    } else {
      v.pause();
    }
  };

  // Spacebar play/pause
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.key === ' ') {
        if (e.target && ((e.target as HTMLElement).tagName === 'INPUT' || (e.target as HTMLElement).tagName === 'TEXTAREA')) return;
        e.preventDefault();
        togglePlay();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const seek = (clientX: number) => {
    const v = videoRef.current;
    const tl = timelineRef.current;
    if (!v || !tl || !v.duration) return;
    const rect = tl.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    v.currentTime = ratio * v.duration;
    setCurrentTime(v.currentTime);
    setProgress(ratio * 100);
  };

  const onTimelineMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsScrubbing(true);
    seek(e.clientX);

    const onMouseMove = (ev: MouseEvent) => {
      seek(ev.clientX);
    };
    const onMouseUp = () => {
      setIsScrubbing(false);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  const formatTime = (sec: number) => {
    if (!sec || isNaN(sec)) return '0:00';
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStartXRef.current;
    if (delta > 40 && onPrev) onPrev();
    else if (delta < -40 && onNext) onNext();
    touchStartXRef.current = null;
  };

  return (
    <div
      className="proj-video-stage"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="proj-stage-wrapper">
        {hasMultipleVideos && onPrev && (
          <button
            className="proj-carousel-arrow prev-arrow"
            aria-label="Previous video"
            data-cursor="Prev"
            onClick={(e) => {
              e.stopPropagation();
              onPrev();
            }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
        )}

        <div className="proj-stage-card stage-card-center proj-media is-video">
          <div className="proj-video-player-frame" onClick={togglePlay}>
            <video
              ref={videoRef}
              src={src}
              poster={poster}
              preload="metadata"
              playsInline
              loop
              muted
            />

            <div
              className={`proj-video-controls ${isScrubbing ? 'is-scrubbing' : ''}`}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="proj-video-play-btn"
                aria-label={isPlaying ? 'Pause' : 'Play'}
                onClick={togglePlay}
              >
                {isPlaying ? (
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <rect x="6" y="5" width="4" height="14" rx="1" />
                    <rect x="14" y="5" width="4" height="14" rx="1" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <polygon points="7 5 19 12 7 19 7 5" />
                  </svg>
                )}
              </button>

              <div
                ref={timelineRef}
                className={`proj-video-timeline ${isScrubbing ? 'is-scrubbing' : ''}`}
                onMouseDown={onTimelineMouseDown}
              >
                <div className="proj-video-buffered" style={{ width: `${buffered}%` }} />
                <div className="proj-video-progress" style={{ width: `${progress}%` }} />
                <div className="proj-video-handle" style={{ left: `${progress}%` }} />
              </div>

              <div className="proj-video-time">
                <span>{formatTime(currentTime)}</span>
                <span className="proj-video-time-sep">/</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>
          </div>
        </div>

        {hasMultipleVideos && onNext && (
          <button
            className="proj-carousel-arrow next-arrow"
            aria-label="Next video"
            data-cursor="Next"
            onClick={(e) => {
              e.stopPropagation();
              onNext();
            }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        )}
      </div>

      <div className="proj-media-caption">
        {counterText && <span className="proj-media-counter">{counterText}</span>}
        <span className="proj-media-title">{title}</span>
      </div>
    </div>
  );
};

export const ProjectView: React.FC = () => {
  const { activeView, activeProjectSlug, navigate } = usePortfolio();
  const [isMoreInfoOpen, setIsMoreInfoOpen] = useState(false);
  const [, setPlayingIdx] = useState<number | null>(null);
  const [activeMediaSrc, setActiveMediaSrc] = useState<string | null>(null);
  const [activeItemIdx, setActiveItemIdx] = useState<number | null>(null);
  const [slideDirection, setSlideDirection] = useState<'next' | 'prev' | null>(null);
  const touchStartXRef = useRef<number | null>(null);

  useEffect(() => {
    setActiveMediaSrc(null);
    setActiveItemIdx(null);
    setPlayingIdx(null);
    setSlideDirection(null);
  }, [activeProjectSlug]);

  if (activeView !== 'project' || !activeProjectSlug) {
    return null;
  }

  const resolvedSlug = (activeProjectSlug === 'luminal-hr' || activeProjectSlug === 'ui-ux-design') ? 'ui-and-ux-design' : (activeProjectSlug === 'burnout' ? 'promotion-videos' : (activeProjectSlug === 'behind-the-lens' ? 'modern-design-and-typography' : activeProjectSlug));
  const projectIdx = PROJECTS.findIndex((p) => p.slug === resolvedSlug || p.slug === activeProjectSlug);
  let project = PROJECTS[projectIdx] || PROJECTS[0];
  if (project.targetSlug) {
    const referred = PROJECTS.find((p) => p.slug === project.targetSlug);
    if (referred) project = referred;
  }

  const isProjectVideo = project.mediaKind === 'video' || project.media?.type === 'video';
  const defaultMediaSrc = (project.media && project.media.src) || project.thumb || '';
  const mediaSrc = activeMediaSrc || defaultMediaSrc;

  const allProjectItems = project.items || [];
  const itemIdx = activeItemIdx ?? 0;
  const boundedIdx = allProjectItems.length > 0 ? (itemIdx % allProjectItems.length + allProjectItems.length) % allProjectItems.length : 0;
  const currentItem = allProjectItems[boundedIdx] || { title: project.title, src: mediaSrc };

  const currentItemSrc = activeMediaSrc || currentItem?.src || currentItem?.url || defaultMediaSrc;
  const isCurrentVideo = Boolean(
    (currentItem && currentItem.type === 'play') ||
    (currentItemSrc && (currentItemSrc.endsWith('.mp4') || currentItemSrc.endsWith('.webm'))) ||
    (!allProjectItems.length && isProjectVideo)
  );

  const prevIdx = allProjectItems.length > 0 ? (boundedIdx - 1 + allProjectItems.length) % allProjectItems.length : 0;
  const nextIdx = allProjectItems.length > 0 ? (boundedIdx + 1) % allProjectItems.length : 0;
  const prevItem = allProjectItems[prevIdx];
  const nextItem = allProjectItems[nextIdx];

  const goToItem = (newIdx: number, dir?: 'next' | 'prev') => {
    if (!allProjectItems.length) return;
    const bounded = (newIdx + allProjectItems.length) % allProjectItems.length;
    const targetItem = allProjectItems[bounded];
    setSlideDirection(dir || (newIdx > boundedIdx ? 'next' : 'prev'));
    setActiveItemIdx(bounded);
    setPlayingIdx(bounded);
    setActiveMediaSrc(targetItem?.src || targetItem?.url || null);

    // Preload adjacent images if they are images
    const nextNeighbor = (bounded + 1) % allProjectItems.length;
    const prevNeighbor = (bounded - 1 + allProjectItems.length) % allProjectItems.length;
    const nSrc = allProjectItems[nextNeighbor]?.src || allProjectItems[nextNeighbor]?.url;
    const pSrc = allProjectItems[prevNeighbor]?.src || allProjectItems[prevNeighbor]?.url;
    if (nSrc && !nSrc.endsWith('.mp4') && !nSrc.endsWith('.webm')) {
      const imgA = new Image();
      imgA.src = nSrc;
    }
    if (pSrc && !pSrc.endsWith('.mp4') && !pSrc.endsWith('.webm')) {
      const imgB = new Image();
      imgB.src = pSrc;
    }
  };

  // Keyboard navigation for all multi-item projects
  useEffect(() => {
    if (allProjectItems.length <= 1) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.target && ((e.target as HTMLElement).tagName === 'INPUT' || (e.target as HTMLElement).tagName === 'TEXTAREA')) return;
      if (e.key === 'ArrowLeft') goToItem(boundedIdx - 1, 'prev');
      if (e.key === 'ArrowRight') goToItem(boundedIdx + 1, 'next');
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [allProjectItems.length, boundedIdx]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStartXRef.current;
    if (delta > 40) goToItem(boundedIdx - 1, 'prev');
    else if (delta < -40) goToItem(boundedIdx + 1, 'next');
    touchStartXRef.current = null;
  };

  const openFullImage = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const fullUrl = currentItem?.url || currentItem?.src || currentItemSrc;
    if (fullUrl && !isCurrentVideo) {
      window.open(fullUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div
      className={`view ${activeView === 'project' ? 'active' : ''}`}
      data-view="project"
      style={{ overflowY: 'auto' }}
    >
      <div className="project-page">
        <button className="back-link" onClick={() => navigate('space')}>
          <span className="back-arrow">← BACK</span>
          <span className="back-sub">TO ALL PROJECTS</span>
        </button>

        <div className="corner-badge" aria-hidden="true">
          <svg viewBox="0 0 100 100" className="badge-svg">
            <path id="projBadgeCircleReact" d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0" fill="transparent" />
            <text className="badge-text">
              <textPath href="#projBadgeCircleReact" startOffset="0%">
                THE SOUND BEHIND CO • THE SOUND BEHIND CO •
              </textPath>
            </text>
          </svg>
          <span className="badge-dot"></span>
        </div>

        <header className="proj-head">
          <h1 className="title">{project.title}</h1>
          {project.short && <p className="proj-short">{project.short}</p>}

          {(project.description || project.moreInfo) && (
            <>
              <button
                className="more-info-toggle"
                onClick={() => setIsMoreInfoOpen((prev) => !prev)}
              >
                <span className="plus">{isMoreInfoOpen ? '−' : '+'}</span>
                <span className="lbl">MORE INFO</span>
              </button>
              <div className={`more-info-panel ${isMoreInfoOpen ? 'open' : ''}`}>
                {project.description && <p className="desc">{project.description}</p>}
                {project.moreInfo && <p>{project.moreInfo}</p>}
              </div>
            </>
          )}
        </header>

        {isCurrentVideo ? (
          <>
            <CustomVideoPlayer
              src={currentItemSrc}
              poster={currentItem.poster || currentItem.thumb || project.media?.poster || ''}
              title={currentItem.title || project.title}
              hasMultipleVideos={allProjectItems.length > 1}
              counterText={allProjectItems.length > 0 ? `${String(boundedIdx + 1).padStart(2, '0')} / ${String(allProjectItems.length).padStart(2, '0')}` : undefined}
              onPrev={() => goToItem(boundedIdx - 1, 'prev')}
              onNext={() => goToItem(boundedIdx + 1, 'next')}
            />

            {allProjectItems.length > 1 && (
              <div className="proj-dot-nav">
                {allProjectItems.map((_, idx) => (
                  <div
                    key={idx}
                    className={`dot ${idx === boundedIdx ? 'active' : ''}`}
                    onClick={() => goToItem(idx, idx > boundedIdx ? 'next' : 'prev')}
                  />
                ))}
              </div>
            )}
          </>
        ) : allProjectItems.length > 1 ? (
          <>
            <div
              className="proj-stage-container"
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              <div className="proj-stage-wrapper">
                <button
                  className="proj-carousel-arrow prev-arrow"
                  aria-label="Previous slide"
                  data-cursor="Prev"
                  onClick={(e) => {
                    e.stopPropagation();
                    goToItem(boundedIdx - 1, 'prev');
                  }}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="15 18 9 12 15 6" />
                  </svg>
                </button>

                <div className="proj-stage-track">
                  {prevItem && (
                    <div
                      className="proj-stage-card stage-card-prev"
                      title={`Previous: ${prevItem.title}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        goToItem(boundedIdx - 1, 'prev');
                      }}
                    >
                      <img src={prevItem.thumb || prevItem.src || prevItem.url} alt={prevItem.title} />
                    </div>
                  )}

                  <div className="proj-stage-card stage-card-center">
                    <div
                      className="proj-media"
                      style={{ cursor: currentItemSrc ? 'pointer' : 'default' }}
                      onClick={openFullImage}
                      title="Click to view full image in new tab"
                    >
                      {currentItemSrc && (
                        <img
                          key={`bg-${currentItemSrc}`}
                          className="proj-media-backdrop"
                          src={currentItemSrc}
                          alt=""
                          aria-hidden="true"
                        />
                      )}
                      {currentItemSrc && (
                        <img
                          key={currentItemSrc}
                          className={`proj-media-sharp ${slideDirection ? `slide-enter-${slideDirection}` : ''}`}
                          src={currentItemSrc}
                          alt={currentItem?.title || project.title}
                          decoding="async"
                        />
                      )}
                    </div>
                  </div>

                  {nextItem && (
                    <div
                      className="proj-stage-card stage-card-next"
                      title={`Next: ${nextItem.title}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        goToItem(boundedIdx + 1, 'next');
                      }}
                    >
                      <img src={nextItem.thumb || nextItem.src || nextItem.url} alt={nextItem.title} />
                    </div>
                  )}
                </div>

                <button
                  className="proj-carousel-arrow next-arrow"
                  aria-label="Next slide"
                  data-cursor="Next"
                  onClick={(e) => {
                    e.stopPropagation();
                    goToItem(boundedIdx + 1, 'next');
                  }}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </button>
              </div>

              <div className="proj-media-caption">
                <span className="proj-media-counter">
                  {String(boundedIdx + 1).padStart(2, '0')} / {String(allProjectItems.length).padStart(2, '0')}
                </span>
                <span className="proj-media-title">{currentItem?.title || project.title}</span>
              </div>

              {/* Mobile dot navigation */}
              <div className="proj-dot-nav">
                {allProjectItems.map((_, idx) => (
                  <div
                    key={idx}
                    className={`dot ${idx === boundedIdx ? 'active' : ''}`}
                    onClick={() => goToItem(idx, idx > boundedIdx ? 'next' : 'prev')}
                  />
                ))}
              </div>
            </div>

            <div className="proj-thumb-strip">
              {allProjectItems.map((it, idx) => (
                <div
                  key={idx}
                  className={`proj-thumb-card ${idx === boundedIdx ? 'active' : ''}`}
                  title={it.title}
                  onClick={(e) => {
                    e.stopPropagation();
                    goToItem(idx, idx > boundedIdx ? 'next' : 'prev');
                  }}
                >
                  <img src={it.thumb || it.src || it.url} alt={it.title} loading="lazy" />
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="proj-stage-container proj-single-stage">
            <div className="proj-stage-wrapper">
              <div className="proj-stage-card stage-card-center">
                <div
                  className="proj-media"
                  style={{ cursor: currentItemSrc ? 'pointer' : 'default' }}
                  onClick={openFullImage}
                  title={currentItemSrc ? 'Click to view full image in new tab' : undefined}
                >
                  {currentItemSrc ? (
                    <>
                      <img className="proj-media-backdrop" src={currentItemSrc} alt="" aria-hidden="true" />
                      <img className="proj-media-sharp" src={currentItemSrc} alt={project.title} decoding="async" />
                    </>
                  ) : (
                    <div className="ph">
                      <span>{project.title}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="proj-media-caption">
              <span className="proj-media-counter">01 / 01</span>
              <span className="proj-media-title">{project.title}</span>
            </div>
          </div>
        )}

        {allProjectItems && allProjectItems.length > 0 && (
          <div className="track-list">
            {allProjectItems.map((it, i) => {
              const isItemActive = boundedIdx === i;
              return (
                <div
                  key={i}
                  className={`track-row ${it.type === 'view' ? 'view' : ''} ${isItemActive ? 'is-playing' : ''}`}
                  onClick={() => goToItem(i, i > boundedIdx ? 'next' : 'prev')}
                >
                  <div className="track-left">
                    <span className="num">{String(i + 1).padStart(3, '0')}</span>
                    <span className="tname">{it.title}</span>
                  </div>
                  <button className="playmini" aria-label={it.type === 'view' ? 'View' : 'Play'}>
                    {it.type === 'view' ? (
                      <span>{it.meta || 'VIEW'}</span>
                    ) : (
                      <>
                        <svg className="icon-play" viewBox="0 0 24 24" style={{ display: isItemActive ? 'none' : 'block' }}>
                          <polygon points="7 5 19 12 7 19 7 5" />
                        </svg>
                        <svg className="icon-pause" viewBox="0 0 24 24" style={{ display: isItemActive ? 'block' : 'none' }}>
                          <rect x="6" y="5" width="4" height="14" rx="1" />
                          <rect x="14" y="5" width="4" height="14" rx="1" />
                        </svg>
                      </>
                    )}
                  </button>
                  <span className="time">{it.meta || '0:00'}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
