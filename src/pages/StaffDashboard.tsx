import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Clock, MapPin, ChevronRight, User as UserIcon } from 'lucide-react';
import { Alert, Status } from '../types';
import { Badge } from '../components/Badge';
import { Button } from '../components/Button';

interface StaffDashboardProps {
  alerts: Alert[];
}

export function StaffDashboard({ alerts }: StaffDashboardProps) {
  const [filter, setFilter] = useState<Status | 'All'>('All');
  const [search, setSearch] = useState('');

  const filteredAlerts = alerts
    .filter(a => filter === 'All' || a.status === filter)
    .filter(a => 
      a.studentName.toLowerCase().includes(search.toLowerCase()) || 
      a.category.toLowerCase().includes(search.toLowerCase()) ||
      a.location.room.includes(search)
    )
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const activeCount = alerts.filter(a => a.status !== 'Resolved' && a.status !== 'Cancelled').length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Staff Dashboard</h1>
          <p className="text-zinc-500 text-sm">
            {activeCount} active alerts requiring attention.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input 
              className="w-full bg-white border border-zinc-200 rounded-lg pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="Search alerts..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
        <Button 
          variant={filter === 'All' ? 'primary' : 'outline'} 
          size="sm" 
          onClick={() => setFilter('All')}
          className="rounded-full whitespace-nowrap"
        >
          All Alerts
        </Button>
        {(['Sent', 'Received', 'On the Way', 'Resolved', 'Cancelled'] as Status[]).map(s => (
          <Button 
            key={s}
            variant={filter === s ? 'primary' : 'outline'} 
            size="sm" 
            onClick={() => setFilter(s)}
            className="rounded-full whitespace-nowrap"
          >
            {s}
          </Button>
        ))}
      </div>

      <div className="bg-white border border-zinc-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-50 border-b border-zinc-200">
                <th className="px-6 py-4 text-xs font-bold text-zinc-400 uppercase tracking-wider">Student & Category</th>
                <th className="px-6 py-4 text-xs font-bold text-zinc-400 uppercase tracking-wider">Location</th>
                <th className="px-6 py-4 text-xs font-bold text-zinc-400 uppercase tracking-wider">Time</th>
                <th className="px-6 py-4 text-xs font-bold text-zinc-400 uppercase tracking-wider">AI Priority</th>
                <th className="px-6 py-4 text-xs font-bold text-zinc-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-zinc-400 uppercase tracking-wider"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {filteredAlerts.map(alert => (
                <tr key={alert.id} className="hover:bg-zinc-50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        alert.status === 'Sent' ? 'bg-red-100 text-red-600 animate-pulse' : 'bg-zinc-100 text-zinc-400'
                      }`}>
                        <UserIcon className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-semibold text-zinc-900">{alert.studentName}</div>
                        <Badge variant={alert.category} className="scale-90 origin-left">{alert.category}</Badge>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-zinc-600 text-sm">
                      <MapPin className="w-4 h-4 text-zinc-400" />
                      <span>Bldg {alert.location.building}, {alert.location.room}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-zinc-400 text-xs">
                      <Clock className="w-4 h-4" />
                      <span>
                        {new Date(alert.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {alert.aiPriority ? (
                      <div className="space-y-1">
                        <div className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                          alert.aiPriority === 'High' 
                            ? 'bg-red-50 text-red-700 border-red-200' 
                            : alert.aiPriority === 'Medium'
                            ? 'bg-amber-50 text-amber-700 border-amber-200'
                            : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        }`}>
                          {alert.aiPriority}
                        </div>
                        <p className="text-[10px] text-zinc-400 leading-tight max-w-[120px] truncate" title={alert.aiReason}>
                          {alert.aiReason}
                        </p>
                      </div>
                    ) : (
                      <span className="text-zinc-300 text-[10px]">N/A</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={alert.status}>{alert.status}</Badge>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link to={`/staff/alert/${alert.id}`}>
                      <Button variant="ghost" size="sm" className="group-hover:text-indigo-600">
                        Details
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </Button>
                    </Link>
                  </td>
                </tr>
              ))}
              {filteredAlerts.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-zinc-400 italic">
                    No alerts found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
