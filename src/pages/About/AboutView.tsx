import React, { useState, useRef, useEffect, useCallback } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { PROJECTS, SITE_CONFIG } from '../../data/portfolioData';
import { SectionIndicator } from './SectionIndicator';

const ORBIT_SLUGS = ['team-never-enough', 'luminal-hr', 'burnout', 'wheelie-city', 'behind-the-lens', 'reel-2026'];

export const AboutView: React.FC = () => {
  const { activeView, navigate } = usePortfolio();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [activeSection, setActiveSection] = useState(0);

  const orbitProjects = ORBIT_SLUGS.map((slug) => PROJECTS.find((p) => p.slug === slug)).filter(Boolean);

  const handleScroll = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const sections = container.querySelectorAll<HTMLElement>('.about-section-wrap');
    const viewRect = container.getBoundingClientRect();
    const viewCenter = viewRect.top + viewRect.height * 0.45;

    let closestIdx = 0;
    let minDistance = Infinity;

    sections.forEach((sec, idx) => {
      const rect = sec.getBoundingClientRect();
      const secCenter = rect.top + rect.height * 0.4;
      const dist = Math.abs(secCenter - viewCenter);
      if (dist < minDistance) {
        minDistance = dist;
        closestIdx = idx;
      }
    });

    setActiveSection(closestIdx);
  }, []);

  useEffect(() => {
    if (activeView === 'about') {
      if (containerRef.current) {
        containerRef.current.scrollTop = 0;
      }
      window.scrollTo(0, 0);
      setActiveSection(0);
    }
  }, [activeView]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || activeView !== 'about') return;

    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    container.addEventListener('scroll', onScroll, { passive: true });
    return () => container.removeEventListener('scroll', onScroll);
  }, [activeView, handleScroll]);

  const scrollToSection = (index: number) => {
    const container = containerRef.current;
    if (!container) return;
    const target = container.querySelector<HTMLElement>(`#about-sec-${index}`);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div
      ref={containerRef}
      className={`view ${activeView === 'about' ? 'active' : ''}`}
      data-view="about"
      style={{
        overflowY: 'auto',
        overflowX: 'hidden'
      }}
    >
      <div className="about-page">
        <SectionIndicator
          activeSection={activeSection}
          onSelectSection={scrollToSection}
        />

        {/* Section 0: Fullscreen Hero */}
        <section className="about-section-wrap about-section-wrap--hero" id="about-sec-0">
          <div className="about-bg-layer revealed">
            <img
              className="about-bg-media"
              src={SITE_CONFIG.aboutBg || '/media/about-hero-bg.jpg'}
              alt="Sriram MJ Multidisciplinary Designer"
              decoding="async"
            />
            <div className="about-bg-vignette" />
          </div>

          <div className="about-hero-content">
            <div className="about-hero-headline-wrap">
              <h1 className="about-hero-headline">
                <div className="about-hero-line about-hero-line--1">
                  <span className="zapf-display">SRIRAM</span>
                  <span className="about-connector">IS A</span>
                </div>
                <div className="about-hero-line about-hero-line--2">
                  <span className="zapf-display">DESIGNER</span>
                  <span className="about-connector">FOR</span>
                  <span className="zapf-display">ALL MEDIA</span>
                </div>
                <div className="about-hero-subline">
                  <span className="about-connector">AS WELL AS</span>
                  <span className="zapf-sub-display">VIDEO EDITOR</span>
                  <span className="about-connector">AND</span>
                  <span className="zapf-sub-display">VISUAL CRAFTSMAN</span>
                </div>
              </h1>
            </div>
          </div>

          <div className="about-scroll-hint" role="presentation">
            <span>SCROLL TO EXPLORE</span>
            <div className="scroll-arrow">↓</div>
          </div>
        </section>

        {/* Section 1: Stepped Typography (Foundations & Rhythm) */}
        <section className="about-section-wrap about-section-wrap--stepped" id="about-sec-1">
          <div className="about-section-inner">
            <div className="about-sec-eyebrow">MEANING IN EVERY DETAIL</div>
            <div className="stepped-typography" aria-label="SRIRAM BELIEVES EVERY COLOR HAS A STORY TO TELL">
              <div className="stepped-row step-0"><span className="zapf-step">SRIRAM</span></div>
              <div className="stepped-row step-1"><span className="zapf-step">BELIEVES EVERY</span></div>
              <div className="stepped-row step-2"><span className="zapf-step">COLOR HAS</span></div>
              <div className="stepped-row step-3"><span className="zapf-step">A STORY</span></div>
              <div className="stepped-row step-4"><span className="zapf-step">TO TELL</span></div>
            </div>
            <div className="about-editorial-text-wrap">
              <p className="about-editorial-p">
                Sriram has a strong belief that every color carries meaning, and every element has a purpose. He pays attention to even the smallest details, often embedding meaning within the tiniest parts of his work. He creates primarily for self-satisfaction and personal expression, which makes every production a reflection of his personality, perspective, and character.
              </p>
              <p className="about-editorial-quote">
                “My work is not just something I create; it is a reflection of who I am.”
              </p>
            </div>
          </div>
        </section>

        {/* Section 2: Stepped Typography (Interface Architecture) */}
        <section className="about-section-wrap about-section-wrap--stepped about-section-wrap--interface" id="about-sec-2">
          <div className="about-section-inner">
            <div className="about-sec-eyebrow text-center">SYSTEMATIC INTERACTION DESIGN</div>
            <div className="stepped-typography stepped-typography--alt" aria-label="STRUCTURING IDEAS INTO UI/UX THROUGH DIGITAL ARCHITECTURE">
              <div className="stepped-row step-alt-0"><span className="zapf-step">STRUCTURING IDEAS</span></div>
              <div className="stepped-row step-alt-1"><span className="zapf-step">INTO UI/UX</span></div>
              <div className="stepped-row step-alt-2"><span className="zapf-step">THROUGH DIGITAL</span></div>
              <div className="stepped-row step-alt-3"><span className="zapf-step">ARCHITECTURE</span></div>
            </div>
            <div className="about-editorial-text-wrap">
              <p className="about-editorial-p">
                I begin by structuring the idea and breaking the work into meaningful components. This allows me to organize content, define how each element connects within the UI, and establish a clear direction before moving into design. I then execute the plan, refine the details, and continuously iterate until the final result feels clear, intentional, and complete.
              </p>
            </div>
          </div>
        </section>

        {/* Section 3: Disciplines Orbit (Showcase Cards) */}
        <section className="about-section-wrap about-section-wrap--orbit" id="about-sec-3">
          <div className="about-section-inner about-section-inner--wide">
            <div className="about-sec-eyebrow text-center">DISCIPLINES & SHOWCASE</div>
            <div className="about-orbit-center-statement">
              <h2 className="orbit-lead-text">EDITING, ARCHITECTING, AND CRAFTING ACROSS ALL MEDIA</h2>
              <p className="orbit-sub-text">COMBINING HIGH-OCTANE VIDEO EDITING, SYSTEMIC PRODUCT DESIGN, AND EXPERIMENTAL VISUALS</p>
            </div>
            <div className="about-orbit-grid">
              {orbitProjects.map((p, i) => {
                if (!p) return null;
                const thumb = p.thumb || p.media?.src || '';
                return (
                  <div
                    key={p.slug}
                    className={`about-orbit-card about-orbit-card--${i + 1}`}
                    data-slug={p.slug}
                    tabIndex={0}
                    role="button"
                    aria-label={`View project ${p.title}`}
                    onClick={() => navigate('project', p.slug)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        navigate('project', p.slug);
                      }
                    }}
                  >
                    <div className="orbit-card-inner">
                      <div className="orbit-card-thumb-wrap">
                        <img
                          src={thumb}
                          alt={p.title}
                          className="orbit-card-img"
                          loading="lazy"
                          decoding="async"
                        />
                      </div>
                      <div className="orbit-card-meta">
                        <span className="orbit-card-num">{`00${i + 1}`}</span>
                        <span className="orbit-card-title">{p.title}</span>
                        <span className="orbit-card-cat">{p.category}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Section 4: Socials & Outreach */}
        <section className="about-section-wrap about-section-wrap--socials" id="about-sec-4">
          <div className="about-section-inner">
            <div className="about-sec-eyebrow text-center">COLLABORATIONS & OUTREACH</div>
            <div className="about-socials-block">
              <div className="about-socials-lead">FOR</div>
              <div className="about-socials-display">MORE UPDATES</div>
              <div className="about-socials-sub">FOLLOW SRIRAM ON</div>
              <div className="about-socials-row">
                <a
                  href="https://www.instagram.com/delusional.efx?stkn=MW82b2ttZW9vdnNuaw=="
                  target="_blank"
                  rel="noopener noreferrer"
                  className="about-social-pill"
                >
                  INSTAGRAM
                </a>
                <span className="about-social-or">OR</span>
                <a
                  href="https://www.linkedin.com/in/sriram-m-j-5491a7322/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="about-social-pill"
                >
                  LINKEDIN
                </a>
                <span className="about-social-or">OR</span>
                <a
                  href="mailto:srirammj221@gmail.com"
                  className="about-social-pill"
                >
                  EMAIL
                </a>
              </div>
              <div className="about-cta-actions">
                <button
                  className="about-action-btn about-action-btn--primary"
                  onClick={() => navigate('contact')}
                >
                  GET IN TOUCH / CONTACT ME →
                </button>
                <button
                  className="about-action-btn about-action-btn--secondary"
                  onClick={() => navigate('space')}
                >
                  EXPLORE 3D SPACE VIEW ↗
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
