import React, { useState } from 'react';
import { CandidateProfile } from '../../types/rolefit';
import { PRESET_PROFILES } from '../../data/candidateProfiles';
import { User, Plus, X, Sparkles, Check, Edit3 } from 'lucide-react';

interface ProfileSelectorProps {
  activeProfile: CandidateProfile;
  onProfileChange: (profile: CandidateProfile) => void;
}

export const ProfileSelector: React.FC<ProfileSelectorProps> = ({
  activeProfile,
  onProfileChange,
}) => {
  const [isCustomMode, setIsCustomMode] = useState(false);
  const [customDegree, setCustomDegree] = useState('BBA');
  const [customSpec, setCustomSpec] = useState('Marketing');
  const [customExp, setCustomExp] = useState('Fresher');
  const [newSkillInput, setNewSkillInput] = useState('');
  const [showSkillInput, setShowSkillInput] = useState(false);

  const commonSuggestions = [
    'Excel', 'Communication', 'Python', 'SQL', 'Power BI', 
    'Digital Marketing', 'Market Research', 'Financial Analysis', 
    'Business Analysis', 'Figma', 'Accounting', 'Canva', 'PowerPoint', 'SEO'
  ];

  const handleSelectPreset = (preset: CandidateProfile) => {
    setIsCustomMode(false);
    onProfileChange(preset);
  };

  const handleAddSkill = (skillToAdd: string) => {
    const trimmed = skillToAdd.trim();
    if (!trimmed) return;

    if (!activeProfile.skills.some(s => s.toLowerCase() === trimmed.toLowerCase())) {
      const updatedSkills = [...activeProfile.skills, trimmed];
      onProfileChange({
        ...activeProfile,
        profileType: 'custom',
        name: `${customDegree} · ${customSpec || 'Custom'}`,
        skills: updatedSkills,
      });
    }
    setNewSkillInput('');
    setShowSkillInput(false);
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    const updatedSkills = activeProfile.skills.filter(s => s !== skillToRemove);
    onProfileChange({
      ...activeProfile,
      profileType: 'custom',
      name: `${customDegree} · ${customSpec || 'Custom'}`,
      skills: updatedSkills,
    });
  };

  const handleApplyCustomProfile = () => {
    setIsCustomMode(true);
    onProfileChange({
      id: `custom-${Date.now()}`,
      name: `${customDegree} · ${customSpec}`,
      profileType: 'custom',
      degree: customDegree,
      specialization: customSpec,
      experienceLevel: customExp,
      skills: activeProfile.skills.length > 0 ? activeProfile.skills : ['Excel', 'Communication'],
    });
  };

  const isCustom = activeProfile.profileType === 'custom';

  return (
    <div className="bg-[#EFECE4] border-2 border-[#141416] p-5 sm:p-6 rounded-lg space-y-5 shadow-sm tactile-card">
      
      {/* Header Bar with Honest Hierarchy Wording */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E2DEC9]">
        <div className="space-y-0.5">
          <div className="flex items-center space-x-2 font-mono text-xs text-[#5A5A62]">
            <User className="w-4 h-4 text-[#141416]" />
            <span className="font-bold uppercase tracking-wider text-[#141416]">
              {isCustom ? 'USER-PROVIDED PROFILE' : 'DEMO PROFILE'}
            </span>
          </div>
          <h3 className="font-display font-bold text-lg text-[#141416]">
            {activeProfile.name} · <span className="text-sm text-[#5A5A62] font-mono">{activeProfile.experienceLevel}</span>
          </h3>
          <p className="text-xs text-[#5A5A62] font-mono">
            {isCustom ? 'Matching is based only on the skills entered here.' : 'Skills provided as demonstration data.'}
          </p>
        </div>

        {/* Status Badge */}
        <span className="font-mono text-xs font-bold px-3 py-1 rounded bg-white text-[#141416] border border-[#141416] self-start sm:self-auto">
          {isCustom ? 'CUSTOM PROFILE' : 'DEMO MODE'}
        </span>
      </div>

      {/* Preset Profiles Bar */}
      <div className="space-y-2">
        <div className="font-mono text-xs text-[#5A5A62] font-semibold flex items-center space-x-1.5">
          <Sparkles className="w-3.5 h-3.5 text-[#141416]" />
          <span>START WITH A DEMO PRESET OR BUILD YOUR OWN:</span>
        </div>

        <div className="flex flex-wrap gap-2">
          {PRESET_PROFILES.map((preset) => {
            const isSelected = activeProfile.id === preset.id;
            return (
              <button
                key={preset.id}
                onClick={() => handleSelectPreset(preset)}
                className={`text-xs font-mono px-3 py-1.5 rounded transition-all cursor-pointer border flex items-center space-x-1.5 ${
                  isSelected
                    ? 'bg-[#141416] text-[#CCFF00] border-[#141416] font-bold shadow-sm'
                    : 'bg-white hover:bg-[#F8F7F2] text-[#141416] border-[#E2DEC9]'
                }`}
              >
                <span>{preset.name}</span>
                {isSelected && <Check className="w-3.5 h-3.5 text-[#CCFF00]" />}
              </button>
            );
          })}

          <button
            onClick={() => setIsCustomMode(!isCustomMode)}
            className={`text-xs font-mono px-3 py-1.5 rounded transition-all cursor-pointer border flex items-center space-x-1.5 ${
              isCustomMode || isCustom
                ? 'bg-[#CCFF00] text-[#0F1400] border-[#141416] font-bold'
                : 'bg-white hover:bg-[#F8F7F2] text-[#141416] border-[#E2DEC9]'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>BUILD YOUR PROFILE</span>
          </button>
        </div>
      </div>

      {/* Custom Profile Form */}
      {isCustomMode && (
        <div className="bg-white p-4 rounded border border-[#141416] space-y-4 font-mono text-xs animate-in fade-in duration-150">
          <div className="font-bold text-[#141416] uppercase pb-2 border-b border-[#E2DEC9] flex justify-between items-center">
            <span>CUSTOM CANDIDATE PROFILE BUILDER</span>
            <span className="text-[10px] text-[#8A8A93]">NO RESUME UPLOAD REQUIRED</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="text-[10px] text-[#8A8A93] uppercase font-bold">DEGREE</label>
              <select
                value={customDegree}
                onChange={(e) => setCustomDegree(e.target.value)}
                className="w-full p-2 bg-[#F8F7F2] rounded border border-[#E2DEC9] font-mono text-xs text-[#141416]"
              >
                {['B.Tech', 'BBA', 'MBA', 'B.Com', 'BCA', 'MCA', 'B.Des', 'BA', 'B.Sc', 'Other'].map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] text-[#8A8A93] uppercase font-bold">FIELD / SPECIALIZATION</label>
              <select
                value={customSpec}
                onChange={(e) => setCustomSpec(e.target.value)}
                className="w-full p-2 bg-[#F8F7F2] rounded border border-[#E2DEC9] font-mono text-xs text-[#141416]"
              >
                {['Marketing', 'Data Analytics', 'Finance', 'HR', 'Business Analysis', 'Design', 'Computer Science', 'Economics', 'Other'].map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] text-[#8A8A93] uppercase font-bold">EXPERIENCE</label>
              <select
                value={customExp}
                onChange={(e) => setCustomExp(e.target.value)}
                className="w-full p-2 bg-[#F8F7F2] rounded border border-[#E2DEC9] font-mono text-xs text-[#141416]"
              >
                {['Fresher', 'Student', '0–1 Years', '1–2 Years', '2+ Years'].map(x => (
                  <option key={x} value={x}>{x}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              onClick={handleApplyCustomProfile}
              className="px-4 py-2 bg-[#141416] text-[#CCFF00] font-mono text-xs font-bold rounded border border-[#141416] cursor-pointer"
            >
              APPLY PROFILE DETAILS
            </button>
          </div>
        </div>
      )}

      {/* Active Candidate Skills Tags */}
      <div className="space-y-3 pt-1 border-t border-[#E2DEC9]">
        <div className="flex items-center justify-between">
          <div className="font-mono text-xs text-[#141416] font-bold uppercase">
            PROFILE SKILLS ({activeProfile.skills.length}):
          </div>

          <button
            onClick={() => setShowSkillInput(!showSkillInput)}
            className="text-xs font-mono text-[#0F1400] bg-[#CCFF00] hover:bg-[#BBE600] px-2.5 py-1 rounded border border-[#141416] font-bold flex items-center space-x-1 cursor-pointer transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>ADD SKILL</span>
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {activeProfile.skills.map((skill) => (
            <span
              key={skill}
              className="inline-flex items-center space-x-1.5 bg-white border border-[#141416] px-3 py-1 rounded font-mono text-xs text-[#141416] font-semibold shadow-xs"
            >
              <span>{skill}</span>
              <button
                onClick={() => handleRemoveSkill(skill)}
                className="hover:text-[#B45309] cursor-pointer p-0.5 rounded"
                title={`Remove ${skill}`}
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}

          {activeProfile.skills.length === 0 && (
            <span className="text-xs font-mono text-[#8A8A93] italic">
              No skills added yet. Click "+ ADD SKILL" to add your skills.
            </span>
          )}
        </div>

        {showSkillInput && (
          <div className="bg-white p-3 rounded border border-[#141416] space-y-3 font-mono text-xs animate-in fade-in duration-150">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={newSkillInput}
                onChange={(e) => setNewSkillInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleAddSkill(newSkillInput);
                }}
                placeholder="Type any skill (e.g. SEO, SQL, Figma, Python)..."
                className="flex-1 p-2 bg-[#F8F7F2] rounded border border-[#E2DEC9] text-xs text-[#141416] focus:outline-none focus:border-[#141416]"
              />
              <button
                onClick={() => handleAddSkill(newSkillInput)}
                className="px-3 py-2 bg-[#141416] text-[#CCFF00] font-bold rounded cursor-pointer"
              >
                ADD
              </button>
            </div>

            <div className="space-y-1">
              <div className="text-[10px] text-[#8A8A93] font-bold">QUICK SUGGESTIONS:</div>
              <div className="flex flex-wrap gap-1.5">
                {commonSuggestions.map((sug) => {
                  const hasIt = activeProfile.skills.some(s => s.toLowerCase() === sug.toLowerCase());
                  if (hasIt) return null;
                  return (
                    <button
                      key={sug}
                      onClick={() => handleAddSkill(sug)}
                      className="px-2 py-0.5 bg-[#F8F7F2] hover:bg-[#EFECE4] text-[#141416] border border-[#E2DEC9] text-[11px] rounded cursor-pointer"
                    >
                      + {sug}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

      </div>

    </div>
  );
};
