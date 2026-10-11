import { Head, Link, usePage, router } from '@inertiajs/react';
import UserDashboardLayout from '@/Layouts/UserDashboardLayout';
import dayjs from 'dayjs';

export default function Show({ order }) {
    const { flash } = usePage().props;

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
            <Head title={`Pesanan #${order.id} — Florabelle.id`} />

            <div className="max-w-4xl mx-auto">
                <div className="mb-6 flex items-center justify-between">
                    <Link href={route('orders.index')} className="text-slate-500 hover:text-pink-500 transition flex items-center gap-2 font-bold text-sm bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-100">
                        ← Kembali ke Riwayat
                    </Link>
                </div>

                {flash?.success && (
                    <div className="bg-green-50 border border-green-200 text-green-600 px-5 py-3.5 rounded-2xl mb-6 shadow-sm font-medium flex items-center gap-3">
                        <span className="text-xl">✅</span>
                        {flash.success}
                    </div>
                )}

                <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                    <div className="bg-pink-50/50 px-8 py-6 border-b border-pink-100 flex flex-wrap justify-between items-start gap-4">
                        <div className="flex items-center gap-5">
                            <div className="w-14 h-14 bg-white rounded-2xl shadow-sm border border-pink-100 flex items-center justify-center text-2xl">
                                🛍️
                            </div>
                            <div>
                                <h1 className="text-2xl font-extrabold text-slate-800 mb-1">Order <span className="text-pink-500">#{order.id}</span></h1>
                                <p className="text-slate-500 text-sm font-medium">{dayjs(order.created_at).format('DD MMMM YYYY, HH:mm')}</p>
                            </div>
                        </div>
                        <div className={`px-4 py-2 rounded-xl text-xs font-extrabold uppercase tracking-wider border shadow-sm bg-white ${getStatusColor(order.status)}`}>
                            Status: {order.status}
                        </div>
                    </div>

                    <div className="p-8">
                        <div className="grid md:grid-cols-2 gap-8 mb-8 pb-8 border-b border-slate-100">
                            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                                <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                    <span>📍</span> Detail Pengiriman
                                </h3>
                                <p className="font-bold text-slate-800">{order.customer_name}</p>
                                <p className="text-slate-600 font-medium mt-1">{order.customer_phone}</p>
                                <p className="text-slate-500 text-sm mt-2 leading-relaxed">{order.customer_address}</p>
                            </div>
                            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                                <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                    <span>💳</span> Informasi Pembayaran
                                </h3>
                                <p className="text-slate-600 font-medium">Metode: <span className="font-bold text-slate-800 capitalize">{order.payment_method}</span></p>
                                {order.notes && (
                                    <div className="mt-4 p-3 bg-yellow-50/80 text-yellow-700 rounded-xl text-sm border border-yellow-200/50">
                                        <span className="font-bold block mb-1 text-xs uppercase tracking-wider">Catatan Tambahan:</span>
                                        {order.notes}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div>
                            <h3 className="text-lg font-extrabold text-slate-800 mb-5 flex items-center gap-2">
                                <span>💐</span> Daftar Produk
                            </h3>
                            <div className="space-y-3">
                                {order.items.map(item => (
                                    <div key={item.id} className="flex justify-between items-center bg-white border border-slate-100 p-4 rounded-2xl hover:shadow-sm transition-shadow">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-xl">
                                                📦
                                            </div>
                                            <div>
                                                <div className="font-bold text-slate-800">{item.product_name}</div>
                                                <div className="text-sm font-medium text-slate-500 mt-0.5">{item.quantity} x Rp {Number(item.price).toLocaleString('id-ID')}</div>
                                            </div>
                                        </div>
                                        <div className="font-black text-slate-700">
                                            Rp {(item.quantity * item.price).toLocaleString('id-ID')}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center md:items-end gap-4">
                            <div className="text-slate-400 text-sm font-medium text-center md:text-left">
                                Harap selesaikan pembayaran sesuai instruksi<br className="hidden md:block" /> atau hubungi admin jika ada kendala.
                            </div>
                            <div className="flex flex-col gap-4 w-full md:w-auto">
                                <div className="text-center md:text-right bg-pink-50/50 p-5 rounded-2xl border border-pink-100/50 min-w-[240px]">
                                    <div className="text-xs font-bold text-pink-400 uppercase tracking-widest mb-1">Total Pembayaran</div>
                                    <div className="text-3xl font-black text-pink-500">
                                        Rp {Number(order.total).toLocaleString('id-ID')}
                                    </div>
                                </div>
                                
                                {order.status === 'pending' && (
                                    <button 
                                        onClick={() => {
                                            if (confirm('Simulasikan pembayaran berhasil dari Gateway?')) {
                                                router.post(route('orders.simulate-payment', order.id));
                                            }
                                        }}
                                        className="w-full bg-slate-800 text-white font-bold py-3 px-4 rounded-xl hover:bg-slate-900 transition-colors shadow-sm"
                                    >
                                        Simulasikan Pembayaran (Testing)
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </UserDashboardLayout>
    );
}
