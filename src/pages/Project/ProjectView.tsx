import React, { useState } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { PROJECTS } from '../../data/portfolioData';

export const ProjectView: React.FC = () => {
  const { activeView, activeProjectSlug, navigate } = usePortfolio();
  const [isMoreInfoOpen, setIsMoreInfoOpen] = useState(false);
  const [playingIdx, setPlayingIdx] = useState<number | null>(null);

  if (activeView !== 'project' || !activeProjectSlug) {
    return null;
  }

  const currentIdx = PROJECTS.findIndex((p) => p.slug === activeProjectSlug);
  let project = PROJECTS[currentIdx] || PROJECTS[0];
  if (project.targetSlug) {
    const referred = PROJECTS.find((p) => p.slug === project.targetSlug);
    if (referred) project = referred;
  }

  const mediaSrc = project.thumb || project.media?.src || '';
  const isVideo = project.mediaKind === 'video' || project.media?.type === 'video';

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

        <div className="proj-media">
          {isVideo ? (
            <video
              src={mediaSrc}
              controls
              autoPlay
              loop
              muted
              playsInline
              poster={project.media?.poster || ''}
            />
          ) : mediaSrc ? (
            <img src={mediaSrc} alt={project.title} decoding="async" />
          ) : (
            <div className="ph">
              <span>{project.title}</span>
            </div>
          )}
          <span className="play-label">{isVideo ? 'PLAY VIDEO' : 'VIEW MEDIA'}</span>
        </div>

        {project.items && project.items.length > 0 && (
          <div className="track-list">
            {project.items.map((it, i) => {
              const isItemPlaying = playingIdx === i;
              return (
                <div
                  key={i}
                  className={`track-row ${it.type === 'view' ? 'view' : ''} ${isItemPlaying ? 'is-playing' : ''}`}
                  onClick={() => {
                    if (it.type !== 'view') {
                      setPlayingIdx(isItemPlaying ? null : i);
                    }
                  }}
                >
                  <div className="track-left">
                    <span className="num">{String(i + 1).padStart(3, '0')}</span>
                    <span className="tname">{it.title}</span>
                  </div>
                  <button
                    className="playmini"
                    aria-label={it.type === 'view' ? 'View' : 'Play'}
                  >
                    {it.type === 'view' ? (
                      <span>{it.meta || 'VIEW'}</span>
                    ) : (
                      <svg className="icon-play" viewBox="0 0 24 24">
                        <polygon points="7 5 19 12 7 19 7 5" />
                      </svg>
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
