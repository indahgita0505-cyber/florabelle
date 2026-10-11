import InputError from '@/Components/InputError';
import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function Register() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        whatsapp_number: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <div className="flex min-h-screen bg-[#fafafa]">
            <Head title="Register" />

            {/* Sisi Kiri (Form) */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 relative">
                {/* Back to Home */}
                <a href="/" className="absolute top-6 left-6 sm:top-8 sm:left-8 flex items-center gap-2 text-slate-400 hover:text-pink-500 transition font-semibold text-sm">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Kembali ke Beranda
                </a>

                <div className="w-full max-w-md mt-6 sm:mt-0">
                    <div className="text-center lg:text-left mb-8">
                        <h1 className="text-3xl font-serif font-extrabold text-[#f472b6] mb-2 tracking-wide">
                            Mulai Momen Spesialmu
                        </h1>
                        <p className="text-slate-500 text-sm">Daftar sekarang dan dapatkan potongan 10% untuk buket pertama Anda.</p>
                    </div>

                    <form onSubmit={submit} className="space-y-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-semibold text-slate-700 mb-1">
                                Nama Lengkap
                            </label>
                            <input
                                id="name"
                                type="text"
                                name="name"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                required
                                autoFocus
                                className="w-full px-5 py-3 rounded-xl bg-white border-2 border-[#bfdbfe] focus:outline-none focus:border-[#f472b6] focus:ring-4 focus:ring-[#f472b6]/20 transition-all duration-300 placeholder-slate-400"
                                placeholder="Cth: Nadhira Salsabila"
                            />
                            <InputError message={errors.name} className="mt-2" />
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-1">
                                Alamat Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                required
                                className="w-full px-5 py-3 rounded-xl bg-white border-2 border-[#bfdbfe] focus:outline-none focus:border-[#f472b6] focus:ring-4 focus:ring-[#f472b6]/20 transition-all duration-300 placeholder-slate-400"
                                placeholder="nama@email.com"
                            />
                            <InputError message={errors.email} className="mt-2" />
                        </div>

                        <div>
                            <label htmlFor="whatsapp_number" className="block text-sm font-semibold text-slate-700 mb-1">
                                Nomor WhatsApp <span className="text-xs font-normal text-slate-500">(Untuk pengiriman Ojol)</span>
                            </label>
                            <input
                                id="whatsapp_number"
                                type="text"
                                name="whatsapp_number"
                                value={data.whatsapp_number}
                                onChange={(e) => setData('whatsapp_number', e.target.value)}
                                required
                                className="w-full px-5 py-3 rounded-xl bg-white border-2 border-[#bfdbfe] focus:outline-none focus:border-[#f472b6] focus:ring-4 focus:ring-[#f472b6]/20 transition-all duration-300 placeholder-slate-400"
                                placeholder="08xxxxxxxxxx"
                            />
                            <InputError message={errors.whatsapp_number} className="mt-2" />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-semibold text-slate-700 mb-1">
                                Kata Sandi
                            </label>
                            <div className="relative">
                                <input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    required
                                    className="w-full px-5 py-3 rounded-xl bg-white border-2 border-[#bfdbfe] focus:outline-none focus:border-[#f472b6] focus:ring-4 focus:ring-[#f472b6]/20 transition-all duration-300 placeholder-slate-400 pr-12"
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-400 hover:text-[#f472b6] focus:outline-none"
                                >
                                    {showPassword ? (
                                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    ) : (
                                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                            <InputError message={errors.password} className="mt-2" />
                        </div>

                        <div>
                            <label htmlFor="password_confirmation" className="block text-sm font-semibold text-slate-700 mb-1">
                                Konfirmasi Kata Sandi
                            </label>
                            <div className="relative">
                                <input
                                    id="password_confirmation"
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    name="password_confirmation"
                                    value={data.password_confirmation}
                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                    required
                                    className="w-full px-5 py-3 rounded-xl bg-white border-2 border-[#bfdbfe] focus:outline-none focus:border-[#f472b6] focus:ring-4 focus:ring-[#f472b6]/20 transition-all duration-300 placeholder-slate-400 pr-12"
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-400 hover:text-[#f472b6] focus:outline-none"
                                >
                                    {showConfirmPassword ? (
                                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    ) : (
                                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                            <InputError message={errors.password_confirmation} className="mt-2" />
                        </div>

                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full bg-[#f472b6] text-white font-bold text-lg py-4 rounded-xl shadow-lg shadow-[#f472b6]/30 hover:bg-pink-600 hover:-translate-y-1 transition transform duration-300 disabled:opacity-75 disabled:hover:translate-y-0"
                            >
                                DAFTAR AKUN
                            </button>
                        </div>
                        
                        <div className="text-center text-sm text-slate-500 mt-6">
                            Sudah punya akun?{' '}
                            <Link href={route('login')} className="text-[#f472b6] font-bold hover:underline transition">
                                Masuk di sini
                            </Link>
                        </div>
                    </form>
                </div>
            </div>

            {/* Sisi Kanan (Gambar) */}
            <div className="hidden lg:flex w-1/2 relative overflow-hidden bg-blue-50">
                <img 
                    src="https://images.unsplash.com/photo-1591859345037-775bdf41d1d8?auto=format&fit=crop&w=1200&q=80" 
                    alt="Dried Flower Bouquet" 
                    className="absolute inset-0 w-full h-full object-cover transform hover:scale-105 transition duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-[#bfdbfe]/80 via-[#bfdbfe]/40 to-transparent"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center w-full px-12">
                    <h2 className="text-4xl font-serif font-bold leading-tight mb-4 text-slate-800 drop-shadow-sm">
                        Florabelle.id Palu<br/>
                        <span className="text-2xl font-light text-slate-700">Berbagi Kebahagiaan Lewat Rangkaian Bunga</span>
                    </h2>
                </div>
            </div>
        </div>
    );
}
