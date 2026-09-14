import React from 'react';

interface SectionIndicatorProps {
  activeSection: number;
  onSelectSection: (index: number) => void;
}

const SECTIONS = [
  { index: 0, title: '' },
  { index: 1, title: 'FOUNDATIONS & RHYTHM' },
  { index: 2, title: 'INTERFACE ARCHITECTURE' },
  { index: 3, title: 'DISCIPLINES ORBIT' },
  { index: 4, title: 'OUTREACH & CONNECT' }
];

export const SectionIndicator: React.FC<SectionIndicatorProps> = ({
  activeSection,
  onSelectSection
}) => {
  return (
    <aside className="o-about-section-indicator" aria-label="Page Sections Navigation">
      <div className="line-wrapper">
        {SECTIONS.map((sec) => (
          <div
            key={sec.index}
            className={`o-about-section-indicator-item ${activeSection === sec.index ? 'is-active' : ''}`}
            data-sec-idx={sec.index}
            role="button"
            tabIndex={0}
            onClick={() => onSelectSection(sec.index)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onSelectSection(sec.index);
              }
            }}
          >
            <span className="item-indicator" />
            <span className="item-title">{sec.title}</span>
          </div>
        ))}
        <div
          className="current-section-indicator"
          style={{ transform: `translateY(${activeSection * 64}px)` }}
        />
      </div>
    </aside>
  );
};
