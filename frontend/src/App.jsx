import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import DashboardLayout from './components/layout/DashboardLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import GuestHouses from './pages/GuestHouses';
import Blueprint from './pages/Blueprint';
import Rooms from './pages/Rooms';
import Residents from './pages/Residents';
import Complaints from './pages/Complaints';
import { CardSkeleton } from './components/ui/Skeleton';

function PrivateRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center p-8">
        <div className="grid w-full max-w-md gap-4">
          <CardSkeleton />
          <CardSkeleton />
        </div>
      </div>
    );
  }
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <PrivateRoute>
            <DashboardLayout />
          </PrivateRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="guest-houses" element={<GuestHouses />} />
        <Route path="blueprint" element={<Blueprint />} />
        <Route path="rooms" element={<Rooms />} />
        <Route path="residents" element={<Residents />} />
        <Route path="complaints" element={<Complaints />} />
      </Route>
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
