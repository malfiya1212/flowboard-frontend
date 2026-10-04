import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Kanban,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  Zap,
} from 'lucide-react';

export default function AdminLogin() {
  const navigate = useNavigate();

  // Step state: 'credentials' -> '2fa'
  const [step, setStep] = useState('credentials');

  // Form states
  const [email, setEmail] = useState('malefiya@flowboard.com');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // Step 1: Handle initial email & password submission
  const handleCredentialsSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email.trim() || !password) {
      setErrorMessage('Please provide both admin email and password.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters.');
      return;
    }

    // Move to optional 2FA step
    setStep('2fa');
  };

  // Complete authentication and set storage
  const completeAdminAuth = () => {
    setLoading(true);
    try {
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('flowboard_role', 'Admin');
      localStorage.setItem('token', 'admin-session-token-flw');
      localStorage.setItem(
        'flowboard_user',
        JSON.stringify({
          name: 'Malefiya',
          username: 'malefiya',
          email: email.trim(),
          role: 'Admin',
        })
      );

      navigate('/admin', { replace: true });
    } catch {
      setErrorMessage('Failed to establish admin session.');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Handle 2FA verification
  const handleTwoFactorSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (twoFactorCode && twoFactorCode.trim().length !== 6) {
      setErrorMessage('Verification code must be 6 digits.');
      return;
    }

    completeAdminAuth();
  };

  const handleAutofillAdmin = () => {
    setEmail('malefiya@flowboard.com');
    setPassword('admin123');
    setErrorMessage('');
  };

  return (
    <div className="min-h-screen bg-stone-100/60 flex items-center justify-center p-4 font-sans text-stone-900">
      <div className="w-full max-w-[440px]">
        
        {/* BRAND HEADER */}
        <div className="flex flex-col items-center mb-6 text-center">
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-sm">
              <Kanban size={20} strokeWidth={2.2} />
            </div>
            <div className="text-left">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-xl text-stone-900 tracking-tight leading-none">
                  FlowBoard
                </span>
                <span className="font-mono text-[9px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-1.5 py-0.5 rounded leading-none">
                  ADMIN
                </span>
              </div>
              <span className="text-[10px] text-stone-400 font-medium tracking-wide">
                Management Portal
              </span>
            </div>
          </div>

          <h1 className="text-xl font-bold text-stone-900 tracking-tight">
            {step === 'credentials' ? 'Admin Sign In' : 'Two-Factor Authentication'}
          </h1>
          <p className="text-stone-500 text-xs mt-1 max-w-[320px]">
            {step === 'credentials'
              ? 'Sign in to access workspace policies, role matrices, and audit logs.'
              : 'Enter the 6-digit code from your authenticator app, or skip to proceed.'}
          </p>
        </div>

        {/* MAIN CARD */}
        <div className="bg-white border border-stone-200 rounded-2xl p-7 shadow-sm space-y-4">
          
          {/* Quick Demo Helper (Only on credentials step) */}
          {step === 'credentials' && (
            <button
              type="button"
              onClick={handleAutofillAdmin}
              className="w-full p-2.5 bg-stone-50 hover:bg-stone-100/80 border border-stone-200 rounded-xl flex items-center justify-between text-xs transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2 text-stone-700 font-medium">
                <Zap size={14} className="text-indigo-600" />
                <span>Autofill Admin Credentials</span>
              </div>
              <span className="font-mono text-[10px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-200/60 px-2 py-0.5 rounded">
                malefiya@flowboard.com
              </span>
            </button>
          )}

          {/* Error Alert */}
          {errorMessage && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2.5 text-red-700 text-xs">
              <AlertCircle size={15} className="shrink-0 text-red-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* STEP 1: EMAIL & PASSWORD */}
          {step === 'credentials' ? (
            <form onSubmit={handleCredentialsSubmit} className="space-y-4">
              {/* Admin Email */}
              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold text-stone-600 uppercase tracking-wider">
                  Admin Email *
                </label>
                <div className="relative flex items-center">
                  <Mail size={15} className="absolute left-3 text-stone-400 pointer-events-none" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@flowboard.com"
                    className="w-full h-10 pl-9 pr-3 bg-white border border-stone-200 rounded-lg text-xs text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition-all shadow-xs"
                  />
                </div>
              </div>

              {/* Password with Show/Hide */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-[11px] font-bold text-stone-600 uppercase tracking-wider">
                    Password *
                  </label>
                  <button
                    type="button"
                    onClick={() => alert('Password reset link sent to registered admin email.')}
                    className="text-[11px] text-indigo-600 hover:text-indigo-700 hover:underline font-semibold cursor-pointer"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative flex items-center">
                  <Lock size={15} className="absolute left-3 text-stone-400 pointer-events-none" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full h-10 pl-9 pr-10 bg-white border border-stone-200 rounded-lg text-xs text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition-all shadow-xs"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 text-stone-400 hover:text-stone-600 cursor-pointer"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full h-10 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors flex items-center justify-center gap-2 cursor-pointer mt-1"
              >
                <span>Sign in</span>
                <ArrowRight size={14} />
              </button>
            </form>
          ) : (
            /* STEP 2: OPTIONAL 2FA */
            <form onSubmit={handleTwoFactorSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-[11px] font-bold text-stone-600 uppercase tracking-wider">
                    Authentication Code
                  </label>
                  <span className="text-[10px] text-stone-400 font-mono">Optional</span>
                </div>
                <div className="relative flex items-center">
                  <ShieldCheck size={16} className="absolute left-3 text-stone-400 pointer-events-none" />
                  <input
                    type="text"
                    maxLength={6}
                    value={twoFactorCode}
                    onChange={(e) => setTwoFactorCode(e.target.value.replace(/\D/g, ''))}
                    placeholder="123456"
                    className="w-full h-10 pl-9 pr-3 bg-white border border-stone-200 rounded-lg text-sm font-mono tracking-widest text-stone-900 placeholder:text-stone-300 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition-all shadow-xs"
                  />
                </div>
                <p className="text-[11px] text-stone-400 mt-1">
                  Leave empty if you haven't enabled an authenticator app.
                </p>
              </div>

              {/* Primary: Verify or Continue */}
              <button
                type="submit"
                disabled={loading}
                className="w-full h-10 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-70 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>{loading ? 'Authenticating...' : twoFactorCode ? 'Verify & Sign in' : 'Skip & Sign in'}</span>
                <ArrowRight size={14} />
              </button>

              {/* Back to Password Step */}
              <button
                type="button"
                onClick={() => {
                  setStep('credentials');
                  setErrorMessage('');
                }}
                className="w-full h-9 bg-white border border-stone-200 hover:bg-stone-50 text-stone-600 rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft size={13} />
                <span>Back to password</span>
              </button>
            </form>
          )}
        </div>

        {/* FOOTER */}
        <div className="text-center mt-5">
          <Link
            to="/login"
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 hover:underline inline-flex items-center gap-1"
          >
            ← Back to Standard User Login
          </Link>

          <div className="mt-6 flex justify-center items-center gap-4 text-[10px] font-bold text-stone-400 uppercase tracking-widest">
            <span>Role Schemes</span>
            <span>•</span>
            <span>Workspace Security</span>
            <span>•</span>
            <span>Audit Log</span>
          </div>
        </div>

      </div>
    </div>
  );
}