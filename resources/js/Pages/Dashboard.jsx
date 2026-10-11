import { Head, Link, usePage, router } from '@inertiajs/react';
import { useState } from 'react';
import axios from 'axios';

/* ───────────────────────── DATA ───────────────────────── */
const navItems = [
    {
        id: 'home',
        label: 'Beranda',
        href: '#',
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round"
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
        ),
    },
    {
        id: 'custom',
        label: 'Kustom Buket',
        href: '/custom-bouquet',
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round"
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
        ),
    },
    {
        id: 'orders',
        label: 'Riwayat Pesanan',
        href: '/orders',
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round"
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
        ),
    },
    {
        id: 'address',
        label: 'Profil',
        href: '/profile',
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round"
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
        ),
    },
];

const products = [
    {
        id: 1,
        name: 'Romantic Rose Bouquet',
        type: 'Bunga Segar',
        price: 250000,
        rating: 4.9,
        reviews: 128,
        badge: ' Terlaris',
        badgeColor: '#f472b6',
        image: 'https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?auto=format&fit=crop&w=400&q=80',
    },
    {
        id: 2,
        name: 'Pastel Elegance Bouquet',
        type: 'Bunga Segar',
        price: 185000,
        rating: 4.8,
        reviews: 94,
        badge: ' New',
        badgeColor: '#a78bfa',
        image: 'https://images.unsplash.com/photo-1591886960571-74d43a9d4166?auto=format&fit=crop&w=400&q=80',
    },
    {
        id: 3,
        name: 'Rustic Dried Flower',
        type: 'Bunga Kering',
        price: 145000,
        rating: 4.7,
        reviews: 76,
        badge: ' Eco',
        badgeColor: '#4ade80',
        image: 'https://images.unsplash.com/photo-1562106888-f8013ed14dce?auto=format&fit=crop&w=400&q=80',
    },
    {
        id: 4,
        name: 'Lilac Bloom Box',
        type: 'Bloom Box',
        price: 320000,
        rating: 5.0,
        reviews: 57,
        badge: ' Premium',
        badgeColor: '#c084fc',
        image: 'https://images.unsplash.com/photo-1596438459194-f275f413d6ff?auto=format&fit=crop&w=400&q=80',
    },
    {
        id: 5,
        name: 'Sunflower Cheer',
        type: 'Bunga Segar',
        price: 175000,
        rating: 4.6,
        reviews: 89,
        badge: ' Ceria',
        badgeColor: '#fbbf24',
        image: 'https://images.unsplash.com/photo-1597848212624-a19eb35e2651?auto=format&fit=crop&w=400&q=80',
    },
    {
        id: 6,
        name: 'Artificial Tulip Set',
        type: 'Bunga Artifisial',
        price: 95000,
        rating: 4.5,
        reviews: 112,
        badge: ' Awet',
        badgeColor: '#60a5fa',
        image: 'https://images.unsplash.com/photo-1490750967868-88df5691cc0a?auto=format&fit=crop&w=400&q=80',
    },
];

/* ── helpers ── */
const formatRupiah = (n) =>
    'Rp ' + n.toLocaleString('id-ID');

const StarRating = ({ rating }) => {
    const full = Math.floor(rating);
    const half = rating % 1 >= 0.5;
    return (
        <span className="flex items-center gap-0.5">
            {[...Array(5)].map((_, i) => (
                <svg key={i} className="w-3 h-3" viewBox="0 0 20 20" fill={i < full ? '#fbbf24' : (i === full && half ? 'url(#half)' : '#e2e8f0')}>
                    <defs>
                        <linearGradient id="half">
                            <stop offset="50%" stopColor="#fbbf24" />
                            <stop offset="50%" stopColor="#e2e8f0" />
                        </linearGradient>
                    </defs>
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
            ))}
        </span>
    );
};

/* ═══════════════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════════════ */
export default function Dashboard({ products: dbProducts = [] }) {
    const { auth, cartCount = 0 } = usePage().props;
    const user = auth.user;

    const [activeNav, setActiveNav] = useState('home');
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [addedItems, setAddedItems] = useState({});
    const [toastMsg, setToastMsg] = useState(null);
    const [hasActiveDelivery] = useState(true);

    const firstName = user?.name?.split(' ')[0] || 'Sis';

    // Map database products if available, with static fallback
    const displayProducts = dbProducts.length > 0 ? dbProducts.map((p, idx) => ({
        id: p.id,
        name: p.name,
        type: p.category || 'Bunga Segar',
        price: p.price,
        rating: 4.8,
        reviews: 90 + idx * 5,
        badge: idx === 0 ? ' Terlaris' : (idx === 1 ? ' New' : null),
        badgeColor: idx === 0 ? '#f472b6' : '#a78bfa',
        image: p.image_url || products[idx % products.length]?.image || 'https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?auto=format&fit=crop&w=400&q=80',
    })) : products;

    const handleAddToCart = (productId) => {
        router.post(route('cart.store'), {
            product_id: productId,
            quantity: 1
        }, {
            preserveScroll: true,
            onSuccess: () => {
                setAddedItems((prev) => ({ ...prev, [productId]: true }));
                setToastMsg('Berhasil ditambahkan ke keranjang! ');
                setTimeout(() => setAddedItems((prev) => ({ ...prev, [productId]: false })), 2000);
                setTimeout(() => setToastMsg(null), 3000);
            }
        });
    };

    return (
        <div className="flex min-h-screen bg-[#f8f9fc]" style={{ fontFamily: "'Inter', 'Segoe UI', sans-serif" }}>
            <Head title="Beranda — Florabelle.id" />

            {/* ── Mobile Overlay ── */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/40 z-20 lg:hidden backdrop-blur-sm"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* ═══════════════════════════════════════
                SIDEBAR
            ═══════════════════════════════════════ */}
            <aside
                className={[
                    'fixed top-0 left-0 h-full z-30 w-64 flex flex-col',
                    'border-r border-blue-100/80',
                    'transition-transform duration-300 ease-in-out',
                    sidebarOpen ? 'translate-x-0' : '-translate-x-full',
                    'lg:translate-x-0 lg:static lg:shadow-none',
                ].join(' ')}
                style={{ background: 'linear-gradient(180deg, #eff6ff 0%, #f5f9ff 40%, #fff0f8 100%)' }}
            >
                {/* Logo */}
                <div className="px-6 pt-7 pb-6 border-b border-blue-100/60">
                    <Link href="/" className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center shadow-sm text-xl"
                            style={{ background: 'linear-gradient(135deg, #f9a8d4, #93c5fd)' }}>
                            
                        </div>
                        <div>
                            <p className="font-extrabold text-pink-400 tracking-wide leading-tight text-[15px]">
                                Florabelle.id
                            </p>
                            <p className="text-slate-400 tracking-widest uppercase" style={{ fontSize: '9px' }}>
                                Palu · Sulteng
                            </p>
                        </div>
                    </Link>
                </div>

                {/* Profile chip */}
                <div className="mx-4 mt-4 mb-2 bg-white/80 rounded-2xl p-3.5 shadow-sm border border-pink-100/60 flex items-center gap-3">
                    <div
                        className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shadow"
                        style={{ background: 'linear-gradient(135deg, #f9a8d4 0%, #93c5fd 100%)' }}
                    >
                        {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                    <div className="min-w-0 flex-1">
                        <p className="text-[13px] font-semibold text-slate-700 truncate">{user?.name}</p>
                        <span className="inline-block mt-0.5 bg-pink-50 text-pink-400 rounded-full px-2 py-0.5 text-[10px] font-bold tracking-wide">
                             Member
                        </span>
                    </div>
                </div>

                {/* Nav */}
                <nav className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto">
                    <p className="px-3 pt-1 pb-2 font-bold text-slate-400 uppercase tracking-widest" style={{ fontSize: '9px' }}>
                        Navigasi
                    </p>
                    {navItems.map((item) => (
                        <Link
                            key={item.id}
                            href={item.href}
                            onClick={(e) => { 
                                if (item.href === '#') {
                                    e.preventDefault(); 
                                    setActiveNav(item.id); 
                                }
                            }}
                            className={[
                                'flex items-center gap-3 px-4 py-3 rounded-xl text-[13px] font-medium transition-all duration-200 relative',
                                activeNav === item.id
                                    ? 'bg-white text-pink-400 shadow-sm border border-pink-100/80'
                                    : 'text-slate-500 hover:bg-white/70 hover:text-pink-400',
                            ].join(' ')}
                        >
                            <span className={activeNav === item.id ? 'text-pink-400' : 'text-slate-400'}>
                                {item.icon}
                            </span>
                            <span className="flex-1">{item.label}</span>
                            {item.badge && (
                                <span className="bg-red-400 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                                    {cartCount}
                                </span>
                            )}
                            {activeNav === item.id && (
                                <span className="w-1 h-6 rounded-full bg-pink-400" />
                            )}
                        </Link>
                    ))}
                </nav>

                {/* Logout */}
                <div className="p-4 border-t border-blue-100/60">
                    <button
                        onClick={async (e) => {
                            e.preventDefault();
                            try {
                                await axios.post(route('logout'));
                            } catch (err) {}
                            sessionStorage.clear();
                            localStorage.clear();
                            window.location.href = '/login';
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[13px] font-medium text-slate-400 hover:bg-red-50 hover:text-red-400 transition-all duration-200"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round"
                                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1" />
                        </svg>
                        Keluar
                    </button>
                </div>
            </aside>

            {/* ═══════════════════════════════════════
                CONTENT AREA
            ═══════════════════════════════════════ */}
            <div className="flex-1 flex flex-col min-w-0">

                {/* ── TOP NAVBAR ── */}
                <header className="sticky top-0 z-10 bg-white/90 backdrop-blur-md border-b border-slate-100 px-5 lg:px-8 py-3.5 flex items-center gap-4">
                    {/* Hamburger (mobile) */}
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="lg:hidden p-2 rounded-xl bg-pink-50 text-pink-400 flex-shrink-0"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>

                    {/* Search bar */}
                    <div className="flex-1 max-w-md relative">
                        <svg className="w-4 h-4 text-slate-300 absolute left-3.5 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input
                            type="text"
                            placeholder="Cari buket, rangkaian bunga..."
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-600 placeholder-slate-300 focus:outline-none focus:border-pink-300 focus:ring-2 focus:ring-pink-100 transition"
                        />
                    </div>

                    <div className="flex items-center gap-2 ml-auto">
                        {/* Cart icon — links to cart page */}
                        <Link
                            href={route('cart.index')}
                            className="relative p-2.5 rounded-xl bg-pink-50 text-pink-400 hover:bg-pink-100 active:bg-pink-200 transition group"
                            title={`Keranjang Belanja (${cartCount} item)`}
                        >
                            <svg className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round"
                                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            {cartCount > 0 && (
                                <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] bg-red-400 text-white text-[10px] font-extrabold rounded-full flex items-center justify-center leading-none px-1 shadow-sm shadow-red-200 animate-bounce" style={{ animationDuration: '2s' }}>
                                    {cartCount}
                                </span>
                            )}
                        </Link>

                        {/* Notification bell */}
                        <button className="p-2.5 rounded-xl bg-blue-50 text-blue-400 hover:bg-blue-100 transition relative">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round"
                                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                            </svg>
                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-400 rounded-full" />
                        </button>

                        {/* Avatar */}
                        <div
                            className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm shadow cursor-pointer border-2 border-white"
                            style={{ background: 'linear-gradient(135deg, #f9a8d4, #93c5fd)' }}
                            title={user?.name}
                        >
                            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                        </div>
                    </div>
                </header>

                {/* ── MAIN SCROLL AREA ── */}
                <main className="flex-1 overflow-y-auto p-5 lg:p-8 space-y-6">

                    {/* ── ACTIVE DELIVERY NOTIFICATION BANNER ── */}
                    {hasActiveDelivery && (
                        <div
                            className="flex items-center gap-3 px-5 py-3.5 rounded-2xl border shadow-sm flex-wrap gap-y-2"
                            style={{ background: 'linear-gradient(90deg, #eff6ff, #f0fdf4)', borderColor: '#bfdbfe' }}
                        >
                            <span className="text-xl flex-shrink-0"></span>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-slate-700 truncate">
                                    Pesanan <span className="text-blue-500">#FLR-20260913</span> sedang diantar Kurir{' '}
                                    <span className="text-green-500 font-bold">Budi (Grab)</span>.
                                </p>
                                <p className="text-xs text-slate-400">Estimasi tiba: ±30 menit lagi</p>
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0">
                                <div className="flex items-center gap-1">
                                    <span className="inline-block w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                                    <span className="text-xs text-green-500 font-medium">Live</span>
                                </div>
                                <a
                                    href="https://wa.me/6281234567890"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-xs font-bold px-3 py-1.5 rounded-xl text-white shadow-sm transition hover:opacity-90"
                                    style={{ background: '#60a5fa' }}
                                >
                                    Lacak Live
                                </a>
                            </div>
                        </div>
                    )}

                    {/* ── WELCOME HERO BANNER ── */}
                    <div
                        className="relative overflow-hidden rounded-3xl p-6 lg:p-8 shadow-md"
                        style={{ background: 'linear-gradient(135deg, #fbcfe8 0%, #fce7f3 55%, #e0e7ff 100%)' }}
                    >
                        {/* Decorative blobs */}
                        <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/20 blur-2xl pointer-events-none" />
                        <div className="absolute bottom-0 right-24 w-28 h-28 rounded-full blur-2xl pointer-events-none"
                            style={{ background: 'rgba(167,139,250,0.2)' }} />
                        <div className="absolute top-3 right-4 text-6xl opacity-10 select-none pointer-events-none rotate-12"></div>

                        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
                            <div>
                                <span className="inline-flex items-center gap-1.5 bg-white/60 text-pink-500 text-xs font-bold px-3 py-1 rounded-full mb-3 tracking-wider">
                                     Selamat Datang, Member!
                                </span>
                                <h1 className="text-xl lg:text-3xl font-extrabold text-slate-700 leading-snug">
                                    Welcome Back,{' '}
                                    <span className="text-pink-400">Sis {firstName}!</span> 
                                </h1>
                                <p className="text-sm text-slate-500 mt-2 max-w-sm">
                                    Bunga segar Palu siap dirangkai untuk momen spesialmu. Yuk pilih favoritmu hari ini!
                                </p>

                                {/* Voucher chip */}
                                <div className="mt-4 inline-flex items-center gap-3 bg-white/70 backdrop-blur-sm rounded-2xl px-4 py-2.5 border border-pink-200/50 shadow-sm">
                                    <div className="w-8 h-8 rounded-xl bg-pink-100 flex items-center justify-center text-base"></div>
                                    <div>
                                        <p className="text-[10px] text-slate-400 font-medium">Voucher Eksklusif Member</p>
                                        <p className="text-sm font-extrabold text-pink-400" style={{ letterSpacing: '.2em' }}>
                                            FLORA10 — Hemat 10%
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => navigator.clipboard?.writeText('FLORA10')}
                                        className="ml-1 text-[10px] bg-pink-100 text-pink-400 font-bold px-2 py-1 rounded-lg hover:bg-pink-200 transition"
                                    >
                                        Salin
                                    </button>
                                </div>
                            </div>

                            {/* Hero image */}
                            <div className="flex-shrink-0 relative">
                                <div className="w-32 h-32 lg:w-44 lg:h-44 rounded-3xl overflow-hidden border-4 border-white/70 shadow-xl">
                                    <img
                                        src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=400&q=80"
                                        alt="Buket Pilihan"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="absolute -bottom-2 -right-2 bg-white rounded-2xl px-3 py-1.5 shadow-md border border-pink-100 flex items-center gap-1.5">
                                    <span className="text-yellow-400"></span>
                                    <span className="text-xs font-bold text-slate-700">4.9 · Terpercaya</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ── PRODUCT GRID ── */}
                    <div>
                        {/* Section header */}
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h2 className="text-base lg:text-lg font-extrabold text-slate-700">
                                     Rekomendasi Untukmu
                                </h2>
                                <p className="text-xs text-slate-400 mt-0.5">
                                    Pilihan bunga terbaik hari ini di Palu
                                </p>
                            </div>
                            <a href="#" className="text-xs font-bold text-pink-400 hover:underline flex items-center gap-1">
                                Lihat Semua
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                </svg>
                            </a>
                        </div>

                        {/* Filter chips */}
                        <div className="flex gap-2 mb-5 overflow-x-auto pb-1 scrollbar-hide">
                            {['Semua', 'Bunga Segar', 'Bunga Kering', 'Bloom Box', 'Artifisial', 'Kustom'].map((f, i) => (
                                <button
                                    key={f}
                                    className={[
                                        'flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-semibold transition-all',
                                        i === 0
                                            ? 'bg-pink-400 text-white shadow-sm shadow-pink-200'
                                            : 'bg-white text-slate-500 border border-slate-200 hover:border-pink-300 hover:text-pink-400',
                                    ].join(' ')}
                                >
                                    {f}
                                </button>
                            ))}
                        </div>

                        {/* Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {displayProducts.map((product) => (
                                <div
                                    key={product.id}
                                    className="group bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-md transition-all duration-300"
                                    style={{ transform: 'translateY(0)', transition: 'transform 0.3s ease, box-shadow 0.3s ease' }}
                                    onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; }}
                                    onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; }}
                                >
                                    {/* Image */}
                                    <div className="relative overflow-hidden h-44">
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                            onError={(e) => { e.target.src = 'https://via.placeholder.com/400x300?text=+Florabelle'; }}
                                        />
                                        {/* Badge */}
                                        <span
                                            className="absolute top-3 left-3 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow"
                                            style={{ background: product.badgeColor }}
                                        >
                                            {product.badge}
                                        </span>
                                        {/* Wishlist */}
                                        <button className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/80 backdrop-blur flex items-center justify-center text-pink-400 hover:bg-pink-50 transition shadow-sm">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round"
                                                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                            </svg>
                                        </button>
                                        {/* Type tag */}
                                        <span className="absolute bottom-3 left-3 bg-black/30 backdrop-blur-sm text-white text-[10px] font-medium px-2 py-0.5 rounded-full">
                                            {product.type}
                                        </span>
                                    </div>

                                    {/* Info */}
                                    <div className="p-4">
                                        <h3 className="text-[13px] font-bold text-slate-700 truncate">{product.name}</h3>

                                        {/* Rating */}
                                        <div className="flex items-center gap-1.5 mt-1.5">
                                            <StarRating rating={product.rating} />
                                            <span className="text-[11px] font-bold text-yellow-500">{product.rating}</span>
                                            <span className="text-[11px] text-slate-400">({product.reviews})</span>
                                        </div>

                                        {/* Price row */}
                                        <div className="flex items-center justify-between mt-3">
                                            <div>
                                                <p className="text-xs text-slate-400">Harga</p>
                                                <p className="text-base font-extrabold text-pink-400">
                                                    {formatRupiah(product.price)}
                                                </p>
                                            </div>
                                            <button
                                                onClick={() => handleAddToCart(product.id)}
                                                className={[
                                                    'flex items-center gap-1.5 text-xs font-bold px-3.5 py-2 rounded-xl transition-all duration-200 shadow-sm',
                                                    addedItems[product.id]
                                                        ? 'bg-green-100 text-green-500 border border-green-200'
                                                        : 'text-white hover:opacity-90 hover:shadow-md',
                                                ].join(' ')}
                                                style={addedItems[product.id] ? {} : { background: '#f472b6' }}
                                            >
                                                {addedItems[product.id] ? (
                                                    <>
                                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                        </svg>
                                                        Ditambahkan!
                                                    </>
                                                ) : (
                                                    <>
                                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round"
                                                                d="M12 4v16m8-8H4" />
                                                        </svg>
                                                        Tambah
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* ── FOOTER MINI ── */}
                    <p className="text-center text-xs text-slate-300 pb-4 pt-2">
                        © 2026 Florabelle.id Palu · Jl. Dayodara – Jl. Meteorologi Blok B2
                        ·  Dibuat dengan cinta di Palu
                    </p>
                </main>
            </div>

            {/* Floating Toast Notification */}
            {toastMsg && (
                <div className="fixed bottom-6 right-6 z-50 bg-slate-900/90 backdrop-blur text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 animate-bounce">
                    <span className="text-sm font-semibold">{toastMsg}</span>
                    <Link href={route('cart.index')} className="text-xs bg-pink-500 text-white font-bold px-3 py-1.5 rounded-xl hover:bg-pink-600 transition">
                        Buka Keranjang 
                    </Link>
                </div>
            )}
        </div>
    );
}
