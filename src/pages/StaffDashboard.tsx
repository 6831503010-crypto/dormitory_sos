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
  const [sortBy, setSortBy] = useState<'Time' | 'Priority'>('Time');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // 1. Filter
  const filteredAlerts = alerts
    .filter(a => filter === 'All' || a.status === filter)
    .filter(a => 
      a.studentName.toLowerCase().includes(search.toLowerCase()) || 
      a.category.toLowerCase().includes(search.toLowerCase()) ||
      a.location.room.includes(search)
    );

  // 2. Sort
  const sortedAlerts = [...filteredAlerts].sort((a, b) => {
    if (sortBy === 'Priority') {
      const priorityMap = { 'High': 3, 'Medium': 2, 'Low': 1 };
      const aVal = priorityMap[a.aiPriority as keyof typeof priorityMap] || 0;
      const bVal = priorityMap[b.aiPriority as keyof typeof priorityMap] || 0;
      if (bVal !== aVal) return bVal - aVal;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  // 3. Paginate
  const totalPages = Math.ceil(sortedAlerts.length / itemsPerPage);
  const paginatedAlerts = sortedAlerts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const activeCount = alerts.filter(a => a.status !== 'Resolved' && a.status !== 'Cancelled').length;

  const handleFilterChange = (s: Status | 'All') => {
    setFilter(s);
    setCurrentPage(1);
  };

  const handleSearchChange = (val: string) => {
    setSearch(val);
    setCurrentPage(1);
  };

  const handleSortChange = (val: 'Time' | 'Priority') => {
    setSortBy(val);
    setCurrentPage(1);
  };

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
              onChange={e => handleSearchChange(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-100 pb-4">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          <Button 
            variant={filter === 'All' ? 'primary' : 'outline'} 
            size="sm" 
            onClick={() => handleFilterChange('All')}
            className="rounded-full whitespace-nowrap"
          >
            All Alerts
          </Button>
          {(['Sent', 'Received', 'On the Way', 'Resolved', 'Cancelled'] as Status[]).map(s => (
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

        <div className="flex items-center gap-3 self-end md:self-auto">
          <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Sort By(Descending):</span>
          <div className="flex bg-zinc-100 p-1 rounded-lg">
            <button 
              onClick={() => handleSortChange('Time')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${sortBy === 'Time' ? 'bg-white text-indigo-600 shadow-sm' : 'text-zinc-500 hover:text-zinc-700'}`}
            >
              Time
            </button>
            <button 
              onClick={() => handleSortChange('Priority')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${sortBy === 'Priority' ? 'bg-white text-indigo-600 shadow-sm' : 'text-zinc-500 hover:text-zinc-700'}`}
            >
              AI Priority
            </button>
          </div>
        </div>
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
              {paginatedAlerts.map(alert => (
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
              {paginatedAlerts.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-zinc-400 italic">
                    No alerts found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="px-6 py-4 bg-zinc-50 border-t border-zinc-200 flex items-center justify-between">
            <div className="text-xs text-zinc-500">
              Showing <span className="font-medium text-zinc-900">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="font-medium text-zinc-900">{Math.min(currentPage * itemsPerPage, sortedAlerts.length)}</span> of <span className="font-medium text-zinc-900">{sortedAlerts.length}</span> alerts
            </div>
            <div className="flex items-center gap-1">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="h-8 px-2"
              >
                Previous
              </Button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-8 h-8 rounded-md text-xs font-medium transition-colors ${
                    currentPage === page 
                      ? 'bg-indigo-600 text-white' 
                      : 'text-zinc-600 hover:bg-zinc-200'
                  }`}
                >
                  {page}
                </button>
              ))}
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="h-8 px-2"
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
