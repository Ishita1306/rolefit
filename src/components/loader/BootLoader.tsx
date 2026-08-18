import React, { useState, useEffect } from 'react';
import { Sparkles, Waves } from 'lucide-react';

interface BootLoaderProps {
  onComplete: () => void;
}

export const BootLoader: React.FC<BootLoaderProps> = ({ onComplete }) => {
  const [phase, setPhase] = useState<number>(0);
  const [progress, setProgress] = useState<number>(15);
  const [isFadingOut, setIsFadingOut] = useState<boolean>(false);
  const [skipRequested, setSkipRequested] = useState<boolean>(false);

  useEffect(() => {
    // Check if session has already seen the boot loader
    const hasSeenBoot = sessionStorage.getItem('rolefit_boot_seen');
    if (hasSeenBoot) {
      onComplete();
      return;
    }

    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      sessionStorage.setItem('rolefit_boot_seen', 'true');
      const timer = setTimeout(() => {
        onComplete();
      }, 350);
      return () => clearTimeout(timer);
    }

    sessionStorage.setItem('rolefit_boot_seen', 'true');

    const isMobile = window.innerWidth < 640;

    // Timeline durations based on device screen
    const p1Delay = isMobile ? 250 : 450;
    const p2Delay = isMobile ? 550 : 950;
    const p3Delay = isMobile ? 850 : 1600;
    const fadeDelay = isMobile ? 1150 : 2100;
    const endDelay = isMobile ? 1400 : 2400;

    const t1 = setTimeout(() => {
      setPhase(1);
      setProgress(45);
    }, p1Delay);

    const t2 = setTimeout(() => {
      setPhase(2);
      setProgress(85);
    }, p2Delay);

    const t3 = setTimeout(() => {
      setPhase(3);
      setProgress(100);
    }, p3Delay);

    const t4 = setTimeout(() => {
      setIsFadingOut(true);
    }, fadeDelay);

    const t5 = setTimeout(() => {
      onComplete();
    }, endDelay);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
    };
  }, [onComplete]);

  const handleSkip = () => {
    setSkipRequested(true);
    setIsFadingOut(true);
    setTimeout(() => {
      onComplete();
    }, 200);
  };

  const getBootStatusText = () => {
    if (phase === 0) return 'INITIALIZING SIGNALS...';
    if (phase === 1) return 'CALIBRATING FIT & READING ROLE DATA...';
    if (phase === 2) return 'CONNECTING SIGNALS...';
    return 'SYSTEM READY · ROLEFIT';
  };

  // Construct ASCII progress bar string
  const filledBlocks = Math.floor(progress / 10);
  const emptyBlocks = 10 - filledBlocks;
  const asciiBar = `[${'█'.repeat(filledBlocks)}${'░'.repeat(emptyBlocks)}]`;

  return (
    <div 
      className={`fixed inset-0 z-50 bg-[#0F0F12] text-white flex flex-col justify-between p-6 sm:p-12 font-mono transition-all duration-400 select-none ${
        isFadingOut || skipRequested ? 'opacity-0 scale-102 pointer-events-none' : 'opacity-100 scale-100'
      }`}
    >
      {/* Background Micro Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1F1F24_1px,transparent_1px),linear-gradient(to_bottom,#1F1F24_1px,transparent_1px)] bg-[size:24px_24px] opacity-25 pointer-events-none"></div>

      {/* Top Metadata Header */}
      <div className="relative z-10 flex justify-between items-center text-[10px] sm:text-xs text-gray-400 uppercase tracking-widest border-b border-[#26262C] pb-3">
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-[#CCFF00] animate-pulse"></span>
          <span className="font-bold text-white">ROLEFIT SYSTEM v2.4</span>
        </div>
        <div>SIGNAL CALIBRATION PROTOCOL</div>
      </div>

      {/* Center Cinematic Stage */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center space-y-6 my-auto">
        
        {/* RF Brand Mark Emblem */}
        <div className="relative group">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-[#1A1A20] rounded-xl border-2 border-[#CCFF00] flex items-center justify-center font-display font-black text-2xl sm:text-3xl text-[#CCFF00] shadow-[0_0_25px_rgba(204,255,0,0.15)] transition-transform duration-300 transform hover:scale-105">
            RF
          </div>
          <span className="absolute -bottom-2 -right-2 w-4 h-4 bg-[#CCFF00] rounded-full border-2 border-[#0F0F12]"></span>
        </div>

        {/* Brand Name & Tagline */}
        <div className="space-y-1">
          <h1 className="text-3xl sm:text-4xl font-black font-display tracking-tight text-white">
            ROLEFIT
          </h1>
          <p className="text-xs sm:text-sm text-[#CCFF00] font-semibold tracking-wider uppercase">
            KNOW THE FIT BEFORE YOU APPLY.
          </p>
        </div>

        {/* Dynamic Status Text & ASCII Progress Line */}
        <div className="space-y-2 pt-4 max-w-sm w-full">
          <div className="text-[11px] sm:text-xs text-gray-300 font-bold flex items-center justify-center space-x-2">
            <Sparkles className="w-3.5 h-3.5 text-[#CCFF00]" />
            <span>{getBootStatusText()}</span>
          </div>

          {/* ASCII Progress Bar */}
          <div className="text-xs font-mono text-[#CCFF00] tracking-widest">
            {asciiBar} {progress}%
          </div>

          {/* Smooth Acid Lime Progress Bar */}
          <div className="w-full bg-[#1A1A20] h-1.5 rounded-full overflow-hidden border border-[#26262C] mt-2">
            <div 
              className="bg-[#CCFF00] h-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Phase 2: Horizontal Acid Lime Sweep & SVG Wave Motion */}
        {phase >= 2 && (
          <div className="w-full max-w-md relative pt-2 animate-in fade-in duration-300">
            <div className="h-0.5 w-full bg-[#CCFF00] shadow-[0_0_12px_#CCFF00] animate-pulse"></div>
            <svg className="w-full h-8 opacity-60 mt-1" viewBox="0 0 400 40">
              <path d="M0,20 Q100,5 200,20 T400,20" fill="none" stroke="#CCFF00" strokeWidth="1.5" className="animate-wave-1" />
              <path d="M0,20 Q120,35 200,20 T400,20" fill="none" stroke="#E2DEC9" strokeWidth="1" strokeDasharray="4 4" className="animate-wave-2" />
            </svg>
          </div>
        )}

      </div>

      {/* Bottom Footer & Desktop SKIP Button */}
      <div className="relative z-10 flex justify-between items-end border-t border-[#26262C] pt-3 text-[10px] sm:text-xs text-gray-400">
        <div className="flex items-center space-x-2">
          <Waves className="w-3.5 h-3.5 text-gray-400" />
          <span>EDITORIAL SIGNAL ENGINE</span>
        </div>

        {/* Small Desktop/Mobile SKIP Control */}
        <button
          onClick={handleSkip}
          className="px-3 py-1 bg-[#1A1A20] hover:bg-[#CCFF00] hover:text-[#0F1400] text-gray-300 font-bold rounded border border-[#333338] transition-colors cursor-pointer hover-lift flex items-center space-x-1"
        >
          <span>SKIP</span>
          <span>→</span>
        </button>
      </div>

    </div>
  );
};
