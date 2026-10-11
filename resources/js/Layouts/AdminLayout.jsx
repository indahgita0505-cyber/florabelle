import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
import axios from 'axios';
import { 
    LayoutDashboard, 
    ShoppingBag, 
    Package, 
    Palette, 
    Users, 
    Microscope, 
    LogOut, 
    Bell, 
    Menu, 
    X,
    ChevronDown,
    Clock,
    ArrowRight,
    Settings
} from 'lucide-react';

export default function AdminLayout({ 
    children, 
    title = "Panel Kelola Toko", 
    subtitle = "Florabelle.id - Artificial Flower Bouquet Shop",
    quote = "Bunga Abadi Untuk Setiap Momen Spesial 💕" 
}) {
    const { auth, adminNotifications } = usePage().props;
    const user = auth?.user;
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
    const [notificationsOpen, setNotificationsOpen] = useState(false);

    const unreadCount = adminNotifications?.unreadCount || 0;
    const recentOrders = adminNotifications?.recentOrders || [];

    const navItems = [
        { name: 'Dashboard', href: route('admin.dashboard'), icon: <LayoutDashboard size={19} /> },
        { name: 'Daftar Pesanan', href: route('admin.orders.index'), icon: <ShoppingBag size={19} /> },
        { name: 'Produk Etalase', href: route('admin.products.index'), icon: <Package size={19} /> },
        { name: 'Opsi Custom Bucket', href: route('admin.bouquet-options.index'), icon: <Palette size={19} /> },
        { name: 'Data Pelanggan', href: route('admin.customers.index'), icon: <Users size={19} /> },
        { name: 'Data Mining', href: route('admin.data-mining.index'), icon: <Microscope size={19} /> },
        { name: 'Pengaturan', href: route('admin.settings.index'), icon: <Settings size={19} /> },
    ];

    const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';

    return (
        <div className="h-screen overflow-hidden bg-[#faf6f7] flex font-sans text-slate-800">
            {/* Mobile Overlay */}
            {sidebarOpen && (
                <div 
                    className="fixed inset-0 bg-slate-900/40 z-40 lg:hidden backdrop-blur-sm"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
                fixed top-0 left-0 h-full w-64 bg-white border-r border-pink-100/70 z-50
                flex flex-col transition-transform duration-300 ease-in-out shadow-sm
                ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                lg:static
            `}>
                {/* Logo Area */}
                <div className="h-20 flex items-center justify-between px-6 border-b border-pink-50 shrink-0">
                    <Link href="/admin/dashboard" className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-full bg-pink-100 flex items-center justify-center text-pink-500 text-lg shadow-sm">
                            🌸
                        </div>
                        <div>
                            <span className="font-serif font-bold text-lg tracking-tight text-slate-900 block leading-tight">
                                Florabelle<span className="text-pink-500">.id</span>
                            </span>
                            <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                                Admin Panel
                            </span>
                        </div>
                    </Link>

                    <button 
                        className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:bg-slate-100"
                        onClick={() => setSidebarOpen(false)}
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Profile Card */}
                <div className="p-4 shrink-0 border-b border-pink-50/60">
                    <div className="flex items-center gap-3 bg-[#fdf2f4]/60 p-3 rounded-2xl border border-pink-100/60">
                        <div className="w-10 h-10 bg-gradient-to-tr from-pink-400 to-rose-400 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-sm ring-2 ring-white shrink-0">
                            {user?.name?.charAt(0)?.toUpperCase() || 'A'}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-slate-800 truncate">
                                {user?.name || 'Admin Florabelle'}
                            </p>
                            <p className="text-[11px] text-slate-500 truncate">
                                {user?.email || 'admin@florabelle.com'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Navigation Menu */}
                <nav className="flex-1 overflow-y-auto py-3 px-3 space-y-1 scrollbar-hide">
                    {navItems.map((item, index) => {
                        const targetPath = new URL(item.href, 'http://localhost').pathname;
                        const isActive = currentPath === targetPath || (targetPath !== '/admin/dashboard' && currentPath.startsWith(targetPath));

                        return (
                            <Link
                                key={index}
                                href={item.href}
                                className={`
                                    flex items-center gap-3.5 px-3.5 py-3 rounded-2xl text-xs font-medium transition-all duration-200
                                    ${isActive 
                                        ? 'bg-[#fde2e8] text-pink-600 font-semibold shadow-xs' 
                                        : 'text-slate-600 hover:bg-pink-50/50 hover:text-slate-900'
                                    }
                                `}
                            >
                                <span className={`flex items-center justify-center ${isActive ? 'text-pink-600' : 'text-slate-400 group-hover:text-slate-600'}`}>
                                    {item.icon}
                                </span>
                                <span>{item.name}</span>
                            </Link>
                        );
                    })}
                </nav>

                {/* Logout Footer */}
                <div className="p-4 border-t border-pink-50 shrink-0">
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
                        className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-semibold text-rose-500 hover:bg-rose-50 hover:text-rose-700 transition-colors"
                    >
                        <LogOut size={18} />
                        <span>Keluar dari Panel</span>
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
                {/* Header matching reference mockup */}
                <header className="bg-white border-b border-pink-100/70 px-6 lg:px-10 py-3.5 shrink-0 sticky top-0 z-30">
                    <div className="flex items-center justify-between gap-4">
                        {/* Left: Mobile trigger & Titles */}
                        <div className="flex items-center gap-3.5 min-w-0">
                            <button 
                                className="lg:hidden p-2 rounded-xl bg-pink-50 text-slate-600 hover:bg-pink-100 transition-colors"
                                onClick={() => setSidebarOpen(true)}
                            >
                                <Menu size={20} />
                            </button>
                            <div>
                                <h1 className="text-xl lg:text-2xl font-bold font-serif text-slate-900 leading-snug">
                                    {title}
                                </h1>
                                <p className="text-xs text-slate-400 mt-0.5 truncate hidden sm:block">
                                    {subtitle}
                                </p>
                            </div>
                        </div>

                        {/* Right: Floral banner quote & Admin actions */}
                        <div className="flex items-center gap-4 lg:gap-6 shrink-0">
                            {/* Decorative Floral Quote Banner */}
                            <div className="hidden md:flex items-center gap-3 bg-gradient-to-r from-pink-50/40 via-rose-50/60 to-pink-50/20 px-4 py-1.5 rounded-full border border-pink-100/50">
                                <div className="w-8 h-8 rounded-full overflow-hidden ring-1 ring-pink-200 shrink-0">
                                    <img 
                                        src="/images/hero_bouquet.jpg" 
                                        alt="Floral Bouquet" 
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            e.target.style.display = 'none';
                                        }}
                                    />
                                </div>
                                <span className="text-xs italic font-serif text-pink-700 font-medium">
                                    "{quote}"
                                </span>
                            </div>

                            {/* Notification Bell & Dropdown */}
                            <div className="relative">
                                <button 
                                    onClick={() => {
                                        setNotificationsOpen(!notificationsOpen);
                                        setProfileDropdownOpen(false);
                                    }}
                                    className="w-9 h-9 rounded-full bg-slate-50 text-slate-500 hover:bg-pink-50 hover:text-pink-600 transition flex items-center justify-center relative border border-slate-200/80 cursor-pointer shadow-sm active:scale-95"
                                    title="Pusat Notifikasi Toko"
                                >
                                    <Bell size={17} />
                                    {unreadCount > 0 && (
                                        <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-rose-500 border-2 border-white rounded-full animate-pulse" />
                                    )}
                                </button>

                                {notificationsOpen && (
                                    <>
                                        <div 
                                            className="fixed inset-0 z-40" 
                                            onClick={() => setNotificationsOpen(false)} 
                                        />
                                        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-pink-100 py-2 z-50 overflow-hidden text-xs">
                                            {/* Header */}
                                            <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-pink-50/50 to-white">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-6 h-6 rounded-full bg-pink-100 flex items-center justify-center text-pink-600 font-bold text-xs">
                                                        🔔
                                                    </div>
                                                    <span className="font-bold text-slate-800 text-sm">Notifikasi Toko</span>
                                                </div>
                                                {unreadCount > 0 ? (
                                                    <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 font-semibold text-[10px]">
                                                        {unreadCount} perlu diproses
                                                    </span>
                                                ) : (
                                                    <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 font-semibold text-[10px]">
                                                        Semua terpantau
                                                    </span>
                                                )}
                                            </div>

                                            {/* List of Recent Notifications */}
                                            <div className="max-h-80 overflow-y-auto divide-y divide-slate-50">
                                                {recentOrders && recentOrders.length > 0 ? (
                                                    recentOrders.map((order) => (
                                                        <Link
                                                            key={order.id}
                                                            href={route('admin.orders.index', { search: order.id })}
                                                            onClick={() => setNotificationsOpen(false)}
                                                            className="p-3.5 hover:bg-pink-50/40 transition block group"
                                                        >
                                                            <div className="flex items-start justify-between gap-2">
                                                                <div className="flex items-start gap-2.5">
                                                                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                                                                        order.is_waiting_verification 
                                                                            ? 'bg-amber-100 text-amber-700'
                                                                            : order.status === 'pending'
                                                                            ? 'bg-rose-100 text-rose-600'
                                                                            : 'bg-pink-100 text-pink-600'
                                                                    }`}>
                                                                        <ShoppingBag size={15} />
                                                                    </div>
                                                                    <div>
                                                                        <p className="font-bold text-slate-800 group-hover:text-pink-600 transition-colors">
                                                                            {order.is_waiting_verification 
                                                                                ? 'Verifikasi Bukti Bayar' 
                                                                                : order.status === 'pending' 
                                                                                ? 'Pesanan Baru Masuk' 
                                                                                : 'Pesanan Diproses'}
                                                                        </p>
                                                                        <p className="text-[11px] text-slate-500 mt-0.5">
                                                                            <span className="font-semibold text-slate-700">{order.customer_name}</span> • Rp {Number(order.total).toLocaleString('id-ID')}
                                                                        </p>
                                                                        <p className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
                                                                            <Clock size={11} />
                                                                            <span>{order.created_at_human}</span>
                                                                            <span className="text-slate-300">•</span>
                                                                            <span className="font-mono text-slate-500">#ORD-{String(order.id).padStart(4, '0')}</span>
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                                <span className="text-[10px] text-pink-500 font-semibold group-hover:translate-x-0.5 transition-transform shrink-0">
                                                                    Buka →
                                                                </span>
                                                            </div>
                                                        </Link>
                                                    ))
                                                ) : (
                                                    <div className="py-8 text-center text-slate-400 text-xs">
                                                        Belum ada pesanan terbaru
                                                    </div>
                                                )}
                                            </div>

                                            {/* Footer Button to Orders */}
                                            <div className="p-2.5 border-t border-slate-100 bg-slate-50/50">
                                                <Link
                                                    href={route('admin.orders.index')}
                                                    onClick={() => setNotificationsOpen(false)}
                                                    className="w-full py-2 px-3 rounded-xl bg-pink-500 hover:bg-pink-600 text-white text-center font-bold text-xs flex items-center justify-center gap-1.5 transition shadow-sm"
                                                >
                                                    <span>Buka Halaman Daftar Pesanan</span>
                                                    <ArrowRight size={14} />
                                                </Link>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>

                            {/* Admin Profile Dropdown Pill */}
                            <div className="relative">
                                <button 
                                    onClick={() => {
                                        setProfileDropdownOpen(!profileDropdownOpen);
                                        setNotificationsOpen(false);
                                    }}
                                    className="flex items-center gap-2.5 pl-1.5 pr-2.5 py-1 rounded-full hover:bg-slate-50 transition border border-transparent hover:border-slate-200"
                                >
                                    <div className="w-8 h-8 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center font-bold text-xs ring-2 ring-pink-50">
                                        {user?.name?.charAt(0)?.toUpperCase() || 'A'}
                                    </div>
                                    <span className="text-xs font-semibold text-slate-700 hidden sm:inline-block">
                                        {user?.name || 'Admin Florabelle'}
                                    </span>
                                    <ChevronDown size={14} className="text-slate-400" />
                                </button>

                                {profileDropdownOpen && (
                                    <>
                                        <div 
                                            className="fixed inset-0 z-40" 
                                            onClick={() => setProfileDropdownOpen(false)} 
                                        />
                                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-pink-100 py-1.5 z-50 text-xs">
                                            <div className="px-3.5 py-2 border-b border-slate-100">
                                                <p className="font-bold text-slate-800">{user?.name || 'Admin'}</p>
                                                <p className="text-[11px] text-slate-400 truncate">{user?.email}</p>
                                            </div>
                                            <Link 
                                                href={route('admin.settings.index')} 
                                                className="block px-3.5 py-2 text-slate-600 hover:bg-pink-50 hover:text-pink-600"
                                                onClick={() => setProfileDropdownOpen(false)}
                                            >
                                                Pengaturan
                                            </Link>
                                            <button
                                                onClick={async () => {
                                                    try { await axios.post(route('logout')); } catch(e) {}
                                                    window.location.href = '/login';
                                                }}
                                                className="w-full text-left px-3.5 py-2 text-rose-600 hover:bg-rose-50 font-medium"
                                            >
                                                Keluar
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content with smooth scroll */}
                <main className="flex-1 p-5 lg:p-8 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}
