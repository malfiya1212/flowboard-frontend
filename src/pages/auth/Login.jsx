import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, AlertCircle, Layout } from 'lucide-react';
import { useGoogleLogin } from '@react-oauth/google';
import { useMsal } from '@azure/msal-react';
import axios from 'axios';

// --- REUSABLE INPUT COMPONENT ---
const FormInput = ({ label, name, type, value, onChange, placeholder, isPassword, showPassword, togglePassword }) => (
  <div className="relative animate-in fade-in slide-in-from-top-2 duration-300">
    <label className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider mb-1.5">{label}</label>
    <input 
      type={isPassword && !showPassword ? "password" : (isPassword && showPassword ? "text" : type)} 
      required
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full h-11 px-3 py-2 border-2 border-stone-200 rounded-md outline-none text-stone-900 transition-colors focus:border-indigo-600 hover:bg-stone-50 focus:bg-white"
    />
    {isPassword && (
      <button 
        type="button" onClick={togglePassword}
        className="absolute right-3 top-[28px] p-1 text-stone-400 hover:text-stone-600 transition-colors rounded"
      >
        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    )}
  </div>
);

export default function Login() {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const navigate = useNavigate();
  const { instance: msalInstance } = useMsal();

  // Unified Form State
  const [formData, setFormData] = useState({
    fullName: '', username: '', email: '', password: '', confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  // --- Native Backend Auth ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!isLoginMode && formData.password !== formData.confirmPassword) {
      return setErrorMessage('Passwords do not match. Please re-enter your passwords.');
    }
    if (!isLoginMode && formData.password.length < 6) {
      return setErrorMessage('Password must be at least 6 characters long.');
    }

    setIsLoading(true);
    try {
      console.log("Submitting:", formData);
      navigate('/dashboard');
    } catch (err) {
      setErrorMessage('Authentication failed. Please check your details.');
    } finally {
      setIsLoading(false);
    }
  };

  // --- Google Auth ---
  const loginWithGoogle = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setIsLoading(true);
      try {
        const { data } = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        });
        alert(`Welcome, ${data.name}`);
        navigate('/dashboard'); 
      } catch (error) {
        setErrorMessage("Google authentication failed.");
      } finally {
        setIsLoading(false);
      }
    },
    onError: () => setErrorMessage("Google login failed.")
  });

  // --- Microsoft Auth ---
  const loginWithMicrosoft = async () => {
    setIsLoading(true);
    try {
      const response = await msalInstance.loginPopup({ scopes: ["user.read"] });
      alert(`Welcome, ${response.account.name}`);
      navigate('/dashboard');
    } catch (error) {
      console.error(error);
      setErrorMessage("Microsoft login was cancelled or failed.");
    } finally {
      setIsLoading(false);
    }
  };

  // --- Apple Auth Placeholder ---
  const loginWithApple = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); 
      alert("Apple SSO requires the react-apple-signin-auth package configuration.");
    } catch (error) {
      setErrorMessage("Apple login failed.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <style>{`
        input:-webkit-autofill,
        input:-webkit-autofill:hover, 
        input:-webkit-autofill:focus, 
        input:-webkit-autofill:active {
          -webkit-box-shadow: 0 0 0 1000px rgb(250, 250, 249) inset !important;
          -webkit-text-fill-color: #1c1917 !important;
          transition: background-color 5000s ease-in-out 0s !important;
        }

        .animate-slow-pan { animation: slowPan 35s ease-in-out infinite; }
        @keyframes slowPan {
          0% { transform: scale(1.05) translate(0%, 0%); }
          50% { transform: scale(1.12) translate(-1.5%, -1%); }
          100% { transform: scale(1.05) translate(0%, 0%); }
        }
      `}</style>

      <div className="min-h-screen w-full flex bg-white font-sans text-sm">
        
        {/* --- LEFT SIDE: FlowBoard Branding & Abstract Workflow Image --- */}
        <div className="hidden lg:flex lg:w-[50%] relative bg-stone-900 overflow-hidden">
          <div className="absolute inset-0 bg-indigo-950/40 mix-blend-multiply z-10 pointer-events-none"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#fafaf9] via-stone-900/60 to-stone-900/20 z-20 pointer-events-none"></div>
          
          <img 
            src="https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=2000&auto=format&fit=crop" 
            alt="Abstract Flow Graphic" 
            className="absolute inset-0 w-full h-full object-cover animate-slow-pan z-0"
          />
          
          <div className="absolute bottom-16 left-16 right-16 z-30 text-white">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-indigo-600 p-2.5 rounded-lg shadow-lg relative overflow-hidden">
                <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                <Layout size={28} className="text-white relative z-10" strokeWidth={2.5} />
              </div>
              <h2 className="text-3xl font-bold tracking-tight">FlowBoard</h2>
            </div>
            <h3 className="text-4xl font-extrabold mb-5 leading-tight tracking-tight">
              Master your <br/>engineering workflow.
            </h3>
            <p className="text-stone-300 text-lg max-w-md leading-relaxed mb-8">
              The enterprise-grade project management tool designed to keep your development, networking, and IT teams perfectly aligned.
            </p>
          </div>
        </div>

        {/* --- RIGHT SIDE: Authentication Form --- */}
        <div className="w-full lg:w-[50%] flex flex-col justify-center px-6 sm:px-16 md:px-24 xl:px-32 relative py-12 lg:py-0 overflow-y-auto bg-stone-50/50">
          
          <div className="lg:hidden flex items-center gap-3 mb-10">
            <div className="bg-indigo-600 text-white p-1 rounded-lg shadow-sm">
              <Layout size={22} strokeWidth={2.5} />
            </div>
            <h1 className="text-2xl font-extrabold text-stone-900 tracking-tight">FlowBoard</h1>
          </div>

          <div className="w-full max-w-[420px] mx-auto bg-white p-8 rounded-2xl border border-stone-200 shadow-sm">
            <h2 className="text-3xl font-bold text-stone-900 tracking-tight mb-2">
              {isLoginMode ? 'Welcome back' : 'Create an account'}
            </h2>
            <p className="text-stone-500 mb-8 text-base">
              {isLoginMode ? 'Enter your credentials to access the management portal.' : 'Register to access enterprise network management tools.'}
            </p>

            {errorMessage && (
              <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-700 flex items-start gap-2.5">
                <AlertCircle size={18} className="shrink-0 mt-0.5 text-red-500" /><span>{errorMessage}</span>
              </div>
            )}

            <form className="space-y-4" onSubmit={handleSubmit}>
              
              {!isLoginMode && (
                <div className="space-y-4">
                  <FormInput label="Full Name" name="fullName" type="text" placeholder="John Doe" value={formData.fullName} onChange={handleChange} />
                  <FormInput label="Username" name="username" type="text" placeholder="johndoe" value={formData.username} onChange={handleChange} />
                </div>
              )}

              <FormInput label="Corporate Email" name="email" type="email" placeholder="john.doe@flowboard.com" value={formData.email} onChange={handleChange} />
              
              <FormInput 
                label="Password" name="password" type="password" 
                placeholder={isLoginMode ? "Enter password" : "Create a secure password"} 
                value={formData.password} onChange={handleChange} 
                isPassword showPassword={showPassword} togglePassword={() => setShowPassword(!showPassword)}
              />

              {!isLoginMode && (
                <FormInput 
                  label="Confirm Password" name="confirmPassword" type="password" 
                  placeholder="Re-enter password" value={formData.confirmPassword} onChange={handleChange} 
                  isPassword showPassword={showPassword} togglePassword={() => setShowPassword(!showPassword)}
                />
              )}

              {isLoginMode && (
                <div className="flex items-center justify-between pt-1 pb-1">
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-stone-300 text-indigo-600 focus:ring-indigo-600 cursor-pointer" />
                    <span className="text-sm font-medium text-stone-600 group-hover:text-stone-900 transition-colors">Remember me</span>
                  </label>
                  <a href="#" className="text-sm text-indigo-600 hover:text-indigo-800 hover:underline font-bold transition-colors">Forgot password?</a>
                </div>
              )}

              {/* Fixed: Replaced invalid bg-white-600 with clean indigo branding */}
              <button type="submit" disabled={isLoading} className="w-full h-11 mt-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-md transition-all shadow-sm active:scale-[0.98] disabled:opacity-70 flex items-center justify-center cursor-pointer">
                {isLoading ? <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span> : (isLoginMode ? 'Log in' : 'Create Account')}
              </button>
            </form>

            <div className="flex items-center gap-3 my-7">
              <div className="flex-1 h-px bg-stone-200"></div><span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider">Or continue with SSO</span><div className="flex-1 h-px bg-stone-200"></div>
            </div>

            <div className="space-y-3">
              <button type="button" onClick={loginWithGoogle} disabled={isLoading} className="w-full h-11 flex items-center justify-center gap-2.5 border-2 border-stone-200 hover:bg-stone-50 text-stone-700 font-bold rounded-md transition-all active:scale-[0.98] disabled:opacity-50 cursor-pointer">
                <svg className="w-4 h-4" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" /><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" /><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" /></svg>
                Google
              </button>

              <button type="button" onClick={loginWithMicrosoft} disabled={isLoading} className="w-full h-11 flex items-center justify-center gap-2.5 border-2 border-stone-200 hover:bg-stone-50 text-stone-700 font-bold rounded-md transition-all active:scale-[0.98] disabled:opacity-50 cursor-pointer">
                <svg className="w-5 h-5" viewBox="0 0 21 21"><path fill="#f35325" d="M1 1h9v9H1z"/><path fill="#81bc06" d="M1 11h9v9H1z"/><path fill="#05a6f0" d="M11 1h9v9h-9z"/><path fill="#ffba08" d="M11 11h9v9h-9z"/></svg>
                Microsoft
              </button>

              <button type="button" onClick={loginWithApple} disabled={isLoading} className="w-full h-11 flex items-center justify-center gap-2.5 border-2 border-stone-200 hover:bg-stone-50 text-stone-700 font-bold rounded-md transition-all active:scale-[0.98] disabled:opacity-50 cursor-pointer">
                <svg className="w-[18px] h-[18px]" viewBox="0 0 384 512" fill="currentColor">
                  <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"/>
                </svg>
                Apple
              </button>
            </div>

            <div className="mt-8 text-center bg-stone-50 p-4 rounded-lg border border-stone-100">
              <span className="text-stone-500 font-medium">{isLoginMode ? "Don't have an account? " : "Already have an account? "}</span>
              <button type="button" onClick={() => { setIsLoginMode(!isLoginMode); setErrorMessage(''); }} className="text-indigo-600 hover:text-indigo-800 font-bold transition-colors ml-1 cursor-pointer">
                {isLoginMode ? "Sign up" : "Log in"}
              </button>
            </div>
          </div>
          
          <div className="lg:hidden mt-12 text-center text-xs text-stone-400">© {new Date().getFullYear()} FlowBoard</div>
        </div>
      </div>
    </>
  );
}