import React from 'react';
import { ParsedJd } from '../../types/rolefit';
import { CheckCircle2, Building2, MapPin, Briefcase, DollarSign, AlertTriangle, Info, Clock } from 'lucide-react';

interface RoleSnapshotCardProps {
  jd: ParsedJd;
  userLocation?: string;
  onUserLocationChange?: (loc: string) => void;
}

export const RoleSnapshotCard: React.FC<RoleSnapshotCardProps> = ({ jd, onUserLocationChange }) => {
  const isTitleIdentified = jd.roleTitle !== 'ROLE NOT IDENTIFIED';

  const conflict = jd.locationConflict;

  const stipendCond = jd.postingConditions.find(c => c.category === 'stipend');
  const ppoCond = jd.postingConditions.find(c => c.category === 'ppo_domestic' || c.category === 'ppo_international');

  return (
    <div className="bg-[#141416] text-[#F8F7F2] p-5 sm:p-6 rounded-lg border-2 border-[#141416] space-y-5 tactile-card relative overflow-hidden group">
      
      {/* Top Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#2A2A30] font-mono text-xs">
        <div className="flex items-center space-x-2 text-[#CCFF00] font-bold">
          <Building2 className="w-4 h-4 text-[#CCFF00]" />
          <span className="uppercase tracking-wider">ROLE SNAPSHOT</span>
        </div>

        {/* Confidence Badge */}
        <span className={`px-2.5 py-0.5 rounded font-mono text-[10px] font-bold border transition-all ${
          isTitleIdentified
            ? 'bg-[#CCFF00]/15 text-[#CCFF00] border-[#CCFF00]'
            : 'bg-amber-950/60 text-[#F59E0B] border-[#F59E0B]'
        }`}>
          {isTitleIdentified ? 'ROLE IDENTIFIED ✓' : 'ROLE · NOT IDENTIFIED'}
        </span>
      </div>

      {/* Core Extracted Fact Signals */}
      <div className="space-y-4 font-mono">
        
        {/* Signal 1: Target Role */}
        <div className="space-y-1 p-2.5 rounded hover-lift hover-glow-neutral hover:bg-[#1E1E22] transition-colors duration-200">
          <div className="flex items-center justify-between">
            <div className="text-[10px] text-[#8A8A93] uppercase font-bold flex items-center space-x-1">
              <Briefcase className="w-3.5 h-3.5 text-[#CCFF00]" />
              <span>TARGET ROLE</span>
            </div>
            <span className="text-[9px] font-bold text-[#8A8A93] bg-[#2A2A30] px-1.5 py-0.5 rounded border border-[#333338] uppercase">
              {jd.userRole ? 'USER SELECTED' : 'JD EXTRACTED'}
            </span>
          </div>
          <div className="font-display font-bold text-xl sm:text-2xl text-white truncate">
            {jd.roleTitle}
          </div>
        </div>

        {/* Signal 2: Location & Work Mode + Source Badge */}
        <div className="space-y-0.5 pt-2.5 border-t border-[#2A2A30]/60 p-2.5 rounded hover-lift hover-glow-neutral hover:bg-[#1E1E22] transition-colors duration-200">
          <div className="flex items-center justify-between">
            <div className="text-[10px] text-[#8A8A93] uppercase font-bold flex items-center space-x-1">
              <MapPin className="w-3.5 h-3.5 text-[#CCFF00]" />
              <span>LOCATION & WORK MODE</span>
            </div>
            <span className="text-[9px] font-bold text-[#CCFF00] bg-[#CCFF00]/10 px-1.5 py-0.5 rounded border border-[#CCFF00]/30 uppercase">
              SOURCE · {jd.locationSource === 'USER_PROVIDED' ? 'USER PROVIDED' : 'JD'}
            </span>
          </div>
          <div className="font-mono text-xs font-bold text-[#EFECE4] flex items-center space-x-1.5 pt-1">
            <span className="w-2 h-2 rounded-full bg-[#CCFF00]"></span>
            <span className="truncate">{jd.location} ({jd.workplaceType})</span>
          </div>
        </div>

        {/* Location Conflict Warning Box */}
        {conflict && (
          <div className="bg-[#FFFBEB]/10 p-3 rounded border border-[#F59E0B]/40 space-y-2 text-xs font-mono hover-lift hover-glow-amber">
            <div className="flex items-center space-x-1.5 text-[#F59E0B] font-bold text-[11px]">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>LOCATION CHECK</span>
            </div>
            <p className="text-[11px] text-gray-300">
              JD mentions <strong className="text-white">{conflict.jdLoc}</strong>. You entered <strong className="text-white">{conflict.userLoc}</strong>.
            </p>
            {onUserLocationChange && (
              <div className="flex space-x-2 pt-1">
                <button
                  onClick={() => onUserLocationChange(conflict.userLoc)}
                  className="px-2 py-1 bg-[#CCFF00] text-[#0F1400] font-bold text-[10px] rounded cursor-pointer hover-lift"
                >
                  USE MY LOCATION ({conflict.userLoc})
                </button>
                <button
                  onClick={() => onUserLocationChange(conflict.jdLoc)}
                  className="px-2 py-1 bg-[#1E1E22] text-white font-bold text-[10px] rounded border border-[#333338] cursor-pointer hover-lift"
                >
                  USE JD LOCATION ({conflict.jdLoc})
                </button>
              </div>
            )}
          </div>
        )}

        {/* Signal 3 & 4: Experience & Compensation */}
        <div className="grid grid-cols-2 gap-3 pt-2 border-t border-[#2A2A30]/60 text-xs">
          
          <div className="space-y-0.5 p-2 rounded hover-lift hover-glow-neutral hover:bg-[#1E1E22] transition-colors duration-200">
            <div className="text-[10px] text-[#8A8A93] uppercase font-bold flex items-center space-x-1">
              <Clock className="w-3 h-3 text-[#CCFF00]" />
              <span>EXPERIENCE</span>
            </div>
            <div className="font-bold text-white truncate">
              {jd.experienceLevel}
            </div>
          </div>

          <div className="space-y-0.5 p-2 rounded hover-lift hover-glow-neutral hover:bg-[#1E1E22] transition-colors duration-200">
            <div className="text-[10px] text-[#8A8A93] uppercase font-bold flex items-center space-x-1">
              <DollarSign className="w-3 h-3 text-[#CCFF00]" />
              <span>STIPEND</span>
            </div>
            <div className="font-bold text-[#CCFF00] truncate">
              {stipendCond ? stipendCond.value : (jd.salaryRange.includes('STIPEND') ? jd.salaryRange : 'NOT SPECIFIED')}
            </div>
          </div>

        </div>

        {/* Full-time CTC / PPO Signal (if present) */}
        {ppoCond && (
          <div className="p-2.5 rounded bg-[#1E1E22] border border-[#333338] flex items-center justify-between font-mono text-xs hover-lift">
            <span className="text-[10px] text-[#8A8A93] uppercase font-bold">PPO / FULL-TIME CTC</span>
            <span className="font-bold text-[#CCFF00] text-[11px]">{ppoCond.value}</span>
          </div>
        )}

        {/* DEDICATED POSTING CONDITIONS SECTION */}
        {jd.postingConditions.length > 0 && (
          <div className="pt-3 border-t border-[#2A2A30] space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <div className="text-[10px] text-[#CCFF00] uppercase font-bold flex items-center space-x-1">
                <Info className="w-3.5 h-3.5 text-[#CCFF00]" />
                <span>POSTING CONDITIONS</span>
              </div>
              <span className="text-[8px] font-bold text-[#8A8A93] bg-[#1E1E22] px-1.5 py-0.5 rounded border border-[#333338] uppercase">
                SHARED CONDITIONS
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              {jd.postingConditions.map((cond, idx) => (
                <div key={idx} className="bg-[#1E1E22] p-2 rounded border border-[#333338] space-y-0.5 hover-lift">
                  <div className="text-[9px] text-[#8A8A93] font-bold uppercase">{cond.title}</div>
                  <div className="font-bold text-white text-[11px] truncate">{cond.value}</div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Extraction Verification Footer */}
      <div className="pt-2 border-t border-[#2A2A30] flex items-center justify-between text-[11px] font-mono text-[#8A8A93]">
        <span>TRANSPARENT MATCHING</span>
        <span className="flex items-center space-x-1 text-[#CCFF00]">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>EXTRACTED FROM POSTING</span>
        </span>
      </div>

    </div>
  );
};
