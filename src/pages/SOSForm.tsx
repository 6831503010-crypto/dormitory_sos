import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, MapPin, Info } from 'lucide-react';
import { Category, User, Location, Alert } from '../types';
import { Button } from '../components/Button';

interface SOSFormProps {
  user: User;
  onAddAlert: (alert: Alert) => void;
}

const CATEGORIES: Category[] = ['Medical', 'Security', 'Fire', 'Facility', 'Other'];

export function SOSForm({ user, onAddAlert }: SOSFormProps) {
  const navigate = useNavigate();
  const [category, setCategory] = useState<Category>('Medical');
  const [location, setLocation] = useState<Location>({
    building: user.dormInfo?.split(',')[0].replace('Bldg ', '') || '',
    floor: user.dormInfo?.split(',')[1].trim().replace('F', '') || '',
    room: user.dormInfo?.split(',')[2].trim() || '',
  });
  const [note, setNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [floorError, setFloorError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!/^[1-9]\d*$/.test(location.floor.trim())) {
      setFloorError('Floor must be a valid positive number');
      return;
    }
    setFloorError('');
    
    setIsSubmitting(true);

    // Simulate network delay
    setTimeout(() => {
      const newAlert: Alert = {
        id: 'A' + Math.random().toString(36).substr(2, 9),
        studentId: user.id,
        studentName: user.name,
        category,
        location,
        note,
        status: 'Sent',
        createdAt: new Date().toISOString(),
      };

      onAddAlert(newAlert);
      navigate('/student');
    }, 1000);
  };

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <h1 className="text-xl font-bold text-zinc-900">Request Help</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <section className="space-y-4">
          <h2 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider flex items-center gap-2">
            <Info className="w-4 h-4" />
            Category
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(cat)}
                className={`p-4 rounded-xl border-2 text-left transition-all ${
                  category === cat 
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-700 shadow-sm' 
                    : 'border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300'
                }`}
              >
                <span className="font-semibold block">{cat}</span>
              </button>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            Location
          </h2>
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-400">Building</label>
              <input 
                required
                className="w-full bg-white border border-zinc-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                value={location.building}
                onChange={e => setLocation({...location, building: e.target.value})}
              />
            </div>
           <div className="space-y-1.5">
            <label className="text-xs font-medium text-zinc-400">Floor</label>
            <input
              required
              className="w-full bg-white border border-zinc-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              value={location.floor}
              onChange={e => {
                setLocation({ ...location, floor: e.target.value });
                if (floorError) setFloorError('');
              }}
            />
            {floorError && <p className="text-xs text-red-500 mt-1">{floorError}</p>}
          </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-400">Room</label>
              <input 
                required
                className="w-full bg-white border border-zinc-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                value={location.room}
                onChange={e => setLocation({...location, room: e.target.value})}
              />
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider">Additional Note (Optional)</h2>
          <textarea 
            rows={3}
            placeholder="Describe your situation briefly..."
            className="w-full bg-white border border-zinc-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
            value={note}
            onChange={e => setNote(e.target.value)}
          />
        </section>

        <Button 
          type="submit" 
          className="w-full h-14 text-lg gap-2" 
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            'Submitting...'
          ) : (
            <>
              <Send className="w-5 h-5" />
              <span>Send SOS Request</span>
            </>
          )}
        </Button>
      </form>
    </div>
  );
}
