import { useNavigate } from 'react-router-dom';
import { ShieldAlert, User as UserIcon, ShieldCheck } from 'lucide-react';
import { MOCK_USERS } from '../data/mockData';
import { User } from '../types';
import { Button } from '../components/Button';

interface LoginProps {
  onLogin: (user: User) => void;
}

export function Login({ onLogin }: LoginProps) {
  const navigate = useNavigate();

  const handleLogin = (user: User) => {
    onLogin(user);
    if (user.role === 'student') {
      navigate('/student');
    } else {
      navigate('/staff');
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-zinc-200 p-8">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center mb-4">
            <ShieldAlert className="w-10 h-10" />
          </div>
          <h1 className="text-2xl font-bold text-zinc-900">Dormitory SOS</h1>
          <p className="text-zinc-500 text-center mt-2">
            Select a role to enter the prototype.
          </p>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">Students</h2>
            {MOCK_USERS.filter(u => u.role === 'student').map(user => (
              <Button 
                key={user.id} 
                variant="outline" 
                className="justify-start gap-3 h-14 px-4"
                onClick={() => handleLogin(user)}
              >
                <div className="w-8 h-8 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center">
                  <UserIcon className="w-4 h-4" />
                </div>
                <div className="flex flex-col items-start">
                  <span className="font-semibold">{user.name}</span>
                  <span className="text-xs text-zinc-400">{user.dormInfo}</span>
                </div>
              </Button>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-4 pt-4">
            <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">Staff / RA</h2>
            {MOCK_USERS.filter(u => u.role === 'staff').map(user => (
              <Button 
                key={user.id} 
                variant="outline" 
                className="justify-start gap-3 h-14 px-4"
                onClick={() => handleLogin(user)}
              >
                <div className="w-8 h-8 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div className="flex flex-col items-start">
                  <span className="font-semibold">{user.name}</span>
                  <span className="text-xs text-zinc-400">Dormitory Staff</span>
                </div>
              </Button>
            ))}
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-zinc-100 text-center">
          <p className="text-xs text-zinc-400">
            This is a frontend-only MVP prototype. No real authentication is required.
          </p>
        </div>
      </div>
    </div>
  );
}
