import React, { useState, useEffect } from 'react';
import { X, Github, Chrome, CheckCircle2, AlertCircle, Eye, EyeOff, Lock, User, Mail } from 'lucide-react';

export type AuthMode = 'login' | 'signup' | 'forgot';

interface AuthModalProps {
  isOpen: boolean;
  initialMode?: AuthMode;
  onClose: () => void;
  onLoginSuccess: (userName: string) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  initialMode = 'login',
  onClose,
  onLoginSuccess,
}) => {
  const [mode, setMode] = useState<AuthMode>(initialMode);

  // Synchronize initialMode when modal opens
  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      setInlineError('');
      setSuccessState(null);
    }
  }, [isOpen, initialMode]);

  // Form states
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('');
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [showSignupConfirmPassword, setShowSignupConfirmPassword] = useState(false);

  const [forgotEmail, setForgotEmail] = useState('');

  // Validation & feedback states
  const [inlineError, setInlineError] = useState('');
  const [successState, setSuccessState] = useState<{ title: string; subtitle: string; actionText?: string } | null>(null);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  };

  // Handle Login Submit
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setInlineError('');

    if (!validateEmail(loginEmail)) {
      setInlineError('Please enter a valid email address.');
      return;
    }
    if (loginPassword.length < 8) {
      setInlineError('Password must be at least 8 characters.');
      return;
    }

    const displayName = loginEmail.split('@')[0].toUpperCase() || 'CANDIDATE';
    setSuccessState({
      title: `WELCOME BACK, ${displayName}`,
      subtitle: 'DEMO MODE · FRONTEND AUTHENTICATION COMPLETE',
    });

    setTimeout(() => {
      onLoginSuccess(displayName);
      onClose();
    }, 1600);
  };

  // Handle Sign Up Submit
  const handleSignUpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setInlineError('');

    if (!signupName.trim()) {
      setInlineError('Please enter your full name.');
      return;
    }
    if (!validateEmail(signupEmail)) {
      setInlineError('Please enter a valid email address.');
      return;
    }
    if (signupPassword.length < 8) {
      setInlineError('Password must be at least 8 characters.');
      return;
    }
    if (signupPassword !== signupConfirmPassword) {
      setInlineError('Passwords do not match.');
      return;
    }

    const displayName = signupName.trim().split(' ')[0].toUpperCase();
    setSuccessState({
      title: 'PROFILE CREATED',
      subtitle: `WELCOME TO ROLEFIT, ${displayName}. START UNDERSTANDING ROLES.`,
      actionText: 'CONTINUE TO ROLEFIT →',
    });
  };

  // Handle Forgot Password Submit
  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setInlineError('');

    if (!validateEmail(forgotEmail)) {
      setInlineError('Please enter a valid email address.');
      return;
    }

    setSuccessState({
      title: 'RESET REQUEST DEMO COMPLETE',
      subtitle: 'If an account existed with this email, reset instructions would be sent.',
    });
  };

  // Handle Social Login Demo
  const handleSocialClick = (provider: string) => {
    setSuccessState({
      title: `${provider.toUpperCase()} LOGIN DEMO`,
      subtitle: 'Social authentication simulated successfully in demo mode.',
    });
    setTimeout(() => {
      onLoginSuccess(provider.toUpperCase() === 'GITHUB' ? 'GITHUB_DEV' : 'GOOGLE_USER');
      onClose();
    }, 1500);
  };

  const switchMode = (newMode: AuthMode) => {
    setMode(newMode);
    setInlineError('');
    setSuccessState(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#141416]/50 backdrop-blur-xs animate-in fade-in duration-200">
      
      {/* Modal Container — Physical Editorial Sheet */}
      <div 
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-modal-title"
        className="relative w-full max-w-md bg-[#F8F7F2] border-2 border-[#141416] p-6 sm:p-8 rounded-lg tactile-card shadow-2xl space-y-5 font-mono animate-in zoom-in-95 duration-200"
      >
        
        {/* Top Annotation Tag */}
        <div className="absolute -top-3.5 left-4 bg-[#141416] text-[#CCFF00] px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider flex items-center space-x-1.5 shadow-xs">
          <span className="w-1.5 h-1.5 rounded-full bg-[#CCFF00] animate-pulse"></span>
          <span>ROLEFIT / ACCESS</span>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 text-[#5A5A62] hover:text-[#141416] hover:bg-[#EFECE4] rounded cursor-pointer transition-colors"
          title="Close Modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Success State Overlay */}
        {successState ? (
          <div className="space-y-4 py-4 text-center animate-in fade-in duration-200">
            <div className="w-12 h-12 rounded-full bg-[#CCFF00] border-2 border-[#141416] mx-auto flex items-center justify-center text-[#0F1400]">
              <CheckCircle2 className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <h3 className="text-xl font-bold font-display text-[#141416] uppercase tracking-tight">
                {successState.title}
              </h3>
              <p className="text-xs text-[#5A5A62] font-sans leading-relaxed">
                {successState.subtitle}
              </p>
            </div>

            {successState.actionText && (
              <button
                onClick={() => {
                  onLoginSuccess('CANDIDATE');
                  onClose();
                }}
                className="w-full py-3.5 bg-[#CCFF00] hover:bg-[#BBE600] text-[#0F1400] font-bold rounded border-2 border-[#141416] flex items-center justify-center space-x-2 cursor-pointer shadow-xs hover-lift transition-all min-h-[44px]"
              >
                <span>{successState.actionText}</span>
              </button>
            )}
          </div>
        ) : (
          <>
            {/* Modal Heading according to mode */}
            <div className="space-y-1 pt-1 transition-all duration-200">
              <h3 id="auth-modal-title" className="text-2xl font-bold font-display text-[#141416] tracking-tight">
                {mode === 'login' && 'WELCOME BACK.'}
                {mode === 'signup' && 'CREATE YOUR ROLEFIT PROFILE'}
                {mode === 'forgot' && 'RESET PASSWORD'}
              </h3>
              <p className="text-xs text-[#5A5A62] font-sans leading-relaxed">
                {mode === 'login' && 'Continue where you left off. Understand roles before applying.'}
                {mode === 'signup' && 'Start understanding roles before you spend hours applying.'}
                {mode === 'forgot' && 'Enter your email address to receive password reset instructions.'}
              </p>
            </div>

            {/* Inline Validation Error Banner */}
            {inlineError && (
              <div className="p-3 rounded border text-xs font-bold bg-[#FFFBEB] text-[#B45309] border-[#F59E0B] flex items-center space-x-2 animate-in fade-in duration-150">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{inlineError}</span>
              </div>
            )}

            {/* 1. LOGIN FORM */}
            {mode === 'login' && (
              <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
                
                {/* Email Field */}
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-[#8A8A93] uppercase">EMAIL</label>
                  <div className="relative">
                    <input
                      type="email"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="you@example.com"
                      required
                      className="w-full p-3 pl-9 bg-white rounded border border-[#141416] text-[#141416] focus:outline-none focus:ring-2 focus:ring-[#CCFF00] min-h-[44px]"
                    />
                    <Mail className="w-4 h-4 text-[#8A8A93] absolute left-3 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <label className="block text-[10px] font-bold text-[#8A8A93] uppercase">PASSWORD</label>
                    <button
                      type="button"
                      onClick={() => switchMode('forgot')}
                      className="text-[10px] font-bold text-[#5A5A62] hover:text-[#141416] underline cursor-pointer"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type={showLoginPassword ? 'text' : 'password'}
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="Enter your password"
                      required
                      className="w-full p-3 pl-9 pr-12 bg-white rounded border border-[#141416] text-[#141416] focus:outline-none focus:ring-2 focus:ring-[#CCFF00] min-h-[44px]"
                    />
                    <Lock className="w-4 h-4 text-[#8A8A93] absolute left-3 top-1/2 -translate-y-1/2" />
                    <button
                      type="button"
                      onClick={() => setShowLoginPassword(!showLoginPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5A5A62] hover:text-[#141416] p-1 cursor-pointer"
                      title={showLoginPassword ? 'Hide password' : 'Show password'}
                    >
                      {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Remember Me Checkbox */}
                <div className="flex items-center space-x-2 pt-0.5">
                  <input
                    type="checkbox"
                    id="remember-me"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-[#141416] accent-[#141416] cursor-pointer"
                  />
                  <label htmlFor="remember-me" className="text-xs text-[#5A5A62] cursor-pointer font-semibold">
                    Remember me
                  </label>
                </div>

                {/* Primary LOGIN CTA */}
                <button
                  type="submit"
                  className="w-full py-3.5 bg-[#CCFF00] hover:bg-[#BBE600] text-[#0F1400] font-bold rounded border-2 border-[#141416] flex items-center justify-center space-x-2 cursor-pointer shadow-xs hover-lift transition-all min-h-[44px]"
                >
                  <span>LOGIN →</span>
                </button>
              </form>
            )}

            {/* 2. SIGN UP FORM */}
            {mode === 'signup' && (
              <form onSubmit={handleSignUpSubmit} className="space-y-3.5 text-xs">
                
                {/* Full Name */}
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-[#8A8A93] uppercase">FULL NAME</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={signupName}
                      onChange={(e) => setSignupName(e.target.value)}
                      placeholder="Your full name"
                      required
                      className="w-full p-3 pl-9 bg-white rounded border border-[#141416] text-[#141416] focus:outline-none focus:ring-2 focus:ring-[#CCFF00] min-h-[44px]"
                    />
                    <User className="w-4 h-4 text-[#8A8A93] absolute left-3 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-[#8A8A93] uppercase">EMAIL</label>
                  <div className="relative">
                    <input
                      type="email"
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                      placeholder="you@example.com"
                      required
                      className="w-full p-3 pl-9 bg-white rounded border border-[#141416] text-[#141416] focus:outline-none focus:ring-2 focus:ring-[#CCFF00] min-h-[44px]"
                    />
                    <Mail className="w-4 h-4 text-[#8A8A93] absolute left-3 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-[#8A8A93] uppercase">PASSWORD</label>
                  <div className="relative">
                    <input
                      type={showSignupPassword ? 'text' : 'password'}
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                      placeholder="Create a password (min 8 chars)"
                      required
                      className="w-full p-3 pl-9 pr-12 bg-white rounded border border-[#141416] text-[#141416] focus:outline-none focus:ring-2 focus:ring-[#CCFF00] min-h-[44px]"
                    />
                    <Lock className="w-4 h-4 text-[#8A8A93] absolute left-3 top-1/2 -translate-y-1/2" />
                    <button
                      type="button"
                      onClick={() => setShowSignupPassword(!showSignupPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5A5A62] hover:text-[#141416] p-1 cursor-pointer"
                      title={showSignupPassword ? 'Hide password' : 'Show password'}
                    >
                      {showSignupPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-[#8A8A93] uppercase">CONFIRM PASSWORD</label>
                  <div className="relative">
                    <input
                      type={showSignupConfirmPassword ? 'text' : 'password'}
                      value={signupConfirmPassword}
                      onChange={(e) => setSignupConfirmPassword(e.target.value)}
                      placeholder="Repeat your password"
                      required
                      className="w-full p-3 pl-9 pr-12 bg-white rounded border border-[#141416] text-[#141416] focus:outline-none focus:ring-2 focus:ring-[#CCFF00] min-h-[44px]"
                    />
                    <Lock className="w-4 h-4 text-[#8A8A93] absolute left-3 top-1/2 -translate-y-1/2" />
                    <button
                      type="button"
                      onClick={() => setShowSignupConfirmPassword(!showSignupConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5A5A62] hover:text-[#141416] p-1 cursor-pointer"
                      title={showSignupConfirmPassword ? 'Hide password' : 'Show password'}
                    >
                      {showSignupConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Primary CREATE ACCOUNT CTA */}
                <button
                  type="submit"
                  className="w-full py-3.5 bg-[#CCFF00] hover:bg-[#BBE600] text-[#0F1400] font-bold rounded border-2 border-[#141416] flex items-center justify-center space-x-2 cursor-pointer shadow-xs hover-lift transition-all min-h-[44px]"
                >
                  <span>CREATE ACCOUNT →</span>
                </button>
              </form>
            )}

            {/* 3. FORGOT PASSWORD FORM */}
            {mode === 'forgot' && (
              <form onSubmit={handleForgotSubmit} className="space-y-4 text-xs">
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-[#8A8A93] uppercase">EMAIL ADDRESS</label>
                  <div className="relative">
                    <input
                      type="email"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      placeholder="you@example.com"
                      required
                      className="w-full p-3 pl-9 bg-white rounded border border-[#141416] text-[#141416] focus:outline-none focus:ring-2 focus:ring-[#CCFF00] min-h-[44px]"
                    />
                    <Mail className="w-4 h-4 text-[#8A8A93] absolute left-3 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-[#CCFF00] hover:bg-[#BBE600] text-[#0F1400] font-bold rounded border-2 border-[#141416] flex items-center justify-center space-x-2 cursor-pointer shadow-xs hover-lift transition-all min-h-[44px]"
                >
                  <span>SEND RESET LINK →</span>
                </button>

                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={() => switchMode('login')}
                    className="text-xs font-bold text-[#141416] underline hover:text-[#B45309] cursor-pointer"
                  >
                    Back to Login
                  </button>
                </div>
              </form>
            )}

            {/* Social OAuth Buttons (for login and signup modes) */}
            {mode !== 'forgot' && (
              <>
                <div className="relative flex py-1 items-center">
                  <div className="flex-grow border-t border-[#E2DEC9]"></div>
                  <span className="flex-shrink mx-2 text-[10px] font-bold text-[#8A8A93] uppercase">OR CONTINUE WITH</span>
                  <div className="flex-grow border-t border-[#E2DEC9]"></div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <button
                    type="button"
                    onClick={() => handleSocialClick('GitHub')}
                    className="py-2.5 px-3 bg-white hover:bg-[#F8F7F2] text-[#141416] border border-[#141416] rounded font-bold flex items-center justify-center space-x-1.5 cursor-pointer hover-lift min-h-[44px]"
                  >
                    <Github className="w-4 h-4" />
                    <span>GITHUB</span>
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => handleSocialClick('Google')}
                    className="py-2.5 px-3 bg-white hover:bg-[#F8F7F2] text-[#141416] border border-[#141416] rounded font-bold flex items-center justify-center space-x-1.5 cursor-pointer hover-lift min-h-[44px]"
                  >
                    <Chrome className="w-4 h-4" />
                    <span>GOOGLE</span>
                  </button>
                </div>
              </>
            )}

            {/* Mode Switcher Footer Links */}
            <div className="pt-2 text-center text-xs border-t border-[#E2DEC9]">
              {mode === 'login' ? (
                <>
                  <span className="text-[#5A5A62]">Don't have an account? </span>
                  <button
                    onClick={() => switchMode('signup')}
                    className="font-bold text-[#141416] underline hover:text-[#B45309] cursor-pointer"
                  >
                    SIGN UP
                  </button>
                </>
              ) : mode === 'signup' ? (
                <>
                  <span className="text-[#5A5A62]">Already have an account? </span>
                  <button
                    onClick={() => switchMode('login')}
                    className="font-bold text-[#141416] underline hover:text-[#B45309] cursor-pointer"
                  >
                    LOGIN
                  </button>
                </>
              ) : null}
            </div>

            {/* Demo Notice Footer */}
            <div className="text-[10px] text-[#8A8A93] text-center uppercase tracking-wider">
              DEMO MODE · FRONTEND AUTHENTICATION
            </div>
          </>
        )}

      </div>
    </div>
  );
};
