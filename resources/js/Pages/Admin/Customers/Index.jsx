import { Head, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { useState } from 'react';
import { Crown, Star, Leaf } from 'lucide-react';

export default function CustomerIndex({ customers, filters }) {
    const [search, setSearch] = useState(filters.search || '');
    const [selectedCustomer, setSelectedCustomer] = useState(null);

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('admin.customers.index'), { search }, { preserveState: true, preserveScroll: true });
    };

    const handleClearSearch = () => {
        setSearch('');
        router.get(route('admin.customers.index'), {}, { preserveState: true, preserveScroll: true });
    };

    return (
        <AdminLayout>
            <Head title="Data Pelanggan - Florabelle.id" />

            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800">Data Pelanggan</h2>
                        <p className="text-slate-500 mt-1">Kelola data dan lihat riwayat belanja pembeli Anda.</p>
                    </div>

                    {/* Search Bar */}
                    <form onSubmit={handleSearch} className="flex gap-2">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Cari nama atau email..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full sm:w-64 pl-10 pr-4 py-2 rounded-xl border-slate-200 bg-white focus:border-pink-300 focus:ring focus:ring-pink-100 transition-all text-sm shadow-sm"
                            />
                            <svg className="w-5 h-5 absolute left-3 top-2.5 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></svg>
                        </div>
                        <button type="submit" className="px-4 py-2 bg-pink-500 hover:bg-pink-600 text-white font-bold rounded-xl text-sm transition shadow-sm">
                            Cari
                        </button>
                        {filters.search && (
                            <button type="button" onClick={handleClearSearch} className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-xl text-sm transition">
                                Reset
                            </button>
                        )}
                    </form>
                </div>

                {/* Customers Table */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 text-slate-500 text-sm">
                                    <th className="px-6 py-4 font-semibold border-b border-slate-200">ID Pelanggan</th>
                                    <th className="px-6 py-4 font-semibold border-b border-slate-200">Nama Lengkap</th>
                                    <th className="px-6 py-4 font-semibold border-b border-slate-200">Kontak</th>
                                    <th className="px-6 py-4 font-semibold border-b border-slate-200 text-center">Segmen</th>
                                    <th className="px-6 py-4 font-semibold border-b border-slate-200 text-center">Pesanan Selesai</th>
                                    <th className="px-6 py-4 font-semibold border-b border-slate-200 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm divide-y divide-slate-100">
                                {customers.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-10 text-center text-slate-400">
                                            {filters.search ? 'Tidak ada pelanggan yang cocok dengan pencarian Anda.' : 'Belum ada data pelanggan.'}
                                        </td>
                                    </tr>
                                ) : (
                                    customers.map((customer) => (
                                        <tr key={customer.id} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="px-6 py-4 font-mono text-slate-500">CUST-{customer.id}</td>
                                            <td className="px-6 py-4 font-bold text-slate-800">{customer.name}</td>
                                            <td className="px-6 py-4">
                                                <div className="text-slate-700">{customer.email}</div>
                                                <div className="text-xs text-slate-400 mt-1">WA: {customer.phone}</div>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                {customer.cluster ? (
                                                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold border shadow-sm
                                                        ${customer.cluster.color === 'gold' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                                                          customer.cluster.color === 'silver' ? 'bg-slate-100 text-slate-700 border-slate-200' :
                                                          'bg-orange-50 text-orange-700 border-orange-200'}
                                                    `}>
                                                        <span>
                                                            {customer.cluster.color === 'gold' && <Crown size={14} className="inline-block" />}
                                                            {customer.cluster.color === 'silver' && <Star size={14} className="inline-block" />}
                                                            {customer.cluster.color === 'bronze' && <Leaf size={14} className="inline-block" />}
                                                        </span> {customer.cluster.label}
                                                    </span>
                                                ) : (
                                                    <span className="text-xs text-slate-400 italic">Belum Cukup Data</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${customer.completed_orders_count > 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                                                    {customer.completed_orders_count} Pesanan
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button 
                                                    onClick={() => setSelectedCustomer(customer)}
                                                    className="px-3 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 font-bold rounded-lg transition text-xs inline-flex items-center gap-1"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                                    Detail
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Modal Detail Pelanggan */}
            {selectedCustomer && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setSelectedCustomer(null)}></div>
                    <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200 max-h-[90vh]">
                        
                        {/* Modal Header */}
                        <div className="px-8 py-6 border-b border-slate-100 flex items-start justify-between bg-slate-50">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 bg-pink-100 text-pink-500 rounded-full flex items-center justify-center text-xl font-bold">
                                    {selectedCustomer.name.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-slate-800">{selectedCustomer.name}</h3>
                                    <p className="text-sm text-slate-500 mt-1">Bergabung sejak: {selectedCustomer.joined_at}</p>
                                </div>
                            </div>
                            <button onClick={() => setSelectedCustomer(null)} className="text-slate-400 hover:text-slate-600 bg-white p-2 rounded-full shadow-sm">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>
                        
                        {/* Modal Body */}
                        <div className="p-8 overflow-y-auto">
                            
                            {/* Info Kontak */}
                            <div className="grid grid-cols-2 gap-4 mb-8 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                <div>
                                    <p className="text-xs text-slate-400 font-semibold mb-1">Email</p>
                                    <p className="text-sm font-bold text-slate-700">{selectedCustomer.email}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-400 font-semibold mb-1">WhatsApp</p>
                                    <p className="text-sm font-bold text-slate-700">{selectedCustomer.phone}</p>
                                </div>
                            </div>
                            
                            {selectedCustomer.cluster && (
                                <div className="mb-8 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                    <p className="text-xs text-slate-400 font-semibold mb-2 uppercase tracking-widest">Segmen Pelanggan (Data Mining)</p>
                                    <div className="flex items-center gap-3">
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl
                                            ${selectedCustomer.cluster.color === 'gold' ? 'bg-amber-100 text-amber-700 border border-amber-200' :
                                              selectedCustomer.cluster.color === 'silver' ? 'bg-slate-200 text-slate-700 border border-slate-300' :
                                              'bg-orange-100 text-orange-700 border border-orange-200'}
                                        `}>
                                            {selectedCustomer.cluster.color === 'gold' && <Crown size={24} />}
                                            {selectedCustomer.cluster.color === 'silver' && <Star size={24} />}
                                            {selectedCustomer.cluster.color === 'bronze' && <Leaf size={24} />}
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-800 text-lg">{selectedCustomer.cluster.label}</p>
                                            <p className="text-sm text-slate-500">{selectedCustomer.cluster.description}</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Riwayat Belanja */}
                            <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                                <span className="w-6 h-6 bg-blue-100 text-blue-500 rounded-md flex items-center justify-center text-xs">🛍️</span>
                                Riwayat Belanja ({selectedCustomer.history.length})
                            </h4>
                            
                            {selectedCustomer.history.length === 0 ? (
                                <div className="text-center py-8 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                                    <span className="text-3xl mb-2 block">🛒</span>
                                    <p className="text-sm text-slate-500">Pelanggan ini belum pernah membuat pesanan.</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {selectedCustomer.history.map((order, idx) => (
                                        <div key={idx} className="p-4 border border-slate-200 rounded-2xl hover:border-pink-200 transition-colors">
                                            <div className="flex justify-between items-start mb-2">
                                                <div>
                                                    <span className="font-bold text-slate-700 text-sm">{order.id}</span>
                                                    <span className="text-xs text-slate-400 ml-2">{order.date}</span>
                                                </div>
                                                <span className="font-bold text-pink-600 text-sm">Rp {parseFloat(order.total).toLocaleString('id-ID')}</span>
                                            </div>
                                            <div className="text-sm text-slate-600 bg-slate-50 p-2 rounded-lg mb-2">
                                                {order.items}
                                            </div>
                                            <div className="flex justify-end">
                                                <span className={`px-2 py-1 text-[10px] font-bold rounded-md uppercase ${
                                                    order.status.toLowerCase().includes('selesai') ? 'bg-emerald-100 text-emerald-700' : 
                                                    order.status.toLowerCase() === 'pending' ? 'bg-amber-100 text-amber-700' :
                                                    'bg-blue-100 text-blue-700'
                                                }`}>
                                                    {order.status}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
