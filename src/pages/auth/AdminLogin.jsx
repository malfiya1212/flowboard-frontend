import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Shield,
  Lock,
  Mail,
  ArrowRight,
  AlertCircle,
  KeyRound,
  Terminal,
  Zap,
  ShieldAlert
} from 'lucide-react';

const MASTER_ADMIN_KEY = 'FB-ADM-9941';

export default function AdminLogin() {
  const [email, setEmail] = useState('malefiya@flowboard.com');
  const [password, setPassword] = useState('admin123');
  const [adminSecurityKey, setAdminSecurityKey] = useState('FB-ADM-9941');
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);

  const navigate = useNavigate();

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    if (isLocked) return;

    setErrorMessage('');
    setLoading(true);

    try {
      // Security Check 1: Validate Clearance Key
      if (adminSecurityKey.trim().toUpperCase() !== MASTER_ADMIN_KEY) {
        throw new Error('Invalid Security Clearance Key. Hardware token mismatch.');
      }

      // Security Check 2: Validate Email domain or admin credentials
      if (!email.endsWith('@flowboard.com') || password.length < 6) {
        throw new Error('Invalid Administrative Credentials.');
      }

      // Successful Admin Authentication
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('flowboard_role', 'Admin');
      localStorage.setItem('token', 'admin-secure-jwt-token-flw-99');
      localStorage.setItem('flowboard_user', JSON.stringify({
        name: 'Malefiya',
        username: 'malefiya',
        email: email.trim(),
        role: 'Admin',
        clearanceLevel: 'SuperAdmin'
      }));

      // Redirect directly to Admin Dashboard
      navigate('/admin');
    } catch (err) {
      const attempts = failedAttempts + 1;
      setFailedAttempts(attempts);

      // Lockout mechanism after 3 failed attempts
      if (attempts >= 3) {
        setIsLocked(true);
        setErrorMessage('Security Alert: Too many failed administrative attempts. Console locked for 30s.');
        setTimeout(() => {
          setIsLocked(false);
          setFailedAttempts(0);
          setErrorMessage('');
        }, 30000);
      } else {
        setErrorMessage(err.message || 'Admin authentication failed.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAutofillAdmin = () => {
    setEmail('malefiya@flowboard.com');
    setPassword('admin123');
    setAdminSecurityKey('FB-ADM-9941');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-950 p-4 relative overflow-hidden font-sans">
      {/* Background Decorative Ambient Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="bg-stone-900 border border-stone-800 rounded-2xl shadow-2xl w-full max-w-md p-8 space-y-6 relative z-10 text-stone-100">
        
        {/* Security Badge Header */}
        <div className="text-center flex flex-col items-center gap-2">
          <div className="w-14 h-14 bg-gradient-to-br from-red-600 to-rose-700 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-red-950/50 mb-1 ring-4 ring-red-950/60">
            <Shield size={28} />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-950/80 border border-red-800/60 text-red-400 rounded-full text-[11px] font-bold tracking-wider uppercase">
            <KeyRound size={12} />
            <span>Administrator Console</span>
          </div>

          <h1 className="text-2xl font-black text-white tracking-tight">Admin System Login</h1>
          <p className="text-xs text-stone-400 max-w-xs">
            Restricted access for System Administrators, User Management, and Workspace Security.
          </p>
        </div>

        {/* Demo Quick Autofill Chip */}
        <div
          onClick={handleAutofillAdmin}
          className="p-3 bg-stone-800/80 border border-stone-700 hover:border-red-500/50 rounded-xl flex items-center justify-between text-xs cursor-pointer transition-colors"
        >
          <div className="flex items-center gap-2">
            <Zap size={14} className="text-amber-400" />
            <span className="text-stone-300 font-medium">Demo: Autofill Master Admin</span>
          </div>
          <span className="text-[10px] font-mono font-bold text-red-400 bg-red-950/60 px-2 py-0.5 rounded border border-red-800/50">
            malefiya@flowboard.com
          </span>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="p-3 bg-red-950/80 border border-red-800/80 rounded-lg text-xs text-red-300 flex items-center gap-2 animate-in fade-in">
            {isLocked ? <ShieldAlert size={16} className="shrink-0 text-red-400" /> : <AlertCircle size={16} className="shrink-0 text-red-400" />}
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Admin Login Form */}
        <form onSubmit={handleAdminLogin} className="space-y-4 text-xs">
          
          {/* Admin Email */}
          <div className="space-y-1.5">
            <label className="font-semibold text-stone-300">Admin Email Address *</label>
            <div className="relative flex items-center">
              <Mail size={16} className="absolute left-3 text-stone-500 pointer-events-none" />
              <input
                type="email"
                required
                disabled={isLocked}
                className="w-full pl-9 pr-3 py-2 bg-stone-950 border border-stone-700 rounded-lg text-sm text-white placeholder-stone-500 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all font-mono disabled:opacity-50"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@flowboard.com"
              />
            </div>
          </div>

          {/* Master Password */}
          <div className="space-y-1.5">
            <label className="font-semibold text-stone-300">Master Password *</label>
            <div className="relative flex items-center">
              <Lock size={16} className="absolute left-3 text-stone-500 pointer-events-none" />
              <input
                type="password"
                required
                disabled={isLocked}
                className="w-full pl-9 pr-3 py-2 bg-stone-950 border border-stone-700 rounded-lg text-sm text-white placeholder-stone-500 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all font-mono disabled:opacity-50"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
              />
            </div>
          </div>

          {/* Security Clearance Key */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="font-semibold text-stone-300">Security Clearance Key *</label>
              <span className="text-[10px] text-stone-500 font-mono">2FA / Hardware token</span>
            </div>
            <div className="relative flex items-center">
              <Terminal size={16} className="absolute left-3 text-stone-500 pointer-events-none" />
              <input
                type="text"
                required
                disabled={isLocked}
                className="w-full pl-9 pr-3 py-2 bg-stone-950 border border-stone-700 rounded-lg text-sm text-amber-300 placeholder-stone-500 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all font-mono disabled:opacity-50"
                value={adminSecurityKey}
                onChange={(e) => setAdminSecurityKey(e.target.value)}
                placeholder="FB-ADM-XXXX"
              />
            </div>
          </div>

          {/* Session Duration Checkbox */}
          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="adminRemember"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 text-red-600 bg-stone-950 border-stone-700 rounded focus:ring-red-500 cursor-pointer"
            />
            <label htmlFor="adminRemember" className="text-xs text-stone-400 cursor-pointer">
              Maintain secure administrative session (30 days)
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || isLocked}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 disabled:opacity-50 text-white py-2.5 rounded-lg font-bold text-sm transition-all cursor-pointer shadow-lg shadow-red-950/50 mt-2"
          >
            <span>{loading ? 'Authenticating Clearance...' : (isLocked ? 'Console Locked' : 'Access Admin Console')}</span>
            <ArrowRight size={16} />
          </button>
        </form>

        {/* Footer Link back to User Login */}
        <div className="text-center text-xs text-stone-400 pt-4 border-t border-stone-800 space-y-1">
          <div>Not a System Administrator?</div>
          <Link
            to="/login"
            className="inline-block text-indigo-400 hover:text-indigo-300 font-bold hover:underline transition-colors"
          >
            ← Return to Standard User / Team Login
          </Link>
        </div>
      </div>
    </div>
  );
}