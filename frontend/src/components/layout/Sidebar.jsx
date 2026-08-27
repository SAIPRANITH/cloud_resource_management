import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LayoutDashboard, Folder, Server, CreditCard, Bell, Activity, BarChart3, Cloud, ShieldCheck } from 'lucide-react';
import { cn } from '../../utils';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';

const userLinks = [
  { name: 'Dashboard', to: '/dashboard', icon: LayoutDashboard },
  { name: 'Projects', to: '/projects', icon: Folder },
  { name: 'Resources', to: '/resources', icon: Server },
  { name: 'Monitoring', to: '/monitoring', icon: Activity },
  { name: 'Billing', to: '/billing', icon: CreditCard },
  { name: 'Alerts', to: '/alerts', icon: Bell },
];

const adminLinks = [
  { name: 'Dashboard', to: '/dashboard', icon: LayoutDashboard },
  { name: 'Admin Panel', to: '/admin', icon: BarChart3 },
  { name: 'Resources', to: '/resources', icon: Server },
  { name: 'Billing', to: '/billing', icon: CreditCard },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  
  const links = user?.roles?.includes('Admin') ? adminLinks : userLinks;

  return (
    <aside className="w-64 border-r border-border bg-card flex flex-col h-full z-10 relative">
      {/* Brand */}
      <div className="h-16 flex items-center px-6 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center">
            <Cloud className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-foreground">VIT Cloud</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) => cn(
              "relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group overflow-hidden",
              isActive 
                ? "text-indigo-600 bg-indigo-50/50 dark:text-indigo-400 dark:bg-indigo-500/10" 
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            )}
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <motion.div 
                    layoutId="activeTab"
                    className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-indigo-500 to-purple-500 rounded-r-md"
                    initial={false}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <div className="flex items-center gap-3 relative z-10 group-hover:translate-x-1 transition-transform duration-200">
                  <link.icon className={cn("w-5 h-5", isActive ? "text-indigo-600 dark:text-indigo-400" : "")} />
                  <span>{link.name}</span>
                </div>
                {isActive && (
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute right-3 w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.8)] z-10"
                  />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User Footer */}
      <div className="p-4 border-t border-border bg-card">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3 px-2">
            <div className="w-9 h-9 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-700 dark:text-indigo-300 font-bold shrink-0">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-medium text-foreground truncate">
                {user?.name || 'User'}
              </span>
              <div className="flex items-center gap-1.5">
                {user?.roles?.includes('Admin') && (
                  <ShieldCheck className="w-3.5 h-3.5 text-indigo-500" />
                )}
                <span className="text-xs text-muted-foreground capitalize">
                  {user?.roles?.[0] || 'User'}
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={logout}
            className="w-full px-3 py-2 text-sm text-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
          >
            Log out
          </button>
        </div>
      </div>
    </aside>
  );
}
