import { useState, useEffect } from 'react';
import { SPACE_CONFIG } from '../data/portfolioData';

export function getSpatialScaleFactor(width: number, height: number): number {
  const isMobile = width < 768;
  const refW = isMobile ? SPACE_CONFIG.REF_MOBILE_WIDTH : SPACE_CONFIG.REF_WIDTH;
  const refH = isMobile ? SPACE_CONFIG.REF_MOBILE_HEIGHT : SPACE_CONFIG.REF_HEIGHT;
  const refAspect = refW / refH;

  const vpAspect = width / height;
  const baseW = refW * 0.25;
  const baseH = refH * 0.25;

  const baseScale = vpAspect > refAspect ? height / baseH : width / baseW;
  return isMobile ? 0.72 : Math.max(0.78, Math.min(1.15, baseScale));
}

export function getStagePerspective(height: number): number {
  const fovRad = (50 / 2) * (Math.PI / 180);
  const cameraDist = Math.round(height / 2 / Math.tan(fovRad));
  return Math.max(760, Math.min(1200, cameraDist));
}

export function useWindowSize() {
  const [size, setSize] = useState(() => {
    if (typeof window === 'undefined') {
      return { width: 1440, height: 900, isMobile: false, scaleFactor: 1, perspective: 1100 };
    }
    const w = window.innerWidth;
    const h = window.innerHeight;
    return {
      width: w,
      height: h,
      isMobile: w < 768,
      scaleFactor: getSpatialScaleFactor(w, h),
      perspective: getStagePerspective(h)
    };
  });

  useEffect(() => {
    let timer: number | null = null;

    const handleResize = () => {
      if (timer !== null) window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        const w = window.innerWidth;
        const h = window.innerHeight;
        setSize({
          width: w,
          height: h,
          isMobile: w < 768,
          scaleFactor: getSpatialScaleFactor(w, h),
          perspective: getStagePerspective(h)
        });
      }, 100);
    };

    window.addEventListener('resize', handleResize, { passive: true });
    return () => {
      if (timer !== null) window.clearTimeout(timer);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return size;
}
