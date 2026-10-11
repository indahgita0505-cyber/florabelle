import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
import axios from 'axios';

const navItems = [
    {
        id: 'home',
        label: 'Beranda',
        href: '/dashboard',
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

export default function UserDashboardLayout({ children, activeNav = 'home' }) {
    const { auth, cartCount = 0 } = usePage().props;
    const user = auth?.user;
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="flex min-h-screen bg-[#f8f9fc]" style={{ fontFamily: "'Inter', 'Segoe UI', sans-serif" }}>
            {/* Mobile Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/40 z-20 lg:hidden backdrop-blur-sm"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* SIDEBAR */}
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
                            🌸
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
                    {navItems.map((item) => {
                        const isActive = activeNav === item.id;
                        return (
                            <Link
                                key={item.id}
                                href={item.href}
                                className={[
                                    'flex items-center gap-3 px-4 py-3 rounded-xl text-[13px] font-medium transition-all duration-200 relative',
                                    isActive
                                        ? 'bg-white text-pink-400 shadow-sm border border-pink-100/80'
                                        : 'text-slate-500 hover:bg-white/70 hover:text-pink-400',
                                ].join(' ')}
                            >
                                <span className={isActive ? 'text-pink-400' : 'text-slate-400'}>
                                    {item.icon}
                                </span>
                                <span className="flex-1">{item.label}</span>
                                {item.id === 'orders' && (
                                    <span className="bg-red-400 text-white text-[10px] font-bold px-1.5 rounded-full flex items-center justify-center"></span>
                                )}
                                {isActive && (
                                    <span className="w-1 h-6 rounded-full bg-pink-400" />
                                )}
                            </Link>
                        );
                    })}
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

            {/* CONTENT AREA */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* TOP NAVBAR */}
                <header className="sticky top-0 z-10 bg-white/90 backdrop-blur-md border-b border-slate-100 px-5 lg:px-8 py-3.5 flex items-center gap-4">
                    {/* Hamburger */}
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="lg:hidden p-2 rounded-xl bg-pink-50 text-pink-400 flex-shrink-0"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>

                    {/* Search bar */}
                    <div className="flex-1 max-w-md relative hidden sm:block">
                        <svg className="w-4 h-4 text-slate-300 absolute left-3.5 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input
                            type="text"
                            placeholder="Cari pesanan atau produk..."
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-600 placeholder-slate-300 focus:outline-none focus:border-pink-300 focus:ring-2 focus:ring-pink-100 transition"
                        />
                    </div>

                    <div className="flex items-center gap-2 ml-auto">
                        <Link
                            href={route('cart.index')}
                            className="relative p-2.5 rounded-xl bg-pink-50 text-pink-400 hover:bg-pink-100 transition group"
                        >
                            <svg className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round"
                                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            {cartCount > 0 && (
                                <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] bg-red-400 text-white text-[10px] font-extrabold rounded-full flex items-center justify-center leading-none px-1 shadow-sm shadow-red-200 animate-bounce">
                                    {cartCount}
                                </span>
                            )}
                        </Link>
                        <div
                            className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm shadow cursor-pointer border-2 border-white ml-2"
                            style={{ background: 'linear-gradient(135deg, #f9a8d4, #93c5fd)' }}
                        >
                            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                        </div>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-5 lg:p-8">
                    {children}
                    
                    <p className="text-center text-xs text-slate-300 pb-4 pt-10">
                        © 2026 Florabelle.id Palu · Dibuat dengan cinta
                    </p>
                </main>
            </div>
        </div>
    );
}
