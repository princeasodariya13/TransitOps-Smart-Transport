import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, DollarSign, FileText, Settings, Car } from 'lucide-react';
import api from '../api/api';
import { toast } from 'react-toastify';

const ExpenseModal = ({ isOpen, onClose, onRefresh, expenseEntry }) => {
    const [vehicles, setVehicles] = useState([]);
    const [trips, setTrips] = useState([]);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        vehicleId: '',
        tripId: '',
        category: 'TOLL',
        description: '',
        cost: '',
        date: new Date().toISOString().slice(0, 10),
    });

    useEffect(() => {
        if (isOpen) {
            fetchDependencies();
            if (expenseEntry) {
                setFormData({
                    vehicleId: expenseEntry.vehicleId,
                    tripId: expenseEntry.tripId || '',
                    category: expenseEntry.category,
                    description: expenseEntry.description || '',
                    cost: expenseEntry.cost.toString(),
                    date: new Date(expenseEntry.date).toISOString().slice(0, 10),
                });
            } else {
                setFormData({
                    vehicleId: '',
                    tripId: '',
                    category: 'TOLL',
                    description: '',
                    cost: '',
                    date: new Date().toISOString().slice(0, 10),
                });
            }
        }
    }, [isOpen, expenseEntry]);

    const fetchDependencies = async () => {
        try {
            const [vRes, tRes] = await Promise.all([
                api.get('/vehicles'),
                api.get('/trips'),
            ]);
            setVehicles(vRes.data.data);
            setTrips(tRes.data.data.filter(t => t.status !== 'DRAFT'));
        } catch (err) {
            toast.error('Failed to load form dependencies');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.vehicleId || !formData.cost || !formData.category) {
            toast.error('Please fill required fields');
            return;
        }

        setLoading(true);
        try {
            if (expenseEntry) {
                await api.put(`/expenses/${expenseEntry.id}`, formData);
                toast.success('Expense updated');
            } else {
                await api.post('/expenses', formData);
                toast.success('Expense logged');
            }
            onRefresh();
            onClose();
        } catch (err) {
            toast.error(err.response?.data?.error || 'Failed to save expense');
        } finally {
            setLoading(false);
        }
    };

    const categories = ['TOLL', 'PARKING', 'FINE', 'OTHER'];

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]"
                    >
                        <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                            <h2 className="text-xl font-bold text-slate-900">
                                {expenseEntry ? 'Edit Expense Log' : 'Log New Expense'}
                            </h2>
                            <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-6 overflow-y-auto custom-scrollbar">
                            <form id="expenseForm" onSubmit={handleSubmit} className="space-y-5">
                                {/* Vehicle Selection */}
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Vehicle *</label>
                                    <div className="relative">
                                        <Car className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                        <select
                                            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all outline-none text-slate-700 font-medium appearance-none"
                                            value={formData.vehicleId}
                                            onChange={(e) => setFormData({ ...formData, vehicleId: e.target.value })}
                                            required
                                        >
                                            <option value="">Select a vehicle...</option>
                                            {vehicles.map(v => (
                                                <option key={v.id} value={v.id}>{v.name} ({v.licensePlate})</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {/* Link Trip */}
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Link Trip (Optional)</label>
                                    <div className="relative">
                                        <FileText className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                        <select
                                            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-primary-500 transition-all outline-none text-slate-700 appearance-none"
                                            value={formData.tripId}
                                            onChange={(e) => setFormData({ ...formData, tripId: e.target.value })}
                                        >
                                            <option value="">No trip linked</option>
                                            {trips
                                                .filter(t => !formData.vehicleId || t.vehicleId === formData.vehicleId)
                                                .map(t => (
                                                    <option key={t.id} value={t.id}>
                                                        {t.uid} - {t.origin} to {t.destination} ({new Date(t.createdAt).toLocaleDateString()})
                                                    </option>
                                                ))}
                                        </select>
                                    </div>
                                    <p className="text-xs text-slate-400 mt-1.5 ml-1">Helps calculate accurate trip profitability</p>
                                </div>

                                <div className="grid grid-cols-2 gap-5">
                                    {/* Category */}
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">Category *</label>
                                        <div className="relative">
                                            <Settings className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                            <select
                                                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-primary-500 transition-all outline-none text-slate-700 appearance-none"
                                                value={formData.category}
                                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                                required
                                            >
                                                {categories.map(c => <option key={c} value={c}>{c}</option>)}
                                            </select>
                                        </div>
                                    </div>

                                    {/* Cost */}
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">Cost (₹) *</label>
                                        <div className="relative">
                                            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                            <input
                                                type="number"
                                                step="0.01"
                                                min="0"
                                                placeholder="0.00"
                                                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-primary-500 transition-all outline-none"
                                                value={formData.cost}
                                                onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Description */}
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Description</label>
                                    <textarea
                                        rows={2}
                                        placeholder="Reason for expense..."
                                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-primary-500 transition-all outline-none resize-none"
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    />
                                </div>

                                {/* Date */}
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Date *</label>
                                    <div className="relative">
                                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                        <input
                                            type="date"
                                            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-primary-500 transition-all outline-none"
                                            value={formData.date}
                                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>
                            </form>
                        </div>

                        <div className="p-5 border-t border-slate-100 bg-slate-50 flex space-x-3 mt-auto">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-600 rounded-xl hover:bg-white transition-colors font-semibold"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                form="expenseForm"
                                disabled={loading}
                                className="flex-1 px-4 py-2.5 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors font-semibold disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                            >
                                {loading ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        <span>Saving...</span>
                                    </>
                                ) : (
                                    <span>{expenseEntry ? 'Save Changes' : 'Save Expense'}</span>
                                )}
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default ExpenseModal;
