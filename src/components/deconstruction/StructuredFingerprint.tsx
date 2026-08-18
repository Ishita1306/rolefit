import React, { useState } from 'react';
import { ParsedJd, Requirement, SkillMatch, CandidateProfile } from '../../types/rolefit';
import { SkillConnectorRow } from './SkillConnectorRow';
import { User } from 'lucide-react';

interface StructuredFingerprintProps {
  jd: ParsedJd;
  candidateProfile: CandidateProfile;
  onInspect: (req: Requirement, match: SkillMatch) => void;
}

export const StructuredFingerprint: React.FC<StructuredFingerprintProps> = ({
  jd,
  candidateProfile,
  onInspect,
}) => {
  const [filter, setFilter] = useState<'all' | 'matches' | 'gaps'>('all');

  const filteredRequirements = jd.requirements.filter((req) => {
    const match = jd.matches[req.id];
    if (filter === 'matches') return match?.matchStatus === 'matched';
    if (filter === 'gaps') return match?.matchStatus === 'gap';
    return true;
  });

  const totalMatches = Object.values(jd.matches).filter(m => m.matchStatus === 'matched').length;
  const totalGaps = Object.values(jd.matches).filter(m => m.matchStatus === 'gap').length;

  const coreReqs = jd.requirements.filter(r => r.priority === 'core');
  const preferredReqs = jd.requirements.filter(r => r.priority === 'preferred');

  return (
    <div className="space-y-8">
      
      {/* Visual Role Fingerprint Information Composition */}
      <div className="relative bg-[#EFECE4] border-2 border-[#141416] p-6 rounded-lg space-y-6 shadow-sm overflow-hidden">
        
        {/* Ambient Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[350px] ambient-glow pointer-events-none -z-0"></div>

        {/* Header Title & Section Micro Index */}
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E2DEC9]">
          <div className="space-y-1">
            <div className="inline-flex items-center space-x-2 bg-white px-2.5 py-1 rounded border border-[#E2DEC9] font-mono text-xs text-[#5A5A62]">
              <span className="font-bold text-[#141416]">02</span>
              <span>·</span>
              <span className="font-bold uppercase tracking-wider text-[#141416]">ROLE FINGERPRINT & CONSTELLATION</span>
            </div>
            <h2 className="text-3xl font-bold font-display text-[#141416] pt-1">
              {jd.roleTitle.toUpperCase()}
            </h2>
            <div className="font-mono text-xs text-[#5A5A62]">
              WHAT THE COMPANY IS ACTUALLY ASKING FOR
            </div>
          </div>

          {/* Qualitative Fit Summary Card */}
          <div className="bg-white p-3.5 rounded border-2 border-[#141416] space-y-1 self-start sm:self-auto min-w-[220px]">
            <div className="font-mono text-[10px] text-[#8A8A93] uppercase font-bold">QUALITATIVE SIGNAL</div>
            <div className="font-display font-bold text-lg text-[#141416]">
              {jd.overallVerdict.signal.replace('_', ' ')}
            </div>
            <div className="font-mono text-xs text-[#5A5A62]">
              {jd.overallVerdict.coreSkillsMatched} / {jd.overallVerdict.coreSkillsTotal} Core Skills Matched
            </div>
          </div>
        </div>

        {/* Dynamic Typographic & Constellation Composition */}
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
          
          {/* Signal Core Network Diagrams (Left 7 Cols) */}
          <div className="md:col-span-7 bg-white p-5 rounded border border-[#E2DEC9] space-y-4 font-mono">
            <div className="text-xs font-bold text-[#141416] uppercase pb-2 border-b border-[#E2DEC9] flex justify-between items-center">
              <span>CAPABILITY CONSTELLATION</span>
              <span className="text-[10px] text-[#8A8A93]">DYNAMIC REQUIREMENT MATRIX</span>
            </div>

            {/* Signal Core Badge */}
            <div className="bg-[#141416] text-[#F8F7F2] p-3 rounded flex items-center justify-between border border-[#141416]">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#CCFF00] animate-signal-pulse"></span>
                <span className="font-display font-bold text-sm text-[#CCFF00]">{jd.roleTitle.toUpperCase()} CORE</span>
              </div>
              <span className="text-[10px] text-[#8A8A93]">{jd.location} · {jd.salaryRange}</span>
            </div>

            {/* Core Requirements List */}
            <div className="space-y-2 text-xs">
              <div className="text-[10px] text-[#8A8A93] uppercase font-bold tracking-wider">
                CORE REQUIRED CAPABILITIES ({coreReqs.length})
              </div>

              {coreReqs.map((req) => {
                const match = jd.matches[req.id];
                const isMatched = match?.matchStatus === 'matched';
                return (
                  <div 
                    key={req.id} 
                    onClick={() => match && onInspect(req, match)}
                    className={`flex justify-between items-center p-2 rounded border cursor-pointer transition-colors ${
                      isMatched ? 'bg-[#F8F7F2] border-[#E2DEC9]' : 'bg-[#FFFBEB] border-[#F59E0B]/40 text-[#B45309]'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <span className={`w-2 h-2 rounded-full ${isMatched ? 'bg-[#CCFF00] border border-[#141416]' : 'bg-[#B45309]'}`}></span>
                      <span className="font-bold">{req.title.toUpperCase()}</span>
                    </div>
                    <span className="text-[11px]">
                      {isMatched ? req.levelExpected : '[CORE GAP] ' + req.levelExpected}
                    </span>
                  </div>
                );
              })}

              {/* Preferred / Bonus Skills Sub-section */}
              {preferredReqs.length > 0 && (
                <div className="pt-2 space-y-1.5">
                  <div className="text-[10px] text-[#8A8A93] uppercase font-bold tracking-wider pt-1 border-t border-[#E2DEC9]">
                    PREFERRED / OPPORTUNITY SKILLS ({preferredReqs.length})
                  </div>
                  {preferredReqs.map((req) => {
                    const match = jd.matches[req.id];
                    const isMatched = match?.matchStatus === 'matched';
                    return (
                      <div 
                        key={req.id} 
                        onClick={() => match && onInspect(req, match)}
                        className="flex justify-between items-center p-1.5 rounded bg-[#F8F7F2]/60 border border-[#E2DEC9] text-[#5A5A62] cursor-pointer"
                      >
                        <span className="font-semibold text-[11px]">{req.title}</span>
                        <span className={`text-[10px] font-bold ${isMatched ? 'text-[#10B981]' : 'text-[#8A8A93]'}`}>
                          {isMatched ? 'MATCH ✓' : 'NOT LISTED (PREFERRED)'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}

            </div>
          </div>

          {/* Minimal Candidate Demo Profile (Right 5 Cols) */}
          <div className="md:col-span-5 bg-[#141416] text-[#F8F7F2] p-5 rounded border border-[#141416] space-y-4 font-mono flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-[#333338]">
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4 text-[#CCFF00]" />
                  <span className="text-xs font-bold text-[#CCFF00]">{candidateProfile.name}</span>
                </div>
                <span className="text-[10px] text-[#8A8A93]">{candidateProfile.degree}</span>
              </div>

              <div className="space-y-2 text-xs text-[#EFECE4]">
                <div className="text-[10px] text-[#8A8A93] uppercase">PROFILE SKILLS COMPARISON:</div>
                {candidateProfile.skills.map((skillName, idx) => (
                  <div key={idx} className="flex justify-between py-1 border-b border-[#222226]">
                    <span>{skillName}:</span>
                    <span className="text-[#CCFF00] font-bold">MATCHED IN PROFILE ✓</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#1E1E22] p-3 rounded border border-[#333338] text-[11px] text-[#8A8A93] leading-relaxed">
              DEMO PROFILE COMPARISON · Based on student skills provided in demonstration context.
            </div>
          </div>

        </div>

      </div>

      {/* Requirement Matching List Section */}
      <div className="space-y-4">
        
        {/* Section Header & Filter Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-[#E2DEC9]">
          <div className="inline-flex items-center space-x-2 font-mono text-xs text-[#5A5A62]">
            <span className="font-bold text-[#141416]">03</span>
            <span>·</span>
            <h3 className="font-display font-bold text-lg text-[#141416]">
              DECONSTRUCTED MATCHES & GAPS
            </h3>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center space-x-1.5 font-mono text-xs">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1 rounded cursor-pointer transition-colors border ${
                filter === 'all'
                  ? 'bg-[#141416] text-[#CCFF00] border-[#141416] font-bold'
                  : 'bg-white text-[#5A5A62] border-[#E2DEC9] hover:border-[#141416]'
              }`}
            >
              ALL ({jd.requirements.length})
            </button>
            <button
              onClick={() => setFilter('matches')}
              className={`px-3 py-1 rounded cursor-pointer transition-colors border ${
                filter === 'matches'
                  ? 'bg-[#CCFF00] text-[#0F1400] border-[#141416] font-bold'
                  : 'bg-white text-[#5A5A62] border-[#E2DEC9] hover:border-[#141416]'
              }`}
            >
              MATCHES ({totalMatches})
            </button>
            <button
              onClick={() => setFilter('gaps')}
              className={`px-3 py-1 rounded cursor-pointer transition-colors border ${
                filter === 'gaps'
                  ? 'bg-[#B45309] text-white border-[#B45309] font-bold'
                  : 'bg-white text-[#5A5A62] border-[#E2DEC9] hover:border-[#141416]'
              }`}
            >
              GAPS ({totalGaps})
            </button>
          </div>
        </div>

        {/* Rows */}
        <div className="space-y-2.5">
          {filteredRequirements.map((req) => (
            <SkillConnectorRow
              key={req.id}
              requirement={req}
              match={jd.matches[req.id]}
              onInspect={onInspect}
            />
          ))}
        </div>

      </div>

    </div>
  );
};
