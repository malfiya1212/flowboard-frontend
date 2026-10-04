import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Kanban, AlertCircle } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('john.doe@flowboard.com');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email.trim() || !password) {
      setErrorMessage('Please enter both email and password.');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      setLoading(false);

      // Save user session
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('flowboard_role', 'Member');
      localStorage.setItem(
        'flowboard_user',
        JSON.stringify({
          name: 'John Doe',
          email: email.trim(),
          role: 'Software Developer',
        })
      );
      localStorage.setItem('token', 'flw-usr-token-demo');

      // Navigate into app
      navigate('/choose-method');
    }, 600);
  };

  return (
    <div className="min-h-screen flex bg-stone-50 font-sans text-stone-900 antialiased">
      {/* LEFT BRAND HERO BANNER */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white p-12 flex-col justify-between relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-md">
              <Kanban size={22} strokeWidth={2.4} />
            </div>
            <span className="font-bold text-2xl tracking-tight">FlowBoard</span>
          </div>
        </div>

        <div className="relative z-10 max-w-md space-y-3">
          <h2 className="text-3xl font-black tracking-tight leading-tight">
            Master your engineering workflow.
          </h2>
          <p className="text-xs text-stone-300 leading-relaxed">
            The enterprise-grade project management tool designed to keep your development, networking, and IT teams perfectly aligned.
          </p>
        </div>

        <div className="relative z-10 text-[10px] text-stone-400 font-mono">
          FlowBoard Enterprise v2.4 • Active
        </div>

        {/* Ambient subtle glow background */}
        <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* RIGHT LOGIN FORM */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-[420px] bg-white border border-stone-200/80 rounded-2xl p-8 shadow-xs">
          
          <div className="mb-6">
            <h1 className="text-2xl font-bold tracking-tight text-stone-900">
              Welcome back
            </h1>
            <p className="text-xs text-stone-500 mt-1.5">
              Enter your credentials to access the management portal.
            </p>
          </div>

          {errorMessage && (
            <div className="mb-4 p-2.5 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-xs text-red-700">
              <AlertCircle size={14} className="shrink-0 text-red-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            {/* CORPORATE EMAIL */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider">
                Corporate Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="john.doe@flowboard.com"
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
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
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

            {/* REMEMBER ME & FORGOT PASSWORD */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-3.5 h-3.5 text-indigo-600 border-stone-300 rounded focus:ring-indigo-500 cursor-pointer"
                />
                <span className="text-xs text-stone-600">Remember me</span>
              </label>

              {/* ACTIVE FORGOT PASSWORD BUTTON */}
              <button
                type="button"
                onClick={() => navigate('/forgot-password')}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 hover:underline cursor-pointer"
              >
                Forgot password?
              </button>
            </div>

            {/* LOG IN BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-10 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-70 text-white font-semibold text-xs rounded-lg transition-colors shadow-xs cursor-pointer mt-2"
            >
              {loading ? 'Authenticating...' : 'Log in'}
            </button>
          </form>

          {/* SSO DIVIDER */}
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
          <div className="space-y-2">
            <button
              type="button"
              onClick={() => alert('SSO Google Provider')}
              className="w-full h-10 bg-white hover:bg-stone-50 border border-stone-200 rounded-lg flex items-center justify-center gap-2 text-xs font-semibold text-stone-700 transition-colors shadow-xs cursor-pointer"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <span>Google</span>
            </button>

            <button
              type="button"
              onClick={() => alert('SSO Microsoft Provider')}
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

          {/* SIGN UP LINK */}
          <div className="text-center mt-6">
            <p className="text-xs text-stone-500">
              Don't have an account?{' '}
              <Link
                to="/register"
                className="font-semibold text-indigo-600 hover:text-indigo-700 hover:underline"
              >
                Sign up
              </Link>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}