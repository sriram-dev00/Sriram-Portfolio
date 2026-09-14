import React from 'react';
import { usePortfolio } from '../../context/PortfolioContext';

export const SoundToggle: React.FC = () => {
  const { sound } = usePortfolio();
  const { isPlaying, toggleAudio } = sound;

  return (
    <button
      className={`sound-toggle ${isPlaying ? 'is-playing' : ''}`}
      aria-label="Toggle Ambient Audio"
      onClick={toggleAudio}
    >
      <svg
        className="icon-on"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        style={{ display: isPlaying ? 'block' : 'none' }}
      >
        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
        <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
      </svg>

      <svg
        className="icon-off"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        style={{ display: isPlaying ? 'none' : 'block' }}
      >
        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
        <line x1="23" y1="9" x2="17" y2="15" />
        <line x1="17" y1="9" x2="23" y2="15" />
      </svg>
    </button>
  );
};
