import { Head, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { useState, useRef } from 'react';
import { 
    CreditCard, 
    QrCode, 
    Phone, 
    MapPin, 
    Save, 
    Upload, 
    CheckCircle2, 
    AlertCircle, 
    Store,
    Sparkles
} from 'lucide-react';

export default function SettingsIndex({ settings = {} }) {
    const fileInputRef = useRef(null);
    const [previewImage, setPreviewImage] = useState(settings.qris_image || null);
    const [savedNotice, setSavedNotice] = useState(false);

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
                setSavedNotice(true);
                setTimeout(() => setSavedNotice(false), 4000);
            },
        });
    };

    return (
        <AdminLayout
            title="Pengaturan Toko"
            subtitle="Kelola informasi operasional, rekening pembayaran, QRIS, kontak & alamat cabang."
            quote="Florabelle Toko Buket Impian 💕"
        >
            <Head title="Pengaturan Toko - Florabelle.id" />

            <div className="max-w-5xl mx-auto space-y-6">
                {/* Header Title Banner */}
                <div className="bg-gradient-to-r from-pink-50/80 via-white to-pink-50/40 p-6 rounded-3xl border border-pink-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-pink-100 flex items-center justify-center text-pink-600 shadow-inner text-xl shrink-0">
                            🌸
                        </div>
                        <div>
                            <h2 className="text-xl font-bold font-serif text-slate-800">
                                Pengaturan Profil & Operasional Toko
                            </h2>
                            <p className="text-xs text-slate-500 mt-0.5">
                                Informasi ini ditampilkan secara otomatis pada halaman katalog, keranjang checkout, dan footer website pelanggan.
                            </p>
                        </div>
                    </div>

                    {savedNotice && (
                        <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-xs font-semibold animate-in fade-in">
                            <CheckCircle2 size={16} />
                            <span>Pengaturan berhasil disimpan!</span>
                        </div>
                    )}
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Grid Dua Kolom */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* 1. Pengaturan Kontak & Lokasi Toko */}
                        <div className="bg-white rounded-3xl border border-pink-100/80 shadow-sm p-6 sm:p-7 flex flex-col justify-between">
                            <div>
                                <div className="flex items-center gap-3 pb-5 mb-5 border-b border-pink-50">
                                    <div className="w-10 h-10 rounded-2xl bg-pink-50 text-pink-500 flex items-center justify-center shrink-0">
                                        <Store size={20} />
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-bold text-slate-800">
                                            Informasi Toko & Lokasi
                                        </h3>
                                        <p className="text-[11px] text-slate-400">
                                            Kontak WhatsApp dan alamat fisik workshop Florabelle.
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    {/* Nomor WhatsApp */}
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                                            <Phone size={13} className="text-pink-500" />
                                            <span>Nomor WhatsApp Admin / CS</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={data.whatsapp_number}
                                            onChange={(e) => setData('whatsapp_number', e.target.value)}
                                            placeholder="Contoh: 081234567890"
                                            className="w-full rounded-2xl border-slate-200 bg-slate-50/60 focus:bg-white focus:border-pink-300 focus:ring focus:ring-pink-100 p-3 text-xs transition"
                                        />
                                        <p className="text-[10px] text-slate-400 mt-1">
                                            Nomor ini otomatis terhubung dengan tombol konsultasi WhatsApp pelanggan.
                                        </p>
                                        {errors.whatsapp_number && (
                                            <p className="text-xs text-rose-500 mt-1">{errors.whatsapp_number}</p>
                                        )}
                                    </div>

                                    {/* Alamat Toko */}
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                                            <MapPin size={13} className="text-pink-500" />
                                            <span>Alamat Workshop / Toko Fisik</span>
                                        </label>
                                        <textarea
                                            rows="4"
                                            value={data.store_address}
                                            onChange={(e) => setData('store_address', e.target.value)}
                                            placeholder="Contoh: Beka, Jln Poros Palu - Bangga"
                                            className="w-full rounded-2xl border-slate-200 bg-slate-50/60 focus:bg-white focus:border-pink-300 focus:ring focus:ring-pink-100 p-3 text-xs transition resize-none"
                                        />
                                        <p className="text-[10px] text-slate-400 mt-1">
                                            Ditampilkan di footer website dan informasi toko saat pelanggan memilih opsi penjemputan/pengiriman.
                                        </p>
                                        {errors.store_address && (
                                            <p className="text-xs text-rose-500 mt-1">{errors.store_address}</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="mt-5 p-3.5 bg-pink-50/60 rounded-2xl border border-pink-100/60 flex items-start gap-2.5">
                                <Sparkles size={16} className="text-pink-500 shrink-0 mt-0.5" />
                                <p className="text-[11px] text-pink-700 leading-relaxed">
                                    Format alamat dan nomor telepon akan langsung diperbarui di seluruh halaman website publik.
                                </p>
                            </div>
                        </div>

                        {/* 2. Pengaturan Pembayaran (Rekening & QRIS) */}
                        <div className="bg-white rounded-3xl border border-pink-100/80 shadow-sm p-6 sm:p-7 flex flex-col justify-between">
                            <div>
                                <div className="flex items-center gap-3 pb-5 mb-5 border-b border-pink-50">
                                    <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center shrink-0">
                                        <CreditCard size={20} />
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-bold text-slate-800">
                                            Rekening & Pembayaran Toko
                                        </h3>
                                        <p className="text-[11px] text-slate-400">
                                            Nomor rekening transfer manual dan barcode QRIS toko.
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    {/* Rekening Toko */}
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                                            <CreditCard size={13} className="text-pink-500" />
                                            <span>Detail Rekening Bank Toko</span>
                                        </label>
                                        <textarea
                                            rows="3"
                                            value={data.bank_account}
                                            onChange={(e) => setData('bank_account', e.target.value)}
                                            placeholder="Contoh: BCA 1234567890 a/n Florabelle Shop&#10;BRI 0987654321 a/n Florabelle Official"
                                            className="w-full rounded-2xl border-slate-200 bg-slate-50/60 focus:bg-white focus:border-pink-300 focus:ring focus:ring-pink-100 p-3 text-xs transition resize-none"
                                        />
                                        <p className="text-[10px] text-slate-400 mt-1">
                                            Tampil di layar pembayaran transfer manual ketika pembeli checkout.
                                        </p>
                                        {errors.bank_account && (
                                            <p className="text-xs text-rose-500 mt-1">{errors.bank_account}</p>
                                        )}
                                    </div>

                                    {/* Barcode QRIS */}
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                                            <QrCode size={13} className="text-pink-500" />
                                            <span>Barcode QRIS Toko</span>
                                        </label>

                                        <div className="border-2 border-dashed border-pink-200/80 rounded-2xl p-4 flex flex-col items-center justify-center bg-pink-50/20 relative group hover:bg-pink-50/40 transition">
                                            {previewImage ? (
                                                <div className="relative w-40 h-40 rounded-2xl overflow-hidden shadow-sm border border-pink-100 bg-white flex items-center justify-center">
                                                    <img 
                                                        src={previewImage} 
                                                        alt="QRIS Preview" 
                                                        className="w-full h-full object-contain p-2" 
                                                    />
                                                    <div className="absolute inset-0 bg-slate-900/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                        <button 
                                                            type="button" 
                                                            onClick={() => fileInputRef.current?.click()} 
                                                            className="px-3 py-1.5 bg-white text-slate-800 font-bold rounded-xl text-xs shadow-md hover:bg-pink-50"
                                                        >
                                                            Ganti QRIS
                                                        </button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="text-center py-4">
                                                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-xs mx-auto mb-2 border border-pink-100 text-pink-400">
                                                        <Upload size={20} />
                                                    </div>
                                                    <p className="text-xs text-slate-600 font-semibold mb-1">
                                                        Unggah Barcode QRIS
                                                    </p>
                                                    <p className="text-[10px] text-slate-400 mb-2">
                                                        Format: JPG, PNG, atau WebP (Maks. 2MB)
                                                    </p>
                                                    <button 
                                                        type="button" 
                                                        onClick={() => fileInputRef.current?.click()} 
                                                        className="px-3.5 py-1.5 bg-pink-100 text-pink-600 hover:bg-pink-200 font-bold rounded-xl text-xs transition"
                                                    >
                                                        Pilih Gambar
                                                    </button>
                                                </div>
                                            )}
                                            <input 
                                                type="file" 
                                                ref={fileInputRef} 
                                                onChange={handleImageChange} 
                                                accept="image/*" 
                                                className="hidden" 
                                            />
                                        </div>
                                        {errors.qris_image && (
                                            <p className="text-xs text-rose-500 mt-1">{errors.qris_image}</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="mt-5 p-3.5 bg-slate-50 rounded-2xl border border-slate-100 flex items-start gap-2.5">
                                <AlertCircle size={16} className="text-slate-400 shrink-0 mt-0.5" />
                                <p className="text-[11px] text-slate-500 leading-relaxed">
                                    Pastikan QRIS yang diunggah dapat dipindai oleh seluruh aplikasi mobile banking atau e-wallet (GoPay, OVO, ShopeePay, Dana).
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Tombol Simpan */}
                    <div className="flex items-center justify-end gap-3 pt-2">
                        <button 
                            type="submit" 
                            disabled={processing}
                            className="px-8 py-3 bg-pink-500 hover:bg-pink-600 active:bg-pink-700 text-white font-bold rounded-2xl shadow-md shadow-pink-500/20 transition-all hover:-translate-y-0.5 disabled:opacity-75 disabled:hover:translate-y-0 flex items-center gap-2 text-xs"
                        >
                            {processing ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-1.5 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    <span>Menyimpan Perubahan...</span>
                                </>
                            ) : (
                                <>
                                    <Save size={15} />
                                    <span>Simpan Pengaturan Toko</span>
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
