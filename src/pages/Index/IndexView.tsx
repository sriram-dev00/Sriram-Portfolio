import React, { useState, useRef } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { PROJECTS } from '../../data/portfolioData';

export const IndexView: React.FC = () => {
  const { activeView, navigate } = usePortfolio();
  const [previewSrc, setPreviewSrc] = useState<string>('');
  const [previewTop, setPreviewTop] = useState<number>(0);
  const [isPreviewVisible, setIsPreviewVisible] = useState<boolean>(false);

  const listRef = useRef<HTMLDivElement | null>(null);

  const handleRowEnter = (e: React.MouseEvent<HTMLDivElement>, src: string) => {
    if (!src) return;
    const rect = e.currentTarget.getBoundingClientRect();
    setPreviewSrc(src);
    setPreviewTop(rect.top + rect.height / 2);
    setIsPreviewVisible(true);
  };

  return (
    <div
      className={`view ${activeView === 'index' ? 'active' : ''}`}
      data-view="index"
    >
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

      <div className="index-hover-preview" id="indexHoverPreview">
        <img
          className={`index-preview-img ${isPreviewVisible ? 'visible' : ''}`}
          id="indexPreviewImg"
          src={previewSrc}
          style={{ top: `${previewTop.toFixed(1)}px` }}
          alt="Preview"
          decoding="async"
        />
      </div>

      <div className="index-page-inner">
        <div
          ref={listRef}
          className="index-list"
          onMouseLeave={() => setIsPreviewVisible(false)}
        >
          {PROJECTS.map((p, i) => {
            const bgSrc = p.thumb || p.media?.src || '';
            return (
              <div
                key={p.slug}
                className="row"
                data-slug={p.slug}
                data-cursor="Open"
                role="button"
                tabIndex={0}
                aria-label={`Open project ${p.title}`}
                onMouseEnter={(e) => handleRowEnter(e, bgSrc)}
                onClick={() => navigate('project', p.slug)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    navigate('project', p.slug);
                  }
                }}
              >
                <span className="n">{String(i + 1).padStart(3, '0')}</span>
                <span className="name">{p.title}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
