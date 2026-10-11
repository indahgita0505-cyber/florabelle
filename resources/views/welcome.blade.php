<!DOCTYPE html>
<html lang="id" class="scroll-smooth">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Florabelle.id — Rangkaian Bunga Terbaik untuk Setiap Momen Spesial | Palu</title>
    <meta name="description" content="Toko bunga online terpercaya di Kota Palu. Rangkaian bunga segar, dried flowers, dan custom bouquet dengan pengiriman cepat ke seluruh wilayah Palu.">

    <!-- Google Fonts: Inter & Playfair Display -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Playfair+Display:ital,wght@0,500;0,600;0,700;0,800;0,900;1,600&display=swap" rel="stylesheet">

    <!-- Vite Tailwind -->
    @vite(['resources/css/app.css', 'resources/js/app.jsx'])

    <style>
        :root {
            --brand-primary: #be526e;
            --brand-primary-hover: #a5445d;
            --brand-soft: #fae8ee;
            --brand-border: #f3ccd8;
            --text-dark: #2d2426;
            --text-muted: #7a6e71;
            --bg-cream: #fbf5f2;
        }
        body {
            font-family: 'Inter', system-ui, -apple-system, sans-serif;
            color: var(--text-dark);
            background-color: #ffffff;
        }
        .font-serif {
            font-family: 'Playfair Display', Georgia, serif;
        }
        .hero-banner-gradient {
            background: linear-gradient(105deg, #fbf4f1 0%, #faede8 45%, #f6e3de 100%);
        }
        .btn-brand-primary {
            background-color: var(--brand-primary);
            color: #ffffff;
            transition: all 0.25s ease;
        }
        .btn-brand-primary:hover {
            background-color: var(--brand-primary-hover);
            transform: translateY(-1px);
            box-shadow: 0 8px 20px rgba(190, 82, 110, 0.28);
        }
        .btn-brand-outline {
            border: 1px solid var(--brand-primary);
            color: var(--brand-primary);
            background-color: #ffffff;
            transition: all 0.25s ease;
        }
        .btn-brand-outline:hover {
            background-color: var(--brand-soft);
            color: var(--brand-primary-hover);
        }
        .nav-link-active {
            color: var(--brand-primary);
            position: relative;
        }
        .nav-link-active::after {
            content: '';
            position: absolute;
            bottom: -6px;
            left: 0;
            right: 0;
            height: 2.5px;
            background-color: var(--brand-primary);
            border-radius: 9999px;
        }
        /* Modal animation */
        #login-modal {
            transition: opacity 0.25s ease;
        }
        #modal-box {
            transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        }
    </style>
</head>
<body class="antialiased selection:bg-[#fae8ee] selection:text-[#b7526d]">

<!-- ====================================================
     MODAL LOGIN / DAFTAR UNTUK TAMU
===================================================== -->
<div id="login-modal" class="fixed inset-0 z-[100] flex items-center justify-center p-4 opacity-0 pointer-events-none" style="background: rgba(45, 36, 38, 0.5); backdrop-filter: blur(4px);">
    <div id="modal-box" class="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 text-center relative border border-[#f3ccd8]" style="transform: scale(0.92);">
        <!-- Close button -->
        <button onclick="closeModal()" class="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#fdf5f7] hover:bg-[#fae8ee] flex items-center justify-center text-[#7a6e71] hover:text-[#b7526d] transition">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
            </svg>
        </button>

        <div class="w-14 h-14 rounded-full bg-[#fae8ee] text-[#b7526d] flex items-center justify-center mx-auto mb-4">
            <svg class="w-7 h-7" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
            </svg>
        </div>
        <h3 class="text-xl font-bold text-[#2d2426] mb-2 font-serif">Mulai Belanja Bunga</h3>
        <p class="text-xs sm:text-sm text-[#7a6e71] mb-6 leading-relaxed">
            Daftar atau masuk ke akun Anda untuk memesan buket impian dengan kemudahan pelacakan pesanan.
        </p>

        <div class="space-y-2.5">
            <a href="{{ route('register') }}" class="btn-brand-primary block w-full py-3.5 rounded-full font-bold text-sm shadow-sm">
                Daftar Akun Baru
            </a>
            <a href="{{ route('login') }}" class="btn-brand-outline block w-full py-3 rounded-full font-semibold text-sm">
                Sudah punya akun? Masuk
            </a>
        </div>
    </div>
</div>

<!-- ====================================================
     1. NAVBAR UTAMA
===================================================== -->
<header class="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-[#f2e6e4] transition-all">
    <div class="max-w-7xl mx-auto px-5 lg:px-10 h-20 flex items-center justify-between gap-4">

        <!-- Logo & Brand (Matching "BungaKita" Aesthetic as Florabelle) -->
        <a href="{{ url('/') }}" class="flex items-center gap-3 group flex-shrink-0">
            <!-- Icon Bunga Teratai / Lotus -->
            <div class="w-10 h-10 rounded-full bg-[#fae8ee] flex items-center justify-center text-[#b7526d] transition-transform duration-300 group-hover:scale-105">
                <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M12 3c1.5 3 4 5 7 6-2 3-5 4-7 9-2-5-5-6-7-9 3-1 5.5-3 7-6z"/>
                    <path d="M12 18c2-2 5-3 8-2-1 3-3 5-6 6-1-1-1.5-2.5-2-4z"/>
                    <path d="M12 18c-2-2-5-3-8-2 1 3 3 5 6 6 1-1 1.5-2.5 2-4z"/>
                </svg>
            </div>
            <div>
                <span class="block text-xl font-bold font-serif text-[#2d2426] tracking-tight leading-none">Florabelle</span>
                <span class="block text-[10px] text-[#9c8e91] tracking-wider font-medium mt-1 uppercase">Fresh Flowers, Better Days</span>
            </div>
        </a>

        <!-- Center Nav Links (Desktop) -->
        <nav class="hidden md:flex items-center gap-8">
            <a href="{{ url('/') }}" class="text-sm font-semibold nav-link-active transition-colors">
                Beranda
            </a>
            <a href="{{ url('/products') }}" class="text-sm font-medium text-[#5f5255] hover:text-[#b7526d] transition-colors">
                Produk
            </a>
            <a href="#tentang" class="text-sm font-medium text-[#5f5255] hover:text-[#b7526d] transition-colors">
                Tentang Kami
            </a>
        </nav>

        <!-- Right Side: Search Bar, Cart, User / Auth -->
        <div class="flex items-center gap-3 sm:gap-4">
            <!-- Search Bar Input (Pill Shaped) -->
            <form action="{{ url('/products') }}" method="GET" class="relative hidden sm:block w-44 md:w-56 lg:w-64">
                <span class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#9c8e91]">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                    </svg>
                </span>
                <input
                    type="text"
                    name="search"
                    placeholder="Cari bunga, kategori..."
                    class="w-full pl-9 pr-4 py-2 bg-[#f8f3f2] text-xs text-[#2d2426] placeholder-[#9c8e91] rounded-full border-transparent focus:border-[#f3ccd8] focus:bg-white focus:ring-2 focus:ring-[#f3ccd8] transition-all outline-none"
                >
            </form>

            <!-- Cart Icon -->
            <a href="{{ route('cart.index') }}" class="relative p-2 text-[#4a3f42] hover:text-[#b7526d] hover:bg-[#fae8ee] rounded-full transition-colors" title="Keranjang Belanja">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
                </svg>
            </a>

            <!-- User Auth State -->
            @auth
                @php
                    $dashboardUrl = auth()->user()->role === 'admin' ? route('admin.dashboard') : route('dashboard');
                    $userRole = auth()->user()->role === 'admin' ? 'Admin' : 'Member';
                    $firstName = explode(' ', auth()->user()->name)[0] ?? 'User';
                @endphp
                <a href="{{ $dashboardUrl }}" class="inline-flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full bg-[#fae8ee] hover:bg-[#f3d3dc] text-[#b7526d] transition text-xs font-bold shadow-sm" title="Buka Dashboard">
                    <div class="w-6 h-6 rounded-full bg-[#b7526d] text-white flex items-center justify-center text-[10px] font-bold">
                        {{ strtoupper(substr($firstName, 0, 1)) }}
                    </div>
                    <span class="hidden sm:inline">{{ $firstName }}</span>
                    <span class="text-[9px] bg-white/70 px-1.5 py-0.5 rounded-full text-[#b7526d] uppercase">{{ $userRole }}</span>
                </a>
            @else
                <div class="flex items-center gap-1.5">
                    <a href="{{ route('login') }}" class="p-2 text-[#4a3f42] hover:text-[#b7526d] hover:bg-[#fae8ee] rounded-full transition-colors" title="Masuk / Daftar Akun">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                        </svg>
                    </a>
                    <a href="{{ route('login') }}" class="hidden lg:inline-block text-xs font-semibold text-[#5f5255] hover:text-[#b7526d] transition">
                        Masuk
                    </a>
                </div>
            @endauth
        </div>

    </div>
</header>

<main>

    <!-- ====================================================
         2. HERO SECTION (Identik dengan Gambar BungaKita)
    ===================================================== -->
    <section class="hero-banner-gradient relative overflow-hidden py-4 sm:py-5 lg:py-6">
        <div class="max-w-7xl mx-auto px-5 lg:px-10">
            <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">

                <!-- Teks Kiri (Kolom Teks & CTA - Lebih Ringkas & Presisi) -->
                <div class="lg:col-span-6 z-10 py-1 lg:py-2">

                    <!-- Badge: Toko Bunga Online -->
                    <div class="inline-flex items-center gap-1.5 bg-[#fae8ee] border border-[#f3ccd8] text-[#be526e] text-[11px] font-semibold px-3 py-1 rounded-full mb-3 shadow-xs">
                        <svg class="w-3.5 h-3.5 text-[#be526e]" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M7 7h.01M7 3h5a2 2 0 011.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z"/>
                        </svg>
                        <span>Toko Bunga Online</span>
                    </div>

                    <!-- Main Headline (Pas 2 Baris, Tidak Terpotong) -->
                    <h1 class="font-serif text-2xl sm:text-3xl lg:text-[2.15rem] xl:text-[2.4rem] font-bold text-[#2d2426] leading-[1.2] tracking-tight mb-3">
                        Rangkaian Bunga Terbaik<br>
                        untuk <span class="text-[#be526e] whitespace-nowrap">Setiap Momen Spesial</span>
                    </h1>

                    <!-- Subheadline Ringkas -->
                    <p class="text-[#7a6e71] text-xs sm:text-[13px] leading-relaxed mb-4 max-w-md">
                        Kami menyediakan berbagai pilihan bunga segar dengan kualitas terbaik, siap untuk membuat hari-harimu lebih bermakna.
                    </p>

                    <!-- Tombol Belanja Sekarang -->
                    <div class="flex items-center">
                        <a href="{{ url('/products') }}" class="btn-brand-primary inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5">
                            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
                            </svg>
                            <span>Belanja Sekarang</span>
                            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/>
                            </svg>
                        </a>
                    </div>

                </div>

                <!-- Gambar Kanan: Proporsional & Menyatu Mulus -->
                <div class="lg:col-span-6 relative flex justify-center lg:justify-end items-center">
                    <div class="relative w-full max-w-[460px] lg:max-w-[500px]">
                        <!-- Wrapper dengan mask gradien agar membaur mulus tanpa batas kaku -->
                        <div class="relative overflow-hidden" style="-webkit-mask-image: linear-gradient(to right, transparent 0%, rgba(0,0,0,0.15) 8%, rgba(0,0,0,0.85) 25%, black 45%); mask-image: linear-gradient(to right, transparent 0%, rgba(0,0,0,0.15) 8%, rgba(0,0,0,0.85) 25%, black 45%);">
                            <img
                                src="{{ asset('images/hero_bouquet.jpg') }}"
                                alt="Rangkaian Bunga Florabelle"
                                class="w-full h-[260px] sm:h-[300px] lg:h-[330px] object-cover object-center lg:object-[60%_35%] transform hover:scale-[1.02] transition-transform duration-700"
                            >
                            <!-- Lapisan gradien samping kiri agar menyatu sempurna ke kolom teks -->
                            <div class="absolute inset-y-0 left-0 w-28 sm:w-36 bg-gradient-to-r from-[#faede8] via-[#faede8]/60 to-transparent pointer-events-none"></div>
                            <!-- Lapisan gradien atas & bawah agar membaur lembut ke background banner -->
                            <div class="absolute top-0 inset-x-0 h-10 bg-gradient-to-b from-[#fbf4f1] via-[#fbf4f1]/50 to-transparent pointer-events-none"></div>
                            <div class="absolute bottom-0 inset-x-0 h-12 bg-gradient-to-t from-[#f6e3de] via-[#f6e3de]/60 to-transparent pointer-events-none"></div>
                        </div>
                    </div>
                </div>

            </div>

            <!-- Slider Indicator Dots (3 Titik Posisi Tengah Bawah Sesuai Gambar) -->
            <div class="flex items-center justify-center gap-1.5 pt-3 pb-1">
                <span class="w-5 h-1.5 rounded-full bg-[#be526e] transition-all"></span>
                <span class="w-1.5 h-1.5 rounded-full bg-white border border-[#f3ccd8] transition-all shadow-xs"></span>
                <span class="w-1.5 h-1.5 rounded-full bg-white border border-[#f3ccd8] transition-all shadow-xs"></span>
            </div>
        </div>
    </section>

    <!-- ====================================================
         3. VALUE PROPOSITION / FEATURE STRIP (4 Fitur)
    ===================================================== -->
    <section class="border-y border-[#f0e4e2] bg-white py-8 px-5 lg:px-10">
        <div class="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8">

            <!-- 1. Pengiriman Cepat -->
            <div class="flex items-center gap-3.5">
                <div class="w-12 h-12 rounded-full bg-[#fae8ee] flex-shrink-0 flex items-center justify-center text-[#b7526d]">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0"/>
                    </svg>
                </div>
                <div>
                    <h4 class="text-xs sm:text-sm font-bold text-[#2d2426]">Pengiriman Cepat</h4>
                    <p class="text-[11px] sm:text-xs text-[#7a6e71] mt-0.5 leading-snug">Sampai di hari yang sama (area tertentu)</p>
                </div>
            </div>

            <!-- 2. Bunga Segar -->
            <div class="flex items-center gap-3.5">
                <div class="w-12 h-12 rounded-full bg-[#fae8ee] flex-shrink-0 flex items-center justify-center text-[#b7526d]">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
                    </svg>
                </div>
                <div>
                    <h4 class="text-xs sm:text-sm font-bold text-[#2d2426]">Bunga Segar</h4>
                    <p class="text-[11px] sm:text-xs text-[#7a6e71] mt-0.5 leading-snug">Dari petani langsung ke tangan Anda</p>
                </div>
            </div>

            <!-- 3. Harga Terjangkau -->
            <div class="flex items-center gap-3.5">
                <div class="w-12 h-12 rounded-full bg-[#fae8ee] flex-shrink-0 flex items-center justify-center text-[#b7526d]">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/>
                    </svg>
                </div>
                <div>
                    <h4 class="text-xs sm:text-sm font-bold text-[#2d2426]">Harga Terjangkau</h4>
                    <p class="text-[11px] sm:text-xs text-[#7a6e71] mt-0.5 leading-snug">Kualitas premium dengan harga terbaik</p>
                </div>
            </div>

            <!-- 4. Layanan Pelanggan -->
            <div class="flex items-center gap-3.5">
                <div class="w-12 h-12 rounded-full bg-[#fae8ee] flex-shrink-0 flex items-center justify-center text-[#b7526d]">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                    </svg>
                </div>
                <div>
                    <h4 class="text-xs sm:text-sm font-bold text-[#2d2426]">Layanan Pelanggan</h4>
                    <p class="text-[11px] sm:text-xs text-[#7a6e71] mt-0.5 leading-snug">Siap membantu setiap hari</p>
                </div>
            </div>

        </div>
    </section>

    <!-- ====================================================
         4. PRODUK POPULER (5 Kolom Sesuai Mockup)
    ===================================================== -->
    <section class="py-14 lg:py-20 px-5 lg:px-10 bg-white" id="produk">
        <div class="max-w-7xl mx-auto">

            <!-- Header Section -->
            <div class="flex items-end justify-between mb-8 pb-3 border-b border-[#f5ecea]">
                <div>
                    <h2 class="text-2xl sm:text-3xl font-bold font-serif text-[#2d2426]">Produk Populer</h2>
                    <p class="text-xs sm:text-sm text-[#7a6e71] mt-1">Pilihan terbaik untuk berbagai momen spesial</p>
                </div>
                <a href="{{ url('/products') }}" class="text-xs sm:text-sm font-bold text-[#b7526d] hover:text-[#9f435c] flex items-center gap-1 transition-colors group">
                    <span>Lihat Semua</span>
                    <span class="group-hover:translate-x-1 transition-transform">→</span>
                </a>
            </div>

            <!-- Product Cards Grid: 5 Kolom di Layar Besar Sesuai Gambar -->
            <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-5">

                @php
                // Image curated sesuai referensi bunga (mawar merah, mawar pink, matahari, lily, mix bouquet)
                $curatedImages = [
                    'https://images.unsplash.com/photo-1561181286-d3fee7d55364?auto=format&fit=crop&w=500&q=80', // Buket Mawar Merah/Pink
                    'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&w=500&q=80', // Anggrek / Hydrangea
                    'https://images.unsplash.com/photo-1597848212624-a19eb35e2651?auto=format&fit=crop&w=500&q=80', // Sunflower / Matahari
                    'https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?auto=format&fit=crop&w=500&q=80', // Lily / Tulip
                    'https://images.unsplash.com/photo-1563241527-3004b7be0ffd?auto=format&fit=crop&w=500&q=80', // Hand Bouquet Mix
                    'https://images.unsplash.com/photo-1549007994-cb92caebd54b?auto=format&fit=crop&w=500&q=80', // Cokelat
                    'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=500&q=80', // Greeting Card
                ];
                $popularDisplay = $products->take(5);
                @endphp

                @forelse($popularDisplay as $index => $p)
                @php
                    $img = $p->image_url ?: ($p->image ?: $curatedImages[$index % count($curatedImages)]);
                    $badgeText = $index === 0 ? 'Terlaris' : ($index === 1 ? 'Favorit' : ($index === 2 ? 'Populer' : 'New'));
                @endphp
                <div class="bg-white rounded-2xl border border-[#f0e4e2] overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col group">

                    <!-- Foto Produk Container -->
                    <div class="relative w-full aspect-square bg-[#f9f5f4] overflow-hidden flex items-center justify-center p-3">
                        <!-- Badge "Terlaris" (Pill Tag Sesuai Gambar) -->
                        <span class="bg-[#b7526d] text-white text-[10px] font-bold px-2 py-0.5 rounded-full absolute top-2.5 left-2.5 z-10 shadow-sm">
                            {{ $badgeText }}
                        </span>

                        <img
                            src="{{ $img }}"
                            alt="{{ $p->name }}"
                            class="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-500"
                            loading="lazy"
                            onerror="this.src='{{ $curatedImages[0] }}'"
                        >
                    </div>

                    <!-- Informasi Produk -->
                    <div class="p-3.5 flex flex-col flex-grow justify-between bg-white">
                        <h3 class="text-xs sm:text-sm font-semibold text-[#2d2426] line-clamp-1 mb-2" title="{{ $p->name }}">
                            {{ $p->name }}
                        </h3>

                        <div class="flex items-center justify-between gap-2 pt-1 border-t border-[#f9f2f0]">
                            <span class="text-xs sm:text-sm font-bold text-[#b7526d]">
                                Rp {{ number_format($p->price, 0, ',', '.') }}
                            </span>

                            @if(!auth()->check() || auth()->user()->role !== 'admin')
                            <div class="flex items-center gap-1.5">
                                <!-- Tombol Keranjang -->
                                <button
                                    type="button"
                                    onclick="handleAddToCart({{ $p->id }})"
                                    class="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#fdeef1] hover:bg-[#b7526d] text-[#b7526d] hover:text-white flex items-center justify-center border border-[#f5ccd5] shadow-2xs transition-all duration-200 active:scale-90"
                                    title="Tambah ke Keranjang"
                                >
                                    <svg class="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
                                    </svg>
                                </button>
                                <!-- Tombol Beli -->
                                <button
                                    type="button"
                                    onclick="handleBeliDirect({{ $p->id }})"
                                    class="px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full bg-[#b7526d] hover:bg-[#9f435c] text-white text-[11px] sm:text-xs font-bold shadow-sm transition-all duration-200 active:scale-95"
                                    title="Beli Sekarang"
                                >
                                    Beli
                                </button>
                            </div>
                            @endif
                        </div>
                    </div>

                </div>
                @empty
                <div class="col-span-full text-center py-10 bg-[#fbf5f2] rounded-2xl">
                    <p class="text-xs font-semibold text-[#7a6e71]">Belum ada produk aktif saat ini.</p>
                </div>
                @endforelse

            </div>

        </div>
    </section>

    <!-- ====================================================
         5. FITUR CUSTOM BOUQUET (Fitur Unggulan Florabelle)
    ===================================================== -->
    <section class="py-14 px-5 lg:px-10 bg-[#fbf5f2]">
        <div class="max-w-7xl mx-auto rounded-3xl bg-white p-8 lg:p-12 border border-[#f0e4e2] shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div class="lg:col-span-7">
                <span class="inline-block text-xs font-bold text-[#b7526d] bg-[#fae8ee] border border-[#f3ccd8] px-3.5 py-1.5 rounded-full mb-4">
                    ✨ Desain Kustom Sesukamu
                </span>
                <h2 class="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#2d2426] mb-3 leading-snug">
                    Ingin Buket Spesial Sesuai Keinginan & Budget Anda?
                </h2>
                <p class="text-[#7a6e71] text-xs sm:text-sm leading-relaxed mb-6">
                    Pilih bunga favorit, tentukan kombinasi warna kertas wrapping, jenis pita, serta sertakan kartu ucapan dengan pesan tulus Anda secara gratis. Florist kami siap merangkainya di Palu.
                </p>

                <div class="flex flex-wrap items-center gap-3">
                    <a href="{{ route('custom.index') }}" class="btn-brand-primary inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs sm:text-sm font-bold shadow-md">
                        <span>💐 Mulai Desain Buket Custom</span>
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/>
                        </svg>
                    </a>
                    <a href="https://wa.me/6281234567890?text=Halo%20Florabelle.id,%20saya%20mau%20konsultasi%20custom%20buket" target="_blank" class="btn-brand-outline inline-flex items-center gap-2 px-5 py-3 rounded-full text-xs sm:text-sm font-semibold">
                        <span>Konsultasi via WhatsApp</span>
                    </a>
                </div>
            </div>

            <div class="lg:col-span-5 grid grid-cols-2 gap-3.5">
                <div class="aspect-square rounded-2xl overflow-hidden shadow-sm border-2 border-white">
                    <img src="https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&w=400&q=80" alt="Buket Bunga Kustom" class="w-full h-full object-cover">
                </div>
                <div class="aspect-square rounded-2xl overflow-hidden shadow-sm border-2 border-white mt-4">
                    <img src="https://images.unsplash.com/photo-1597848212624-a19eb35e2651?auto=format&fit=crop&w=400&q=80" alt="Buket Sunflower" class="w-full h-full object-cover">
                </div>
            </div>

        </div>
    </section>

    <!-- ====================================================
         6. SECTION TENTANG KAMI & RESELLER
    ===================================================== -->
    <section id="tentang" class="py-14 lg:py-20 px-5 lg:px-10 bg-white">
        <div class="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

            <div>
                <span class="inline-block text-xs font-bold text-[#b7526d] bg-[#fae8ee] border border-[#f3ccd8] px-3.5 py-1.5 rounded-full mb-4">
                    🌿 Tentang Florabelle.id
                </span>
                <h2 class="font-serif text-2xl sm:text-3xl font-bold text-[#2d2426] mb-4 leading-snug">
                    Rangkaian Bunga Segar Pilihan di Kota Palu
                </h2>
                <p class="text-[#7a6e71] text-xs sm:text-sm leading-relaxed mb-6">
                    Florabelle.id berdedikasi menghadirkan rangkaian bunga segar, dried flower, dan buket artificial terbaik untuk hari wisuda, pernikahan, ulang tahun, dan perayaan berharga lainnya di Kota Palu dan sekitarnya.
                </p>

                <div class="space-y-3.5" id="kontak">
                    <div class="flex items-start gap-3 p-3.5 rounded-xl bg-[#fbf5f2] border border-[#f0e4e2]">
                        <div class="w-8 h-8 rounded-full bg-[#fae8ee] text-[#b7526d] flex items-center justify-center flex-shrink-0 mt-0.5">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                                <path stroke-linecap="round" stroke-linejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                            </svg>
                        </div>
                        <div>
                            <p class="text-xs font-bold text-[#2d2426]">Lokasi Workshop Palu</p>
                            <p class="text-[11px] text-[#7a6e71] mt-0.5 leading-relaxed">
                                Samping Warung Makan Rivan, Jl. Dayodara – Jl. Meteorologi Blok B2, Kota Palu, Sulawesi Tengah
                            </p>
                        </div>
                    </div>

                    <div class="flex items-start gap-3 p-3.5 rounded-xl bg-[#fbf5f2] border border-[#f0e4e2]">
                        <div class="w-8 h-8 rounded-full bg-[#fae8ee] text-[#b7526d] flex items-center justify-center flex-shrink-0 mt-0.5">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                            </svg>
                        </div>
                        <div>
                            <p class="text-xs font-bold text-[#2d2426]">WhatsApp & Fast Response</p>
                            <p class="text-[11px] text-[#7a6e71] mt-0.5 leading-relaxed">+62 812-3456-7890 (Setiap Hari 08.00 - 21.00 WITA)</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Reseller Card -->
            <div class="bg-[#fbf5f2] border border-[#f0e4e2] rounded-3xl p-8 text-center relative overflow-hidden">
                <span class="text-xs font-bold text-[#b7526d] uppercase tracking-wider block mb-2">Peluang Usaha Bersama</span>
                <h3 class="font-serif text-xl sm:text-2xl font-bold text-[#2d2426] mb-3">Program Reseller Bunga Palu</h3>
                <p class="text-xs sm:text-sm text-[#7a6e71] leading-relaxed mb-6 max-w-sm mx-auto">
                    Dapatkan suplai bunga segar berkualitas dengan harga grosir untuk usaha florist, EO, dan dekorasi Anda.
                </p>
                <div class="flex flex-col sm:flex-row items-center justify-center gap-3">
                    <a href="https://wa.me/6281234567890?text=Halo%20Florabelle.id,%20saya%20tertarik%20dengan%20program%20reseller" target="_blank" class="btn-brand-primary px-6 py-3 rounded-full text-xs font-bold shadow-sm w-full sm:w-auto">
                        Hubungi Tim Reseller
                    </a>
                    <a href="{{ route('register') }}" class="btn-brand-outline px-5 py-3 rounded-full text-xs font-semibold w-full sm:w-auto">
                        Daftar Akun
                    </a>
                </div>
            </div>

        </div>
    </section>

</main>

<!-- ====================================================
     7. FOOTER (Sesuai Gaya BungaKita: Bersih, Minimalis & Elegan)
===================================================== -->
<footer class="bg-[#fbedf1] border-t border-[#f2dde3] py-8 px-5 lg:px-10 text-[#7a6e71]">
    <div class="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
        
        <!-- Copyright & Brand & Store Info -->
        <div class="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
            <span class="font-bold text-[#2d2426]">Florabelle</span>
            <span class="hidden sm:inline">•</span>
            <span>📍 Beka, Jln Poros Palu - Bangga</span>
            <span class="hidden sm:inline">•</span>
            <span>📞 081234567890</span>
            <span class="hidden sm:inline">•</span>
            <span>© 2026. Semua hak dilindungi.</span>
        </div>

        <!-- Social Icons (Identik Gambar Kanan Bawah) -->
        <div class="flex items-center gap-4 text-[#b7526d]">
            <!-- Instagram -->
            <a href="https://instagram.com" target="_blank" class="hover:text-[#9f435c] transition-colors" title="Instagram">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.13-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
            </a>
            <!-- WhatsApp -->
            <a href="https://wa.me/6281234567890" target="_blank" class="hover:text-[#9f435c] transition-colors" title="WhatsApp">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                </svg>
            </a>
            <!-- TikTok -->
            <a href="https://tiktok.com" target="_blank" class="hover:text-[#9f435c] transition-colors" title="TikTok">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                </svg>
            </a>
            <!-- Facebook -->
            <a href="https://facebook.com" target="_blank" class="hover:text-[#9f435c] transition-colors" title="Facebook">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
            </a>
        </div>

    </div>
</footer>

<!-- Floating Toast Notification -->
<div id="floating-toast" class="fixed bottom-6 right-6 z-50 bg-[#2d2426]/95 backdrop-blur-md text-white px-5 py-3.5 rounded-2xl shadow-xl flex items-center gap-3 transition-all duration-300 transform translate-y-20 opacity-0 pointer-events-none">
    <div class="w-7 h-7 rounded-full bg-[#b7526d] flex items-center justify-center text-white shrink-0">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/>
        </svg>
    </div>
    <span id="toast-text" class="text-xs sm:text-sm font-semibold">Produk berhasil ditambahkan ke keranjang!</span>
    <a href="{{ route('cart.index') }}" class="text-xs bg-[#b7526d] hover:bg-[#9f435c] text-white font-bold px-3 py-1.5 rounded-xl transition whitespace-nowrap">
        Lihat Keranjang
    </a>
</div>

<!-- JavaScript Modal & Cart Handle -->
<script>
    const isLoggedIn = @json(auth()->check());
    const csrfToken = '{{ csrf_token() }}';

    function showToast(message) {
        const toast = document.getElementById('floating-toast');
        const text = document.getElementById('toast-text');
        if (!toast) return;
        if (text && message) text.textContent = message;
        toast.classList.remove('translate-y-20', 'opacity-0', 'pointer-events-none');
        toast.classList.add('translate-y-0', 'opacity-100', 'pointer-events-auto');
        
        setTimeout(() => {
            toast.classList.remove('translate-y-0', 'opacity-100', 'pointer-events-auto');
            toast.classList.add('translate-y-20', 'opacity-0', 'pointer-events-none');
        }, 3500);
    }

    function handleAddToCart(productId) {
        if (!isLoggedIn) {
            openModal();
            return;
        }

        fetch('{{ route("cart.store") }}', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': csrfToken,
                'Accept': 'application/json'
            },
            body: JSON.stringify({ product_id: productId, quantity: 1 })
        })
        .then(response => {
            if (response.ok) {
                showToast('Produk berhasil ditambahkan ke keranjang!');
            } else {
                window.location.href = '{{ route("cart.index") }}';
            }
        })
        .catch(() => {
            window.location.href = '{{ route("cart.index") }}';
        });
    }

    function handleBeliDirect(productId) {
        if (!isLoggedIn) {
            openModal();
            return;
        }

        fetch('{{ route("cart.store") }}', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': csrfToken,
                'Accept': 'application/json'
            },
            body: JSON.stringify({ product_id: productId, quantity: 1 })
        })
        .then(() => {
            window.location.href = '{{ route("checkout.index") }}';
        })
        .catch(() => {
            window.location.href = '{{ route("checkout.index") }}';
        });
    }

    function handleBeli(productId) {
        handleBeliDirect(productId);
    }

    function openModal() {
        const modal = document.getElementById('login-modal');
        const box   = document.getElementById('modal-box');
        if (!modal || !box) {
            window.location.href = '{{ route("login") }}';
            return;
        }
        modal.style.opacity = '1';
        modal.style.pointerEvents = 'all';
        box.style.transform = 'scale(1)';
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        const modal = document.getElementById('login-modal');
        const box   = document.getElementById('modal-box');
        if (!modal || !box) return;
        modal.style.opacity = '0';
        modal.style.pointerEvents = 'none';
        box.style.transform = 'scale(0.92)';
        document.body.style.overflow = '';
    }

    // Klik di luar modal = tutup
    document.getElementById('login-modal')?.addEventListener('click', function(e) {
        if (e.target === this) closeModal();
    });

    // Tutup modal dengan tombol Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') closeModal();
    });
</script>

</body>
</html>
