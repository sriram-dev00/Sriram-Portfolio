import React from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { useScrambleText } from '../../hooks/useScrambleText';
import { SITE_CONFIG } from '../../data/portfolioData';

export const BrandHeader: React.FC = () => {
  const { navigate } = usePortfolio();
  const scrambledName = useScrambleText(SITE_CONFIG.name);

  return (
    <header
      className="brand"
      title="Return to Front Page / Home"
      data-cursor="Home"
      onClick={() => navigate('space')}
      style={{ cursor: 'pointer', pointerEvents: 'auto' }}
    >
      <span className="name">{scrambledName}</span>
      <span className="role">{SITE_CONFIG.role}</span>
    </header>
  );
};
