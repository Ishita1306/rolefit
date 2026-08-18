import React, { useState } from 'react';
import { SAMPLE_JARGON_LIST } from '../../data/jargonTranslations';
import { JargonCard } from './JargonCard';
import { Compass } from 'lucide-react';
import { JargonItem } from '../../types/rolefit';

export const RealityCheckSection: React.FC = () => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

  const toggleIndex = (idx: number) => {
    setExpandedIndex((prev) => (prev === idx ? null : idx));
  };

  return (
    <section className="py-8 px-4 md:px-8 max-w-7xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="space-y-1">
        <div className="flex items-center space-x-2 font-mono text-xs text-[#5A5A62]">
          <Compass className="w-4 h-4 text-[#141416]" />
          <span className="font-bold uppercase tracking-wider text-[#141416]">SUPPORTING DECODER · REALITY CHECK</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold font-display text-[#141416]">
          WHAT THEY SAID. WHAT IT MAY MEAN.
        </h2>
        <p className="text-xs sm:text-sm text-[#5A5A62] font-sans max-w-xl">
          Click any recruitment phrase below to reveal its plain-language interpretation.
        </p>
      </div>

      {/* Accordion Strips */}
      <div className="space-y-3">
        {SAMPLE_JARGON_LIST.map((item: JargonItem, idx: number) => (
          <JargonCard
            key={item.id}
            item={item}
            index={idx}
            isExpanded={expandedIndex === idx}
            onToggle={() => toggleIndex(idx)}
          />
        ))}
      </div>

    </section>
  );
};
