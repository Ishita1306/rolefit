import React from 'react';
import { VerdictSignal } from '../../types/rolefit';
import { CheckCircle2, AlertCircle, AlertTriangle, HelpCircle } from 'lucide-react';

interface ActionSignalBadgeProps {
  signal: VerdictSignal;
}

export const ActionSignalBadge: React.FC<ActionSignalBadgeProps> = ({ signal }) => {
  const configs = {
    STRONG_FIT: {
      bg: 'bg-[#CCFF00] text-[#0F1400] border-[#141416]',
      icon: CheckCircle2,
      label: 'STRONG SIGNAL',
    },
    WORTH_CONSIDERING: {
      bg: 'bg-[#FFFBEB] text-[#B45309] border-[#F59E0B]',
      icon: AlertTriangle,
      label: 'WORTH CONSIDERING',
    },
    SIGNIFICANT_GAPS: {
      bg: 'bg-red-50 text-red-700 border-red-300',
      icon: AlertCircle,
      label: 'SIGNIFICANT GAPS',
    },
    LIMITED_SIGNAL: {
      bg: 'bg-[#EFECE4] text-[#5A5A62] border-[#E2DEC9]',
      icon: HelpCircle,
      label: 'LIMITED SIGNAL',
    },
    INSUFFICIENT_SIGNAL: {
      bg: 'bg-gray-100 text-gray-700 border-gray-300',
      icon: HelpCircle,
      label: 'INSUFFICIENT SIGNAL',
    },
  };

  const config = configs[signal] || configs.WORTH_CONSIDERING;
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center space-x-2 font-mono text-xs font-bold px-3.5 py-1.5 rounded-full border shadow-sm ${config.bg}`}>
      <Icon className="w-4 h-4" />
      <span>{config.label}</span>
    </span>
  );
};
