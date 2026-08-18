import React from 'react';
import { ParsedJd, CandidateProfile } from '../../types/rolefit';
import { PriorityLens } from '../ocean/SkillOcean';
import { ActionSignalBadge } from './ActionSignalBadge';
import { Award, ArrowRight, CornerDownRight, CheckCircle2 } from 'lucide-react';

interface VerdictSectionProps {
  jd: ParsedJd;
  candidateProfile: CandidateProfile;
  activeLens?: PriorityLens;
  onAnalyzeAnother: () => void;
}

export const VerdictSection: React.FC<VerdictSectionProps> = ({
  jd,
  candidateProfile,
  activeLens = 'skills',
  onAnalyzeAnother,
}) => {
  const { overallVerdict, coreRequirementCount, coreMatchCount, coreGapCount, location, locationSource, salaryRange, postingConditions } = jd;
  const keyGap = overallVerdict.keyGaps[0];
  const activeSignal = overallVerdict.signal;

  const stipend = postingConditions.find(c => c.category === 'stipend');

  // Lens-Specific Qualitative Guidance
  const lensAdviceMap: Record<PriorityLens, string> = {
    skills: overallVerdict.honestAdvice,
    location: `Location Lens Active: Role is located in ${location} (${locationSource === 'USER_PROVIDED' ? 'User Provided' : 'JD'}). Ensure work mode matches your commute expectations.`,
    compensation: `Compensation Lens Active: ${stipend ? stipend.value + ' stipend' : salaryRange}. Verify full details during interview conversations.`,
    workstyle: `Work Style Lens Active: ${/hybrid|onsite|remote|travel/i.test(jd.rawText) ? 'Posting emphasizes ' + jd.workplaceType.toLowerCase() + ' work and independent execution.' : 'No explicit work-style conditions were identified in this posting.'}`,
  };

  const activeAdvice = lensAdviceMap[activeLens] || overallVerdict.honestAdvice;

  return (
    <section className="py-12 px-4 md:px-8 max-w-7xl mx-auto space-y-8">
      
      {/* Section Header */}
      <div className="space-y-1">
        <div className="flex items-center space-x-2 font-mono text-xs text-[#5A5A62]">
          <Award className="w-4 h-4 text-[#141416]" />
          <span className="font-bold uppercase tracking-wider text-[#141416]">05 · APPLICATION SIGNAL</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-bold font-display text-[#141416]">
          SHOULD I APPLY?
        </h2>
        <p className="text-sm text-[#5A5A62] font-sans max-w-2xl">
          RoleFit's qualitative assessment based on your current skills, the analyzed role, and your selected priority lens ({activeLens.toUpperCase()}).
        </p>
      </div>

      {/* Climax Visual Card (LEVEL 3 DEPTH: Primary Verdict Panel) */}
      <div className="bg-[#141416] text-[#F8F7F2] p-6 sm:p-10 rounded-lg space-y-8 border-2 border-[#141416] tactile-card relative overflow-hidden hover-lift hover-glow-lime shadow-lg">
        
        {/* Subtle Lime Atmospheric Radial Glow */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[radial-gradient(circle,_rgba(204,255,0,0.14)_0%,_transparent_70%)] pointer-events-none -z-0"></div>

        {/* Top Climax Badge Header */}
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#2A2A30]">
          <div className="space-y-1">
            <span className="font-mono text-xs text-[#8A8A93] uppercase font-bold tracking-wider">QUALITATIVE ASSESSMENT</span>
            <h3 className="text-2xl sm:text-4xl font-display font-bold text-white">
              {overallVerdict.signalTitle}
            </h3>
            <p className="font-mono text-xs text-[#CCFF00] font-bold pt-1">
              {coreMatchCount} / {coreRequirementCount} CORE REQUIREMENTS ALIGN.
            </p>
          </div>

          <ActionSignalBadge signal={overallVerdict.signal} />
        </div>

        {/* Qualitative Alignment Scale Track (3 Compact Editorial Markers) */}
        <div className="relative z-10 bg-[#1E1E22] p-4 rounded-lg border border-[#333338] space-y-2 font-mono text-xs shadow-xs hover-glow-neutral">
          <div className="text-[10px] text-[#8A8A93] uppercase font-bold tracking-wider">QUALITATIVE SIGNAL SCALE</div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-center text-[11px] pt-1">
            
            {/* Marker 1: SIGNIFICANT GAPS */}
            <div className={`py-2 px-3 rounded font-mono text-xs font-bold transition-all border ${
              activeSignal === 'SIGNIFICANT_GAPS'
                ? 'bg-amber-950/80 text-[#F59E0B] border-[#F59E0B] shadow-xs scale-102'
                : 'bg-[#141416] text-[#8A8A93] border-[#2A2A30] opacity-60'
            }`}>
              [ SIGNIFICANT GAPS ]
            </div>

            {/* Marker 2: WORTH CONSIDERING */}
            <div className={`py-2 px-3 rounded font-mono text-xs font-bold transition-all border ${
              activeSignal === 'WORTH_CONSIDERING' || activeSignal === 'LIMITED_SIGNAL'
                ? 'bg-[#FFFBEB]/15 text-[#F59E0B] border-[#F59E0B] shadow-xs scale-102'
                : 'bg-[#141416] text-[#8A8A93] border-[#2A2A30] opacity-60'
            }`}>
              [ WORTH CONSIDERING ]
            </div>

            {/* Marker 3: STRONG SIGNAL */}
            <div className={`py-2 px-3 rounded font-mono text-xs font-bold transition-all border ${
              activeSignal === 'STRONG_FIT'
                ? 'bg-[#CCFF00]/15 text-[#CCFF00] border-[#CCFF00] shadow-xs scale-102'
                : 'bg-[#141416] text-[#8A8A93] border-[#2A2A30] opacity-60'
            }`}>
              [ STRONG SIGNAL ]
            </div>

          </div>
        </div>

        {/* Core Reasoning Grid (LEVEL 1 DEPTH: Compact Editorial Information Tiles) */}
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
          
          {/* Tile 1: Core Alignment */}
          <div className="bg-[#1E1E22] p-4 rounded-lg border border-[#333338] space-y-1 hover-lift hover-glow-neutral transition-all">
            <div className="text-[#8A8A93] text-[10px] uppercase font-bold">ALIGNMENT SUMMARY</div>
            <div className="text-lg font-bold text-[#CCFF00]">
              {coreMatchCount} OF {coreRequirementCount} CORE SKILLS
            </div>
            <div className="text-[#8A8A93] text-[11px]">
              {coreGapCount === 0 ? 'No core skill gaps' : `${coreGapCount} core gap identified`}
            </div>
          </div>

          {/* Tile 2: Main Gap */}
          <div className="bg-[#1E1E22] p-4 rounded-lg border border-[#333338] space-y-1 hover-lift hover-glow-neutral transition-all">
            <div className="text-[#8A8A93] text-[10px] uppercase font-bold">MAIN GAP</div>
            <div className={`text-sm font-bold ${keyGap ? 'text-[#F59E0B]' : 'text-[#CCFF00]'}`}>
              {keyGap ? keyGap.toUpperCase() : 'CORE REQUIREMENTS FULLY ALIGNED'}
            </div>
            <div className="text-[#8A8A93] text-[11px]">
              {keyGap ? 'Primary gap to prepare' : 'All required skills present'}
            </div>
          </div>

          {/* Tile 3: Role Conditions */}
          <div className="bg-[#1E1E22] p-4 rounded-lg border border-[#333338] space-y-1 hover-lift hover-glow-neutral transition-all">
            <div className="text-[#8A8A93] text-[10px] uppercase font-bold">ROLE CONDITIONS</div>
            <div className="text-xs font-bold text-white truncate">
              {location} · {locationSource === 'USER_PROVIDED' ? 'USER PROVIDED' : 'JD'}
            </div>
            <div className="text-[#8A8A93] text-[11px] truncate">
              {stipend ? stipend.value + ' STIPEND' : salaryRange}
            </div>
          </div>

        </div>

        {/* Application Recommendation (LEVEL 2 DEPTH: Secondary Paper Panel) */}
        <div className="relative z-10 bg-[#1E1E22] p-5 rounded-lg border border-[#333338] space-y-2 hover-lift transition-all">
          <div className="flex items-center space-x-2 text-[#CCFF00] font-mono text-xs font-bold uppercase">
            <CornerDownRight className="w-4 h-4" />
            <span>APPLICATION RECOMMENDATION ({activeLens.toUpperCase()} LENS)</span>
          </div>
          <p className="text-sm text-gray-300 font-sans leading-relaxed">
            {activeAdvice}
          </p>
        </div>

        {/* Secondary Profile Context Indicator */}
        <div className="relative z-10 pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2 font-mono text-xs text-[#8A8A93]">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-[#CCFF00]" />
            <span>PROFILE CONTEXT: <strong className="text-white">{candidateProfile.name}</strong> ({candidateProfile.experienceLevel})</span>
          </div>
          <span>ROLE: <strong className="text-white">{jd.roleTitle}</strong></span>
        </div>

        {/* Bottom CTA Action Bar */}
        <div className="relative z-10 pt-4 flex justify-end border-t border-[#2A2A30]">
          <button
            onClick={onAnalyzeAnother}
            className="w-full sm:w-auto px-6 py-3.5 bg-[#CCFF00] hover:bg-[#BBE600] active:scale-99 text-[#0F1400] font-mono text-xs font-bold rounded border border-[#CCFF00] transition-all flex items-center justify-center space-x-2 cursor-pointer shadow-md hover-lift hover-glow-lime group min-h-[44px]"
          >
            <span>ANALYZE ANOTHER ROLE</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>

      </div>

    </section>
  );
};
