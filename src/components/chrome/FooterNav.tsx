import React from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { SITE_CONFIG } from '../../data/portfolioData';

export const FooterNav: React.FC = () => {
  const { activeView, navigate } = usePortfolio();

  const isWorkActive = activeView === 'space' || activeView === 'index';
  const isAboutActive = activeView === 'about';
  const isContactActive = activeView === 'contact';

  return (
    <nav className="footer-nav" aria-label="Main Navigation">
      <div className="footer-row">
        <span className="lead">{SITE_CONFIG.navLead1 || 'THE'}</span>
        <button
          className={`nav-btn ${isWorkActive ? 'active' : ''}`}
          data-target="space"
          onClick={() => navigate('space')}
        >
          {SITE_CONFIG.navWork || 'WORK'}
        </button>
        <span className="joiner">{SITE_CONFIG.navLead2 || 'AND'}</span>
        <button
          className={`nav-btn ${isAboutActive ? 'active' : ''}`}
          data-target="about"
          onClick={() => navigate('about')}
        >
          ABOUT
        </button>
        <span className="joiner">ME</span>
      </div>
      <div className="footer-row">
        <span className="joiner">{SITE_CONFIG.navLead3 || 'OR'}</span>
        <button
          className={`nav-btn ${isContactActive ? 'active' : ''}`}
          data-target="contact"
          onClick={() => navigate('contact')}
        >
          {SITE_CONFIG.navContact || 'CONTACT'}
        </button>
      </div>
    </nav>
  );
};
