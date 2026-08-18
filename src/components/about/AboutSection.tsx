import React from 'react';
import { Target, AlertTriangle, Scale, Github, Sparkles, UserCheck } from 'lucide-react';

export const AboutSection: React.FC = () => {
  return (
    <section id="about-section" className="py-12 px-4 md:px-8 max-w-7xl mx-auto space-y-8 font-mono relative z-10">
      
      {/* Section Header */}
      <div className="space-y-2 border-b border-[#E2DEC9] pb-4">
        <div className="inline-flex items-center space-x-2 bg-white px-2.5 py-1 rounded border border-[#E2DEC9] text-xs text-[#5A5A62]">
          <Sparkles className="w-3.5 h-3.5 text-[#141416]" />
          <span className="font-bold uppercase tracking-wider text-[#141416]">ABOUT THE PRODUCT</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold font-display text-[#141416]">
          WHY ROLEFIT?
        </h2>
      </div>

      {/* 2-Column Responsive Editorial Composition */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column (7 cols): Purpose & 3 Core Principles */}
        <div className="lg:col-span-7 space-y-6">
          
          <p className="text-sm sm:text-base text-[#5A5A62] font-sans leading-relaxed bg-white p-5 rounded-lg border-2 border-[#141416] tactile-card hover-glow-neutral">
            Job descriptions are often long, vague, and harder to compare than they should be. RoleFit helps students and early-career applicants understand what a role actually asks for, compare those requirements with what they bring, and see the trade-offs before spending hours on an application.
          </p>

          {/* 3 Principles Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            
            {/* Principle 1 */}
            <div className="bg-white p-4 rounded-lg border-2 border-[#141416] space-y-2 tactile-card hover-lift hover-glow-lime">
              <div className="w-8 h-8 rounded bg-[#CCFF00] border border-[#141416] flex items-center justify-center text-[#0F1400]">
                <Target className="w-4 h-4" />
              </div>
              <div className="font-bold text-[#141416] uppercase">SEE THE REQUIREMENTS</div>
              <p className="text-[11px] text-[#5A5A62] font-sans">
                Understand what the role is actually asking for.
              </p>
            </div>

            {/* Principle 2 */}
            <div className="bg-white p-4 rounded-lg border-2 border-[#141416] space-y-2 tactile-card hover-lift hover-glow-amber">
              <div className="w-8 h-8 rounded bg-[#FFFBEB] border border-[#B45309] flex items-center justify-center text-[#B45309]">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div className="font-bold text-[#141416] uppercase">SEE THE GAPS</div>
              <p className="text-[11px] text-[#5A5A62] font-sans">
                Know what is missing before you apply.
              </p>
            </div>

            {/* Principle 3 */}
            <div className="bg-white p-4 rounded-lg border-2 border-[#141416] space-y-2 tactile-card hover-lift hover-glow-neutral">
              <div className="w-8 h-8 rounded bg-[#EFECE4] border border-[#141416] flex items-center justify-center text-[#141416]">
                <Scale className="w-4 h-4" />
              </div>
              <div className="font-bold text-[#141416] uppercase">SEE THE TRADE-OFFS</div>
              <p className="text-[11px] text-[#5A5A62] font-sans">
                Consider location, compensation, and work style.
              </p>
            </div>

          </div>

        </div>

        {/* Right Column (5 cols): Built By Builder Attribution */}
        <div className="lg:col-span-5 bg-white p-6 rounded-lg border-2 border-[#141416] space-y-4 tactile-card hover-glow-lime">
          
          <div className="flex items-center space-x-2 text-[10px] font-bold text-[#8A8A93] uppercase tracking-wider border-b border-[#E2DEC9] pb-2">
            <UserCheck className="w-4 h-4 text-[#141416]" />
            <span>BUILT BY ISHITA</span>
          </div>

          <div className="space-y-2">
            <div className="font-bold text-base text-[#141416]">
              A Student-Built Frontend Prototype
            </div>
            <p className="text-xs text-[#5A5A62] font-sans leading-relaxed">
              Exploring how job descriptions can become clearer, more useful decision aids for students navigating campus placements and career choices.
            </p>
          </div>

          <div className="pt-2 border-t border-[#E2DEC9]">
            <a
              href="https://github.com/Ishita1306/rolefit"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-between w-full p-3 bg-[#141416] hover:bg-[#2A2A30] text-[#CCFF00] font-bold rounded border border-[#141416] hover-lift group transition-all"
            >
              <div className="flex items-center space-x-2">
                <Github className="w-4 h-4" />
                <span>VIEW THE BUILD ON GITHUB</span>
              </div>
              <span className="transition-transform group-hover:translate-x-1">↗</span>
            </a>
          </div>

        </div>

      </div>

    </section>
  );
};
