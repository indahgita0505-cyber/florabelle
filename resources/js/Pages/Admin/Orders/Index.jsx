import { Head, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { useState } from 'react';

export default function OrderIndex({ orders }) {
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Buka Modal
    const openModal = (order) => {
        setSelectedOrder(order);
        setIsModalOpen(true);
    };

    // Tutup Modal
    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedOrder(null);
    };

    // Update Status
    const updateStatus = (id, newStatus) => {
        router.patch(route('admin.orders.status.update', id), {
            status: newStatus
        }, {
            preserveScroll: true,
            onSuccess: () => {
                if(isModalOpen) closeModal();
            }
        });
    };

    const getStatusColor = (status) => {
        switch(status) {
            case 'Menunggu Pembayaran':
                return 'bg-amber-100 text-amber-700 border-amber-200';
            case 'Sedang Dirangkai':
                return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'Selesai / Dikirim':
                return 'bg-emerald-100 text-emerald-700 border-emerald-200';
            default:
                return 'bg-slate-100 text-slate-700 border-slate-200';
        }
    };

    return (
        <AdminLayout>
            <Head title="Daftar Pesanan - Florabelle.id" />

            <div className="space-y-6">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">Manajemen Pesanan</h2>
                    <p className="text-slate-500 mt-1">Kelola dan pantau semua pesanan pelanggan di sini.</p>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="px-6 py-5 border-b border-slate-200 flex items-center justify-between">
                        <h3 className="text-lg font-bold text-slate-800">Daftar Pesanan</h3>
                    </div>
                    
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 text-slate-500 text-sm">
                                    <th className="px-6 py-4 font-semibold border-b border-slate-200">ID Pesanan</th>
                                    <th className="px-6 py-4 font-semibold border-b border-slate-200">Pembeli</th>
                                    <th className="px-6 py-4 font-semibold border-b border-slate-200">Tanggal</th>
                                    <th className="px-6 py-4 font-semibold border-b border-slate-200">Total Harga</th>
                                    <th className="px-6 py-4 font-semibold border-b border-slate-200">Status</th>
                                    <th className="px-6 py-4 font-semibold border-b border-slate-200 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm divide-y divide-slate-100">
                                {orders.map((order, idx) => (
                                    <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-slate-900">{order.id}</td>
                                        <td className="px-6 py-4 text-slate-600 font-semibold">{order.customer_name}</td>
                                        <td className="px-6 py-4 text-slate-500">{order.date}</td>
                                        <td className="px-6 py-4 font-bold text-slate-700">Rp {order.total_price.toLocaleString('id-ID')}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1.5 rounded-full text-xs font-bold border ${getStatusColor(order.status)}`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button 
                                                onClick={() => openModal(order)}
                                                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition"
                                            >
                                                Lihat Detail
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Modal Detail Pesanan */}
            {isModalOpen && selectedOrder && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <div 
                        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                        onClick={closeModal}
                    ></div>

                    {/* Modal Content */}
                    <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
                        {/* Header Modal */}
                        <div className="px-8 py-5 border-b border-slate-100 flex items-center justify-between shrink-0">
                            <div>
                                <h3 className="text-xl font-bold text-slate-800">Detail Pesanan {selectedOrder.id}</h3>
                                <p className="text-sm text-slate-500 mt-1">{selectedOrder.date}</p>
                            </div>
                            <button 
                                onClick={closeModal}
                                className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-800 transition"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Body Modal */}
                        <div className="p-8 overflow-y-auto">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-8">
                                <div>
                                    <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Informasi Pembeli</h4>
                                    <p className="font-bold text-slate-800 text-lg">{selectedOrder.customer_name}</p>
                                    <p className="text-slate-600 mt-1">{selectedOrder.details.address}</p>
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Pembayaran</h4>
                                    <p className="font-bold text-pink-600 text-2xl">Rp {selectedOrder.total_price.toLocaleString('id-ID')}</p>
                                    <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(selectedOrder.status)}`}>
                                        {selectedOrder.status}
                                    </span>
                                </div>
                            </div>

                            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                                <h4 className="font-bold text-slate-700 mb-4 border-b border-slate-200 pb-2">Rincian Produk</h4>
                                <ul className="space-y-3 text-sm">
                                    <li className="flex justify-between">
                                        <span className="text-slate-500">Jenis Buket</span>
                                        <span className="font-bold text-slate-800">{selectedOrder.details.bouquet_type}</span>
                                    </li>
                                    <li className="flex justify-between">
                                        <span className="text-slate-500">Isi Buket</span>
                                        <span className="font-semibold text-slate-700">{selectedOrder.details.contents}</span>
                                    </li>
                                    <li className="flex justify-between">
                                        <span className="text-slate-500">Tema Warna</span>
                                        <span className="font-semibold text-slate-700">{selectedOrder.details.color}</span>
                                    </li>
                                    <li className="flex justify-between">
                                        <span className="text-slate-500">Wrapping</span>
                                        <span className="font-semibold text-slate-700">{selectedOrder.details.wrapping}</span>
                                    </li>
                                    {selectedOrder.details.message && (
                                        <li className="pt-3 mt-3 border-t border-slate-200">
                                            <span className="block text-slate-500 mb-1">Pesan Kartu Ucapan:</span>
                                            <span className="block font-medium text-slate-700 italic bg-white p-3 rounded-lg border border-slate-100">"{selectedOrder.details.message}"</span>
                                        </li>
                                    )}
                                </ul>
                            </div>
                        </div>

                        {/* Footer Modal / Action Buttons */}
                        <div className="px-8 py-5 border-t border-slate-100 bg-slate-50 flex items-center justify-between shrink-0">
                            <span className="text-sm font-semibold text-slate-500">Ubah Status:</span>
                            <div className="flex gap-2">
                                <button 
                                    onClick={() => updateStatus(selectedOrder.id, 'Menunggu Pembayaran')}
                                    className="px-4 py-2 bg-white border border-amber-200 text-amber-700 hover:bg-amber-50 text-xs font-bold rounded-xl transition shadow-sm"
                                >
                                    Menunggu
                                </button>
                                <button 
                                    onClick={() => updateStatus(selectedOrder.id, 'Sedang Dirangkai')}
                                    className="px-4 py-2 bg-white border border-blue-200 text-blue-700 hover:bg-blue-50 text-xs font-bold rounded-xl transition shadow-sm"
                                >
                                    Dirangkai
                                </button>
                                <button 
                                    onClick={() => updateStatus(selectedOrder.id, 'Selesai / Dikirim')}
                                    className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 border border-emerald-600 text-white text-xs font-bold rounded-xl transition shadow-sm"
                                >
                                    Dikirim
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
