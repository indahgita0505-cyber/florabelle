import { Head, Link } from '@inertiajs/react';

export default function Welcome({ auth, laravelVersion, phpVersion }) {
    const handleImageError = () => {
        document
            .getElementById('screenshot-container')
            ?.classList.add('!hidden');
        document.getElementById('docs-card')?.classList.add('!row-span-1');
        document
            .getElementById('docs-card-content')
            ?.classList.add('!flex-row');
        document.getElementById('background')?.classList.add('!hidden');
    };

    return (
        <>
            <Head title="Welcome" />
            <div className="bg-gradient-to-br from-primary/30 via-white to-secondary/40 text-slate-700 dark:bg-black dark:text-white/50 min-h-screen">
                <img
                    id="background"
                    className="absolute -left-20 top-0 max-w-[877px]"
                    src="https://laravel.com/assets/img/welcome/background.svg"
                />
                <div className="relative flex min-h-screen flex-col items-center justify-center selection:bg-[#f472b6] selection:text-white">
                    <div className="relative w-full max-w-2xl px-6 lg:max-w-7xl">
                        <header className="grid grid-cols-2 items-center gap-2 py-10 lg:grid-cols-3">
                            <div className="flex lg:col-start-2 lg:justify-center">
                                <svg
                                    className="h-12 w-auto text-white lg:h-16 lg:text-[#f472b6]"
                                    viewBox="0 0 62 65"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M61.8548 14.6253C61.8778 14.7102 61.8895 14.7978 61.8897 14.8858V28.5615C61.8898 28.737 61.8434 28.9095 61.7554 29.0614C61.6675 29.2132 61.5409 29.3392 61.3887 29.4265L49.9104 36.0351V49.1337C49.9104 49.4902 49.7209 49.8192 49.4118 49.9987L25.4519 63.7916C25.3971 63.8227 25.3372 63.8427 25.2774 63.8639C25.255 63.8714 25.2338 63.8851 25.2101 63.8913C25.0426 63.9354 24.8666 63.9354 24.6991 63.8913C24.6716 63.8838 24.6467 63.8689 24.6205 63.8589C24.5657 63.8389 24.5084 63.8215 24.456 63.7916L0.501061 49.9987C0.348882 49.9113 0.222437 49.7853 0.134469 49.6334C0.0465019 49.4816 0.000120578 49.3092 0 49.1337L0 8.10652C0 8.01678 0.0124642 7.92953 0.0348998 7.84477C0.0423783 7.8161 0.0598282 7.78993 0.0697995 7.76126C0.0884958 7.70891 0.105946 7.65531 0.133367 7.6067C0.152063 7.5743 0.179485 7.54812 0.20192 7.51821C0.230588 7.47832 0.256763 7.43719 0.290416 7.40229C0.319084 7.37362 0.356476 7.35243 0.388883 7.32751C0.425029 7.29759 0.457436 7.26518 0.498568 7.2415L12.4779 0.345059C12.6296 0.257786 12.8015 0.211853 12.9765 0.211853C13.1515 0.211853 13.3234 0.257786 13.475 0.345059L25.4531 7.2415H25.4556C25.4955 7.26643 25.5292 7.29759 25.5653 7.32626C25.5977 7.35119 25.6339 7.37362 25.6625 7.40104C25.6974 7.43719 25.7224 7.47832 25.7523 7.51821C25.7735 7.54812 25.8021 7.5743 25.8196 7.6067C25.8483 7.65656 25.8645 7.70891 25.8844 7.76126C25.8944 7.78993 25.9118 7.8161 25.9193 7.84602C25.9423 7.93096 25.954 8.01853 25.9542 8.10652V33.7317L35.9355 27.9844V14.8846C35.9355 14.7973 35.948 14.7088 35.9704 14.6253C35.9792 14.5954 35.9954 14.5692 36.0053 14.5405C36.0253 14.4882 36.0427 14.4346 36.0702 14.386C36.0888 14.3536 36.1163 14.3274 36.1375 14.2975C36.1674 14.2576 36.1923 14.2165 36.2272 14.1816C36.2559 14.1529 36.292 14.1317 36.3244 14.1068C36.3618 14.0769 36.3942 14.0445 36.4341 14.0208L48.4147 7.12434C48.5663 7.03694 48.7383 6.99094 48.9133 6.99094C49.0883 6.99094 49.2602 7.03694 49.4118 7.12434L61.3899 14.0208C61.4323 14.0457 61.4647 14.0769 61.5021 14.1055C61.5333 14.1305 61.5694 14.1529 61.5981 14.1803C61.633 14.2165 61.6579 14.2576 61.6878 14.2975C61.7103 14.3274 61.7377 14.3536 61.7551 14.386C61.7838 14.4346 61.8 14.4882 61.8199 14.5405C61.8312 14.5692 61.8474 14.5954 61.8548 14.6253ZM59.893 27.9844V16.6121L55.7013 19.0252L49.9104 22.3593V33.7317L59.8942 27.9844H59.893ZM47.9149 48.5566V37.1768L42.2187 40.4299L25.953 49.7133V61.2003L47.9149 48.5566ZM1.99677 9.83281V48.5566L23.9562 61.199V49.7145L12.4841 43.2219L12.4804 43.2194L12.4754 43.2169C12.4368 43.1945 12.4044 43.1621 12.3682 43.1347C12.3371 43.1097 12.3009 43.0898 12.2735 43.0624L12.271 43.0586C12.2386 43.0275 12.2162 42.9888 12.1887 42.9539C12.1638 42.9203 12.1339 42.8916 12.114 42.8567L12.1127 42.853C12.0903 42.8156 12.0766 42.7707 12.0604 42.7283C12.0442 42.6909 12.023 42.656 12.013 42.6161C12.0005 42.5688 11.998 42.5177 11.9931 42.4691C11.9881 42.4317 11.9781 42.3943 11.9781 42.3569V15.5801L6.18848 12.2446L1.99677 9.83281ZM12.9777 2.36177L2.99764 8.10652L12.9752 13.8513L22.9541 8.10527L12.9752 2.36177H12.9777ZM18.1678 38.2138L23.9574 34.8809V9.83281L19.7657 12.2459L13.9749 15.5801V40.6281L18.1678 38.2138ZM48.9133 9.14105L38.9344 14.8858L48.9133 20.6305L58.8909 14.8846L48.9133 9.14105ZM47.9149 22.3593L42.124 19.0252L37.9323 16.6121V27.9844L43.7219 31.3174L47.9149 33.7317V22.3593ZM24.9533 47.987L39.59 39.631L46.9065 35.4555L36.9352 29.7145L25.4544 36.3242L14.9907 42.3482L24.9533 47.987Z"
                                        fill="currentColor"
                                    />
                                </svg>
                            </div>
                            <nav className="-mx-3 flex flex-1 justify-end">
                                {auth.user ? (
                                    <Link
                                        href={route('dashboard')}
                                        className="rounded-md px-3 py-2 text-black ring-1 ring-transparent transition hover:text-black/70 focus:outline-none focus-visible:ring-[#f472b6] dark:text-white dark:hover:text-white/80 dark:focus-visible:ring-white"
                                    >
                                        Dashboard
                                    </Link>
                                ) : (
                                    <>
                                        <Link
                                            href={route('login')}
                                            className="rounded-md px-3 py-2 text-black ring-1 ring-transparent transition hover:text-black/70 focus:outline-none focus-visible:ring-[#f472b6] dark:text-white dark:hover:text-white/80 dark:focus-visible:ring-white"
                                        >
                                            Log in
                                        </Link>
                                        <Link
                                            href={route('register')}
                                            className="rounded-md px-3 py-2 text-black ring-1 ring-transparent transition hover:text-black/70 focus:outline-none focus-visible:ring-[#f472b6] dark:text-white dark:hover:text-white/80 dark:focus-visible:ring-white"
                                        >
                                            Register
                                        </Link>
                                    </>
                                )}
                            </nav>
                        </header>

                        <main className="mt-16 w-full max-w-5xl mx-auto flex flex-col gap-24">
                            {/* 1. Hero Section */}
                            <section className="text-center px-4">
                                <h1 className="text-4xl md:text-6xl font-extrabold text-slate-800 dark:text-white leading-tight mb-6">
                                    Sampaikan Perasaanmu dengan <span className="text-primary-dark">Keindahan yang Mekar Sempurna</span>
                                </h1>
                                <p className="text-lg md:text-xl text-slate-600 dark:text-white/70 max-w-3xl mx-auto mb-10">
                                    Dari momen manis hingga perayaan besar, Florabelle.id Palu hadir dengan koleksi Bunga Segar, Bunga Kering, dan Artificial terbaik. Estetik, bisa custom budget, dan siap dikirim hari ini juga!
                                </p>
                                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                    <Link href={route('products.index')} className="w-full sm:w-auto px-8 py-4 bg-primary-dark text-white rounded-full font-bold shadow-lg shadow-primary-dark/30 hover:bg-pink-600 hover:-translate-y-1 transition transform duration-300">
                                        Lihat Katalog Bunga
                                    </Link>
                                    <Link href={route('custom.index')} className="w-full sm:w-auto px-8 py-4 bg-white text-slate-800 rounded-full font-bold shadow-md hover:bg-slate-50 transition">
                                        Pesan Custom Buket
                                    </Link>
                                </div>
                            </section>

                            {/* 2. Mengapa Memilih Kami */}
                            <section className="px-4">
                                <div className="text-center mb-12">
                                    <h2 className="text-3xl font-bold text-slate-800 dark:text-white">Kenapa Harus Florabelle.id Palu?</h2>
                                </div>
                                <div className="grid md:grid-cols-2 gap-8">
                                    <div className="bg-white/60 dark:bg-zinc-900/60 backdrop-blur-md p-8 rounded-2xl shadow-sm border border-white/20">
                                        <div className="text-4xl mb-4"></div>
                                        <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Fleksibel & Custom Suka-suka</h3>
                                        <p className="text-slate-600 dark:text-white/70">Tentukan sendiri warna, jenis bunga, hingga budget Anda. Kami merangkainya dengan penuh cinta agar pas di hati dan pas di kantong.</p>
                                    </div>
                                    <div className="bg-white/60 dark:bg-zinc-900/60 backdrop-blur-md p-8 rounded-2xl shadow-sm border border-white/20">
                                        <div className="text-4xl mb-4"></div>
                                        <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Pengiriman Instan Sekota Palu</h3>
                                        <p className="text-slate-600 dark:text-white/70">Butuh cepat? Kami bermitra dengan ojek online & Grab untuk memastikan bunga Anda sampai ke tujuan dengan aman dan secepat kilat.</p>
                                    </div>
                                    <div className="bg-white/60 dark:bg-zinc-900/60 backdrop-blur-md p-8 rounded-2xl shadow-sm border border-white/20">
                                        <div className="text-4xl mb-4"></div>
                                        <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Pilihan Bunga Terlengkap</h3>
                                        <p className="text-slate-600 dark:text-white/70">Bukan cuma Fresh Cut Flowers yang segar, kami juga menyediakan Dried Flower klasik dan Artificial Flower yang awet selamanya.</p>
                                    </div>
                                    <div className="bg-white/60 dark:bg-zinc-900/60 backdrop-blur-md p-8 rounded-2xl shadow-sm border border-white/20">
                                        <div className="text-4xl mb-4"></div>
                                        <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Selalu Dekat & Ramah</h3>
                                        <p className="text-slate-600 dark:text-white/70">Kami adalah teman berbagi momen Anda. Jangan lupa sapa kami setiap hari Minggu di CFD (depan Kantor FIF Palu)!</p>
                                    </div>
                                </div>
                            </section>

                            {/* 3. Layanan Utama */}
                            <section className="px-4">
                                <div className="text-center mb-12">
                                    <h2 className="text-3xl font-bold text-slate-800 dark:text-white">Layanan Terbaik Kami</h2>
                                </div>
                                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                    <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-lg border border-primary/20 text-center hover:-translate-y-2 transition duration-300">
                                        <div className="w-16 h-16 mx-auto bg-primary-dark/10 text-primary-dark flex items-center justify-center rounded-full text-3xl mb-4"></div>
                                        <h4 className="font-bold text-lg mb-2 dark:text-white">Custom Bouquet</h4>
                                        <p className="text-sm text-slate-500 dark:text-white/60">Hadiah kejutan manis dari bunga segar, kering, atau buatan yang dirangkai estetik.</p>
                                    </div>
                                    <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-lg border border-secondary/20 text-center hover:-translate-y-2 transition duration-300">
                                        <div className="w-16 h-16 mx-auto bg-secondary-dark/10 text-secondary-dark flex items-center justify-center rounded-full text-3xl mb-4"></div>
                                        <h4 className="font-bold text-lg mb-2 dark:text-white">Dekorasi Bunga</h4>
                                        <p className="text-sm text-slate-500 dark:text-white/60">Hadirkan nuansa manis dan elegan di sudut ruangan atau momen perayaan kecil Anda.</p>
                                    </div>
                                    <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-lg border border-primary/20 text-center hover:-translate-y-2 transition duration-300">
                                        <div className="w-16 h-16 mx-auto bg-primary-dark/10 text-primary-dark flex items-center justify-center rounded-full text-3xl mb-4"></div>
                                        <h4 className="font-bold text-lg mb-2 dark:text-white">Karangan Bunga</h4>
                                        <p className="text-sm text-slate-500 dark:text-white/60">Sampaikan selamat atau duka cita melalui papan bunga yang dirancang indah.</p>
                                    </div>
                                    <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-lg border border-secondary/20 text-center hover:-translate-y-2 transition duration-300">
                                        <div className="w-16 h-16 mx-auto bg-secondary-dark/10 text-secondary-dark flex items-center justify-center rounded-full text-3xl mb-4"></div>
                                        <h4 className="font-bold text-lg mb-2 dark:text-white">Reseller Grosir</h4>
                                        <p className="text-sm text-slate-500 dark:text-white/60">Bergabunglah dan dapatkan suplai bunga berkualitas dengan harga grosir terbaik di Palu.</p>
                                    </div>
                                </div>
                            </section>

                            {/* 4. Kontak & Lokasi */}
                            <section className="px-4 pb-20">
                                <div className="bg-gradient-to-r from-primary-dark to-secondary-dark rounded-3xl p-8 md:p-12 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
                                    <div className="max-w-xl">
                                        <h2 className="text-3xl font-bold mb-4">Kunjungi Kami atau Pesan dari Rumah</h2>
                                        <p className="text-white/80 mb-6">Ingin melihat langsung keindahan koleksi kami atau berdiskusi tentang buket impianmu? Pintu kami selalu terbuka.</p>
                                        <ul className="space-y-3 mb-8">
                                            <li className="flex items-start gap-3">
                                                <span className="text-xl"></span>
                                                <span><strong>Workshop:</strong> Jl. Dayodara - Jl. Meteorologi Blok B2, Palu.</span>
                                            </li>
                                            <li className="flex items-start gap-3">
                                                <span className="text-xl"></span>
                                                <span><strong>Pop-up Store (Minggu Pagi):</strong> Area CFD, Depan Kantor FIF Palu.</span>
                                            </li>
                                            <li className="flex items-start gap-3">
                                                <span className="text-xl"></span>
                                                <span><strong>Instagram:</strong> @Florabelle.id</span>
                                            </li>
                                        </ul>
                                    </div>
                                    <div className="flex flex-col gap-4 w-full md:w-auto">
                                        <a href="#" className="px-8 py-4 bg-white text-primary-dark rounded-full font-bold shadow-md hover:bg-gray-100 transition text-center whitespace-nowrap">
                                             Chat Admin (WhatsApp)
                                        </a>
                                        <a href="#" className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-full font-bold hover:bg-white/10 transition text-center whitespace-nowrap">
                                             Petunjuk Arah
                                        </a>
                                    </div>
                                </div>
                            </section>
                        </main>

                        <footer className="py-16 text-center text-sm text-black dark:text-white/70">
                            Laravel v{laravelVersion} (PHP v{phpVersion})
                        </footer>
                    </div>
                </div>
            </div>
        </>
    );
}
