import { Link } from 'react-router-dom';
import { Plus, Clock, MapPin, ChevronRight, AlertTriangle } from 'lucide-react';
import { Alert, User } from '../types';
import { Badge } from '../components/Badge';
import { Button } from '../components/Button';

interface StudentDashboardProps {
  user: User;
  alerts: Alert[];
}

export function StudentDashboard({ user, alerts }: StudentDashboardProps) {
  const myAlerts = alerts
    .filter(a => a.studentId === user.id)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const activeAlerts = myAlerts.filter(a => a.status !== 'Resolved' && a.status !== 'Cancelled');
  const pastAlerts = myAlerts.filter(a => a.status === 'Resolved' || a.status === 'Cancelled');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">My Requests</h1>
          <p className="text-zinc-500 text-sm">Track your SOS and help requests.</p>
        </div>
        <Link to="/student/sos">
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            <span>New SOS</span>
          </Button>
        </Link>
      </div>

      {activeAlerts.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">Active Alerts</h2>
          <div className="grid gap-4">
            {activeAlerts.map(alert => (
              <div 
                key={alert.id} 
                className="bg-white border-2 border-indigo-100 rounded-xl p-4 shadow-sm relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-1 h-full bg-indigo-600" />
                <div className="flex justify-between items-start mb-3">
                  <Badge variant={alert.category}>{alert.category}</Badge>
                  <Badge variant={alert.status}>{alert.status}</Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-zinc-600">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm font-medium">
                      Bldg {alert.location.building}, Floor {alert.location.floor}, Room {alert.location.room}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-zinc-400">
                    <Clock className="w-4 h-4" />
                    <span className="text-xs">
                      {new Date(alert.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  {alert.note && (
                    <p className="text-sm text-zinc-600 bg-zinc-50 p-2 rounded-lg mt-2 italic">
                      "{alert.note}"
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {activeAlerts.length === 0 && (
        <div className="bg-white border border-dashed border-zinc-200 rounded-2xl p-12 flex flex-col items-center justify-center text-center">
          <div className="w-12 h-12 bg-zinc-50 text-zinc-300 rounded-full flex items-center justify-center mb-4">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <h3 className="text-zinc-900 font-semibold">No active alerts</h3>
          <p className="text-zinc-500 text-sm mt-1">
            You don't have any pending SOS requests.
          </p>
        </div>
      )}

      {pastAlerts.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">History</h2>
          <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden divide-y divide-zinc-100">
            {pastAlerts.map(alert => (
              <div key={alert.id} className="p-4 flex items-center justify-between hover:bg-zinc-50 transition-colors">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-zinc-900">{alert.category}</span>
                    <Badge variant={alert.status} className="scale-75 origin-left">{alert.status}</Badge>
                  </div>
                  <span className="text-xs text-zinc-400">
                    {new Date(alert.createdAt).toLocaleDateString()} • {new Date(alert.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <ChevronRight className="w-4 h-4 text-zinc-300" />
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
