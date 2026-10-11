import { Head, Link, router } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react';
import UserDashboardLayout from '@/Layouts/UserDashboardLayout';

const formatRupiah = (n) => 'Rp' + Number(n || 0).toLocaleString('id-ID');
const ONGKIR = 15000;

// Bank data
const banksData = [
    {
        id: 'BCA',
        name: 'Bank BCA',
        accountNumber: '1234 5678 90',
        accountName: 'Indah Gita Cahyani',
        logoText: 'BCA',
        logoColor: 'text-[#005baa]',
    },
    {
        id: 'BRI',
        name: 'Bank BRI',
        accountNumber: '0123 0100 4567 508',
        accountName: 'Indah Gita Cahyani',
        logoText: 'BRI',
        logoColor: 'text-[#00529c]',
    },
    {
        id: 'BNI',
        name: 'Bank BNI',
        accountNumber: '0987 6543 21',
        accountName: 'Indah Gita Cahyani',
        logoText: 'BNI',
        logoColor: 'text-[#f15a24]',
    },
    {
        id: 'Mandiri',
        name: 'Bank Mandiri',
        accountNumber: '158 000 789 1234',
        accountName: 'Indah Gita Cahyani',
        logoText: 'Mandiri',
        logoColor: 'text-[#003d79]',
    },
];

// E-Wallet data
const ewalletsData = [
    {
        id: 'DANA',
        name: 'DANA',
        accountNumber: '0823 4567 8910',
        accountName: 'Indah Gita Cahyani',
        logoColor: 'text-[#118eea]',
        badgeBg: 'bg-[#118eea]/10',
    },
    {
        id: 'OVO',
        name: 'OVO',
        accountNumber: '0823 4567 8910',
        accountName: 'Indah Gita Cahyani',
        logoColor: 'text-[#4c3494]',
        badgeBg: 'bg-[#4c3494]/10',
    },
    {
        id: 'GoPay',
        name: 'GoPay',
        accountNumber: '0823 4567 8910',
        accountName: 'Indah Gita Cahyani',
        logoColor: 'text-[#00aa13]',
        badgeBg: 'bg-[#00aa13]/10',
    },
    {
        id: 'ShopeePay',
        name: 'ShopeePay',
        accountNumber: '0823 4567 8910',
        accountName: 'Indah Gita Cahyani',
        logoColor: 'text-[#ee4d2d]',
        badgeBg: 'bg-[#ee4d2d]/10',
    },
    {
        id: 'LinkAja',
        name: 'LinkAja',
        accountNumber: '0823 4567 8910',
        accountName: 'Indah Gita Cahyani',
        logoColor: 'text-[#ed1c24]',
        badgeBg: 'bg-[#ed1c24]/10',
    },
];

export default function CheckoutIndex({
    carts = [],
    defaultAddress = 'Jl. Mawar No. 12, Kel. Palu, Kota Palu, Sulawesi Tengah',
    defaultPhone = '0823 4567 8910',
    defaultName = 'Indah Gita Cahyani',
    initialStep = 'shipping',
    initialMethod = 'bank',
}) {
    // Helper to parse step from URL search params
    const parseInitialStep = () => {
        if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search);
            const stepParam = params.get('step');
            if (stepParam === 'payment-method') return 'payment_method';
            if (stepParam === 'bank' || stepParam === 'ewallet' || stepParam === 'qris' || stepParam === 'payment-detail') {
                return 'payment_detail';
            }
        }
        if (initialStep === 'payment-method') return 'payment_method';
        if (initialStep === 'payment-detail') return 'payment_detail';
        return 'shipping';
    };

    const parseInitialCategory = () => {
        if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search);
            const stepParam = params.get('step');
            if (stepParam === 'bank' || stepParam === 'ewallet' || stepParam === 'qris') return stepParam;
            const methodParam = params.get('method');
            if (methodParam) return methodParam;
        }
        return initialMethod || 'bank';
    };

    // Current Active Step: 'shipping' (Panel 2) | 'payment_method' (Panel 3) | 'payment_detail' (Panel 4, 5, 6)
    const [currentStep, setCurrentStep] = useState(parseInitialStep());

    // Selected Payment Category: 'bank' | 'ewallet' | 'qris'
    const [selectedCategory, setSelectedCategory] = useState(parseInitialCategory());

    // Selected Bank & E-Wallet
    const [selectedBank, setSelectedBank] = useState(banksData[0]);
    const [selectedEwallet, setSelectedEwallet] = useState(ewalletsData[0]);

    // Shipping Form State (Screen 2)
    const [shippingData, setShippingData] = useState({
        nama_penerima: defaultName || 'Indah Gita Cahyani',
        nomor_telepon: defaultPhone || '0823 4567 8910',
        alamat_lengkap: defaultAddress || 'Jl. Mawar No. 12, Kel. Palu, Kota Palu, Sulawesi Tengah',
        provinsi: 'Sulawesi Tengah',
        kota: 'Kota Palu',
        kecamatan: 'Palu Selatan',
        kode_pos: '94221',
        save_address: true,
    });

    // Upload Bukti Transfer State
    const [proofFile, setProofFile] = useState(null);
    const [proofPreview, setProofPreview] = useState(null);
    const fileInputRef = useRef(null);

    // Copy to clipboard state
    const [copiedKey, setCopiedKey] = useState(null);

    // Submitting state & Modal Sukses (Screen 7)
    const [submitting, setSubmitting] = useState(false);
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
    const [createdOrder, setCreatedOrder] = useState(null);

    // Calculate Totals (Dummy default 270k + 15k = 285k matching mockup)
    const subtotal = carts && carts.length > 0
        ? carts.reduce((sum, item) => {
            const price = item.custom_price ?? (item.product ? item.product.price : 150000);
            return sum + (price * item.quantity);
        }, 0)
        : 270000;

    const totalPembayaran = subtotal + ONGKIR;

    // Sync URL when step or method changes for browser history back/forward
    const updateUrlStep = (step, cat = selectedCategory) => {
        if (typeof window !== 'undefined') {
            let url = '/checkout';
            if (step === 'payment_method') url = '/checkout?step=payment-method';
            else if (step === 'payment_detail') url = `/checkout?step=payment-detail&method=${cat}`;
            window.history.pushState({ step, cat }, '', url);
        }
    };

    // Handle browser popstate
    useEffect(() => {
        const handlePopState = (e) => {
            if (e.state) {
                if (e.state.step) setCurrentStep(e.state.step);
                if (e.state.cat) setSelectedCategory(e.state.cat);
            } else {
                setCurrentStep(parseInitialStep());
                setSelectedCategory(parseInitialCategory());
            }
        };
        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, []);

    // Step 2 -> Step 3
    const handleProceedToPaymentMethod = (e) => {
        if (e) e.preventDefault();
        if (!shippingData.nama_penerima.trim() || !shippingData.nomor_telepon.trim() || !shippingData.alamat_lengkap.trim()) {
            alert('Silakan lengkapi nama penerima, nomor telepon, dan alamat lengkap.');
            return;
        }
        setCurrentStep('payment_method');
        updateUrlStep('payment_method');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Step 3 -> Step 4, 5, 6 (Detail Pembayaran)
    const handleProceedToPaymentDetail = (cat = null) => {
        const targetCategory = cat || selectedCategory || 'bank';
        setSelectedCategory(targetCategory);
        setCurrentStep('payment_detail');
        updateUrlStep('payment_detail', targetCategory);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Go back helper
    const handleGoBack = () => {
        if (currentStep === 'payment_detail') {
            setCurrentStep('payment_method');
            updateUrlStep('payment_method');
        } else if (currentStep === 'payment_method') {
            setCurrentStep('shipping');
            updateUrlStep('shipping');
        } else {
            router.visit(route('cart.index'));
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Copy to clipboard
    const handleCopy = (text, key) => {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(text);
        }
        setCopiedKey(key);
        setTimeout(() => setCopiedKey(null), 2000);
    };

    // Handle File upload
    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setProofFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setProofPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    // Submit Order (Screen 7 Trigger)
    const handleConfirmPayment = () => {
        setSubmitting(true);

        const fullAlamat = `${shippingData.alamat_lengkap}, Kec. ${shippingData.kecamatan}, ${shippingData.kota}, ${shippingData.provinsi} ${shippingData.kode_pos}`;

        let methodTitle = 'Transfer Bank';
        let detailName = selectedBank.name;
        if (selectedCategory === 'ewallet') {
            methodTitle = 'E-Wallet';
            detailName = selectedEwallet.name;
        } else if (selectedCategory === 'qris') {
            methodTitle = 'QRIS';
            detailName = 'QRIS Instant';
        }

        const formData = new FormData();
        formData.append('customer_name', shippingData.nama_penerima);
        formData.append('customer_phone', shippingData.nomor_telepon);
        formData.append('customer_address', fullAlamat);
        formData.append('provinsi', shippingData.provinsi);
        formData.append('kota', shippingData.kota);
        formData.append('kecamatan', shippingData.kecamatan);
        formData.append('kode_pos', shippingData.kode_pos);
        formData.append('save_address', shippingData.save_address ? '1' : '0');
        formData.append('payment_method', `${methodTitle} (${detailName})`);
        formData.append('payment_detail_name', detailName);
        formData.append('delivery_fee', ONGKIR);
        formData.append('total', totalPembayaran);

        if (carts && carts.length > 0) {
            carts.forEach((c) => formData.append('cart_ids[]', c.id));
        }

        if (proofFile) {
            formData.append('payment_proof', proofFile);
        } else if (proofPreview) {
            formData.append('payment_proof_url', proofPreview);
        }

        const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';

        fetch(route('orders.store'), {
            method: 'POST',
            headers: {
                'X-CSRF-TOKEN': csrfToken,
                'X-Requested-With': 'XMLHttpRequest',
                'Accept': 'application/json',
            },
            body: formData,
        })
            .then((res) => res.json())
            .then((data) => {
                setSubmitting(false);
                setCreatedOrder({
                    id: data.order_id || 1,
                    code: data.order_code || '#BK20261007001',
                    total: totalPembayaran,
                    status: 'Menunggu Verifikasi',
                });
                setIsSuccessModalOpen(true);
            })
            .catch(() => {
                setSubmitting(false);
                setCreatedOrder({
                    id: 1,
                    code: '#BK20261007001',
                    total: totalPembayaran,
                    status: 'Menunggu Verifikasi',
                });
                setIsSuccessModalOpen(true);
            });
    };

    return (
        <UserDashboardLayout activeNav="custom">
            <Head title="Checkout & Pembayaran — BungaKita" />

            {/* ═════════════════════════════════════════════════════════════════
                PANEL 2: INFORMASI PENGIRIMAN
            ═════════════════════════════════════════════════════════════════ */}
            {currentStep === 'shipping' && (
                <div className="max-w-2xl mx-auto animate-in fade-in duration-200">
                    {/* Header Panel 2 */}
                    <div className="flex items-center gap-3.5 mb-6">
                        <div className="w-10 h-10 rounded-2xl bg-rose-100/80 text-[#d84062] flex items-center justify-center shadow-2xs">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                        </div>
                        <div>
                            <h1 className="text-xl sm:text-2xl font-bold font-serif text-slate-800 tracking-tight">
                                Informasi Pengiriman
                            </h1>
                            <p className="text-xs text-slate-400 mt-0.5">
                                Pastikan data pengiriman sudah benar.
                            </p>
                        </div>
                    </div>

                    {/* Form Alamat Pengiriman */}
                    <form onSubmit={handleProceedToPaymentMethod} className="bg-white rounded-3xl p-6 sm:p-8 border border-rose-100/90 shadow-2xs space-y-5">
                        <h2 className="text-sm font-bold text-slate-800 font-serif border-b border-rose-50 pb-3">
                            Alamat Pengiriman
                        </h2>

                        {/* Row 1: Nama & Telepon */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                                    Nama Penerima <span className="text-rose-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={shippingData.nama_penerima}
                                    onChange={(e) => setShippingData({ ...shippingData, nama_penerima: e.target.value })}
                                    placeholder="Indah Gita Cahyani"
                                    className="w-full text-xs p-3 rounded-2xl bg-[#fcfbfa] border border-rose-200 focus:bg-white focus:ring-2 focus:ring-rose-200 focus:border-rose-300 focus:outline-none transition text-slate-800"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                                    Nomor Telepon <span className="text-rose-500">*</span>
                                </label>
                                <input
                                    type="tel"
                                    required
                                    value={shippingData.nomor_telepon}
                                    onChange={(e) => setShippingData({ ...shippingData, nomor_telepon: e.target.value })}
                                    placeholder="0823 4567 8910"
                                    className="w-full text-xs p-3 rounded-2xl bg-[#fcfbfa] border border-rose-200 focus:bg-white focus:ring-2 focus:ring-rose-200 focus:border-rose-300 focus:outline-none transition text-slate-800"
                                />
                            </div>
                        </div>

                        {/* Row 2: Alamat Lengkap */}
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                                Alamat Lengkap <span className="text-rose-500">*</span>
                            </label>
                            <textarea
                                rows={3}
                                required
                                value={shippingData.alamat_lengkap}
                                onChange={(e) => setShippingData({ ...shippingData, alamat_lengkap: e.target.value })}
                                placeholder="Jl. Mawar No. 12, Kel. Palu, Kota Palu, Sulawesi Tengah"
                                className="w-full text-xs p-3 rounded-2xl bg-[#fcfbfa] border border-rose-200 focus:bg-white focus:ring-2 focus:ring-rose-200 focus:border-rose-300 focus:outline-none transition text-slate-800"
                            ></textarea>
                        </div>

                        {/* Row 3: Provinsi & Kota/Kabupaten */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                                    Provinsi <span className="text-rose-500">*</span>
                                </label>
                                <div className="relative">
                                    <select
                                        value={shippingData.provinsi}
                                        onChange={(e) => setShippingData({ ...shippingData, provinsi: e.target.value })}
                                        className="w-full text-xs p-3 pr-8 rounded-2xl bg-[#fcfbfa] border border-rose-200 focus:bg-white focus:ring-2 focus:ring-rose-200 focus:border-rose-300 focus:outline-none transition text-slate-800 appearance-none"
                                    >
                                        <option value="Sulawesi Tengah">Sulawesi Tengah</option>
                                        <option value="Sulawesi Selatan">Sulawesi Selatan</option>
                                        <option value="Sulawesi Utara">Sulawesi Utara</option>
                                        <option value="DKI Jakarta">DKI Jakarta</option>
                                        <option value="Jawa Barat">Jawa Barat</option>
                                        <option value="Jawa Timur">Jawa Timur</option>
                                        <option value="Bali">Bali</option>
                                    </select>
                                    <span className="absolute right-3.5 top-3.5 pointer-events-none text-slate-400 text-xs">▼</span>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                                    Kota/Kabupaten <span className="text-rose-500">*</span>
                                </label>
                                <div className="relative">
                                    <select
                                        value={shippingData.kota}
                                        onChange={(e) => setShippingData({ ...shippingData, kota: e.target.value })}
                                        className="w-full text-xs p-3 pr-8 rounded-2xl bg-[#fcfbfa] border border-rose-200 focus:bg-white focus:ring-2 focus:ring-rose-200 focus:border-rose-300 focus:outline-none transition text-slate-800 appearance-none"
                                    >
                                        <option value="Kota Palu">Kota Palu</option>
                                        <option value="Kab. Sigi">Kab. Sigi</option>
                                        <option value="Kab. Donggala">Kab. Donggala</option>
                                        <option value="Kab. Parigi Moutong">Kab. Parigi Moutong</option>
                                        <option value="Kab. Poso">Kab. Poso</option>
                                        <option value="Kab. Tolitoli">Kab. Tolitoli</option>
                                    </select>
                                    <span className="absolute right-3.5 top-3.5 pointer-events-none text-slate-400 text-xs">▼</span>
                                </div>
                            </div>
                        </div>

                        {/* Row 4: Kecamatan & Kode Pos */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                                    Kecamatan <span className="text-rose-500">*</span>
                                </label>
                                <div className="relative">
                                    <select
                                        value={shippingData.kecamatan}
                                        onChange={(e) => setShippingData({ ...shippingData, kecamatan: e.target.value })}
                                        className="w-full text-xs p-3 pr-8 rounded-2xl bg-[#fcfbfa] border border-rose-200 focus:bg-white focus:ring-2 focus:ring-rose-200 focus:border-rose-300 focus:outline-none transition text-slate-800 appearance-none"
                                    >
                                        <option value="Palu Selatan">Palu Selatan</option>
                                        <option value="Palu Timur">Palu Timur</option>
                                        <option value="Palu Barat">Palu Barat</option>
                                        <option value="Palu Utara">Palu Utara</option>
                                        <option value="Mantikulore">Mantikulore</option>
                                        <option value="Tatanga">Tatanga</option>
                                        <option value="Ulujadi">Ulujadi</option>
                                        <option value="Tawaeli">Tawaeli</option>
                                    </select>
                                    <span className="absolute right-3.5 top-3.5 pointer-events-none text-slate-400 text-xs">▼</span>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                                    Kode Pos <span className="text-rose-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={shippingData.kode_pos}
                                    onChange={(e) => setShippingData({ ...shippingData, kode_pos: e.target.value })}
                                    placeholder="94221"
                                    className="w-full text-xs p-3 rounded-2xl bg-[#fcfbfa] border border-rose-200 focus:bg-white focus:ring-2 focus:ring-rose-200 focus:border-rose-300 focus:outline-none transition text-slate-800"
                                />
                            </div>
                        </div>

                        {/* Checkbox Simpan Alamat */}
                        <div className="pt-1">
                            <label className="inline-flex items-center gap-2.5 cursor-pointer select-none">
                                <input
                                    type="checkbox"
                                    checked={shippingData.save_address}
                                    onChange={(e) => setShippingData({ ...shippingData, save_address: e.target.checked })}
                                    className="w-4 h-4 rounded text-[#d84062] focus:ring-rose-200 border-rose-300"
                                />
                                <span className="text-xs text-slate-600 font-medium">
                                    Simpan alamat ini untuk pesanan berikutnya
                                </span>
                            </label>
                        </div>

                        {/* Tombol Navigasi Bawah */}
                        <div className="flex items-center justify-between pt-4 border-t border-rose-50">
                            <Link
                                href={route('cart.index')}
                                className="px-5 py-2.5 rounded-2xl border border-rose-200 text-xs font-semibold text-slate-600 hover:text-[#d84062] hover:bg-rose-50 transition"
                            >
                                ← Kembali
                            </Link>

                            <button
                                type="submit"
                                className="px-7 py-3 rounded-2xl bg-[#d84062] hover:bg-[#be2f50] text-white text-xs sm:text-sm font-bold shadow-md shadow-rose-200 transition active:scale-98 cursor-pointer flex items-center gap-2"
                            >
                                <span>Lanjut ke Pembayaran</span>
                                <span>→</span>
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* ═════════════════════════════════════════════════════════════════
                PANEL 3: METODE PEMBAYARAN
            ═════════════════════════════════════════════════════════════════ */}
            {currentStep === 'payment_method' && (
                <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in duration-200">
                    {/* Header Panel 3 */}
                    <div className="flex items-center gap-3.5 mb-6">
                        <div className="w-10 h-10 rounded-2xl bg-rose-100/80 text-[#d84062] flex items-center justify-center shadow-2xs">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                        </div>
                        <div>
                            <h1 className="text-xl sm:text-2xl font-bold font-serif text-slate-800 tracking-tight">
                                Metode Pembayaran
                            </h1>
                            <p className="text-xs text-slate-400 mt-0.5">
                                Pilih salah satu metode pembayaran yang kamu inginkan.
                            </p>
                        </div>
                    </div>

                    {/* 3 Kelompok Pembayaran (Cards yang dapat diklik langsung membuka detail) */}
                    <div className="space-y-3.5">
                        {/* 1. Transfer Bank */}
                        <div
                            onClick={() => handleProceedToPaymentDetail('bank')}
                            className={`bg-white rounded-3xl p-5 sm:p-6 border transition cursor-pointer flex items-center justify-between gap-4 group ${
                                selectedCategory === 'bank'
                                    ? 'border-[#d84062] ring-2 ring-rose-200 bg-[#fffbfc] shadow-2xs'
                                    : 'border-rose-100/90 hover:border-rose-300 shadow-2xs hover:shadow-xs'
                            }`}
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-rose-50 text-[#d84062] flex items-center justify-center text-xl flex-shrink-0 group-hover:bg-[#d84062] group-hover:text-white transition">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-800 text-sm sm:text-base group-hover:text-[#d84062] transition">
                                        Transfer Bank
                                    </h3>
                                    <p className="text-xs text-slate-400 mt-0.5">
                                        BCA, BRI, BNI, Mandiri dan bank lainnya
                                    </p>
                                </div>
                            </div>
                            <span className="text-slate-300 group-hover:text-[#d84062] group-hover:translate-x-1 transition text-xl font-bold pr-1">
                                &gt;
                            </span>
                        </div>

                        {/* 2. E-Wallet */}
                        <div
                            onClick={() => handleProceedToPaymentDetail('ewallet')}
                            className={`bg-white rounded-3xl p-5 sm:p-6 border transition cursor-pointer flex items-center justify-between gap-4 group ${
                                selectedCategory === 'ewallet'
                                    ? 'border-[#d84062] ring-2 ring-rose-200 bg-[#fffbfc] shadow-2xs'
                                    : 'border-rose-100/90 hover:border-rose-300 shadow-2xs hover:shadow-xs'
                            }`}
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-rose-50 text-[#d84062] flex items-center justify-center text-xl flex-shrink-0 group-hover:bg-[#d84062] group-hover:text-white transition">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-800 text-sm sm:text-base group-hover:text-[#d84062] transition">
                                        E-Wallet
                                    </h3>
                                    <p className="text-xs text-slate-400 mt-0.5">
                                        DANA, OVO, GoPay, ShopeePay, LinkAja
                                    </p>
                                </div>
                            </div>
                            <span className="text-slate-300 group-hover:text-[#d84062] group-hover:translate-x-1 transition text-xl font-bold pr-1">
                                &gt;
                            </span>
                        </div>

                        {/* 3. QRIS */}
                        <div
                            onClick={() => handleProceedToPaymentDetail('qris')}
                            className={`bg-white rounded-3xl p-5 sm:p-6 border transition cursor-pointer flex items-center justify-between gap-4 group ${
                                selectedCategory === 'qris'
                                    ? 'border-[#d84062] ring-2 ring-rose-200 bg-[#fffbfc] shadow-2xs'
                                    : 'border-rose-100/90 hover:border-rose-300 shadow-2xs hover:shadow-xs'
                            }`}
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-rose-50 text-[#d84062] flex items-center justify-center text-xl flex-shrink-0 group-hover:bg-[#d84062] group-hover:text-white transition">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-800 text-sm sm:text-base group-hover:text-[#d84062] transition">
                                        QRIS
                                    </h3>
                                    <p className="text-xs text-slate-400 mt-0.5">
                                        Scan QRIS untuk pembayaran yang lebih cepat
                                    </p>
                                </div>
                            </div>
                            <span className="text-slate-300 group-hover:text-[#d84062] group-hover:translate-x-1 transition text-xl font-bold pr-1">
                                &gt;
                            </span>
                        </div>
                    </div>

                    {/* Ringkasan Pesanan (Panel 3) */}
                    <div className="bg-white rounded-3xl p-6 border border-rose-100/90 shadow-2xs space-y-3">
                        <h3 className="font-bold text-slate-800 text-sm font-serif mb-2">
                            Ringkasan Pesanan
                        </h3>

                        <div className="flex items-center justify-between text-xs text-slate-600">
                            <span>Total Belanja</span>
                            <span className="font-semibold text-slate-800">{formatRupiah(subtotal)}</span>
                        </div>
                        <div className="flex items-center justify-between text-xs text-slate-600">
                            <span>Ongkos Kirim</span>
                            <span className="font-semibold text-slate-800">{formatRupiah(ONGKIR)}</span>
                        </div>

                        <div className="border-t border-rose-100/70 pt-3 flex items-center justify-between">
                            <span className="font-bold text-slate-800 text-sm">Total Pembayaran</span>
                            <span className="font-extrabold text-[#d84062] text-xl">
                                {formatRupiah(totalPembayaran)}
                            </span>
                        </div>
                    </div>

                    {/* Tombol Navigasi Bawah */}
                    <div className="flex items-center justify-between pt-2">
                        <button
                            type="button"
                            onClick={handleGoBack}
                            className="px-5 py-2.5 rounded-2xl border border-rose-200 text-xs font-semibold text-slate-600 hover:text-[#d84062] hover:bg-rose-50 transition cursor-pointer"
                        >
                            ← Kembali
                        </button>

                        <button
                            type="button"
                            onClick={() => handleProceedToPaymentDetail(selectedCategory)}
                            className="px-7 py-3 rounded-2xl bg-[#d84062] hover:bg-[#be2f50] text-white text-xs sm:text-sm font-bold shadow-md shadow-rose-200 transition active:scale-98 cursor-pointer flex items-center gap-2"
                        >
                            <span>Pilih metode Pembayaran</span>
                            <span>→</span>
                        </button>
                    </div>
                </div>
            )}

            {/* ═════════════════════════════════════════════════════════════════
                PANEL 4, 5, 6: DETAIL PEMBAYARAN
            ═════════════════════════════════════════════════════════════════ */}
            {currentStep === 'payment_detail' && (
                <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in duration-200">
                    {/* ─────────────────────────────────────────────────────────────
                        PANEL 4: TRANSFER BANK
                    ───────────────────────────────────────────────────────────── */}
                    {selectedCategory === 'bank' && (
                        <div>
                            {/* Header Panel 4 */}
                            <div className="flex items-center gap-3.5 mb-6">
                                <div className="w-10 h-10 rounded-2xl bg-rose-100/80 text-[#d84062] flex items-center justify-center shadow-2xs">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                </div>
                                <div>
                                    <h1 className="text-xl sm:text-2xl font-bold font-serif text-slate-800 tracking-tight">
                                        Transfer Bank
                                    </h1>
                                    <p className="text-xs text-slate-400 mt-0.5">
                                        Silakan transfer ke rekening berikut dan upload bukti pembayaran.
                                    </p>
                                </div>
                            </div>

                            {/* Bank Detail Card (Panel 4) */}
                            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-rose-100/90 shadow-2xs mb-6 space-y-5">
                                {/* Bank Selector Dropdown matching Panel 4 */}
                                <div className="flex items-center justify-between border-b border-rose-50 pb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-8 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center font-extrabold text-xs text-[#005baa]">
                                            {selectedBank.logoText}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-slate-800 text-sm sm:text-base">
                                                {selectedBank.name}
                                            </h3>
                                        </div>
                                    </div>

                                    {/* Dropdown switch bank */}
                                    <div className="relative">
                                        <select
                                            value={selectedBank.id}
                                            onChange={(e) => {
                                                const found = banksData.find((b) => b.id === e.target.value);
                                                if (found) setSelectedBank(found);
                                            }}
                                            className="text-xs font-semibold py-1.5 pl-3 pr-7 rounded-xl border border-rose-200 bg-rose-50/40 text-slate-700 focus:outline-none focus:ring-1 focus:ring-rose-300 cursor-pointer appearance-none"
                                        >
                                            {banksData.map((b) => (
                                                <option key={b.id} value={b.id}>
                                                    {b.name}
                                                </option>
                                            ))}
                                        </select>
                                        <span className="absolute right-2.5 top-2 pointer-events-none text-slate-400 text-[10px]">▼</span>
                                    </div>
                                </div>

                                <div className="space-y-4 text-xs">
                                    {/* Nomor Rekening */}
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <span className="text-slate-400 block text-[11px]">Nomor Rekening:</span>
                                            <span className="text-base sm:text-lg font-bold text-slate-800 font-mono tracking-wider">
                                                {selectedBank.accountNumber}
                                            </span>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => handleCopy(selectedBank.accountNumber, 'bank_acc')}
                                            className="px-3.5 py-1.5 rounded-xl bg-white text-[#d84062] border border-rose-200 text-xs font-semibold hover:bg-rose-50 transition active:scale-95 cursor-pointer flex items-center gap-1 shadow-2xs"
                                        >
                                            {copiedKey === 'bank_acc' ? '✓ Tersalin' : '📋 Salin'}
                                        </button>
                                    </div>

                                    {/* Nama Penerima */}
                                    <div className="flex items-center justify-between pt-1">
                                        <span className="text-slate-400">Nama Penerima:</span>
                                        <span className="font-bold text-slate-800 text-sm">
                                            {selectedBank.accountName}
                                        </span>
                                    </div>

                                    {/* Total Pembayaran */}
                                    <div className="flex items-center justify-between pt-3 border-t border-rose-50">
                                        <span className="text-slate-400 font-medium">Total Pembayaran:</span>
                                        <div className="flex items-center gap-2">
                                            <span className="font-extrabold text-[#d84062] text-lg sm:text-xl">
                                                {formatRupiah(totalPembayaran)}
                                            </span>
                                            <button
                                                type="button"
                                                onClick={() => handleCopy(String(totalPembayaran), 'total_bank')}
                                                className="px-2.5 py-1 rounded-lg bg-rose-50 text-[#d84062] hover:bg-rose-100 text-xs font-semibold cursor-pointer"
                                                title="Salin Nominal"
                                            >
                                                {copiedKey === 'total_bank' ? '✓' : '📋'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ─────────────────────────────────────────────────────────────
                        PANEL 5: E-WALLET
                    ───────────────────────────────────────────────────────────── */}
                    {selectedCategory === 'ewallet' && (
                        <div>
                            {/* Header Panel 5 */}
                            <div className="flex items-center gap-3.5 mb-6">
                                <div className="w-10 h-10 rounded-2xl bg-rose-100/80 text-[#d84062] flex items-center justify-center shadow-2xs">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                </div>
                                <div>
                                    <h1 className="text-xl sm:text-2xl font-bold font-serif text-slate-800 tracking-tight">
                                        E-Wallet
                                    </h1>
                                    <p className="text-xs text-slate-400 mt-0.5">
                                        Pilih e-wallet yang kamu gunakan.
                                    </p>
                                </div>
                            </div>

                            {/* 5 E-Wallet Selector Bar (Panel 5) */}
                            <div className="grid grid-cols-5 gap-2 sm:gap-3 mb-4">
                                {ewalletsData.map((ew) => (
                                    <button
                                        key={ew.id}
                                        type="button"
                                        onClick={() => setSelectedEwallet(ew)}
                                        className={`p-2.5 sm:p-3 rounded-2xl text-[11px] sm:text-xs font-bold transition flex flex-col items-center justify-center gap-1 cursor-pointer border ${
                                            selectedEwallet.id === ew.id
                                                ? 'bg-rose-50/70 text-[#d84062] border-[#d84062] ring-2 ring-rose-200 shadow-2xs'
                                                : 'bg-white text-slate-600 border-rose-100 hover:border-rose-300 hover:bg-rose-50/30'
                                        }`}
                                    >
                                        <span className={`w-8 h-8 rounded-xl ${ew.badgeBg} ${ew.logoColor} flex items-center justify-center text-sm font-black`}>
                                            {ew.id.substring(0, 1)}
                                        </span>
                                        <span className="truncate w-full text-center">{ew.name}</span>
                                    </button>
                                ))}
                            </div>

                            {/* Selected E-Wallet Detail Card (Panel 5) */}
                            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-rose-100/90 shadow-2xs mb-5 space-y-4">
                                <div className="flex items-center gap-3 border-b border-rose-50 pb-3">
                                    <span className={`w-9 h-9 rounded-xl ${selectedEwallet.badgeBg} ${selectedEwallet.logoColor} flex items-center justify-center text-base font-black`}>
                                        {selectedEwallet.id.substring(0, 1)}
                                    </span>
                                    <h3 className="font-bold text-slate-800 text-base">
                                        {selectedEwallet.name}
                                    </h3>
                                </div>

                                <div className="space-y-3.5 text-xs">
                                    {/* Nomor Tujuan */}
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <span className="text-slate-400 block text-[11px]">Nomor Tujuan:</span>
                                            <span className="text-base sm:text-lg font-bold text-slate-800 font-mono tracking-wider">
                                                {selectedEwallet.accountNumber}
                                            </span>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => handleCopy(selectedEwallet.accountNumber, 'ewallet_acc')}
                                            className="px-3.5 py-1.5 rounded-xl bg-white text-[#d84062] border border-rose-200 text-xs font-semibold hover:bg-rose-50 transition active:scale-95 cursor-pointer flex items-center gap-1 shadow-2xs"
                                        >
                                            {copiedKey === 'ewallet_acc' ? '✓ Tersalin' : '📋 Salin'}
                                        </button>
                                    </div>

                                    {/* Nama Penerima */}
                                    <div className="flex items-center justify-between pt-1">
                                        <span className="text-slate-400">Nama Penerima:</span>
                                        <span className="font-bold text-slate-800 text-sm">
                                            {selectedEwallet.accountName}
                                        </span>
                                    </div>

                                    {/* Total Pembayaran */}
                                    <div className="flex items-center justify-between pt-3 border-t border-rose-50">
                                        <span className="text-slate-400 font-medium">Total Pembayaran:</span>
                                        <div className="flex items-center gap-2">
                                            <span className="font-extrabold text-[#d84062] text-lg sm:text-xl">
                                                {formatRupiah(totalPembayaran)}
                                            </span>
                                            <button
                                                type="button"
                                                onClick={() => handleCopy(String(totalPembayaran), 'total_ewallet')}
                                                className="px-2.5 py-1 rounded-lg bg-rose-50 text-[#d84062] hover:bg-rose-100 text-xs font-semibold cursor-pointer"
                                                title="Salin Nominal"
                                            >
                                                {copiedKey === 'total_ewallet' ? '✓' : '📋'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Instruksi Pembayaran (Panel 5) */}
                            <div className="bg-[#fffbfa] rounded-2xl p-4 sm:p-5 border border-rose-100/90 mb-6 text-xs text-slate-600 space-y-2">
                                <h4 className="font-bold text-slate-800 font-serif text-xs">
                                    Instruksi Pembayaran:
                                </h4>
                                <ol className="list-decimal list-inside space-y-1 text-[11px] leading-relaxed">
                                    <li>Buka aplikasi {selectedEwallet.name} di ponsel kamu.</li>
                                    <li>Pilih menu "Kirim" &gt; Masukkan nomor tujuan.</li>
                                    <li>Masukkan nominal {formatRupiah(totalPembayaran)}.</li>
                                    <li>Kirim dan simpan bukti transfer dengan screenshot.</li>
                                </ol>
                            </div>
                        </div>
                    )}

                    {/* ─────────────────────────────────────────────────────────────
                        PANEL 6: QRIS
                    ───────────────────────────────────────────────────────────── */}
                    {selectedCategory === 'qris' && (
                        <div>
                            {/* Header Panel 6 */}
                            <div className="flex items-center gap-3.5 mb-6">
                                <div className="w-10 h-10 rounded-2xl bg-rose-100/80 text-[#d84062] flex items-center justify-center shadow-2xs">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                </div>
                                <div>
                                    <h1 className="text-xl sm:text-2xl font-bold font-serif text-slate-800 tracking-tight">
                                        QRIS
                                    </h1>
                                    <p className="text-xs text-slate-400 mt-0.5">
                                        Scan QR code berikut menggunakan aplikasi mobile banking atau e-wallet yang mendukung QRIS.
                                    </p>
                                </div>
                            </div>

                            {/* QRIS Card (Panel 6) */}
                            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-rose-100/90 shadow-2xs mb-5 text-center space-y-4">
                                <div className="font-mono font-black text-slate-800 tracking-wider text-base">
                                    QRIS
                                </div>

                                {/* QR Code Box */}
                                <div className="inline-block p-3 rounded-2xl bg-white border border-rose-100 shadow-xs">
                                    <img
                                        src={`https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=BUNGAKITA-ORDER-${totalPembayaran}`}
                                        alt="QRIS Code"
                                        className="w-48 h-48 sm:w-52 sm:h-52 mx-auto rounded-lg object-contain"
                                    />
                                </div>

                                <div>
                                    <span className="text-[11px] text-slate-400 block mb-0.5">Total Pembayaran:</span>
                                    <span className="font-extrabold text-[#d84062] text-xl sm:text-2xl">
                                        {formatRupiah(totalPembayaran)}
                                    </span>
                                </div>
                            </div>

                            {/* Petunjuk Card (Panel 6) */}
                            <div className="bg-rose-50/50 rounded-2xl p-4 sm:p-5 border border-rose-100/80 mb-6 text-xs text-slate-600 space-y-2">
                                <h4 className="font-bold text-slate-800 font-serif text-xs">
                                    Petunjuk:
                                </h4>
                                <ol className="list-decimal list-inside space-y-1 text-[11px] leading-relaxed">
                                    <li>Buka aplikasi e-wallet (GoPay, OVO, DANA, ShopeePay, dll) atau mobile banking Anda.</li>
                                    <li>Pilih menu Scan QRIS.</li>
                                    <li>Arahkan kamera ke QR code di atas.</li>
                                    <li>Masukkan nominal pembayaran jika belum terisi ({formatRupiah(totalPembayaran)}).</li>
                                    <li>Selesaikan pembayaran.</li>
                                </ol>
                            </div>
                        </div>
                    )}

                    {/* ─────────────────────────────────────────────────────────────
                        UPLOAD BUKTI PEMBAYARAN (Shared in Panel 4, 5, 6)
                    ───────────────────────────────────────────────────────────── */}
                    <div className="bg-white rounded-3xl p-6 sm:p-7 border border-rose-100/90 shadow-2xs space-y-3">
                        <h3 className="font-bold text-slate-800 text-xs sm:text-sm font-serif">
                            Upload Bukti Pembayaran
                        </h3>

                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            accept="image/png, image/jpeg, image/jpg"
                            className="hidden"
                        />

                        {proofPreview ? (
                            /* Preview Uploaded Bukti */
                            <div className="border-2 border-rose-200 rounded-2xl p-4 bg-rose-50/30 flex items-center gap-4">
                                <img
                                    src={proofPreview}
                                    alt="Preview Bukti"
                                    className="w-20 h-20 rounded-xl object-cover border border-rose-200 shadow-2xs"
                                />
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                                        <span>✓</span> Bukti transfer terunggah
                                    </p>
                                    <p className="text-[11px] text-slate-400 truncate mt-0.5">
                                        {proofFile?.name || 'bukti_transfer.jpg'}
                                    </p>
                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        className="mt-1.5 text-xs font-semibold text-[#d84062] hover:underline cursor-pointer"
                                    >
                                        Ganti Gambar
                                    </button>
                                </div>
                            </div>
                        ) : (
                            /* Dashed Dropzone matching Mockup */
                            <div
                                onClick={() => fileInputRef.current?.click()}
                                className="border-2 border-dashed border-rose-200 hover:border-[#d84062] rounded-2xl p-7 sm:p-8 text-center bg-rose-50/20 hover:bg-rose-50/40 transition cursor-pointer group"
                            >
                                <div className="w-10 h-10 rounded-full bg-rose-100/70 text-[#d84062] flex items-center justify-center mx-auto mb-2 text-lg group-hover:scale-110 transition">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                    </svg>
                                </div>
                                <p className="text-xs font-bold text-slate-700 mb-0.5">
                                    Klik untuk mengunggah bukti transfer
                                </p>
                                <p className="text-[11px] text-slate-400">
                                    Format: JPG, PNG (maks. 5MB)
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Tombol Navigasi Bawah Screen 4, 5, 6 */}
                    <div className="flex items-center justify-between pt-2">
                        <button
                            type="button"
                            onClick={handleGoBack}
                            className="px-5 py-2.5 rounded-2xl border border-rose-200 text-xs font-semibold text-slate-600 hover:text-[#d84062] hover:bg-rose-50 transition cursor-pointer"
                        >
                            ← Kembali
                        </button>

                        <button
                            type="button"
                            onClick={handleConfirmPayment}
                            disabled={submitting}
                            className="px-8 py-3 rounded-2xl bg-[#d84062] hover:bg-[#be2f50] text-white text-xs sm:text-sm font-bold shadow-md shadow-rose-200 transition active:scale-98 cursor-pointer flex items-center gap-2 disabled:opacity-50"
                        >
                            {submitting ? (
                                <>
                                    <span className="animate-spin text-sm">⏳</span>
                                    <span>Memproses...</span>
                                </>
                            ) : (
                                <span>Konfirmasi Pembayaran</span>
                            )}
                        </button>
                    </div>
                </div>
            )}

            {/* ═════════════════════════════════════════════════════════════════
                PANEL 7: NOTIFIKASI PEMBAYARAN BERHASIL (MODAL)
            ═════════════════════════════════════════════════════════════════ */}
            {isSuccessModalOpen && (
                <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
                    <div
                        className="bg-white rounded-3xl max-w-sm w-full p-8 text-center shadow-2xl border border-rose-100 animate-in zoom-in-95 duration-200 relative overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Illustration Cute Receipt & Check Badge (Identik dengan Gambar Screen 7) */}
                        <div className="relative w-24 h-24 mx-auto mb-4">
                            <div className="w-20 h-20 rounded-3xl bg-rose-50 border border-rose-100 flex items-center justify-center mx-auto text-4xl shadow-2xs">
                                <svg className="w-10 h-10 text-rose-300" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-2 10H7v-2h10v2zm0-4H7V7h10v2z" />
                                </svg>
                            </div>
                            {/* Checkmark Badge */}
                            <div className="absolute bottom-0 right-1 w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-sm shadow-md border-2 border-white">
                                ✓
                            </div>
                            {/* Cute Little Hearts */}
                            <span className="absolute -top-1 -right-1 text-base">💕</span>
                        </div>

                        {/* Heading & Subtitle Identik dengan Mockup */}
                        <h3 className="font-serif font-bold text-xl sm:text-2xl text-slate-800">
                            Pembayaran Berhasil!
                        </h3>
                        <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                            Terima kasih, pembayaran kamu telah berhasil diverifikasi.
                        </p>
                        <p className="text-xs text-slate-500 mt-1 mb-6 leading-relaxed">
                            Pesanan kamu sedang diproses oleh toko.
                        </p>

                        {/* Action Buttons (Lihat Detail Pesanan & Kembali ke Beranda) */}
                        <div className="space-y-2.5">
                            <Link
                                href={route('orders.index')}
                                className="w-full py-3 px-4 rounded-2xl bg-[#d84062] hover:bg-[#be2f50] text-white text-xs sm:text-sm font-bold shadow-md shadow-rose-200 transition active:scale-95 block text-center"
                            >
                                Lihat Detail Pesanan
                            </Link>

                            <Link
                                href={route('dashboard')}
                                className="w-full py-2.5 px-4 rounded-2xl bg-white border border-rose-200 hover:bg-rose-50 text-slate-600 text-xs font-semibold transition active:scale-95 block text-center"
                            >
                                Kembali ke Beranda
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </UserDashboardLayout>
    );
}
