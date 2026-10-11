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
        :root {
            --brand-primary: #b7526d;
            --brand-primary-hover: #9f435c;
            --brand-soft: #fae8ee;
            --brand-border: #f3ccd8;
            --text-dark: #2d2426;
            --text-muted: #7a6e71;
            --bg-cream: #fbf5f2;
        }
        body { font-family: 'Inter', system-ui, -apple-system, sans-serif; color: var(--text-dark); }
        .font-serif { font-family: 'Playfair Display', Georgia, serif; }

        .btn-pink {
            background-color: var(--brand-primary);
            color: #ffffff;
            box-shadow: 0 4px 14px rgba(183, 82, 109, 0.28);
            transition: all 0.2s ease;
        }
        .btn-pink:hover {
            background-color: var(--brand-primary-hover);
            box-shadow: 0 8px 24px rgba(183, 82, 109, 0.40);
            transform: translateY(-1px);
        }
        .btn-pink:active { transform: translateY(0); }

        .card-hover {
            transition: transform 0.28s ease, box-shadow 0.28s ease;
        }
        .card-hover:hover {
            transform: translateY(-4px);
            box-shadow: 0 16px 36px rgba(183, 82, 109, 0.12), 0 4px 12px rgba(0,0,0,0.04);
        }

        /* Filter tab active */
        .filter-tab.active {
            background-color: var(--brand-primary) !important;
            color: white !important;
            box-shadow: 0 4px 12px rgba(183, 82, 109, 0.28);
            border-color: var(--brand-primary) !important;
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
        <a href="{{ url('/') }}" class="flex items-center gap-3 group flex-shrink-0">
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

        <!-- Nav Links (Desktop) -->
        <div class="hidden md:flex items-center gap-7">
            <a href="{{ url('/') }}" class="text-sm font-semibold text-slate-500 hover:text-pink-500 transition-colors">Beranda</a>
            <a href="{{ url('/products') }}" class="text-sm font-bold text-pink-500 border-b-2 border-pink-400 pb-0.5">Katalog</a>
            <a href="{{ url('/#tentang') }}" class="text-sm font-semibold text-slate-500 hover:text-pink-500 transition-colors">Tentang Kami</a>
        </div>

        <!-- CTA -->
        <div class="flex items-center gap-3">
            @auth
                @php
                    $dashboardUrl = auth()->user()->role === 'admin' ? route('admin.dashboard') : route('dashboard');
                    $userRole = auth()->user()->role === 'admin' ? 'Admin' : 'Member';
                    $firstName = explode(' ', auth()->user()->name)[0] ?? 'User';
                @endphp
                <span class="hidden lg:inline-flex text-xs font-semibold text-slate-500">
                    Halo, <strong class="text-slate-700 ml-1">{{ $firstName }}</strong>
                </span>
                <a href="{{ route('cart.index') }}" class="relative p-2 text-slate-600 hover:text-pink-500 hover:bg-pink-50 rounded-xl transition" title="Keranjang Belanja">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
                    </svg>
                </a>
                <a href="{{ $dashboardUrl }}" class="btn-pink inline-flex items-center gap-2 text-white text-sm font-bold px-4 sm:px-5 py-2.5 rounded-xl shadow-sm hover:shadow-md transition">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
                    </svg>
                    <span>Dashboard</span>
                    <span class="text-[10px] font-extrabold bg-white/25 px-2 py-0.5 rounded-full text-white">{{ $userRole }}</span>
                </a>
            @else
                <a href="{{ route('login') }}" class="hidden sm:inline-block text-sm font-semibold text-slate-500 hover:text-pink-500 transition-colors px-3 py-2">
                    Masuk
                </a>
                <a href="{{ route('register') }}" class="btn-pink inline-flex items-center gap-1.5 text-white text-sm font-bold px-5 py-2.5 rounded-xl">
                    <span class="hidden sm:inline">Masuk / </span>Daftar
                </a>
            @endauth
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
        ['id'=>6,'name'=>'Dried Pampas Boho Set','category'=>'dried','price'=>275000,'rating'=>4.9,'sold'=>51,'badge'=>'Trending','badge_color'=>'bg-rose-500','image'=>'https://images.unsplash.com/photo-1562106888-f8013ed14dce?auto=format&fit=crop&w=500&q=80'],
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
                    $pPrice    = $isArray ? $p['price']    : $p->price;
                    $pRating   = $isArray ? $p['rating']   : 4.8;
                    $pSold     = $isArray ? $p['sold']     : 0;
                    $pBadge    = $isArray ? $p['badge']    : 'New';
                    $pBadgeBg  = $isArray ? $p['badge_color'] : 'bg-pink-500';
                    $pImage    = $isArray ? $p['image']    : ($p->image_url ?: ($p->image ?: 'https://images.unsplash.com/photo-1561181286-d3fee7d55364?auto=format&fit=crop&w=500&q=80'));
                    
                    $catSlug   = $isArray ? ($p['category'] ?? null) : ($p->category?->slug ?? (is_string($p->category) ? $p->category : null));
                    $catName   = $isArray ? null : ($p->category?->name ?? null);
                    $catLabel  = match($catSlug) {
                        'fresh'      => 'Fresh Flowers',
                        'dried'      => 'Dried Flowers',
                        'artificial' => 'Artificial',
                        default      => $catName ?: ucfirst($catSlug ?? 'Bunga')
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
                            @if(!auth()->check() || auth()->user()->role !== 'admin')
                            <div class="flex items-center gap-1.5">
                                <!-- Tombol Keranjang -->
                                <button
                                    type="button"
                                    onclick="handleAddToCart({{ $pId }})"
                                    class="w-9 h-9 rounded-xl bg-pink-50 hover:bg-pink-100 active:scale-95 text-pink-600 border border-pink-200/80 flex items-center justify-center transition shadow-2xs"
                                    title="Tambah ke Keranjang"
                                >
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
                                    </svg>
                                </button>
                                <!-- Tombol Beli -->
                                <button
                                    type="button"
                                    onclick="handleBeliDirect({{ $pId }})"
                                    class="btn-pink flex-shrink-0 inline-flex items-center gap-1.5 text-white text-xs font-bold px-3.5 py-2.5 rounded-xl shadow-xs transition active:scale-95"
                                    title="Beli Sekarang"
                                >
                                    Beli
                                </button>
                            </div>
                            @endif
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
         BANNER (Member vs Guest CTA)
    ===================================================== -->
    @auth
    <div class="mt-14 rounded-3xl overflow-hidden shadow-lg relative" style="background: linear-gradient(135deg, #fce7f3 0%, #fdf2fb 40%, #eff6ff 100%);">
        <div class="absolute inset-0 opacity-30" style="background-image: radial-gradient(circle at 80% 50%, #f9a8d4 0%, transparent 50%), radial-gradient(circle at 20% 80%, #bae6fd 0%, transparent 40%);"></div>
        <div class="relative z-10 px-8 py-10 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
            <div>
                <span class="text-xs font-bold text-pink-600 uppercase tracking-widest block mb-2">✨ Desain Sesuai Keinginanmu</span>
                <h2 class="text-xl sm:text-2xl font-black text-slate-800 font-serif mb-2">Ingin Buket Spesial Sesuai Budget?</h2>
                <p class="text-sm text-slate-500 max-w-md">Kombinasikan bunga segar, warna kertas wrapping, dan pita sesukamu dengan fitur Custom Buket Florabelle.</p>
            </div>
            <div class="flex flex-col sm:flex-row gap-3 flex-shrink-0">
                <a href="{{ route('custom.index') }}" class="btn-pink inline-flex items-center justify-center gap-2 text-white font-bold px-7 py-4 rounded-2xl text-sm whitespace-nowrap shadow-md">
                    <span>💐</span> Buat Custom Buket Sekarang
                </a>
            </div>
        </div>
    </div>
    @else
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
    @endauth

</main>

<!-- ====================================================
     FOOTER
===================================================== -->
<footer class="bg-[#fbedf1] border-t border-[#f2dde3] py-8 px-5 lg:px-10 text-[#7a6e71] mt-16">
    <div class="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
        
        <!-- Copyright & Brand -->
        <div class="flex items-center gap-2">
            <span class="font-bold text-[#2d2426]">Florabelle</span>
            <span>•</span>
            <span>© 2026. Semua hak dilindungi.</span>
        </div>

        <p class="text-[11px] text-[#8e8185] text-center sm:text-left">
            Samping Warung Makan Rivan, Jl. Dayodara – Jl. Meteorologi Blok B2, Kota Palu, Sulawesi Tengah
        </p>

        <!-- Social Icons -->
        <div class="flex items-center gap-4 text-[#b7526d]">
            <a href="https://instagram.com" target="_blank" class="hover:text-[#9f435c] transition-colors" title="Instagram">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.13-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
            </a>
            <a href="https://wa.me/6281234567890" target="_blank" class="hover:text-[#9f435c] transition-colors" title="WhatsApp">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                </svg>
            </a>
            <a href="https://tiktok.com" target="_blank" class="hover:text-[#9f435c] transition-colors" title="TikTok">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                </svg>
            </a>
        </div>

    </div>
</footer>

<!-- Floating Toast Notification -->
<div id="floating-toast" class="fixed bottom-6 right-6 z-50 bg-[#2d2426]/95 backdrop-blur-md text-white px-5 py-3.5 rounded-2xl shadow-xl flex items-center gap-3 transition-all duration-300 transform translate-y-20 opacity-0 pointer-events-none">
    <div class="w-7 h-7 rounded-full bg-pink-500 flex items-center justify-center text-white shrink-0">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/>
        </svg>
    </div>
    <span id="toast-text" class="text-xs sm:text-sm font-semibold">Produk berhasil ditambahkan ke keranjang!</span>
    <a href="{{ route('cart.index') }}" class="text-xs bg-pink-500 hover:bg-pink-600 text-white font-bold px-3 py-1.5 rounded-xl transition whitespace-nowrap">
        Lihat Keranjang
    </a>
</div>

<!-- ====================================================
     JAVASCRIPT
===================================================== -->
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

    function openModal() {
        if (isLoggedIn) {
            // Jika sudah login, arahkan langsung ke keranjang
            window.location.href = '{{ route("cart.index") }}';
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
    document.getElementById('login-modal')?.addEventListener('click', function(e) {
        if (e.target === this) closeModal();
    });

    // Tombol Escape → tutup
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') closeModal();
    });
</script>

</body>
</html>
