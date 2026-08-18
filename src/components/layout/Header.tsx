import React, { useState } from 'react';
import { Compass, Sparkles, Github, User, Info, LogOut } from 'lucide-react';
import { AuthMode } from '../auth/AuthModal';

interface HeaderProps {
  onAnalyzeClick: () => void;
  authUser: string | null;
  onOpenAuth: (mode: AuthMode) => void;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onAnalyzeClick,
  authUser,
  onOpenAuth,
  onLogout,
}) => {
  const [clickCount, setClickCount] = useState(0);
  const [showEasterEgg, setShowEasterEgg] = useState(false);

  const handleLogoClick = () => {
    const next = clickCount + 1;
    setClickCount(next);
    if (next >= 5) {
      setShowEasterEgg(true);
      setTimeout(() => {
        setShowEasterEgg(false);
        setClickCount(0);
      }, 4000);
    }
  };

  const scrollToAbout = () => {
    const el = document.getElementById('about-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#F8F7F2]/95 backdrop-blur-md border-b border-[#E2DEC9] py-3.5 px-4 md:px-8 shadow-xs">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Brand Logo & Secret Easter Egg Trigger */}
        <div className="flex items-center space-x-3">
          <button
            onClick={handleLogoClick}
            className="w-8 h-8 rounded bg-[#141416] text-[#F8F7F2] font-mono font-bold text-xs flex items-center justify-center border border-[#141416] shadow-xs cursor-pointer hover:bg-[#CCFF00] hover:text-[#0F1400] transition-colors hover-lift"
            title="RoleFit Brand Mark (Click 5x for Secret)"
          >
            RF
          </button>
          
          <div className="flex flex-col">
            <span className="font-display font-bold text-lg text-[#141416] tracking-tight leading-none">
              ROLEFIT
            </span>
            <span className="font-mono text-[10px] text-[#5A5A62] tracking-wider uppercase font-semibold mt-0.5 hidden sm:inline">
              KNOW THE FIT BEFORE YOU APPLY
            </span>
          </div>

          {/* Secret Easter Egg Toast */}
          {showEasterEgg && (
            <span className="ml-2 font-mono text-[11px] font-bold bg-[#CCFF00] text-[#0F1400] px-2.5 py-1 rounded border border-[#141416] animate-bounce flex items-center space-x-1 shadow-md z-50">
              <Sparkles className="w-3.5 h-3.5" />
              <span>SIGNAL DETECTED · YOU FOUND THE FIT.</span>
            </span>
          )}
        </div>

        {/* Desktop Right Navigation (>= 768px) */}
        <div className="hidden md:flex items-center space-x-5 font-mono text-xs font-bold text-[#141416]">
          
          {/* ABOUT Link */}
          <button
            onClick={scrollToAbout}
            className="text-[#5A5A62] hover:text-[#141416] hover:underline underline-offset-4 cursor-pointer transition-colors hover-lift flex items-center space-x-1"
          >
            <Info className="w-3.5 h-3.5" />
            <span>ABOUT</span>
          </button>

          {/* GITHUB Link */}
          <a
            href="https://github.com/Ishita1306/rolefit"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#5A5A62] hover:text-[#141416] hover:underline underline-offset-4 cursor-pointer transition-colors hover-lift flex items-center space-x-1 group"
          >
            <Github className="w-3.5 h-3.5" />
            <span>GITHUB</span>
            <span className="transition-transform group-hover:translate-x-0.5">↗</span>
          </a>

          {/* LOGIN / SIGN UP or AUTHENTICATED USER TAG */}
          {authUser ? (
            <div className="flex items-center space-x-2 bg-[#EFECE4] p-1 rounded border border-[#E2DEC9]">
              <span className="bg-[#CCFF00] text-[#0F1400] px-2 py-1 rounded border border-[#141416] text-[11px] font-extrabold flex items-center space-x-1">
                <User className="w-3 h-3" />
                <span>{authUser}</span>
              </span>
              <button
                onClick={onLogout}
                className="text-[#5A5A62] hover:text-[#B45309] p-1 cursor-pointer"
                title="Log Out"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <>
              <button
                onClick={() => onOpenAuth('login')}
                className="text-[#141416] hover:text-[#B45309] cursor-pointer hover:underline underline-offset-4"
              >
                LOGIN
              </button>

              <button
                onClick={() => onOpenAuth('signup')}
                className="text-[#141416] hover:text-[#B45309] bg-[#EFECE4] px-3 py-1.5 rounded border border-[#E2DEC9] hover:border-[#141416] cursor-pointer transition-all hover-lift flex items-center space-x-1 hover-glow-lime"
              >
                <User className="w-3.5 h-3.5" />
                <span>SIGN UP</span>
              </button>
            </>
          )}

          {/* Primary Action CTA */}
          <button
            onClick={onAnalyzeClick}
            className="px-4 py-2 bg-[#141416] hover:bg-[#2A2A30] text-[#CCFF00] font-bold rounded border border-[#141416] transition-all flex items-center space-x-1.5 cursor-pointer shadow-xs hover-lift hover-glow-lime"
          >
            <Compass className="w-3.5 h-3.5 text-[#CCFF00]" />
            <span>ANALYZE THIS ROLE →</span>
          </button>

        </div>

        {/* Mobile Right Navigation (< 768px: Compact LOGIN / SIGN UP or USER) */}
        <div className="flex md:hidden items-center space-x-2 font-mono text-xs">
          {authUser ? (
            <div className="flex items-center space-x-1.5 bg-[#CCFF00] text-[#0F1400] px-2.5 py-1.5 rounded border border-[#141416] font-bold">
              <User className="w-3.5 h-3.5" />
              <span className="truncate max-w-[80px]">{authUser}</span>
              <button onClick={onLogout} className="ml-1 text-[#141416]">
                <LogOut className="w-3 h-3" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => onOpenAuth('login')}
              className="px-3 py-1.5 bg-[#141416] text-[#CCFF00] font-bold rounded border border-[#141416] cursor-pointer hover-lift min-h-[40px]"
            >
              LOGIN
            </button>
          )}
        </div>

      </div>
    </header>
  );
};
