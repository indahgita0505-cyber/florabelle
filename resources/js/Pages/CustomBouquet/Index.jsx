import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';

export default function CustomBouquetIndex({ auth, dynamicOptions = [] }) {
    const [step, setStep] = useState(1);
    const [processing, setProcessing] = useState(false);
    const [formData, setFormData] = useState({
        isiBuket: [],
        warna: '',
        wrapping: '',
        budget: 150000,
        ucapan: '',
    });

    const handleSelect = (field, value) => {
        setFormData({ ...formData, [field]: value });
    };

    const toggleIsiBuket = (id) => {
        const current = formData.isiBuket;
        if (current.includes(id)) {
            setFormData({ ...formData, isiBuket: current.filter(i => i !== id) });
        } else {
            setFormData({ ...formData, isiBuket: [...current, id] });
        }
    };

    const handleNext = () => setStep(s => Math.min(s + 1, 4));
    const handlePrev = () => setStep(s => Math.max(s - 1, 1));

    const handleSubmit = () => {
        setProcessing(true);
        
        // Simpan data ringkasan pesanan ke sessionStorage agar terbawa ke halaman Checkout
        sessionStorage.setItem('customBouquetData', JSON.stringify(formData));
        
        // Redirect ke halaman Checkout
        router.get(route('checkout.index'), {}, {
            onFinish: () => setProcessing(false)
        });
    };

    const isiBuketOptions = dynamicOptions.filter(o => o.category === 'isi').map(o => ({
        id: o.name,
        label: o.name,
        img: o.image_url || 'https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?auto=format&fit=crop&w=200&q=80',
        price: o.price_adjustment
    }));

    const colorOptions = dynamicOptions.filter(o => o.category === 'warna').map(o => ({
        id: o.name,
        color: o.color_hex || '#fbcfe8',
        price: o.price_adjustment
    }));

    const wrappingOptions = dynamicOptions.filter(o => o.category === 'wrapping').map(o => ({
        id: o.name,
        desc: o.description || 'Pilihan Wrapping',
        price: o.price_adjustment
    }));

    return (
        <div className="min-h-screen bg-slate-50 font-sans pb-20">
            <Head title="Kustom Buket — Florabelle.id" />

            {/* Navbar */}
            <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-pink-100 px-6 py-4 flex items-center justify-between shadow-sm">
                <Link href={auth?.user ? route('dashboard') : route('home')} className="flex items-center gap-2 hover:opacity-80 transition">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white bg-gradient-to-br from-pink-400 to-blue-400 shadow-sm">
                        🌸
                    </div>
                    <span className="font-extrabold text-slate-700 hidden sm:block">Florabelle</span>
                </Link>
                <div className="flex items-center gap-3">
                    <div className="text-sm font-bold text-pink-500 bg-pink-50 px-4 py-1.5 rounded-full">
                        Langkah {step} dari 4
                    </div>
                    <Link 
                        href={auth?.user ? route('dashboard') : route('home')} 
                        className="text-sm font-bold text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 px-4 py-1.5 rounded-full transition flex items-center gap-1.5"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Kembali
                    </Link>
                </div>
            </header>

            <main className="max-w-3xl mx-auto mt-10 px-6">
                <div className="text-center mb-10">
                    <h1 className="text-3xl md:text-4xl font-extrabold text-slate-800 mb-3">Rangkai Buket Impianmu</h1>
                    <p className="text-slate-500">Sesuaikan jenis bunga, warna, dan budget. Biarkan kami merangkainya dengan cinta.</p>
                </div>

                {/* Form Container (Glassmorphism) */}
                <div className="bg-white/70 backdrop-blur-xl border border-white rounded-3xl p-6 md:p-10 shadow-xl shadow-pink-100/50 relative overflow-hidden transition-all duration-500 min-h-[400px] flex flex-col justify-between">
                    
                    {/* Decorative Blurs */}
                    <div className="absolute -top-20 -right-20 w-64 h-64 bg-pink-200 rounded-full blur-3xl opacity-30 pointer-events-none" />
                    <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-blue-200 rounded-full blur-3xl opacity-30 pointer-events-none" />

                    <div className="relative z-10 flex-1">
                        {/* STEP 1: Pilih Bunga */}
                        {step === 1 && (
                            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                                <h2 className="text-xl font-bold text-slate-700 mb-6 flex items-center gap-2">
                                    <span className="bg-pink-100 text-pink-500 w-8 h-8 flex items-center justify-center rounded-full text-sm">1</span>
                                    Pilih Isi Buket (Bisa lebih dari 1)
                                </h2>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                    {isiBuketOptions.map(item => {
                                        const isSelected = formData.isiBuket.includes(item.id);
                                        return (
                                            <button
                                                key={item.id}
                                                onClick={() => toggleIsiBuket(item.id)}
                                                className={`relative group overflow-hidden rounded-2xl border-2 transition-all duration-300 h-32 text-left ${isSelected ? 'border-pink-500 ring-4 ring-pink-100' : 'border-transparent hover:border-pink-200'}`}
                                            >
                                                <img src={item.img} alt={item.label} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                                                <div className="absolute bottom-3 left-3 right-3">
                                                    <span className="block text-white font-bold text-sm shadow-sm leading-tight">{item.label}</span>
                                                    {item.price > 0 && <span className="block text-pink-200 text-xs mt-0.5">+Rp {parseFloat(item.price).toLocaleString('id-ID')}</span>}
                                                </div>
                                                {isSelected && (
                                                    <div className="absolute top-3 right-3 w-6 h-6 bg-pink-500 rounded-full flex items-center justify-center text-white text-xs shadow-lg">✓</div>
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* STEP 2: Warna & Wrapping */}
                        {step === 2 && (
                            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                                <h2 className="text-xl font-bold text-slate-700 mb-6 flex items-center gap-2">
                                    <span className="bg-pink-100 text-pink-500 w-8 h-8 flex items-center justify-center rounded-full text-sm">2</span>
                                    Nuansa Warna & Wrapping
                                </h2>
                                
                                <div className="mb-8">
                                    <label className="block text-sm font-semibold text-slate-600 mb-3">Dominasi Warna</label>
                                    <div className="flex flex-wrap gap-3">
                                        {colorOptions.map(opt => (
                                            <button
                                                key={opt.id}
                                                onClick={() => handleSelect('warna', opt.id)}
                                                className={`flex items-center gap-2 px-4 py-2.5 rounded-full border-2 transition-all ${formData.warna === opt.id ? 'border-pink-500 bg-pink-50 text-pink-600 font-bold' : 'border-slate-200 hover:border-pink-300 text-slate-600'}`}
                                            >
                                                <span className="w-4 h-4 rounded-full border shadow-inner" style={{ backgroundColor: opt.color }}></span>
                                                {opt.id}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-slate-600 mb-3">Jenis Kertas Wrapping</label>
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                        {wrappingOptions.map(wrap => (
                                            <button
                                                key={wrap.id}
                                                onClick={() => handleSelect('wrapping', wrap.id)}
                                                className={`p-4 rounded-xl border-2 text-left transition-all ${formData.wrapping === wrap.id ? 'border-pink-500 bg-pink-50' : 'border-slate-200 hover:bg-slate-50'}`}
                                            >
                                                <div className={`font-bold ${formData.wrapping === wrap.id ? 'text-pink-600' : 'text-slate-700'}`}>{wrap.id}</div>
                                                <div className="text-xs text-slate-400 mt-1">{wrap.desc}</div>
                                                {wrap.price > 0 && <div className="text-xs font-bold text-pink-500 mt-1">+Rp {parseFloat(wrap.price).toLocaleString('id-ID')}</div>}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* STEP 3: Budget & Pesan */}
                        {step === 3 && (
                            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                                <h2 className="text-xl font-bold text-slate-700 mb-6 flex items-center gap-2">
                                    <span className="bg-pink-100 text-pink-500 w-8 h-8 flex items-center justify-center rounded-full text-sm">3</span>
                                    Budget & Kartu Ucapan
                                </h2>
                                
                                <div className="mb-8 p-6 bg-slate-50 rounded-2xl border border-slate-100">
                                    <label className="block text-sm font-semibold text-slate-600 mb-4 flex justify-between">
                                        <span>Sesuaikan Budget Anda</span>
                                        <span className="text-pink-500 font-bold text-lg">Rp {formData.budget.toLocaleString('id-ID')}</span>
                                    </label>
                                    <input 
                                        type="range" 
                                        min="50000" 
                                        max="1000000" 
                                        step="50000"
                                        value={formData.budget}
                                        onChange={(e) => handleSelect('budget', parseInt(e.target.value))}
                                        className="w-full h-2 bg-pink-200 rounded-lg appearance-none cursor-pointer accent-pink-500"
                                    />
                                    <div className="flex justify-between text-xs text-slate-400 mt-2">
                                        <span>Mulai Rp50k</span>
                                        <span>Premium Rp1M+</span>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-slate-600 mb-2">Pesan di Kartu Ucapan (Opsional)</label>
                                    <textarea 
                                        rows="4" 
                                        className="w-full rounded-xl border-slate-200 bg-slate-50 focus:border-pink-300 focus:ring focus:ring-pink-100 transition-all p-4 text-sm"
                                        placeholder="Tuliskan ucapan termanis untuk si dia..."
                                        value={formData.ucapan}
                                        onChange={(e) => handleSelect('ucapan', e.target.value)}
                                    ></textarea>
                                </div>
                            </div>
                        )}

                        {/* STEP 4: Konfirmasi */}
                        {step === 4 && (
                            <div className="animate-in fade-in zoom-in-95 duration-500 text-center">
                                <div className="w-20 h-20 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <span className="text-4xl">💐</span>
                                </div>
                                <h2 className="text-2xl font-bold text-slate-800 mb-2">Semua Sudah Siap!</h2>
                                <p className="text-slate-500 mb-8 max-w-md mx-auto">Satu langkah lagi untuk mewujudkan buket impianmu. Pesanan akan diteruskan ke WhatsApp admin Florabelle untuk diproses lebih lanjut.</p>
                                
                                <div className="bg-slate-50 rounded-2xl p-6 text-left border border-slate-200 max-w-md mx-auto shadow-inner">
                                    <h3 className="font-bold text-slate-700 mb-3 border-b pb-2">Ringkasan Pesanan</h3>
                                    <ul className="space-y-2 text-sm text-slate-600">
                                        <li className="flex justify-between"><span className="text-slate-400">Isi Buket:</span> <span className="font-semibold text-right max-w-[60%]">{formData.isiBuket.join(', ') || '-'}</span></li>
                                        <li className="flex justify-between"><span className="text-slate-400">Tema Warna:</span> <span className="font-semibold">{formData.warna || '-'}</span></li>
                                        <li className="flex justify-between"><span className="text-slate-400">Wrapping:</span> <span className="font-semibold">{formData.wrapping || '-'}</span></li>
                                        <li className="flex justify-between"><span className="text-slate-400">Budget:</span> <span className="font-semibold text-pink-500">Rp {formData.budget.toLocaleString('id-ID')}</span></li>
                                    </ul>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Navigation Buttons */}
                    <div className="relative z-10 flex items-center justify-between mt-10 pt-6 border-t border-slate-100">
                        <button 
                            onClick={handlePrev} 
                            disabled={step === 1}
                            className={`px-6 py-2.5 rounded-full font-semibold transition-all ${step === 1 ? 'opacity-0 pointer-events-none' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                        >
                            Kembali
                        </button>

                        {step < 4 ? (
                            <button 
                                onClick={handleNext}
                                disabled={(step === 1 && formData.isiBuket.length === 0) || (step === 2 && (!formData.warna || !formData.wrapping))}
                                className={`px-8 py-2.5 rounded-full font-bold text-white shadow-lg transition-all ${((step === 1 && formData.isiBuket.length === 0) || (step === 2 && (!formData.warna || !formData.wrapping))) ? 'bg-pink-300 cursor-not-allowed shadow-none' : 'bg-pink-500 hover:bg-pink-600 hover:-translate-y-1 shadow-pink-500/30'}`}
                            >
                                Lanjut
                            </button>
                        ) : (
                            <button 
                                onClick={handleSubmit}
                                disabled={processing}
                                className="px-8 py-2.5 rounded-full font-bold text-white bg-green-500 hover:bg-green-600 hover:-translate-y-1 shadow-lg shadow-green-500/30 transition-all flex items-center gap-2 disabled:opacity-75 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                            >
                                {processing ? 'Memproses...' : 'Buat Pesanan'}
                            </button>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
