import { Head, Link } from '@inertiajs/react';

export default function CustomBouquetSuccess({ auth }) {
    return (
        <div className="min-h-screen bg-slate-50 font-sans flex items-center justify-center p-6 relative overflow-hidden">
            <Head title="Pesanan Berhasil — Florabelle.id" />

            {/* Decorative Blurs */}
            <div className="absolute top-10 left-10 w-72 h-72 bg-pink-200 rounded-full blur-3xl opacity-30 pointer-events-none" />
            <div className="absolute bottom-10 right-10 w-72 h-72 bg-blue-200 rounded-full blur-3xl opacity-30 pointer-events-none" />

            <div className="bg-white/70 backdrop-blur-xl border border-white rounded-3xl p-10 max-w-lg w-full text-center shadow-xl shadow-pink-100/50 relative z-10 animate-in fade-in zoom-in duration-700">
                <div className="w-24 h-24 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                
                <h1 className="text-3xl font-extrabold text-slate-800 mb-4">Pembayaran Terverifikasi!</h1>
                <p className="text-slate-500 mb-8 leading-relaxed">
                    Terima kasih telah mempercayakan momen spesial Anda kepada Florabelle.id. Sistem *Payment Gateway* kami telah memverifikasi pembayaran Anda secara otomatis. 
                    Pesanan Kustom Buket Anda kini sedang diproses. Kami akan segera menghubungi Anda melalui WhatsApp untuk memberikan pembaruan pesanan.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link 
                        href={route('home')} 
                        className="px-8 py-3 rounded-full font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-all"
                    >
                        Ke Beranda
                    </Link>
                    <Link 
                        href={auth?.user ? route('dashboard') : route('products.index')} 
                        className="px-8 py-3 rounded-full font-bold text-white bg-pink-500 hover:bg-pink-600 shadow-lg shadow-pink-500/30 transition-all hover:-translate-y-1"
                    >
                        Lihat Katalog Lainnya
                    </Link>
                </div>
            </div>
        </div>
    );
}
