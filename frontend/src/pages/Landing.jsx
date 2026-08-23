import { Link } from 'react-router-dom';
import { Cloud, Zap, Shield, BarChart3 } from 'lucide-react';

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <header className="px-6 py-4 border-b border-border flex justify-between items-center bg-card sticky top-0 z-50">
        <div className="flex items-center gap-2 text-primary font-bold text-xl tracking-tight">
          <Cloud className="w-6 h-6 text-indigo-500" />
          VIT Cloud
        </div>
        <div className="space-x-4">
          <Link to="/login" className="text-muted-foreground hover:text-foreground font-medium transition-colors">Login</Link>
          <Link to="/register" className="bg-primary text-primary-foreground px-4 py-2 rounded-md font-medium hover:bg-primary/90 transition-all">Sign Up</Link>
        </div>
      </header>

      <main className="container mx-auto px-6 py-20 text-center">
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-foreground max-w-4xl mx-auto leading-tight">
          Enterprise Cloud Management <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600">Made Simple.</span>
        </h1>
        <p className="mt-6 text-xl text-muted-foreground max-w-2xl mx-auto">
          Deploy, scale, and monitor your entire infrastructure from one powerful dashboard. Optimized for speed, built for scale.
        </p>
        
        <div className="mt-10 flex gap-4 justify-center">
          <Link to="/register" className="bg-primary text-primary-foreground px-8 py-4 rounded-lg font-bold text-lg hover:bg-primary/90 hover:scale-105 transition-all shadow-xl shadow-primary/20">
            Start Free Trial
          </Link>
          <Link to="/login" className="bg-card text-foreground px-8 py-4 rounded-lg font-bold text-lg border border-border hover:bg-muted transition-all">
            View Live Demo
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-32 text-left mb-20">
          {[
            { icon: Zap, title: "Lightning Fast Provisioning", desc: "Spin up VMs and databases in seconds with our optimized orchestrator." },
            { icon: BarChart3, title: "Real-time Monitoring", desc: "Track CPU, RAM, and bandwidth with millisecond precision graphs." },
            { icon: Shield, title: "Enterprise Security", desc: "Bank-grade encryption, audit logs, and IAM roles built-in." }
          ].map((feat, i) => (
            <div key={i} className="p-8 rounded-2xl bg-card border border-border hover:border-indigo-500/50 transition-colors shadow-sm cursor-default">
              <feat.icon className="w-10 h-10 text-indigo-500 mb-6" />
              <h3 className="text-xl font-bold mb-3">{feat.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{feat.desc}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
