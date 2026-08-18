import React, { useEffect, useState } from 'react';

export const CursorGlow: React.FC = () => {
  const [pos, setPos] = useState({ x: -200, y: -200 });
  const [targetPos, setTargetPos] = useState({ x: -200, y: -200 });
  const [glowColor, setGlowColor] = useState<'lime' | 'amber'>('lime');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Disable on touch devices
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const handleMouseMove = (e: MouseEvent) => {
      setTargetPos({ x: e.clientX, y: e.clientY });
      setIsVisible(true);

      // Context-aware color detection
      const targetEl = document.elementFromPoint(e.clientX, e.clientY);
      if (targetEl) {
        const text = targetEl.textContent || '';
        if (text.includes('GAP') || targetEl.closest('.bg-\\[\\#FFFBEB\\]') || targetEl.closest('.border-\\[\\#B45309\\]')) {
          setGlowColor('amber');
        } else {
          setGlowColor('lime');
        }
      }
    };

    const handleMouseLeave = () => setIsVisible(false);

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  // Smooth lerp (50-100ms lag)
  useEffect(() => {
    if (!isVisible) return;
    let animationFrameId: number;

    const lerp = () => {
      setPos((prev) => ({
        x: prev.x + (targetPos.x - prev.x) * 0.15,
        y: prev.y + (targetPos.y - prev.y) * 0.15,
      }));
      animationFrameId = requestAnimationFrame(lerp);
    };

    animationFrameId = requestAnimationFrame(lerp);
    return () => cancelAnimationFrame(animationFrameId);
  }, [targetPos, isVisible]);

  if (!isVisible) return null;

  return (
    <div
      style={{
        left: `${pos.x}px`,
        top: `${pos.y}px`,
        background: glowColor === 'amber'
          ? 'radial-gradient(circle, rgba(180,83,9,0.12) 0%, rgba(180,83,9,0.04) 40%, transparent 65%)'
          : 'radial-gradient(circle, rgba(204,255,0,0.12) 0%, rgba(204,255,0,0.04) 40%, transparent 65%)',
      }}
      className="fixed -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] pointer-events-none z-50 rounded-full transition-opacity duration-300 hidden md:block"
    />
  );
};
