<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Florabelle.id Palu — Fresh, Dried & Artificial Flowers</title>
    <meta name="description" content="Toko bunga premium di Kota Palu. Tersedia fresh flowers, dried flowers, dan artificial flowers yang bisa dicustom sesuai budget. Pesan sekarang!">

    <!-- Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Playfair+Display:wght@400;700;900&display=swap" rel="stylesheet">

    <!-- Vite Tailwind -->
    @vite(['resources/css/app.css', 'resources/js/app.jsx'])

    <style>
        body { font-family: 'Inter', 'Segoe UI', sans-serif; }
        .font-serif { font-family: 'Playfair Display', Georgia, serif; }
        .hero-gradient {
            background: linear-gradient(135deg, #fff5f8 0%, #fdf2fb 30%, #f0f7ff 70%, #eef5ff 100%);
        }
        .card-hover { transition: transform 0.3s ease, box-shadow 0.3s ease; }
        .card-hover:hover { transform: translateY(-6px); box-shadow: 0 20px 40px rgba(244,114,182,0.15); }
        .btn-pink {
            background: linear-gradient(135deg, #f472b6 0%, #ec4899 100%);
            box-shadow: 0 6px 20px rgba(244,114,182,0.35);
            transition: all 0.2s ease;
        }
        .btn-pink:hover {
            background: linear-gradient(135deg, #ec4899 0%, #db2777 100%);
            box-shadow: 0 10px 28px rgba(244,114,182,0.50);
            transform: translateY(-2px);
        }
        .nav-link { transition: color 0.2s ease; }
        .nav-link:hover { color: #f472b6; }
        /* Modal animation */
        #login-modal { transition: opacity 0.3s ease; }
        #modal-box { transition: transform 0.3s ease; }
        .modal-open #login-modal { opacity: 1; pointer-events: all; }
        .modal-open #modal-box { transform: scale(1); }
        @keyframes float {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-12px); }
        }
        .float-anim { animation: float 4s ease-in-out infinite; }
        @keyframes float-delay {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-8px); }
        }
        .float-delay { animation: float-delay 5s ease-in-out 1s infinite; }
    </style>
</head>
<body class="bg-[#fdfbf9] text-slate-800 antialiased">

<!-- ====================================================
     LOGIN MODAL (Muncul jika belum login & klik Beli)
===================================================== -->
<div id="login-modal" class="fixed inset-0 z-[100] flex items-center justify-center p-4 opacity-0 pointer-events-none" style="background: rgba(15,15,30,0.55); backdrop-filter: blur(6px);">
    <div id="modal-box" class="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 text-center relative" style="transform: scale(0.85);">

        <!-- Close button -->
        <button onclick="closeModal()" class="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-pink-100 flex items-center justify-center text-slate-400 hover:text-pink-500 transition">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
            </svg>
        </button>

        <!-- Emoji & Judul -->
        <div class="w-16 h-16 rounded-full bg-pink-50 border-2 border-pink-200 flex items-center justify-center text-pink-500 mx-auto mb-5 shadow-sm">
            <svg class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
        </div>
        <h3 class="text-xl font-black text-slate-800 mb-3 font-serif leading-snug">
            Daftar Dulu, Yuk!
        </h3>
        <p class="text-sm text-slate-500 mb-6 leading-relaxed max-w-xs mx-auto">
            Yuk, <strong class="text-pink-600">Daftar Akun Pembeli</strong> terlebih dahulu untuk mulai memesan dan dapatkan 
            <span class="text-pink-500 font-bold">Diskon Member 10%</span> untuk pembelian pertama!
        </p>

        <!-- CTA Buttons -->
        <a href="{{ route('register') }}" class="btn-pink block w-full py-4 rounded-2xl text-white font-extrabold text-sm mb-3">
            Daftar Sekarang — Gratis!
        </a>
        <a href="{{ route('login') }}" class="block w-full py-3.5 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-pink-50 hover:border-pink-200 text-slate-600 hover:text-pink-600 font-semibold text-sm transition">
            Sudah punya akun? Masuk di sini →
        </a>

        <p class="text-[11px] text-slate-400 mt-4">Pendaftaran gratis & cepat, kurang dari 1 menit.</p>
    </div>
</div>

<!-- ====================================================
     1. NAVBAR ATAS
===================================================== -->
<nav class="sticky top-0 z-50 bg-white/85 backdrop-blur-lg border-b border-pink-100/70 shadow-sm">
    <div class="max-w-7xl mx-auto px-5 lg:px-10 py-4 flex items-center justify-between">

        <!-- Logo & Brand -->
        <a href="{{ url('/') }}" class="flex items-center gap-2.5">
            <div class="w-9 h-9 rounded-xl bg-gradient-to-br from-pink-400 to-rose-500 flex items-center justify-center text-lg shadow-md">
                <span class="text-white font-serif font-black">F</span>
            </div>
            <div>
                <span class="block text-base font-black text-slate-800 leading-none font-serif">Florabelle.id</span>
                <span class="block text-[10px] text-pink-500 font-semibold tracking-wider leading-none mt-0.5">PALU</span>
            </div>
        </a>

        <!-- Nav Links (Desktop) -->
        <div class="hidden md:flex items-center gap-8">
            <a href="{{ url('/products') }}" class="nav-link text-sm font-semibold text-slate-600">Katalog Bunga</a>
            <a href="#tentang" class="nav-link text-sm font-semibold text-slate-600">Tentang Kami</a>
            <a href="#reseller" class="nav-link text-sm font-semibold text-slate-600">Reseller</a>
        </div>

        <!-- CTA Buttons -->
        <div class="flex items-center gap-3">
            <a href="{{ route('login') }}" class="hidden sm:inline-flex text-sm font-semibold text-slate-600 hover:text-pink-500 transition px-4 py-2 rounded-xl hover:bg-pink-50">
                Masuk
            </a>
            <a href="{{ route('register') }}" class="btn-pink inline-flex items-center gap-2 text-white text-sm font-bold px-5 py-2.5 rounded-xl">
                <span>Daftar Akun</span>
                <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/>
                </svg>
            </a>
        </div>

    </div>
</nav>

<!-- ====================================================
     2. HERO SECTION
===================================================== -->
<section class="hero-gradient min-h-[90vh] flex items-center relative overflow-hidden">

    <!-- Background Decorations -->
    <div class="absolute top-20 right-10 w-72 h-72 bg-pink-200/30 rounded-full blur-3xl pointer-events-none"></div>
    <div class="absolute bottom-10 left-5 w-64 h-64 bg-blue-200/25 rounded-full blur-3xl pointer-events-none"></div>
    <div class="absolute top-1/2 left-1/3 w-48 h-48 bg-rose-100/40 rounded-full blur-2xl pointer-events-none"></div>

    <div class="max-w-7xl mx-auto px-5 lg:px-10 py-20 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center w-full">

        <!-- Teks Kiri -->
        <div class="relative z-10">
            <span class="inline-flex items-center gap-2 bg-white border border-pink-200 text-pink-600 text-xs font-bold px-4 py-2 rounded-full shadow-sm mb-6">
                <span class="w-2 h-2 rounded-full bg-pink-500 animate-pulse"></span>
                Toko Bunga Terpercaya di Kota Palu
            </span>

            <h1 class="font-serif text-4xl sm:text-5xl lg:text-[3.4rem] font-black text-slate-800 leading-[1.15] mb-6">
                Ungkapkan<br>
                <span class="text-pink-500">Perasaan Anda</span><br>
                Lewat Kesegaran<br class="hidden sm:block"> Bunga di Palu
            </h1>

            <p class="text-slate-500 text-base sm:text-lg leading-relaxed mb-8 max-w-md">
                Kami menyediakan <strong class="text-slate-700">Fresh Flowers</strong>, <strong class="text-slate-700">Dried Flowers</strong>, dan <strong class="text-slate-700">Artificial Flowers</strong> yang bisa dicustom sesuai tema, momen, dan budget Anda.
            </p>

            <!-- Tombol CTA -->
            <div class="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <a href="{{ url('/products') }}" class="btn-pink inline-flex items-center gap-2.5 text-white font-extrabold text-base px-8 py-4 rounded-2xl">
                    <span>Mulai Jelajahi Bunga</span>
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
                    </svg>
                </a>
                <a href="#produk" class="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-pink-500 transition">
                    <span>Lihat Preview Produk</span>
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/>
                    </svg>
                </a>
            </div>

            <!-- Trust Badges -->
            <div class="flex flex-wrap items-center gap-5 mt-10 pt-8 border-t border-slate-100">
                <div class="flex items-center gap-2 text-xs text-slate-500">
                    <svg class="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                    <span><strong class="text-slate-700">4.9/5</strong> Rating Pelanggan</span>
                </div>
                <div class="flex items-center gap-2 text-xs text-slate-500">
                    <svg class="w-5 h-5 text-pink-500" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd" /></svg>
                    <span><strong class="text-slate-700">500+</strong> Buket Terkirim</span>
                </div>
                <div class="flex items-center gap-2 text-xs text-slate-500">
                    <svg class="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20"><path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" /><path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H14a1 1 0 001-1v-4.15l1.65-2.2a1 1 0 00.19-.38l1-3A1 1 0 0016.9 4H3zm13.14 7l-1-3H13v3h3.14z" /></svg>
                    <span><strong class="text-slate-700">Grab Express</strong> Palu</span>
                </div>
            </div>
        </div>

        <!-- Visual Kanan: Hero Images -->
        <div class="relative hidden lg:flex items-center justify-center w-full min-h-[500px]">
            <!-- Gambar Utama -->
            <div class="absolute right-2 top-0 w-[320px] h-[420px] rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white z-10 float-anim">
                <img src="https://images.unsplash.com/photo-1561181286-d3fee7d55364?auto=format&fit=crop&w=600&q=80" alt="Buket Florabelle" class="w-full h-full object-cover">
            </div>

            <!-- Gambar Kecil -->
            <div class="absolute left-4 bottom-4 w-[240px] h-[260px] rounded-[2rem] overflow-hidden shadow-xl border-4 border-white z-20 float-delay">
                <img src="https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&w=400&q=80" alt="Buket Orchid" class="w-full h-full object-cover">
            </div>

            <!-- Badge Promo -->
            <div class="absolute -right-4 bottom-16 bg-gradient-to-br from-pink-500 to-rose-600 rounded-2xl shadow-xl px-5 py-4 text-white text-center z-30 float-anim" style="animation-delay: 1.5s;">
                <p class="text-[10px] font-bold uppercase tracking-widest mb-1 opacity-90">Member Baru</p>
                <p class="text-2xl font-black mb-1">10% OFF</p>
                <p class="text-[10px] opacity-90">Untuk order pertama</p>
            </div>
        </div>

    </div>
</section>

<!-- ====================================================
     3. PRODUCT PREVIEW GRID
===================================================== -->
<section id="produk" class="py-20 px-5 lg:px-10 bg-white">
    <div class="max-w-7xl mx-auto">

        <!-- Section Header -->
        <div class="text-center mb-12">
            <span class="inline-block bg-pink-50 text-pink-600 text-xs font-bold px-4 py-2 rounded-full border border-pink-200 mb-4">
                Preview Koleksi Terbaru
            </span>
            <h2 class="font-serif text-3xl sm:text-4xl font-black text-slate-800 mb-3">Temukan Buket Impianmu</h2>
            <p class="text-slate-400 text-base max-w-lg mx-auto">
                Setiap buket dirangkai dengan penuh cinta oleh florist berpengalaman kami. Custom warna, ukuran, dan pesan ucapan gratis!
            </p>
        </div>

        <!-- Grid Produk -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

            @php
            $products = [
                [
                    'name'     => 'Blushing Romance Roses',
                    'category' => 'Fresh Flowers',
                    'price'    => 'Rp 245.000',
                    'rating'   => 4.9,
                    'sold'     => '128 terjual',
                    'badge'    => 'Best Seller',
                    'badge_color' => 'bg-pink-500',
                    'img'      => 'https://images.unsplash.com/photo-1561181286-d3fee7d55364?auto=format&fit=crop&w=400&q=80',
                ],
                [
                    'name'     => 'Pastel Hydrangea Bouquet',
                    'category' => 'Korean Style',
                    'price'    => 'Rp 185.000',
                    'rating'   => 4.8,
                    'sold'     => '93 terjual',
                    'badge'    => 'Favorit',
                    'badge_color' => 'bg-purple-500',
                    'img'      => 'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&w=400&q=80',
                ],
                [
                    'name'     => 'Sunflower Rustic Bundle',
                    'category' => 'Dried Flowers',
                    'price'    => 'Rp 210.000',
                    'rating'   => 4.7,
                    'sold'     => '67 terjual',
                    'badge'    => 'Baru',
                    'badge_color' => 'bg-amber-500',
                    'img'      => 'https://images.unsplash.com/photo-1597848212624-a19eb35e2651?auto=format&fit=crop&w=400&q=80',
                ],
                [
                    'name'     => 'White Orchid Premium Box',
                    'category' => 'Artificial Flowers',
                    'price'    => 'Rp 320.000',
                    'rating'   => 5.0,
                    'sold'     => '44 terjual',
                    'badge'    => 'Premium',
                    'badge_color' => 'bg-blue-500',
                    'img'      => 'https://images.unsplash.com/photo-1490750967868-88df5691cc16?auto=format&fit=crop&w=400&q=80',
                ],
            ];
            @endphp

            @foreach($products as $i => $p)
            <div class="card-hover bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden group" style="animation-delay: {{ $i * 0.1 }}s;">

                <!-- Foto Produk -->
                <div class="relative w-full h-52 overflow-hidden bg-pink-50">
                    <img src="{{ $p['img'] }}" alt="{{ $p['name'] }}" class="w-full h-full object-cover group-hover:scale-105 transition duration-500">
                    <!-- Badge -->
                    <span class="absolute top-3 left-3 {{ $p['badge_color'] }} text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full shadow">
                        {{ $p['badge'] }}
                    </span>
                    <!-- Wishlist -->
                    <button class="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 hover:bg-pink-50 flex items-center justify-center text-slate-400 hover:text-pink-500 shadow transition">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                        </svg>
                    </button>
                </div>

                <!-- Info Produk -->
                <div class="p-5">
                    <span class="text-[10px] font-bold text-blue-500 uppercase tracking-wider">{{ $p['category'] }}</span>
                    <h3 class="text-sm font-extrabold text-slate-800 mt-1 mb-2 line-clamp-1">{{ $p['name'] }}</h3>

                    <!-- Rating & Sold -->
                    <div class="flex items-center gap-2 mb-3">
                        <div class="flex items-center gap-0.5">
                            @for($s = 0; $s < 5; $s++)
                            <svg class="w-3 h-3 {{ $s < floor($p['rating']) ? 'text-yellow-400' : 'text-slate-200' }}" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                            </svg>
                            @endfor
                        </div>
                        <span class="text-[10px] font-bold text-slate-500">{{ $p['rating'] }}</span>
                        <span class="text-[10px] text-slate-400">· {{ $p['sold'] }}</span>
                    </div>

                    <div class="flex items-center justify-between">
                        <span class="text-base font-black text-pink-500">{{ $p['price'] }}</span>
                        <!-- Tombol Beli Sekarang — Trigger Modal jika belum login -->
                        <button
                            onclick="handleBeli()"
                            class="flex items-center gap-1.5 bg-pink-50 hover:bg-pink-100 text-pink-600 text-xs font-bold px-3.5 py-2 rounded-xl transition active:scale-95"
                        >
                            <span>Beli</span>
                            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
                            </svg>
                        </button>
                    </div>
                </div>

            </div>
            @endforeach

        </div>

        <!-- Lihat Semua Produk Button -->
        <div class="text-center mt-10">
            <a href="{{ url('/products') }}" class="inline-flex items-center gap-2 px-8 py-4 rounded-2xl border-2 border-pink-200 text-pink-600 font-bold text-sm hover:bg-pink-50 transition">
                <span>Lihat Semua Koleksi Bunga</span>
                <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
                </svg>
            </a>
        </div>

    </div>
</section>

<!-- ====================================================
     SECTION TENTANG KAMI
===================================================== -->
<section id="tentang" class="py-20 px-5 lg:px-10" style="background: linear-gradient(135deg, #fff5f8 0%, #f0f7ff 100%);">
    <div class="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

        <div>
            <span class="inline-block text-xs font-bold text-pink-600 bg-pink-50 border border-pink-200 px-4 py-2 rounded-full mb-5">🌿 Tentang Florabelle.id</span>
            <h2 class="font-serif text-3xl sm:text-4xl font-black text-slate-800 mb-5 leading-tight">
                Bunga yang Dirangkai<br>dengan Sepenuh Hati
            </h2>
            <p class="text-slate-500 text-base leading-relaxed mb-6">
                Florabelle.id Palu hadir sebagai solusi kebutuhan bunga Anda di Kota Palu. Dari bunga wisuda hingga anniversary, kami melayani setiap momen spesial Anda dengan sentuhan estetika yang tak terlupakan.
            </p>
        <div class="space-y-4">
                @php
                $fitur = [
                    [
                        'icon' => '<svg class="w-6 h-6 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09l2.846.813-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z"/></svg>',
                        'judul' => 'Fresh, Dried & Artificial', 
                        'deskripsi' => 'Pilihan lengkap bunga segar, kering, dan artificial untuk berbagai selera dan budget.'
                    ],
                    [
                        'icon' => '<svg class="w-6 h-6 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M21 11.25v8.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 109.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1114.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"/></svg>', 
                        'judul' => 'Custom Sesuai Budget', 
                        'deskripsi' => 'Customisasi kertas bungkus, pita, warna, dan pesan ucapan gratis setiap pesanan.'
                    ],
                    [
                        'icon' => '<svg class="w-6 h-6 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12"/></svg>', 
                        'judul' => 'Pengiriman Cepat Grab Palu', 
                        'deskripsi' => 'Bunga sampai dalam 30–60 menit ke seluruh wilayah Kota Palu via Grab Express.'
                    ],
                ];
                @endphp
                @foreach($fitur as $f)
                <div class="flex gap-4 p-4 bg-white rounded-2xl border border-slate-100 shadow-sm items-start">
                    <div class="flex-shrink-0 mt-1 w-10 h-10 rounded-full bg-pink-50 flex items-center justify-center">
                        {!! $f['icon'] !!}
                    </div>
                    <div>
                        <p class="text-sm font-bold text-slate-800">{{ $f['judul'] }}</p>
                        <p class="text-xs text-slate-500 mt-0.5 leading-relaxed">{{ $f['deskripsi'] }}</p>
                    </div>
                </div>
                @endforeach
            </div>
        </div>

        <!-- Foto Galeri -->
        <div class="grid grid-cols-2 gap-4">
            <div class="space-y-4">
                <div class="h-52 rounded-3xl overflow-hidden shadow-md border border-pink-100">
                    <img src="https://images.unsplash.com/photo-1563241527-3004b7be0ffd?w=600&q=80" alt="Florist arranging flowers" class="w-full h-full object-cover">
                </div>
                <div class="h-36 rounded-3xl overflow-hidden shadow-md border border-blue-100">
                    <img src="https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?w=400&q=80" alt="Aesthetic flowers" class="w-full h-full object-cover">
                </div>
            </div>
            <div class="space-y-4 mt-8">
                <div class="h-36 rounded-3xl overflow-hidden shadow-md border border-pink-100">
                    <img src="https://images.unsplash.com/photo-1525310072745-f49212b5ac6d?w=400&q=80" alt="Flower shop" class="w-full h-full object-cover">
                </div>
                <div class="h-52 rounded-3xl overflow-hidden shadow-md border border-blue-100">
                    <img src="https://images.unsplash.com/photo-1596438459194-f28efe8a6bc8?w=600&q=80" alt="Beautiful bouquet" class="w-full h-full object-cover">
                </div>
            </div>
        </div>

    </div>
</section>

<!-- ====================================================
     SECTION RESELLER GROSIR
===================================================== -->
<section id="reseller" class="py-16 px-5 lg:px-10" style="background: linear-gradient(135deg, #f0f9ff 0%, #e8f4fd 100%);">
    <div class="max-w-5xl mx-auto text-center">
        <span class="inline-block text-xs font-bold text-blue-600 bg-blue-50 border border-blue-200 px-4 py-2 rounded-full mb-5">Peluang Usaha Bersama</span>
        <h2 class="font-serif text-2xl sm:text-3xl font-black text-slate-800 mb-4">Bergabung Jadi Reseller Grosir Bunga Florabelle</h2>
        <p class="text-slate-500 text-base leading-relaxed mb-8 max-w-2xl mx-auto">
            Dapatkan <strong class="text-blue-600">bunga potong segar dengan harga grosir murah</strong> untuk kebutuhan toko bunga, event organizer, wedding planner, atau usaha dekorasi Anda di Kota Palu dan sekitarnya.
        </p>
        <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="https://wa.me/6281234567890?text=Halo Florabelle.id Palu, saya ingin informasi tentang program reseller grosir bunga" target="_blank" class="btn-pink inline-flex items-center gap-2 text-white font-bold px-8 py-4 rounded-2xl">
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                <span>Chat WhatsApp Sekarang</span>
            </a>
            <div class="text-sm text-slate-400 font-medium">atau</div>
            <a href="{{ route('register') }}" class="inline-flex items-center gap-2 text-blue-600 font-bold text-sm border-2 border-blue-200 hover:bg-blue-50 px-6 py-3.5 rounded-2xl transition">
                <span>Daftar Akun Reseller</span>
            </a>
        </div>
    </div>
</section>

<!-- ====================================================
     4. FOOTER
===================================================== -->
<footer class="bg-slate-900 text-slate-300 py-14 px-5 lg:px-10">
    <div class="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">

        <!-- Brand & Alamat -->
        <div>
            <div class="flex items-center gap-2.5 mb-4">
                <div class="w-9 h-9 rounded-xl bg-gradient-to-br from-pink-400 to-rose-500 flex items-center justify-center text-xl shadow">
                    <span class="text-white font-serif font-black">F</span>
                </div>
                <div>
                    <span class="block text-base font-black text-white font-serif">Florabelle.id</span>
                    <span class="block text-[10px] text-pink-400 font-semibold tracking-wider">PALU</span>
                </div>
            </div>
            <p class="text-sm text-slate-400 leading-relaxed mb-4">
                Toko bunga premium di Kota Palu yang melayani fresh flowers, dried flowers, dan artificial flowers untuk setiap momen spesial Anda.
            </p>
            <div class="flex items-start gap-2.5 text-sm text-slate-400">
                <svg class="w-4 h-4 text-pink-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
                <span class="leading-relaxed">Samping Warung Makan Rivan, Jl. Dayodara – Jl. Meteorologi Blok B2, Kota Palu, Sulawesi Tengah</span>
            </div>
        </div>

        <!-- Menu Links -->
        <div>
            <h4 class="text-sm font-extrabold text-white uppercase tracking-widest mb-5">Menu Cepat</h4>
            <ul class="space-y-3">
                <li><a href="{{ url('/products') }}" class="text-sm text-slate-400 hover:text-pink-400 transition">Katalog Bunga</a></li>
                <li><a href="{{ route('login') }}" class="text-sm text-slate-400 hover:text-pink-400 transition">Masuk ke Akun</a></li>
                <li><a href="{{ route('register') }}" class="text-sm text-slate-400 hover:text-pink-400 transition">Daftar Akun Baru</a></li>
                <li><a href="#reseller" class="text-sm text-slate-400 hover:text-pink-400 transition">Program Reseller</a></li>
                <li><a href="#tentang" class="text-sm text-slate-400 hover:text-pink-400 transition">Tentang Kami</a></li>
            </ul>
        </div>

        <!-- Jam Operasional & Kontak -->
        <div>
            <h4 class="text-sm font-extrabold text-white uppercase tracking-widest mb-5">Hubungi Kami</h4>
            <div class="space-y-4">
                <div class="flex items-center gap-3">
                    <div class="w-8 h-8 rounded-lg bg-green-900/50 flex items-center justify-center text-green-400">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                    </div>
                    <div>
                        <p class="text-xs font-semibold text-white">WhatsApp</p>
                        <p class="text-xs text-slate-400">+62 812-3456-7890</p>
                    </div>
                </div>
                <div class="flex items-center gap-3">
                    <div class="w-8 h-8 rounded-lg bg-pink-900/50 flex items-center justify-center text-pink-400">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path stroke-linecap="round" stroke-linejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    </div>
                    <div>
                        <p class="text-xs font-semibold text-white">Instagram</p>
                        <p class="text-xs text-slate-400">@florabelle.palu</p>
                    </div>
                </div>
                <div class="flex items-center gap-3">
                    <div class="w-8 h-8 rounded-lg bg-blue-900/50 flex items-center justify-center text-blue-400">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </div>
                    <div>
                        <p class="text-xs font-semibold text-white">Jam Operasional</p>
                        <p class="text-xs text-slate-400">Senin – Minggu: 08.00 – 21.00 WITA</p>
                    </div>
                </div>
            </div>
        </div>

    </div>

    <div class="max-w-7xl mx-auto mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p class="text-xs text-slate-600">© 2026 Florabelle.id Palu · Dibuat dengan sepenuh hati di Kota Palu</p>
        <p class="text-xs text-slate-600">Fresh · Beautiful · Affordable</p>
    </div>
</footer>

<!-- ====================================================
     JAVASCRIPT
===================================================== -->
<script>
    // Cek apakah user sudah login (dari Laravel)
    const isLoggedIn = @json(auth()->check());

    /**
     * Handle klik tombol "Beli Sekarang"
     * Jika belum login → tampilkan modal
     * Jika sudah login → arahkan ke halaman keranjang/produk
     */
    function handleBeli() {
        if (!isLoggedIn) {
            openModal();
        } else {
            window.location.href = '/products';
        }
    }

    function openModal() {
        const modal = document.getElementById('login-modal');
        const box   = document.getElementById('modal-box');
        modal.style.opacity = '1';
        modal.style.pointerEvents = 'all';
        box.style.transform = 'scale(1)';
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        const modal = document.getElementById('login-modal');
        const box   = document.getElementById('modal-box');
        modal.style.opacity = '0';
        modal.style.pointerEvents = 'none';
        box.style.transform = 'scale(0.85)';
        document.body.style.overflow = '';
    }

    // Klik di luar modal = tutup
    document.getElementById('login-modal').addEventListener('click', function(e) {
        if (e.target === this) closeModal();
    });

    // Tutup modal dengan tombol Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') closeModal();
    });
</script>

</body>
</html>
