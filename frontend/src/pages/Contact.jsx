import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, User, ArrowLeft, Cloud } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Contact() {
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-50 flex items-center justify-center p-6 relative overflow-hidden selection:bg-indigo-500/30">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-soft-light"></div>
        <motion.div
          animate={{ scale: [1, 1.2, 1], x: [0, 50, 0], y: [0, 30, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute -top-1/4 -left-1/4 w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[120px]"
        />
        <motion.div
          animate={{ scale: [1, 1.5, 1], x: [0, -50, 0], y: [0, 50, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-1/4 -right-1/4 w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-[150px]"
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-lg"
      >
        <Link to="/" className="inline-flex items-center gap-2 text-neutral-400 hover:text-white transition-colors mb-8 group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </Link>

        <div className="bg-neutral-900/50 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-indigo-500 flex items-center justify-center">
              <Cloud className="w-7 h-7 text-white" />
            </div>
            <h2 className="text-3xl font-bold tracking-tight">Talk to Sales</h2>
          </div>

          <p className="text-neutral-400 mb-8 leading-relaxed">
            Interested in scaling your infrastructure with VIT Cloud? Contact our sales executive directly for a tailored enterprise plan.
          </p>

          <div className="space-y-6">
            <motion.div whileHover={{ x: 5 }} className="flex items-center gap-4 group">
              <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-indigo-500/20 group-hover:text-indigo-400 group-hover:border-indigo-500/30 transition-all">
                <User className="w-5 h-5 text-neutral-400 group-hover:text-indigo-400 transition-colors" />
              </div>
              <div>
                <p className="text-sm text-neutral-500 font-medium mb-0.5">Sales Executive</p>
                <p className="text-lg font-semibold text-white">Sai Pranith Reddy Vaka</p>
              </div>
            </motion.div>

            <motion.a 
              href="mailto:saipranithreddyvaka@gmail.com"
              whileHover={{ x: 5 }} 
              className="flex items-center gap-4 group cursor-pointer"
            >
              <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-purple-500/20 group-hover:text-purple-400 group-hover:border-purple-500/30 transition-all">
                <Mail className="w-5 h-5 text-neutral-400 group-hover:text-purple-400 transition-colors" />
              </div>
              <div>
                <p className="text-sm text-neutral-500 font-medium mb-0.5">Email Address</p>
                <p className="text-lg font-semibold text-white group-hover:text-purple-400 transition-colors">saipranithreddyvaka@gmail.com</p>
              </div>
            </motion.a>

            <motion.a 
              href="tel:+918498970129"
              whileHover={{ x: 5 }} 
              className="flex items-center gap-4 group cursor-pointer"
            >
              <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-emerald-500/20 group-hover:text-emerald-400 group-hover:border-emerald-500/30 transition-all">
                <Phone className="w-5 h-5 text-neutral-400 group-hover:text-emerald-400 transition-colors" />
              </div>
              <div>
                <p className="text-sm text-neutral-500 font-medium mb-0.5">Phone Number</p>
                <p className="text-lg font-semibold text-white group-hover:text-emerald-400 transition-colors">+91 8498970129</p>
              </div>
            </motion.a>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
