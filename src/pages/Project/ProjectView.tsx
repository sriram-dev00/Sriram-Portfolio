import React, { useState } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { PROJECTS } from '../../data/portfolioData';

export const ProjectView: React.FC = () => {
  const { activeView, activeProjectSlug, navigate } = usePortfolio();
  const [isMoreInfoOpen, setIsMoreInfoOpen] = useState(false);
  const [playingIdx, setPlayingIdx] = useState<number | null>(null);
  const [activeMediaSrc, setActiveMediaSrc] = useState<string | null>(null);
  const [activeItemIdx, setActiveItemIdx] = useState<number | null>(null);

  React.useEffect(() => {
    setActiveMediaSrc(null);
    setActiveItemIdx(null);
    setPlayingIdx(null);
  }, [activeProjectSlug]);

  if (activeView !== 'project' || !activeProjectSlug) {
    return null;
  }

  const resolvedSlug = (activeProjectSlug === 'luminal-hr' || activeProjectSlug === 'ui-ux-design') ? 'ui-and-ux-design' : activeProjectSlug;
  const currentIdx = PROJECTS.findIndex((p) => p.slug === resolvedSlug || p.slug === activeProjectSlug);
  let project = PROJECTS[currentIdx] || PROJECTS[0];
  if (project.targetSlug) {
    const referred = PROJECTS.find((p) => p.slug === project.targetSlug);
    if (referred) project = referred;
  }

  const isProjectVideo = project.mediaKind === 'video' || project.media?.type === 'video';
  const defaultMediaSrc = (project.media && project.media.src) || project.thumb || '';
  const mediaSrc = activeMediaSrc || defaultMediaSrc;
  const isVideo = isProjectVideo || (Boolean(mediaSrc) && mediaSrc.endsWith('.mp4'));

  const imageItems = !isVideo ? (project.items || []).filter((it) => it.src || it.url || it.type === 'view') : [];
  const isCarousel = imageItems.length > 1;
  const videoItems = isVideo ? (project.items || []).filter((it) => it.src || it.url || it.type === 'play') : [];

  const currentGalleryIdx = activeItemIdx ?? 0;
  const currentItem = imageItems[currentGalleryIdx];
  const prevIdx = (currentGalleryIdx - 1 + imageItems.length) % (imageItems.length || 1);
  const nextIdx = (currentGalleryIdx + 1) % (imageItems.length || 1);
  const prevItem = imageItems[prevIdx];
  const nextItem = imageItems[nextIdx];

  const currentVideoIdx = activeItemIdx ?? 0;
  const currentVideoItem = videoItems[currentVideoIdx] || { title: project.title, src: mediaSrc };

  const goToVideo = (newIdx: number) => {
    if (!videoItems.length) return;
    const bounded = (newIdx + videoItems.length) % videoItems.length;
    const targetItem = videoItems[bounded];
    setActiveItemIdx(bounded);
    setPlayingIdx(bounded);
    setActiveMediaSrc(targetItem?.src || targetItem?.url || null);
  };

  const goToImage = (newIdx: number) => {
    if (!imageItems.length) return;
    const bounded = (newIdx + imageItems.length) % imageItems.length;
    const targetItem = imageItems[bounded];
    setActiveItemIdx(bounded);
    setActiveMediaSrc(targetItem?.src || targetItem?.url || null);

    // Preload adjacent images for butter-smooth, instant transitions
    const nextIdx = (bounded + 1) % imageItems.length;
    const prevIdx = (bounded - 1 + imageItems.length) % imageItems.length;
    const nSrc = imageItems[nextIdx]?.src || imageItems[nextIdx]?.url;
    const pSrc = imageItems[prevIdx]?.src || imageItems[prevIdx]?.url;
    if (nSrc) {
      const imgA = new Image();
      imgA.src = nSrc;
    }
    if (pSrc) {
      const imgB = new Image();
      imgB.src = pSrc;
    }
  };

  React.useEffect(() => {
    if (!isCarousel) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') goToImage(currentGalleryIdx - 1);
      if (e.key === 'ArrowRight') goToImage(currentGalleryIdx + 1);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isCarousel, currentGalleryIdx, imageItems]);

  React.useEffect(() => {
    if (!isVideo || videoItems.length <= 1) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.target && ((e.target as HTMLElement).tagName === 'INPUT' || (e.target as HTMLElement).tagName === 'TEXTAREA')) return;
      if (e.key === 'ArrowLeft') goToVideo(currentVideoIdx - 1);
      if (e.key === 'ArrowRight') goToVideo(currentVideoIdx + 1);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isVideo, currentVideoIdx, videoItems]);

  return (
    <div
      className={`view ${activeView === 'project' ? 'active' : ''}`}
      data-view="project"
      style={{
        overflowY: 'auto'
      }}
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

        {isCarousel ? (
          <>
            <div className="proj-stage-container">
              <button
                className="proj-carousel-arrow prev-arrow"
                aria-label="Previous image"
                data-cursor="Prev"
                onClick={(e) => {
                  e.stopPropagation();
                  goToImage(currentGalleryIdx - 1);
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
                      goToImage(currentGalleryIdx - 1);
                    }}
                  >
                    <img src={prevItem.thumb || prevItem.src || prevItem.url} alt={prevItem.title} />
                    <span className="stage-card-label">{prevItem.title}</span>
                  </div>
                )}

                <div className="proj-stage-card stage-card-center">
                  <div
                    className="proj-media"
                    style={{ cursor: mediaSrc ? 'pointer' : 'default' }}
                    onClick={() => {
                      const fullUrl = currentItem?.url || mediaSrc;
                      if (fullUrl && !isVideo) {
                        window.open(fullUrl, '_blank', 'noopener,noreferrer');
                      }
                    }}
                    title="Click to view full image in new tab"
                  >
                    <img src={mediaSrc} alt={currentItem?.title || project.title} decoding="async" />
                    <span className="play-label">VIEW MEDIA</span>
                  </div>
                  <div className="proj-media-caption">
                    <span className="proj-media-counter">
                      {String(currentGalleryIdx + 1).padStart(2, '0')} / {String(imageItems.length).padStart(2, '0')}
                    </span>
                    <span className="proj-media-title">{currentItem?.title || project.title}</span>
                  </div>
                </div>

                {nextItem && (
                  <div
                    className="proj-stage-card stage-card-next"
                    title={`Next: ${nextItem.title}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      goToImage(currentGalleryIdx + 1);
                    }}
                  >
                    <img src={nextItem.thumb || nextItem.src || nextItem.url} alt={nextItem.title} />
                    <span className="stage-card-label">{nextItem.title}</span>
                  </div>
                )}
              </div>

              <button
                className="proj-carousel-arrow next-arrow"
                aria-label="Next image"
                data-cursor="Next"
                onClick={(e) => {
                  e.stopPropagation();
                  goToImage(currentGalleryIdx + 1);
                }}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            </div>

            <div className="proj-thumb-strip">
              {imageItems.map((it, idx) => (
                <div
                  key={idx}
                  className={`proj-thumb-card ${idx === currentGalleryIdx ? 'active' : ''}`}
                  title={it.title}
                  onClick={(e) => {
                    e.stopPropagation();
                    goToImage(idx);
                  }}
                >
                  <img src={it.thumb || it.src || it.url} alt={it.title} loading="lazy" />
                </div>
              ))}
            </div>
          </>
        ) : isVideo ? (
          <div className="proj-video-stage">
            {videoItems.length > 1 && (
              <button
                className="proj-carousel-arrow prev-arrow"
                aria-label="Previous video"
                data-cursor="Prev"
                title="Previous video (←)"
                onClick={(e) => {
                  e.stopPropagation();
                  goToVideo(currentVideoIdx - 1);
                }}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </button>
            )}

            <div className="proj-video-wrapper">
              <div className="proj-media is-video">
                <video
                  key={mediaSrc}
                  src={mediaSrc}
                  controls
                  autoPlay
                  loop
                  muted
                  playsInline
                  poster={project.media?.poster || ''}
                />
              </div>
              {videoItems.length > 0 && (
                <div className="proj-media-caption">
                  <span className="proj-media-counter">
                    {String(currentVideoIdx + 1).padStart(2, '0')} / {String(videoItems.length).padStart(2, '0')}
                  </span>
                  <span className="proj-media-title">{currentVideoItem.title || project.title}</span>
                </div>
              )}
            </div>

            {videoItems.length > 1 && (
              <button
                className="proj-carousel-arrow next-arrow"
                aria-label="Next video"
                data-cursor="Next"
                title="Next video (→)"
                onClick={(e) => {
                  e.stopPropagation();
                  goToVideo(currentVideoIdx + 1);
                }}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            )}
          </div>
        ) : (
          <div
            className="proj-media"
            style={{ cursor: mediaSrc ? 'pointer' : 'default' }}
            onClick={() => {
              if (mediaSrc) {
                window.open(mediaSrc, '_blank', 'noopener,noreferrer');
              }
            }}
            title={mediaSrc ? 'Click to view full image in new tab' : undefined}
          >
            {mediaSrc ? (
              <img src={mediaSrc} alt={project.title} decoding="async" />
            ) : (
              <div className="ph">
                <span>{project.title}</span>
              </div>
            )}
            <span className="play-label">VIEW MEDIA</span>
          </div>
        )}

        {project.items && project.items.length > 0 && (
          <div className="track-list">
            {project.items.map((it, i) => {
              const isItemPlaying = playingIdx === i;
              const isItemActive = activeItemIdx === i;
              const isInitialVideoPlaying = isVideo && playingIdx === null && activeItemIdx === null && i === 0;
              return (
                <div
                  key={i}
                  className={`track-row ${it.type === 'view' ? 'view' : ''} ${isItemPlaying || isItemActive || isInitialVideoPlaying ? 'is-playing' : ''}`}
                  onClick={() => {
                    if (it.type === 'view') {
                      if (it.src || it.url) {
                        setActiveMediaSrc(it.src || it.url || null);
                        setActiveItemIdx(i);
                      }
                    } else if (isVideo) {
                      goToVideo(i);
                    } else {
                      const nextPlaying = isItemPlaying ? null : i;
                      setPlayingIdx(nextPlaying);
                      setActiveItemIdx(i);
                      if (it.src || it.url) {
                        setActiveMediaSrc(it.src || it.url || null);
                      }
                    }
                  }}
                >
                  <div className="track-left">
                    <span className="num">{String(i + 1).padStart(3, '0')}</span>
                    <span className="tname">{it.title}</span>
                  </div>
                  <button
                    className="playmini"
                    aria-label={it.type === 'view' ? 'View' : (isItemPlaying || isInitialVideoPlaying ? 'Pause' : 'Play')}
                    onClick={(e) => {
                      if (it.type === 'view' && (it.url || it.src)) {
                        e.stopPropagation();
                        setActiveMediaSrc(it.src || it.url || null);
                        setActiveItemIdx(i);
                        window.open(it.url || it.src, '_blank', 'noopener,noreferrer');
                      }
                    }}
                  >
                    {it.type === 'view' ? (
                      <span>{it.meta || 'VIEW'}</span>
                    ) : (isItemPlaying || isInitialVideoPlaying ? (
                      <svg className="icon-pause" viewBox="0 0 24 24">
                        <rect x="6" y="5" width="4" height="14"></rect>
                        <rect x="14" y="5" width="4" height="14"></rect>
                      </svg>
                    ) : (
                      <svg className="icon-play" viewBox="0 0 24 24">
                        <polygon points="7 5 19 12 7 19 7 5" />
                      </svg>
                    ))}
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
