import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    Truck,
    Users,
    MapPin,
    Wrench,
    Fuel,
    BarChart3,
    ChevronRight,
    Receipt,
    LogOut,
    X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import logo from '../logo.png';

const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard', roles: ['ADMIN', 'FLEET_MANAGER', 'DISPATCHER', 'SAFETY_OFFICER', 'FINANCIAL_ANALYST'] },
    { name: 'Vehicles', icon: Truck, path: '/dashboard/vehicles', roles: ['ADMIN', 'FLEET_MANAGER', 'DISPATCHER', 'FINANCIAL_ANALYST'] },
    { name: 'Drivers', icon: Users, path: '/dashboard/drivers', roles: ['ADMIN', 'SAFETY_OFFICER'] },
    { name: 'Trips', icon: MapPin, path: '/dashboard/trips', roles: ['ADMIN', 'DISPATCHER'] },
    { name: 'Maintenance', icon: Wrench, path: '/dashboard/maintenance', roles: ['ADMIN', 'FLEET_MANAGER', 'DISPATCHER'] },
    { name: 'Fuel Logs', icon: Fuel, path: '/dashboard/fuel', roles: ['ADMIN', 'DISPATCHER', 'FINANCIAL_ANALYST'] },
    { name: 'Expenses', icon: Receipt, path: '/dashboard/expenses', roles: ['ADMIN', 'DISPATCHER', 'FINANCIAL_ANALYST'] },
    { name: 'Analytics', icon: BarChart3, path: '/dashboard/analytics', roles: ['ADMIN', 'FINANCIAL_ANALYST'] },
];

const SidebarContent = ({ user, logout, location, onClose }) => {
    const filteredItems = menuItems.filter(item => item.roles.includes(user?.role));

    return (
        <div className="flex flex-col h-full">
            {/* Header */}
            <div className="p-5 flex items-center justify-between border-b border-slate-800">
                <div className="flex items-center space-x-3">
                    <img src={logo} alt="FleetFlow Logo" className="w-9 h-9 object-contain" />
                    <h1 className="text-xl font-bold text-primary-400">FleetFlow</h1>
                </div>
                {/* Close button — only shows on mobile */}
                {onClose && (
                    <button
                        onClick={onClose}
                        className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                    >
                        <X size={20} />
                    </button>
                )}
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
                {filteredItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <Link
                            key={item.name}
                            to={item.path}
                            onClick={onClose}
                            className={`flex items-center justify-between p-3 rounded-xl transition-all group ${
                                isActive
                                    ? 'bg-primary-600 text-white shadow-lg shadow-primary-900/40'
                                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                            }`}
                        >
                            <div className="flex items-center space-x-3">
                                <item.icon size={19} />
                                <span className="font-medium text-sm">{item.name}</span>
                            </div>
                            {isActive && <ChevronRight size={15} className="opacity-70" />}
                        </Link>
                    );
                })}
            </nav>

            {/* Footer: user + logout */}
            <div className="p-3 border-t border-slate-800">
                <div className="flex items-center space-x-3 px-3 py-2 mb-1">
                    <div className="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center text-xs font-bold flex-shrink-0">
                        {user?.name?.charAt(0)?.toUpperCase()}
                    </div>
                    <div className="min-w-0">
                        <p className="text-sm font-semibold text-white truncate">{user?.name}</p>
                        <p className="text-[10px] text-slate-400 truncate">{user?.role?.replace(/_/g, ' ')}</p>
                    </div>
                </div>
            </div>
            
            <div className="px-3 pb-3">
                <button
                    onClick={logout}
                    className="flex items-center space-x-3 w-full p-3 rounded-xl text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
                >
                    <LogOut size={18} />
                    <span className="text-sm font-medium">Logout</span>
                </button>
            </div>
        </div>
    );
};

const Sidebar = ({ isOpen, onClose }) => {
    const { user, logout } = useAuth();
    const location = useLocation();

    return (
        <>
            {/* ── MOBILE OVERLAY ── */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm"
                    onClick={onClose}
                />
            )}

            {/* ── MOBILE DRAWER ── */}
            <div className={`
                fixed top-0 left-0 h-full w-64 bg-slate-900 text-white z-50
                transform transition-transform duration-300 ease-in-out
                lg:hidden
                ${isOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
                <SidebarContent user={user} logout={logout} location={location} onClose={onClose} />
            </div>

            {/* ── DESKTOP STATIC SIDEBAR ── */}
            <div className="hidden lg:flex flex-col w-64 h-screen bg-slate-900 text-white fixed left-0 top-0">
                <SidebarContent user={user} logout={logout} location={location} onClose={null} />
            </div>
        </>
    );
};

export default Sidebar;
