import { Head } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function AdminDashboard({ auth, summaryCards, recentOrders }) {

    return (
        <AdminLayout>
            <Head title="Dashboard Admin - Florabelle.id" />

            <div className="space-y-6">
                {/* Greeting Section */}
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">
                        Selamat datang kembali, {auth?.user?.name || 'Admin'}! 👋
                    </h2>
                    <p className="text-slate-500 mt-1">Berikut adalah ringkasan performa toko Anda hari ini.</p>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {summaryCards.map((card, idx) => (
                        <div key={idx} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex items-start gap-4">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0 ${card.color}`}>
                                {card.icon}
                            </div>
                            <div>
                                <p className="text-sm font-medium text-slate-500">{card.title}</p>
                                <p className="text-2xl font-extrabold text-slate-800 mt-1">{card.value}</p>
                                <p className="text-xs text-slate-400 mt-1 font-medium">{card.subtitle}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Recent Orders Table */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mt-8">
                    <div className="px-6 py-5 border-b border-slate-200 flex items-center justify-between">
                        <h3 className="text-lg font-bold text-slate-800">Aktivitas Terkini</h3>
                        <button className="text-sm font-semibold text-pink-600 hover:text-pink-700 transition">
                            Lihat Semua
                        </button>
                    </div>
                    
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 text-slate-500 text-sm">
                                    <th className="px-6 py-4 font-semibold border-b border-slate-200">ID Pesanan</th>
                                    <th className="px-6 py-4 font-semibold border-b border-slate-200">Pelanggan</th>
                                    <th className="px-6 py-4 font-semibold border-b border-slate-200">Status</th>
                                    <th className="px-6 py-4 font-semibold border-b border-slate-200">Total Harga</th>
                                    <th className="px-6 py-4 font-semibold border-b border-slate-200 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm divide-y divide-slate-100">
                                {recentOrders.map((order, idx) => (
                                    <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-slate-900">{order.id}</td>
                                        <td className="px-6 py-4 text-slate-600">{order.name}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${order.statusColor}`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 font-semibold text-slate-700">{order.total}</td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="text-pink-600 hover:text-pink-800 font-medium">Detail</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
