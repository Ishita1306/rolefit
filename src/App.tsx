import React, { useState, useMemo } from 'react';
import { SAMPLE_JDS } from './data/sampleJds';
import { DEFAULT_CANDIDATE_PROFILE } from './data/candidateProfiles';
import { ParsedJd, CandidateProfile } from './types/rolefit';
import { analyzeJobDescription } from './utils/jdParser';
import { PriorityLens } from './components/ocean/SkillOcean';
import { Header } from './components/layout/Header';
import { HeroSection } from './components/hero/HeroSection';
import { DeconstructionStage } from './components/deconstruction/DeconstructionStage';
import { RealityCheckSection } from './components/reality/RealityCheckSection';
import { VerdictSection } from './components/verdict/VerdictSection';
import { AboutSection } from './components/about/AboutSection';
import { Footer } from './components/layout/Footer';
import { EditorialScrollSection } from './components/layout/EditorialScrollSection';
import { AuthModal, AuthMode } from './components/auth/AuthModal';
import { BootLoader } from './components/loader/BootLoader';

export const App: React.FC = () => {
  const [isBootComplete, setIsBootComplete] = useState<boolean>(false);
  const [sampleJds] = useState<ParsedJd[]>(SAMPLE_JDS);
  const [selectedJdId, setSelectedJdId] = useState<string>(SAMPLE_JDS[0].id);
  const [rawText, setRawText] = useState<string>(SAMPLE_JDS[0].rawText);
  const [userRole, setUserRole] = useState<string>('');
  const [userLocation, setUserLocation] = useState<string>('');
  const [selectedRoleOverride, setSelectedRoleOverride] = useState<string>('');
  const [candidateProfile, setCandidateProfile] = useState<CandidateProfile>(DEFAULT_CANDIDATE_PROFILE);
  const [activeLens, setActiveLens] = useState<PriorityLens>('skills');

  // Frontend Demo Auth States
  const [authUser, setAuthUser] = useState<string | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);
  const [authMode, setAuthMode] = useState<AuthMode>('login');

  // Dynamic Analysis derived directly from rawText + candidateProfile + userRole + userLocation + selectedRoleOverride
  const currentJd = useMemo(() => {
    return analyzeJobDescription(rawText, candidateProfile, userRole, userLocation, selectedRoleOverride);
  }, [rawText, candidateProfile, userRole, userLocation, selectedRoleOverride]);

  const handleOpenAuth = (mode: AuthMode) => {
    setAuthMode(mode);
    setIsAuthOpen(true);
  };

  const handleLoginSuccess = (userName: string) => {
    setAuthUser(userName);
  };

  const handleLogout = () => {
    setAuthUser(null);
  };

  // Handle switching sample JDs
  const handleSelectJd = (jd: ParsedJd) => {
    setSelectedJdId(jd.id);
    setRawText(jd.rawText);
    setUserRole('');
    setUserLocation('');
    setSelectedRoleOverride('');
  };

  // Handle manual raw text changes in the Hero editor
  const handleRawTextChange = (newText: string) => {
    setRawText(newText);
  };

  // Handle Candidate Profile changes
  const handleProfileChange = (newProfile: CandidateProfile) => {
    setCandidateProfile(newProfile);
  };

  // Scroll smoothly to Deconstruction Section on CTA click
  const scrollToDeconstruction = () => {
    const el = document.getElementById('deconstruction-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Scroll to hero top
  const scrollToHero = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F7F2] text-[#141416] relative">
      {/* Game-Inspired Boot Loader */}
      {!isBootComplete && (
        <BootLoader onComplete={() => setIsBootComplete(true)} />
      )}

      {/* Top Header */}
      <Header
        onAnalyzeClick={scrollToDeconstruction}
        authUser={authUser}
        onOpenAuth={handleOpenAuth}
        onLogout={handleLogout}
      />

      {/* Main Content Sections — Physical Editorial Scroll Transition Stack */}
      <main className="flex-1 space-y-6 sm:space-y-12 overflow-visible">
        
        {/* 01: DEFINE THE ROLE & HERO (Plane 10) */}
        <EditorialScrollSection id="hero-stage" zIndex={10}>
          <HeroSection
            currentJd={currentJd}
            rawText={rawText}
            onRawTextChange={handleRawTextChange}
            userRole={userRole}
            onUserRoleChange={setUserRole}
            userLocation={userLocation}
            onUserLocationChange={setUserLocation}
            selectedRoleOverride={selectedRoleOverride}
            onSelectedRoleChange={setSelectedRoleOverride}
            onDeconstructClick={scrollToDeconstruction}
            sampleJds={sampleJds}
            selectedJdId={selectedJdId}
            onSelectJd={handleSelectJd}
          />
        </EditorialScrollSection>

        {/* 02, 03: WHAT THEY ASK FOR vs WHAT YOU BRING & ROLE SIGNAL OCEAN (Plane 20) */}
        <EditorialScrollSection id="deconstruction-section" zIndex={20}>
          <DeconstructionStage
            currentJd={currentJd}
            candidateProfile={candidateProfile}
            onProfileChange={handleProfileChange}
            activeLens={activeLens}
            onLensChange={setActiveLens}
          />
        </EditorialScrollSection>

        {/* 04: SUPPORTING DECODER (REALITY CHECK) (Plane 30) */}
        <EditorialScrollSection id="reality-check-section" zIndex={30}>
          <RealityCheckSection />
        </EditorialScrollSection>

        {/* 05: SHOULD I APPLY? (QUALITATIVE VERDICT CLIMAX) (Plane 40) */}
        <EditorialScrollSection id="verdict-section" zIndex={40}>
          <VerdictSection
            jd={currentJd}
            candidateProfile={candidateProfile}
            activeLens={activeLens}
            onAnalyzeAnother={scrollToHero}
          />
        </EditorialScrollSection>

        {/* ABOUT & BUILDER ATTRIBUTION (Plane 50) */}
        <EditorialScrollSection id="about-section-container" zIndex={50}>
          <AboutSection />
        </EditorialScrollSection>

      </main>

      {/* Page Footer */}
      <Footer onOpenAuth={handleOpenAuth} />

      {/* Normal Login + Sign Up Auth Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        initialMode={authMode}
        onClose={() => setIsAuthOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />
    </div>
  );
};

export default App;
