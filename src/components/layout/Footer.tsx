import React from 'react';
import { Github, Info, User } from 'lucide-react';
import { AuthMode } from '../auth/AuthModal';

interface FooterProps {
  onOpenAuth: (mode: AuthMode) => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenAuth }) => {
  const scrollToAbout = () => {
    const el = document.getElementById('about-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-[#EFECE4] border-t-2 border-[#141416] mt-16 py-10 px-4 md:px-8 text-xs font-mono text-[#5A5A62] relative z-10">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Top Row: Brand & Nav Links */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-[#E2DEC9] pb-6">
          
          {/* Brand Mark & Purpose Statement */}
          <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-3">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-[#141416] rounded flex items-center justify-center text-[#CCFF00] font-mono font-bold text-xs">
                RF
              </div>
              <span className="font-display font-bold text-lg text-[#141416]">
                ROLEFIT
              </span>
            </div>
            <span className="hidden sm:inline text-[#8A8A93]">·</span>
            <span className="text-xs text-[#5A5A62]">A decision aid for students and early-career applicants.</span>
          </div>

          {/* Footer Navigation Links */}
          <div className="flex flex-wrap items-center gap-4 font-bold text-[#141416]">
            <button
              onClick={scrollToAbout}
              className="hover:text-[#B45309] hover:underline cursor-pointer flex items-center space-x-1"
            >
              <Info className="w-3.5 h-3.5" />
              <span>ABOUT</span>
            </button>

            <a
              href="https://github.com/Ishita1306/rolefit"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#B45309] hover:underline cursor-pointer flex items-center space-x-1"
            >
              <Github className="w-3.5 h-3.5" />
              <span>GITHUB ↗</span>
            </a>

            <button
              onClick={() => onOpenAuth('login')}
              className="hover:text-[#B45309] hover:underline cursor-pointer flex items-center space-x-1"
            >
              <User className="w-3.5 h-3.5" />
              <span>LOGIN</span>
            </button>

            <button
              onClick={() => onOpenAuth('signup')}
              className="hover:text-[#B45309] hover:underline cursor-pointer flex items-center space-x-1"
            >
              <span>SIGN UP</span>
            </button>
          </div>

        </div>

        {/* Bottom Row: Builder & Challenge Attribution */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-[#8A8A93]">
          <div>
            Built by <strong className="text-[#141416]">Ishita</strong> · Student Frontend Prototype
          </div>

          <div className="uppercase font-bold text-[#141416]">
            ACDYON TECHNOLOGIES · FRONTEND CHALLENGE · PART 2
          </div>
        </div>

      </div>
    </footer>
  );
};
