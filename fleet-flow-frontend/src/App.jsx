import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import DashboardLayout from './layouts/DashboardLayout';
import Dashboard from './pages/Dashboard';
import Vehicles from './pages/Vehicles';
import Drivers from './pages/Drivers';
import Trips from './pages/Trips';
import Maintenance from './pages/Maintenance';
import FuelLogs from './pages/FuelLogs';
import Expenses from './pages/Expenses';
import Analytics from './pages/Analytics';
import Login from './pages/Login';
import Register from './pages/Register';
import LandingPage from './pages/Landing/LandingPage';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
      <BrowserRouter suppressHydrationWarning>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={
              <ProtectedRoute allowedRoles={['ADMIN', 'DISPATCHER', 'SAFETY_OFFICER', 'FINANCIAL_ANALYST']}>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="vehicles" element={
              <ProtectedRoute allowedRoles={['ADMIN', 'FLEET_MANAGER', 'DISPATCHER', 'FINANCIAL_ANALYST']}>
                <Vehicles />
              </ProtectedRoute>
            } />
            <Route path="drivers" element={
              <ProtectedRoute allowedRoles={['ADMIN', 'SAFETY_OFFICER']}>
                <Drivers />
              </ProtectedRoute>
            } />
            <Route path="trips" element={
              <ProtectedRoute allowedRoles={['ADMIN', 'DISPATCHER']}>
                <Trips />
              </ProtectedRoute>
            } />
            <Route path="maintenance" element={
              <ProtectedRoute allowedRoles={['ADMIN', 'FLEET_MANAGER', 'DISPATCHER']}>
                <Maintenance />
              </ProtectedRoute>
            } />
            <Route path="fuel" element={
              <ProtectedRoute allowedRoles={['ADMIN', 'DISPATCHER', 'FINANCIAL_ANALYST']}>
                <FuelLogs />
              </ProtectedRoute>
            } />
            <Route path="expenses" element={
              <ProtectedRoute allowedRoles={['ADMIN', 'DISPATCHER', 'FINANCIAL_ANALYST']}>
                <Expenses />
              </ProtectedRoute>
            } />
            <Route path="analytics" element={
              <ProtectedRoute allowedRoles={['ADMIN', 'FINANCIAL_ANALYST']}>
                <Analytics />
              </ProtectedRoute>
            } />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
