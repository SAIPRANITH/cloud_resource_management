import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Moon, Sun, LogOut, Menu } from 'lucide-react';

export default function Topbar() {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const isAdmin = user?.roles?.includes('Admin');

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="h-16 bg-card/80 backdrop-blur-xl flex items-center justify-between px-4 sm:px-6 sticky top-0 z-40 shrink-0 relative transition-all duration-300">
      {/* Gradient Bottom Border */}
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-border to-transparent opacity-70" />

      {/* Left: mobile placeholder (logo is in sidebar on desktop) */}
      <div className="flex items-center gap-2 md:hidden">
        <Menu className="w-5 h-5 text-muted-foreground" />
        <span className="font-bold text-base tracking-tight text-foreground">VIT Cloud</span>
      </div>

      {/* Breadcrumb / greeting — desktop only */}
      <div className="hidden md:block">
        <p className="text-sm text-muted-foreground">
          Welcome back, <span className="text-foreground font-semibold">{user?.name}</span>
          {isAdmin && <span className="ml-2 text-xs font-bold bg-violet-500/10 text-violet-400 border border-violet-500/20 px-2 py-0.5 rounded-full">ADMIN</span>}
        </p>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Theme toggle */}
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="p-2 rounded-xl text-muted-foreground hover:bg-foreground/5 hover:text-foreground hover:shadow-sm transition-all duration-300"
          title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {theme === 'dark' ? <Sun className="w-4.5 h-4.5" style={{ width: '1.1rem', height: '1.1rem' }} /> : <Moon className="w-4.5 h-4.5" style={{ width: '1.1rem', height: '1.1rem' }} />}
        </button>

        {/* Divider */}
        <div className="h-5 w-px bg-border/50" />

        {/* User avatar + info */}
        <div className="flex items-center gap-2.5 hover:opacity-80 transition-opacity duration-300 cursor-pointer">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-sm">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="hidden sm:block text-right">
            <p className="text-sm font-semibold text-foreground leading-none">{user?.name}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{user?.email}</p>
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="p-2 rounded-xl text-muted-foreground hover:bg-rose-500/10 hover:text-rose-400 hover:shadow-sm transition-all duration-300"
          title="Logout"
        >
          <LogOut className="w-4.5 h-4.5" style={{ width: '1.1rem', height: '1.1rem' }} />
        </button>
      </div>
    </header>
  );
}
