import InputError from '@/Components/InputError';
import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function Login({ status, canResetPassword }) {
    const [showPassword, setShowPassword] = useState(false);
    const { data, setData, post, processing, errors, reset, clearErrors, wasSuccessful } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();
        clearErrors();

        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <div className="flex min-h-screen bg-[#fafafa]">
            <Head title="Log in" />

            {/* Sisi Kiri (Gambar) */}
            <div className="hidden lg:flex w-1/2 relative bg-pink-100 overflow-hidden">
                <img 
                    src="https://images.unsplash.com/photo-1563241527-3004b7be0ffd?auto=format&fit=crop&w=1200&q=80" 
                    alt="Florabelle Flowers" 
                    className="absolute inset-0 w-full h-full object-cover transform hover:scale-105 transition duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#f472b6]/80 via-[#f472b6]/30 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-16 text-white w-full">
                    <h2 className="text-5xl font-serif font-bold leading-tight mb-4 text-white drop-shadow-md">
                        Florabelle.id Palu<br />Rangkai Momen Indahmu
                    </h2>
                    <p className="text-xl text-white/90 drop-shadow max-w-lg">Hadirkan senyum dan kebahagiaan melalui keindahan bunga terbaik yang dirangkai khusus untuk Anda.</p>
                </div>
            </div>

            {/* Sisi Kanan (Form) */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 relative">
                {/* Back to Home */}
                <a href="/" className="absolute top-6 left-6 sm:top-8 sm:left-8 flex items-center gap-2 text-slate-400 hover:text-pink-500 transition font-semibold text-sm">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Kembali ke Beranda
                </a>

                <div className="w-full max-w-md mt-6 sm:mt-0">
                    <div className="text-center lg:text-left mb-10">
                        <h1 className="text-4xl font-serif font-extrabold text-[#f472b6] mb-3 tracking-wide">
                            Florabelle.id
                        </h1>
                        <p className="text-slate-500 text-lg">Selamat datang kembali! Silakan masuk ke akun Anda.</p>
                    </div>

                    {status && (
                        <div className="mb-4 text-sm font-medium text-green-600">
                            {status}
                        </div>
                    )}

                    <form onSubmit={submit} className="space-y-6">
                        <div>
                            <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-2">
                                Email Address
                            </label>
                            <input
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                required
                                autoFocus
                                className="w-full px-5 py-3 rounded-2xl bg-white border-2 border-[#bfdbfe] focus:outline-none focus:border-[#f472b6] focus:ring-4 focus:ring-[#f472b6]/20 transition-all duration-300 placeholder-slate-400"
                                placeholder="nama@email.com"
                            />
                            <InputError message={errors.email} className="mt-2" />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-semibold text-slate-700 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    required
                                    className="w-full px-5 py-3 rounded-2xl bg-white border-2 border-[#bfdbfe] focus:outline-none focus:border-[#f472b6] focus:ring-4 focus:ring-[#f472b6]/20 transition-all duration-300 placeholder-slate-400 pr-12"
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

                        <div className="flex items-center justify-between mt-4">
                            <label className="flex items-center cursor-pointer group">
                                <input
                                    type="checkbox"
                                    name="remember"
                                    checked={data.remember}
                                    onChange={(e) => setData('remember', e.target.checked)}
                                    className="rounded border-gray-300 text-[#f472b6] shadow-sm focus:ring-[#f472b6] w-5 h-5 cursor-pointer"
                                />
                                <span className="ms-3 text-sm text-slate-600 group-hover:text-slate-800 transition">Ingat saya</span>
                            </label>

                            {canResetPassword && (
                                <Link
                                    href={route('password.request')}
                                    className="text-sm font-semibold text-[#f472b6] hover:text-pink-600 hover:underline transition"
                                >
                                    Lupa kata sandi?
                                </Link>
                            )}
                        </div>

                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={processing || wasSuccessful}
                                className="w-full bg-[#f472b6] text-white font-bold text-lg py-4 rounded-2xl shadow-lg shadow-[#f472b6]/30 hover:bg-pink-600 hover:-translate-y-1 transition transform duration-300 disabled:opacity-75 disabled:hover:translate-y-0"
                            >
                                {processing ? 'Memproses...' : (wasSuccessful ? 'Mengalihkan...' : 'LOG IN')}
                            </button>
                        </div>
                        
                        <div className="text-center text-sm text-slate-500 mt-8">
                            Belum punya akun?{' '}
                            <Link href={route('register')} className="text-[#f472b6] font-bold hover:underline transition">
                                Daftar di sini
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
