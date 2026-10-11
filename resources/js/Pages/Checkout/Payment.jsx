import { Head, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';

export default function PaymentInstruction({ auth }) {
    const [orderData, setOrderData] = useState(null);
    const [processing, setProcessing] = useState(false);

    const [simulating, setSimulating] = useState(false);
    const [verificationStatus, setVerificationStatus] = useState('pending'); // pending, verifying, success

    useEffect(() => {
        const savedCustom = sessionStorage.getItem('customBouquetData');
        const savedCart = sessionStorage.getItem('cartCheckoutData');
        
        if (savedCustom) {
            setOrderData(JSON.parse(savedCustom));
        } else if (savedCart) {
            setOrderData(JSON.parse(savedCart));
        } else {
            router.get(route('home'));
        }
    }, []);

    const handleConfirm = () => {
        if (orderData.paymentMethod !== 'Cash on Delivery (COD)') {
            setSimulating(true);
            setVerificationStatus('verifying');
            
            // Simulasi proses verifikasi payment gateway (3 detik)
            setTimeout(() => {
                setVerificationStatus('success');
            }, 3000);
        } else {
            setProcessing(true);
            submitOrder();
        }
    };

    const submitOrder = () => {
        setProcessing(true);
        if (orderData.isCart) {
            router.post(route('orders.store'), {
                cart_ids: orderData.cartIds,
                customer_name: orderData.customerName || 'Customer',
                customer_phone: orderData.customerPhone || '-',
                customer_address: orderData.customerAddress || '-',
                payment_method: orderData.paymentMethod,
                notes: ''
            }, {
                onFinish: () => {
                    setProcessing(false);
                    sessionStorage.removeItem('cartCheckoutData');
                }
            });
        } else {
            router.post(route('custom.store'), orderData, {
                onFinish: () => {
                    setProcessing(false);
                    sessionStorage.removeItem('customBouquetData');
                }
            });
        }
    };

    if (!orderData) return null;

    const renderInstructions = () => {
        if (orderData.paymentMethod === 'Transfer Bank (Mandiri)') {
            return (
                <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-6 mb-6">
                    <div className="flex items-center gap-4 mb-4">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/a/a9/Bank_Mandiri_logo_2016.svg" alt="Mandiri" className="h-8" />
                        <h3 className="font-bold text-slate-700 text-lg">Transfer via Bank Mandiri</h3>
                    </div>
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 mb-6 text-center">
                        <p className="text-sm text-slate-500 mb-1">Virtual Account (Otomatis Verifikasi)</p>
                        <p className="text-3xl font-extrabold tracking-wider text-blue-600 mb-1">8990-1234-5678</p>
                        <p className="text-sm font-semibold text-slate-600">a.n Florabelle ID</p>
                    </div>
                    <div>
                        <h4 className="font-bold text-slate-700 mb-3 text-sm">Nominal Pembayaran:</h4>
                        <div className="text-2xl font-extrabold text-pink-500 mb-4">Rp {orderData.budget.toLocaleString('id-ID')}</div>
                        <p className="text-sm text-slate-500 italic">Sistem akan secara otomatis memverifikasi pembayaran Anda setelah Anda mentransfer ke nomor Virtual Account di atas.</p>
                    </div>
                </div>
            );
        } else if (orderData.paymentMethod === 'QRIS') {
            return (
                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 mb-6 text-center">
                    <div className="mb-4 flex justify-center">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/a/a2/Logo_QRIS.svg" alt="QRIS" className="h-8" />
                    </div>
                    <p className="text-sm text-slate-600 mb-6">Scan kode QR di bawah ini menggunakan aplikasi M-Banking atau E-Wallet Anda. Verifikasi otomatis dalam hitungan detik.</p>
                    
                    <div className="bg-white inline-block p-4 rounded-2xl shadow-md border border-slate-200 mb-6">
                        {/* Dummy QR Code Image */}
                        <img 
                            src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=FLORABELLE-${orderData.budget}`} 
                            alt="QRIS Barcode" 
                            className="w-48 h-48 mx-auto"
                        />
                    </div>
                    
                    <div className="bg-pink-50 text-pink-700 py-3 px-6 rounded-xl font-bold inline-block border border-pink-100">
                        Total Pembayaran: Rp {orderData.budget.toLocaleString('id-ID')}
                    </div>
                </div>
            );
        } else {
            return (
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 mb-6 text-center">
                    <h3 className="font-bold text-slate-700 mb-2">Instruksi Pembayaran</h3>
                    <p className="text-sm text-slate-600">
                        Silakan selesaikan pembayaran sejumlah <strong className="text-pink-500">Rp {orderData.budget.toLocaleString('id-ID')}</strong> menggunakan metode {orderData.paymentMethod}. Verifikasi otomatis dari sistem.
                    </p>
                </div>
            );
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans flex items-center justify-center p-6 pb-20">
            <Head title="Instruksi Pembayaran — Florabelle.id" />

            <div className="max-w-xl w-full bg-white rounded-3xl p-8 shadow-xl shadow-pink-100/50 border border-slate-100">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-extrabold text-slate-800 mb-2">Selesaikan Pembayaran</h1>
                    <p className="text-slate-500 text-sm">Menunggu pembayaran Anda sebelum memproses pesanan.</p>
                </div>

                {/* Bagian Instruksi */}
                {renderInstructions()}

                {/* Area Simulasi Verifikasi */}
                {simulating && (
                    <div className="mb-6 p-4 rounded-xl text-center bg-slate-50 border border-slate-200">
                        {verificationStatus === 'verifying' && (
                            <div className="flex flex-col items-center justify-center space-y-3">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
                                <p className="text-sm text-slate-600 font-semibold animate-pulse">Menunggu pembayaran masuk dari Gateway...</p>
                            </div>
                        )}
                        {verificationStatus === 'success' && (
                            <div className="flex flex-col items-center justify-center space-y-3">
                                <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <p className="text-sm text-green-600 font-bold">Pembayaran Berhasil Diterima!</p>
                            </div>
                        )}
                    </div>
                )}

                {/* Tombol Konfirmasi */}
                <div className="pt-4 border-t border-slate-100">
                    {verificationStatus === 'success' ? (
                        <button 
                            onClick={submitOrder}
                            disabled={processing}
                            className="w-full bg-slate-800 text-white font-bold text-lg py-4 rounded-2xl shadow-lg hover:bg-slate-900 hover:-translate-y-1 transition transform duration-300 disabled:opacity-75 disabled:cursor-not-allowed"
                        >
                            {processing ? 'Memproses...' : (orderData.isCart ? 'Selesaikan Pesanan' : 'Selesaikan & Kembali ke Beranda')}
                        </button>
                    ) : (
                        <>
                            <button 
                                onClick={handleConfirm}
                                disabled={processing || simulating}
                                className="w-full bg-green-500 text-white font-bold text-lg py-4 rounded-2xl shadow-lg shadow-green-500/30 hover:bg-green-600 hover:-translate-y-1 transition transform duration-300 disabled:opacity-75 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                            >
                                {processing ? 'Memproses Pesanan...' : simulating ? 'Sistem Memverifikasi...' : 'Cek Status Pembayaran (Simulasi)'}
                            </button>
                            {orderData.paymentMethod !== 'Cash on Delivery (COD)' && !simulating && (
                                <p className="text-xs text-center text-slate-400 mt-4 italic">Tombol di atas adalah simulasi otomatisasi payment gateway. Klik untuk mendemokan verifikasi otomatis.</p>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
