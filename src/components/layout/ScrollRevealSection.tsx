import React, { useEffect, useRef, useState } from 'react';

interface ScrollRevealSectionProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
  staggerDelay?: number;
}

export const ScrollRevealSection: React.FC<ScrollRevealSectionProps> = ({
  children,
  className = '',
  id,
  staggerDelay = 0,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollDirection, setScrollDirection] = useState<'down' | 'up'>('down');
  const sectionRef = useRef<HTMLDivElement>(null);
  const lastScrollY = useRef<number>(0);

  useEffect(() => {
    // Detect scroll direction for directional motion (translateY +40px vs -40px)
    const updateScrollDirection = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY.current) {
        setScrollDirection('down');
      } else if (currentScrollY < lastScrollY.current) {
        setScrollDirection('up');
      }
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', updateScrollDirection, { passive: true });
    return () => window.removeEventListener('scroll', updateScrollDirection);
  }, []);

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;

    // High performance IntersectionObserver
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        });
      },
      {
        threshold: 0.08,
        rootMargin: '0px 0px -50px 0px',
      }
    );

    observer.observe(node);
    return () => observer.unobserve(node);
  }, []);

  // Directional initial translateY offset
  const initialOffsetClass = scrollDirection === 'down' ? 'translate-y-10' : '-translate-y-10';

  return (
    <div
      id={id}
      ref={sectionRef}
      style={{ transitionDelay: `${staggerDelay}ms` }}
      className={`transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${className} ${
        isVisible
          ? 'opacity-100 translate-y-0 scale-100'
          : `opacity-0 ${initialOffsetClass} scale-[0.985]`
      }`}
    >
      {children}
    </div>
  );
};
