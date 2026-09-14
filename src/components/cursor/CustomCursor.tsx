import React, { useEffect, useRef, useState } from 'react';

interface CharData {
  ch: string;
  baseOffsetX: number;
  x: number;
  y: number;
  opacity: number;
  targetOpacity: number;
  el: HTMLSpanElement | null;
}

const OFFSET_X = 14;
const OFFSET_Y = 14;

export const CustomCursor: React.FC = () => {
  const [isSupported, setIsSupported] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const charDataRef = useRef<CharData[]>([]);
  const currentTextRef = useRef<string>('');
  const isVisibleRef = useRef<boolean>(false);
  const mouseXRef = useRef<number>(-1000);
  const mouseYRef = useRef<number>(-1000);
  const hasMovedMouseRef = useRef<boolean>(false);
  const rafIdRef = useRef<number | null>(null);
  const isLoopRunningRef = useRef<boolean>(false);

  useEffect(() => {
    const isFine = window.matchMedia('(pointer: fine)').matches && window.matchMedia('(hover: hover)').matches;
    setIsSupported(isFine);
    if (!isFine) return;

    const startLoop = () => {
      if (isLoopRunningRef.current) return;
      isLoopRunningRef.current = true;
      rafIdRef.current = requestAnimationFrame(renderLoop);
    };

    const stopLoop = () => {
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
      isLoopRunningRef.current = false;
    };

    const renderLoop = () => {
      const charData = charDataRef.current;
      const mouseX = mouseXRef.current;
      const mouseY = mouseYRef.current;
      let stillMoving = false;

      if (hasMovedMouseRef.current && charData.length > 0) {
        const totalW = charData.length > 0 ? charData[charData.length - 1].baseOffsetX + 16 : 0;
        let startX = mouseX + OFFSET_X;
        if (mouseX + totalW + 24 > window.innerWidth) {
          startX = mouseX - totalW - 14;
        }
        let targetBaseY = mouseY + OFFSET_Y;
        if (mouseY + 32 > window.innerHeight) {
          targetBaseY = mouseY - 24;
        }

        for (let i = 0; i < charData.length; i++) {
          const cd = charData[i];
          const targetX = startX + cd.baseOffsetX;
          const targetY = targetBaseY;
          const easing = Math.max(0.06, 0.22 * Math.pow(0.86, i));

          const dx = targetX - cd.x;
          const dy = targetY - cd.y;
          const dop = cd.targetOpacity - cd.opacity;

          if (Math.abs(dx) > 0.05 || Math.abs(dy) > 0.05 || Math.abs(dop) > 0.01) {
            stillMoving = true;
          }

          cd.x += dx * easing;
          cd.y += dy * easing;
          cd.opacity += dop * 0.2;

          if (cd.el) {
            cd.el.style.transform = `translate3d(${cd.x.toFixed(2)}px, ${cd.y.toFixed(2)}px, 0)`;
            cd.el.style.opacity = cd.opacity.toFixed(3);
          }
        }
      }

      // If stationary and settled, sleep the loop until the next mouse motion
      if (stillMoving || isVisibleRef.current) {
        rafIdRef.current = requestAnimationFrame(renderLoop);
      } else {
        stopLoop();
      }
    };

    const setCursorText = (text: string) => {
      if (text === currentTextRef.current) return;
      currentTextRef.current = text;
      const container = containerRef.current;
      if (!container) return;

      container.innerHTML = '';
      charDataRef.current = [];
      if (!text) return;

      const chars = Array.from(text);
      const measurer = document.createElement('div');
      measurer.className = 'custom-cursor-measurer';

      const tempSpans = chars.map((ch) => {
        const span = document.createElement('span');
        span.className = 'cursor-char';
        span.textContent = ch === ' ' ? '\u00A0' : ch;
        measurer.appendChild(span);
        return span;
      });

      container.appendChild(measurer);
      const baseOffsets = tempSpans.map((s) => s.offsetLeft);
      container.removeChild(measurer);

      charDataRef.current = chars.map((ch, i) => {
        const span = document.createElement('span');
        span.className = 'cursor-char';
        span.textContent = ch === ' ' ? '\u00A0' : ch;
        span.style.opacity = '0';
        container.appendChild(span);

        return {
          ch,
          baseOffsetX: baseOffsets[i] || i * 8,
          x: mouseXRef.current,
          y: mouseYRef.current,
          opacity: 0,
          targetOpacity: 1,
          el: span
        };
      });
    };

    const showCursor = (text: string) => {
      if (!text) {
        hideCursor();
        return;
      }
      if (currentTextRef.current !== text) {
        setCursorText(text);
      }
      isVisibleRef.current = true;
      charDataRef.current.forEach((cd) => (cd.targetOpacity = 1));
      startLoop();
    };

    const hideCursor = () => {
      isVisibleRef.current = false;
      charDataRef.current.forEach((cd) => (cd.targetOpacity = 0));
    };

    const handlePointerMove = (e: PointerEvent) => {
      mouseXRef.current = e.clientX;
      mouseYRef.current = e.clientY;
      hasMovedMouseRef.current = true;
      startLoop();
    };

    const handlePointerOver = (e: PointerEvent) => {
      const target = (e.target as HTMLElement | null)?.closest('[data-cursor]');
      if (target) {
        const text = target.getAttribute('data-cursor');
        if (text) showCursor(text);
      }
    };

    const handlePointerOut = (e: PointerEvent) => {
      const target = (e.target as HTMLElement | null)?.closest('[data-cursor]');
      if (target) {
        const related = (e.relatedTarget as HTMLElement | null)?.closest('[data-cursor]');
        if (related) {
          const text = related.getAttribute('data-cursor');
          if (text) showCursor(text);
          else hideCursor();
        } else {
          hideCursor();
        }
      }
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    document.addEventListener('pointerover', handlePointerOver, { passive: true });
    document.addEventListener('pointerout', handlePointerOut, { passive: true });

    return () => {
      stopLoop();
      window.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('pointerover', handlePointerOver);
      document.removeEventListener('pointerout', handlePointerOut);
    };
  }, []);

  if (!isSupported) return null;

  return <div ref={containerRef} className="a-cursor" aria-hidden="true" />;
};
