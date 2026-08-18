import React from 'react';
import { Requirement, SkillMatch } from '../../types/rolefit';
import { Search } from 'lucide-react';

interface SkillConnectorRowProps {
  requirement: Requirement;
  match?: SkillMatch;
  onInspect: (req: Requirement, match: SkillMatch) => void;
}

export const SkillConnectorRow: React.FC<SkillConnectorRowProps> = ({
  requirement,
  match,
  onInspect,
}) => {
  const status = match?.matchStatus || 'gap';

  const statusConfigs = {
    matched: {
      badgeClass: 'bg-[#CCFF00] text-[#0F1400] border-[#141416]',
      label: 'MATCH ✓',
    },
    gap: {
      badgeClass: 'bg-[#FFFBEB] text-[#B45309] border-[#F59E0B]/50',
      label: 'GAP ⚠',
    },
    preferred_matched: {
      badgeClass: 'bg-[#10B981]/15 text-[#047857] border-[#10B981]/40',
      label: 'PREFERRED MATCH ✓',
    },
    preferred_unlisted: {
      badgeClass: 'bg-[#EFECE4] text-[#5A5A62] border-[#E2DEC9]',
      label: 'NOT LISTED (PREFERRED)',
    },
    extra_signal: {
      badgeClass: 'bg-white text-[#141416] border-[#E2DEC9]',
      label: 'NOT REQUIRED / EXTRA',
    },
  };

  const config = statusConfigs[status] || statusConfigs.gap;
  const isGap = status === 'gap';

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.key === 'Enter' || e.key === ' ') && match) {
      e.preventDefault();
      onInspect(requirement, match);
    }
  };

  return (
    <div 
      tabIndex={0}
      role="button"
      aria-label={`Inspect requirement: ${requirement.title}, Status: ${config.label}`}
      onClick={() => match && onInspect(requirement, match)}
      onKeyDown={handleKeyDown}
      className={`group p-3.5 sm:p-4 rounded-lg border transition-all cursor-pointer space-y-2 focus:outline-none focus:ring-2 focus:ring-[#141416] bg-white border-[#E2DEC9] hover:border-[#141416] tactile-card`}
    >
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
        
        {/* Left Column: Requirement Title */}
        <div className="md:col-span-5 space-y-0.5">
          <div className="flex items-center space-x-2">
            <span className="font-mono text-[10px] uppercase tracking-wider text-[#5A5A62] bg-[#EFECE4] px-2 py-0.5 rounded border border-[#E2DEC9]">
              {requirement.priority === 'preferred' ? 'PREFERRED SKILL' : requirement.category.replace('_', ' ')}
            </span>
          </div>
          <div className="font-display font-semibold text-base text-[#141416]">
            {requirement.title}
          </div>
          <div className="text-xs text-[#5A5A62] font-sans">
            Expectation: <strong className="text-[#141416] font-medium">{requirement.levelExpected}</strong>
          </div>
        </div>

        {/* Center Column: Visual Signal Badge */}
        <div className="md:col-span-3 flex items-center justify-start md:justify-center">
          <span className={`font-mono text-xs font-bold px-3 py-1 rounded border ${config.badgeClass}`}>
            {config.label}
          </span>
        </div>

        {/* Right Column: Candidate Signal & Inspect Action */}
        <div className="md:col-span-4 flex items-center justify-between">
          <div className="space-y-0.5">
            <div className="font-mono text-[10px] text-[#8A8A93] uppercase">CANDIDATE SIGNAL</div>
            <div className={`text-xs font-bold ${isGap ? 'text-[#B45309]' : 'text-[#141416]'}`}>
              {match?.candidateSkillName || 'Not listed'}
            </div>
          </div>

          <div className="text-xs font-mono font-semibold text-[#141416] opacity-70 group-hover:opacity-100 flex items-center space-x-1 underline underline-offset-4 decoration-[#CCFF00]">
            <span>INSPECT</span>
            <Search className="w-3.5 h-3.5" />
          </div>
        </div>

      </div>
    </div>
  );
};
