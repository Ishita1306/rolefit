import React, { useState, useRef, useEffect } from 'react';
import { ParsedJd, Requirement, SkillMatch, CandidateProfile } from '../../types/rolefit';
import { isSkillInProfile, normalizeSkillId } from '../../utils/jdParser';
import { Sparkles, Plus, X, ChevronDown, ChevronUp, Search, Sliders, Waves, Layers, CheckCircle2, HelpCircle } from 'lucide-react';

export type PriorityLens = 'skills' | 'location' | 'compensation' | 'workstyle';

interface SkillOceanProps {
  jd: ParsedJd;
  candidateProfile: CandidateProfile;
  onProfileChange: (profile: CandidateProfile) => void;
  onInspect: (req: Requirement, match: SkillMatch) => void;
  activeLens?: PriorityLens;
  onLensChange?: (lens: PriorityLens) => void;
}

export function getNormalizedDisplayLines(title: string): { top: string; bottom?: string } {
  const clean = title.trim();
  if (/business metrics|kpi/i.test(clean)) return { top: 'BUSINESS METRICS', bottom: 'KPI REPORTING' };
  if (/machine learning|deep learning/i.test(clean)) return { top: 'MACHINE LEARNING', bottom: 'DEEP LEARNING' };
  if (/powerpoint|slides/i.test(clean)) return { top: 'POWERPOINT', bottom: '/ SLIDES' };
  if (/python/i.test(clean)) return { top: 'PYTHON', bottom: '/ PANDAS' };
  if (/analytical|problem solving/i.test(clean)) return { top: 'ANALYTICAL THINKING', bottom: '& RESEARCH' };
  if (/engineering drawings/i.test(clean)) return { top: 'ENGINEERING DRAWINGS', bottom: '& TOLERANCES' };
  if (/materials/i.test(clean)) return { top: 'MATERIALS & MFG', bottom: 'PROCESSES' };
  if (/industrial automation/i.test(clean)) return { top: 'INDUSTRIAL AUTO', bottom: '& ROBOTICS' };
  if (/microcontrollers/i.test(clean)) return { top: 'MICROCONTROLLERS', bottom: '& ELECTRONICS' };
  if (/solidworks/i.test(clean)) return { top: 'SOLIDWORKS', bottom: '/ CAD' };

  const parts = clean.split(/\s+/);
  if (parts.length <= 2) return { top: clean.toUpperCase() };
  const mid = Math.ceil(parts.length / 2);
  return {
    top: parts.slice(0, mid).join(' ').toUpperCase(),
    bottom: parts.slice(mid).join(' ').toUpperCase(),
  };
}

export interface PlacedBubble {
  id: string;
  leftPercent: number;
  topPercent: number;
  xPx: number;
  yPx: number;
  wPx: number;
  hPx: number;
  zIndex: number;
  displayLines: { top: string; bottom?: string };
  zoneName: string;
}

export const SkillOcean: React.FC<SkillOceanProps> = ({
  jd,
  candidateProfile,
  onProfileChange,
  onInspect,
  activeLens: propLens,
  onLensChange,
}) => {
  const [internalLens, setInternalLens] = useState<PriorityLens>('skills');
  const activeLens = propLens || internalLens;

  const handleLensChange = (newLens: PriorityLens) => {
    if (onLensChange) onLensChange(newLens);
    else setInternalLens(newLens);
  };

  const [activeSkillIds, setActiveSkillIds] = useState<Set<string>>(new Set());
  const [ripplePos, setRipplePos] = useState<{ x: number; y: number; key: number; isMatched: boolean } | null>(null);
  const [confirmSkillReq, setConfirmSkillReq] = useState<Requirement | null>(null);
  const [showAddSkillInput, setShowAddSkillInput] = useState(false);
  const [newSkillText, setNewSkillText] = useState('');
  const [showMatrixDetails, setShowMatrixDetails] = useState(false);
  const [showDebugOverlay, setShowDebugOverlay] = useState(false);
  
  const oceanRef = useRef<HTMLDivElement>(null);
  const oceanSurfaceRef = useRef<HTMLDivElement>(null);
  const [oceanDimensions, setOceanDimensions] = useState({ width: 440, height: 440 });

  const preferredReqs = jd.requirements.filter(r => r.priority === 'preferred');

  // Measure Ocean Surface dimensions dynamically for strict boundary clamping
  useEffect(() => {
    const measureContainer = () => {
      if (oceanSurfaceRef.current) {
        const rect = oceanSurfaceRef.current.getBoundingClientRect();
        setOceanDimensions({ width: rect.width || 440, height: rect.height || 440 });
      }
    };

    measureContainer();
    window.addEventListener('resize', measureContainer);
    return () => window.removeEventListener('resize', measureContainer);
  }, []);

  // Development Assertion: Match Details Skill Count === Ocean Requirement Count
  useEffect(() => {
    const matchDetailCount = Object.keys(jd.matches).length;
    const oceanCount = jd.requirements.length;
    if (matchDetailCount !== oceanCount) {
      console.warn(`[ROLEFIT ASSERTION MISMATCH] Match Details (${matchDetailCount}) !== Ocean (${oceanCount})`);
    }
  }, [jd]);

  const [isDragOverCenter, setIsDragOverCenter] = useState(false);

  // HTML5 Drag & Drop handlers
  const handleDragStart = (req: Requirement, e: React.DragEvent) => {
    e.dataTransfer.setData('text/plain', req.id);
  };

  const handleDragOverCenter = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOverCenter(true);
  };

  const handleDragLeaveCenter = () => {
    setIsDragOverCenter(false);
  };

  const handleDropOnCenter = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOverCenter(false);
    const reqId = e.dataTransfer.getData('text/plain');
    const req = jd.requirements.find(r => r.id === reqId);
    if (req) {
      moveSkillToFit(req);
    }
  };

  // Trigger skill move to YOUR FIT
  const moveSkillToFit = (req: Requirement, e?: React.MouseEvent) => {
    const isOwnedInProfile = isSkillInProfile(req.title, candidateProfile.skills);

    if (oceanRef.current && e) {
      const rect = oceanRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setRipplePos({ x, y, key: Date.now(), isMatched: isOwnedInProfile });
    }

    if (isOwnedInProfile) {
      setActiveSkillIds((prev) => {
        const next = new Set(prev);
        if (next.has(req.id)) next.delete(req.id);
        else next.add(req.id);
        return next;
      });
    } else {
      // Prompt user to add to profile if not owned
      setConfirmSkillReq(req);
    }
  };

  const handleConfirmAddSkill = () => {
    if (!confirmSkillReq) return;
    const skillTitle = confirmSkillReq.title;
    const normTarget = normalizeSkillId(skillTitle);

    if (!candidateProfile.skills.some(s => normalizeSkillId(s) === normTarget)) {
      onProfileChange({
        ...candidateProfile,
        profileType: 'custom',
        skills: [...candidateProfile.skills, skillTitle],
      });
    }

    setActiveSkillIds((prev) => new Set(prev).add(confirmSkillReq.id));
    setConfirmSkillReq(null);
  };

  const handleAddCandidateSkill = (skill: string) => {
    const trimmed = skill.trim();
    if (!trimmed) return;
    const normTarget = normalizeSkillId(trimmed);

    if (!candidateProfile.skills.some(s => normalizeSkillId(s) === normTarget)) {
      onProfileChange({
        ...candidateProfile,
        profileType: 'custom',
        skills: [...candidateProfile.skills, trimmed],
      });
    }
    setNewSkillText('');
    setShowAddSkillInput(false);
  };

  // Keyboard navigation for Priority Spectrum (ArrowLeft, ArrowRight, ArrowUp, ArrowDown, Home, End)
  const lensOrder: PriorityLens[] = ['skills', 'location', 'compensation', 'workstyle'];

  const handlePriorityKeyDown = (e: React.KeyboardEvent) => {
    const currIndex = lensOrder.indexOf(activeLens);
    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      const prevIndex = (currIndex - 1 + lensOrder.length) % lensOrder.length;
      handleLensChange(lensOrder[prevIndex]);
    } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      const nextIndex = (currIndex + 1) % lensOrder.length;
      handleLensChange(lensOrder[nextIndex]);
    } else if (e.key === 'Home') {
      e.preventDefault();
      handleLensChange('skills');
    } else if (e.key === 'End') {
      e.preventDefault();
      handleLensChange('workstyle');
    }
  };

  // Physical Indicator Dot Left Percentage
  const indicatorPositions: Record<PriorityLens, string> = {
    skills: '12.5%',
    location: '37.5%',
    compensation: '62.5%',
    workstyle: '87.5%',
  };

  const matchesCount = jd.coreMatchCount;
  const gapsCount = jd.coreGapCount;

  // Deterministic Lens Banner Messages
  const getLensBannerMessage = () => {
    if (activeLens === 'location') {
      return `Location Lens Active: ${jd.location} (${jd.workplaceType}). Source: ${jd.locationSource === 'USER_PROVIDED' ? 'User Provided' : 'JD'}.`;
    }
    if (activeLens === 'compensation') {
      const stipend = jd.postingConditions.find(c => c.category === 'stipend');
      const ppo = jd.postingConditions.find(c => c.category === 'ppo_domestic');
      return `Compensation Lens Active: ${stipend ? stipend.value : jd.salaryRange} ${ppo ? '· PPO: ' + ppo.value : ''}.`;
    }
    if (activeLens === 'workstyle') {
      const hasWorkstyle = /hybrid|onsite|remote|travel|independent|collaboration/i.test(jd.rawText);
      return hasWorkstyle
        ? `Work Style Lens Active: The posting emphasizes ${jd.workplaceType.toLowerCase()} work and independent execution.`
        : `Work Style Lens Active: No explicit work-style conditions were identified in this posting.`;
    }
    return `Skill Fit Lens Active: Drag or tap role skill bubbles to move them into YOUR FIT zone.`;
  };
  /**
   * RECTANGULAR SIGNAL FIELD LAYOUT ENGINE (28A: 9-Zone Spatial Distribution across Full Rectangular Stage)
   */
  const computeRectangularSignalLayout = (): Record<string, PlacedBubble> => {
    const stageW = oceanDimensions.width || 800;
    const stageH = oceanDimensions.height || 520;
    const isDesktop = stageW >= 600;

    const coreReqs = jd.requirements.filter(r => r.priority === 'core');
    const prefReqs = jd.requirements.filter(r => r.priority === 'preferred');

    const placedMap: Record<string, PlacedBubble> = {};
    const placedList: PlacedBubble[] = [];

    const minGapPx = isDesktop ? 20 : 12;

    // 8 Peripheral Zones surrounding Center Zone (Zone 4: YOUR FIT)
    const PERIPHERAL_ZONES = [
      { name: 'TOP-LEFT',      xMinPct: 7,  xMaxPct: 30, yMinPct: 10, yMaxPct: 26 },
      { name: 'TOP-CENTER',    xMinPct: 36, xMaxPct: 64, yMinPct: 8,  yMaxPct: 22 },
      { name: 'TOP-RIGHT',     xMinPct: 70, xMaxPct: 93, yMinPct: 10, yMaxPct: 26 },
      { name: 'MIDDLE-LEFT',   xMinPct: 5,  xMaxPct: 28, yMinPct: 38, yMaxPct: 58 },
      { name: 'MIDDLE-RIGHT',  xMinPct: 72, xMaxPct: 95, yMinPct: 38, yMaxPct: 58 },
      { name: 'BOTTOM-LEFT',   xMinPct: 7,  xMaxPct: 30, yMinPct: 72, yMaxPct: 88 },
      { name: 'BOTTOM-CENTER', xMinPct: 36, xMaxPct: 64, yMinPct: 76, yMaxPct: 92 },
      { name: 'BOTTOM-RIGHT',  xMinPct: 70, xMaxPct: 93, yMinPct: 72, yMaxPct: 88 },
    ];

    // Priority allocation maps core skills to primary peripheral zones, preferred to secondary zones
    const zoneUsageCount: Record<string, number> = {};

    // FIT DESTINATION EXCLUSION ZONE MATH (Guarantees zero overlap with center component)
    const fitCenterXPx = stageW / 2;
    const fitCenterYPx = stageH / 2;
    const fitWPx = isDesktop ? 230 : 190;
    const fitHPx = isDesktop ? 125 : 105;
    const fitBufferPx = isDesktop ? 42 : (stageW >= 500 ? 32 : 24);

    const fitExclusionHalfW = (fitWPx / 2) + fitBufferPx;
    const fitExclusionHalfH = (fitHPx / 2) + fitBufferPx;

    jd.requirements.forEach((req) => {
      const isActive = activeSkillIds.has(req.id);
      const isCore = req.priority === 'core';
      const displayLines = getNormalizedDisplayLines(req.title);

      const wPx = isDesktop ? (displayLines.bottom ? 145 : 125) : (displayLines.bottom ? 110 : 92);
      const hPx = isDesktop ? (displayLines.bottom ? 54 : 44) : (displayLines.bottom ? 46 : 38);

      let targetXPercent = 50;
      let targetYPercent = 50;
      let assignedZoneName = 'CENTER';

      if (isActive) {
        // Active Matched Skills populate dedicated MATCHED RING outside Fit Destination protected zone
        const activeList = jd.requirements.filter(r => activeSkillIds.has(r.id));
        const activeIdx = Math.max(0, activeList.findIndex(r => r.id === req.id));
        const totalActive = activeList.length || 1;
        const angle = (activeIdx / totalActive) * 2 * Math.PI - Math.PI / 2;

        // Radius guarantees placement completely OUTSIDE fitExclusionHalfW & fitExclusionHalfH
        const radiusPctX = isDesktop ? 30 : 36;
        const radiusPctY = isDesktop ? 28 : 34;
        targetXPercent = 50 + Math.cos(angle) * radiusPctX;
        targetYPercent = 50 + Math.sin(angle) * radiusPctY;
        assignedZoneName = 'MATCHED-RING';
      } else {
        // Unmatched Skills populate 8 Peripheral Grid Zones
        let zoneIdx = 0;
        if (isCore) {
          const coreIdx = coreReqs.findIndex(r => r.id === req.id);
          const primaryZoneIndices = [0, 2, 3, 4, 5, 7, 1, 6];
          zoneIdx = primaryZoneIndices[coreIdx % primaryZoneIndices.length];
        } else {
          const prefIdx = prefReqs.findIndex(r => r.id === req.id);
          const secondaryZoneIndices = [1, 6, 0, 7, 2, 5, 3, 4];
          zoneIdx = secondaryZoneIndices[prefIdx % secondaryZoneIndices.length];
        }

        const zone = PERIPHERAL_ZONES[zoneIdx];
        assignedZoneName = zone.name;
        const subIndex = zoneUsageCount[zone.name] || 0;
        zoneUsageCount[zone.name] = subIndex + 1;

        const xSpan = zone.xMaxPct - zone.xMinPct;
        const ySpan = zone.yMaxPct - zone.yMinPct;
        const xOffsetFactor = subIndex > 0 ? (subIndex % 2 === 1 ? 0.75 : 0.25) : 0.5;
        const yOffsetFactor = subIndex > 0 ? (subIndex > 2 ? 0.75 : 0.25) : 0.5;

        targetXPercent = zone.xMinPct + xSpan * xOffsetFactor;
        targetYPercent = zone.yMinPct + ySpan * yOffsetFactor;
      }

      let xPx = (targetXPercent / 100) * stageW;
      let yPx = (targetYPercent / 100) * stageH;

      // Deterministic Bounding Box Collision Prevention across stage & FIT DESTINATION EXCLUSION
      let attempts = 0;
      while (attempts < 24) {
        let hasCollision = false;

        // 1. Check collision against YOUR FIT DESTINATION Protected Exclusion Zone
        const dxToFit = Math.abs(xPx - fitCenterXPx);
        const dyToFit = Math.abs(yPx - fitCenterYPx);
        const minSafeDx = fitExclusionHalfW + (wPx / 2);
        const minSafeDy = fitExclusionHalfH + (hPx / 2);

        if (dxToFit < minSafeDx && dyToFit < minSafeDy) {
          hasCollision = true;
          // Push bubble outwards along angle from center
          const angleFromCenter = Math.atan2(yPx - fitCenterYPx, xPx - fitCenterXPx) || (attempts * 45 * Math.PI / 180);
          xPx = fitCenterXPx + Math.cos(angleFromCenter) * (minSafeDx + 12);
          yPx = fitCenterYPx + Math.sin(angleFromCenter) * (minSafeDy + 12);
        }

        // 2. Check collision against already placed bubbles
        for (const prev of placedList) {
          const overlapX = Math.abs(xPx - prev.xPx) < (wPx + prev.wPx) / 2 + minGapPx;
          const overlapY = Math.abs(yPx - prev.yPx) < (hPx + prev.hPx) / 2 + minGapPx;
          if (overlapX && overlapY) {
            hasCollision = true;
            break;
          }
        }

        if (!hasCollision) break;

        // Nudge position along spiral path
        const nudgeAngle = (attempts * 45) * (Math.PI / 180);
        const nudgeDist = 20 + attempts * 5;
        xPx += Math.cos(nudgeAngle) * nudgeDist;
        yPx += Math.sin(nudgeAngle) * nudgeDist;
        attempts++;
      }

      // Strict Absolute Safe Boundary Containment (Desktop 32px / Mobile 20px margin from stage edge)
      const safeMarginPx = isDesktop ? 32 : 20;
      const minXPx = wPx / 2 + safeMarginPx;
      const maxXPx = stageW - wPx / 2 - safeMarginPx;
      const minYPx = hPx / 2 + safeMarginPx;
      const maxYPx = stageH - hPx / 2 - safeMarginPx;

      xPx = Math.max(minXPx, Math.min(maxXPx, xPx));
      yPx = Math.max(minYPx, Math.min(maxYPx, yPx));

      const leftPercent = (xPx / stageW) * 100;
      const topPercent = (yPx / stageH) * 100;
      const zIndex = isActive ? 50 : (isCore ? 10 : 8);

      const placedItem: PlacedBubble = {
        id: req.id,
        leftPercent,
        topPercent,
        xPx,
        yPx,
        wPx,
        hPx,
        zIndex,
        displayLines,
        zoneName: assignedZoneName,
      };

      placedMap[req.id] = placedItem;
      placedList.push(placedItem);
    });

    return placedMap;
  };

  return (
    <div className="bg-[#EFECE4] border-2 border-[#141416] p-6 sm:p-8 rounded-lg space-y-6 tactile-card relative overflow-hidden my-8">
      
      {/* Background Ambient Radial Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] ambient-glow pointer-events-none -z-0"></div>

      {/* Top Header & Dynamic System Readout */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#E2DEC9]">
        <div className="space-y-1">
          <div className="inline-flex items-center space-x-2 bg-white px-2.5 py-1 rounded border border-[#E2DEC9] font-mono text-xs text-[#5A5A62]">
            <Sparkles className="w-3.5 h-3.5 text-[#141416]" />
            <span className="font-bold uppercase tracking-wider text-[#141416]">SIGNATURE INTERACTION</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-bold font-display text-[#141416]">
            ROLE SIGNAL OCEAN
          </h3>
          <p className="text-xs sm:text-sm text-[#5A5A62] font-sans">
            "Drag or tap skill bubbles to move the ones you bring into YOUR FIT."
          </p>
        </div>

        {/* Dynamic System Readout */}
        <div className="bg-white p-3 rounded border-2 border-[#141416] space-y-1 font-mono text-xs self-start md:self-auto hover-lift hover-glow-neutral">
          <div className="text-[10px] text-[#8A8A93] uppercase font-bold flex items-center space-x-1">
            <Waves className="w-3 h-3 text-[#141416]" />
            <span>CURRENT LENS: {activeLens.toUpperCase()}</span>
          </div>
          <div className="font-bold text-[#141416]">
            {matchesCount} MATCHES · {gapsCount} CORE GAPS · {preferredReqs.length} PREFERRED
          </div>
        </div>
      </div>

      {/* Personal Priority Spectrum Control with Physical Moving Indicator Dot */}
      <div className="relative z-10 bg-white p-4 rounded-lg border-2 border-[#141416] space-y-3 font-mono text-xs shadow-xs hover-glow-neutral">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E2DEC9] pb-2">
          <div className="flex items-center space-x-2 text-[#141416]">
            <Sliders className="w-4 h-4 text-[#141416]" />
            <span className="font-bold uppercase">WHAT MATTERS MOST TO YOU?</span>
          </div>
          <span className="text-[10px] text-[#8A8A93] uppercase font-semibold">
            USE LEFT/RIGHT ARROW KEYS OR CLICK TO SHIFT LENS
          </span>
        </div>

        {/* Spectrum Track with Physical Moving Dot Indicator */}
        <div 
          tabIndex={0}
          onKeyDown={handlePriorityKeyDown}
          aria-label="Personal Priority Spectrum Control. Use Left/Right Arrow Keys to shift emphasis."
          className="relative bg-[#F8F7F2] p-1.5 rounded-lg border border-[#E2DEC9] focus:outline-none focus:ring-2 focus:ring-[#141416]"
        >
          {/* Spectrum Tab Buttons */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 relative z-10">
            {lensOrder.map((lensKey) => {
              const isSelected = activeLens === lensKey;
              const labels: Record<PriorityLens, string> = {
                skills: 'SKILL FIT',
                location: 'LOCATION & MODE',
                compensation: 'COMPENSATION',
                workstyle: 'WORK STYLE',
              };

              return (
                <button
                  key={lensKey}
                  onClick={() => handleLensChange(lensKey)}
                  className={`py-2 px-3 rounded font-mono text-xs font-bold transition-all cursor-pointer border hover-lift ${
                    isSelected
                      ? 'bg-[#141416] text-[#CCFF00] border-[#141416] shadow-xs'
                      : 'bg-white/80 text-[#5A5A62] border-[#E2DEC9] hover:text-[#141416] hover:bg-[#EFECE4]'
                  }`}
                >
                  <span>{labels[lensKey]}</span>
                </button>
              );
            })}
          </div>

          {/* Physical Slider Bar with Moving Dot */}
          <div className="relative mt-2 h-2 bg-[#E2DEC9] rounded-full overflow-hidden">
            <div 
              style={{ left: indicatorPositions[activeLens] }}
              className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-[#CCFF00] border-2 border-[#141416] shadow-sm transition-all duration-300 z-20"
            />
          </div>
        </div>

        {/* Lens Banner Message */}
        <div className="p-2.5 bg-[#F8F7F2] rounded border border-[#E2DEC9] text-xs font-mono text-[#141416] font-semibold flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-[#CCFF00] border border-[#141416]"></span>
          <span>{getLensBannerMessage()}</span>
        </div>
      </div>

      {/* "WHAT DO YOU BRING?" Candidate Skills Bar */}
      <div className="relative z-10 bg-white p-3.5 rounded border border-[#E2DEC9] space-y-2 font-mono text-xs">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="space-y-0.5">
            <div className="font-bold text-[#141416] uppercase">WHAT DO YOU BRING?</div>
            <div className="text-[11px] text-[#5A5A62]">Active Profile: <strong className="text-[#141416]">{candidateProfile.name}</strong></div>
          </div>

          <button
            onClick={() => setShowAddSkillInput(!showAddSkillInput)}
            className="px-3.5 py-1.5 bg-[#CCFF00] hover:bg-[#BBE600] text-[#0F1400] font-bold rounded border border-[#141416] flex items-center space-x-1 cursor-pointer transition-colors hover-lift min-h-[44px]"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>ADD YOUR SKILL</span>
          </button>
        </div>

        {/* Active Candidate Skill Tags */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {candidateProfile.skills.map((skill) => (
            <span
              key={skill}
              className="inline-flex items-center space-x-1 bg-[#F8F7F2] border border-[#141416] px-2.5 py-0.5 rounded font-mono text-xs text-[#141416] font-semibold hover-lift"
            >
              <span>{skill}</span>
              <button
                onClick={() => {
                  const updated = candidateProfile.skills.filter(s => s !== skill);
                  onProfileChange({ ...candidateProfile, profileType: 'custom', skills: updated });
                }}
                className="hover:text-[#B45309] cursor-pointer"
                title={`Remove ${skill}`}
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* Add Custom Candidate Skill Drawer */}
      {showAddSkillInput && (
        <div className="relative z-20 bg-white p-3.5 rounded border-2 border-[#141416] space-y-2 font-mono text-xs animate-in fade-in duration-150 shadow-xl">
          <div className="flex justify-between items-center text-[10px] font-bold text-[#8A8A93] uppercase">
            <span>TYPE OR SELECT EXTRA SKILL TO ADD</span>
            <button onClick={() => setShowAddSkillInput(false)} className="cursor-pointer text-[#141416]">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-2">
            <div className="flex space-x-2">
              <input
                type="text"
                value={newSkillText}
                onChange={(e) => setNewSkillText(e.target.value)}
                onKeyDown={(e) => { 
                  if (e.key === 'Enter' && newSkillText.trim() && !isSkillInProfile(newSkillText.trim(), candidateProfile.skills)) {
                    handleAddCandidateSkill(newSkillText); 
                  }
                }}
                placeholder="Type skill (e.g. SEO, SQL, Figma, Canva, DAX)..."
                className="flex-1 p-2 bg-[#F8F7F2] rounded border border-[#E2DEC9] text-xs text-[#141416]"
              />
              <button
                disabled={!newSkillText.trim() || isSkillInProfile(newSkillText.trim(), candidateProfile.skills)}
                onClick={() => handleAddCandidateSkill(newSkillText)}
                className={`px-4 py-2 font-bold rounded border cursor-pointer hover-lift ${
                  !newSkillText.trim() || isSkillInProfile(newSkillText.trim(), candidateProfile.skills)
                    ? 'bg-gray-200 text-gray-400 border-gray-300 cursor-not-allowed'
                    : 'bg-[#141416] text-[#CCFF00] border-[#141416]'
                }`}
              >
                ADD
              </button>
            </div>

            {/* If user types an already-owned skill */}
            {newSkillText.trim() && isSkillInProfile(newSkillText.trim(), candidateProfile.skills) && (
              <div className="text-[10px] font-bold text-[#B45309] bg-[#FFFBEB] p-2 rounded border border-[#F59E0B]/40 flex items-center space-x-1">
                <span>{newSkillText.trim().toUpperCase()} · ALREADY IN YOUR PROFILE</span>
              </div>
            )}

            {/* Quick Unowned Suggestion Chips */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              <span className="text-[9px] font-bold text-[#8A8A93] uppercase self-center mr-1">SUGGESTIONS:</span>
              {['SQL', 'Tableau', 'Figma', 'Canva', 'DAX', 'Market Research']
                .filter(s => !isSkillInProfile(s, candidateProfile.skills))
                .map(s => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => handleAddCandidateSkill(s)}
                    className="px-2 py-0.5 bg-[#F8F7F2] hover:bg-[#CCFF00] hover:text-[#0F1400] text-[#141416] border border-[#141416] rounded text-[10px] font-bold cursor-pointer transition-colors"
                  >
                    + {s}
                  </button>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* Inline Confirmation Dialog for Unowned Skills */}
      {confirmSkillReq && (
        <div 
          onKeyDown={(e) => { if (e.key === 'Escape') setConfirmSkillReq(null); }}
          className="relative z-30 bg-[#141416] text-white p-4.5 rounded-lg border-2 border-[#CCFF00] space-y-3 font-mono text-xs shadow-2xl animate-in fade-in duration-150"
        >
          <div className="flex items-center space-x-2 text-[#CCFF00]">
            <HelpCircle className="w-4.5 h-4.5" />
            <span className="font-bold uppercase tracking-wider text-sm">DO YOU HAVE THIS SKILL?</span>
          </div>
          <p className="text-gray-300">
            RoleFit noted that <strong className="text-[#CCFF00] font-bold">"{confirmSkillReq.title}"</strong> is required for this role but not yet listed in your active candidate profile.
          </p>
          <div className="flex flex-wrap items-center gap-3 pt-1">
            <button
              autoFocus
              onClick={handleConfirmAddSkill}
              className="px-4 py-2 bg-[#CCFF00] hover:bg-[#BBE600] text-[#0F1400] font-bold rounded border border-[#141416] cursor-pointer hover-lift flex items-center space-x-1 min-h-[44px]"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>ADD TO MY PROFILE & MATCH</span>
            </button>
            <button
              onClick={() => setConfirmSkillReq(null)}
              className="px-4 py-2 bg-[#1E1E22] hover:bg-[#2A2A30] text-gray-300 font-bold rounded border border-[#333338] cursor-pointer hover-lift min-h-[44px]"
            >
              CANCEL (KEEP AS GAP ⚠)
            </button>
          </div>
        </div>
      )}

      {/* Compact Ocean Legend */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-2 bg-white px-3.5 py-2 rounded border border-[#E2DEC9] font-mono text-[10px] text-[#5A5A62] font-semibold">
        <div className="flex flex-wrap items-center gap-3">
          <span className="flex items-center space-x-1 text-[#141416] font-bold">
            <span className="w-2 h-2 rounded-full border-2 border-[#141416] bg-white"></span>
            <span>INNER RING: CORE REQUIRED</span>
          </span>
          <span className="flex items-center space-x-1">
            <span className="w-2 h-2 rounded-full border border-[#8A8A93] bg-[#F8F7F2]"></span>
            <span>OUTER RING: PREFERRED</span>
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <span className="flex items-center space-x-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#CCFF00] border border-[#141416]"></span>
            <span className="text-[#0F1400] font-bold">LIME = MATCH ✓</span>
          </span>
          <span className="flex items-center space-x-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FFFBEB] border border-[#F59E0B]"></span>
            <span className="text-[#B45309] font-bold">AMBER = GAP ⚠</span>
          </span>
          <button
            onClick={() => setShowDebugOverlay(!showDebugOverlay)}
            className="text-[9px] text-[#8A8A93] hover:text-[#141416] underline cursor-pointer ml-2"
            title="Toggle Collision Bounding Box QA Overlay"
          >
            {showDebugOverlay ? 'HIDE BOUNDING BOXES' : 'QA OVERLAY'}
          </button>
        </div>
      </div>

      {/* Main ROLE SIGNAL OCEAN Visual Field Stage (Light Pencil Blue Watercolor Wash on Editorial Paper) */}
      <div 
        ref={oceanRef}
        className="relative z-10 w-full min-h-[500px] sm:min-h-[560px] rounded-xl bg-[#F8F7F2] border-2 border-[#141416] shadow-md overflow-hidden select-none p-4 sm:p-6 flex items-center justify-center"
      >
        <div 
          ref={oceanSurfaceRef}
          className="relative w-full h-full min-h-[480px] sm:min-h-[520px] flex items-center justify-center rounded-lg overflow-hidden border border-[#B8DCE8] bg-gradient-to-br from-[#B8DCE8]/60 via-[#C9E7EF]/50 to-[#D7EEF3]/40 shadow-inner"
        >
          {/* Depth 1 Layer 1: Ambient Pencil Grid & Soft Watercolor Current Waves */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-30 z-0" viewBox="0 0 1000 550" preserveAspectRatio="none">
            <defs>
              <pattern id="pencilGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#94A3B8" strokeWidth="0.5" strokeDasharray="2 2" />
                <circle cx="40" cy="40" r="1" fill="#64748B" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#pencilGrid)" />
            <path d="M-50,140 Q250,90 500,140 T1050,140" fill="none" stroke="#60A5FA" strokeWidth="1.5" className="animate-wave-1" />
            <path d="M-50,280 Q300,320 500,280 T1050,280" fill="none" stroke="#141416" strokeWidth="1" strokeDasharray="6 6" className="animate-wave-2" opacity="0.4" />
            <path d="M-50,420 Q200,380 500,420 T1050,420" fill="none" stroke="#60A5FA" strokeWidth="1.5" className="animate-wave-3" />
          </svg>

          {/* Depth 1 Layer 2: Subtle Editorial Annotations in Empty Zones */}
          <div className="absolute inset-0 pointer-events-none z-0">
            <span className="absolute top-[16%] left-[12%] text-[10px] font-mono text-[#5A5A62] opacity-50 font-bold">+ SIGNAL_NODE_01</span>
            <span className="absolute top-[16%] right-[14%] text-[10px] font-mono text-[#5A5A62] opacity-50 font-bold">+ SIGNAL_NODE_02</span>
            <span className="absolute bottom-[16%] left-[14%] text-[10px] font-mono text-[#5A5A62] opacity-50 font-bold">+ SIGNAL_NODE_03</span>
            <span className="absolute bottom-[16%] right-[12%] text-[10px] font-mono text-[#5A5A62] opacity-50 font-bold">+ SIGNAL_NODE_04</span>
            <span className="absolute top-4 left-4 text-[9px] font-mono text-[#141416] opacity-60 bg-white/80 border border-[#B8DCE8] px-2 py-0.5 rounded font-bold">
              PENCIL_OCEAN: RECTANGULAR_FIELD
            </span>
            <span className="absolute top-4 right-4 text-[9px] font-mono text-[#0F1400] bg-[#CCFF00] border border-[#141416] px-2 py-0.5 rounded font-extrabold">
              ACTIVE SIGNALS: {jd.requirements.length} DETECTED
            </span>
          </div>

          {/* Selection Water Ripple */}
          {ripplePos && (
            <span 
              key={ripplePos.key}
              style={{ left: ripplePos.x, top: ripplePos.y }}
              className={`absolute -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full border-2 pointer-events-none z-10 animate-ripple ${
                ripplePos.isMatched ? 'border-[#CCFF00] bg-[#CCFF00]/30' : 'border-[#F59E0B] bg-[#F59E0B]/30'
              }`}
            />
          )}

          {/* Depth 3 Layer: YOUR FIT CENTER STAGE DESTINATION */}
          <div 
            onDragOver={handleDragOverCenter}
            onDragLeave={handleDragLeaveCenter}
            onDrop={handleDropOnCenter}
            className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center space-y-1.5 z-20 bg-[#F8F7F2]/95 backdrop-blur-xs p-5 sm:p-6 rounded-2xl border-2 transition-all duration-200 min-w-[190px] sm:min-w-[220px] shadow-lg ${
              isDragOverCenter 
                ? 'border-[#141416] bg-[#CCFF00]/40 font-bold scale-105 shadow-xl ring-4 ring-[#CCFF00]/50' 
                : 'border-[#141416] shadow-md'
            }`}
          >
            <div className="font-mono text-[10px] text-[#5A5A62] uppercase font-bold tracking-widest flex items-center justify-center space-x-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#141416] animate-pulse"></span>
              <span>YOUR FIT DESTINATION</span>
            </div>
            <div className="font-display font-bold text-xl sm:text-2xl text-[#141416]">
              {jd.overallVerdict.signal.replace('_', ' ')}
            </div>
            <div className="font-mono text-[11px] font-bold space-y-1 pt-1.5 border-t border-[#E2DEC9]">
              <div className="text-[#0F1400] bg-[#CCFF00] px-2.5 py-0.5 rounded font-extrabold border border-[#141416]">
                {matchesCount} MATCHES
              </div>
              <div className="text-[#B45309] bg-[#FFFBEB] px-2.5 py-0.5 rounded border border-[#F59E0B]">
                {gapsCount} CORE GAPS
              </div>
            </div>
          </div>

          {/* QA Debug Overlay: FIT DESTINATION PROTECTED NO-BUBBLE EXCLUSION ZONE */}
          {showDebugOverlay && (
            <div 
              style={{
                width: `${(oceanDimensions.width >= 600 ? 230 : 190) + (oceanDimensions.width >= 600 ? 84 : 48)}px`,
                height: `${(oceanDimensions.width >= 600 ? 125 : 105) + (oceanDimensions.width >= 600 ? 84 : 48)}px`,
              }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border-2 border-dashed border-yellow-500 bg-yellow-500/10 pointer-events-none z-15 rounded-2xl flex items-start justify-center p-1"
            >
              <span className="bg-yellow-500 text-[#141416] text-[8px] font-mono font-bold px-1.5 py-0.5 rounded shadow-sm">
                PROTECTED FIT ZONE EXCLUSION
              </span>
            </div>
          )}

          {/* SVG Trajectory Stream Lines Connecting Peripheral Skill Bubbles to YOUR FIT Center */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" viewBox={`0 0 ${oceanDimensions.width || 800} ${oceanDimensions.height || 520}`}>
            {(() => {
              const placedLayout = computeRectangularSignalLayout();
              const centerX = (oceanDimensions.width || 800) / 2;
              const centerY = (oceanDimensions.height || 520) / 2;

              return jd.requirements.map((req) => {
                const placed = placedLayout[req.id];
                if (!placed) return null;
                const isActive = activeSkillIds.has(req.id);
                const isOwned = isSkillInProfile(req.title, candidateProfile.skills);
                const isMatched = isOwned || isActive;

                return (
                  <line
                    key={`stream-${req.id}`}
                    x1={placed.xPx}
                    y1={placed.yPx}
                    x2={centerX}
                    y2={centerY}
                    stroke={isMatched ? '#CCFF00' : (req.priority === 'core' ? '#B45309' : '#0284C7')}
                    strokeWidth={isActive ? '2.5' : '1'}
                    strokeDasharray={isActive ? 'none' : '4 4'}
                    opacity={isActive ? '0.85' : '0.35'}
                  />
                );
              });
            })()}
          </svg>

          {/* Depth 2 Layer: Rectangular Grid-Distributed Skill Bubbles */}
          <div className="absolute inset-0 z-30 pointer-events-auto">
            {(() => {
              const signalLayout = computeRectangularSignalLayout();
              return jd.requirements.map((req, idx) => {
                const placed = signalLayout[req.id];
                if (!placed) return null;

                const match = jd.matches[req.id];
                const isActive = activeSkillIds.has(req.id);
                const isOwned = isSkillInProfile(req.title, candidateProfile.skills);
                const isMatched = match?.matchStatus === 'matched' || match?.matchStatus === 'preferred_matched' || isOwned;
                const isCore = req.priority === 'core';

                const driftClass = idx % 3 === 0 ? 'animate-drift-1' : idx % 3 === 1 ? 'animate-drift-2' : 'animate-drift-3';
                const glowClass = isMatched ? 'hover-glow-lime' : 'hover-glow-amber';

                let colorClasses = 'bg-white text-[#141416] border-[#141416] hover:scale-103 shadow-md';
                if (isActive) {
                  colorClasses = isMatched
                    ? 'bg-[#CCFF00] text-[#0F1400] border-[#141416] font-extrabold scale-105 shadow-xl ring-2 ring-[#141416]'
                    : 'bg-[#FFFBEB] text-[#B45309] border-[#B45309] font-extrabold scale-105 shadow-xl';
                } else if (isOwned) {
                  colorClasses = 'bg-white text-[#141416] border-[#CCFF00] hover:scale-103 shadow-md';
                } else if (isCore) {
                  colorClasses = 'bg-[#FFFBEB] text-[#B45309] border-[#F59E0B] hover:scale-103 shadow-md';
                } else {
                  colorClasses = 'bg-[#E0F2FE] text-[#0369A1] border-[#0284C7] opacity-95 hover:scale-103 shadow-sm';
                }

                return (
                  <button
                    key={req.id}
                    draggable={true}
                    onDragStart={(e) => handleDragStart(req, e)}
                    onClick={(e) => moveSkillToFit(req, e)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        moveSkillToFit(req);
                      }
                    }}
                    tabIndex={0}
                    aria-label={`Skill bubble: ${req.title}, ${isCore ? 'Required' : 'Preferred'}. Press Enter or click to move into YOUR FIT`}
                    style={{
                      left: `${placed.leftPercent}%`,
                      top: `${placed.topPercent}%`,
                      transform: 'translate(-50%, -50%)',
                      zIndex: placed.zIndex,
                    }}
                    className={`absolute font-mono border-2 transition-all cursor-pointer flex flex-col items-center justify-center text-center px-3 py-1.5 ${glowClass} ${driftClass} rounded-full min-w-[90px] max-w-[140px] sm:max-w-[165px] min-h-[44px] sm:min-h-[50px] ${colorClasses}`}
                  >
                    {/* 2-Line Display Title */}
                    <span className="font-bold leading-none uppercase text-[10px] sm:text-[11px] tracking-tight">
                      {placed.displayLines.top}
                      {placed.displayLines.bottom && (
                        <span className="block text-[9px] sm:text-[10px] font-semibold opacity-90 mt-0.5">
                          {placed.displayLines.bottom}
                        </span>
                      )}
                    </span>
                    
                    {/* Status Badges */}
                    {isActive && (
                      <span className="text-[8px] font-extrabold uppercase mt-0.5">
                        {isMatched ? 'MATCH ✓' : (isCore ? 'GAP ⚠' : 'NOT LISTED')}
                      </span>
                    )}
                    {!isActive && isOwned && (
                      <span className="text-[7.5px] text-[#0F1400] bg-[#CCFF00] px-1 py-0.2 rounded font-extrabold uppercase mt-0.5">
                        IN PROFILE ✓
                      </span>
                    )}
                    {!isActive && !isOwned && (
                      <span className="text-[7.5px] uppercase font-semibold mt-0.5 opacity-80">
                        {isCore ? 'REQUIRED ⚠' : 'PREFERRED ○'}
                      </span>
                    )}

                    {/* Development Bounding Box QA Overlay */}
                    {showDebugOverlay && (
                      <span className="absolute inset-0 border border-dashed border-red-500 pointer-events-none rounded-full">
                        <span className="absolute -top-3 left-0 bg-red-600 text-white text-[7px] px-1 font-mono">
                          {placed.zoneName}:{Math.round(placed.wPx)}x{Math.round(placed.hPx)}
                        </span>
                      </span>
                    )}
                  </button>
                );
              });
            })()}
          </div>
        </div>
      </div>

      {/* Complete Interactive Requirement Inventory Chips (100% Match Details Parity) */}
      <div className="relative z-10 bg-white p-4 rounded-lg border-2 border-[#141416] space-y-2.5 font-mono text-xs shadow-xs hover-glow-neutral">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E2DEC9] pb-2">
          <div className="flex items-center space-x-2 text-[#141416]">
            <CheckCircle2 className="w-4 h-4 text-[#141416]" />
            <span className="font-bold uppercase tracking-wider">ALL EXTRACTED ROLE REQUIREMENTS ({jd.requirements.length})</span>
          </div>
          <span className="text-[10px] text-[#8A8A93] uppercase font-semibold">
            CLICK ANY SKILL CHIP TO TAP / DRAG DIRECTLY INTO YOUR FIT
          </span>
        </div>

        <div className="flex flex-wrap gap-2 pt-1">
          {jd.requirements.map((req) => {
            const isActive = activeSkillIds.has(req.id);
            const isOwned = isSkillInProfile(req.title, candidateProfile.skills);
            return (
              <button
                key={`chip-${req.id}`}
                onClick={(e) => moveSkillToFit(req, e)}
                className={`px-3 py-1.5 rounded font-mono text-xs font-bold border transition-all cursor-pointer hover-lift flex items-center space-x-1.5 ${
                  isActive
                    ? 'bg-[#CCFF00] text-[#0F1400] border-[#141416] shadow-sm'
                    : isOwned
                    ? 'bg-white text-[#141416] border-[#CCFF00] hover:bg-[#F8F7F2]'
                    : 'bg-[#FFFBEB] text-[#B45309] border-[#F59E0B]/50 hover:bg-[#FEF3C7]'
                }`}
              >
                <span>○ {req.title}</span>
                <span className="text-[9px] font-extrabold uppercase">
                  {isActive ? 'FIT ✓' : (isOwned ? 'PROFILE ✓' : 'GAP ⚠')}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Mini Editorial Signal Map & Extra Skills */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-3.5 rounded border border-[#E2DEC9] space-y-2 font-mono text-xs hover-lift hover-glow-neutral">
          <div className="text-[10px] text-[#8A8A93] uppercase font-bold flex items-center space-x-1">
            <Layers className="w-3 h-3 text-[#141416]" />
            <span>EDITORIAL SIGNAL MAP</span>
          </div>
          <div className="space-y-1.5 text-[11px]">
            <div className="flex justify-between items-center">
              <span>SKILLS ALIGNMENT:</span>
              <span className="font-bold text-[#141416]">{matchesCount} / {jd.coreRequirementCount} MATCHED</span>
            </div>
            <div className="w-full bg-[#EFECE4] h-2 rounded-full overflow-hidden border border-[#E2DEC9]">
              <div 
                className="bg-[#CCFF00] h-full transition-all duration-300"
                style={{ width: `${jd.coreRequirementCount > 0 ? (matchesCount / jd.coreRequirementCount) * 100 : 0}%` }}
              />
            </div>
          </div>
        </div>

        <div className="bg-white p-3.5 rounded border border-[#E2DEC9] space-y-2 font-mono text-xs hover-lift hover-glow-neutral">
          <div className="text-[10px] text-[#8A8A93] uppercase font-bold">
            EXTRA CANDIDATE SKILLS (NOT MENTIONED BY JD):
          </div>
          <div className="flex flex-wrap gap-1.5">
            {jd.extraSkills.length > 0 ? (
              jd.extraSkills.map(s => (
                <span key={s} className="px-2 py-0.5 bg-[#F8F7F2] text-[#5A5A62] border border-[#E2DEC9] rounded text-[11px] hover-lift">
                  {s} · EXTRA SIGNAL
                </span>
              ))
            ) : (
              <span className="text-[11px] text-[#8A8A93] italic">No extra skills listed.</span>
            )}
          </div>
        </div>
      </div>

      {/* Secondary Match Details Toggle Button */}
      <div className="relative z-10 pt-2 flex flex-col items-center">
        <button
          onClick={() => setShowMatrixDetails(!showMatrixDetails)}
          className="px-4 py-2 bg-white hover:bg-[#F8F7F2] text-[#141416] font-mono text-xs font-bold rounded border border-[#141416] flex items-center space-x-1.5 cursor-pointer shadow-xs transition-colors hover-lift"
        >
          <span>MATCH DETAILS</span>
          {showMatrixDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {showMatrixDetails && (
          <div className="w-full mt-4 bg-white p-4 rounded border-2 border-[#141416] space-y-3 font-mono text-xs animate-in fade-in duration-150 shadow-lg">
            <div className="font-bold text-[#141416] uppercase pb-2 border-b border-[#E2DEC9] flex justify-between">
              <span>REQUIREMENT MATCH MATRIX DETAILS</span>
              <span className="text-[#8A8A93]">{jd.requirements.length} REQUIREMENTS DETECTED</span>
            </div>

            <div className="space-y-2">
              {jd.requirements.map(req => {
                const match = jd.matches[req.id];
                const status = match?.matchStatus || 'gap';
                const isMatched = status === 'matched' || status === 'preferred_matched';
                return (
                  <div
                    key={req.id}
                    onClick={() => match && onInspect(req, match)}
                    className="p-3 rounded border border-[#E2DEC9] hover:border-[#141416] flex items-center justify-between cursor-pointer hover-lift"
                  >
                    <div>
                      <div className="font-bold text-[#141416]">{req.title}</div>
                      <div className="text-[11px] text-[#5A5A62]">{req.description}</div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2.5 py-0.5 rounded font-bold text-[11px] border ${
                        isMatched ? 'bg-[#CCFF00] text-[#0F1400] border-[#141416]' : 'bg-[#FFFBEB] text-[#B45309] border-[#F59E0B]'
                      }`}>
                        {isMatched ? 'MATCH ✓' : 'GAP ⚠'}
                      </span>
                      <Search className="w-3.5 h-3.5 text-[#5A5A62]" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

    </div>
  );
};
