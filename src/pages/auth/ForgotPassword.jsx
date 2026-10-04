import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Kanban, Mail, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim() || !emailRegex.test(email.trim())) {
      setError('Please enter a valid corporate email address (e.g., name@flowboard.com).');
      return;
    }

    setLoading(true);

    // Simulate sending recovery token & activating reset flow
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);

      // Automatically transition to Reset Password after 2.5 seconds
      setTimeout(() => {
        navigate('/reset-password', { state: { email: email.trim() } });
      }, 2500);
    }, 600);
  };

  const handleManualProceed = () => {
    navigate('/reset-password', { state: { email: email.trim() } });
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
              Account Recovery
            </span>
          </div>
        </div>

        {!submitted ? (
          <div>
            <div className="mb-6">
              <h1 className="text-xl font-bold tracking-tight text-stone-900">
                Forgot your password?
              </h1>
              <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                Enter your verified email address to activate your password reset session.
              </p>
            </div>

            {error && (
              <div className="mb-4 p-2.5 bg-stone-50 border border-stone-200 rounded-lg flex items-center gap-2 text-xs text-stone-800">
                <AlertCircle size={14} className="text-stone-900 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider">
                  Corporate Email Address *
                </label>
                <div className="relative flex items-center">
                  <Mail size={15} className="absolute left-3 text-stone-400 pointer-events-none" />
                  <input
                    type="email"
                    required
                    placeholder="john.doe@flowboard.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setError('');
                    }}
                    className="w-full h-10 pl-9 pr-3 bg-white border border-stone-200 rounded-lg text-xs text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition-all shadow-xs"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full h-10 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-70 text-white font-semibold text-xs rounded-lg transition-colors shadow-xs flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                <span>{loading ? 'Verifying email...' : 'Send Reset Link & Proceed'}</span>
                <ArrowRight size={14} />
              </button>
            </form>
          </div>
        ) : (
          /* Active Recovery Confirmation */
          <div className="text-center py-2 space-y-4">
            <div className="w-12 h-12 bg-indigo-50 border border-indigo-200 text-indigo-600 rounded-full flex items-center justify-center mx-auto shadow-xs">
              <CheckCircle2 size={24} />
            </div>

            <div className="space-y-1">
              <h2 className="text-lg font-bold text-stone-900">Email Verified</h2>
              <p className="text-xs text-stone-500 leading-relaxed max-w-xs mx-auto">
                Reset authorization token generated for{' '}
                <span className="font-semibold text-stone-800">{email}</span>.
              </p>
              <p className="text-[11px] text-stone-400 pt-1">
                Redirecting to reset screen in a moment...
              </p>
            </div>

            <button
              type="button"
              onClick={handleManualProceed}
              className="w-full h-10 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs mt-3"
            >
              <span>Continue to Reset Password Now</span>
              <ArrowRight size={14} />
            </button>
          </div>
        )}

        <div className="text-center mt-6 pt-4 border-t border-stone-100">
          <Link
            to="/login"
            className="text-xs font-semibold text-stone-500 hover:text-stone-900 transition-colors"
          >
            ← Back to Sign In
          </Link>
        </div>

      </div>
    </div>
  );
}