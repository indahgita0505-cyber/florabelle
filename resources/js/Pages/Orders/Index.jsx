import { Head, Link } from '@inertiajs/react';
import UserDashboardLayout from '@/Layouts/UserDashboardLayout';
import dayjs from 'dayjs';

export default function Index({ orders }) {
    const getStatusColor = (status) => {
        switch (status) {
            case 'pending': return 'bg-yellow-100 text-yellow-600 border-yellow-200';
            case 'processing': return 'bg-blue-100 text-blue-600 border-blue-200';
            case 'completed': return 'bg-green-100 text-green-600 border-green-200';
            case 'cancelled': return 'bg-red-100 text-red-600 border-red-200';
            default: return 'bg-slate-100 text-slate-600 border-slate-200';
        }
    };

    return (
        <UserDashboardLayout activeNav="orders">
            <Head title="Riwayat Pesanan — Florabelle.id" />

            <div className="max-w-4xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-extrabold text-slate-800">Riwayat Pesanan</h1>
                        <p className="text-sm text-slate-500 mt-1">Lacak status pesanan dan riwayat belanja Anda.</p>
                    </div>
                </div>

                {orders.length === 0 ? (
                    <div className="text-center py-24 bg-white rounded-3xl shadow-sm border border-slate-100">
                        <div className="text-6xl mb-4">🛍️</div>
                        <h3 className="text-xl font-bold text-slate-700 mb-2">Belum ada pesanan</h3>
                        <p className="text-slate-500 mb-8 max-w-sm mx-auto text-sm">Yuk, mulai pilih buket cantik untuk momen spesial Anda hari ini!</p>
                        <Link href="/dashboard" className="bg-pink-500 text-white px-8 py-3 rounded-xl font-bold hover:bg-pink-600 transition shadow-sm hover:shadow-md">
                            Mulai Belanja
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {orders.map(order => (
                            <div key={order.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-shadow duration-300">
                                <div className="bg-slate-50/50 px-6 py-4 border-b border-slate-100 flex flex-wrap justify-between items-center gap-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center text-xl">
                                            🌸
                                        </div>
                                        <div>
                                            <div className="text-xs font-medium text-slate-500 mb-1">
                                                {dayjs(order.created_at).format('DD MMM YYYY, HH:mm')}
                                            </div>
                                            <div className="font-bold text-slate-800">
                                                Order ID: <span className="text-pink-500">#{order.id}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className={`px-3 py-1.5 rounded-xl text-[11px] font-extrabold uppercase tracking-widest border ${getStatusColor(order.status)}`}>
                                            {order.status}
                                        </span>
                                        <Link href={route('orders.show', order.id)} className="text-sm bg-white text-slate-700 border border-slate-200 font-bold px-4 py-2 rounded-xl hover:bg-slate-50 hover:text-pink-600 transition shadow-sm">
                                            Lihat Detail
                                        </Link>
                                    </div>
                                </div>
                                <div className="p-6">
                                    {order.items.slice(0, 2).map((item, index) => (
                                        <div key={item.id} className={`flex items-center justify-between ${index > 0 ? 'mt-4 pt-4 border-t border-slate-50' : ''}`}>
                                            <div className="flex items-center gap-4">
                                                <div className="w-16 h-16 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-center text-2xl">
                                                    💐
                                                </div>
                                                <div>
                                                    <div className="font-bold text-slate-800 text-sm">{item.product_name}</div>
                                                    <div className="text-xs text-slate-500 mt-1">{item.quantity} x Rp {Number(item.price).toLocaleString('id-ID')}</div>
                                                </div>
                                            </div>
                                            <div className="font-extrabold text-slate-700 text-sm">
                                                Rp {(item.quantity * item.price).toLocaleString('id-ID')}
                                            </div>
                                        </div>
                                    ))}
                                    
                                    {order.items.length > 2 && (
                                        <div className="mt-4 text-xs font-medium text-slate-400 bg-slate-50 rounded-lg py-2 text-center border border-slate-100">
                                            + {order.items.length - 2} produk lainnya
                                        </div>
                                    )}

                                    <div className="mt-6 pt-4 border-t border-slate-100 flex justify-between items-center">
                                        <div className="text-slate-500 font-medium text-sm">Total Belanja:</div>
                                        <div className="font-black text-xl text-pink-500">Rp {Number(order.total).toLocaleString('id-ID')}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </UserDashboardLayout>
    );
}
