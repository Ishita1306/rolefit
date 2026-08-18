import React, { useEffect } from 'react';
import { Requirement, SkillMatch } from '../../types/rolefit';
import { X, ArrowRight } from 'lucide-react';

interface GapInspectorModalProps {
  requirement: Requirement | null;
  match: SkillMatch | null;
  onClose: () => void;
}

export const GapInspectorModal: React.FC<GapInspectorModalProps> = ({
  requirement,
  match,
  onClose,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!requirement || !match) return null;

  const isGap = match.matchStatus === 'gap';

  return (
    <div 
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-[#141416]/50 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onClose}
    >
      {/* Editorial Panel (Bottom Sheet on 390px Mobile, Centered Modal on Desktop) */}
      <div 
        className="bg-[#F8F7F2] border-2 border-[#141416] rounded-t-lg sm:rounded-lg max-w-md w-full p-5 space-y-4 shadow-2xl relative animate-in slide-in-from-bottom-6 sm:slide-in-from-bottom-0 duration-200 max-h-[85vh] overflow-y-auto"
        role="dialog"
        aria-modal="true"
        aria-labelledby="gap-modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="flex items-start justify-between pb-3 border-b border-[#E2DEC9]">
          <div className="space-y-0.5">
            <span className="font-mono text-[10px] uppercase font-bold tracking-wider text-[#5A5A62] bg-[#EFECE4] px-2 py-0.5 rounded border border-[#E2DEC9]">
              [{isGap ? 'KEY GAP INSPECTOR' : 'REQUIREMENT INSPECTOR'}]
            </span>
            <h3 id="gap-modal-title" className="text-xl font-bold font-display text-[#141416]">
              {requirement.title.toUpperCase()}
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-[#EFECE4] text-[#141416] transition-colors cursor-pointer"
            aria-label="Close inspector"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 4 Structured Information Blocks */}
        <div className="space-y-3 font-mono text-xs text-[#141416]">
          
          {/* Block 1: Role Expectation */}
          <div className="bg-white p-3 rounded border border-[#E2DEC9] space-y-0.5">
            <div className="text-[10px] text-[#8A8A93] uppercase font-bold">ROLE EXPECTATION</div>
            <div className="font-sans font-semibold text-sm text-[#141416]">
              {requirement.levelExpected}
            </div>
          </div>

          {/* Block 2: Your Profile */}
          <div className="bg-white p-3 rounded border border-[#E2DEC9] space-y-0.5">
            <div className="text-[10px] text-[#8A8A93] uppercase font-bold">YOUR PROFILE</div>
            <div className={`font-sans font-semibold text-sm ${isGap ? 'text-[#B45309]' : 'text-[#10B981]'}`}>
              {match.candidateProficiency || 'Not listed'}
            </div>
          </div>

          {/* Block 3: Why It Matters */}
          <div className="bg-[#EFECE4] p-3 rounded border border-[#E2DEC9] space-y-0.5">
            <div className="text-[10px] text-[#8A8A93] uppercase font-bold">WHY IT MATTERS</div>
            <p className="font-sans text-xs text-[#5A5A62] leading-relaxed">
              {match.whyItMatters}
            </p>
          </div>

          {/* Block 4: Next Move */}
          <div className="bg-[#141416] text-[#F8F7F2] p-3.5 rounded border border-[#141416] space-y-1">
            <div className="text-[10px] text-[#CCFF00] uppercase font-bold flex items-center space-x-1">
              <ArrowRight className="w-3 h-3 text-[#CCFF00]" />
              <span>NEXT MOVE</span>
            </div>
            <p className="font-sans text-xs text-[#EFECE4] leading-relaxed">
              {match.actionMove}
            </p>
          </div>

        </div>

        {/* Action Buttons: Primary "KEEP EXPLORING →" & Secondary "DISMISS" */}
        <div className="pt-2 flex items-center justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-3 py-2 text-[#5A5A62] hover:text-[#141416] font-mono text-xs font-semibold cursor-pointer transition-colors"
          >
            DISMISS
          </button>
          
          <button
            onClick={onClose}
            className="tactile-btn px-4 py-2 bg-[#CCFF00] text-[#0F1400] font-mono text-xs font-bold rounded border border-[#141416] cursor-pointer flex items-center space-x-1.5"
          >
            <span>KEEP EXPLORING</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
};
