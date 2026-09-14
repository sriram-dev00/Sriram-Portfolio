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
  const project = PROJECTS[currentIdx] || PROJECTS[0];
  const nextIdx = (currentIdx + 1) % PROJECTS.length;
  const nextProj = PROJECTS[nextIdx];

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
          ← BACK
        </button>

        <header className="proj-head">
          <div className="proj-category">{project.category || 'PROJECT'}</div>
          <h1 className="title">{project.title}</h1>
          {project.short && <p className="proj-short">{project.short}</p>}
          {project.description && <p className="desc">{project.description}</p>}

          {project.moreInfo && (
            <>
              <button
                className="more-info-toggle"
                onClick={() => setIsMoreInfoOpen((prev) => !prev)}
              >
                <span className="plus">{isMoreInfoOpen ? '−' : '+'}</span>MORE INFO
              </button>
              <div className={`more-info-panel ${isMoreInfoOpen ? 'open' : ''}`}>
                <p>{project.moreInfo}</p>
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
                  <span className="num">{String(i + 1).padStart(2, '0')}</span>
                  <button
                    className="playmini"
                    aria-label={it.type === 'view' ? 'View' : 'Play'}
                  >
                    {it.type === 'view' ? (
                      <span>{it.meta || 'VIEW'}</span>
                    ) : (
                      <svg className="icon-play" viewBox="0 0 24 24">
                        <polygon points="5 3 19 12 5 21 5 3" />
                      </svg>
                    )}
                  </button>
                  <span className="tname">{it.title}</span>
                  <span className="time">{it.meta || ''}</span>
                </div>
              );
            })}
          </div>
        )}

        <div
          className="next-project"
          data-slug={nextProj.slug}
          onClick={() => navigate('project', nextProj.slug)}
        >
          <span className="lbl">NEXT PROJECT</span>
          <span className="np-title">{nextProj.title} →</span>
        </div>
      </div>
    </div>
  );
};
