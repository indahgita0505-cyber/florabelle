import { Link, usePage } from '@inertiajs/react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import axios from 'axios';

export default function MainLayout({ children }) {
    const { auth, cartCount = 0 } = usePage().props;

    return (
        <div className="min-h-screen bg-pink-50">
            {/* Navigation */}
            <nav className="bg-white/80 backdrop-blur-md border-b border-pink-100 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <Link href="/" className="flex items-center gap-2">
                                <span className="text-2xl">🌸</span>
                                <span className="font-bold text-xl text-pink-600 tracking-tight">Florabelle</span>
                            </Link>
                        </div>
                        
                        <div className="flex items-center space-x-6">
                            <Link href="/" className="text-gray-600 hover:text-pink-500 font-medium transition">Beranda</Link>
                            <Link href={route('products.index')} className="text-gray-600 hover:text-pink-500 font-medium transition">Katalog</Link>
                            
                            {auth.user ? (
                                <>
                                    {auth.user.role !== 'admin' && (
                                        <Link href={route('cart.index')} className="text-gray-600 hover:text-pink-500 font-medium transition flex items-center gap-1.5 relative">
                                            <span>🛒 Keranjang</span>
                                            {cartCount > 0 && (
                                                <span className="bg-pink-500 text-white text-[11px] font-bold px-1.5 py-0.5 rounded-full leading-none shadow-sm animate-pulse">
                                                    {cartCount}
                                                </span>
                                            )}
                                        </Link>
                                    )}
                                    <Link href={route('orders.index')} className="text-gray-600 hover:text-pink-500 font-medium transition">Pesanan</Link>
                                    <div className="border-l border-gray-300 h-6 mx-2"></div>
                                    <Link href={route('dashboard')} className="text-gray-800 font-semibold hover:text-pink-600 transition">
                                        Halo, {auth.user.name || auth.user.username}
                                    </Link>
                                    <button 
                                        onClick={async (e) => {
                                            e.preventDefault();
                                            try { await axios.post(route('logout')); } catch (err) {}
                                            sessionStorage.clear();
                                            localStorage.clear();
                                            window.location.href = '/login';
                                        }}
                                        className="text-sm text-red-500 hover:text-red-700 transition"
                                    >
                                        Keluar
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link href={route('login')} className="text-gray-600 hover:text-pink-500 font-medium transition">Masuk</Link>
                                    <Link href={route('register')} className="bg-pink-500 text-white px-4 py-2 rounded-full font-medium hover:bg-pink-600 shadow-sm transition">
                                        Daftar
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main>
                {children}
            </main>

            {/* Footer */}
            <footer className="bg-white border-t border-pink-100 mt-16 py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-500">
                    <p>&copy; {new Date().getFullYear()} Florabelle. Crafted with love 💖.</p>
                </div>
            </footer>
        </div>
    );
}
