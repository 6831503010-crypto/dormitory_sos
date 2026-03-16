import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useLocalStorage } from './hooks/useLocalStorage';
import { INITIAL_ALERTS } from './data/mockData';
import { Alert, User } from './types';
import { Layout } from './components/Layout';
import { Login } from './pages/Login';
import { StudentDashboard } from './pages/StudentDashboard';
import { SOSForm } from './pages/SOSForm';
import { StaffDashboard } from './pages/StaffDashboard';
import { AlertDetails } from './pages/AlertDetails';

export default function App() {
  const [user, setUser] = useLocalStorage<User | null>('dorm-sos-user', null);
  const [alerts, setAlerts] = useLocalStorage<Alert[]>('dorm-sos-alerts', INITIAL_ALERTS);

  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
  };

  const handleLogout = () => {
    setUser(null);
  };

  const handleAddAlert = (newAlert: Alert) => {
    setAlerts(prev => [newAlert, ...prev]);
  };

  const handleUpdateAlert = (id: string, updates: Partial<Alert>) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === id ? { ...alert, ...updates } : alert
    ));
  };

  return (
    <Router>
      <Layout user={user} onLogout={handleLogout}>
        <Routes>
          <Route 
            path="/" 
            element={!user ? <Login onLogin={handleLogin} /> : <Navigate to={user.role === 'student' ? '/student' : '/staff'} />} 
          />
          
          {/* Student Routes */}
          <Route 
            path="/student" 
            element={user?.role === 'student' ? <StudentDashboard user={user} alerts={alerts} /> : <Navigate to="/" />} 
          />
          <Route 
            path="/student/sos" 
            element={user?.role === 'student' ? <SOSForm user={user} onAddAlert={handleAddAlert} /> : <Navigate to="/" />} 
          />

          {/* Staff Routes */}
          <Route 
            path="/staff" 
            element={user?.role === 'staff' ? <StaffDashboard alerts={alerts} /> : <Navigate to="/" />} 
          />
          <Route 
            path="/staff/alert/:id" 
            element={user?.role === 'staff' ? <AlertDetails user={user} alerts={alerts} onUpdateAlert={handleUpdateAlert} /> : <Navigate to="/" />} 
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Layout>
    </Router>
  );
}
