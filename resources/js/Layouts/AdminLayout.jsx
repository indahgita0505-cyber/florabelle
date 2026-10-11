import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
import axios from 'axios';
import { LayoutDashboard, ShoppingBag, Package, Palette, CreditCard, Users, Microscope, Settings } from 'lucide-react';

export default function AdminLayout({ children }) {
    const { auth } = usePage().props;
    const user = auth?.user;
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const navItems = [
        { name: 'Dashboard', href: route('admin.dashboard'), icon: <LayoutDashboard size={20} /> },
        { name: 'Daftar Pesanan', href: route('admin.orders.index'), icon: <ShoppingBag size={20} /> },
        { name: 'Produk Etalase', href: route('admin.products.index'), icon: <Package size={20} /> },
        { name: 'Opsi Custom Buket', href: route('admin.bouquet-options.index'), icon: <Palette size={20} /> },
        { name: 'Verifikasi Pembayaran', href: route('admin.payments.index'), icon: <CreditCard size={20} /> },
        { name: 'Data Pelanggan', href: route('admin.customers.index'), icon: <Users size={20} /> },
        { name: 'Data Mining', href: route('admin.data-mining.index'), icon: <Microscope size={20} /> },
        { name: 'Pengaturan Toko', href: route('admin.settings.index'), icon: <Settings size={20} /> },
    ];

    return (
        <div className="h-screen overflow-hidden bg-slate-50 flex font-sans text-slate-800">
            {/* Mobile Overlay */}
            {sidebarOpen && (
                <div 
                    className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden backdrop-blur-sm"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
                fixed top-0 left-0 h-full w-72 bg-white border-r border-slate-200 z-50
                flex flex-col transition-transform duration-300 ease-in-out
                ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                lg:static
            `}>
                {/* Logo Area */}
                <div className="h-20 flex items-center px-8 border-b border-slate-100 shrink-0">
                    <Link href="/admin/dashboard" className="flex items-center gap-3">
                        <span className="text-3xl">🌸</span>
                        <div>
                            <span className="font-serif font-bold text-xl tracking-tight text-slate-900">
                                Florabelle<span className="text-pink-500">.id</span>
                            </span>
                            <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                                Admin Panel
                            </span>
                        </div>
                    </Link>
                </div>

                {/* Profile Card */}
                <div className="p-6 shrink-0 border-b border-slate-100">
                    <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                        <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-rose-400 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-sm">
                            {user?.name?.charAt(0)?.toUpperCase() || 'A'}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-slate-800 truncate">
                                {user?.name || 'Administrator'}
                            </p>
                            <p className="text-xs text-slate-500 truncate">
                                {user?.email}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Navigation Menu */}
                <nav className="flex-1 overflow-y-auto py-4 px-4 space-y-1 scrollbar-hide">
                    {navItems.map((item, index) => {
                        // Very simple active state matching for dashboard
                        const isActive = window.location.pathname === new URL(item.href, window.location.origin).pathname && item.href !== '#';
                        return (
                            <Link
                                key={index}
                                href={item.href}
                                className={`
                                    flex items-center gap-4 px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-200
                                    ${isActive 
                                        ? 'bg-pink-50 text-pink-600 shadow-sm border border-pink-100/50' 
                                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                                    }
                                `}
                            >
                                <span className={`flex items-center justify-center ${isActive ? 'opacity-100 text-pink-600' : 'opacity-80 text-slate-500 group-hover:text-slate-700'}`}>{item.icon}</span>
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>

                {/* Logout Footer */}
                <div className="p-4 border-t border-slate-200 bg-slate-50 shrink-0">
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
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-bold text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors border border-transparent hover:border-red-100"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1" />
                        </svg>
                        Keluar dari Panel
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Header (Mobile Trigger & Breadcrumbs) */}
                <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-6 lg:px-10 shrink-0 sticky top-0 z-30">
                    <div className="flex items-center gap-4">
                        <button 
                            className="lg:hidden p-2 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
                            onClick={() => setSidebarOpen(true)}
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                        <h1 className="text-xl font-bold text-slate-800">Panel Kelola Toko</h1>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="p-2.5 rounded-full bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition relative border border-slate-200">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                            </svg>
                            <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 border-2 border-white rounded-full"></span>
                        </button>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 p-6 lg:p-10 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}
