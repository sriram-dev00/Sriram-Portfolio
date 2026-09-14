import React from 'react';
import { PortfolioProvider } from './context/PortfolioContext';
import { BrandHeader } from './components/chrome/BrandHeader';
import { FooterNav } from './components/chrome/FooterNav';
import { IndexToggle } from './components/chrome/IndexToggle';
import { SoundToggle } from './components/chrome/SoundToggle';
import { CustomCursor } from './components/cursor/CustomCursor';
import { SoundGate } from './components/gate/SoundGate';
import { SpaceView } from './pages/Space/SpaceView';
import { IndexView } from './pages/Index/IndexView';
import { AboutView } from './pages/About/AboutView';
import { ContactView } from './pages/Contact/ContactView';
import { ProjectView } from './pages/Project/ProjectView';

export const App: React.FC = () => {
  return (
    <PortfolioProvider>
      <div id="app">
        <SoundGate />
        <BrandHeader />
        <IndexToggle />
        <FooterNav />
        <SoundToggle />
        <CustomCursor />

        <SpaceView />
        <IndexView />
        <AboutView />
        <ContactView />
        <ProjectView />
      </div>
    </PortfolioProvider>
  );
};
