import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, MapPin, Info } from 'lucide-react';
import { motion } from 'motion/react';
import { Category, User, Location, Alert, Priority } from '../types';
import { Button } from '../components/Button';

interface SOSFormProps {
  user: User;
  onAddAlert: (alert: Alert) => void;
}

const CATEGORIES: Category[] = ['Medical', 'Security', 'Fire', 'Facility', 'Other'];

const BUILDINGS = [
  'L1', 'L2', 'L3', 'L4', 'L5', 'L6', 'L7',
  'F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7',
  'Sathorn 1', 'Sathorn 2', 'International House', 'Chinese House'
];

const FLOORS = [
  { value: '1', label: '1st' },
  { value: '2', label: '2nd' },
  { value: '3', label: '3rd' },
  { value: '4', label: '4th' },
];

// AI Priority Logic (Simulated)
const getAIPriority = (category: Category, note: string = ''): { priority: Priority; reason: string } => {
  const lowerNote = note.toLowerCase();
  
  // Rule 1: Fire is always High
  if (category === 'Fire') {
    return { priority: 'High', reason: 'Critical category: Fire detected.' };
  }

  // Rule 2: Medical with urgent keywords
  if (category === 'Medical') {
    const urgentKeywords = ['bleeding', 'fainted', 'unconscious', 'breath', 'heart', 'pain', 'emergency'];
    if (urgentKeywords.some(k => lowerNote.includes(k))) {
      return { priority: 'High', reason: 'Medical category with urgent keywords detected in note.' };
    }
    return { priority: 'Medium', reason: 'Medical category detected without specific urgent keywords.' };
  }

  // Rule 3: Security is usually Medium
  if (category === 'Security') {
    return { priority: 'Medium', reason: 'Security category detected.' };
  }

  // Rule 4: Facility with urgent keywords (leaks, sparks)
  if (category === 'Facility') {
    const urgentKeywords = ['leak', 'spark', 'flood', 'smoke', 'broken glass'];
    if (urgentKeywords.some(k => lowerNote.includes(k))) {
      return { priority: 'Medium', reason: 'Facility issue with potential safety hazard keywords.' };
    }
    return { priority: 'Low', reason: 'Standard facility maintenance request.' };
  }

  // Default
  return { priority: 'Low', reason: 'General request with no urgent indicators detected.' };
};

export function SOSForm({ user, onAddAlert }: SOSFormProps) {
  const navigate = useNavigate();
  const [category, setCategory] = useState<Category>('Medical');
  
  const parsedBuilding = user.dormInfo?.split(',')[0].replace('Bldg ', '').trim() || '';
  const initialBuilding = BUILDINGS.includes(parsedBuilding) ? parsedBuilding : '';
  
  const parsedFloor = user.dormInfo?.split(',')[1].trim().replace('F', '') || '';
  const initialFloor = FLOORS.some(f => f.value === parsedFloor) ? parsedFloor : '';

  const [location, setLocation] = useState<Location>({
    building: initialBuilding,
    floor: initialFloor,
    room: user.dormInfo?.split(',')[2].trim() || '',
  });
  const [note, setNote] = useState('');
  const [otherReason, setOtherReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [buildingError, setBuildingError] = useState('');
  const [floorError, setFloorError] = useState('');
  const [roomError, setRoomError] = useState('');
  const [otherReasonError, setOtherReasonError] = useState('');
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    let hasError = false;

    if (!location.building) {
      setBuildingError('Please select a building');
      hasError = true;
    } else {
      setBuildingError('');
    }

    if (!location.floor) {
      setFloorError('Please select a floor');
      hasError = true;
    } else {
      setFloorError('');
    }

    const roomNum = parseInt(location.room.trim(), 10);
    if (!/^\d+$/.test(location.room.trim()) || isNaN(roomNum) || roomNum < 100 || roomNum > 500) {
      setRoomError('Room must be between 100 and 500');
      hasError = true;
    } else {
      setRoomError('');
    }

    if (category === 'Other' && !otherReason.trim()) {
      setOtherReasonError('Please specify the issue');
      hasError = true;
    } else {
      setOtherReasonError('');
    }

    if (hasError) return;
    
    setShowConfirmDialog(true);
  };

  const confirmSubmit = () => {
    setShowConfirmDialog(false);
    setIsSubmitting(true);

    // Simulate network delay
    setTimeout(() => {
      const finalNote = category === 'Other' ? `[Other: ${otherReason}] ${note}` : note;
      const { priority, reason } = getAIPriority(category, finalNote);

      const newAlert: Alert = {
        id: 'A' + Math.random().toString(36).substr(2, 9),
        studentId: user.id,
        studentName: user.name,
        category,
        location,
        note: finalNote,
        status: 'Sent',
        createdAt: new Date().toISOString(),
        aiPriority: priority,
        aiReason: reason
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
          {category === 'Other' && (
            <div className="mt-4 space-y-2">
              <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Please specify the issue</label>
              <input
                required
                className={`w-full bg-white border ${otherReasonError ? 'border-red-500 focus:ring-red-500' : 'border-zinc-200 focus:ring-indigo-500'} rounded-lg px-3 py-2 text-sm focus:ring-2 outline-none`}
                value={otherReason}
                onChange={e => {
                  setOtherReason(e.target.value);
                  if (otherReasonError) setOtherReasonError('');
                }}
                placeholder="e.g., Locked out of room, Water leak, etc."
              />
              {otherReasonError && <p className="text-xs text-red-500 mt-1">{otherReasonError}</p>}
            </div>
          )}
        </section>

        <section className="space-y-4">
          <h2 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            Location
          </h2>
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-400">Building</label>
              <select 
                required
                className={`w-full bg-white border ${buildingError ? 'border-red-500 focus:ring-red-500' : 'border-zinc-200 focus:ring-indigo-500'} rounded-lg px-3 py-2 text-sm focus:ring-2 outline-none`}
                value={location.building}
                onChange={e => {
                  setLocation({...location, building: e.target.value});
                  if (buildingError) setBuildingError('');
                }}
              >
                <option value="" disabled>Select...</option>
                {BUILDINGS.map(b => <option key={b} value={b}>{b}</option>)}
              </select>
              {buildingError && <p className="text-xs text-red-500 mt-1">{buildingError}</p>}
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-400">Floor</label>
              <select 
                required
                className={`w-full bg-white border ${floorError ? 'border-red-500 focus:ring-red-500' : 'border-zinc-200 focus:ring-indigo-500'} rounded-lg px-3 py-2 text-sm focus:ring-2 outline-none`}
                value={location.floor}
                onChange={e => {
                  setLocation({...location, floor: e.target.value});
                  if (floorError) setFloorError('');
                }}
              >
                <option value="" disabled>Select...</option>
                {FLOORS.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
              </select>
              {floorError && <p className="text-xs text-red-500 mt-1">{floorError}</p>}
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-400">Room</label>
              <input 
                required
                className={`w-full bg-white border ${roomError ? 'border-red-500 focus:ring-red-500' : 'border-zinc-200 focus:ring-indigo-500'} rounded-lg px-3 py-2 text-sm focus:ring-2 outline-none`}
                value={location.room}
                onChange={e => {
                  setLocation({...location, room: e.target.value});
                  if (roomError) setRoomError('');
                }}
              />
              {roomError && <p className="text-xs text-red-500 mt-1">{roomError}</p>}
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

      {showConfirmDialog && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
        >
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl"
          >
            <h3 className="text-lg font-bold text-zinc-900 mb-2">Confirm SOS Request</h3>
            <p className="text-sm text-zinc-600 mb-6">
              Are you sure you want to send this <span className="font-semibold">{category}{category === 'Other' ? ` (${otherReason})` : ''}</span> SOS request for Building {location.building}, Floor {location.floor}, Room {location.room}?
            </p>
            <div className="flex gap-3">
              <Button 
                type="button" 
                variant="outline" 
                className="flex-1" 
                onClick={() => setShowConfirmDialog(false)}
              >
                Cancel
              </Button>
              <Button 
                type="button" 
                variant="danger" 
                className="flex-1" 
                onClick={confirmSubmit}
              >
                Confirm
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
