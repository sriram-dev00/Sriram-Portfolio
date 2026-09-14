import React from 'react';
import { usePortfolio } from '../../context/PortfolioContext';

export const IndexToggle: React.FC = () => {
  const { activeView, activeHoveredProject, navigate } = usePortfolio();

  if (activeView !== 'space') return null;

  const isHiddenForDesc = !!activeHoveredProject;

  return (
    <div
      className={`index-toggle show ${isHiddenForDesc ? 'hide-for-desc' : ''}`}
      aria-label="Toggle Index View"
      onClick={() => navigate('index')}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          navigate('index');
        }
      }}
    >
      <span className="plus" />
      <span className="label">INDEX VIEW</span>
    </div>
  );
};
