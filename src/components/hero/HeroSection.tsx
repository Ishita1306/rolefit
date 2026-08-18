import React, { useState, useEffect, useRef } from 'react';
import { ParsedJd } from '../../types/rolefit';
import { RoleSnapshotCard } from './RoleSnapshotCard';
import { Sparkles, ArrowRight, FileText, Briefcase, MapPin, Layers } from 'lucide-react';

interface HeroSectionProps {
  currentJd: ParsedJd;
  rawText: string;
  onRawTextChange: (text: string) => void;
  userRole: string;
  onUserRoleChange: (role: string) => void;
  userLocation: string;
  onUserLocationChange: (loc: string) => void;
  selectedRoleOverride: string;
  onSelectedRoleChange: (roleId: string) => void;
  onDeconstructClick: () => void;
  sampleJds: ParsedJd[];
  selectedJdId: string;
  onSelectJd: (jd: ParsedJd) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  currentJd,
  rawText,
  onRawTextChange,
  userRole,
  onUserRoleChange,
  userLocation,
  onUserLocationChange,
  selectedRoleOverride,
  onSelectedRoleChange,
  onDeconstructClick,
  sampleJds,
  onSelectJd,
}) => {
  const [showExamples, setShowExamples] = useState(false);
  const [parallax, setParallax] = useState({ x: 0, y: 0 });

  const roleInputRef = useRef<HTMLInputElement>(null);
  const locationInputRef = useRef<HTMLInputElement>(null);

  // Desktop Pointer Parallax Effect (1-4px max displacement)
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (window.innerWidth < 768) return;
      const x = (e.clientX / window.innerWidth - 0.5) * 6;
      const y = (e.clientY / window.innerHeight - 0.5) * 6;
      setParallax({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const wordCount = rawText.trim() ? rawText.trim().split(/\s+/).length : 0;
  const lineCount = rawText.trim() ? rawText.split('\n').length : 0;

  const detectedRoles = currentJd.detectedRoles || [];

  return (
    <section className="pt-8 sm:pt-12 pb-8 px-4 md:px-8 max-w-7xl mx-auto space-y-8 relative overflow-visible">
      
      {/* Background Ambient Radial Glow (Level 1: z-0) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] ambient-glow pointer-events-none z-0"></div>

      {/* Editorial Hero Header (Level 2: z-10) */}
      <div className="space-y-4 max-w-3xl relative z-10">
        <div className="inline-flex items-center space-x-2 bg-white px-3 py-1 rounded border border-[#E2DEC9] font-mono text-xs text-[#141416] shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-[#141416]" />
          <span className="font-bold tracking-wider uppercase">01 · PASTE THE ROLE</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-bold font-display text-[#141416] tracking-tight leading-[1.08]">
          BEFORE YOU APPLY,<br />
          <span className="bg-[#CCFF00] px-2 py-0.5 border-2 border-[#141416] shadow-sm inline-block mt-1">
            KNOW THE FIT.
          </span>
        </h1>

        <p className="text-base sm:text-lg text-[#5A5A62] font-sans leading-relaxed">
          Paste the job description you're considering. RoleFit will pull out the signals that matter before you spend time applying.
        </p>

        {/* Compact Editorial Input Tiles (ROLE & LOCATION) */}
        <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 font-mono text-xs max-w-2xl">
          
          {/* Tile 1: ROLE / POSITION */}
          <div 
            onClick={() => roleInputRef.current?.focus()}
            style={{ transform: 'rotate(-0.5deg)' }}
            className="flex-1 sm:max-w-[300px] min-h-[72px] bg-[#F8F7F2] p-3 rounded-lg border-2 border-[#141416] tactile-card hover-lift hover-glow-lime cursor-text space-y-1 transition-all"
          >
            <div className="text-[10px] text-[#8A8A93] uppercase font-bold flex items-center space-x-1">
              <Briefcase className="w-3.5 h-3.5 text-[#141416]" />
              <span>ROLE / POSITION</span>
            </div>
            <input
              ref={roleInputRef}
              type="text"
              value={userRole}
              onChange={(e) => onUserRoleChange(e.target.value)}
              placeholder="e.g. AI Intern"
              className="w-full bg-transparent text-sm font-bold text-[#141416] focus:outline-none placeholder:text-[#8A8A93]"
            />
          </div>

          {/* Tile 2: LOCATION */}
          <div 
            onClick={() => locationInputRef.current?.focus()}
            style={{ transform: 'rotate(+0.5deg)' }}
            className="flex-1 sm:max-w-[300px] min-h-[72px] bg-[#F8F7F2] p-3 rounded-lg border-2 border-[#141416] tactile-card hover-lift hover-glow-lime cursor-text space-y-1 transition-all"
          >
            <div className="text-[10px] text-[#8A8A93] uppercase font-bold flex items-center space-x-1">
              <MapPin className="w-3.5 h-3.5 text-[#141416]" />
              <span>LOCATION</span>
            </div>
            <input
              ref={locationInputRef}
              type="text"
              value={userLocation}
              onChange={(e) => onUserLocationChange(e.target.value)}
              placeholder="e.g. Bengaluru, India"
              className="w-full bg-transparent text-sm font-bold text-[#141416] focus:outline-none placeholder:text-[#8A8A93]"
            />
          </div>

        </div>

      </div>

      {/* Desktop 60% / 40% Split Editorial Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 relative z-10 my-4 overflow-visible items-start">
        
        {/* Left Column (60%): Large Editorial Text Editor */}
        <div className="lg:col-span-7 space-y-4 relative">
          
          {/* MOBILE ONLY BADGE 1: Upper inline flow annotation */}
          <div className="flex md:hidden justify-start pt-1 font-mono text-[10px]">
            <span className="bg-[#F8F7F2] border border-[#141416] px-2 py-0.5 rounded font-bold text-[#141416] flex items-center space-x-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#141416]"></span>
              <span>RAW TEXT · SIGNAL</span>
            </span>
          </div>

          {/* JD EDITOR STAGE CONTAINER (Strict Relative Anchor for Floating Badges) */}
          <div className="relative group/editor-stage my-1">
            
            {/* FLOATING BADGE 1: UPPER-LEFT EDGE (Input / Editor Side) */}
            <div 
              style={{ 
                position: 'absolute', 
                top: '-14px', 
                left: '16px', 
                right: 'auto', 
                bottom: 'auto', 
                transform: `translate3d(${parallax.x}px, ${parallax.y}px, 0) rotate(-1deg)` 
              }}
              className="hidden md:flex z-25 w-fit max-w-[200px] h-[30px] bg-[#F8F7F2] border border-[#141416] px-3 py-1 rounded font-mono text-[10px] font-bold text-[#141416] tracking-wider uppercase shadow-[3px_3px_0_#141416] items-center space-x-1.5 hover-lift hover-glow-neutral pointer-events-auto"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#141416]"></span>
              <span className="truncate">RAW TEXT · SIGNAL</span>
            </div>

            {/* FLOATING BADGE 2: LOWER-RIGHT EDGE (Analysis / Result Side) */}
            <div 
              style={{ 
                position: 'absolute', 
                bottom: '-14px', 
                right: '16px', 
                top: 'auto', 
                left: 'auto', 
                transform: `translate3d(${parallax.x}px, ${parallax.y}px, 0) rotate(0.8deg)` 
              }}
              className="hidden md:flex z-25 w-fit max-w-[210px] h-[30px] bg-[#F8F7F2] border border-[#141416] px-3 py-1 rounded font-mono text-[10px] font-bold text-[#141416] tracking-wider uppercase shadow-[3px_3px_0_#141416] items-center space-x-1.5 hover-lift hover-glow-lime pointer-events-auto"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#CCFF00] border border-[#141416]"></span>
              <span className="truncate">{currentJd.coreMatchCount} / {currentJd.coreRequirementCount} CORE MATCHED</span>
            </div>

            {/* Main Input Form Container (The White Editor Card) */}
            <div className="bg-white border-2 border-[#141416] rounded-lg p-5 sm:p-6 space-y-4 tactile-card relative z-10 hover-glow-lime">
              
              {/* Multi-Role Selector Pill Bar (Normalized Role Catalog) */}
              {detectedRoles.length > 1 && (
                <div className="bg-[#EFECE4] p-3.5 rounded-lg border-2 border-[#141416] space-y-2 font-mono text-xs shadow-xs">
                  <div className="flex items-center justify-between">
                    <div className="text-[10px] text-[#141416] uppercase font-bold flex items-center space-x-1">
                      <Layers className="w-3.5 h-3.5 text-[#141416]" />
                      <span>ROLES IN THIS POSTING · {detectedRoles.length} DETECTED</span>
                    </div>
                    <span className="text-[9px] text-[#8A8A93] uppercase font-bold">CLICK TO SWITCH ACTIVE ROLE</span>
                  </div>

                  <div className="flex flex-wrap gap-1.5 pt-1 overflow-x-auto scrollbar-none">
                    {detectedRoles.map((roleItem) => {
                      const isSelected = (selectedRoleOverride || currentJd.selectedRole || '').toLowerCase() === roleItem.id.toLowerCase() ||
                        currentJd.roleTitle.toLowerCase() === roleItem.displayName.toLowerCase();

                      return (
                        <button
                          key={roleItem.id}
                          onClick={() => onSelectedRoleChange(roleItem.id)}
                          className={`px-3 py-1.5 rounded font-mono text-xs font-bold transition-all cursor-pointer border hover-lift ${
                            isSelected
                              ? 'bg-[#141416] text-[#CCFF00] border-[#141416] shadow-xs scale-102'
                              : 'bg-white text-[#5A5A62] border-[#E2DEC9] hover:text-[#141416] hover:bg-[#F8F7F2]'
                          }`}
                        >
                          {roleItem.displayName.toUpperCase()}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Text Area Top Bar & Try Example Trigger */}
              <div className="flex flex-wrap items-center justify-between gap-3 font-mono text-xs relative z-30 pt-1">
                <div className="flex items-center space-x-2 text-[#141416]">
                  <FileText className="w-4 h-4 text-[#141416]" />
                  <span className="font-bold uppercase tracking-wider">JOB DESCRIPTION</span>
                  <span className="text-[#8A8A93]">({wordCount} words · {lineCount} lines)</span>
                </div>

                {/* Minimal Secondary Example Trigger */}
                <div className="relative z-30">
                  <button
                    onClick={() => setShowExamples(!showExamples)}
                    className="text-xs font-mono text-[#5A5A62] hover:text-[#141416] underline underline-offset-4 cursor-pointer flex items-center space-x-1"
                  >
                    <span>Try an example ↗</span>
                  </button>

                  {/* Dropdown for Examples */}
                  {showExamples && (
                    <div className="absolute right-0 top-full mt-2 w-64 bg-white border-2 border-[#141416] rounded shadow-lg p-2 z-50 space-y-1">
                      <div className="text-[10px] font-bold text-[#8A8A93] px-2 py-1 uppercase">LOAD PRESET EXAMPLE:</div>
                      {sampleJds.map((sample) => (
                        <button
                          key={sample.id}
                          onClick={() => {
                            onSelectJd(sample);
                            setShowExamples(false);
                          }}
                          className="w-full text-left px-2 py-1.5 hover:bg-[#F8F7F2] font-mono text-xs text-[#141416] rounded cursor-pointer truncate"
                        >
                          {sample.roleTitle} ({sample.location})
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Text Area */}
              <textarea
                value={rawText}
                onChange={(e) => onRawTextChange(e.target.value)}
                placeholder="Paste raw Job Description text here (Responsibilities, Requirements, Eligibility)..."
                rows={8}
                className="w-full font-mono text-xs sm:text-sm text-[#141416] bg-[#F8F7F2] p-4 rounded border border-[#E2DEC9] focus:outline-none focus:border-[#141416] resize-y leading-relaxed relative z-30 min-h-[240px]"
              />

              {/* Editor Bottom Bar & Primary CTA */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 font-mono text-xs relative z-30">
                <div className="flex items-center space-x-2 text-[#5A5A62]">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#CCFF00] border border-[#141416] animate-pulse"></span>
                  <span>TARGET: <strong className="text-[#141416]">{currentJd.roleTitle}</strong></span>
                </div>

                <button
                  onClick={onDeconstructClick}
                  className="w-full sm:w-auto px-8 py-3.5 bg-[#CCFF00] hover:bg-[#BBE600] text-[#0F1400] font-mono text-xs font-bold rounded border-2 border-[#141416] shadow-sm hover:shadow-md transition-all active:scale-95 flex items-center justify-center space-x-2 cursor-pointer group pointer-events-auto relative z-30 hover-lift hover-glow-lime min-h-[48px]"
                >
                  <span>ANALYZE ROLE</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>
              </div>

            </div>

          </div>

          {/* MOBILE ONLY BADGE 2: Lower inline flow annotation */}
          <div className="flex md:hidden justify-end pt-1 font-mono text-[10px]">
            <span className="bg-[#F8F7F2] border border-[#141416] px-2 py-0.5 rounded font-bold text-[#141416] flex items-center space-x-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#CCFF00] border border-[#141416]"></span>
              <span>{currentJd.coreMatchCount} / {currentJd.coreRequirementCount} CORE MATCHED</span>
            </span>
          </div>

        </div>

        {/* Right Column (40%): Dedicated Role Snapshot */}
        <div className="lg:col-span-5 relative z-10">
          <RoleSnapshotCard
            jd={currentJd}
            userLocation={userLocation}
            onUserLocationChange={onUserLocationChange}
          />
        </div>

      </div>

    </section>
  );
};
