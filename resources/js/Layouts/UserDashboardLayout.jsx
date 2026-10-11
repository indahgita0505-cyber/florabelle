import { Link, usePage, router } from '@inertiajs/react';
import { useState } from 'react';
import axios from 'axios';

const navItems = [
    {
        id: 'home',
        label: 'Beranda',
        href: '/dashboard',
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round"
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
        ),
    },
    {
        id: 'custom',
        label: 'Kostum Bucket',
        href: '/custom-bouquet',
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 2c-1.8 0-3.5 1.5-3.5 3.3 0 1.2.6 2.3 1.6 2.9L8.8 19.5a1.2 1.2 0 001.2 1.5h4a1.2 1.2 0 001.2-1.5L13.9 8.2c1-.6 1.6-1.7 1.6-2.9C15.5 3.5 13.8 2 12 2z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.5 6.5C6.8 6.8 5.5 8.2 5.5 10c0 1.8 1.4 3.4 3.2 3.6M15.5 6.5c1.7.3 3 1.7 3 3.5 0 1.8-1.4 3.4-3.2 3.6" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.5 12h5" />
            </svg>
        ),
    },
    {
        id: 'orders',
        label: 'Riwayat Pesanan',
        href: '/orders',
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round"
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
        ),
    },
    {
        id: 'profile',
        label: 'Profil',
        href: '/profile',
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
        ),
    },
];

export default function UserDashboardLayout({ children, activeNav = 'home', searchValue = '', onSearchChange = null }) {
    const { auth, cartCount = 0 } = usePage().props;
    const user = auth?.user;
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);

    // Normalize activeNav
    const normalizedActiveNav = activeNav === 'address' ? 'profile' : activeNav;

    return (
        <div className="flex min-h-screen bg-[#faf8f9]" style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}>
            {/* Mobile Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/40 z-30 lg:hidden backdrop-blur-sm"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* ── SIDEBAR ── */}
            <aside
                className={[
                    'fixed top-0 left-0 h-full z-40 w-64 flex flex-col justify-between bg-white',
                    'border-r border-rose-100/70 shadow-sm',
                    'transition-transform duration-300 ease-in-out',
                    sidebarOpen ? 'translate-x-0' : '-translate-x-full',
                    'lg:translate-x-0 lg:sticky lg:top-0 lg:h-screen lg:shadow-none',
                ].join(' ')}
            >
                <div>
                    {/* Brand Logo */}
                    <div className="px-6 pt-7 pb-6">
                        <Link href="/" className="flex items-center gap-3 group">
                            <div className="w-10 h-10 rounded-2xl bg-rose-50 flex items-center justify-center text-[#d84062] shadow-xs group-hover:scale-105 transition-transform duration-200">
                                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 0 0 9-9c0-4.97-4.03-9-9-9s-9 4.03-9 9a9 9 0 0 0 9 9z" opacity="0.15" fill="currentColor"/>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c2.5 3 4 6.5 4 9s-1.5 6-4 9c-2.5-3-4-6.5-4-9s1.5-6 4-9z"/>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 12c3-2.5 6.5-4 9-4s6 1.5 9 4c-3 2.5-6.5 4-9 4s-6-1.5-9-4z"/>
                                </svg>
                            </div>
                            <div>
                                <h1 className="font-serif font-bold text-[#9f1239] text-xl tracking-tight leading-tight">
                                    BungaKita
                                </h1>
                                <p className="text-[10px] text-rose-400 font-medium italic tracking-wide">
                                    Florist Creation & Gift Shop
                                </p>
                            </div>
                        </Link>
                    </div>

                    {/* Navigation Links */}
                    <nav className="px-4 py-2 space-y-1.5">
                        {navItems.map((item) => {
                            const isActive = normalizedActiveNav === item.id;
                            return (
                                <Link
                                    key={item.id}
                                    href={item.href}
                                    className={[
                                        'flex items-center gap-3 px-4 py-3 rounded-2xl text-[13px] font-semibold transition-all duration-200',
                                        isActive
                                            ? 'bg-[#fce7f3] text-[#d84062] shadow-xs'
                                            : 'text-slate-600 hover:text-[#d84062] hover:bg-[#fff0f3]',
                                    ].join(' ')}
                                >
                                    <span className={isActive ? 'text-[#d84062]' : 'text-slate-400'}>
                                        {item.icon}
                                    </span>
                                    <span className="flex-1">{item.label}</span>
                                    {item.id === 'orders' && (
                                        <span className="w-2 h-2 rounded-full bg-rose-400 opacity-0"></span>
                                    )}
                                </Link>
                            );
                        })}

                        {/* Keluar (Logout) */}
                        <button
                            type="button"
                            onClick={() => router.post(route('logout'))}
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-[13px] font-semibold text-rose-500/80 hover:text-red-600 hover:bg-red-50/60 transition-all duration-200 cursor-pointer text-left"
                        >
                            <span className="text-rose-400">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1" />
                                </svg>
                            </span>
                            <span className="flex-1">Keluar</span>
                        </button>
                    </nav>
                </div>

                {/* Sidebar Footer Illustration & Quote */}
                <div className="p-6 relative select-none pointer-events-none">
                    <div className="flex items-center gap-3">
                        {/* Botanical branch doodle */}
                        <svg className="w-12 h-16 text-rose-300/80 flex-shrink-0" viewBox="0 0 50 80" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <path d="M25 75 C 24 50, 26 25, 25 5" strokeLinecap="round" />
                            <path d="M25 55 Q 38 48, 42 38 Q 33 42, 25 50" fill="currentColor" fillOpacity="0.12" />
                            <path d="M25 40 Q 12 33, 8 23 Q 17 27, 25 35" fill="currentColor" fillOpacity="0.12" />
                            <path d="M25 25 Q 36 18, 38 10 Q 30 14, 25 20" fill="currentColor" fillOpacity="0.12" />
                            <circle cx="25" cy="5" r="3.5" fill="#f43f5e" fillOpacity="0.4" />
                            <circle cx="20" cy="4" r="2.5" fill="#fb7185" fillOpacity="0.5" />
                        </svg>

                        <div className="flex-1">
                            <p className="text-[12px] text-rose-400/90 italic font-serif leading-snug">
                                "Terima kasih telah memilih BungaKita 💕"
                            </p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* ── MAIN CONTENT WRAPPER ── */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* ── TOP NAVBAR ── */}
                <header className="sticky top-0 z-20 bg-white/90 backdrop-blur-md border-b border-rose-100/60 px-5 lg:px-8 py-3.5 flex items-center justify-between gap-4">
                    {/* Mobile Hamburger Button */}
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="lg:hidden p-2 rounded-xl bg-rose-50 text-[#d84062] hover:bg-rose-100 transition"
                        aria-label="Open sidebar"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>

                    {/* Search Input Pill */}
                    <div className="flex-1 max-w-md relative">
                        <svg className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input
                            type="text"
                            value={searchValue}
                            onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
                            placeholder="Cari bucket, bunga, atau kategori..."
                            className="w-full pl-10 pr-4 py-2 rounded-full bg-[#fbfbfb] border border-rose-100/90 text-xs lg:text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:border-rose-300 focus:bg-white focus:ring-2 focus:ring-rose-100 transition shadow-2xs"
                        />
                    </div>

                    {/* Right User & Cart Nav */}
                    <div className="flex items-center gap-3">
                        {/* Cart Button */}
                        <Link
                            href={route('cart.index')}
                            className="relative p-2.5 rounded-full bg-rose-50 text-[#d84062] hover:bg-rose-100 transition flex items-center justify-center"
                            title="Keranjang Belanja"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round"
                                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-[#d84062] text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 shadow-sm">
                                {cartCount ?? 0}
                            </span>
                        </Link>

                        {/* User Avatar & Name Pill */}
                        <div className="relative">
                            <button
                                onClick={() => setUserMenuOpen(!userMenuOpen)}
                                className="flex items-center gap-2 p-1 sm:px-2.5 sm:py-1 rounded-full hover:bg-rose-50 transition border border-transparent hover:border-rose-100 cursor-pointer"
                            >
                                <div className="w-8 h-8 rounded-full bg-[#f8d2dc] text-[#d84062] flex items-center justify-center font-bold text-xs shadow-xs border-2 border-white overflow-hidden flex-shrink-0">
                                    {user?.avatar ? (
                                        <img src={user.avatar} alt={user?.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <span>{(user?.name || 'U').charAt(0).toUpperCase()}</span>
                                    )}
                                </div>
                                <span className="text-xs sm:text-sm font-semibold text-slate-700 hidden sm:block max-w-[120px] truncate">
                                    {user?.name || 'Pelanggan'}
                                </span>
                                <svg className="w-3.5 h-3.5 text-slate-400 hidden sm:block" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>

                            {userMenuOpen && (
                                <>
                                    <div className="fixed inset-0 z-30" onClick={() => setUserMenuOpen(false)}></div>
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-rose-100/80 py-2 z-40 text-xs animate-in fade-in zoom-in-95">
                                        <div className="px-4 py-2 border-b border-rose-50 mb-1">
                                            <p className="font-bold text-slate-800 truncate">{user?.name || 'Pelanggan'}</p>
                                            <p className="text-slate-400 truncate text-[11px]">{user?.email || 'Customer Florabelle'}</p>
                                        </div>
                                        <Link
                                            href="/profile"
                                            onClick={() => setUserMenuOpen(false)}
                                            className="flex items-center gap-2 px-4 py-2 hover:bg-rose-50 text-slate-700 hover:text-[#d84062] transition"
                                        >
                                            <span>👤</span> Profil Saya
                                        </Link>
                                        <Link
                                            href="/orders"
                                            onClick={() => setUserMenuOpen(false)}
                                            className="flex items-center gap-2 px-4 py-2 hover:bg-rose-50 text-slate-700 hover:text-[#d84062] transition"
                                        >
                                            <span>📦</span> Riwayat Pesanan
                                        </Link>
                                        <div className="border-t border-rose-50 my-1"></div>
                                        {user ? (
                                            <button
                                                type="button"
                                                onClick={() => router.post(route('logout'))}
                                                className="w-full flex items-center gap-2 px-4 py-2 hover:bg-red-50 text-rose-600 transition text-left cursor-pointer"
                                            >
                                                <span>🚪</span> Keluar
                                            </button>
                                        ) : (
                                            <Link
                                                href={route('login')}
                                                className="flex items-center gap-2 px-4 py-2 hover:bg-rose-50 text-[#d84062] font-semibold transition"
                                            >
                                                <span>🔑</span> Masuk
                                            </Link>
                                        )}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </header>

                {/* ── MAIN SCROLL BODY ── */}
                <main className="flex-1 p-4 sm:p-5 lg:p-8 max-w-7xl w-full mx-auto pb-24 lg:pb-8">
                    {children}
                </main>

                {/* ── MOBILE BOTTOM NAVIGATION BAR (Mockup Screen 9) ── */}
                <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-rose-100/80 px-4 py-2 flex items-center justify-around shadow-lg">
                    {navItems.map((item) => {
                        const isActive = normalizedActiveNav === item.id;
                        return (
                            <Link
                                key={item.id}
                                href={item.href}
                                className={[
                                    'flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all duration-200',
                                    isActive ? 'text-[#d84062]' : 'text-slate-400 hover:text-slate-600',
                                ].join(' ')}
                            >
                                <span className={`transition-transform duration-200 ${isActive ? 'scale-110 text-[#d84062]' : 'text-slate-400'}`}>
                                    {item.icon}
                                </span>
                                <span className={`text-[10px] mt-1 font-medium ${isActive ? 'font-bold text-[#d84062]' : 'text-slate-500'}`}>
                                    {item.label}
                                </span>
                            </Link>
                        );
                    })}
                </nav>
            </div>
        </div>
    );
}
