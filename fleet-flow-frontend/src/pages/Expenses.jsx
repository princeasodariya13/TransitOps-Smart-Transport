import { useEffect, useState, useRef } from 'react';
import { Plus, Search, Filter, IndianRupee, Receipt, MoreVertical, MapPin, Pencil, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api/api';
import ExpenseModal from '../components/ExpenseModal';
import { toast } from 'react-toastify';

// Fixed-position dropdown
const ActionMenu = ({ entry, onEdit, onDelete }) => {
    const [open, setOpen] = useState(false);
    const [coords, setCoords] = useState({ top: 0, left: 0 });
    const btnRef = useRef(null);
    const menuRef = useRef(null);

    const handleOpen = () => {
        const rect = btnRef.current.getBoundingClientRect();
        setCoords({ top: rect.bottom + 4, left: rect.right - 180 });
        setOpen(o => !o);
    };

    useEffect(() => {
        const handler = (e) => {
            if (
                menuRef.current && !menuRef.current.contains(e.target) &&
                btnRef.current && !btnRef.current.contains(e.target)
            ) setOpen(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    return (
        <>
            <button
                ref={btnRef}
                onClick={handleOpen}
                className="p-1.5 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
            >
                <MoreVertical size={18} />
            </button>

            <AnimatePresence>
                {open && (
                    <motion.div
                        ref={menuRef}
                        initial={{ opacity: 0, scale: 0.95, y: -4 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -4 }}
                        transition={{ duration: 0.12 }}
                        style={{ position: 'fixed', top: coords.top, left: coords.left, zIndex: 9999 }}
                        className="w-44 bg-white rounded-xl shadow-2xl border border-slate-100 overflow-hidden"
                    >
                        <button
                            onClick={() => { onEdit(entry); setOpen(false); }}
                            className="w-full flex items-center space-x-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                        >
                            <Pencil size={15} className="text-primary-500" />
                            <span>Edit Entry</span>
                        </button>
                        <div className="border-t border-slate-100">
                            <button
                                onClick={() => { onDelete(entry); setOpen(false); }}
                                className="w-full flex items-center space-x-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                            >
                                <Trash2 size={15} />
                                <span>Delete Expense</span>
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

// Confirm delete modal
const DeleteConfirmModal = ({ entry, onConfirm, onCancel }) => {
    if (!entry) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center space-y-4"
            >
                <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                    <Trash2 size={24} className="text-red-600" />
                </div>
                <div>
                    <h3 className="text-lg font-bold text-slate-900">Delete Expense?</h3>
                    <p className="text-sm text-slate-500 mt-1">
                        Expense for <strong>{entry.vehicle?.name}</strong> (₹{entry.cost}) will be permanently removed.
                    </p>
                </div>
                <div className="flex space-x-3 pt-2">
                    <button onClick={onCancel} className="flex-1 px-4 py-2 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors font-semibold">
                        Cancel
                    </button>
                    <button onClick={onConfirm} className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold">
                        Yes, Delete
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

const Expenses = () => {
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingEntry, setEditingEntry] = useState(null);
    const [deletingEntry, setDeletingEntry] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('ALL');

    useEffect(() => { fetchExpenses(); }, []);

    const fetchExpenses = async () => {
        setLoading(true);
        try {
            const { data: res } = await api.get('/expenses');
            setExpenses(res.data);
        } catch (err) {
            toast.error('Failed to fetch expenses');
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (entry) => {
        setEditingEntry(entry);
        setIsModalOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (!deletingEntry) return;
        try {
            await api.delete(`/expenses/${deletingEntry.id}`);
            toast.success('Expense deleted');
            setDeletingEntry(null);
            fetchExpenses();
        } catch (err) {
            toast.error(err.response?.data?.error || 'Failed to delete expense');
        }
    };

    const filteredExpenses = expenses.filter(exp => {
        const matchesSearch =
            (exp.vehicle?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (exp.vehicle?.licensePlate || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (exp.description || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (exp.uid && exp.uid.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesCategory = filterCategory === 'ALL' || exp.category === filterCategory;
        return matchesSearch && matchesCategory;
    });

    const totalCost = filteredExpenses.reduce((s, e) => s + e.cost, 0);

    return (
        <div className="space-y-5">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Expenses</h1>
                    <p className="text-slate-500 text-sm">Track miscellaneous fleet operations costs</p>
                </div>
                <button
                    onClick={() => { setEditingEntry(null); setIsModalOpen(true); }}
                    className="bg-primary-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-primary-700 transition-colors self-start sm:self-auto"
                >
                    <Plus size={18} />
                    <span className="text-sm font-medium">Log Expense</span>
                </button>
            </div>

            <ExpenseModal
                isOpen={isModalOpen}
                onClose={() => { setIsModalOpen(false); setEditingEntry(null); }}
                onRefresh={fetchExpenses}
                expenseEntry={editingEntry}
            />

            <DeleteConfirmModal
                entry={deletingEntry}
                onConfirm={handleDeleteConfirm}
                onCancel={() => setDeletingEntry(null)}
            />

            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600">
                        <Receipt size={24} />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-slate-500">Total Entries</p>
                        <p className="text-2xl font-bold text-slate-900">{filteredExpenses.length}</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center text-green-600">
                        <IndianRupee size={24} />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-slate-500">Total Expenses Cost</p>
                        <p className="text-2xl font-bold text-slate-900">₹{totalCost.toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-3 sm:p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input
                            type="text"
                            placeholder="Search by vehicle, description or ID..."
                            className="w-full pl-9 pr-4 py-2 text-gray-700 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary-500"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center space-x-2">
                        <Filter size={16} className="text-slate-400 flex-shrink-0" />
                        <select
                            className="text-sm border border-slate-200 rounded-lg px-2 py-2 outline-none focus:ring-2 focus:ring-primary-500 bg-white font-medium text-slate-700"
                            value={filterCategory}
                            onChange={(e) => setFilterCategory(e.target.value)}
                        >
                            <option value="ALL">All Categories</option>
                            <option value="TOLL">Toll</option>
                            <option value="PARKING">Parking</option>
                            <option value="FINE">Fine</option>
                            <option value="OTHER">Other</option>
                        </select>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left min-w-[800px]">
                        <thead className="bg-slate-50 border-b border-slate-100">
                            <tr>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">ID</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Vehicle</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Category</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Linked Trip</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Description</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Cost</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Date</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr><td colSpan="8" className="px-6 py-10 text-center text-slate-500 italic">Loading expenses...</td></tr>
                            ) : filteredExpenses.length === 0 ? (
                                <tr><td colSpan="8" className="px-6 py-10 text-center text-slate-500 italic">No expense entries match your search/filters</td></tr>
                            ) : filteredExpenses.map((exp) => (
                                <tr key={exp.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <span className="text-[10px] font-mono text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded leading-none uppercase">
                                            {exp.uid || exp.id.slice(-6)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div>
                                            <p className="font-semibold text-slate-900">{exp.vehicle?.name || 'Unknown'}</p>
                                            <p className="text-xs font-mono text-slate-500 uppercase">{exp.vehicle?.licensePlate || 'N/A'}</p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full uppercase
                                            ${exp.category === 'TOLL' ? 'bg-blue-50 text-blue-600' :
                                                exp.category === 'PARKING' ? 'bg-purple-50 text-purple-600' :
                                                    exp.category === 'FINE' ? 'bg-red-50 text-red-600' : 'bg-slate-100 text-slate-600'}
                                        `}>
                                            {exp.category}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        {exp.trip ? (
                                            <div className="flex items-center space-x-1.5">
                                                <MapPin size={13} className="text-primary-500" />
                                                <span className="text-xs font-medium text-primary-600 bg-primary-50 px-2 py-0.5 rounded-full">
                                                    {exp.trip.uid || exp.trip.id.slice(-6)}
                                                </span>
                                            </div>
                                        ) : (
                                            <span className="text-xs text-slate-400 italic">None</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="text-sm text-slate-700 truncate max-w-[150px]">{exp.description || '-'}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm font-bold text-slate-900">₹{exp.cost.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm text-slate-500">{new Date(exp.date).toLocaleDateString()}</span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <ActionMenu entry={exp} onEdit={handleEdit} onDelete={setDeletingEntry} />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Expenses;
