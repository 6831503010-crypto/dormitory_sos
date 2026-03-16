import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Clock, User as UserIcon, CheckCircle2, MessageSquare } from 'lucide-react';
import { Alert, Status, User } from '../types';
import { Badge } from '../components/Badge';
import { Button } from '../components/Button';

interface AlertDetailsProps {
  user: User;
  alerts: Alert[];
  onUpdateAlert: (id: string, updates: Partial<Alert>) => void;
}

export function AlertDetails({ user, alerts, onUpdateAlert }: AlertDetailsProps) {
  const { id } = useParams();
  const navigate = useNavigate();
  const alert = alerts.find(a => a.id === id);
  const [resNote, setResNote] = useState(alert?.resolutionNote || '');

  if (!alert) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-bold">Alert not found</h2>
        <Button onClick={() => navigate('/staff')} className="mt-4">Back to Dashboard</Button>
      </div>
    );
  }

  const handleStatusChange = (newStatus: Status) => {
    onUpdateAlert(alert.id, { 
      status: newStatus,
      resolutionNote: resNote,
      assignedStaffId: user.id
    });
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <h1 className="text-xl font-bold text-zinc-900">Alert Details</h1>
      </div>

      <div className="bg-white border border-zinc-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-zinc-100 flex justify-between items-start">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center">
              <UserIcon className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-zinc-900">{alert.studentName}</h2>
              <p className="text-sm text-zinc-500">Student ID: {alert.studentId}</p>
            </div>
          </div>
          <Badge variant={alert.status} className="text-sm px-3 py-1">{alert.status}</Badge>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-1">
              <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Category</span>
              <div className="flex items-center gap-2">
                <Badge variant={alert.category}>{alert.category}</Badge>
              </div>
            </div>
            <div className="space-y-1">
              <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Time Reported</span>
              <div className="flex items-center gap-2 text-zinc-600 text-sm">
                <Clock className="w-4 h-4" />
                <span>{new Date(alert.createdAt).toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Location</span>
            <div className="bg-zinc-50 rounded-xl p-4 flex items-center gap-3">
              <div className="w-10 h-10 bg-white border border-zinc-200 rounded-lg flex items-center justify-center text-indigo-600">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <p className="font-semibold text-zinc-900">Building {alert.location.building}</p>
                <p className="text-sm text-zinc-500">Floor {alert.location.floor}, Room {alert.location.room}</p>
              </div>
            </div>
          </div>

          {alert.note && (
            <div className="space-y-1">
              <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Student Note</span>
              <p className="bg-zinc-50 rounded-xl p-4 text-sm text-zinc-700 italic">
                "{alert.note}"
              </p>
            </div>
          )}

          <div className="space-y-4 pt-4 border-t border-zinc-100">
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Resolution Notes
            </span>
            <textarea 
              className="w-full bg-white border border-zinc-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
              rows={3}
              placeholder="Add notes about the resolution or current status..."
              value={resNote}
              onChange={e => setResNote(e.target.value)}
            />
          </div>
        </div>

        <div className="p-6 bg-zinc-50 border-t border-zinc-200 grid grid-cols-2 sm:grid-cols-4 gap-2">
          <Button 
            variant={alert.status === 'Received' ? 'primary' : 'outline'} 
            size="sm"
            onClick={() => handleStatusChange('Received')}
          >
            Received
          </Button>
          <Button 
            variant={alert.status === 'On the Way' ? 'primary' : 'outline'} 
            size="sm"
            onClick={() => handleStatusChange('On the Way')}
          >
            On the Way
          </Button>
          <Button 
            variant={alert.status === 'Resolved' ? 'primary' : 'outline'} 
            size="sm"
            className={alert.status === 'Resolved' ? 'bg-emerald-600 hover:bg-emerald-700' : ''}
            onClick={() => handleStatusChange('Resolved')}
          >
            Resolved
          </Button>
          <Button 
            variant={alert.status === 'Cancelled' ? 'danger' : 'outline'} 
            size="sm"
            onClick={() => handleStatusChange('Cancelled')}
          >
            Cancelled
          </Button>
        </div>
      </div>

      {alert.status === 'Resolved' && (
        <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 flex items-center gap-3 text-emerald-700">
          <CheckCircle2 className="w-5 h-5" />
          <span className="text-sm font-medium">This alert has been marked as resolved.</span>
        </div>
      )}
    </div>
  );
}
