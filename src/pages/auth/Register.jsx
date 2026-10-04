import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  RotateCw,
  ArrowRight,
} from 'lucide-react';

export default function Register() {
  const navigate = useNavigate();

  // Multi-step flow: 'register' -> 'verify' -> 'activated'
  const [step, setStep] = useState('register');

  // Registration Form State matching your UI layout
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  // UI state toggles
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // Email Verification (6-Digit OTP) State
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [resendTimer, setResendTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const otpRefs = useRef([]);

  // Resend OTP countdown
  useEffect(() => {
    let timer;
    if (step === 'verify' && resendTimer > 0) {
      timer = setInterval(() => setResendTimer((prev) => prev - 1), 1000);
    } else if (resendTimer === 0) {
      setCanResend(true);
    }
    return () => clearInterval(timer);
  }, [step, resendTimer]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    setErrorMessage('');
  };

  // 1. Submit Registration Form
  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!formData.fullName.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }

    if (!formData.username.trim()) {
      setErrorMessage('Please choose a username.');
      return;
    }

    if (!formData.email.trim() || !formData.email.includes('@')) {
      setErrorMessage('Please enter a valid corporate email.');
      return;
    }

    if (formData.password.length < 8) {
      setErrorMessage('Password must be at least 8 characters long.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    setLoading(true);

    // Advance to Email Verification step
    setTimeout(() => {
      setLoading(false);
      setStep('verify');
      setResendTimer(30);
      setCanResend(false);
    }, 500);
  };

  // 2. OTP Input Handler
  const handleOtpChange = (index, value) => {
    if (isNaN(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleResendOtp = () => {
    if (!canResend) return;
    setOtp(['', '', '', '', '', '']);
    setResendTimer(30);
    setCanResend(false);
    setErrorMessage('');
    otpRefs.current[0]?.focus();
  };

  // 3. Verify Code and Activate Account
  const handleVerifySubmit = (e) => {
    e.preventDefault();
    const code = otp.join('');

    if (code.length !== 6) {
      setErrorMessage('Please enter all 6 digits of your activation code.');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      setLoading(false);

      // Persist activated user into localStorage
      const user = {
        name: formData.fullName.trim(),
        username: formData.username.trim().toLowerCase(),
        email: formData.email.trim().toLowerCase(),
        role: 'Software Developer',
        status: 'Active',
      };

      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('flowboard_role', 'Member');
      localStorage.setItem('flowboard_user', JSON.stringify(user));
      localStorage.setItem('token', `usr-token-${Date.now()}`);

      setStep('activated');
    }, 600);
  };

  return (
    <div className="min-h-screen bg-stone-50/50 flex items-center justify-center p-4 font-sans text-stone-900 antialiased">
      <div className="w-full max-w-[420px] bg-white border border-stone-200/80 rounded-2xl p-8 shadow-xs">
        
        {/* =========================================================================
            STEP 1: REGISTRATION FORM (Matches your exact UI layout)
           ========================================================================= */}
        {step === 'register' && (
          <div>
            {/* Header */}
            <div className="mb-6">
              <h1 className="text-2xl font-bold tracking-tight text-stone-900">
                Create an account
              </h1>
              <p className="text-xs text-stone-500 mt-1.5 leading-relaxed">
                Register to access enterprise project management tools.
              </p>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="mb-4 p-2.5 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-xs text-red-700">
                <AlertCircle size={14} className="shrink-0 text-red-600" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              {/* FULL NAME */}
              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider">
                  Full Name
                </label>
                <input
                  type="text"
                  name="fullName"
                  required
                  placeholder="John Doe"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full h-10 px-3 bg-white border border-stone-200 rounded-lg text-xs text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition-all shadow-xs"
                />
              </div>

              {/* USERNAME */}
              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider">
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  required
                  placeholder="johndoe"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full h-10 px-3 bg-white border border-stone-200 rounded-lg text-xs text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition-all shadow-xs"
                />
              </div>

              {/* CORPORATE EMAIL */}
              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider">
                  Corporate Email
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="john.doe@flowboard.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full h-10 px-3 bg-white border border-stone-200 rounded-lg text-xs text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition-all shadow-xs"
                />
              </div>

              {/* PASSWORD */}
              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider">
                  Password
                </label>
                <div className="relative flex items-center">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    required
                    placeholder="••••••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full h-10 pl-3 pr-10 bg-white border border-stone-200 rounded-lg text-xs text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition-all shadow-xs"
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

              {/* CONFIRM PASSWORD */}
              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider">
                  Confirm Password
                </label>
                <div className="relative flex items-center">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    required
                    placeholder="Re-enter password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full h-10 pl-3 pr-10 bg-white border border-stone-200 rounded-lg text-xs text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition-all shadow-xs"
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

              {/* CREATE ACCOUNT BUTTON */}
              <button
                type="submit"
                disabled={loading}
                className="w-full h-10 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-70 text-white font-semibold text-xs rounded-lg transition-colors shadow-xs cursor-pointer mt-2"
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </button>
            </form>

            {/* OR CONTINUE WITH SSO DIVIDER */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-stone-200" />
              </div>
              <div className="relative flex justify-center text-[10px] font-bold uppercase tracking-wider">
                <span className="bg-white px-3 text-stone-400">
                  Or continue with SSO
                </span>
              </div>
            </div>

            {/* SSO BUTTONS */}
            <div className="space-y-2.5">
              {/* Google */}
              <button
                type="button"
                onClick={() => alert('Redirecting to Google Enterprise OAuth...')}
                className="w-full h-10 bg-white hover:bg-stone-50 border border-stone-200 rounded-lg flex items-center justify-center gap-2 text-xs font-semibold text-stone-700 transition-colors shadow-xs cursor-pointer"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Google</span>
              </button>

              {/* Microsoft */}
              <button
                type="button"
                onClick={() => alert('Redirecting to Microsoft Azure AD...')}
                className="w-full h-10 bg-white hover:bg-stone-50 border border-stone-200 rounded-lg flex items-center justify-center gap-2 text-xs font-semibold text-stone-700 transition-colors shadow-xs cursor-pointer"
              >
                <svg className="w-4 h-4" viewBox="0 0 23 23">
                  <path fill="#f35325" d="M1 1h10v10H1z" />
                  <path fill="#81bc06" d="M12 1h10v10H12z" />
                  <path fill="#05a6f0" d="M1 12h10v10H1z" />
                  <path fill="#ffba08" d="M12 12h10v10H12z" />
                </svg>
                <span>Microsoft</span>
              </button>
            </div>

            {/* Login Link */}
            <div className="text-center mt-6">
              <p className="text-xs text-stone-500">
                Already registered?{' '}
                <Link
                  to="/login"
                  className="font-semibold text-indigo-600 hover:text-indigo-700 hover:underline"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        )}

        {/* =========================================================================
            STEP 2: EMAIL VERIFICATION (OTP Verification)
           ========================================================================= */}
        {step === 'verify' && (
          <form onSubmit={handleVerifySubmit} className="space-y-5">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-stone-900">
                Verify your email
              </h2>
              <p className="text-xs text-stone-500 mt-1">
                Enter the 6-digit code sent to:
              </p>
              <div className="font-mono text-xs font-bold text-stone-800 bg-stone-50 border border-stone-200/80 px-2.5 py-1 rounded-md inline-block mt-1.5">
                {formData.email}
              </div>
            </div>

            {errorMessage && (
              <div className="p-2.5 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-xs text-red-700">
                <AlertCircle size={14} className="shrink-0 text-red-600" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* 6 Digit Inputs */}
            <div className="flex justify-between gap-1.5">
              {otp.map((val, idx) => (
                <input
                  key={idx}
                  ref={(el) => (otpRefs.current[idx] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={val}
                  onChange={(e) => handleOtpChange(idx, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                  className="w-11 h-12 text-center text-lg font-bold font-mono bg-white border border-stone-200 rounded-lg text-stone-900 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition-all shadow-xs"
                />
              ))}
            </div>

            {/* Verify & Activate Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-10 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-70 text-white font-semibold text-xs rounded-lg transition-colors shadow-xs cursor-pointer"
            >
              {loading ? 'Activating Account...' : 'Verify & Activate Account'}
            </button>

            {/* Resend actions */}
            <div className="flex items-center justify-between text-xs pt-1">
              <button
                type="button"
                onClick={() => setStep('register')}
                className="text-stone-500 hover:text-stone-800 cursor-pointer"
              >
                ← Back
              </button>

              <button
                type="button"
                onClick={handleResendOtp}
                disabled={!canResend}
                className={`flex items-center gap-1.5 font-semibold cursor-pointer ${
                  canResend
                    ? 'text-indigo-600 hover:underline'
                    : 'text-stone-400 cursor-not-allowed'
                }`}
              >
                <RotateCw size={12} className={!canResend ? 'animate-spin' : ''} />
                <span>{canResend ? 'Resend Code' : `Resend in ${resendTimer}s`}</span>
              </button>
            </div>
          </form>
        )}

        {/* =========================================================================
            STEP 3: ACCOUNT ACTIVATED CONFIRMATION
           ========================================================================= */}
        {step === 'activated' && (
          <div className="text-center space-y-4 py-2">
            <div className="w-12 h-12 bg-indigo-50 border border-indigo-200 text-indigo-600 rounded-full flex items-center justify-center mx-auto shadow-xs">
              <CheckCircle2 size={24} />
            </div>

            <div className="space-y-1">
              <h2 className="text-lg font-bold text-stone-900">
                Account successfully activated!
              </h2>
              <p className="text-xs text-stone-500 max-w-xs mx-auto">
                Welcome, <span className="font-semibold text-stone-800">{formData.fullName}</span> (@{formData.username}). Your corporate email is verified.
              </p>
            </div>

            <button
              type="button"
              onClick={() => navigate('/choose-method', { replace: true })}
              className="w-full h-10 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs mt-2"
            >
              <span>Continue to Workspaces</span>
              <ArrowRight size={14} />
            </button>
          </div>
        )}

      </div>
    </div>
  );
}