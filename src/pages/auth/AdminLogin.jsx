import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
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
} from 'lucide-react';
import { authService } from '../../services/authService';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [step, setStep] = useState('credentials'); // 'credentials' | '2fa'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [errorMessage, setErrorMessage] = useState(
    searchParams.get('session_expired') ? 'Your administrative session has expired. Please log in again.' : ''
  );
  const [loading, setLoading] = useState(false);

  // Authenticate credentials against backend
  const handleCredentialsSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email.trim() || !password) {
      setErrorMessage('Please provide both admin email and password.');
      return;
    }

    setLoading(true);

    try {
      const data = await authService.adminLogin({
        email: email.trim(),
        password,
      });

      // If backend reports 2FA is required for this account
      if (data.requiresTwoFactor) {
        setStep('2fa');
      } else {
        finalizeSession(data);
      }
    } catch (err) {
      setErrorMessage(
        err.response?.data?.message || 'Authentication failed. Invalid admin credentials or unauthorized account.'
      );
    } finally {
      setLoading(false);
    }
  };

  // Submit optional or required 2FA verification
  const handleTwoFactorSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);

    try {
      const data = await authService.adminLogin({
        email: email.trim(),
        password,
        twoFactorCode: twoFactorCode.trim(),
      });

      finalizeSession(data);
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'Invalid two-factor authentication code.');
    } finally {
      setLoading(false);
    }
  };

  const finalizeSession = (authData) => {
    // Enforce administrative role verification from server response
    if (authData.user?.role !== 'Admin' && authData.role !== 'Admin') {
      setErrorMessage('Access denied. Your account does not have System Administrator clearance.');
      return;
    }

    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('flowboard_role', 'Admin');
    localStorage.setItem('flowboard_access_token', authData.accessToken);
    localStorage.setItem('flowboard_refresh_token', authData.refreshToken);
    localStorage.setItem('flowboard_user', JSON.stringify(authData.user));

    navigate('/admin', { replace: true });
  };

  return (
    <div className="min-h-screen bg-stone-100/60 flex items-center justify-center p-4 font-sans text-stone-900 antialiased">
      <div className="w-full max-w-[440px]">
        {/* Header */}
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
              ? 'Authenticate to access workspace security, role matrices, and audit logs.'
              : 'Enter the 6-digit TOTP clearance code from your authenticator device.'}
          </p>
        </div>

        {/* Card */}
        <div className="bg-white border border-stone-200 rounded-2xl p-7 shadow-sm space-y-4">
          {errorMessage && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2.5 text-red-700 text-xs">
              <AlertCircle size={15} className="shrink-0 text-red-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          {step === 'credentials' ? (
            <form onSubmit={handleCredentialsSubmit} className="space-y-4">
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

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-[11px] font-bold text-stone-600 uppercase tracking-wider">
                    Password *
                  </label>
                  <Link
                    to="/forgot-password"
                    className="text-[11px] text-indigo-600 hover:text-indigo-700 hover:underline font-semibold"
                  >
                    Forgot password?
                  </Link>
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
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full h-10 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-70 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors flex items-center justify-center gap-2 cursor-pointer mt-1"
              >
                <span>{loading ? 'Authenticating with server...' : 'Sign in'}</span>
                <ArrowRight size={14} />
              </button>
            </form>
          ) : (
            <form onSubmit={handleTwoFactorSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold text-stone-600 uppercase tracking-wider">
                  2FA Verification Code
                </label>
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
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full h-10 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-70 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>{loading ? 'Validating Token...' : 'Verify & Enter Console'}</span>
                <ArrowRight size={14} />
              </button>

              <button
                type="button"
                onClick={() => setStep('credentials')}
                className="w-full h-9 bg-white border border-stone-200 hover:bg-stone-50 text-stone-600 rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft size={13} />
                <span>Back to credentials</span>
              </button>
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-5">
          <Link
            to="/login"
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 hover:underline inline-flex items-center gap-1"
          >
            ← Back to Standard User Login
          </Link>
        </div>
      </div>
    </div>
  );
}
