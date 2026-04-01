import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Plus, Clock, MapPin, ChevronRight, AlertTriangle, History } from 'lucide-react';
import { Alert, User, Status } from '../types';
import { Badge } from '../components/Badge';
import { Button } from '../components/Button';

interface StudentDashboardProps {
  user: User;
  alerts: Alert[];
}

export function StudentDashboard({ user, alerts }: StudentDashboardProps) {
  const [viewMode, setViewMode] = useState<'active' | 'history'>('active');
  const [filter, setFilter] = useState<Status | 'All'>('All');
  const [search, setSearch] = useState('');
  const [expandedPastAlertId, setExpandedPastAlertId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // 1. Get all alerts for this student
  const myAllAlerts = alerts.filter(a => a.studentId === user.id);

  // 2. Separate into pools
  const activePool = myAllAlerts.filter(a => a.status !== 'Resolved' && a.status !== 'Cancelled');
  const historyPool = myAllAlerts.filter(a => a.status === 'Resolved' || a.status === 'Cancelled');

  // 3. Select current pool based on viewMode
  const currentPool = viewMode === 'active' ? activePool : historyPool;

  // 4. Apply filters (Status tabs only apply to active view)
  const filteredAlerts = currentPool
    .filter(a => viewMode === 'history' || filter === 'All' || a.status === filter)
    .filter(a => 
      a.category.toLowerCase().includes(search.toLowerCase()) ||
      a.location.room.includes(search) ||
      (a.note && a.note.toLowerCase().includes(search.toLowerCase()))
    )
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  // 5. Paginate the final list
  const totalPages = Math.ceil(filteredAlerts.length / itemsPerPage);
  const paginatedAlerts = filteredAlerts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleFilterChange = (s: Status | 'All') => {
    setFilter(s);
    setCurrentPage(1);
  };

  const handleSearchChange = (val: string) => {
    setSearch(val);
    setCurrentPage(1);
  };

  const toggleViewMode = (mode: 'active' | 'history') => {
    setViewMode(mode);
    setCurrentPage(1);
    setFilter('All');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">
            {viewMode === 'active' ? 'My Requests' : 'Request History'}
          </h1>
          <p className="text-zinc-500 text-sm">
            {viewMode === 'active' 
              ? `${activePool.length} active SOS requests.` 
              : `${historyPool.length} past requests.`}
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input 
              className="w-full bg-white border border-zinc-200 rounded-lg pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder={viewMode === 'active' ? "Search active requests..." : "Search history..."}
              value={search}
              onChange={e => handleSearchChange(e.target.value)}
            />
          </div>
          
          <Button 
            variant={viewMode === 'history' ? 'primary' : 'outline'}
            onClick={() => toggleViewMode(viewMode === 'active' ? 'history' : 'active')}
            className="gap-2"
          >
            {viewMode === 'active' ? (
              <>
                <History className="w-4 h-4" />
                <span>History</span>
              </>
            ) : (
              <>
                <AlertTriangle className="w-4 h-4" />
                <span>Active</span>
              </>
            )}
          </Button>

          <Link to="/student/sos">
            <Button className="gap-2 bg-indigo-600 hover:bg-indigo-700 border-none">
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">New SOS</span>
            </Button>
          </Link>
        </div>
      </div>

      {viewMode === 'active' && (
        <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
          <Button 
            variant={filter === 'All' ? 'primary' : 'outline'} 
            size="sm" 
            onClick={() => handleFilterChange('All')}
            className="rounded-full whitespace-nowrap"
          >
            All Requests
          </Button>
          {(['Sent', 'Received', 'On the Way'] as Status[]).map(s => (
            <Button 
              key={s}
              variant={filter === s ? 'primary' : 'outline'} 
              size="sm" 
              onClick={() => handleFilterChange(s)}
              className="rounded-full whitespace-nowrap"
            >
              {s}
            </Button>
          ))}
        </div>
      )}

      <div className="space-y-4">
        {paginatedAlerts.length > 0 ? (
          paginatedAlerts.map(alert => {
            const isHistory = alert.status === 'Resolved' || alert.status === 'Cancelled';
            
            if (isHistory && expandedPastAlertId !== alert.id) {
              return (
                <div 
                  key={alert.id}
                  onClick={() => setExpandedPastAlertId(alert.id)}
                  className="bg-white border border-zinc-200 rounded-xl p-4 flex items-center justify-between hover:bg-zinc-50 transition-colors cursor-pointer shadow-sm"
                >
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-zinc-900">{alert.category}</span>
                      <Badge variant={alert.status} className="scale-75 origin-left">{alert.status}</Badge>
                    </div>
                    <span className="text-xs text-zinc-400">
                      {new Date(alert.createdAt).toLocaleDateString()} • {new Date(alert.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    {alert.resolutionNote && (
                      <span className="text-xs text-zinc-400 mt-3">
                        <p className="font-bold uppercase tracking-wider mb-1">Staff Resolution Note</p>
                        <p className="text-emerald-700 bg-emerald-50 p-2 rounded-lg italic">
                          "{alert.resolutionNote}"
                        </p>
                      </span>
                    )}
                  </div>
                  <ChevronRight className="w-4 h-4 text-zinc-300" />
                </div>
              );
            }

            return (
              <div 
                key={alert.id} 
                className={`bg-white border-2 ${isHistory ? 'border-zinc-200' : 'border-indigo-100'} rounded-xl p-4 shadow-sm relative overflow-hidden transition-all`}
                onClick={isHistory ? () => setExpandedPastAlertId(null) : undefined}
              >
                <div className={`absolute top-0 left-0 w-1 h-full ${isHistory ? 'bg-zinc-400' : 'bg-indigo-600'}`} />
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-2">
                    <Badge variant={alert.category}>{alert.category}</Badge>
                    {isHistory && <ChevronRight className="w-4 h-4 text-zinc-400 transform rotate-180" />}
                  </div>
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
                      {isHistory ? new Date(alert.createdAt).toLocaleDateString() + ' • ' : ''}
                      {new Date(alert.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  {alert.otherReason && (
                    <p className="mt-2 rounded-lg bg-orange-50 p-2 text-sm italic text-orange-700">
                      <span className="font-semibold">Other Reason: </span>"{alert.otherReason}"
                    </p>
                  )}
                  {alert.note && (
                    <p className="mt-2 rounded-lg bg-zinc-50 p-2 text-sm italic truncate text-zinc-600">
                      "{alert.note}"
                    </p>
                  )}
                  {alert.resolutionNote && (
                    <div className="mt-3 pt-3 border-t border-zinc-100">
                      <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1">Staff Resolution Note</p>
                      <p className="text-sm text-emerald-700 bg-emerald-50 p-2 rounded-lg italic">
                        "{alert.resolutionNote}"
                      </p>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="bg-white border border-dashed border-zinc-200 rounded-2xl p-12 flex flex-col items-center justify-center text-center">
            <div className="w-12 h-12 bg-zinc-50 text-zinc-300 rounded-full flex items-center justify-center mb-4">
              {viewMode === 'active' ? <AlertTriangle className="w-6 h-6" /> : <History className="w-6 h-6" />}
            </div>
            <h3 className="text-zinc-900 font-semibold">
              {viewMode === 'active' ? 'No active alerts' : 'No history found'}
            </h3>
            <p className="text-zinc-500 text-sm mt-1">
              {viewMode === 'active' 
                ? "You don't have any pending SOS requests." 
                : "Your past requests will appear here."}
            </p>
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="pt-6 border-t border-zinc-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-zinc-500">
            Showing page <span className="font-medium text-zinc-900">{currentPage}</span> of <span className="font-medium text-zinc-900">{totalPages}</span>
          </div>
          <div className="flex items-center gap-1">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="h-9"
            >
              Previous
            </Button>
            <div className="flex items-center px-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
                    currentPage === page 
                      ? 'bg-indigo-600 text-white shadow-md' 
                      : 'text-zinc-600 hover:bg-zinc-100'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="h-9"
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
