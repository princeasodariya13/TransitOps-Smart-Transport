import { useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';
import { Menu, Bell } from 'lucide-react';

const pageTitles = {
    '/dashboard': 'Command Center',
    '/dashboard/vehicles': 'Vehicle Registry',
    '/dashboard/drivers': 'Driver Workforce',
    '/dashboard/trips': 'Trip Management',
    '/dashboard/maintenance': 'Maintenance Logs',
    '/dashboard/fuel': 'Fuel Logs',
    '/dashboard/analytics': 'Analytics',
};

const DashboardLayout = () => {
    const { user, loading } = useAuth();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const location = useLocation();

    if (loading) return (
        <div className="flex items-center justify-center h-screen bg-slate-50">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600"></div>
        </div>
    );

    if (!user) return <Navigate to="/login" replace />;

    const pageTitle = pageTitles[location.pathname] || 'FleetFlow';

    return (
        <div className="flex min-h-screen bg-slate-50">
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            {/* Main content area — offset only on desktop */}
            <div className="flex-1 flex flex-col lg:ml-64 min-w-0">

                {/* ── MOBILE TOP NAV BAR ── */}
                <header className="lg:hidden sticky top-0 z-30 bg-white border-b border-slate-100 px-4 py-3 flex items-center justify-between shadow-sm">
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
                    >
                        <Menu size={22} />
                    </button>
                    <h2 className="font-bold text-slate-800 text-base">{pageTitle}</h2>
                    <div className="w-9 h-9 rounded-full bg-primary-500 flex items-center justify-center text-white text-sm font-bold">
                        {user?.name?.charAt(0)?.toUpperCase()}
                    </div>
                </header>

                {/* ── PAGE CONTENT ── */}
                <main className="flex-1 p-4 sm:p-6 lg:p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
