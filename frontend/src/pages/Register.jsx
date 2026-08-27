import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, Eye, EyeOff, AlertCircle, Loader2, CheckCircle2, ShieldCheck, Server } from 'lucide-react';
import { API_URL } from '../config';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Password strength logic
  const [strength, setStrength] = useState({ length: false, number: false, letter: false });

  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    setStrength({
      length: password.length >= 6,
      number: /\d/.test(password),
      letter: /[a-zA-Z]/.test(password)
    });
  }, [password]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (password !== confirm) { setError('Passwords do not match'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters'); return; }
    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/auth/register`, { name, email, password });
      const userData = { ...res.data, roles: res.data.roles || ['Customer'] };
      login(userData);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getStrengthScore = () => {
    return Object.values(strength).filter(Boolean).length;
  };

  const getStrengthColor = () => {
    const score = getStrengthScore();
    if (score === 0) return 'bg-slate-700';
    if (score === 1) return 'bg-red-500';
    if (score === 2) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 bg-slate-950 overflow-hidden">
      {/* Animated Background Orbs */}
      <motion.div 
        animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute top-[-10%] left-[-10%] w-[80vw] h-[80vw] max-w-[800px] max-h-[800px] bg-indigo-900/40 rounded-full mix-blend-screen filter blur-[100px]"
      />
      <motion.div 
        animate={{ scale: [1, 1.3, 1], rotate: [0, -90, 0], opacity: [0.2, 0.3, 0.2] }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-[-10%] right-[-10%] w-[70vw] h-[70vw] max-w-[600px] max-h-[600px] bg-purple-900/40 rounded-full mix-blend-screen filter blur-[100px]"
      />

      <div className="w-full max-w-xl relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="bg-slate-900/70 backdrop-blur-2xl border border-slate-800/80 rounded-3xl overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.5)]"
        >
          {/* Top Gradient Strip */}
          <div className="h-2 w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
          
          <div className="p-8 sm:p-10">
            <div className="flex justify-center mb-8">
              <Link to="/" className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
                  <Server className="text-white w-7 h-7" />
                </div>
                <span className="text-3xl font-bold text-white tracking-tight">VIT Cloud</span>
              </Link>
            </div>

            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white">Create an Account</h2>
              <p className="text-slate-400 mt-2 text-sm">Join the next generation of cloud infrastructure</p>
            </div>

            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: 'auto' }}
                  exit={{ opacity: 0, y: -10, height: 0 }}
                  className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-xl flex items-start gap-3 mb-6"
                >
                  <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                  <p className="text-sm">{error}</p>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-slate-300 mb-2">Full Name</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                    </div>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="block w-full pl-10 pr-3 py-3 border border-slate-700 rounded-xl bg-slate-950/50 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                      placeholder="John Doe"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-slate-300 mb-2">Email Address</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                    </div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="block w-full pl-10 pr-3 py-3 border border-slate-700 rounded-xl bg-slate-950/50 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                      placeholder="name@company.com"
                    />
                  </div>
                </div>

                <div className="sm:col-span-1">
                  <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="block w-full pl-10 pr-10 py-3 border border-slate-700 rounded-xl bg-slate-950/50 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                      placeholder="••••••••"
                    />
                    <button 
                      type="button" 
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-300"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="sm:col-span-1">
                  <label className="block text-sm font-medium text-slate-300 mb-2">Confirm Password</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <ShieldCheck className="h-5 w-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      value={confirm}
                      onChange={(e) => setConfirm(e.target.value)}
                      required
                      className="block w-full pl-10 pr-3 py-3 border border-slate-700 rounded-xl bg-slate-950/50 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                {/* Password Strength Indicator */}
                <div className="sm:col-span-2 mt-2">
                  <div className="flex gap-2 mb-2">
                    {[1, 2, 3].map((level) => (
                      <div 
                        key={level} 
                        className={`h-1.5 w-full rounded-full transition-colors duration-300 ${
                          getStrengthScore() >= level ? getStrengthColor() : 'bg-slate-700'
                        }`}
                      />
                    ))}
                  </div>
                  <div className="flex gap-4 text-xs text-slate-400">
                    <span className={`flex items-center gap-1 ${strength.length ? 'text-green-400' : ''}`}>
                      <CheckCircle2 className="w-3 h-3" /> 6+ chars
                    </span>
                    <span className={`flex items-center gap-1 ${strength.number ? 'text-green-400' : ''}`}>
                      <CheckCircle2 className="w-3 h-3" /> Number
                    </span>
                    <span className={`flex items-center gap-1 ${strength.letter ? 'text-green-400' : ''}`}>
                      <CheckCircle2 className="w-3 h-3" /> Letter
                    </span>
                  </div>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                disabled={loading}
                type="submit"
                className="w-full flex justify-center items-center gap-2 py-3.5 px-4 border border-transparent rounded-xl shadow-lg shadow-indigo-600/20 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 mt-6"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  'Create Account'
                )}
              </motion.button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-sm text-slate-400">
                Already have an account?{' '}
                <Link to="/login" className="font-medium text-indigo-400 hover:text-indigo-300 transition-colors">
                  Sign in here
                </Link>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;
