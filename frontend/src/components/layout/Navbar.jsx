import { Menu, Moon, Sun, LogOut, Bell } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import ConnectionStatus from './ConnectionStatus';

export default function Navbar({ onMenuClick, title }) {
  const { admin, logout } = useAuth();
  const { dark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-30 glass-card mx-4 mt-4 flex items-center justify-between px-4 py-3 lg:mx-0 lg:mt-0 lg:rounded-none lg:border-x-0 lg:border-t-0">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="rounded-lg p-2 hover:bg-slate-100 lg:hidden dark:hover:bg-slate-800"
        >
          <Menu size={22} />
        </button>
        <h2 className="text-lg font-bold lg:text-xl">{title}</h2>
      </div>
      <div className="flex items-center gap-2">
        <ConnectionStatus />
        <button className="relative rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-slate-800">
          <Bell size={20} />
        </button>
        <button
          onClick={toggleTheme}
          className="rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          {dark ? <Sun size={20} /> : <Moon size={20} />}
        </button>
        <div className="hidden items-center gap-2 rounded-xl bg-slate-100 px-3 py-1.5 sm:flex dark:bg-slate-800">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-brand text-sm font-bold text-white">
            {admin?.name?.[0] || 'A'}
          </div>
          <span className="text-sm font-medium">{admin?.name}</span>
        </div>
        <button
          onClick={handleLogout}
          className="rounded-lg p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
          title="Logout"
        >
          <LogOut size={20} />
        </button>
      </div>
    </header>
  );
}
