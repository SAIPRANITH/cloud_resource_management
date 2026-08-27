import React from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { Server, Activity, Shield, Zap, Lock, BarChart3, Cloud, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const stats = [
  { label: 'Uptime', value: '99.99%' },
  { label: 'Regions', value: '150+' },
  { label: 'Deployments', value: '10M+' },
  { label: 'Support', value: '24/7' },
];

const features = [
  { icon: Server, title: 'Instant Provisioning', desc: 'Deploy cloud resources in seconds with our highly optimized infrastructure.' },
  { icon: BarChart3, title: 'Real-time Monitoring', desc: 'Gain deep insights into your applications with high-fidelity metrics.' },
  { icon: Shield, title: 'Enterprise Security', desc: 'Bank-grade encryption and security compliance out of the box.' },
  { icon: Zap, title: 'Automated Scaling', desc: 'Handle traffic spikes effortlessly with auto-scaling capabilities.' },
  { icon: Activity, title: 'Predictive Analytics', desc: 'AI-driven insights to optimize your cloud spend and performance.' },
  { icon: Lock, title: 'Compliance Ready', desc: 'Built to meet SOC2, HIPAA, and GDPR compliance requirements.' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

export default function Landing() {
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-50 overflow-hidden font-sans selection:bg-indigo-500/30">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-neutral-950/80 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center">
              <Cloud className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight">VIT Cloud</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login" className="text-sm font-medium text-neutral-300 hover:text-white transition-colors">
              Sign In
            </Link>
            <Link to="/register" className="text-sm font-medium px-4 py-2 rounded-full bg-white text-neutral-950 hover:bg-neutral-200 transition-colors">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 px-6">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-soft-light"></div>
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              x: [0, 100, 0],
              y: [0, 50, 0],
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-500/20 rounded-full blur-[120px]"
          />
          <motion.div
            animate={{
              scale: [1, 1.5, 1],
              x: [0, -100, 0],
              y: [0, 100, 0],
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-[150px]"
          />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        </div>

        <div className="relative max-w-7xl mx-auto text-center z-10">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="max-w-4xl mx-auto"
          >
            <motion.h1 variants={itemVariants} className="text-5xl lg:text-7xl font-bold tracking-tight mb-8">
              The Cloud Built for{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">
                Performance
              </span>
            </motion.h1>
            
            <motion.p variants={itemVariants} className="text-lg lg:text-xl text-neutral-400 mb-10 max-w-2xl mx-auto leading-relaxed">
              Deploy, scale, and manage your applications with unprecedented speed. Experience enterprise-grade infrastructure without the complexity.
            </motion.p>
            
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/register" className="group relative px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full font-medium transition-all w-full sm:w-auto overflow-hidden">
                <span className="relative z-10 flex items-center justify-center gap-2">
                  Start Building Free <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
              </Link>
              <Link to="/contact" className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-full font-medium transition-all w-full sm:w-auto">
                Talk to Sales
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative z-10 border-y border-white/10 bg-neutral-950/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl lg:text-5xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-sm text-neutral-400 uppercase tracking-wider font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-5xl font-bold mb-6">Everything you need to scale</h2>
            <p className="text-neutral-400 max-w-2xl mx-auto text-lg">
              Our platform provides a comprehensive suite of tools designed to help you build faster and scale more efficiently.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ y: -5 }}
                className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/[0.07] transition-all group"
              >
                <div className="w-12 h-12 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-neutral-400 leading-relaxed">
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-5xl mx-auto rounded-3xl overflow-hidden relative"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-purple-800 opacity-90"></div>
          <div className="relative p-12 lg:p-20 text-center">
            <h2 className="text-3xl lg:text-5xl font-bold mb-6 text-white">Ready to transform your infrastructure?</h2>
            <p className="text-indigo-100 mb-10 max-w-2xl mx-auto text-lg">
              Join thousands of forward-thinking companies building on VIT Cloud. Start deploying in seconds.
            </p>
            <Link to="/register" className="inline-flex px-8 py-4 bg-white text-indigo-900 rounded-full font-bold hover:scale-105 transition-transform shadow-[0_0_40px_rgba(255,255,255,0.3)]">
              Create Free Account
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-neutral-950 py-12 px-6 relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <Cloud className="w-6 h-6 text-indigo-500" />
            <span className="font-bold text-lg">VIT Cloud</span>
          </div>
          <div className="text-neutral-500 text-sm">
            © {new Date().getFullYear()} VIT Cloud. All rights reserved.
          </div>
          <div className="flex gap-6 text-sm text-neutral-400">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">System Status</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
