import React from 'react';
import { JargonItem } from '../../types/rolefit';
import { ChevronDown, Sparkles, ArrowRight } from 'lucide-react';

interface JargonCardProps {
  item: JargonItem;
  index: number;
  isExpanded: boolean;
  onToggle: () => void;
}

export const JargonCard: React.FC<JargonCardProps> = ({
  item,
  index,
  isExpanded,
  onToggle,
}) => {
  return (
    <div 
      onClick={onToggle}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onToggle(); } }}
      tabIndex={0}
      role="button"
      aria-expanded={isExpanded}
      className={`group bg-white rounded-lg transition-all duration-200 cursor-pointer tactile-card overflow-hidden focus:outline-none focus:ring-2 focus:ring-[#141416] hover-lift hover-glow-neutral border-2 relative ${
        isExpanded
          ? 'bg-[#F8F7F2] border-[#141416] shadow-md border-l-4 border-l-[#CCFF00]'
          : 'border-[#141416] border-l-4 border-l-transparent hover:border-l-[#CCFF00] hover:border-[#141416]'
      }`}
    >
      {/* Header Bar */}
      <div className="p-4 sm:p-5 flex items-center justify-between gap-4">
        
        <div className="flex items-center space-x-3 flex-1 min-w-0">
          <span className="font-mono text-xs font-bold text-[#141416] bg-[#CCFF00] px-2.5 py-1 rounded border border-[#141416] flex items-center space-x-1 shadow-2xs group-hover:bg-[#BBE600]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#141416] group-hover:scale-125 transition-transform"></span>
            <span>SIGNAL 0{index + 1}</span>
          </span>

          <span className="font-mono text-xs text-[#8A8A93] uppercase font-bold hidden sm:inline-block border-l border-[#E2DEC9] pl-3">
            {item.contextTag}
          </span>

          <h4 className="font-display font-bold text-base text-[#141416] truncate">
            "{item.boilerplateText}"
          </h4>
        </div>

        <div className="flex items-center space-x-2">
          <span className="font-mono text-xs font-bold text-[#141416] group-hover:underline underline-offset-4 decoration-[#CCFF00] hidden md:flex items-center space-x-1">
            <span>{isExpanded ? 'COLLAPSE' : 'DECODE'}</span>
            <ArrowRight className={`w-3.5 h-3.5 transition-transform duration-200 ${isExpanded ? 'rotate-90' : 'group-hover:translate-x-1'}`} />
          </span>
          <ChevronDown className={`w-4 h-4 text-[#141416] transition-transform duration-250 ${isExpanded ? 'rotate-180' : ''}`} />
        </div>

      </div>

      {/* Expanded Interpretation Content */}
      <div className={`transition-all duration-300 ease-in-out overflow-hidden ${
        isExpanded ? 'max-h-[300px] opacity-100' : 'max-h-0 opacity-0 pointer-events-none'
      }`}>
        <div className="px-4 pb-5 sm:px-5 space-y-3 font-mono text-xs border-t border-[#E2DEC9] pt-4 bg-white">
          <div className="space-y-1">
            <div className="text-[10px] text-[#8A8A93] uppercase font-bold flex items-center space-x-1">
              <Sparkles className="w-3 h-3 text-[#141416]" />
              <span>PLAIN LANGUAGE TRANSLATION:</span>
            </div>
            <p className="text-sm font-sans font-medium text-[#141416] leading-relaxed">
              {item.decodedPlainEnglish}
            </p>
          </div>

          <div className="p-3 bg-[#EFECE4] rounded border border-[#E2DEC9] text-[#5A5A62] text-[11px] leading-relaxed hover-lift">
            <strong className="text-[#141416]">Impact Assessment: </strong>
            {item.impactAssessment}
          </div>
        </div>
      </div>
    </div>
  );
};
