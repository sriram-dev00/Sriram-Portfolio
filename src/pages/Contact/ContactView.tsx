import React from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { SITE_CONFIG } from '../../data/portfolioData';

export const ContactView: React.FC = () => {
  const { activeView } = usePortfolio();

  return (
    <div
      className={`view ${activeView === 'contact' ? 'active' : ''}`}
      data-view="contact"
    >
      <div className="contact-page">
        <div className="contact-hero-wrap">
          <div className="contact-box">
            <div className="contact-eyebrow">CONTACT & COLLABORATIONS</div>
            <h1 className="contact-main-heading">GET IN TOUCH</h1>
            <p className="contact-desc">
              {SITE_CONFIG.contactText || 'For edits, designs, collabs, or the full reel — reach out.'}
            </p>
            <div className="contact-pills-grid">
              {SITE_CONFIG.contactLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact-pill-link"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
