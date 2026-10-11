<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Katalog Bunga — Florabelle.id Palu</title>
    <meta name="description" content="Temukan koleksi lengkap buket bunga segar, kering, dan artificial terbaik di Kota Palu. Harga terjangkau, bisa custom sesuai budget.">

    <!-- Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Playfair+Display:wght@700;900&display=swap" rel="stylesheet">

    @vite(['resources/css/app.css', 'resources/js/app.jsx'])

    <style>
        body { font-family: 'Inter', 'Segoe UI', sans-serif; }
        .font-serif { font-family: 'Playfair Display', Georgia, serif; }

        .btn-pink {
            background: linear-gradient(135deg, #f472b6 0%, #ec4899 100%);
            box-shadow: 0 4px 14px rgba(244,114,182,0.35);
            transition: all 0.2s ease;
        }
        .btn-pink:hover {
            box-shadow: 0 8px 24px rgba(244,114,182,0.50);
            transform: translateY(-1px);
        }
        .btn-pink:active { transform: translateY(0); }

        .card-hover {
            transition: transform 0.28s ease, box-shadow 0.28s ease;
        }
        .card-hover:hover {
            transform: translateY(-6px);
            box-shadow: 0 20px 45px rgba(244,114,182,0.14), 0 6px 16px rgba(0,0,0,0.06);
        }

        /* Filter tab active */
        .filter-tab.active {
            background: linear-gradient(135deg, #f472b6, #ec4899);
            color: white;
            box-shadow: 0 4px 12px rgba(244,114,182,0.35);
        }

        /* Modal */
        #login-modal {
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.3s ease;
        }
        #login-modal.open {
            opacity: 1;
            pointer-events: all;
        }
        #modal-box {
            transform: scale(0.85) translateY(20px);
            transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        #login-modal.open #modal-box {
            transform: scale(1) translateY(0);
        }

        /* Scrollbar thin for filter row */
        .filter-scroll::-webkit-scrollbar { height: 0px; }

        @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(16px); }
            to   { opacity: 1; transform: translateY(0); }
        }
        .product-card { animation: fadeInUp 0.4s ease both; }
    </style>
</head>
<body class="bg-[#fdfbf9] text-slate-800 antialiased">

<!-- ====================================================
     MODAL LOGIN/DAFTAR (Pop-up saat klik Beli Sekarang)
===================================================== -->
<div id="login-modal" class="fixed inset-0 z-[100] flex items-center justify-center p-4" style="background: rgba(10,10,30,0.55); backdrop-filter: blur(8px);">
    <div id="modal-box" class="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 text-center relative">

        <!-- Tombol Close -->
        <button onclick="closeModal()" class="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-pink-100 flex items-center justify-center text-slate-400 hover:text-pink-500 transition-colors">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
            </svg>
        </button>

        <!-- Ikon & Judul -->
        <div class="w-20 h-20 rounded-full bg-gradient-to-br from-pink-100 to-rose-100 border-2 border-pink-200 flex items-center justify-center text-4xl mx-auto mb-5 shadow-sm">
            <svg class="w-8 h-8 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
        </div>
        <h3 class="text-xl font-black text-slate-800 mb-2 font-serif">Yuk, Buat Akun Pembeli Dulu!</h3>
        <p class="text-sm text-slate-500 leading-relaxed mb-6 max-w-xs mx-auto">
            Selangkah lagi untuk memesan buket cantik ini dan nikmati
            <span class="font-bold text-pink-500">diskon member 10%</span>
            untuk pesanan pertama Anda! 
        </p>

        <!-- Promo Badge -->
        <div class="bg-gradient-to-r from-pink-50 to-rose-50 border border-pink-200 rounded-2xl p-3 mb-6 flex items-center gap-3">
            <svg class="w-8 h-8 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
            <div class="text-left">
                <p class="text-xs font-extrabold text-pink-600 uppercase tracking-wider">Diskon Member Baru</p>
                <p class="text-xs text-slate-500">Gunakan kode <span class="font-mono font-bold text-pink-500">FLORA10</span> saat checkout</p>
            </div>
        </div>

        <!-- CTA Buttons -->
        <a href="{{ route('register') }}" class="btn-pink block w-full py-4 rounded-2xl text-white font-extrabold text-sm mb-3">
            <span class="text-white font-serif font-black">F</span> Daftar Akun Gratis — Sekarang!
        </a>
        <a href="{{ route('login') }}" class="block w-full py-3.5 rounded-2xl border border-slate-200 hover:border-pink-300 bg-slate-50 hover:bg-pink-50 text-slate-600 hover:text-pink-600 font-semibold text-sm transition-all">
            Sudah punya akun? Login di sini →
        </a>
        <p class="text-[11px] text-slate-400 mt-4">Daftar gratis, proses kurang dari 1 menit ✨</p>
    </div>
</div>

<!-- ====================================================
     1. NAVBAR ATAS (PUBLIK)
===================================================== -->
<nav class="sticky top-0 z-50 bg-white/90 backdrop-blur-lg border-b border-pink-100/60 shadow-sm">
    <div class="max-w-7xl mx-auto px-5 lg:px-10 py-4 flex items-center justify-between gap-4">

        <!-- Logo -->
        <a href="{{ url('/') }}" class="flex items-center gap-2.5 flex-shrink-0">
            <div class="w-9 h-9 rounded-xl bg-gradient-to-br from-pink-400 to-rose-500 flex items-center justify-center text-xl shadow-md"><span class="text-white font-serif font-black">F</span></div>
            <div class="leading-tight">
                <span class="block text-sm font-black text-slate-800 font-serif">Florabelle.id</span>
                <span class="block text-[10px] text-pink-500 font-bold tracking-widest uppercase">Palu</span>
            </div>
        </a>

        <!-- Nav Links (Desktop) -->
        <div class="hidden md:flex items-center gap-7">
            <a href="{{ url('/') }}" class="text-sm font-semibold text-slate-500 hover:text-pink-500 transition-colors">Beranda</a>
            <a href="{{ url('/products') }}" class="text-sm font-bold text-pink-500 border-b-2 border-pink-400 pb-0.5">Katalog</a>
            <a href="{{ url('/#tentang') }}" class="text-sm font-semibold text-slate-500 hover:text-pink-500 transition-colors">Tentang Kami</a>
        </div>

        <!-- CTA -->
        <div class="flex items-center gap-3">
            <a href="{{ route('login') }}" class="hidden sm:inline-block text-sm font-semibold text-slate-500 hover:text-pink-500 transition-colors px-3 py-2">
                Masuk
            </a>
            <a href="{{ route('register') }}" class="btn-pink inline-flex items-center gap-1.5 text-white text-sm font-bold px-5 py-2.5 rounded-xl">
                <span class="hidden sm:inline">Masuk / </span>Daftar
            </a>
        </div>
    </div>
</nav>

<!-- ====================================================
     PAGE HEADER
===================================================== -->
<div class="bg-gradient-to-r from-[#fff5f8] via-[#fdf2fb] to-[#f0f7ff] border-b border-pink-100/60">
    <div class="max-w-7xl mx-auto px-5 lg:px-10 py-10">
        <div class="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
                <span class="text-[11px] font-bold text-pink-500 uppercase tracking-widest mb-1 block"><svg class="w-8 h-8 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg> Koleksi Lengkap</span>
                <h1 class="text-2xl sm:text-3xl font-black text-slate-800 font-serif">Katalog Bunga Florabelle</h1>
                <p class="text-sm text-slate-500 mt-1">
                    Fresh · Dried · Artificial · Custom sesuai budget Anda
                </p>
            </div>
            <div class="flex items-center gap-2 text-xs text-slate-500 bg-white border border-pink-100 px-4 py-2 rounded-full shadow-sm">
                <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span><strong class="text-slate-700" id="product-count">{{ $products->count() > 0 ? $products->count() : 6 }}</strong> produk tersedia</span>
            </div>
        </div>
    </div>
</div>

<main class="max-w-7xl mx-auto px-5 lg:px-10 py-8">

    <!-- ====================================================
         2. AREA FILTER & PENCARIAN
    ===================================================== -->
    <form method="GET" action="{{ url('/products') }}" id="filter-form">
        <div class="flex flex-col lg:flex-row gap-4 mb-8">

            <!-- Search Box -->
            <div class="flex-1 relative">
                <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg class="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                    </svg>
                </div>
                <input
                    type="text"
                    name="search"
                    value="{{ $searchQuery }}"
                    placeholder="Cari buket bunga impianmu..."
                    class="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-slate-200 bg-white text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-pink-200 focus:border-pink-300 shadow-sm transition"
                    oninput="document.getElementById('filter-form').submit()"
                >
                @if($searchQuery)
                <a href="{{ url('/products') }}" class="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-pink-500">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
                    </svg>
                </a>
                @endif
            </div>

            <!-- Sort Dropdown -->
            <div class="flex-shrink-0">
                <select
                    name="sort"
                    onchange="document.getElementById('filter-form').submit()"
                    class="w-full sm:w-auto px-4 py-3.5 rounded-2xl border border-slate-200 bg-white text-sm text-slate-600 font-medium focus:outline-none focus:ring-2 focus:ring-pink-200 focus:border-pink-300 shadow-sm transition cursor-pointer appearance-none pr-10"
                    style="background-image: url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e\"); background-position: right 12px center; background-repeat: no-repeat; background-size: 18px;"
                >
                    <option value="newest" {{ $activeSort === 'newest' ? 'selected' : '' }}>Terbaru</option>
                    <option value="price_asc" {{ $activeSort === 'price_asc' ? 'selected' : '' }}>Harga Termurah</option>
                    <option value="price_desc" {{ $activeSort === 'price_desc' ? 'selected' : '' }}>Harga Termahal</option>
                </select>
                <input type="hidden" name="category" value="{{ $activeCategory }}">
            </div>
        </div>

        <!-- Filter Tab Kategori (Horizontal Scroll) -->
        <div class="filter-scroll flex gap-3 overflow-x-auto pb-2 mb-8">
            <a
                href="{{ url('/products?category=all'.($activeSort !== 'newest' ? '&sort='.$activeSort : '').($searchQuery ? '&search='.$searchQuery : '')) }}"
                class="filter-tab {{ $activeCategory === 'all' ? 'active' : 'bg-white border border-slate-200 text-slate-600 hover:border-pink-300 hover:text-pink-500' }} flex-shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-bold transition-all shadow-sm"
            >
                <span>Semua Bunga</span>
                <span class="text-[10px] font-extrabold {{ $activeCategory === 'all' ? 'bg-white/20' : 'bg-slate-100' }} px-2 py-0.5 rounded-full">
                    {{ $allProductsCount }}
                </span>
            </a>

            @foreach($categoriesFromDb as $cat)
            <a
                href="{{ url('/products?category='.$cat->slug.($activeSort !== 'newest' ? '&sort='.$activeSort : '').($searchQuery ? '&search='.$searchQuery : '')) }}"
                class="filter-tab {{ $activeCategory === $cat->slug ? 'active' : 'bg-white border border-slate-200 text-slate-600 hover:border-pink-300 hover:text-pink-500' }} flex-shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-bold transition-all shadow-sm"
            >
                <span>{{ $cat->name }}</span>
                @if($cat->products_count > 0)
                <span class="text-[10px] font-extrabold {{ $activeCategory === $cat->slug ? 'bg-white/20' : 'bg-slate-100' }} px-2 py-0.5 rounded-full">
                    {{ $cat->products_count }}
                </span>
                @endif
            </a>
            @endforeach
        </div>
    </form>

    <!-- ====================================================
         3. GRID PRODUK KATALOG
    ===================================================== -->
    @php
    // Data mockup fallback jika database kosong
    $mockProducts = [
        ['id'=>1,'name'=>'Blushing Rose Bouquet','category'=>'fresh','price'=>245000,'rating'=>4.9,'sold'=>128,'badge'=>'Best Seller','badge_color'=>'bg-pink-500','image'=>'https://images.unsplash.com/photo-1561181286-d3fee7d55364?auto=format&fit=crop&w=500&q=80'],
        ['id'=>2,'name'=>'Pastel Hydrangea Bundle','category'=>'fresh','price'=>185000,'rating'=>4.8,'sold'=>93,'badge'=>'Favorit','badge_color'=>'bg-purple-500','image'=>'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&w=500&q=80'],
        ['id'=>3,'name'=>'Rustic Lavender Set','category'=>'dried','price'=>210000,'rating'=>4.7,'sold'=>67,'badge'=>'New','badge_color'=>'bg-amber-500','image'=>'https://images.unsplash.com/photo-1597848212624-a19eb35e2651?auto=format&fit=crop&w=500&q=80'],
        ['id'=>4,'name'=>'White Orchid Premium Box','category'=>'artificial','price'=>320000,'rating'=>5.0,'sold'=>44,'badge'=>'Premium','badge_color'=>'bg-blue-500','image'=>'https://images.unsplash.com/photo-1490750967868-88df5691cc16?auto=format&fit=crop&w=500&q=80'],
        ['id'=>5,'name'=>'Sunflower Chic Wrap','category'=>'fresh','price'=>155000,'rating'=>4.6,'sold'=>82,'badge'=>'Populer','badge_color'=>'bg-yellow-500','image'=>'https://images.unsplash.com/photo-1543323218-90fcfaa06d5e?auto=format&fit=crop&w=500&q=80'],
        ['id'=>6,'name'=>'Dried Pampas Boho Set','category'=>'dried','price'=>275000,'rating'=>4.9,'sold'=>51,'badge'=>'Trending','badge_color'=>'bg-rose-500','image'=>'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=500&q=80'],
    ];
    $displayProducts = $products->count() > 0 ? $products : collect($mockProducts);
    @endphp

    @if($displayProducts->count() > 0)

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" id="product-grid">
            @foreach($displayProducts as $idx => $p)
                @php
                    $isArray   = is_array($p);
                    $pId       = $isArray ? $p['id']       : $p->id;
                    $pName     = $isArray ? $p['name']     : $p->name;
                    $pCat      = $isArray ? $p['category'] : $p->category;
                    $pPrice    = $isArray ? $p['price']    : $p->price;
                    $pRating   = $isArray ? $p['rating']   : 4.8;
                    $pSold     = $isArray ? $p['sold']     : 0;
                    $pBadge    = $isArray ? $p['badge']    : 'New';
                    $pBadgeBg  = $isArray ? $p['badge_color'] : 'bg-pink-500';
                    $pImage    = $isArray ? $p['image']    : ($p->image_url ?? 'https://images.unsplash.com/photo-1561181286-d3fee7d55364?auto=format&fit=crop&w=500&q=80');
                    $catLabel  = match($pCat) {
                        'fresh'      => 'Fresh Flowers',
                        'dried'      => 'Dried Flowers',
                        'artificial' => 'Artificial',
                        default      => ucfirst($pCat ?? 'Bunga')
                    };
                @endphp

                <div class="card-hover product-card bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm group"
                     style="animation-delay: {{ $idx * 0.07 }}s;">

                    <!-- Foto Produk -->
                    <div class="relative w-full h-56 overflow-hidden bg-pink-50">
                        <img
                            src="{{ $pImage }}"
                            alt="{{ $pName }}"
                            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            loading="lazy"
                        >
                        <!-- Badge Kategori Label -->
                        <span class="{{ $pBadgeBg }} text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full absolute top-3 left-3 shadow">
                            {{ $pBadge }}
                        </span>
                        <!-- Kategori kecil -->
                        <span class="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm text-[10px] font-bold text-slate-700 px-2.5 py-1 rounded-full shadow-sm border border-white/60">
                            {{ $catLabel }}
                        </span>
                        <!-- Wishlist -->
                        <button onclick="openModal()" class="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm hover:bg-pink-50 flex items-center justify-center shadow transition-colors group/wish">
                            <svg class="w-4 h-4 text-slate-400 group-hover/wish:text-pink-500 transition-colors" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                            </svg>
                        </button>
                    </div>

                    <!-- Info Produk -->
                    <div class="p-5">
                        <h3 class="text-sm font-extrabold text-slate-800 mb-2 leading-snug line-clamp-2 min-h-[2.75rem]">
                            {{ $pName }}
                        </h3>

                        <!-- Rating & Sold -->
                        <div class="flex items-center gap-2 mb-3">
                            <div class="flex items-center gap-0.5">
                                @for($s = 0; $s < 5; $s++)
                                <svg class="w-3 h-3 {{ $s < floor($pRating) ? 'text-amber-400' : 'text-slate-200' }}" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                                </svg>
                                @endfor
                            </div>
                            <span class="text-[10px] font-bold text-slate-600">{{ $pRating }}</span>
                            @if($pSold > 0)
                            <span class="text-[10px] text-slate-400">· {{ $pSold }}x terjual</span>
                            @endif
                        </div>

                        <!-- Harga & Tombol -->
                        <div class="flex items-center justify-between gap-2 pt-3 border-t border-slate-100">
                            <div>
                                <p class="text-[10px] text-slate-400 font-medium">Harga mulai</p>
                                <p class="text-base font-black text-pink-500">Rp {{ number_format($pPrice, 0, ',', '.') }}</p>
                            </div>
                            <!-- Tombol Beli Sekarang -->
                            <button
                                onclick="openModal()"
                                class="btn-pink flex-shrink-0 inline-flex items-center gap-1.5 text-white text-xs font-bold px-4 py-2.5 rounded-xl"
                            >
                                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
                                </svg>
                                Beli Sekarang
                            </button>
                        </div>
                    </div>

                </div>
            @endforeach
        </div>

    @else
        <!-- State Kosong / Tidak Ditemukan -->
        <div class="text-center py-24 px-8">
            <div class="w-24 h-24 rounded-full bg-pink-50 border border-pink-100 flex items-center justify-center text-5xl mx-auto mb-5 shadow-sm">
                🔍
            </div>
            <h3 class="text-xl font-black text-slate-700 mb-2">Bunga Tidak Ditemukan</h3>
            <p class="text-sm text-slate-400 max-w-sm mx-auto mb-6">
                Hmm, sepertinya tidak ada buket yang cocok dengan pencarian "<strong>{{ $searchQuery }}</strong>". Coba kata kunci lain atau lihat semua koleksi kami.
            </p>
            <a href="{{ url('/products') }}" class="btn-pink inline-flex items-center gap-2 text-white font-bold px-7 py-3 rounded-2xl text-sm">
                Lihat Semua Bunga
            </a>
        </div>
    @endif

    <!-- ====================================================
         BANNER MEMBER (Ajakan Daftar)
    ===================================================== -->
    <div class="mt-14 rounded-3xl overflow-hidden shadow-lg relative" style="background: linear-gradient(135deg, #fce7f3 0%, #fdf2fb 40%, #eff6ff 100%);">
        <div class="absolute inset-0 opacity-30" style="background-image: radial-gradient(circle at 80% 50%, #f9a8d4 0%, transparent 50%), radial-gradient(circle at 20% 80%, #bae6fd 0%, transparent 40%);"></div>
        <div class="relative z-10 px-8 py-10 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
            <div>
                <span class="text-xs font-bold text-pink-600 uppercase tracking-widest block mb-2">✨ Penawaran Member Baru</span>
                <h2 class="text-xl sm:text-2xl font-black text-slate-800 font-serif mb-2">Daftar Sekarang, Hemat 10% Pesanan Pertama!</h2>
                <p class="text-sm text-slate-500 max-w-md">Bergabung bersama 500+ pelanggan Florabelle dan nikmati kemudahan pesan buket custom kapan saja.</p>
            </div>
            <div class="flex flex-col sm:flex-row gap-3 flex-shrink-0">
                <a href="{{ route('register') }}" class="btn-pink inline-flex items-center justify-center gap-2 text-white font-bold px-7 py-4 rounded-2xl text-sm whitespace-nowrap">
                    <span class="text-white font-serif font-black">F</span> Daftar Gratis Sekarang
                </a>
                <a href="{{ route('login') }}" class="inline-flex items-center justify-center gap-1 text-sm font-semibold text-slate-600 hover:text-pink-500 bg-white/80 hover:bg-white border border-slate-200 hover:border-pink-200 px-6 py-4 rounded-2xl transition-all whitespace-nowrap">
                    Sudah punya akun →
                </a>
            </div>
        </div>
    </div>

</main>

<!-- ====================================================
     FOOTER
===================================================== -->
<footer class="bg-slate-900 text-slate-400 mt-16 py-12 px-5 lg:px-10">
    <div class="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div class="flex items-center gap-2.5">
            <div class="w-9 h-9 rounded-xl bg-gradient-to-br from-pink-400 to-rose-500 flex items-center justify-center text-xl"><span class="text-white font-serif font-black">F</span></div>
            <div>
                <span class="block text-sm font-black text-white font-serif">Florabelle.id</span>
                <span class="block text-[10px] text-pink-400 font-bold tracking-widest">PALU</span>
            </div>
        </div>
        <p class="text-xs text-slate-500 text-center">
            Samping Warung Makan Rivan, Jl. Dayodara – Jl. Meteorologi Blok B2, Kota Palu · Sulawesi Tengah
        </p>
        <p class="text-xs text-slate-600">© 2026 Florabelle.id · Dibuat dengan sepenuh hati</p>
    </div>
</footer>

<!-- ====================================================
     JAVASCRIPT
===================================================== -->
<script>
    const isLoggedIn = @json(auth()->check());

    function openModal() {
        if (isLoggedIn) {
            // Jika sudah login, arahkan langsung ke keranjang
            window.location.href = '/cart';
            return;
        }
        const modal = document.getElementById('login-modal');
        const box   = document.getElementById('modal-box');
        modal.classList.add('open');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        const modal = document.getElementById('login-modal');
        modal.classList.remove('open');
        document.body.style.overflow = '';
    }

    // Klik backdrop → tutup
    document.getElementById('login-modal').addEventListener('click', function(e) {
        if (e.target === this) closeModal();
    });

    // Tombol Escape → tutup
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') closeModal();
    });
</script>

</body>
</html>
