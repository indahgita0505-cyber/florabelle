import { Head, Link, router } from '@inertiajs/react';
import { useState, useMemo } from 'react';
import UserDashboardLayout from '@/Layouts/UserDashboardLayout';

// 6 Main Bucket Categories matching mockup & user requirements
const bucketCategories = [
    {
        id: 'bunga_pita',
        name: 'Bucket Bunga Pita',
        icon: '💐',
        image: '/images/custom/bunga_pita.jpg',
        description: 'Bucket palsu dari pita. Sangat awet & cantik.',
        startingPrice: 85000,
        badge: 'Awet & Cantik',
    },
    {
        id: 'uang',
        name: 'Bucket Uang',
        icon: '💵',
        image: '/images/custom/uang.jpg',
        description: 'Bucket uang. Cocok untuk hadiah wisuda/ulang tahun.',
        startingPrice: 50000,
        priceNote: '+ nominal uang',
        badge: 'Favorit Hadiah',
    },
    {
        id: 'coklat',
        name: 'Bucket Coklat',
        icon: '🍫',
        image: '/images/custom/coklat.jpg',
        description: 'Coklat favorit untuk hadiah yang manis.',
        startingPrice: 75000,
        badge: 'Manis & Romantis',
    },
    {
        id: 'snack',
        name: 'Bucket Snack',
        icon: '🍿',
        image: '/images/custom/snack.jpg',
        description: 'Berbagai snack sesuai pilihanmu.',
        startingPrice: 60000,
        badge: 'Populer Wisuda',
    },
    {
        id: 'boneka',
        name: 'Bucket Boneka',
        icon: '🧸',
        image: '/images/custom/boneka.jpg',
        description: 'Boneka dengan hiasan bucket manis.',
        startingPrice: 80000,
        badge: 'Lucu & Imut',
    },
    {
        id: 'kombinasi',
        name: 'Bucket Kombinasi',
        icon: '🎁',
        image: '/images/custom/kombinasi.jpg',
        description: 'Gabungan bunga pita, uang, snack, dll.',
        startingPrice: 120000,
        badge: 'Paling Lengkap',
    },
];

// Ribbon Flower Color Swatches (Screen 2) - NO flower names (Mawar, Tulip, dll)
const flowerColors = [
    { id: 'Pink', name: 'Pink', hex: '#f472b6', bgClass: 'bg-pink-400', sampleImg: '/images/custom/bunga_pita.jpg' },
    { id: 'Merah', name: 'Merah', hex: '#ef4444', bgClass: 'bg-red-500', sampleImg: '/images/custom/bunga_pita.jpg' },
    { id: 'Putih', name: 'Putih', hex: '#f8fafc', bgClass: 'bg-slate-100 border-slate-300', sampleImg: '/images/custom/bunga_pita.jpg' },
    { id: 'Ungu', name: 'Ungu', hex: '#a855f7', bgClass: 'bg-purple-500', sampleImg: '/images/custom/bunga_pita.jpg' },
    { id: 'Biru', name: 'Biru', hex: '#3b82f6', bgClass: 'bg-blue-500', sampleImg: '/images/custom/bunga_pita.jpg' },
    { id: 'Kuning', name: 'Kuning', hex: '#eab308', bgClass: 'bg-yellow-400', sampleImg: '/images/custom/bunga_pita.jpg' },
    { id: 'Custom Warna', name: 'Custom Warna', hex: 'gradient', isCustom: true },
];

// Wrapping Paper Colors (Screen 3)
const paperColors = [
    { id: 'Pink', name: 'Pink', hex: '#fbcfe8', bgClass: 'bg-pink-300' },
    { id: 'Putih', name: 'Putih', hex: '#ffffff', bgClass: 'bg-white border-slate-300' },
    { id: 'Merah', name: 'Merah', hex: '#f43f5e', bgClass: 'bg-rose-500' },
    { id: 'Ungu', name: 'Ungu', hex: '#c084fc', bgClass: 'bg-purple-400' },
    { id: 'Coklat Kraft', name: 'Coklat Kraft', hex: '#b45309', bgClass: 'bg-amber-700' },
    { id: 'Transparan', name: 'Transparan', hex: '#e2e8f0', bgClass: 'bg-slate-200 border-dashed' },
];

// Wrapping Paper Models (Screen 3)
const paperModels = [
    { id: 'Polos', name: 'Polos', desc: 'Wrapping klasik rapi berlapis' },
    { id: 'Bergelombang', name: 'Bergelombang', desc: 'Aksen layer ruffle bergelombang lembut' },
    { id: 'Transparan', name: 'Transparan', desc: 'Cellophane bening berkilau' },
    { id: 'Premium', name: 'Premium', desc: 'Gaya Korea berlayer dobel elegan' },
];

// Ribbon Colors (Screen 4)
const ribbonColors = [
    { id: 'Pink', name: 'Pink', hex: '#f472b6', bgClass: 'bg-pink-400' },
    { id: 'Putih', name: 'Putih', hex: '#ffffff', bgClass: 'bg-white border-slate-300' },
    { id: 'Merah', name: 'Merah', hex: '#ef4444', bgClass: 'bg-red-500' },
    { id: 'Ungu', name: 'Ungu', hex: '#a855f7', bgClass: 'bg-purple-500' },
    { id: 'Gold', name: 'Gold', hex: '#eab308', bgClass: 'bg-yellow-500' },
    { id: 'Silver', name: 'Silver', hex: '#94a3b8', bgClass: 'bg-slate-400' },
    { id: 'Tanpa Pita', name: 'Tanpa Pita', hex: '#cbd5e1', isNone: true },
];

// Ribbon Models (Screen 4)
const ribbonModels = [
    { id: 'Pita Standar', name: 'Pita Standar', desc: 'Pita simpul satin klasik' },
    { id: 'Pita Besar', name: 'Pita Besar', desc: 'Pita megah bertingkat elegan' },
    { id: 'Pita Ganda', name: 'Pita Ganda', desc: 'Kombinasi dua warna pita serasi' },
    { id: 'Pita Simpel', name: 'Pita Simpel', desc: 'Pita tipis minimalis anggun' },
];

// Add-on Decorations (Screen 5)
const decorationAddons = [
    { id: 'Kartu ucapan', name: 'Kartu ucapan', icon: '💌', price: 5000, desc: 'Kartu pesan custom tulisan tangan' },
    { id: 'Boneka kecil', name: 'Boneka kecil', icon: '🧸', price: 25000, desc: 'Boneka mini lucu pelengkap buket' },
    { id: 'Daun artificial', name: 'Daun artificial', icon: '🌿', price: 10000, desc: 'Aksen daun sintetis aesthetic' },
    { id: 'Lampu LED', name: 'Lampu LED', icon: '✨', price: 15000, desc: 'Lampu peri hangat kelap-kelip' },
    { id: 'Pita tambahan', name: 'Pita tambahan', icon: '🎀', price: 8000, desc: 'Pita juntai panjang dekoratif' },
    { id: 'Hiasan lainnya', name: 'Hiasan lainnya', icon: '🌸', price: 10000, desc: 'Topper balon / kupu-kupu emas' },
];

const formatRupiah = (n) => 'Rp ' + Number(n || 0).toLocaleString('id-ID');

export default function CustomBouquetIndex({ auth, dynamicOptions = [], products = [] }) {
    // Current Step / View:
    // 'selection' : Screen 1 (Pilih Jenis Bucket)
    // 'bunga_step_1' : Screen 2 (Pilih Bunga Pita - Warna)
    // 'bunga_step_2' : Screen 3 (Pilih Kertas Pembungkus)
    // 'bunga_step_3' : Screen 4 (Pilih Pita Pengikat)
    // 'bunga_step_4' : Screen 5 (Pilih Hiasan Tambahan)
    // 'bunga_step_5' : Screen 6 (Request Khusus)
    // 'form_uang' : Form Bucket Uang
    // 'form_snack' : Form Bucket Snack
    // 'form_coklat' : Form Bucket Coklat
    // 'form_boneka' : Form Bucket Boneka
    // 'form_kombinasi' : Form Bucket Kombinasi
    // 'summary' : Screen 7 (Ringkasan Request)
    const [currentView, setCurrentView] = useState('selection');
    const [selectedCategory, setSelectedCategory] = useState(null);

    // Form State
    const [formData, setFormData] = useState({
        jenis_bucket: '',
        // For Bunga Pita:
        warna_bunga: 'Pink',
        warna_bunga_custom: '',
        // Paper:
        warna_kertas: 'Pink',
        model_kertas: 'Polos',
        // Ribbon:
        warna_pita: 'Pink',
        model_pita: 'Pita Standar',
        // Addons:
        hiasan: ['Kartu ucapan'],
        // Type-specific inputs:
        isi_request: '',
        // Boneka specifics:
        boneka_ukuran: 'Sedang',
        boneka_warna: 'Coklat',
        boneka_model: 'Teddy Bear',
        // Special comments:
        komentar_khusus: '',
    });

    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [createdOrderCode, setCreatedOrderCode] = useState('');

    // Quick chips helpers
    const moneyPresets = [
        'Rp1.000 × 10 lembar',
        'Rp2.000 × 5 lembar',
        'Rp5.000 × 4 lembar',
        'Rp10.000 × 10 lembar',
        'Rp50.000 × 5 lembar',
        'Rp100.000 × 10 lembar',
    ];

    const snackPresets = [
        '3 Chitato',
        '2 Pocky',
        '2 Oreo',
        '1 SilverQueen',
        '4 Beng-beng',
        '2 Hello Panda',
    ];

    const chocolatePresets = [
        'SilverQueen × 2',
        'KitKat × 3',
        'Dairy Milk × 2',
        'Ferrero Rocher × 5',
        'Toblerone × 1',
    ];

    // Select category and open appropriate flow
    const handleSelectCategory = (cat) => {
        setSelectedCategory(cat);
        setFormData((prev) => ({
            ...prev,
            jenis_bucket: cat.name,
            // default isi_request per category if empty
            isi_request:
                cat.id === 'uang' ? 'Rp1.000 × 10 lembar, Rp2.000 × 5 lembar' :
                cat.id === 'snack' ? '3 Chitato, 2 Pocky, 2 Oreo, 1 Coklat' :
                cat.id === 'coklat' ? 'SilverQueen × 2, KitKat × 3, Dairy Milk × 2' :
                cat.id === 'boneka' ? 'Teddy bear warna coklat, ukuran sedang' :
                cat.id === 'kombinasi' ? 'Uang Rp50.000 (pecahan 5rb & 10rb), Coklat SilverQueen, boneka mini coklat, dan bunga pita warna pink' :
                'Bunga pita warna ' + prev.warna_bunga,
        }));

        if (cat.id === 'bunga_pita') {
            setCurrentView('bunga_step_1');
        } else if (cat.id === 'uang') {
            setCurrentView('form_uang');
        } else if (cat.id === 'snack') {
            setCurrentView('form_snack');
        } else if (cat.id === 'coklat') {
            setCurrentView('form_coklat');
        } else if (cat.id === 'boneka') {
            setCurrentView('form_boneka');
        } else if (cat.id === 'kombinasi') {
            setCurrentView('form_kombinasi');
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Toggle multi-select decorations
    const toggleHiasan = (id) => {
        setFormData((prev) => {
            const exists = prev.hiasan.includes(id);
            return {
                ...prev,
                hiasan: exists ? prev.hiasan.filter((item) => item !== id) : [...prev.hiasan, id],
            };
        });
    };

    // Calculate Estimated Price
    const estimatedPrice = useMemo(() => {
        let base = selectedCategory?.startingPrice || 100000;
        
        // Add-ons
        const addonTotal = formData.hiasan.reduce((acc, h) => {
            const found = decorationAddons.find((d) => d.id === h);
            return acc + (found ? found.price : 0);
        }, 0);

        // Premium paper
        if (formData.model_kertas === 'Premium') base += 10000;
        // Big ribbon
        if (formData.model_pita === 'Pita Besar' || formData.model_pita === 'Pita Ganda') base += 5000;

        return base + addonTotal;
    }, [selectedCategory, formData.hiasan, formData.model_kertas, formData.model_pita]);

    // Submit Request to backend cart
    const handleSubmitRequest = () => {
        setSubmitting(true);
        const resolvedWarnaBunga = formData.warna_bunga === 'Custom Warna'
            ? (formData.warna_bunga_custom || 'Custom Warna')
            : formData.warna_bunga;

        const summaryParts = [];
        if (formData.isi_request) summaryParts.push(formData.isi_request);
        if (selectedCategory?.id === 'bunga_pita' && resolvedWarnaBunga) summaryParts.push(`Bunga pita warna ${resolvedWarnaBunga}`);
        if (formData.warna_kertas) summaryParts.push(`kertas ${formData.warna_kertas}`);
        if (formData.warna_pita) summaryParts.push(`pita ${formData.warna_pita}`);
        if (formData.hiasan && formData.hiasan.length > 0) summaryParts.push(formData.hiasan.join(', '));
        if (formData.komentar_khusus) summaryParts.push(`“${formData.komentar_khusus}”`);

        const customRequestText = summaryParts.length > 0
            ? summaryParts.join(', ')
            : 'Sesuai pilihan kostum buket';

        const payload = {
            is_custom: true,
            custom_name: formData.jenis_bucket || selectedCategory?.name || 'Bucket Bunga Pita',
            custom_request: customRequestText,
            custom_price: estimatedPrice,
            custom_image: selectedCategory?.image || '/images/custom/bunga_pita.jpg',
            custom_data: {
                ...formData,
                warna_bunga: resolvedWarnaBunga,
                estimatedPrice,
            },
            quantity: 1,
        };

        router.post(route('cart.store'), payload, {
            onSuccess: () => {
                setSubmitting(false);
            },
            onError: () => {
                setSubmitting(false);
                router.visit(route('cart.index'));
            },
        });
    };

    // Reset back to selection
    const handleResetToSelection = () => {
        setIsSuccessModalOpen(false);
        setCurrentView('selection');
        setSelectedCategory(null);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Helper for Common Additional Options (Kertas, Pita, Hiasan)
    const renderAdditionalOptions = () => (
        <div className="space-y-6 pt-4 border-t border-rose-100/80">
            <div>
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <span>🎨</span> Pilihan Tambahan (Kertas & Pita)
                </h4>
                <p className="text-xs text-slate-500 mb-3">
                    Sesuaikan warna kertas pembungkus dan pita pengikat bucket kamu.
                </p>

                {/* Kertas Pembungkus */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                            Warna Kertas Pembungkus
                        </label>
                        <select
                            value={formData.warna_kertas}
                            onChange={(e) => setFormData({ ...formData, warna_kertas: e.target.value })}
                            className="w-full bg-white border border-rose-200 text-xs text-slate-800 rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-rose-200 focus:outline-none"
                        >
                            {paperColors.map((p) => (
                                <option key={p.id} value={p.id}>{p.name}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                            Model Kertas Pembungkus
                        </label>
                        <select
                            value={formData.model_kertas}
                            onChange={(e) => setFormData({ ...formData, model_kertas: e.target.value })}
                            className="w-full bg-white border border-rose-200 text-xs text-slate-800 rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-rose-200 focus:outline-none"
                        >
                            {paperModels.map((m) => (
                                <option key={m.id} value={m.id}>{m.name} — {m.desc}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Pita Pengikat */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
                    <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                            Warna Pita Pengikat
                        </label>
                        <select
                            value={formData.warna_pita}
                            onChange={(e) => setFormData({ ...formData, warna_pita: e.target.value })}
                            className="w-full bg-white border border-rose-200 text-xs text-slate-800 rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-rose-200 focus:outline-none"
                        >
                            {ribbonColors.map((r) => (
                                <option key={r.id} value={r.id}>{r.name}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                            Model Pita Pengikat
                        </label>
                        <select
                            value={formData.model_pita}
                            onChange={(e) => setFormData({ ...formData, model_pita: e.target.value })}
                            className="w-full bg-white border border-rose-200 text-xs text-slate-800 rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-rose-200 focus:outline-none"
                        >
                            {ribbonModels.map((m) => (
                                <option key={m.id} value={m.id}>{m.name} — {m.desc}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Hiasan Tambahan */}
            <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">
                    Hiasan Tambahan (Bisa pilih lebih dari satu)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {decorationAddons.map((addon) => {
                        const isChecked = formData.hiasan.includes(addon.id);
                        return (
                            <div
                                key={addon.id}
                                onClick={() => toggleHiasan(addon.id)}
                                className={[
                                    'p-2.5 rounded-xl border transition-all cursor-pointer flex items-center gap-2 select-none',
                                    isChecked
                                        ? 'bg-rose-50/80 border-[#d84062] text-[#d84062] shadow-2xs'
                                        : 'bg-white border-slate-200 hover:border-rose-200 text-slate-700',
                                ].join(' ')}
                            >
                                <input
                                    type="checkbox"
                                    checked={isChecked}
                                    onChange={() => {}}
                                    className="rounded text-[#d84062] focus:ring-rose-300 pointer-events-none"
                                />
                                <span className="text-base">{addon.icon}</span>
                                <div className="min-w-0">
                                    <p className="text-xs font-semibold truncate leading-tight">{addon.name}</p>
                                    <p className="text-[10px] text-slate-400">+{formatRupiah(addon.price)}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );

    return (
        <UserDashboardLayout activeNav="custom">
            <Head title="Kostum Bucket — BungaKita" />

            {/* ══════════════════════════════════════════════════════════════════
                1. HALAMAN AWAL KOSTUM BUCKET (Pilih Jenis Bucket) - Mockup 1
            ══════════════════════════════════════════════════════════════════ */}
            {currentView === 'selection' && (
                <div className="space-y-7 animate-in fade-in duration-300">
                    {/* Header Banner */}
                    <div
                        className="relative overflow-hidden rounded-[28px] px-6 py-7 lg:px-10 lg:py-8 border border-rose-100 shadow-2xs"
                        style={{
                            background: 'linear-gradient(135deg, #fff2f5 0%, #fde2e8 48%, #fcd4dc 100%)',
                        }}
                    >
                        <div className="relative z-10 max-w-2xl text-left">
                            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/70 backdrop-blur-xs text-[#d84062] font-semibold text-xs border border-rose-200/60 shadow-2xs mb-2.5">
                                <span>🌸</span>
                                <span>Kostum Bucket</span>
                            </div>

                            <h1 className="font-serif text-3xl lg:text-4xl font-extrabold text-[#9f1239] tracking-tight leading-tight mb-2">
                                Kostum Bucket
                            </h1>

                            <p className="text-slate-600 text-xs sm:text-sm lg:text-base leading-relaxed font-normal">
                                Pilih jenis bucket yang kamu inginkan, lalu request isi dan tampilannya sesuai kebutuhanmu.
                            </p>
                        </div>
                    </div>

                    {/* Section Grid Title */}
                    <div>
                        <h2 className="font-bold text-lg text-slate-800 tracking-tight">
                            Pilih Jenis Bucket
                        </h2>
                        <p className="text-xs text-slate-500 mt-0.5">
                            Setiap jenis bucket memiliki form request yang disesuaikan secara khusus.
                        </p>
                    </div>

                    {/* 6 Cards Grid (Mockup Screen 1) */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {bucketCategories.map((cat) => (
                            <div
                                key={cat.id}
                                className="bg-white rounded-3xl p-4 border border-rose-100 shadow-2xs hover:shadow-md hover:border-rose-300 transition-all duration-300 flex flex-col justify-between group cursor-pointer"
                                onClick={() => handleSelectCategory(cat)}
                            >
                                <div>
                                    {/* Bouquet Realistic Image */}
                                    <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-rose-50 mb-3.5 border border-rose-100/60">
                                        <img
                                            src={cat.image}
                                            alt={cat.name}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = '/images/products/produk-1.jpg';
                                            }}
                                        />
                                        <span className="absolute top-2.5 left-2.5 bg-white/90 backdrop-blur-xs text-[#d84062] text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-2xs border border-rose-100">
                                            {cat.icon} {cat.badge}
                                        </span>
                                    </div>

                                    {/* Name & Description */}
                                    <h3 className="font-bold text-slate-800 text-base group-hover:text-[#d84062] transition-colors leading-snug">
                                        {cat.name}
                                    </h3>
                                    <p className="text-xs text-slate-500 leading-relaxed mt-1 line-clamp-2">
                                        {cat.description}
                                    </p>
                                </div>

                                {/* Price and Action Button */}
                                <div className="flex items-center justify-between mt-4 pt-3 border-t border-rose-50">
                                    <div>
                                        <span className="text-[10px] text-slate-400 block leading-tight">Mulai dari</span>
                                        <p className="font-bold text-sm text-[#d84062]">
                                            {formatRupiah(cat.startingPrice)}
                                            {cat.priceNote && (
                                                <span className="text-[10px] font-normal text-slate-400 ml-1">
                                                    {cat.priceNote}
                                                </span>
                                            )}
                                        </p>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleSelectCategory(cat);
                                        }}
                                        className="px-5 py-2 rounded-full bg-[#d84062] hover:bg-[#be2f50] text-white text-xs font-semibold shadow-2xs shadow-rose-200 transition-all active:scale-95 cursor-pointer"
                                    >
                                        Pilih
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Banner: "Custom Bucket" - Punya Model Sendiri? (Mockup Screen 1) */}
                    <div className="bg-gradient-to-r from-rose-50 via-pink-50 to-white rounded-3xl p-6 border border-rose-200 flex flex-col sm:flex-row items-center justify-between gap-5 shadow-2xs">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-2xl bg-white text-[#d84062] flex items-center justify-center text-2xl shadow-xs border border-rose-100 flex-shrink-0">
                                🎁
                            </div>
                            <div>
                                <h3 className="font-serif font-bold text-slate-800 text-base sm:text-lg">
                                    Custom Bucket — Punya model sendiri?
                                </h3>
                                <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
                                    Konsultasikan request bucket impianmu dan kombinasikan berbagai macam isi sesuai keinginan.
                                </p>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={() => {
                                const komb = bucketCategories.find((b) => b.id === 'kombinasi') || bucketCategories[5];
                                handleSelectCategory(komb);
                            }}
                            className="px-6 py-2.5 rounded-full bg-[#d84062] hover:bg-[#be2f50] text-white font-semibold text-xs sm:text-sm shadow-sm transition active:scale-95 whitespace-nowrap cursor-pointer"
                        >
                            Buat Request
                        </button>
                    </div>
                </div>
            )}

            {/* ══════════════════════════════════════════════════════════════════
                FLOW: BUCKET BUNGA PITA (Screens 2, 3, 4, 5, 6)
            ══════════════════════════════════════════════════════════════════ */}
            {/* Step 1: Warna Bunga Pita (Screen 2) */}
            {currentView === 'bunga_step_1' && (
                <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-300">
                    <div>
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-[#d84062] font-semibold text-xs mb-1.5">
                            <span>💐</span> Langkah 1 dari 5
                        </div>
                        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-slate-800">
                            Bunga Pita
                        </h2>
                        <p className="text-xs sm:text-sm text-slate-500 mt-1">
                            Pilih warna bunga yang dibuat dari pita. (Satu-satunya jenis bucket dengan bunga buatan dari pita).
                        </p>
                    </div>

                    {/* Color Cards Grid (Screen 2) */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 sm:gap-4">
                        {flowerColors.map((color) => {
                            const isSelected = formData.warna_bunga === color.id;
                            return (
                                <div
                                    key={color.id}
                                    onClick={() => setFormData({ ...formData, warna_bunga: color.id })}
                                    className={[
                                        'rounded-2xl p-4 border transition-all duration-200 cursor-pointer flex flex-col items-center text-center relative group',
                                        isSelected
                                            ? 'bg-rose-50/70 border-[#d84062] ring-2 ring-rose-200 shadow-sm'
                                            : 'bg-white border-slate-200/90 hover:border-rose-200 hover:bg-rose-50/30',
                                    ].join(' ')}
                                >
                                    {isSelected && (
                                        <div className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full bg-[#d84062] text-white flex items-center justify-center text-[10px] font-bold shadow-xs">
                                            ✓
                                        </div>
                                    )}

                                    {color.isCustom ? (
                                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-pink-400 via-purple-400 to-indigo-400 flex items-center justify-center text-white text-2xl shadow-xs mb-3">
                                            🎨
                                        </div>
                                    ) : (
                                        <div className="w-16 h-16 rounded-2xl overflow-hidden mb-3 border border-slate-200/60 shadow-xs relative flex items-center justify-center bg-rose-50">
                                            <span className={`w-8 h-8 rounded-full ${color.bgClass} shadow-inner`}></span>
                                        </div>
                                    )}

                                    <h4 className="font-bold text-xs sm:text-sm text-slate-800">{color.name}</h4>
                                    <span className="text-[10px] text-slate-400 mt-0.5">Bunga Pita</span>
                                </div>
                            );
                        })}
                    </div>

                    {/* Custom Color Input if "Custom Warna" is chosen */}
                    {formData.warna_bunga === 'Custom Warna' && (
                        <div className="bg-rose-50/50 p-4 rounded-2xl border border-rose-200 animate-in fade-in">
                            <label className="block text-xs font-semibold text-slate-700 mb-1">
                                Tuliskan Warna Custom yang Diinginkan:
                            </label>
                            <input
                                type="text"
                                value={formData.warna_bunga_custom}
                                onChange={(e) => setFormData({ ...formData, warna_bunga_custom: e.target.value })}
                                placeholder="Contoh: Gradasi Pink Pastel dan Putih Mutiara"
                                className="w-full bg-white border border-rose-200 text-xs rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-200"
                            />
                        </div>
                    )}

                    {/* Buttons Navigation */}
                    <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                        <button
                            type="button"
                            onClick={() => setCurrentView('selection')}
                            className="px-5 py-2.5 rounded-full border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
                        >
                            ← Kembali
                        </button>
                        <button
                            type="button"
                            onClick={() => setCurrentView('bunga_step_2')}
                            className="px-6 py-2.5 rounded-full bg-[#d84062] hover:bg-[#be2f50] text-white text-xs font-semibold shadow-xs transition active:scale-95 cursor-pointer"
                        >
                            Lanjut ke Kertas Pembungkus →
                        </button>
                    </div>
                </div>
            )}

            {/* Step 2: Kertas Pembungkus (Screen 3) */}
            {currentView === 'bunga_step_2' && (
                <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-300">
                    <div>
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-[#d84062] font-semibold text-xs mb-1.5">
                            <span>📄</span> Langkah 2 dari 5
                        </div>
                        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-slate-800">
                            Kertas Pembungkus
                        </h2>
                        <p className="text-xs sm:text-sm text-slate-500 mt-1">
                            Pilih warna dan model kertas pembungkus untuk bucket bunga pita kamu.
                        </p>
                    </div>

                    {/* Section 1: Warna Kertas */}
                    <div>
                        <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">
                            1. Warna Kertas
                        </h4>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {paperColors.map((p) => {
                                const isSelected = formData.warna_kertas === p.id;
                                return (
                                    <div
                                        key={p.id}
                                        onClick={() => setFormData({ ...formData, warna_kertas: p.id })}
                                        className={[
                                            'p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center gap-3',
                                            isSelected
                                                ? 'bg-rose-50 border-[#d84062] ring-2 ring-rose-200 shadow-2xs'
                                                : 'bg-white border-slate-200 hover:border-rose-200',
                                        ].join(' ')}
                                    >
                                        <div className={`w-8 h-8 rounded-full ${p.bgClass} flex-shrink-0 shadow-2xs`}></div>
                                        <span className="font-semibold text-xs text-slate-800">{p.name}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Section 2: Model Kertas */}
                    <div>
                        <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">
                            2. Model Kertas
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {paperModels.map((m) => {
                                const isSelected = formData.model_kertas === m.id;
                                return (
                                    <div
                                        key={m.id}
                                        onClick={() => setFormData({ ...formData, model_kertas: m.id })}
                                        className={[
                                            'p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start gap-3',
                                            isSelected
                                                ? 'bg-rose-50 border-[#d84062] ring-2 ring-rose-200 shadow-2xs'
                                                : 'bg-white border-slate-200 hover:border-rose-200',
                                        ].join(' ')}
                                    >
                                        <div className="w-5 h-5 rounded-full border border-slate-300 flex items-center justify-center mt-0.5">
                                            {isSelected && <span className="w-3 h-3 rounded-full bg-[#d84062]"></span>}
                                        </div>
                                        <div>
                                            <p className="font-bold text-xs text-slate-800">{m.name}</p>
                                            <p className="text-[11px] text-slate-400 mt-0.5">{m.desc}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Buttons Navigation */}
                    <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                        <button
                            type="button"
                            onClick={() => setCurrentView('bunga_step_1')}
                            className="px-5 py-2.5 rounded-full border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
                        >
                            ← Kembali
                        </button>
                        <button
                            type="button"
                            onClick={() => setCurrentView('bunga_step_3')}
                            className="px-6 py-2.5 rounded-full bg-[#d84062] hover:bg-[#be2f50] text-white text-xs font-semibold shadow-xs transition active:scale-95 cursor-pointer"
                        >
                            Lanjut ke Pita Pengikat →
                        </button>
                    </div>
                </div>
            )}

            {/* Step 3: Pita Pengikat (Screen 4) */}
            {currentView === 'bunga_step_3' && (
                <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-300">
                    <div>
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-[#d84062] font-semibold text-xs mb-1.5">
                            <span>🎀</span> Langkah 3 dari 5
                        </div>
                        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-slate-800">
                            Pita Pengikat
                        </h2>
                        <p className="text-xs sm:text-sm text-slate-500 mt-1">
                            Pilih warna dan model pita pengikat bucket bunga pita.
                        </p>
                    </div>

                    {/* Section 1: Warna Pita */}
                    <div>
                        <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">
                            1. Warna Pita
                        </h4>
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                            {ribbonColors.map((r) => {
                                const isSelected = formData.warna_pita === r.id;
                                return (
                                    <div
                                        key={r.id}
                                        onClick={() => setFormData({ ...formData, warna_pita: r.id })}
                                        className={[
                                            'p-3 rounded-2xl border transition-all cursor-pointer flex items-center gap-2.5',
                                            isSelected
                                                ? 'bg-rose-50 border-[#d84062] ring-2 ring-rose-200 shadow-2xs'
                                                : 'bg-white border-slate-200 hover:border-rose-200',
                                        ].join(' ')}
                                    >
                                        <div className={`w-6 h-6 rounded-full ${r.bgClass || 'bg-slate-200'} shadow-2xs flex-shrink-0`}></div>
                                        <span className="font-semibold text-xs text-slate-800 truncate">{r.name}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Section 2: Model Pita */}
                    <div>
                        <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">
                            2. Model Pita
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {ribbonModels.map((m) => {
                                const isSelected = formData.model_pita === m.id;
                                return (
                                    <div
                                        key={m.id}
                                        onClick={() => setFormData({ ...formData, model_pita: m.id })}
                                        className={[
                                            'p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start gap-3',
                                            isSelected
                                                ? 'bg-rose-50 border-[#d84062] ring-2 ring-rose-200 shadow-2xs'
                                                : 'bg-white border-slate-200 hover:border-rose-200',
                                        ].join(' ')}
                                    >
                                        <div className="w-5 h-5 rounded-full border border-slate-300 flex items-center justify-center mt-0.5">
                                            {isSelected && <span className="w-3 h-3 rounded-full bg-[#d84062]"></span>}
                                        </div>
                                        <div>
                                            <p className="font-bold text-xs text-slate-800">{m.name}</p>
                                            <p className="text-[11px] text-slate-400 mt-0.5">{m.desc}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Buttons Navigation */}
                    <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                        <button
                            type="button"
                            onClick={() => setCurrentView('bunga_step_2')}
                            className="px-5 py-2.5 rounded-full border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
                        >
                            ← Kembali
                        </button>
                        <button
                            type="button"
                            onClick={() => setCurrentView('bunga_step_4')}
                            className="px-6 py-2.5 rounded-full bg-[#d84062] hover:bg-[#be2f50] text-white text-xs font-semibold shadow-xs transition active:scale-95 cursor-pointer"
                        >
                            Lanjut ke Hiasan Tambahan →
                        </button>
                    </div>
                </div>
            )}

            {/* Step 4: Hiasan Tambahan (Screen 5) */}
            {currentView === 'bunga_step_4' && (
                <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-300">
                    <div>
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-[#d84062] font-semibold text-xs mb-1.5">
                            <span>✨</span> Langkah 4 dari 5
                        </div>
                        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-slate-800">
                            Hiasan Tambahan
                        </h2>
                        <p className="text-xs sm:text-sm text-slate-500 mt-1">
                            Pilih hiasan yang ingin ditambahkan pada bucket. Kamu bisa memilih lebih dari satu.
                        </p>
                    </div>

                    {/* Add-on Checkbox Cards Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
                        {decorationAddons.map((addon) => {
                            const isChecked = formData.hiasan.includes(addon.id);
                            return (
                                <div
                                    key={addon.id}
                                    onClick={() => toggleHiasan(addon.id)}
                                    className={[
                                        'rounded-2xl p-4 border transition-all cursor-pointer flex flex-col justify-between select-none relative',
                                        isChecked
                                            ? 'bg-rose-50/70 border-[#d84062] ring-2 ring-rose-200 shadow-2xs'
                                            : 'bg-white border-slate-200 hover:border-rose-200',
                                    ].join(' ')}
                                >
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="text-2xl">{addon.icon}</span>
                                        <div className={`w-5 h-5 rounded-md border flex items-center justify-center ${isChecked ? 'bg-[#d84062] border-[#d84062] text-white text-xs' : 'border-slate-300'}`}>
                                            {isChecked && '✓'}
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-xs sm:text-sm text-slate-800 leading-snug">{addon.name}</h4>
                                        <p className="text-[10px] text-slate-400 mt-0.5 leading-tight">{addon.desc}</p>
                                        <p className="font-semibold text-xs text-[#d84062] mt-2">+{formatRupiah(addon.price)}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Buttons Navigation */}
                    <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                        <button
                            type="button"
                            onClick={() => setCurrentView('bunga_step_3')}
                            className="px-5 py-2.5 rounded-full border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
                        >
                            ← Kembali
                        </button>
                        <button
                            type="button"
                            onClick={() => setCurrentView('bunga_step_5')}
                            className="px-6 py-2.5 rounded-full bg-[#d84062] hover:bg-[#be2f50] text-white text-xs font-semibold shadow-xs transition active:scale-95 cursor-pointer"
                        >
                            Lanjut ke Request Khusus →
                        </button>
                    </div>
                </div>
            )}

            {/* Step 5: Request Khusus (Screen 6) */}
            {currentView === 'bunga_step_5' && (
                <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-300">
                    <div>
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-[#d84062] font-semibold text-xs mb-1.5">
                            <span>✍️</span> Langkah 5 dari 5
                        </div>
                        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-slate-800">
                            Request Khusus
                        </h2>
                        <p className="text-xs sm:text-sm text-slate-500 mt-1">
                            Tulis request bucket yang kamu inginkan secara bebas.
                        </p>
                    </div>

                    {/* Large Textarea */}
                    <div>
                        <textarea
                            rows={4}
                            value={formData.komentar_khusus}
                            onChange={(e) => setFormData({ ...formData, komentar_khusus: e.target.value })}
                            placeholder="Tulis request bucket yang kamu inginkan..."
                            className="w-full bg-white border border-rose-200 rounded-2xl p-4 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-200 focus:border-[#d84062] shadow-2xs leading-relaxed"
                        />
                    </div>

                    {/* Helper Box (Mockup Screen 6) */}
                    <div className="bg-rose-50/70 border border-rose-200 rounded-2xl p-4">
                        <p className="text-xs font-bold text-slate-700 mb-1">Contoh:</p>
                        <p className="text-xs text-slate-600 italic">
                            “Bunga pita warna pink, kertas putih, pita pengikat pink, ditambahkan boneka kecil dan kartu ucapan.”
                        </p>
                        <button
                            type="button"
                            onClick={() => setFormData({ ...formData, komentar_khusus: 'Bunga pita warna pink, kertas putih, pita pengikat pink, ditambahkan boneka kecil dan kartu ucapan.' })}
                            className="mt-2 text-[11px] font-semibold text-[#d84062] hover:underline cursor-pointer"
                        >
                            Gunakan contoh ini ⤴
                        </button>
                    </div>

                    {/* Buttons Navigation */}
                    <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                        <button
                            type="button"
                            onClick={() => setCurrentView('bunga_step_4')}
                            className="px-5 py-2.5 rounded-full border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
                        >
                            ← Kembali
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                setFormData((prev) => ({
                                    ...prev,
                                    isi_request: `Bunga Pita ${prev.warna_bunga === 'Custom Warna' ? prev.warna_bunga_custom || 'Custom' : prev.warna_bunga}`,
                                }));
                                setCurrentView('summary');
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            className="px-7 py-2.5 rounded-full bg-[#d84062] hover:bg-[#be2f50] text-white text-xs font-semibold shadow-xs transition active:scale-95 cursor-pointer"
                        >
                            Lihat Ringkasan →
                        </button>
                    </div>
                </div>
            )}

            {/* ══════════════════════════════════════════════════════════════════
                FLOW: BUCKET UANG (Requirement 2)
            ══════════════════════════════════════════════════════════════════ */}
            {currentView === 'form_uang' && (
                <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-300">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-2xl border border-emerald-100">
                            💵
                        </div>
                        <div>
                            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-slate-800">
                                Request Bucket Uang
                            </h2>
                            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                                Tulis nominal lembaran uang dan request tampilan bucket sesuai kebutuhanmu.
                            </p>
                        </div>
                    </div>

                    {/* Nominal dan Isi Uang */}
                    <div className="bg-white rounded-2xl p-5 border border-rose-100 shadow-2xs space-y-3">
                        <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                            Nominal dan Isi Uang <span className="text-[#d84062]">*</span>
                        </label>
                        <p className="text-xs text-slate-500">
                            Tulis nominal dan jumlah uang yang kamu inginkan. Kamu bisa menggunakan satu nominal atau mencampurkan beberapa nominal uang.
                        </p>
                        <textarea
                            rows={4}
                            value={formData.isi_request}
                            onChange={(e) => setFormData({ ...formData, isi_request: e.target.value })}
                            placeholder={`Contoh:\nRp1.000 × 10 lembar\nRp2.000 × 5 lembar\nRp5.000 × 4 lembar`}
                            className="w-full bg-[#faf8f9] border border-rose-200 rounded-xl p-3 text-xs sm:text-sm text-slate-800 font-mono placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-200"
                        />
                        {/* Quick Presets */}
                        <div className="flex flex-wrap items-center gap-1.5 pt-1">
                            <span className="text-[11px] text-slate-400">Pilihan cepat:</span>
                            {moneyPresets.map((preset) => (
                                <button
                                    key={preset}
                                    type="button"
                                    onClick={() => setFormData((prev) => ({
                                        ...prev,
                                        isi_request: prev.isi_request ? `${prev.isi_request}\n${preset}` : preset,
                                    }))}
                                    className="px-2.5 py-1 rounded-full bg-rose-50 hover:bg-rose-100 text-[#d84062] text-[11px] font-medium transition cursor-pointer"
                                >
                                    + {preset}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Komentar / Request Khusus */}
                    <div className="bg-white rounded-2xl p-5 border border-rose-100 shadow-2xs space-y-3">
                        <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                            Komentar / Request Khusus
                        </label>
                        <textarea
                            rows={3}
                            value={formData.komentar_khusus}
                            onChange={(e) => setFormData({ ...formData, komentar_khusus: e.target.value })}
                            placeholder="Tulis request khusus untuk bucket kamu..."
                            className="w-full bg-[#faf8f9] border border-rose-200 rounded-xl p-3 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-200"
                        />
                        <div className="bg-rose-50/70 p-3 rounded-xl border border-rose-200">
                            <p className="text-[11px] text-slate-500 italic">
                                “Contoh: Saya mau bucket uang dengan campuran Rp1.000 dan Rp2.000, dibuat penuh, menggunakan kertas pink dan pita putih.”
                            </p>
                        </div>
                    </div>

                    {/* Pilihan Tambahan */}
                    {renderAdditionalOptions()}

                    {/* Navigation Buttons */}
                    <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                        <button
                            type="button"
                            onClick={() => setCurrentView('selection')}
                            className="px-5 py-2.5 rounded-full border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
                        >
                            ← Kembali ke Pilihan Bucket
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                setCurrentView('summary');
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            className="px-7 py-2.5 rounded-full bg-[#d84062] hover:bg-[#be2f50] text-white text-xs font-semibold shadow-xs transition active:scale-95 cursor-pointer"
                        >
                            Lihat Ringkasan →
                        </button>
                    </div>
                </div>
            )}

            {/* ══════════════════════════════════════════════════════════════════
                FLOW: BUCKET SNACK (Requirement 3)
            ══════════════════════════════════════════════════════════════════ */}
            {currentView === 'form_snack' && (
                <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-300">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center text-2xl border border-amber-100">
                            🍿
                        </div>
                        <div>
                            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-slate-800">
                                Request Bucket Snack
                            </h2>
                            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                                Tulis snack yang kamu inginkan dan jumlahnya.
                            </p>
                        </div>
                    </div>

                    {/* Isi Snack */}
                    <div className="bg-white rounded-2xl p-5 border border-rose-100 shadow-2xs space-y-3">
                        <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                            Isi Snack <span className="text-[#d84062]">*</span>
                        </label>
                        <p className="text-xs text-slate-500">
                            Tuliskan nama snack dan jumlah yang kamu inginkan.
                        </p>
                        <textarea
                            rows={4}
                            value={formData.isi_request}
                            onChange={(e) => setFormData({ ...formData, isi_request: e.target.value })}
                            placeholder={`Contoh:\n3 Chitato\n2 Pocky\n2 Oreo\n1 Coklat`}
                            className="w-full bg-[#faf8f9] border border-rose-200 rounded-xl p-3 text-xs sm:text-sm text-slate-800 font-mono placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-200"
                        />
                        {/* Quick Presets */}
                        <div className="flex flex-wrap items-center gap-1.5 pt-1">
                            <span className="text-[11px] text-slate-400">Pilihan cepat:</span>
                            {snackPresets.map((preset) => (
                                <button
                                    key={preset}
                                    type="button"
                                    onClick={() => setFormData((prev) => ({
                                        ...prev,
                                        isi_request: prev.isi_request ? `${prev.isi_request}\n${preset}` : preset,
                                    }))}
                                    className="px-2.5 py-1 rounded-full bg-rose-50 hover:bg-rose-100 text-[#d84062] text-[11px] font-medium transition cursor-pointer"
                                >
                                    + {preset}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Komentar / Request Khusus */}
                    <div className="bg-white rounded-2xl p-5 border border-rose-100 shadow-2xs space-y-3">
                        <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                            Komentar / Request Khusus
                        </label>
                        <textarea
                            rows={3}
                            value={formData.komentar_khusus}
                            onChange={(e) => setFormData({ ...formData, komentar_khusus: e.target.value })}
                            placeholder="Tulis request khusus untuk bucket kamu..."
                            className="w-full bg-[#faf8f9] border border-rose-200 rounded-xl p-3 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-200"
                        />
                        <div className="bg-rose-50/70 p-3 rounded-xl border border-rose-200">
                            <p className="text-[11px] text-slate-500 italic">
                                “Contoh: Saya mau snack seperti yang ditulis di atas, pembungkus warna pink dan pita putih.”
                            </p>
                        </div>
                    </div>

                    {/* Pilihan Tambahan */}
                    {renderAdditionalOptions()}

                    {/* Navigation Buttons */}
                    <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                        <button
                            type="button"
                            onClick={() => setCurrentView('selection')}
                            className="px-5 py-2.5 rounded-full border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
                        >
                            ← Kembali ke Pilihan Bucket
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                setCurrentView('summary');
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            className="px-7 py-2.5 rounded-full bg-[#d84062] hover:bg-[#be2f50] text-white text-xs font-semibold shadow-xs transition active:scale-95 cursor-pointer"
                        >
                            Lihat Ringkasan →
                        </button>
                    </div>
                </div>
            )}

            {/* ══════════════════════════════════════════════════════════════════
                FLOW: BUCKET COKLAT (Requirement 4)
            ══════════════════════════════════════════════════════════════════ */}
            {currentView === 'form_coklat' && (
                <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-300">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-orange-50 text-amber-700 flex items-center justify-center text-2xl border border-orange-100">
                            🍫
                        </div>
                        <div>
                            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-slate-800">
                                Request Bucket Coklat
                            </h2>
                            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                                Tulis jenis coklat dan jumlah yang kamu inginkan.
                            </p>
                        </div>
                    </div>

                    {/* Isi Coklat */}
                    <div className="bg-white rounded-2xl p-5 border border-rose-100 shadow-2xs space-y-3">
                        <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                            Isi Coklat <span className="text-[#d84062]">*</span>
                        </label>
                        <textarea
                            rows={4}
                            value={formData.isi_request}
                            onChange={(e) => setFormData({ ...formData, isi_request: e.target.value })}
                            placeholder={`Contoh:\nSilverQueen × 2\nKitKat × 3\nDairy Milk × 2`}
                            className="w-full bg-[#faf8f9] border border-rose-200 rounded-xl p-3 text-xs sm:text-sm text-slate-800 font-mono placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-200"
                        />
                        {/* Quick Presets */}
                        <div className="flex flex-wrap items-center gap-1.5 pt-1">
                            <span className="text-[11px] text-slate-400">Pilihan cepat:</span>
                            {chocolatePresets.map((preset) => (
                                <button
                                    key={preset}
                                    type="button"
                                    onClick={() => setFormData((prev) => ({
                                        ...prev,
                                        isi_request: prev.isi_request ? `${prev.isi_request}\n${preset}` : preset,
                                    }))}
                                    className="px-2.5 py-1 rounded-full bg-rose-50 hover:bg-rose-100 text-[#d84062] text-[11px] font-medium transition cursor-pointer"
                                >
                                    + {preset}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Komentar / Request Khusus */}
                    <div className="bg-white rounded-2xl p-5 border border-rose-100 shadow-2xs space-y-3">
                        <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                            Komentar / Request Khusus
                        </label>
                        <textarea
                            rows={3}
                            value={formData.komentar_khusus}
                            onChange={(e) => setFormData({ ...formData, komentar_khusus: e.target.value })}
                            placeholder="Tulis request khusus untuk bucket kamu..."
                            className="w-full bg-[#faf8f9] border border-rose-200 rounded-xl p-3 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-200"
                        />
                        <div className="bg-rose-50/70 p-3 rounded-xl border border-rose-200">
                            <p className="text-[11px] text-slate-500 italic">
                                “Contoh: Pembungkus warna pink, pita putih, dan tambahkan kartu ucapan.”
                            </p>
                        </div>
                    </div>

                    {/* Pilihan Tambahan */}
                    {renderAdditionalOptions()}

                    {/* Navigation Buttons */}
                    <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                        <button
                            type="button"
                            onClick={() => setCurrentView('selection')}
                            className="px-5 py-2.5 rounded-full border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
                        >
                            ← Kembali ke Pilihan Bucket
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                setCurrentView('summary');
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            className="px-7 py-2.5 rounded-full bg-[#d84062] hover:bg-[#be2f50] text-white text-xs font-semibold shadow-xs transition active:scale-95 cursor-pointer"
                        >
                            Lihat Ringkasan →
                        </button>
                    </div>
                </div>
            )}

            {/* ══════════════════════════════════════════════════════════════════
                FLOW: BUCKET BONEKA (Requirement 5)
            ══════════════════════════════════════════════════════════════════ */}
            {currentView === 'form_boneka' && (
                <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-300">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-pink-50 text-pink-600 flex items-center justify-center text-2xl border border-pink-100">
                            🧸
                        </div>
                        <div>
                            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-slate-800">
                                Request Bucket Boneka
                            </h2>
                            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                                Pilih ukuran, warna, model boneka, dan tuliskan request kamu.
                            </p>
                        </div>
                    </div>

                    {/* Detail Boneka Interaktif */}
                    <div className="bg-white rounded-2xl p-5 border border-rose-100 shadow-2xs space-y-4">
                        <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                            Detail Boneka
                        </label>

                        {/* Ukuran */}
                        <div>
                            <label className="block text-xs text-slate-600 mb-1.5 font-medium">Ukuran Boneka:</label>
                            <div className="grid grid-cols-3 gap-2.5">
                                {['Kecil', 'Sedang', 'Besar'].map((size) => (
                                    <button
                                        key={size}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, boneka_ukuran: size })}
                                        className={[
                                            'py-2 px-3 rounded-xl text-xs font-semibold border transition cursor-pointer',
                                            formData.boneka_ukuran === size
                                                ? 'bg-rose-50 border-[#d84062] text-[#d84062]'
                                                : 'bg-white border-slate-200 text-slate-600 hover:border-rose-200',
                                        ].join(' ')}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Warna & Model */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                                <label className="block text-xs text-slate-600 mb-1.5 font-medium">Warna Boneka:</label>
                                <select
                                    value={formData.boneka_warna}
                                    onChange={(e) => setFormData({ ...formData, boneka_warna: e.target.value })}
                                    className="w-full bg-[#faf8f9] border border-rose-200 rounded-xl p-2.5 text-xs text-slate-800"
                                >
                                    {['Coklat', 'Putih', 'Cream', 'Pink', 'Abu-abu'].map((w) => (
                                        <option key={w} value={w}>{w}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs text-slate-600 mb-1.5 font-medium">Model Boneka:</label>
                                <select
                                    value={formData.boneka_model}
                                    onChange={(e) => setFormData({ ...formData, boneka_model: e.target.value })}
                                    className="w-full bg-[#faf8f9] border border-rose-200 rounded-xl p-2.5 text-xs text-slate-800"
                                >
                                    {['Teddy Bear', 'Kelinci', 'Karakter Lucu', 'Boneka Wisuda'].map((m) => (
                                        <option key={m} value={m}>{m}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Deskripsi Bebas Detail Boneka */}
                        <div>
                            <label className="block text-xs text-slate-600 mb-1.5 font-medium">
                                Catatan Detail Boneka:
                            </label>
                            <input
                                type="text"
                                value={formData.isi_request}
                                onChange={(e) => setFormData({ ...formData, isi_request: e.target.value })}
                                placeholder="Teddy bear warna coklat, ukuran sedang"
                                className="w-full bg-[#faf8f9] border border-rose-200 rounded-xl p-2.5 text-xs text-slate-800"
                            />
                        </div>
                    </div>

                    {/* Komentar / Request Khusus */}
                    <div className="bg-white rounded-2xl p-5 border border-rose-100 shadow-2xs space-y-3">
                        <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                            Komentar / Request Khusus
                        </label>
                        <textarea
                            rows={3}
                            value={formData.komentar_khusus}
                            onChange={(e) => setFormData({ ...formData, komentar_khusus: e.target.value })}
                            placeholder="Tulis request khusus untuk bucket kamu..."
                            className="w-full bg-[#faf8f9] border border-rose-200 rounded-xl p-3 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-200"
                        />
                        <div className="bg-rose-50/70 p-3 rounded-xl border border-rose-200">
                            <p className="text-[11px] text-slate-500 italic">
                                “Contoh: Saya mau boneka teddy bear warna coklat dengan pembungkus pink dan pita putih.”
                            </p>
                        </div>
                    </div>

                    {/* Pilihan Tambahan */}
                    {renderAdditionalOptions()}

                    {/* Navigation Buttons */}
                    <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                        <button
                            type="button"
                            onClick={() => setCurrentView('selection')}
                            className="px-5 py-2.5 rounded-full border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
                        >
                            ← Kembali ke Pilihan Bucket
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                const fullBonekaDesc = `${formData.boneka_model} warna ${formData.boneka_warna}, ukuran ${formData.boneka_ukuran}. ${formData.isi_request || ''}`;
                                setFormData((prev) => ({ ...prev, isi_request: fullBonekaDesc }));
                                setCurrentView('summary');
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            className="px-7 py-2.5 rounded-full bg-[#d84062] hover:bg-[#be2f50] text-white text-xs font-semibold shadow-xs transition active:scale-95 cursor-pointer"
                        >
                            Lihat Ringkasan →
                        </button>
                    </div>
                </div>
            )}

            {/* ══════════════════════════════════════════════════════════════════
                FLOW: BUCKET KOMBINASI (Requirement 7)
            ══════════════════════════════════════════════════════════════════ */}
            {currentView === 'form_kombinasi' && (
                <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-300">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center text-2xl border border-purple-100">
                            🎁
                        </div>
                        <div>
                            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-slate-800">
                                Request Bucket Kombinasi
                            </h2>
                            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                                Gabungkan beberapa isi bucket sesuai keinginanmu secara bebas.
                            </p>
                        </div>
                    </div>

                    {/* Isi Bucket Bebas */}
                    <div className="bg-white rounded-2xl p-5 border border-rose-100 shadow-2xs space-y-3">
                        <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                            Tulis Isi Bucket yang Kamu Inginkan <span className="text-[#d84062]">*</span>
                        </label>
                        <textarea
                            rows={4}
                            value={formData.isi_request}
                            onChange={(e) => setFormData({ ...formData, isi_request: e.target.value })}
                            placeholder={`Contoh:\nSaya mau uang Rp1.000 dan Rp2.000, coklat SilverQueen, boneka teddy bear kecil, dan bunga pita warna pink.`}
                            className="w-full bg-[#faf8f9] border border-rose-200 rounded-xl p-3 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-200 leading-relaxed"
                        />
                    </div>

                    {/* Komentar / Request Khusus */}
                    <div className="bg-white rounded-2xl p-5 border border-rose-100 shadow-2xs space-y-3">
                        <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                            Komentar / Request Khusus
                        </label>
                        <textarea
                            rows={3}
                            value={formData.komentar_khusus}
                            onChange={(e) => setFormData({ ...formData, komentar_khusus: e.target.value })}
                            placeholder="Tulis permintaan lain seperti warna pembungkus, pita, hiasan, ukuran, atau detail lainnya..."
                            className="w-full bg-[#faf8f9] border border-rose-200 rounded-xl p-3 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-200"
                        />
                    </div>

                    {/* Pilihan Tambahan */}
                    {renderAdditionalOptions()}

                    {/* Navigation Buttons */}
                    <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                        <button
                            type="button"
                            onClick={() => setCurrentView('selection')}
                            className="px-5 py-2.5 rounded-full border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
                        >
                            ← Kembali ke Pilihan Bucket
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                setCurrentView('summary');
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            className="px-7 py-2.5 rounded-full bg-[#d84062] hover:bg-[#be2f50] text-white text-xs font-semibold shadow-xs transition active:scale-95 cursor-pointer"
                        >
                            Lihat Ringkasan →
                        </button>
                    </div>
                </div>
            )}

            {/* ══════════════════════════════════════════════════════════════════
                8. RINGKASAN REQUEST (Mockup Screen 7)
            ══════════════════════════════════════════════════════════════════ */}
            {currentView === 'summary' && (
                <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-300">
                    <div>
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-[#d84062] font-semibold text-xs mb-1.5">
                            <span>📋</span> Ringkasan Pesanan
                        </div>
                        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-slate-800">
                            Ringkasan Bucket Kamu
                        </h2>
                        <p className="text-xs sm:text-sm text-slate-500 mt-1">
                            Periksa kembali detail request bucket kamu sebelum dikirim ke toko.
                        </p>
                    </div>

                    {/* Split Card: Left Image Preview, Right Specs Table (Mockup 7) */}
                    <div className="bg-white rounded-3xl p-5 sm:p-7 border border-rose-100 shadow-sm grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                        {/* Left Preview Image */}
                        <div className="md:col-span-5">
                            <div className="w-full aspect-[4/5] rounded-2xl overflow-hidden bg-rose-50 border border-rose-100 shadow-2xs relative">
                                <img
                                    src={selectedCategory?.image || '/images/custom/bunga_pita.jpg'}
                                    alt="Preview Bucket"
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-xs px-3 py-1 rounded-full border border-rose-100 shadow-2xs">
                                    <p className="text-xs font-bold text-[#d84062]">
                                        {selectedCategory?.icon} {formData.jenis_bucket}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Right Summary Specs */}
                        <div className="md:col-span-7 flex flex-col justify-between h-full space-y-4">
                            <div>
                                <h3 className="font-serif font-bold text-xl text-slate-800 mb-3 border-b border-rose-50 pb-2">
                                    Detail Request Bucket
                                </h3>

                                <div className="space-y-2.5 text-xs">
                                    <div className="flex items-start justify-between py-1 border-b border-slate-100">
                                        <span className="text-slate-400 w-32 flex-shrink-0">Jenis Bucket</span>
                                        <span className="font-bold text-slate-800 text-right">{formData.jenis_bucket}</span>
                                    </div>

                                    <div className="flex items-start justify-between py-1 border-b border-slate-100">
                                        <span className="text-slate-400 w-32 flex-shrink-0">Isi / Request</span>
                                        <span className="font-semibold text-slate-800 text-right whitespace-pre-line max-w-xs">
                                            {formData.isi_request || 'Sesuai request'}
                                        </span>
                                    </div>

                                    {selectedCategory?.id === 'bunga_pita' && (
                                        <div className="flex items-start justify-between py-1 border-b border-slate-100">
                                            <span className="text-slate-400 w-32 flex-shrink-0">Bunga Pita</span>
                                            <span className="font-semibold text-[#d84062] text-right">
                                                {formData.warna_bunga === 'Custom Warna'
                                                    ? (formData.warna_bunga_custom || 'Custom Warna')
                                                    : formData.warna_bunga}
                                            </span>
                                        </div>
                                    )}

                                    <div className="flex items-start justify-between py-1 border-b border-slate-100">
                                        <span className="text-slate-400 w-32 flex-shrink-0">Kertas Pembungkus</span>
                                        <span className="font-semibold text-slate-800 text-right">
                                            {formData.warna_kertas} ({formData.model_kertas})
                                        </span>
                                    </div>

                                    <div className="flex items-start justify-between py-1 border-b border-slate-100">
                                        <span className="text-slate-400 w-32 flex-shrink-0">Pita Pengikat</span>
                                        <span className="font-semibold text-slate-800 text-right">
                                            {formData.warna_pita} ({formData.model_pita})
                                        </span>
                                    </div>

                                    <div className="flex items-start justify-between py-1 border-b border-slate-100">
                                        <span className="text-slate-400 w-32 flex-shrink-0">Hiasan Tambahan</span>
                                        <span className="font-semibold text-slate-800 text-right">
                                            {formData.hiasan.length > 0 ? formData.hiasan.join(', ') : 'Tanpa hiasan'}
                                        </span>
                                    </div>

                                    <div className="flex items-start justify-between py-1 border-b border-slate-100">
                                        <span className="text-slate-400 w-32 flex-shrink-0">Request Khusus</span>
                                        <span className="font-normal text-slate-700 italic text-right max-w-xs">
                                            {formData.komentar_khusus ? `“${formData.komentar_khusus}”` : '—'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Estimasi Harga Card */}
                            <div className="bg-rose-50/60 rounded-2xl p-4 border border-rose-100/90 mt-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <span className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold">
                                            Estimasi Harga
                                        </span>
                                        <p className="text-[10px] text-slate-400">
                                            Final harga dikonfirmasi toko
                                        </p>
                                    </div>
                                    <p className="text-xl font-extrabold text-[#d84062]">
                                        {formatRupiah(estimatedPrice)}
                                    </p>
                                </div>
                            </div>

                            {/* Buttons: Ubah Pilihan & Kirim Request (Mockup 7) */}
                            <div className="flex items-center gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => {
                                        if (selectedCategory?.id === 'bunga_pita') setCurrentView('bunga_step_5');
                                        else if (selectedCategory?.id === 'uang') setCurrentView('form_uang');
                                        else if (selectedCategory?.id === 'snack') setCurrentView('form_snack');
                                        else if (selectedCategory?.id === 'coklat') setCurrentView('form_coklat');
                                        else if (selectedCategory?.id === 'boneka') setCurrentView('form_boneka');
                                        else setCurrentView('form_kombinasi');
                                    }}
                                    className="px-5 py-3 rounded-2xl border border-rose-200 text-xs font-semibold text-[#d84062] hover:bg-rose-50 transition active:scale-95 cursor-pointer whitespace-nowrap"
                                >
                                    ← Ubah Pilihan
                                </button>

                                <button
                                    type="button"
                                    onClick={handleSubmitRequest}
                                    disabled={submitting}
                                    className="flex-1 py-3 rounded-2xl bg-[#d84062] hover:bg-[#be2f50] text-white text-xs sm:text-sm font-bold shadow-md shadow-rose-200 transition active:scale-98 cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    {submitting ? (
                                        <>
                                            <span className="animate-spin">⏳</span>
                                            <span>Mengirim Request...</span>
                                        </>
                                    ) : (
                                        <>
                                            <span>💗</span>
                                            <span>Kirim Request</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ══════════════════════════════════════════════════════════════════
                9. NOTIFIKASI BERHASIL MODAL (Mockup Screen 8)
            ══════════════════════════════════════════════════════════════════ */}
            {isSuccessModalOpen && (
                <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
                    <div
                        className="bg-white rounded-3xl max-w-sm w-full p-7 text-center shadow-2xl border border-rose-100 animate-in zoom-in-95 duration-200"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Success Icon & Illustration */}
                        <div className="relative w-20 h-20 mx-auto mb-4">
                            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center text-3xl mx-auto shadow-inner border border-emerald-100">
                                ✓
                            </div>
                            <span className="absolute -bottom-1 -right-1 text-2xl">
                                💐
                            </span>
                        </div>

                        {/* Order Code Badge */}
                        <div className="inline-block px-3 py-1 bg-rose-50 text-[#d84062] rounded-full text-xs font-bold font-mono mb-2">
                            {createdOrderCode || '#BK20261007001'}
                        </div>

                        {/* Heading & Subtitle */}
                        <h3 className="font-serif font-bold text-xl text-slate-800">
                            Request bucket berhasil dikirim!
                        </h3>
                        <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                            Request bucket kamu telah berhasil dikirim. Silakan tunggu konfirmasi dari toko.
                        </p>

                        {/* Buttons (Lihat Riwayat Pesanan & Kembali ke Kostum Bucket) */}
                        <div className="space-y-2.5 mt-6">
                            <Link
                                href={route('orders.index')}
                                className="w-full py-2.5 px-4 rounded-full bg-[#d84062] hover:bg-[#be2f50] text-white text-xs font-bold shadow-sm transition active:scale-95 block"
                            >
                                Lihat Riwayat Pesanan
                            </Link>

                            <button
                                type="button"
                                onClick={handleResetToSelection}
                                className="w-full py-2.5 px-4 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-semibold transition active:scale-95 cursor-pointer"
                            >
                                Kembali ke Kostum Bucket
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </UserDashboardLayout>
    );
}
