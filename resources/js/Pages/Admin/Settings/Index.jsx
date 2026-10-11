import { Head, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { useState, useRef } from 'react';

export default function SettingsIndex({ settings }) {
    const fileInputRef = useRef(null);
    const [previewImage, setPreviewImage] = useState(settings.qris_image || null);

    const { data, setData, post, processing, errors } = useForm({
        bank_account: settings.bank_account || '',
        store_address: settings.store_address || '',
        whatsapp_number: settings.whatsapp_number || '',
        qris_image: null,
    });

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('qris_image', file);
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('admin.settings.update'), {
            preserveScroll: true,
            onSuccess: () => {
                // Notifikasi sukses otomatis diurus oleh flash message di layout/app
            },
        });
    };

    return (
        <AdminLayout>
            <Head title="Pengaturan Toko - Florabelle.id" />

            <div className="space-y-6 max-w-4xl">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">Pengaturan Toko</h2>
                    <p className="text-slate-500 mt-1">Kelola informasi dasar toko Anda seperti alamat, kontak, dan metode pembayaran.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Card Pembayaran */}
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-6 sm:p-8">
                        <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                            <span className="w-8 h-8 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center">💳</span>
                            Pengaturan Pembayaran
                        </h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-5">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">Nomor Rekening Toko</label>
                                    <textarea
                                        rows="3"
                                        value={data.bank_account}
                                        onChange={e => setData('bank_account', e.target.value)}
                                        placeholder="Cth: BCA 1234567890 a/n Florabelle"
                                        className="w-full rounded-xl border-slate-200 bg-slate-50 focus:border-pink-300 focus:ring focus:ring-pink-100 p-3 text-sm"
                                    ></textarea>
                                    {errors.bank_account && <p className="text-sm text-red-500 mt-1">{errors.bank_account}</p>}
                                </div>
                                <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                                    <p className="text-sm text-blue-700">Info ini akan ditampilkan kepada pembeli saat mereka memilih metode pembayaran Transfer Bank Manual.</p>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Barcode QRIS</label>
                                <div className="border-2 border-dashed border-slate-200 rounded-2xl p-4 flex flex-col items-center justify-center bg-slate-50 relative group">
                                    {previewImage ? (
                                        <div className="relative w-full max-w-[200px] rounded-xl overflow-hidden shadow-sm border border-slate-200 bg-white">
                                            <img src={previewImage} alt="QRIS Preview" className="w-full h-auto" />
                                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <button type="button" onClick={() => fileInputRef.current.click()} className="px-4 py-2 bg-white text-slate-800 font-bold rounded-lg text-sm shadow-lg">Ganti QRIS</button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-center py-8">
                                            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mx-auto mb-3 border border-slate-100">
                                                <span className="text-2xl">📱</span>
                                            </div>
                                            <p className="text-sm text-slate-500 font-medium mb-3">Belum ada barcode QRIS</p>
                                            <button type="button" onClick={() => fileInputRef.current.click()} className="px-4 py-2 bg-pink-50 text-pink-600 hover:bg-pink-100 font-bold rounded-lg text-sm transition">Upload QRIS</button>
                                        </div>
                                    )}
                                    <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/*" className="hidden" />
                                </div>
                                {errors.qris_image && <p className="text-sm text-red-500 mt-1">{errors.qris_image}</p>}
                            </div>
                        </div>
                    </div>

                    {/* Card Kontak & Lokasi */}
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-6 sm:p-8">
                        <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                            <span className="w-8 h-8 rounded-full bg-green-50 text-green-500 flex items-center justify-center">📍</span>
                            Informasi Kontak & Lokasi
                        </h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Nomor WhatsApp Admin</label>
                                <input
                                    type="text"
                                    value={data.whatsapp_number}
                                    onChange={e => setData('whatsapp_number', e.target.value)}
                                    placeholder="Cth: 081234567890"
                                    className="w-full rounded-xl border-slate-200 bg-slate-50 focus:border-pink-300 focus:ring focus:ring-pink-100 p-3 text-sm"
                                />
                                {errors.whatsapp_number && <p className="text-sm text-red-500 mt-1">{errors.whatsapp_number}</p>}
                            </div>
                            
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Alamat Cabang / Toko</label>
                                <textarea
                                    rows="3"
                                    value={data.store_address}
                                    onChange={e => setData('store_address', e.target.value)}
                                    placeholder="Masukkan alamat lengkap toko..."
                                    className="w-full rounded-xl border-slate-200 bg-slate-50 focus:border-pink-300 focus:ring focus:ring-pink-100 p-3 text-sm"
                                ></textarea>
                                {errors.store_address && <p className="text-sm text-red-500 mt-1">{errors.store_address}</p>}
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end pt-4">
                        <button 
                            type="submit" 
                            disabled={processing}
                            className="px-8 py-3 bg-pink-500 hover:bg-pink-600 text-white font-bold rounded-xl shadow-lg shadow-pink-500/30 transition-all hover:-translate-y-0.5 disabled:opacity-75 disabled:hover:translate-y-0 flex items-center gap-2"
                        >
                            {processing ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                    Menyimpan...
                                </>
                            ) : (
                                <>
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                                    Simpan Pengaturan
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
