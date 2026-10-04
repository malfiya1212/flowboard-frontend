import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Kanban,
  User,
  Mail,
  Lock,
  Briefcase,
  Eye,
  EyeOff,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  RotateCw,
} from 'lucide-react';

const PROFILE_ROLES = [
  'Software Engineer',
  'Product Manager',
  'Frontend Developer',
  'Backend Developer',
  'UI/UX Designer',
  'QA / Test Engineer',
];

export default function Register() {
  const navigate = useNavigate();

  // Step progression: 'register' -> 'verify' -> 'activated'
  const [step, setStep] = useState('register');

  // Form Fields
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    profileRole: 'Software Engineer',
    password: '',
    confirmPassword: '',
  });

  // UI States
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // Verification OTP States (6-digit array)
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [resendTimer, setResendTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const otpInputRefs = useRef([]);

  // Countdown timer for email resend
  useEffect(() => {
    let interval;
    if (step === 'verify' && resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    } else if (resendTimer === 0) {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [step, resendTimer]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    setErrorMessage('');
  };

  // STEP 1: Form Validation & Submit
  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!formData.name.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }

    if (!formData.email.trim() || !formData.email.includes('@')) {
      setErrorMessage('Please enter a valid work email address.');
      return;
    }

    if (formData.password.length < 8) {
      setErrorMessage('Password must be at least 8 characters long.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage('Passwords do not match. Please re-enter.');
      return;
    }

    setLoading(true);

    // Simulate sending activation email with verification token
    setTimeout(() => {
      setLoading(false);
      setStep('verify');
      setResendTimer(30);
      setCanResend(false);
    }, 600);
  };

  // OTP Input Handlers
  const handleOtpChange = (index, value) => {
    if (isNaN(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    // Auto-advance to next box
    if (value && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const handleResendCode = () => {
    if (!canResend) return;
    setOtp(['', '', '', '', '', '']);
    setResendTimer(30);
    setCanResend(false);
    setErrorMessage('');
    otpInputRefs.current[0]?.focus();
  };

  // STEP 2: Verify & Activate Account
  const handleVerifySubmit = (e) => {
    e.preventDefault();
    const verificationCode = otp.join('');

    if (verificationCode.length !== 6) {
      setErrorMessage('Please enter the complete 6-digit activation code.');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      setLoading(false);

      // Persist activated user session into storage
      const newUser = {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        role: formData.profileRole,
        accountStatus: 'Activated',
        joinedAt: new Date().toISOString(),
      };

      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('flowboard_role', 'Member');
      localStorage.setItem('flowboard_user', JSON.stringify(newUser));
      localStorage.setItem('token', `usr-jwt-${Date.now()}`);

      setStep('activated');
    }, 700);
  };

  return (
    <div className="min-h-screen bg-stone-100/60 flex items-center justify-center p-4 font-sans text-stone-900 antialiased">
      <div className="w-full max-w-[480px]">
        
        {/* BRAND HEADER */}
        <div className="flex flex-col items-center mb-6 text-center">
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-sm">
              <Kanban size={20} strokeWidth={2.2} />
            </div>
            <div className="text-left">
              <span className="font-bold text-xl text-stone-900 tracking-tight leading-none block">
                FlowBoard
              </span>
              <span className="text-[10px] text-stone-400 font-medium tracking-wide">
                Agile Project Management
              </span>
            </div>
          </div>

          <h1 className="text-xl font-bold text-stone-900 tracking-tight">
            {step === 'register' && 'Create Your FlowBoard Account'}
            {step === 'verify' && 'Verify Your Email Address'}
            {step === 'activated' && 'Account Activated!'}
          </h1>
          <p className="text-stone-500 text-xs mt-1 max-w-[340px]">
            {step === 'register' && 'Join your team to plan sprints, track backlogs, and deliver work.'}
            {step === 'verify' && `We sent a 6-digit activation code to ${formData.email}`}
            {step === 'activated' && 'Your profile has been verified and your workspace is ready.'}
          </p>
        </div>

        {/* MAIN CONTAINER CARD */}
        <div className="bg-white border border-stone-200 rounded-2xl p-7 shadow-sm space-y-4">
          
          {/* Error Banner */}
          {errorMessage && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-red-700 text-xs">
              <AlertCircle size={15} className="shrink-0 text-red-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* =========================================================================
              PHASE 1: REGISTRATION FORM
             ========================================================================= */}
          {step === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
              
              {/* Full Name */}
              <div className="space-y-1">
                <label className="block text-[11px] font-bold text-stone-600 uppercase tracking-wider">
                  Full Name *
                </label>
                <div className="relative flex items-center">
                  <User size={15} className="absolute left-3 text-stone-400 pointer-events-none" />
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. Malefiya Abebaw"
                    className="w-full h-10 pl-9 pr-3 bg-white border border-stone-200 rounded-lg text-xs text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition-all shadow-xs"
                  />
                </div>
              </div>

              {/* Work Email */}
              <div className="space-y-1">
                <label className="block text-[11px] font-bold text-stone-600 uppercase tracking-wider">
                  Work Email Address *
                </label>
                <div className="relative flex items-center">
                  <Mail size={15} className="absolute left-3 text-stone-400 pointer-events-none" />
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="name@company.com"
                    className="w-full h-10 pl-9 pr-3 bg-white border border-stone-200 rounded-lg text-xs text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition-all shadow-xs"
                  />
                </div>
              </div>

              {/* Profile / Job Role */}
              <div className="space-y-1">
                <label className="block text-[11px] font-bold text-stone-600 uppercase tracking-wider">
                  Profile Role & Specialty *
                </label>
                <div className="relative flex items-center">
                  <Briefcase size={15} className="absolute left-3 text-stone-400 pointer-events-none" />
                  <select
                    name="profileRole"
                    value={formData.profileRole}
                    onChange={handleChange}
                    className="w-full h-10 pl-9 pr-3 bg-white border border-stone-200 rounded-lg text-xs text-stone-900 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition-all shadow-xs cursor-pointer"
                  >
                    {PROFILE_ROLES.map((role) => (
                      <option key={role} value={role}>
                        {role}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1">
                <label className="block text-[11px] font-bold text-stone-600 uppercase tracking-wider">
                  Password *
                </label>
                <div className="relative flex items-center">
                  <Lock size={15} className="absolute left-3 text-stone-400 pointer-events-none" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Minimum 8 characters"
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

              {/* Confirm Password */}
              <div className="space-y-1">
                <label className="block text-[11px] font-bold text-stone-600 uppercase tracking-wider">
                  Confirm Password *
                </label>
                <div className="relative flex items-center">
                  <Lock size={15} className="absolute left-3 text-stone-400 pointer-events-none" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Repeat your password"
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

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full h-10 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-70 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                <span>{loading ? 'Processing...' : 'Register & Verify Email'}</span>
                <ArrowRight size={14} />
              </button>
            </form>
          )}

          {/* =========================================================================
              PHASE 2: EMAIL VERIFICATION (6-DIGIT CODE)
             ========================================================================= */}
          {step === 'verify' && (
            <form onSubmit={handleVerifySubmit} className="space-y-5">
              <div className="text-center space-y-1">
                <span className="text-xs text-stone-600 font-medium">
                  Enter the 6-digit code sent to:
                </span>
                <div className="font-mono text-xs font-bold text-stone-900 bg-stone-50 border border-stone-200 py-1.5 px-3 rounded-lg inline-block">
                  {formData.email}
                </div>
              </div>

              {/* 6 Digit Inputs */}
              <div className="flex justify-center gap-2">
                {otp.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={(el) => (otpInputRefs.current[idx] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(idx, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                    className="w-11 h-12 text-center text-lg font-bold font-mono bg-stone-50 border border-stone-200 rounded-lg text-stone-900 focus:bg-white focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition-all shadow-xs"
                  />
                ))}
              </div>

              {/* Submit Activation */}
              <button
                type="submit"
                disabled={loading}
                className="w-full h-10 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-70 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>{loading ? 'Activating Account...' : 'Verify & Activate Account'}</span>
                <CheckCircle2 size={15} />
              </button>

              {/* Resend Code Options */}
              <div className="flex items-center justify-between text-xs pt-1">
                <button
                  type="button"
                  onClick={() => setStep('register')}
                  className="text-stone-500 hover:text-stone-900 cursor-pointer"
                >
                  Edit Email Address
                </button>

                <button
                  type="button"
                  onClick={handleResendCode}
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
              PHASE 3: ACCOUNT ACTIVATION CONFIRMATION
             ========================================================================= */}
          {step === 'activated' && (
            <div className="py-4 text-center space-y-4">
              <div className="w-12 h-12 bg-indigo-50 border border-indigo-200 text-indigo-600 rounded-full flex items-center justify-center mx-auto shadow-xs">
                <CheckCircle2 size={24} />
              </div>

              <div className="space-y-1">
                <h3 className="text-base font-bold text-stone-900">
                  Welcome to FlowBoard, {formData.name}!
                </h3>
                <p className="text-xs text-stone-500 max-w-xs mx-auto">
                  Your email has been verified and your profile has been provisioned as{' '}
                  <span className="font-semibold text-stone-800">{formData.profileRole}</span>.
                </p>
              </div>

              <button
                type="button"
                onClick={() => navigate('/choose-method', { replace: true })}
                className="w-full h-10 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Continue to Choose Workspace</span>
                <ArrowRight size={14} />
              </button>
            </div>
          )}

        </div>

        {/* FOOTER */}
        {step === 'register' && (
          <div className="text-center mt-5">
            <p className="text-xs text-stone-500">
              Already have an account?{' '}
              <Link
                to="/login"
                className="text-indigo-600 font-semibold hover:text-indigo-700 hover:underline"
              >
                Log In
              </Link>
            </p>

            <div className="mt-6 flex justify-center items-center gap-4 text-[10px] font-bold text-stone-400 uppercase tracking-widest">
              <span>Verified Email</span>
              <span>•</span>
              <span>Encrypted Passwords</span>
              <span>•</span>
              <span>Role Provisioning</span>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}