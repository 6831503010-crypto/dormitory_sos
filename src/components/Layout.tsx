import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShieldAlert, LayoutDashboard, LogOut, User as UserIcon } from 'lucide-react';
import { User } from '../types';
import { Button } from './Button';

interface LayoutProps {
  children: React.ReactNode;
  user: User | null;
  onLogout: () => void;
}

export function Layout({ children, user, onLogout }: LayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();

  if (!user) return <>{children}</>;

  const isStudent = user.role === 'student';
  const dashboardPath = isStudent ? '/student' : '/staff';

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col">
      <header className="bg-white border-bottom border-zinc-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to={dashboardPath} className="flex items-center gap-2 text-indigo-600 font-bold text-xl">
            <ShieldAlert className="w-6 h-6" />
            <span>Dorm SOS</span>
          </Link>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-sm font-semibold text-zinc-900">{user.name}</span>
              <span className="text-xs text-zinc-500 capitalize">{user.role}</span>
            </div>
            <Button variant="ghost" size="sm" onClick={onLogout} className="text-zinc-500">
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-5xl w-full mx-auto p-4 pb-24">
        {children}
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="sm:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-zinc-200 px-6 py-3 flex justify-around items-center z-20">
        <Link 
          to={dashboardPath} 
          className={location.pathname === dashboardPath ? 'text-indigo-600' : 'text-zinc-400'}
        >
          <LayoutDashboard className="w-6 h-6" />
        </Link>
        {isStudent && (
          <Link 
            to="/student/sos" 
            className="bg-indigo-600 text-white p-3 rounded-full -mt-10 shadow-lg border-4 border-white"
          >
            <ShieldAlert className="w-6 h-6" />
          </Link>
        )}
        <button onClick={onLogout} className="text-zinc-400">
          <UserIcon className="w-6 h-6" />
        </button>
      </nav>
    </div>
  );
}
