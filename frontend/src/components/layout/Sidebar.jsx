import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard, Folder, Server, CreditCard,
  Bell, Activity, BarChart3, Cloud, ShieldCheck
} from 'lucide-react';
import { cn } from '../../utils';

const userLinks = [
  { name: 'Dashboard',   to: '/dashboard', icon: LayoutDashboard },
  { name: 'Projects',    to: '/projects',  icon: Folder },
  { name: 'Resources',   to: '/resources', icon: Server },
  { name: 'Monitoring',  to: '/monitoring',icon: Activity },
  { name: 'Billing',     to: '/billing',   icon: CreditCard },
  { name: 'Alerts',      to: '/alerts',    icon: Bell },
];

const adminLinks = [
  { name: 'Dashboard',      to: '/dashboard', icon: LayoutDashboard },
  { name: 'Admin Panel',    to: '/admin',     icon: BarChart3 },
  { name: 'Projects',       to: '/projects',  icon: Folder },
  { name: 'Resources',      to: '/resources', icon: Server },
  { name: 'Billing',        to: '/billing',   icon: CreditCard },
];

export default function Sidebar() {
  const { user } = useAuth();
  const isAdmin  = user?.roles?.includes('Admin');
  const links    = isAdmin ? adminLinks : userLinks;

  return (
    <aside className="w-64 border-r border-border bg-card hidden md:flex flex-col">
      {/* Logo */}
      <div className="h-16 flex items-center gap-2.5 px-5 border-b border-border shrink-0">
        <div className="p-1.5 rounded-lg bg-indigo-500/10">
          <Cloud className="w-5 h-5 text-indigo-500" />
        </div>
        <span className="font-bold text-lg tracking-tight text-foreground">VIT Cloud</span>
      </div>

      {/* Role badge */}
      <div className="px-4 pt-4 pb-2">
        <div className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold ${
          isAdmin
            ? 'bg-violet-500/10 text-violet-400 border border-violet-500/20'
            : 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
        }`}>
          <ShieldCheck className="w-3.5 h-3.5" />
          {isAdmin ? 'Administrator' : 'Customer Account'}
        </div>
      </div>

      {/* Nav links */}
      <nav className="flex-1 px-4 py-2 space-y-1 overflow-y-auto">
        {isAdmin && (
          <p className="px-3 py-2 text-xs font-semibold text-muted-foreground/60 uppercase tracking-wider">
            Navigation
          </p>
        )}
        {links.map((link) => (
          <NavLink
            key={link.name}
            to={link.to}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all',
                isActive
                  ? 'bg-indigo-500/10 text-indigo-400 shadow-[inset_0_0_0_1px_rgba(99,102,241,0.2)]'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )
            }
          >
            <link.icon className="w-4.5 h-4.5 shrink-0" style={{ width: '1.1rem', height: '1.1rem' }} />
            {link.name}
            {link.name === 'Admin Panel' && (
              <span className="ml-auto text-[10px] font-bold bg-violet-500/20 text-violet-400 px-1.5 py-0.5 rounded-full border border-violet-500/30">
                ADMIN
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User footer */}
      <div className="px-4 py-4 border-t border-border">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-muted/50">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-foreground truncate">{user?.name}</p>
            <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
