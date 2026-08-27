import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { API_URL } from '../config';
import { Cloud, Lock, Mail, Loader2, AlertCircle, ArrowRight, Server, Shield, Activity, ChevronRight } from 'lucide-react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/auth/login`, { email, password });
      const userData = { ...res.data, roles: res.data.roles || ['Customer'] };
      login(userData);
      navigate(userData.roles.includes('Admin') ? '/admin' : '/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const quickFill = (e, p) => { setEmail(e); setPassword(p); };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left side - Dark/Brand side */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-indigo-950 overflow-hidden flex-col justify-between p-12">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/40 via-transparent to-transparent"></div>
        <div className="absolute -bottom-48 -right-48 w-96 h-96 bg-indigo-500 rounded-full blur-[100px] opacity-30"></div>
        <div className="absolute -top-48 -left-48 w-96 h-96 bg-cyan-500 rounded-full blur-[120px] opacity-20"></div>

        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="relative z-10 flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
          <div className="bg-indigo-500 p-2 rounded-xl">
            <Cloud className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold tracking-tight text-white">VIT Cloud</span>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3, duration: 0.7 }} className="relative z-10 max-w-md">
          <h1 className="text-4xl font-extrabold text-white mb-4 leading-tight">Secure Cloud Management Infrastructure</h1>
          <p className="text-indigo-200 text-lg mb-8 leading-relaxed">
            Provision scalable compute resources, monitor high-fidelity telemetry, and manage RBAC policies from a unified dashboard.
          </p>
          <div className="space-y-4">
            {[
              { text: "Enterprise-grade VM provisioning", icon: Server },
              { text: "Automated real-time cost tracking", icon: Activity },
              { text: "Zero-trust security architecture", icon: Shield }
            ].map((item, i) => (
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 + (i * 0.1) }} key={i} className="flex items-center gap-3 text-indigo-100 bg-indigo-900/50 p-3 rounded-xl border border-indigo-700/50 backdrop-blur-sm">
                <item.icon className="w-5 h-5 text-indigo-400" />
                <span className="font-medium">{item.text}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
        
        <div className="relative z-10 text-indigo-400 text-sm font-medium flex items-center gap-2">
          <Activity className="w-4 h-4 animate-pulse" /> Systems Operational
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex-1 flex flex-col justify-center items-center p-8 sm:p-12 lg:p-24 relative overflow-hidden">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }} className="w-full max-w-md relative z-10">
          
          <div className="lg:hidden flex items-center justify-center gap-2 mb-10">
            <div className="bg-indigo-600 p-2 rounded-xl">
              <Cloud className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-foreground">VIT Cloud</span>
          </div>

          <div className="text-center lg:text-left mb-8">
            <h2 className="text-3xl font-extrabold text-foreground mb-2 tracking-tight">Welcome back</h2>
            <p className="text-muted-foreground">Please enter your details to sign in.</p>
          </div>

          {error && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-2 bg-rose-500/10 border border-rose-500/20 text-rose-500 text-sm p-4 rounded-xl mb-6 shadow-sm">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <p>{error}</p>
            </motion.div>
          )}

          {/* Quick Demo Login */}
          <div className="mb-6 grid grid-cols-2 gap-3">
            <button onClick={() => quickFill('admin@cloud.local', 'password123')} type="button" className="group flex items-center justify-between p-3 rounded-xl border border-border bg-card hover:border-indigo-500/50 transition-all shadow-sm">
              <div className="text-left">
                <p className="text-xs font-bold text-foreground">Admin Demo</p>
                <p className="text-[10px] text-muted-foreground">Full access</p>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-indigo-500 group-hover:translate-x-0.5 transition-all" />
            </button>
            <button onClick={() => quickFill('demo@cloud.local', 'password123')} type="button" className="group flex items-center justify-between p-3 rounded-xl border border-border bg-card hover:border-indigo-500/50 transition-all shadow-sm">
              <div className="text-left">
                <p className="text-xs font-bold text-foreground">Customer Demo</p>
                <p className="text-[10px] text-muted-foreground">Standard</p>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-indigo-500 group-hover:translate-x-0.5 transition-all" />
            </button>
          </div>

          <div className="relative mb-8">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border"></div></div>
            <div className="relative flex justify-center"><span className="px-4 text-xs font-medium text-muted-foreground bg-background uppercase tracking-wider">or sign in with email</span></div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-card border border-border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all placeholder:text-muted-foreground/60 text-foreground shadow-sm"
                  placeholder="name@company.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-semibold text-foreground">Password</label>
                <a href="#" className="text-xs font-medium text-indigo-500 hover:text-indigo-600 transition-colors">Forgot password?</a>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-card border border-border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all placeholder:text-muted-foreground/60 text-foreground shadow-sm"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/25 transition-all flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed mt-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Authenticating...
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-muted-foreground">
            Don't have an account?{' '}
            <Link to="/register" className="font-semibold text-indigo-500 hover:text-indigo-600 transition-colors">
              Create an account
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
