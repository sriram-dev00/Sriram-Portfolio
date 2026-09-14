import React, { useState, useEffect, useCallback } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';

export const SoundGate: React.FC = () => {
  const { isGatePassed, setGatePassed, sound } = usePortfolio();
  const [isExiting, setIsExiting] = useState(false);
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    setIsTouch(('ontouchstart' in window) || (navigator.maxTouchPoints > 0));
    if (!isGatePassed) {
      document.body.classList.add('in-gate-state');
    }
    return () => {
      document.body.classList.remove('in-gate-state');
    };
  }, [isGatePassed]);

  const handlePassGate = useCallback((withSound: boolean) => {
    if (isExiting || isGatePassed) return;
    setIsExiting(true);

    if (withSound) {
      sound.enableAudio(true);
    } else {
      sound.disableAudio();
    }

    setTimeout(() => {
      document.body.classList.remove('in-gate-state');
    }, 250);

    setTimeout(() => {
      setGatePassed(true);
    }, 1300);
  }, [isExiting, isGatePassed, sound, setGatePassed]);

  if (isGatePassed) return null;

  const clickOrTap = isTouch ? 'TAP' : 'CLICK';

  return (
    <div
      id="soundGateOverlay"
      className={`entrance-gate ${isExiting ? 'gate-fade-out' : ''}`}
      onClick={() => handlePassGate(true)}
    >
      <div id="soundGateText" className={`mg-intro-text ${isExiting ? 'text-dissolve' : ''}`}>
        <div className="mg-intro-words">
          <span style={{ marginLeft: '-21em', marginTop: '0em' }} className="mg-word">
            <span>{clickOrTap}</span>
          </span>
          <span style={{ marginLeft: '-12em', marginTop: '0em' }} className="mg-word">
            <span>ANYWHERE</span>
          </span>
          <span style={{ marginLeft: '-6em', marginTop: '0em' }} className="mg-word">
            <span>TO</span>
          </span>
          <span style={{ marginLeft: '0em', marginTop: '-0.7em' }} className="mg-word">
            <span>TURN</span>
          </span>
          <span style={{ marginLeft: '6em', marginTop: '-0.7em' }} className="mg-word">
            <span>ON</span>
          </span>
          <span style={{ marginLeft: '11em', marginTop: '0em' }} className="mg-word">
            <span>YOUR</span>
          </span>
          <span style={{ marginLeft: '18em', marginTop: '0em' }} className="mg-word">
            <span>SOUND</span>
          </span>
        </div>
      </div>

      <div id="soundGateSkip" className={`intro-enter-link ${isExiting ? 'skip-dissolve' : ''}`}>
        <button
          id="btn-enter-without-sound"
          aria-label="Enter without sound"
          onClick={(e) => {
            e.stopPropagation();
            handlePassGate(false);
          }}
        >
          <span>ENTER WITHOUT SOUND</span>
        </button>
      </div>
    </div>
  );
};
