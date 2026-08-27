import { Link } from 'react-router-dom';
import { Cloud, Shield, Zap, Server, Activity, ArrowRight, BarChart3, Users, Lock, ChevronRight } from 'lucide-react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';

export default function Landing() {
  const features = [
    { icon: Server, title: "Instant Provisioning", desc: "Deploy high-performance VMs and managed databases globally in under 45 seconds." },
    { icon: BarChart3, title: "Real-time Monitoring", desc: "Track CPU, RAM, and bandwidth with millisecond precision graphs." },
    { icon: Shield, title: "Enterprise Security", desc: "End-to-end encryption, automated backups, and strict RBAC isolation." },
    { icon: Zap, title: "Automated Scaling", desc: "Set thresholds to automatically scale your resources during traffic spikes." },
    { icon: Activity, title: "Predictive Analytics", desc: "AI-driven insights to optimize your infrastructure costs and usage." },
    { icon: Lock, title: "Compliance Ready", desc: "Built-in audit logs and access controls for SOC2 and GDPR requirements." }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-8 py-6 border-b border-border/40 backdrop-blur-md sticky top-0 z-50 bg-background/80">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }} className="flex items-center gap-2">
          <div className="bg-indigo-600 p-2 rounded-xl">
            <Cloud className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-foreground">VIT Cloud</span>
        </motion.div>
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }} className="flex gap-4">
          <Link to="/login" className="px-5 py-2.5 text-sm font-semibold text-foreground hover:text-indigo-400 transition-colors">
            Sign In
          </Link>
          <Link to="/register" className="px-5 py-2.5 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-all shadow-lg shadow-indigo-500/20">
            Get Started
          </Link>
        </motion.div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 text-center overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-background to-background"></div>
        <motion.div 
          initial={{ opacity: 0, y: 30 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.7, delay: 0.1 }}
          className="max-w-4xl mx-auto"
        >
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-foreground leading-[1.1]">
            Next-Generation <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">
              Cloud Infrastructure
            </span>
          </h1>
          <p className="mt-8 text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Provision, manage, and scale your cloud resources with an intuitive platform designed for developers and enterprise teams.
          </p>
          
          <div className="mt-12 flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/register" className="group px-8 py-4 text-base font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-2xl transition-all shadow-xl shadow-indigo-500/25 flex items-center justify-center gap-2">
              Start Building Free
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to="/login" className="px-8 py-4 text-base font-bold text-foreground bg-secondary hover:bg-secondary/80 border border-border rounded-2xl transition-all flex items-center justify-center">
              View Documentation
            </Link>
          </div>
        </motion.div>
        
        {/* Mock Dashboard Preview */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-20 max-w-6xl mx-auto relative rounded-2xl border border-border/50 shadow-2xl overflow-hidden bg-card"
        >
          <div className="absolute top-0 w-full h-12 bg-muted/30 border-b border-border/50 flex items-center px-4 gap-2">
            <div className="w-3 h-3 rounded-full bg-rose-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
          </div>
          <img 
            src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=2000" 
            alt="Dashboard Preview" 
            className="w-full h-[300px] md:h-[500px] object-cover opacity-80 mix-blend-luminosity mt-12"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent"></div>
        </motion.div>
      </section>

      {/* Features Grid */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0 }} 
            whileInView={{ opacity: 1 }} 
            viewport={{ once: true }} 
            className="text-3xl md:text-4xl font-bold text-foreground"
          >
            Everything you need to scale
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }} 
            whileInView={{ opacity: 1 }} 
            viewport={{ once: true }} 
            className="mt-4 text-lg text-muted-foreground"
          >
            Powerful features baked right into the platform, no plugins required.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              whileHover={{ y: -5 }}
              className="bg-card border border-border/60 p-8 rounded-3xl hover:border-indigo-500/50 transition-all group shadow-sm hover:shadow-indigo-500/10"
            >
              <div className="w-12 h-12 bg-indigo-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <feature.icon className="w-6 h-6 text-indigo-400" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-indigo-600"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative max-w-4xl mx-auto px-4 text-center z-10"
        >
          <h2 className="text-4xl font-bold text-white mb-6">Ready to deploy your infrastructure?</h2>
          <p className="text-indigo-100 text-lg mb-10 max-w-2xl mx-auto">
            Join thousands of developers building the future on VIT Cloud. Get $100 in free credits when you create an account today.
          </p>
          <Link to="/register" className="inline-flex items-center gap-2 px-8 py-4 text-lg font-bold text-indigo-600 bg-white hover:bg-gray-50 rounded-2xl transition-all shadow-xl">
            Create Free Account
            <ChevronRight className="w-5 h-5" />
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 px-8 text-center text-muted-foreground">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Cloud className="w-5 h-5 text-indigo-500" />
          <span className="font-bold text-foreground tracking-tight">VIT Cloud</span>
        </div>
        <p className="text-sm">© 2026 VIT Cloud Infrastructure. All rights reserved.</p>
      </footer>
    </div>
  );
}
