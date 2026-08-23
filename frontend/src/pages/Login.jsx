import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { API_URL } from '../config';
import { Cloud, Loader2, AlertCircle, Eye, EyeOff, Zap, Shield, CreditCard, Check } from 'lucide-react';
import axios from 'axios';

const DEMO_ACCOUNTS = [
  { label: 'Admin',    email: 'admin@cloud.local',  password: 'password123', badge: 'ADMIN',    color: 'border-violet-500/30 text-violet-400 hover:bg-violet-500/10' },
  { label: 'Customer', email: 'demo@cloud.local',   password: 'password123', badge: 'CUSTOMER', color: 'border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/10' },
];

export default function Login() {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw]     = useState(false);
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);

  const { login }  = useAuth();
  const navigate   = useNavigate();

  const doLogin = async (em, pw) => {
    setError('');
    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/auth/login`, {
        email: em || email,
        password: pw || password,
      });
      const userData = { ...res.data, roles: res.data.roles || ['Customer'] };
      login(userData);
      // Redirect admins to admin panel, customers to dashboard
      navigate(userData.roles.includes('Admin') ? '/admin' : '/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => { e.preventDefault(); doLogin(); };

  const quickFill = (em, pw) => {
    setEmail(em);
    setPassword(pw);
    setError('');
  };

  return (
    <div className="min-h-screen w-full lg:grid lg:grid-cols-2 bg-background selection:bg-indigo-500/30">
      
      {/* ─── Left Column: Branding & Features (Hidden on mobile) ─── */}
      <div className="hidden lg:flex flex-col justify-between p-12 bg-muted/30 relative overflow-hidden border-r border-border">
        {/* Abstract Dark Ambient Glows */}
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[120px] mix-blend-screen animate-pulse duration-10000" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-violet-600/20 rounded-full blur-[150px] mix-blend-screen" />
        
        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-lg shadow-indigo-500/20">
            <Cloud className="w-8 h-8 text-white" />
          </div>
          <span className="text-2xl font-bold tracking-tight text-foreground">VIT Cloud</span>
        </div>

        {/* Hero Text & Features */}
        <div className="relative z-10 max-w-lg mt-12 mb-auto pt-24">
          <h2 className="text-5xl font-extrabold tracking-tight text-foreground mb-6 leading-[1.1]">
            Manage infrastructure with <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400">unprecedented</span> control.
          </h2>
          <p className="text-lg text-muted-foreground mb-10 leading-relaxed">
            Provision, monitor, and scale your applications globally in seconds. VIT Cloud provides a comprehensive suite of cloud computing tools designed for the modern web.
          </p>
          
          <ul className="space-y-5 mb-8">
            {[
              { text: 'Real-time resource provisioning & scaling', icon: Zap, color: 'text-amber-400', bg: 'bg-amber-400/10' },
              { text: 'Granular role-based access control', icon: Shield, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
              { text: 'Automated exact-usage cloud billing', icon: CreditCard, color: 'text-blue-400', bg: 'bg-blue-400/10' },
            ].map((feat, i) => (
              <li key={i} className="flex items-center gap-4 text-foreground font-medium text-base">
                <div className={`p-2 rounded-xl ${feat.bg} ${feat.color} shadow-sm border border-border/50`}>
                  <feat.icon className="w-5 h-5" />
                </div>
                {feat.text}
              </li>
            ))}
          </ul>
        </div>
        

      </div>

      {/* ─── Right Column: Form ─── */}
      <div className="flex items-center justify-center p-6 sm:p-12 relative overflow-hidden bg-background/50">
        
        {/* Very subtle glow behind the form for mobile fallback */}
        <div className="absolute lg:hidden top-1/2 left-1/2 w-[300px] h-[300px] bg-indigo-600/10 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2" />
        
        <div className="w-full max-w-[420px] relative z-10">
          
          {/* Mobile Logo Fallback */}
          <div className="flex lg:hidden flex-col items-center mb-8 text-center">
             <div className="p-3 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-lg shadow-indigo-500/20 mb-4 tracking-tight">
               <Cloud className="w-8 h-8 text-white" />
             </div>
             <h1 className="text-3xl font-extrabold text-foreground mb-1">VIT Cloud</h1>
             <p className="text-muted-foreground text-sm">Sign in to your account</p>
          </div>

          <div className="hidden lg:flex flex-col space-y-1 text-left mb-8">
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Welcome back</h1>
            <p className="text-sm text-muted-foreground">Sign in to your VIT Cloud account to continue.</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="flex items-start gap-2.5 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm p-3 rounded-xl mb-6 shadow-sm shadow-rose-500/5 animate-in fade-in slide-in-from-top-1">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
              {error}
            </div>
          )}

          {/* Glassmorphism Form Card */}
          <div className="bg-card/40 backdrop-blur-2xl border border-border/60 rounded-3xl shadow-2xl p-6 sm:p-8">
            
            {/* Quick-fill demo buttons */}
            <div className="mb-6">
              <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mb-3 px-1">Quick Sign In Demo</p>
              <div className="grid grid-cols-2 gap-3">
                {DEMO_ACCOUNTS.map(a => (
                  <button
                    key={a.label}
                    type="button"
                    onClick={() => quickFill(a.email, a.password)}
                    className={`px-3 py-2.5 rounded-xl border text-xs font-bold transition-all flex items-center justify-between shadow-sm bg-background/50 hover:scale-[1.02] ${a.color}`}
                  >
                    <span>{a.label}</span>
                    <span className="text-[9px] opacity-70 px-1.5 py-0.5 rounded-md bg-white/5">{a.badge}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border/50" />
              </div>
              <div className="relative flex justify-center">
                <span className="px-3 bg-transparent backdrop-blur-md text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">or use email</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-sm font-semibold text-foreground px-1">Email Address</label>
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    className="w-full h-11 px-4 rounded-xl border border-border/50 bg-background/50 hover:bg-background/80 focus:bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all shadow-sm"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between px-1">
                  <label className="block text-sm font-semibold text-foreground">Password</label>
                  <a href="#" className="text-xs font-medium text-indigo-400 hover:text-indigo-300 transition-colors">Forgot?</a>
                </div>
                <div className="relative">
                  <input
                    type={showPw ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    required
                    className="w-full h-11 px-4 pr-11 rounded-xl border border-border/50 bg-background/50 hover:bg-background/80 focus:bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all shadow-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw(p => !p)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1 rounded-md"
                  >
                    {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 mt-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-0.5 active:translate-y-0"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
                {loading ? 'Signing in...' : 'Sign In to VIT Cloud'}
              </button>
            </form>
          </div>

          <p className="text-center text-sm text-muted-foreground mt-8">
            Don't have an account?{' '}
            <Link to="/register" className="text-indigo-400 hover:text-indigo-300 font-bold hover:underline transition-colors">
              Create one free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
