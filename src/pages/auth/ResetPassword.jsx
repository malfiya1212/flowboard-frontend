import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Kanban, Lock, Eye, EyeOff, ArrowRight, AlertCircle, CheckCircle2, Check, X } from 'lucide-react';

// --- INLINE VALIDATOR ---
const validatePassword = (password) => {
  const rules = {
    minLength: password.length >= 8,
    hasUppercase: /[A-Z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecial: /[^A-Za-z0-9]/.test(password),
  };

  const passedCount = Object.values(rules).filter(Boolean).length;
  let strength = 'Weak';
  if (passedCount >= 4) strength = 'Strong';
  else if (passedCount >= 2) strength = 'Medium';

  return {
    rules,
    strength,
    isValid: rules.minLength && rules.hasNumber && (rules.hasUppercase || rules.hasSpecial),
  };
};

// --- INLINE STRENGTH METER ---
function PasswordStrengthMeter({ password }) {
  if (!password) return null;
  const { rules, strength } = validatePassword(password);

  const criteria = [
    { label: 'At least 8 characters', met: rules.minLength },
    { label: 'One uppercase letter', met: rules.hasUppercase },
    { label: 'One number', met: rules.hasNumber },
    { label: 'One special character', met: rules.hasSpecial },
  ];

  const activeBars = strength === 'Strong' ? 3 : strength === 'Medium' ? 2 : 1;

  return (
    <div className="space-y-2 pt-1">
      <div className="flex justify-between items-center text-[10px] font-bold text-stone-500 uppercase tracking-wider">
        <span>Password Strength</span>
        <span className="text-stone-800">{strength}</span>
      </div>
      <div className="grid grid-cols-3 gap-1.5 h-1.5">
        <div className={`rounded-full transition-all ${activeBars >= 1 ? 'bg-stone-400' : 'bg-stone-200'}`} />
        <div className={`rounded-full transition-all ${activeBars >= 2 ? 'bg-indigo-400' : 'bg-stone-200'}`} />
        <div className={`rounded-full transition-all ${activeBars >= 3 ? 'bg-indigo-600' : 'bg-stone-200'}`} />
      </div>

      <div className="grid grid-cols-2 gap-1 text-[11px] text-stone-500 pt-1">
        {criteria.map((item, idx) => (
          <div key={idx} className="flex items-center gap-1.5">
            {item.met ? (
              <Check size={12} className="text-indigo-600 shrink-0" strokeWidth={3} />
            ) : (
              <X size={12} className="text-stone-300 shrink-0" strokeWidth={2} />
            )}
            <span className={item.met ? 'text-stone-800 font-medium' : 'text-stone-400'}>
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// --- MAIN RESET PASSWORD PAGE ---
export default function ResetPassword() {
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    const { isValid } = validatePassword(password);
    if (!isValid) {
      setError('Password does not satisfy the security requirements.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setIsSuccess(true);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-stone-50/50 flex items-center justify-center p-4 font-sans text-stone-900 antialiased">
      <div className="w-full max-w-[420px] bg-white border border-stone-200/80 rounded-2xl p-8 shadow-xs">
        {/* Brand Header */}
        <div className="flex items-center gap-2.5 mb-6">
          <div className="w-9 h-9 bg-indigo-600 rounded-lg flex items-center justify-center text-white shadow-xs">
            <Kanban size={18} strokeWidth={2.4} />
          </div>
          <div>
            <span className="font-bold text-lg text-stone-900 tracking-tight leading-none block">
              FlowBoard
            </span>
            <span className="text-[10px] text-stone-400 font-medium tracking-wide">
              Security Clearance
            </span>
          </div>
        </div>

        {!isSuccess ? (
          <div>
            <div className="mb-6">
              <h1 className="text-xl font-bold tracking-tight text-stone-900">
                Set new password
              </h1>
              <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                Must be at least 8 characters and include numbers and special characters.
              </p>
            </div>

            {error && (
              <div className="mb-4 p-2.5 bg-stone-50 border border-stone-200 rounded-lg flex items-center gap-2 text-xs text-stone-700">
                <AlertCircle size={14} className="text-stone-900 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* New Password */}
              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider">
                  New Password
                </label>
                <div className="relative flex items-center">
                  <Lock size={15} className="absolute left-3 text-stone-400 pointer-events-none" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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

                <PasswordStrengthMeter password={password} />
              </div>

              {/* Confirm Password */}
              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider">
                  Confirm New Password
                </label>
                <div className="relative flex items-center">
                  <Lock size={15} className="absolute left-3 text-stone-400 pointer-events-none" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    placeholder="Re-enter new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full h-10 pl-9 pr-10 bg-white border border-stone-200 rounded-lg text-xs text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition-all shadow-xs"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 text-stone-400 hover:text-stone-600 cursor-pointer"
                    aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                  >
                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full h-10 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-70 text-white font-semibold text-xs rounded-lg transition-colors shadow-xs flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                <span>{loading ? 'Updating Password...' : 'Reset Password'}</span>
                <ArrowRight size={14} />
              </button>
            </form>
          </div>
        ) : (
          <div className="text-center py-2 space-y-4">
            <div className="w-12 h-12 bg-indigo-50 border border-indigo-200 text-indigo-600 rounded-full flex items-center justify-center mx-auto shadow-xs">
              <CheckCircle2 size={24} />
            </div>

            <div className="space-y-1">
              <h2 className="text-lg font-bold text-stone-900">Password reset complete</h2>
              <p className="text-xs text-stone-500 max-w-xs mx-auto">
                Your credentials have been securely updated. You can now access your workspaces.
              </p>
            </div>

            <button
              type="button"
              onClick={() => navigate('/login', { replace: true })}
              className="w-full h-10 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs mt-2"
            >
              <span>Proceed to Sign In</span>
              <ArrowRight size={14} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}