import React, { useState } from 'react';
import { ParsedJd, Requirement, SkillMatch, CandidateProfile } from '../../types/rolefit';
import { ProfileSelector } from '../profile/ProfileSelector';
import { SkillOcean, PriorityLens } from '../ocean/SkillOcean';
import { GapInspectorModal } from './GapInspectorModal';
import { Cpu, Edit3, X } from 'lucide-react';

interface DeconstructionStageProps {
  currentJd: ParsedJd;
  candidateProfile: CandidateProfile;
  onProfileChange: (profile: CandidateProfile) => void;
  activeLens: PriorityLens;
  onLensChange: (lens: PriorityLens) => void;
}

export const DeconstructionStage: React.FC<DeconstructionStageProps> = ({
  currentJd,
  candidateProfile,
  onProfileChange,
  activeLens,
  onLensChange,
}) => {
  const [activeRequirement, setActiveRequirement] = useState<Requirement | null>(null);
  const [activeMatch, setActiveMatch] = useState<SkillMatch | null>(null);
  const [showProfileModal, setShowProfileModal] = useState(false);

  const handleInspect = (req: Requirement, match: SkillMatch) => {
    setActiveRequirement(req);
    setActiveMatch(match);
  };

  const handleCloseModal = () => {
    setActiveRequirement(null);
    setActiveMatch(null);
  };

  return (
    <section id="deconstruction-section" className="py-8 px-4 md:px-8 max-w-7xl mx-auto space-y-8">
      
      {/* Stage Banner */}
      <div className="bg-[#141416] text-[#F8F7F2] p-5 sm:p-6 rounded-lg space-y-3 border border-[#141416]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          <div className="space-y-1">
            <div className="flex items-center space-x-2 font-mono text-xs text-[#CCFF00] uppercase font-bold tracking-wider">
              <Cpu className="w-4 h-4 text-[#CCFF00]" />
              <span>02 & 03 · WHAT THEY ASK FOR vs. WHAT YOU BRING</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-display text-white">
              Role Signal Ocean & Personal Priority Spectrum
            </h2>
            <p className="text-xs sm:text-sm text-[#8A8A93] max-w-2xl font-sans">
              RoleFit surfaces job requirements as floating ocean signals and lets you control what matters most to you.
            </p>
          </div>

          {/* Secondary Edit Profile Button */}
          <button
            onClick={() => setShowProfileModal(!showProfileModal)}
            className="px-4 py-2 bg-[#1E1E22] hover:bg-[#2A2A30] text-[#CCFF00] font-mono text-xs font-bold rounded border border-[#333338] flex items-center space-x-1.5 self-start md:self-auto cursor-pointer transition-colors"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>EDIT PROFILE CONTEXT →</span>
          </button>

        </div>
      </div>

      {/* Optional Secondary Profile Builder Drawer */}
      {showProfileModal && (
        <div className="bg-[#F8F7F2] p-4 rounded-lg border-2 border-[#141416] space-y-3 animate-in fade-in duration-150">
          <div className="flex justify-between items-center pb-2 border-b border-[#E2DEC9]">
            <span className="font-mono text-xs font-bold text-[#141416] uppercase">CANDIDATE CONTEXT BUILDER</span>
            <button onClick={() => setShowProfileModal(false)} className="cursor-pointer text-[#141416]">
              <X className="w-4 h-4" />
            </button>
          </div>
          <ProfileSelector
            activeProfile={candidateProfile}
            onProfileChange={onProfileChange}
          />
        </div>
      )}

      {/* Signature Interaction: Role Signal Ocean */}
      <SkillOcean
        jd={currentJd}
        candidateProfile={candidateProfile}
        onProfileChange={onProfileChange}
        onInspect={handleInspect}
        activeLens={activeLens}
        onLensChange={onLensChange}
      />

      {/* Interactive Gap Inspector Panel */}
      <GapInspectorModal
        requirement={activeRequirement}
        match={activeMatch}
        onClose={handleCloseModal}
      />

    </section>
  );
};
