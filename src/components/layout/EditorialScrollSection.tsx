import React, { useEffect, useRef } from 'react';

interface EditorialScrollSectionProps {
  children: React.ReactNode;
  id?: string;
  className?: string;
  zIndex?: number;
}

export const EditorialScrollSection: React.FC<EditorialScrollSectionProps> = ({
  children,
  id,
  className = '',
  zIndex = 10,
}) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const rafId = useRef<number | null>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const handleScroll = () => {
      if (rafId.current !== null) cancelAnimationFrame(rafId.current);

      rafId.current = requestAnimationFrame(() => {
        const rect = el.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const isMobile = window.innerWidth < 768;

        // Normalized progress: 0 when section top is at bottom of screen, 1 when section top reaches focal area
        const totalDistance = viewportHeight * 0.85;
        const entryPoint = viewportHeight - rect.top;
        const progress = Math.max(0, Math.min(1, entryPoint / totalDistance));

        // Physical vertical translation: 80px -> 0px on desktop (40px -> 0px on mobile)
        const maxOffset = isMobile ? 40 : 80;
        const translateY = (1 - progress) * maxOffset;
        const scale = 0.985 + progress * 0.015;
        const opacity = 0.92 + progress * 0.08;

        el.style.setProperty('--section-y', `${translateY.toFixed(1)}px`);
        el.style.setProperty('--section-scale', `${scale.toFixed(3)}`);
        el.style.setProperty('--section-opacity', `${opacity.toFixed(2)}`);

        if (progress > 0.4) {
          el.classList.add('is-active');
        } else {
          el.classList.remove('is-active');
        }
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    handleScroll(); // Trigger on mount

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
      if (rafId.current !== null) cancelAnimationFrame(rafId.current);
    };
  }, []);

  return (
    <div
      id={id}
      ref={sectionRef}
      style={{ zIndex }}
      className={`scroll-editorial-section relative ${className}`}
    >
      {children}
    </div>
  );
};
