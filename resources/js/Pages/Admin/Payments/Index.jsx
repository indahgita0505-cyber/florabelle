import { Head, router, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { useState } from 'react';

export default function PaymentIndex({ payments }) {
    const [lightboxImage, setLightboxImage] = useState(null);
    const [rejectingOrder, setRejectingOrder] = useState(null);

    const { data, setData, patch, processing, errors, reset, clearErrors } = useForm({
        reason: ''
    });

    // Lightbox Handlers
    const openLightbox = (url) => setLightboxImage(url);
    const closeLightbox = () => setLightboxImage(null);

    // Reject Modal Handlers
    const openRejectModal = (order) => {
        clearErrors();
        reset();
        setRejectingOrder(order);
    };
    
    const closeRejectModal = () => {
        setRejectingOrder(null);
        reset();
        clearErrors();
    };

    // Actions
    const handleApprove = (id) => {
        if (confirm('Yakin ingin menerima pembayaran ini? Status pesanan akan otomatis menjadi "Sedang Dirangkai".')) {
            router.patch(route('admin.payments.approve', id), {}, { preserveScroll: true });
        }
    };

    const handleRejectSubmit = (e) => {
        e.preventDefault();
        patch(route('admin.payments.reject', rejectingOrder.real_id || rejectingOrder.id), {
            preserveScroll: true,
            onSuccess: () => closeRejectModal(),
        });
    };

    return (
        <AdminLayout>
            <Head title="Verifikasi Pembayaran - Florabelle.id" />

            <div className="space-y-6">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">Verifikasi Pembayaran</h2>
                    <p className="text-slate-500 mt-1">Periksa dan validasi bukti transfer yang diunggah oleh pembeli.</p>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 text-slate-500 text-sm">
                                    <th className="px-6 py-4 font-semibold border-b border-slate-200">ID Pesanan</th>
                                    <th className="px-6 py-4 font-semibold border-b border-slate-200">Pembeli</th>
                                    <th className="px-6 py-4 font-semibold border-b border-slate-200">Metode</th>
                                    <th className="px-6 py-4 font-semibold border-b border-slate-200">Total Tagihan</th>
                                    <th className="px-6 py-4 font-semibold border-b border-slate-200">Bukti Transfer</th>
                                    <th className="px-6 py-4 font-semibold border-b border-slate-200 text-right w-48">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm divide-y divide-slate-100">
                                {payments.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-10 text-center text-slate-400">
                                            Tidak ada pembayaran yang menunggu verifikasi saat ini.
                                        </td>
                                    </tr>
                                ) : (
                                    payments.map((payment) => (
                                        <tr key={payment.id} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <p className="font-bold text-slate-800">{payment.id}</p>
                                                <p className="text-xs text-slate-400 mt-0.5">{payment.created_at}</p>
                                                {payment.is_dummy && (
                                                    <span className="inline-block mt-1 bg-amber-100 text-amber-700 text-[10px] px-2 py-0.5 rounded-full font-bold">DUMMY</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 font-semibold text-slate-700">{payment.customer_name}</td>
                                            <td className="px-6 py-4">
                                                <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-600 font-semibold text-xs">
                                                    {payment.payment_method}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 font-bold text-pink-600">
                                                Rp {parseFloat(payment.total).toLocaleString('id-ID')}
                                            </td>
                                            <td className="px-6 py-4">
                                                {payment.payment_proof_url ? (
                                                    <div className="flex items-center gap-3">
                                                        <button 
                                                            onClick={() => openLightbox(payment.payment_proof_url)}
                                                            className="w-12 h-16 rounded-lg overflow-hidden border-2 border-slate-200 hover:border-pink-400 transition-colors shrink-0 shadow-sm relative group"
                                                        >
                                                            <img src={payment.payment_proof_url} alt="Bukti Transfer" className="w-full h-full object-cover" />
                                                            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></svg>
                                                            </div>
                                                        </button>
                                                        {payment.payment_status === 'rejected' && (
                                                            <span className="text-xs font-semibold text-red-500 bg-red-50 px-2 py-1 rounded-md">Ditolak: {payment.rejection_reason}</span>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <span className="text-xs text-slate-400 italic">Belum diunggah</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                {payment.payment_status === 'pending' ? (
                                                    <div className="flex items-center justify-end gap-2">
                                                        <button 
                                                            onClick={() => openRejectModal(payment)}
                                                            className="px-3 py-2 bg-red-50 hover:bg-red-100 text-red-600 font-bold text-xs rounded-lg transition"
                                                        >
                                                            Tolak
                                                        </button>
                                                        <button 
                                                            onClick={() => handleApprove(payment.real_id || payment.id)}
                                                            disabled={!payment.payment_proof_url}
                                                            className="px-3 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs rounded-lg transition disabled:opacity-50 shadow-sm"
                                                        >
                                                            Terima
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <span className="text-xs font-bold text-red-500 bg-red-50 px-3 py-1.5 rounded-lg">Menunggu Re-upload</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Lightbox / Image Modal */}
            {lightboxImage && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/90 backdrop-blur-sm cursor-zoom-out" onClick={closeLightbox}></div>
                    <div className="relative max-w-3xl max-h-[90vh] w-full flex items-center justify-center animate-in zoom-in-95 duration-200">
                        <img src={lightboxImage} alt="Bukti Transfer Zoom" className="max-w-full max-h-[90vh] rounded-lg shadow-2xl" />
                        <button 
                            onClick={closeLightbox}
                            className="absolute -top-4 -right-4 w-10 h-10 bg-white text-slate-800 rounded-full flex items-center justify-center shadow-lg hover:bg-slate-100 transition"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    </div>
                </div>
            )}

            {/* Modal Tolak Pembayaran */}
            {rejectingOrder && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={closeRejectModal}></div>
                    <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md animate-in zoom-in-95 duration-200">
                        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
                            <h3 className="text-lg font-bold text-red-600">Tolak Pembayaran</h3>
                            <button onClick={closeRejectModal} className="text-slate-400 hover:text-slate-600">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>
                        
                        <div className="p-6">
                            <p className="text-sm text-slate-600 mb-4">
                                Masukkan alasan mengapa bukti transfer untuk pesanan <strong>{rejectingOrder.id}</strong> ditolak. Pembeli akan diminta untuk mengunggah ulang bukti pembayaran.
                            </p>
                            <form id="rejectForm" onSubmit={handleRejectSubmit}>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Alasan Penolakan</label>
                                <textarea 
                                    rows="3" 
                                    value={data.reason}
                                    onChange={e => setData('reason', e.target.value)}
                                    className="w-full rounded-xl border-slate-200 bg-slate-50 focus:border-red-300 focus:ring focus:ring-red-100 p-3 text-sm"
                                    placeholder="Contoh: Foto blur, nominal transfer kurang Rp 5.000, struk palsu..."
                                    required
                                ></textarea>
                                {errors.reason && <p className="text-sm text-red-500 mt-1">{errors.reason}</p>}
                            </form>
                        </div>
                        
                        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 rounded-b-3xl flex justify-end gap-3">
                            <button onClick={closeRejectModal} className="px-4 py-2 bg-white border border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50 transition">Batal</button>
                            <button type="submit" form="rejectForm" disabled={processing} className="px-4 py-2 bg-red-500 text-white font-bold rounded-xl hover:bg-red-600 transition disabled:opacity-75">
                                {processing ? 'Memproses...' : 'Kirim Penolakan'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
