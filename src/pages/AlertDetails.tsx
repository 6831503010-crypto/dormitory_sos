import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Clock, User as UserIcon, CheckCircle2, MessageSquare, XCircle, ShieldAlert } from 'lucide-react';
import { Alert, Status, User } from '../types';
import { Badge } from '../components/Badge';
import { Button } from '../components/Button';

interface AlertDetailsProps {
  user: User;
  alerts: Alert[];
  onUpdateAlert: (id: string, updates: Partial<Alert>) => void;
}

// Transition map for forward-only workflow
const ALLOWED_TRANSITIONS: Record<Status, Status[]> = {
  'Sent': ['Received'],
  'Received': ['On the Way', 'Cancelled'],
  'On the Way': ['Resolved', 'Cancelled'],
  'Resolved': [],
  'Cancelled': [],
};

export function AlertDetails({ user, alerts, onUpdateAlert }: AlertDetailsProps) {
  const { id } = useParams();
  const navigate = useNavigate();
  const alert = alerts.find(a => a.id === id);
  
  // Determine valid next steps based on the SAVED status of the alert
  const currentSavedStatus = alert?.status || 'Sent';
  const nextOptions = ALLOWED_TRANSITIONS[currentSavedStatus];
  const isTerminal = currentSavedStatus === 'Resolved' || currentSavedStatus === 'Cancelled';

  // Controlled form state
  const [status, setStatus] = useState<Status>(currentSavedStatus);
  const [isLocked, setIsLocked] = useState(isTerminal);
  const [resNote, setResNote] = useState(alert?.resolutionNote || '');
  
  // Modal state
  const [showModal, setShowModal] = useState(false);

  if (!alert) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-bold">Alert not found</h2>
        <Button onClick={() => navigate('/staff')} className="mt-4">Back to Dashboard</Button>
      </div>
    );
  }

  // Core save logic
  const saveAlert = () => {
    onUpdateAlert(alert.id, { 
      status,
      resolutionNote: resNote,
      assignedStaffId: user.id
    });

    // Lock the form if we just moved to a terminal state
    if (status === "Resolved" || status === "Cancelled") {
      setIsLocked(true);
    }
    navigate("/staff");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Trigger modal for critical status transitions
    if (status === 'Resolved' || status === 'Cancelled') {
      setShowModal(true);
    } else {
      saveAlert();
    }
  };
  

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <h1 className="text-xl font-bold text-zinc-900">Alert Details</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white border border-zinc-200 rounded-2xl shadow-sm overflow-hidden">
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
              className="w-full bg-white border border-zinc-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none resize-none disabled:bg-zinc-50 disabled:text-zinc-500"
              rows={3}
              placeholder="Add notes about the resolution or current status..."
              value={resNote}
              onChange={e => setResNote(e.target.value)}
              disabled={isLocked}
            />
          </div>

          {/* Only show status update section if there are valid next steps */}
          {!isLocked && nextOptions.length > 0 && (
            <div className="space-y-4">
              <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                Move to Next Status
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {nextOptions.map((s) => (
                  <label 
                    key={s}
                    className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                      status === s 
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700' 
                        : 'border-zinc-100 bg-white text-zinc-600 hover:border-zinc-200'
                    }`}
                  >
                    <input 
                      type="radio"
                      name="status"
                      value={s}
                      checked={status === s}
                      onChange={(e) => setStatus(e.target.value as Status)}
                      className="w-4 h-4 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="text-sm font-medium">{s}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {isLocked && (
            <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-xl text-center">
              <p className="text-sm text-zinc-500 font-medium">
                This alert is closed. No further status changes allowed.
              </p>
            </div>
          )}
        </div>

        <div className="p-6 bg-zinc-50 border-t border-zinc-200 flex justify-end gap-3">
          <Button 
            type="button"
            variant="outline" 
            onClick={() => navigate('/staff')}
          >
            Back
          </Button>
          <Button 
            type="submit" 
            variant="primary"
            disabled={isLocked}
          >
            Save Changes
          </Button>
        </div>
      </form>

      {alert.status === 'Resolved' && (
        <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 flex items-center gap-3 text-emerald-700">
          <CheckCircle2 className="w-5 h-5" />
          <span className="text-sm font-medium">This alert has been marked as resolved.</span>
        </div>
      )}

      
      {alert.status === 'Cancelled' && (
        <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 flex items-center gap-3 text-amber-700">
          <XCircle className="w-5 h-5" />
          <span className="text-sm font-medium">This alert has been marked as cancelled.</span>
        </div>
      )}

      {/* Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6 space-y-4 animate-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 text-amber-600">
              <ShieldAlert className="w-6 h-6" />
              <h3 className="text-lg font-bold text-zinc-900">Confirm Status Change</h3>
            </div>
            
            <p className="text-zinc-600 text-sm leading-relaxed">
              {status === 'Resolved' 
                ? "Are you sure you want to mark this alert as resolved? This action cannot be undone."
                : "Are you sure you want to cancel this alert?"}
            </p>

            <div className="flex gap-3 pt-2">
              <Button 
                variant="outline" 
                className="flex-1" 
                onClick={() => setShowModal(false)}
              >
                Cancel
              </Button>
              <Button 
                variant={status === 'Cancelled' ? 'danger' : 'primary'} 
                className="flex-1" 
                onClick={() => {
                  setShowModal(false);
                  saveAlert();
                }}
              >
                Confirm
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
