import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import UserDashboardLayout from '@/Layouts/UserDashboardLayout';

const defaultFeaturedProducts = [
    {
        id: 1,
        name: 'Buket Uang',
        price: 150000,
        image: '/images/products/produk-1.jpg',
    },
    {
        id: 2,
        name: 'Buket Bunga Artificial',
        price: 130000,
        image: '/images/products/produk-2.jpg',
    },
    {
        id: 3,
        name: 'Buket Bunga Sintetis',
        price: 110000,
        image: '/images/products/produk-3.jpg',
    },
    {
        id: 4,
        name: 'Premium Artificial Bouquet',
        price: 170000,
        image: '/images/products/produk-4.jpg',
    },
];

const formatRupiah = (n) =>
    'Rp ' + Number(n).toLocaleString('id-ID');

export default function Dashboard({ products = [], activeOrder = null }) {
    const { auth } = usePage().props;
    const isAdmin = auth?.user?.role === 'admin';

    const [searchQuery, setSearchQuery] = useState('');
    const [toastMsg, setToastMsg] = useState(null);
    const [addingId, setAddingId] = useState(null);
    const [buyingId, setBuyingId] = useState(null);
    const [showAll, setShowAll] = useState(false);

    // Merge database products with default mockup products if DB products exist
    const displayProducts = products && products.length > 0 
        ? products.map((p, idx) => ({
            id: p.id,
            name: p.name,

            price: p.price,
            image: p.image_url || defaultFeaturedProducts[idx % defaultFeaturedProducts.length].image,
            db_id: p.id,
        }))
        : defaultFeaturedProducts.map((dfp) => {
            const match = products?.find((p) => p.name?.toLowerCase().includes(dfp.name.toLowerCase().split(' ')[1] || ''));
            return {
                ...dfp,
                db_id: match ? match.id : products?.[0]?.id || null,
            };
        });

    const filteredProducts = displayProducts.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleAddToCart = (product) => {
        setAddingId(product.id);
        const targetId = product.db_id || products?.[0]?.id;

        if (targetId) {
            router.post(
                route('cart.store'),
                { product_id: targetId, quantity: 1 },
                {
                    preserveScroll: true,
                    onSuccess: () => {
                        setToastMsg(`${product.name} berhasil ditambahkan ke keranjang! 🌸`);
                        setTimeout(() => setToastMsg(null), 3000);
                        setAddingId(null);
                    },
                    onError: () => {
                        setToastMsg(`Gagal menambahkan ke keranjang.`);
                        setTimeout(() => setToastMsg(null), 3000);
                        setAddingId(null);
                    }
                }
            );
        } else {
            setToastMsg(`${product.name} dimasukkan ke keranjang pilihan! 🌸`);
            setTimeout(() => setToastMsg(null), 3000);
            setAddingId(null);
        }
    };

    const handleBuyNow = (product) => {
        setBuyingId(product.id);
        const targetId = product.db_id || products?.[0]?.id;

        if (targetId) {
            router.post(
                route('cart.store'),
                { product_id: targetId, quantity: 1 },
                {
                    onSuccess: () => {
                        router.visit(route('checkout.index'));
                    },
                    onError: () => {
                        setToastMsg(`Gagal memproses pembelian.`);
                        setTimeout(() => setToastMsg(null), 3000);
                        setBuyingId(null);
                    }
                }
            );
        } else {
            router.visit(route('checkout.index'));
        }
    };

    return (
        <UserDashboardLayout activeNav="home" searchValue={searchQuery} onSearchChange={setSearchQuery}>
            <Head title="Beranda - Florabelle" />

            {/* Toast Notification */}
            {toastMsg && (
                <div className="fixed bottom-6 right-6 z-50 bg-slate-900/95 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 text-sm animate-fade-in border border-rose-500/30">
                    <span className="text-rose-400">✨</span>
                    <span>{toastMsg}</span>
                    <button
                        onClick={() => setToastMsg(null)}
                        className="ml-2 text-slate-400 hover:text-white text-xs"
                    >
                        ✕
                    </button>
                </div>
            )}

            <div className="space-y-5">
                {/* Active Order Alert (if exists) */}
                {activeOrder && (
                    <div className="bg-rose-50/70 border border-rose-200/80 rounded-2xl p-4 flex items-center justify-between gap-4 shadow-2xs">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-white text-[#d84062] flex items-center justify-center shadow-2xs text-lg">
                                📦
                            </div>
                            <div>
                                <p className="text-xs text-rose-500 font-semibold">Pesanan Sedang Berjalan</p>
                                <p className="text-sm font-bold text-slate-800">
                                    Pesanan #{activeOrder.id} · <span className="capitalize text-[#d84062]">{activeOrder.status}</span>
                                </p>
                            </div>
                        </div>
                        <Link
                            href={route('orders.show', activeOrder.raw_id)}
                            className="text-xs font-bold bg-[#d84062] hover:bg-[#be2f50] text-white px-4 py-2 rounded-xl transition shadow-2xs"
                        >
                            Lihat Detail →
                        </Link>
                    </div>
                )}

                {/* ── 1. HERO SLIDER BANNER ── */}
                <div
                    className="relative overflow-hidden rounded-[28px] px-6 py-5 lg:px-10 lg:py-6 shadow-2xs border border-rose-100"
                    style={{
                        background: 'linear-gradient(135deg, #fff2f5 0%, #fde2e8 48%, #fcd4dc 100%)',
                    }}
                >
                    {/* Background Doodles & Floating Hearts */}
                    <div className="absolute top-4 left-1/3 select-none pointer-events-none opacity-40 text-rose-400 text-xs">
                        💕
                    </div>
                    <div className="absolute bottom-6 left-1/4 select-none pointer-events-none opacity-30 text-rose-400 text-[10px]">
                        ♡
                    </div>
                    <div className="absolute top-5 right-1/2 select-none pointer-events-none opacity-20 text-rose-300 text-sm">
                        ✨
                    </div>

                    <div className="relative z-10 flex flex-row items-center justify-between gap-6">
                        {/* Text Left */}
                        <div className="max-w-xs sm:max-w-sm lg:max-w-md text-left">
                            <p className="text-slate-600 font-medium text-xs lg:text-sm">
                                Selamat Datang di
                            </p>
                            <h2 className="font-serif text-2xl lg:text-3xl font-extrabold text-[#9f1239] tracking-tight leading-tight mt-0.5 mb-1">
                                Florabelle
                            </h2>
                            <p className="text-slate-600 text-xs lg:text-sm leading-relaxed mb-3.5 font-normal max-w-xs sm:max-w-sm">
                                Rangkaian bunga terbaik untuk setiap momen spesialmu.
                            </p>

                            <a
                                href="#produk-populer"
                                className="inline-flex items-center gap-1.5 px-5 py-2 rounded-full bg-[#d84062] hover:bg-[#be2f50] text-white font-semibold text-xs shadow-sm shadow-rose-200 transition-all active:scale-95 duration-200"
                            >
                                <span>Belanja Sekarang</span>
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                </svg>
                            </a>
                        </div>

                        {/* Image Right */}
                        <div className="flex-shrink-0 relative">
                            <div className="w-32 h-32 sm:w-40 sm:h-40 lg:w-44 lg:h-44 rounded-full overflow-hidden p-1.5 bg-white/40 backdrop-blur-xs shadow-md border-2 border-white/80">
                                <img
                                    src="/images/products/produk-1.jpg"
                                    alt="Florabelle Rose Bouquet"
                                    className="w-full h-full object-cover rounded-full hover:scale-105 transition-transform duration-500"
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = 'https://images.unsplash.com/photo-1563241527-3004b7be0ffd?auto=format&fit=crop&w=600&q=80';
                                    }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Slider Indicator Dots */}
                    <div className="flex items-center justify-center gap-1.5 mt-3 relative z-10">
                        <span className="w-5 h-1.5 rounded-full bg-[#d84062]"></span>
                        <span className="w-1.5 h-1.5 rounded-full bg-white/70"></span>
                        <span className="w-1.5 h-1.5 rounded-full bg-white/70"></span>
                        <span className="w-1.5 h-1.5 rounded-full bg-white/70"></span>
                    </div>
                </div>

                {/* ── 2. VALUE PROPOSITION / FEATURE BAR (4 CARDS) ── */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {/* Feature 1 */}
                    <div className="bg-white rounded-2xl p-3.5 sm:p-4 border border-rose-100/70 shadow-2xs text-center flex flex-col items-center hover:shadow-xs transition duration-200">
                        <div className="w-12 h-12 rounded-full bg-rose-50 text-[#d84062] flex items-center justify-center mb-3">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                            </svg>
                        </div>
                        <h4 className="font-bold text-slate-800 text-sm">Pengiriman Cepat</h4>
                        <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                            Sampai di hari yang sama (area tertentu)
                        </p>
                    </div>

                    {/* Feature 2 */}
                    <div className="bg-white rounded-2xl p-3.5 sm:p-4 border border-rose-100/70 shadow-2xs text-center flex flex-col items-center hover:shadow-xs transition duration-200">
                        <div className="w-12 h-12 rounded-full bg-rose-50 text-[#d84062] flex items-center justify-center mb-3">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                        </div>
                        <h4 className="font-bold text-slate-800 text-sm">Bunga Segar</h4>
                        <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                            Dari petani langsung ke tangan Anda
                        </p>
                    </div>

                    {/* Feature 3 */}
                    <div className="bg-white rounded-2xl p-3.5 sm:p-4 border border-rose-100/70 shadow-2xs text-center flex flex-col items-center hover:shadow-xs transition duration-200">
                        <div className="w-12 h-12 rounded-full bg-rose-50 text-[#d84062] flex items-center justify-center mb-3">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                            </svg>
                        </div>
                        <h4 className="font-bold text-slate-800 text-sm">Harga Terjangkau</h4>
                        <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                            Kualitas premium dengan harga terbaik
                        </p>
                    </div>

                    {/* Feature 4 */}
                    <div className="bg-white rounded-2xl p-3.5 sm:p-4 border border-rose-100/70 shadow-2xs text-center flex flex-col items-center hover:shadow-xs transition duration-200">
                        <div className="w-12 h-12 rounded-full bg-rose-50 text-[#d84062] flex items-center justify-center mb-3">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                        </div>
                        <h4 className="font-bold text-slate-800 text-sm">Layanan Pelanggan</h4>
                        <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                            Siap membantu setiap hari
                        </p>
                    </div>
                </div>

                {/* ── 3. PRODUK POPULER SECTION ── */}
                <div id="produk-populer" className="pt-2">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-5 gap-4">
                        <div>
                            <h3 className="font-bold text-lg lg:text-xl text-slate-800 tracking-tight">
                                Produk Populer
                            </h3>
                            <p className="text-xs text-slate-400 mt-0.5">
                                {searchQuery ? `Hasil pencarian "${searchQuery}"` : 'Pilihan terbaik untuk berbagai momen spesial'}
                            </p>
                        </div>
                        <div className="flex flex-col sm:flex-row items-end sm:items-center gap-3">
                            {/* Local Search Input */}
                            <div className="relative w-full sm:w-56 lg:w-64">
                                <svg className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Cari produk di sini..."
                                    className="w-full pl-9 pr-4 py-2 rounded-xl bg-white border border-rose-100/90 text-xs text-slate-700 placeholder-slate-400 focus:outline-none focus:border-rose-300 focus:ring-2 focus:ring-rose-100 transition shadow-2xs"
                                />
                            </div>

                            <button
                                onClick={() => setShowAll(!showAll)}
                                className="text-xs lg:text-sm font-semibold text-[#d84062] hover:text-[#be2f50] flex items-center gap-1 group transition cursor-pointer whitespace-nowrap"
                            >
                                <span>{showAll ? 'Tampilkan Sebagian' : 'Lihat Semua'}</span>
                                <span className="group-hover:translate-y-0.5 transition-transform">
                                    {showAll ? '↑' : '↓'}
                                </span>
                            </button>
                        </div>
                    </div>

                    {/* Cards Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-5">
                        {(showAll ? filteredProducts : filteredProducts.slice(0, 4)).map((p) => (
                            <div
                                key={p.id}
                                className="bg-white rounded-2xl p-3 border border-slate-100 shadow-2xs hover:shadow-md transition-all duration-300 flex flex-col justify-between group"
                            >
                                <div>
                                    {/* Image */}
                                    <div className="w-full aspect-[4/3] rounded-xl overflow-hidden bg-rose-50/50 mb-3 relative">
                                        <img
                                            src={p.image}
                                            alt={p.name}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = 'https://images.unsplash.com/photo-1563241527-3004b7be0ffd?auto=format&fit=crop&w=500&q=80';
                                            }}
                                        />
                                    </div>

                                    {/* Title */}
                                    <h4 className="font-semibold text-slate-800 text-xs sm:text-sm truncate leading-snug">
                                        {p.name}
                                    </h4>
                                </div>

                                {/* Price & Action buttons */}
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between mt-3 pt-2 border-t border-slate-100 gap-2">
                                    <div>
                                        <span className="text-[10px] text-slate-400 block leading-tight">Harga</span>
                                        <p className="font-bold text-[#d84062] text-xs sm:text-sm">
                                            {formatRupiah(p.price)}
                                        </p>
                                    </div>

                                    {!isAdmin && (
                                        <div className="flex items-center gap-1.5 self-end sm:self-auto">
                                            {/* Tombol Keranjang */}
                                            <button
                                                type="button"
                                                onClick={() => handleAddToCart(p)}
                                                disabled={addingId === p.id}
                                                className="inline-flex items-center justify-center p-2 rounded-xl bg-rose-50 hover:bg-rose-100 active:scale-95 text-[#d84062] border border-rose-200/80 shadow-2xs transition duration-200 cursor-pointer disabled:opacity-50"
                                                title="Tambah ke Keranjang"
                                            >
                                                {addingId === p.id ? (
                                                    <span className="text-[10px]">...</span>
                                                ) : (
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round"
                                                            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                                    </svg>
                                                )}
                                            </button>

                                            {/* Tombol Beli */}
                                            <button
                                                type="button"
                                                onClick={() => handleBuyNow(p)}
                                                disabled={buyingId === p.id}
                                                className="inline-flex items-center justify-center gap-1 px-3 py-1.5 rounded-xl bg-[#d84062] hover:bg-[#be2f50] active:scale-95 text-white font-semibold text-xs shadow-xs transition duration-200 cursor-pointer disabled:opacity-50"
                                                title="Beli Sekarang"
                                            >
                                                {buyingId === p.id ? (
                                                    <span className="text-[10px]">...</span>
                                                ) : (
                                                    <span>Beli</span>
                                                )}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── 4. SECONDARY BANNER (PROMO CARD) ── */}
                <div
                    className="relative overflow-hidden rounded-[28px] px-6 py-4 lg:px-10 lg:py-6 border border-rose-100 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-4"
                    style={{
                        background: 'linear-gradient(135deg, #fff2f5 0%, #fde2e8 50%, #fcd4dc 100%)',
                    }}
                >
                    {/* Left text */}
                    <div className="max-w-md">
                        <h3 className="font-serif italic text-xl lg:text-2xl font-bold text-[#9f1239] leading-tight">
                            Buket Special untuk Orang Special
                        </h3>
                        <p className="text-slate-600 text-[11px] lg:text-xs mt-1.5 font-normal leading-relaxed">
                            Rayakan momen indah dengan bunga terbaik dari Florabelle.
                        </p>
                        <Link
                            href={route('products.index')}
                            className="inline-flex items-center gap-1.5 mt-3 px-5 py-2 rounded-full bg-[#d84062] hover:bg-[#be2f50] text-white font-semibold text-xs shadow-xs transition active:scale-95 duration-200"
                        >
                            <span>Lihat Koleksi</span>
                            <span>→</span>
                        </Link>
                    </div>

                    {/* Right Bouquet Illustration/Image */}
                    <div className="flex-shrink-0">
                        <div className="w-28 h-28 sm:w-36 sm:h-36 lg:w-44 lg:h-44 rounded-full overflow-hidden p-1.5 bg-white/40 backdrop-blur-xs border-4 border-white/70 shadow-lg">
                            <img
                                src="/images/products/produk-2.jpg"
                                alt="Special Bouquet Florabelle"
                                className="w-full h-full object-cover rounded-full hover:scale-105 transition-transform duration-500"
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = 'https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?auto=format&fit=crop&w=600&q=80';
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </UserDashboardLayout>
    );
}
