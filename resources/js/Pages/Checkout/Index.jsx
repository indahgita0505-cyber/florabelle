import { Head, Link, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';

export default function CheckoutIndex({ auth }) {
    const [bouquetData, setBouquetData] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState('Transfer Bank (Mandiri)');

    useEffect(() => {
        const savedCustom = sessionStorage.getItem('customBouquetData');
        const savedCart = sessionStorage.getItem('cartCheckoutData');
        if (savedCustom) {
            setBouquetData(JSON.parse(savedCustom));
        } else if (savedCart) {
            setBouquetData(JSON.parse(savedCart));
        }
    }, []);

    return (
        <div className="min-h-screen bg-slate-50 font-sans pb-20">
            <Head title="Checkout — Florabelle.id" />

            <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-pink-100 px-6 py-4 flex items-center justify-between shadow-sm">
                <Link href={route('dashboard')} className="flex items-center gap-2">
                    <span className="font-extrabold text-slate-700">← Kembali</span>
                </Link>
                <div className="text-sm font-bold text-pink-500">Checkout</div>
            </header>

            <main className="max-w-4xl mx-auto mt-10 px-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Form Pembayaran & Pengiriman */}
                <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
                    <h2 className="text-2xl font-bold text-slate-800 mb-6">Detail Pengiriman</h2>
                    
                    <form className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold text-slate-600 mb-2">Nama Penerima</label>
                            <input type="text" className="w-full rounded-xl border-slate-200 focus:border-pink-300 focus:ring focus:ring-pink-100" placeholder="John Doe" />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-semibold text-slate-600 mb-2">Nomor HP</label>
                            <input type="text" className="w-full rounded-xl border-slate-200 focus:border-pink-300 focus:ring focus:ring-pink-100" placeholder="0812xxxxxxxx" />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-600 mb-2">Alamat Pengiriman</label>
                            <textarea rows="3" className="w-full rounded-xl border-slate-200 focus:border-pink-300 focus:ring focus:ring-pink-100" placeholder="Jl. Contoh No. 123, Kota..."></textarea>
                        </div>

                        <div className="pt-4">
                            <label className="block text-sm font-semibold text-slate-600 mb-2">Metode Pembayaran</label>
                            <select 
                                className="w-full rounded-xl border-slate-200 focus:border-pink-300 focus:ring focus:ring-pink-100"
                                value={paymentMethod}
                                onChange={(e) => setPaymentMethod(e.target.value)}
                            >
                                <option value="Transfer Bank (BCA)">Transfer Bank (BCA)</option>
                                <option value="Transfer Bank (Mandiri)">Transfer Bank (Mandiri)</option>
                                <option value="E-Wallet (Gopay/OVO/Dana)">E-Wallet (Gopay/OVO/Dana)</option>
                                <option value="QRIS">QRIS</option>
                                <option value="Cash on Delivery (COD)">Cash on Delivery (COD)</option>
                            </select>
                            <p className="mt-2 text-xs text-slate-500 italic flex items-center gap-1">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-blue-400">
                                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clipRule="evenodd" />
                                </svg>
                                Instruksi pembayaran (Nomor Rekening/QRIS) akan ditampilkan di halaman selanjutnya setelah Anda klik "Bayar Sekarang".
                            </p>
                        </div>

                        <button 
                            type="button" 
                            className="w-full mt-6 bg-green-500 text-white font-bold py-4 rounded-xl shadow-lg hover:bg-green-600 transition-all"
                            onClick={() => {
                                // Simpan metode pembayaran ke session
                                if(bouquetData) {
                                    const key = bouquetData.isCart ? 'cartCheckoutData' : 'customBouquetData';
                                    sessionStorage.setItem(key, JSON.stringify({
                                        ...bouquetData,
                                        paymentMethod: paymentMethod,
                                        customerName: document.querySelector('input[placeholder="John Doe"]').value,
                                        customerPhone: document.querySelector('input[placeholder="0812xxxxxxxx"]').value,
                                        customerAddress: document.querySelector('textarea').value
                                    }));
                                    router.get(route('checkout.payment'));
                                }
                            }}
                        >
                            Bayar Sekarang
                        </button>
                    </form>
                </div>

                {/* Ringkasan Pesanan */}
                <div className="bg-slate-100 rounded-3xl p-8 shadow-inner border border-slate-200 h-fit">
                    <h2 className="text-xl font-bold text-slate-800 mb-6">Ringkasan Pesanan</h2>
                    
                    {bouquetData ? (
                        <ul className="space-y-4 text-sm text-slate-600">
                            {bouquetData.isCart ? (
                                <li className="flex justify-between border-b border-slate-200 pb-2">
                                    <span className="text-slate-500">Item Keranjang</span> 
                                    <span className="font-semibold text-right max-w-[60%]">{bouquetData.itemsText}</span>
                                </li>
                            ) : (
                                <>
                                    <li className="flex justify-between border-b border-slate-200 pb-2">
                                        <span className="text-slate-500">Isi Buket</span> 
                                        <span className="font-semibold text-right max-w-[60%]">{bouquetData.isiBuket.join(', ') || '-'}</span>
                                    </li>
                                    <li className="flex justify-between border-b border-slate-200 pb-2">
                                        <span className="text-slate-500">Tema Warna</span> 
                                        <span className="font-semibold">{bouquetData.warna || '-'}</span>
                                    </li>
                                    <li className="flex justify-between border-b border-slate-200 pb-2">
                                        <span className="text-slate-500">Wrapping</span> 
                                        <span className="font-semibold">{bouquetData.wrapping || '-'}</span>
                                    </li>
                                </>
                            )}
                            <li className="flex justify-between pt-4">
                                <span className="font-bold text-slate-800 text-lg">Total Pembayaran</span> 
                                <span className="font-extrabold text-pink-500 text-xl">Rp {bouquetData.budget.toLocaleString('id-ID')}</span>
                            </li>
                        </ul>
                    ) : (
                        <p className="text-slate-500 italic">Tidak ada data pesanan kustom yang ditemukan.</p>
                    )}
                </div>
            </main>
        </div>
    );
}
