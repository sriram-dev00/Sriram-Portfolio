import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { ViewName, Project } from '../types/portfolio';
import { useAudioEngine } from '../hooks/useAudioEngine';
import { PROJECTS } from '../data/portfolioData';

interface PortfolioContextValue {
  activeView: ViewName;
  activeProjectSlug: string | null;
  activeHoveredProject: Project | null;
  setActiveHoveredProject: (proj: Project | null) => void;
  isGatePassed: boolean;
  setGatePassed: (passed: boolean) => void;
  isGateExiting: boolean;
  setIsGateExiting: (exiting: boolean) => void;
  navigate: (view: ViewName, slug?: string) => void;
  sound: ReturnType<typeof useAudioEngine>;
}

const PortfolioContext = createContext<PortfolioContextValue | null>(null);

function parseHash(hash: string): { view: ViewName; slug: string | null } {
  const raw = hash.replace('#', '') || 'space';
  const parts = raw.split('/');
  let view = parts[0] as ViewName;
  const slug = parts[1] || null;

  if (['home', 'work', 'front', 'main'].includes(view)) {
    view = 'space';
  }
  if (!['space', 'index', 'about', 'contact', 'project'].includes(view)) {
    view = 'space';
  }

  return { view, slug };
}

export const PortfolioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const initial = typeof window !== 'undefined' ? parseHash(window.location.hash) : { view: 'space' as ViewName, slug: null };
  const [activeView, setActiveView] = useState<ViewName>(initial.view);
  const [activeProjectSlug, setActiveProjectSlug] = useState<string | null>(initial.slug);
  const [activeHoveredProject, setActiveHoveredProject] = useState<Project | null>(null);

  // If user deep-links to #about, #contact, #index, or #project directly, bypass gate
  const [isGatePassed, setGatePassed] = useState<boolean>(() => {
    if (typeof window === 'undefined') return true;
    const { view } = parseHash(window.location.hash);
    return view !== 'space';
  });
  const [isGateExiting, setIsGateExiting] = useState<boolean>(false);

  const sound = useAudioEngine();

  const navigate = useCallback((view: ViewName, slug?: string) => {
    setActiveView(view);
    setActiveProjectSlug(slug || null);
    const newHash = slug ? `#${view}/${slug}` : `#${view}`;
    if (window.location.hash !== newHash) {
      window.location.hash = newHash;
    }
  }, []);

  useEffect(() => {
    const handleHashChange = () => {
      const { view, slug } = parseHash(window.location.hash);
      setActiveView(view);
      setActiveProjectSlug(slug);
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Toggle scroll permissions matching vanilla app_engine.js
  useEffect(() => {
    if (activeView === 'space' || activeView === 'index') {
      document.body.classList.remove('scroll-ok');
    } else {
      document.body.classList.add('scroll-ok');
    }
  }, [activeView]);

  // Update document title dynamically based on active view and project
  useEffect(() => {
    if (activeView === 'project' && activeProjectSlug) {
      const p = PROJECTS.find(item => item.slug === activeProjectSlug);
      if (p) {
        document.title = `${p.title} | Sriram MJ`;
        return;
      }
    }
    document.title = 'Sriram MJ | Multidisciplinary Designer';
  }, [activeView, activeProjectSlug]);

  const value: PortfolioContextValue = {
    activeView,
    activeProjectSlug,
    activeHoveredProject,
    setActiveHoveredProject,
    isGatePassed,
    setGatePassed,
    isGateExiting,
    setIsGateExiting,
    navigate,
    sound
  };

  return <PortfolioContext.Provider value={value}>{children}</PortfolioContext.Provider>;
};

export function usePortfolio() {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
}
