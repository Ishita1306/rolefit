import React from 'react';
import { ParsedJd } from '../../types/rolefit';
import { Briefcase, Sparkles } from 'lucide-react';

interface SampleJdSelectorProps {
  sampleJds: ParsedJd[];
  selectedJdId: string;
  onSelectJd: (jd: ParsedJd) => void;
}

export const SampleJdSelector: React.FC<SampleJdSelectorProps> = ({
  sampleJds,
  selectedJdId,
  onSelectJd,
}) => {
  return (
    <div className="space-y-2.5">
      <div className="flex items-center space-x-2 font-mono text-xs text-[#5A5A62] uppercase tracking-wider">
        <Sparkles className="w-3.5 h-3.5 text-[#141416]" />
        <span>SELECT DEMO ROLE:</span>
      </div>

      <div className="flex flex-wrap gap-2">
        {sampleJds.map((jd, idx) => {
          const isSelected = jd.id === selectedJdId;
          const isPrimary = idx === 0;

          return (
            <button
              key={jd.id}
              onClick={() => onSelectJd(jd)}
              className={`text-xs font-mono px-3.5 py-2 rounded transition-all cursor-pointer border flex items-center space-x-2 ${
                isSelected
                  ? 'bg-[#141416] text-[#CCFF00] border-[#141416] font-bold shadow-sm'
                  : 'bg-white hover:bg-[#EFECE4] text-[#141416] border-[#E2DEC9] hover:border-[#141416]'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>{jd.roleTitle}</span>
              {isPrimary && (
                <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${
                  isSelected ? 'bg-[#CCFF00] text-[#0F1400]' : 'bg-[#EFECE4] text-[#5A5A62]'
                }`}>
                  FEATURED DEMO
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
