import { useState, useEffect, useRef } from 'react';

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';

export function useScrambleText(finalStr: string, duration = 420) {
  const [displayText, setDisplayText] = useState(finalStr);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setDisplayText(finalStr);
      return;
    }

    const startTime = performance.now();

    function update(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1.0);
      let result = '';

      for (let i = 0; i < finalStr.length; i++) {
        if (finalStr[i] === ' ') {
          result += ' ';
          continue;
        }
        const letterProgress = Math.max(0, (progress - i * 0.03) / (1.0 - i * 0.03));
        if (letterProgress >= 1.0) {
          result += finalStr[i];
        } else {
          result += CHARS[Math.floor(Math.random() * CHARS.length)];
        }
      }

      setDisplayText(result);

      if (progress < 1.0) {
        rafRef.current = requestAnimationFrame(update);
      }
    }

    rafRef.current = requestAnimationFrame(update);

    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [finalStr, duration]);

  return displayText;
}
