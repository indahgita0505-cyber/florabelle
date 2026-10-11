<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Keranjang Belanja - Florabelle.id Palu</title>
    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />
    <!-- Scripts & Tailwind CSS -->
    @vite(['resources/js/app.jsx'])
</head>
<body class="font-sans antialiased bg-[#f8f9fc] text-slate-800" style="font-family: 'Inter', 'Segoe UI', sans-serif;">

<div class="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
    
    <!-- Top Navigation Header -->
    <header class="max-w-6xl mx-auto mb-6 flex items-center justify-between">
        <a href="{{ url('/products') }}" class="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-pink-500 transition-colors">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
            </svg>
            <span>Kembali Belanja</span>
        </a>

        <div class="flex items-center gap-2">
            <span class="text-xl">🌸</span>
            <span class="text-base font-extrabold text-pink-500 font-serif">Florabelle.id Palu</span>
        </div>
    </header>

    <main class="max-w-6xl mx-auto">
        <!-- Big Container Card -->
        <div class="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
            
            {{-- Data Mockup --}}
            @php
                $items = isset($cartItems) && count($cartItems) > 0 ? $cartItems : [
                    [
                        'id' => 1,
                        'name' => 'Bouquet of Red Roses',
                        'category' => 'Fresh Flowers Collection',
                        'price' => 245000,
                        'quantity' => 1,
                        'image' => 'https://images.unsplash.com/photo-1561181286-d3fee7d55364?auto=format&fit=crop&w=400&q=80',
                        'card_note' => 'Happy Graduation Sarah, S.Kom! Sukses selalu yaa 🎓💐',
                        'details' => 'Kertas: Premium Soft Pink | Pita: Putih'
                    ],
                    [
                        'id' => 2,
                        'name' => 'White Moon Orchid',
                        'category' => 'Premium Orchid',
                        'price' => 185000,
                        'quantity' => 2,
                        'image' => 'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&w=400&q=80',
                        'card_note' => 'Selamat Ulang Tahun Mama tercinta! Sehat selalu ❤️',
                        'details' => 'Pot: Putih Minimalis | Pita: Emas'
                    ]
                ];

                $subtotal = 0;
                foreach($items as $item) {
                    $itemPrice = is_array($item) ? $item['price'] : $item->price;
                    $itemQty = is_array($item) ? $item['quantity'] : $item->quantity;
                    $subtotal += ($itemPrice * $itemQty);
                }

                $ongkir = count($items) > 0 ? 15000 : 0;
                $discount = 0; 
                $total = $subtotal - $discount + $ongkir;
            @endphp

            @if(count($items) > 0)
                <!-- Grid 2 Kolom (Kiri 65%, Kanan 35%) -->
                <div class="grid grid-cols-1 lg:grid-cols-12">

                    <!-- =======================================================
                        KOLOM KIRI — DAFTAR PRODUK KERANJANG (lg:col-span-8)
                    ======================================================== -->
                    <div class="lg:col-span-8 border-b lg:border-b-0 lg:border-r border-slate-100 flex flex-col h-full">
                        
                        <!-- Header Kolom Kiri -->
                        <div class="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
                            <div class="flex items-center gap-2.5">
                                <div class="w-8 h-8 rounded-xl bg-pink-50 flex items-center justify-center text-base">🛒</div>
                                <h1 class="text-base font-extrabold text-slate-700">Daftar Bunga Pilihan</h1>
                                <span class="bg-pink-400 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                                    {{ count($items) }} Item
                                </span>
                            </div>
                            <span class="text-xs text-slate-400 hidden sm:inline-block">
                                Fresh Florist & Hand Bouquet
                            </span>
                        </div>

                        <!-- Daftar Item -->
                        <div class="divide-y divide-slate-100 flex-1">
                            @foreach($items as $item)
                                @php
                                    $pName = is_array($item) ? $item['name'] : $item->product->name;
                                    $pCat = is_array($item) ? $item['category'] : ($item->product->category ?? 'Florist Palu');
                                    $pPrice = is_array($item) ? $item['price'] : $item->price;
                                    $pQty = is_array($item) ? $item['quantity'] : $item->quantity;
                                    $pImg = is_array($item) ? $item['image'] : ($item->product->image_url ?? 'https://images.unsplash.com/photo-1561181286-d3fee7d55364?auto=format&fit=crop&w=400&q=80');
                                    $pNote = is_array($item) ? ($item['card_note'] ?? '') : ($item->greeting_card_message ?? '');
                                    $pDetails = is_array($item) ? ($item['details'] ?? '') : 'Kertas Standard | Pita Menyesuaikan';
                                @endphp

                                <div class="p-6 transition-all hover:bg-pink-50/20">
                                    <div class="flex flex-col sm:flex-row gap-5">
                                        
                                        <!-- Foto Buket -->
                                        <div class="w-full sm:w-28 h-40 sm:h-28 rounded-2xl overflow-hidden bg-pink-50 border border-pink-100 flex-shrink-0 relative">
                                            <img 
                                                src="{{ $pImg }}" 
                                                alt="{{ $pName }}" 
                                                class="w-full h-full object-cover object-center transform hover:scale-105 transition duration-300"
                                            >
                                        </div>

                                        <!-- Detail Produk -->
                                        <div class="flex-1 flex flex-col justify-between">
                                            
                                            <div class="flex items-start justify-between gap-3">
                                                <div class="flex-1">
                                                    <span class="text-[10px] font-bold uppercase tracking-wider text-pink-500 bg-pink-50 px-2 py-0.5 rounded-md inline-block mb-1.5">
                                                        {{ $pCat }}
                                                    </span>
                                                    <h3 class="text-sm sm:text-base font-bold text-slate-800 leading-tight">
                                                        {{ $pName }}
                                                    </h3>
                                                    <p class="text-[11px] text-slate-400 mt-1 line-clamp-1">
                                                        {{ $pDetails }}
                                                    </p>
                                                    <p class="text-sm font-bold text-pink-500 mt-1">
                                                        Rp {{ number_format($pPrice, 0, ',', '.') }}
                                                    </p>
                                                </div>

                                                <!-- Tombol Hapus -->
                                                <button type="button" class="text-slate-300 hover:text-rose-500 p-1.5 rounded-lg hover:bg-rose-50 transition-colors flex-shrink-0" title="Hapus produk">
                                                    <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                                                        <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                                                    </svg>
                                                </button>
                                            </div>

                                            <!-- Kontrol Jumlah & Subtotal -->
                                            <div class="flex items-center justify-between mt-4">
                                                <div class="flex items-center rounded-xl border border-blue-100 bg-blue-50/40 p-1 shadow-sm">
                                                    <button type="button" class="w-7 h-7 flex items-center justify-center font-bold text-blue-500 hover:bg-white hover:text-pink-500 rounded-lg transition text-base shadow-xs active:scale-95 bg-transparent">
                                                        −
                                                    </button>
                                                    <span class="w-8 text-center text-sm font-bold text-slate-700 select-none">
                                                        {{ $pQty }}
                                                    </span>
                                                    <button type="button" class="w-7 h-7 flex items-center justify-center font-bold text-blue-500 hover:bg-white hover:text-pink-500 rounded-lg transition text-base shadow-xs active:scale-95 bg-transparent">
                                                        +
                                                    </button>
                                                </div>

                                                <div class="text-right">
                                                    <span class="text-[10px] text-slate-400 block font-medium uppercase tracking-wider mb-0.5">Subtotal</span>
                                                    <span class="text-sm font-extrabold text-slate-800">
                                                        Rp {{ number_format($pPrice * $pQty, 0, ',', '.') }}
                                                    </span>
                                                </div>
                                            </div>

                                        </div>
                                    </div>

                                    <!-- Catatan Kartu Ucapan per Produk -->
                                    <div class="mt-4 pt-3 border-t border-dashed border-slate-100">
                                        <div class="flex items-center gap-1.5 mb-2">
                                            <span class="text-pink-400 text-sm leading-none">💌</span>
                                            <label class="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                                                Catatan Kartu Ucapan <span class="font-normal normal-case text-slate-400 text-[10px] ml-1">(Free Custom Greeting Card)</span>
                                            </label>
                                        </div>
                                        <textarea 
                                            rows="2"
                                            placeholder='Contoh: "Happy Birthday! Semoga bahagia selalu 🌸"'
                                            class="w-full text-xs px-4 py-3 rounded-xl border border-blue-100 bg-blue-50/30 text-slate-700 placeholder-slate-400 focus:outline-none focus:border-pink-300 focus:ring-2 focus:ring-pink-100 transition resize-none"
                                        >{{ $pNote }}</textarea>
                                    </div>
                                </div>
                            @endforeach
                        </div>

                        <!-- Footer Kolom Kiri: Tambah Bunga Lainnya -->
                        <div class="px-6 py-4 border-t border-slate-100 bg-slate-50/40 flex items-center justify-between">
                            <a href="{{ url('/products') }}" class="inline-flex items-center gap-2 text-xs font-bold text-blue-500 hover:text-pink-500 transition-colors">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
                                </svg>
                                <span>Tambah Buket Lainnya</span>
                            </a>
                        </div>

                    </div>

                    <!-- =======================================================
                        KOLOM KANAN — RINGKASAN PEMBAYARAN (lg:col-span-4)
                    ======================================================== -->
                    <div class="lg:col-span-4 bg-[#f7fbff] p-6 lg:p-8 flex flex-col justify-between h-full">
                        
                        <div class="space-y-6">
                            
                            <!-- 1. Header Ringkasan -->
                            <div class="flex items-center gap-3 border-b border-blue-100/50 pb-4">
                                <div class="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center text-lg shadow-xs">📋</div>
                                <div>
                                    <h2 class="text-sm font-extrabold text-slate-800 uppercase tracking-wide">Payment Summary</h2>
                                    <p class="text-[11px] text-slate-500">{{ count($items) }} produk di keranjang</p>
                                </div>
                            </div>

                            <!-- 2. Rincian Harga -->
                            <div class="bg-white rounded-2xl border border-blue-100 p-5 space-y-3 shadow-sm">
                                <div class="flex items-center justify-between text-sm text-slate-600">
                                    <span>Total Harga Bunga</span>
                                    <span class="font-bold text-slate-800">Rp {{ number_format($subtotal, 0, ',', '.') }}</span>
                                </div>
                                <div class="flex items-center justify-between text-sm text-slate-600">
                                    <span class="flex items-center gap-1.5">
                                        <span>🛵</span>
                                        <span>Estimasi Ongkir</span>
                                    </span>
                                    <span class="font-bold text-slate-800">Rp {{ number_format($ongkir, 0, ',', '.') }}</span>
                                </div>
                                @if($discount > 0)
                                <div class="flex items-center justify-between text-sm text-emerald-600">
                                    <span class="flex items-center gap-1.5">
                                        <span>🏷️</span>
                                        <span>Diskon Promo</span>
                                    </span>
                                    <span class="font-bold">− Rp {{ number_format($discount, 0, ',', '.') }}</span>
                                </div>
                                @endif

                                <div class="border-t border-dashed border-blue-100 pt-4 mt-2 flex items-center justify-between">
                                    <span class="text-xs font-extrabold text-slate-700 uppercase tracking-wider">Final Total</span>
                                    <span class="text-xl font-black text-pink-500 font-serif">
                                        Rp {{ number_format($total, 0, ',', '.') }}
                                    </span>
                                </div>
                            </div>

                            <!-- 3. Voucher / Promo Code Box -->
                            <div>
                                <label class="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                                    Voucher / Promo Code
                                </label>
                                <div class="flex gap-2">
                                    <input 
                                        type="text" 
                                        placeholder="Ketik kode promo..."
                                        class="flex-1 px-4 py-3 rounded-xl border border-blue-200 bg-white text-xs text-slate-700 placeholder-slate-400 font-mono uppercase tracking-wider focus:outline-none focus:border-pink-300 focus:ring-2 focus:ring-pink-100 transition shadow-sm"
                                    >
                                    <button 
                                        type="button" 
                                        class="px-5 py-3 rounded-xl text-xs font-bold text-white bg-blue-500 hover:bg-blue-600 transition shadow-sm active:scale-95 flex-shrink-0"
                                    >
                                        Use
                                    </button>
                                </div>
                            </div>

                            <!-- 4. Info Box Grab Delivery Palu -->
                            <div class="bg-blue-50 rounded-2xl p-4 flex gap-3 items-start border border-blue-100 shadow-sm relative overflow-hidden">
                                <div class="absolute left-0 top-0 w-1 h-full bg-blue-400"></div>
                                <span class="text-2xl flex-shrink-0">🛵</span>
                                <div>
                                    <p class="text-xs font-bold text-slate-700 uppercase tracking-wider">Grab Delivery Palu</p>
                                    <p class="text-[10px] text-slate-500 mt-1 leading-relaxed">
                                        Pengiriman instan Ojek Online Palu. Pesanan akan di-pickup driver 30–60 menit setelah dirangkai.
                                    </p>
                                </div>
                            </div>

                        </div>

                        <!-- 5. Tombol Utama (Lanjutkan ke Pembayaran) -->
                        <div class="mt-8">
                            <a 
                                href="{{ url('/checkout') }}" 
                                class="w-full py-4 rounded-2xl text-white font-extrabold text-[15px] tracking-wide flex items-center justify-center gap-2 transition-all duration-300 hover:-translate-y-1 active:translate-y-0 shadow-lg shadow-pink-300/50 hover:shadow-xl hover:shadow-pink-300/60"
                                style="background: linear-gradient(135deg, #f472b6 0%, #e879a0 100%);"
                            >
                                <span>Lanjutkan ke Pembayaran</span>
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
                                </svg>
                            </a>

                            <p class="text-center text-[10px] text-slate-400 flex items-center justify-center gap-1.5 mt-4">
                                <svg class="w-3.5 h-3.5 text-emerald-400" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
                                </svg>
                                Checkout aman 100%
                            </p>
                        </div>

                    </div>
                </div>
            @else
                <!-- State Keranjang Kosong -->
                <div class="flex flex-col items-center justify-center py-24 px-8 text-center">
                    <div class="w-24 h-24 rounded-full flex items-center justify-center text-5xl mb-5 bg-pink-50 text-pink-400 border border-pink-100 shadow-sm">
                        🛒
                    </div>
                    <h2 class="text-xl font-extrabold text-slate-700 mb-2">Keranjangmu Masih Kosong</h2>
                    <p class="text-xs sm:text-sm text-slate-400 max-w-xs mb-6">
                        Yuk, temukan buket bunga impianmu dan buat momen spesialmu semakin berkesan bersama Florabelle.id Palu!
                    </p>
                    <a 
                        href="{{ url('/products') }}" 
                        class="inline-flex items-center gap-2 text-white font-bold px-8 py-3.5 rounded-2xl shadow-lg shadow-pink-200 transition-all hover:-translate-y-0.5"
                        style="background: linear-gradient(135deg, #f472b6, #e879a0);"
                    >
                        Mulai Belanja Sekarang
                    </a>
                </div>
            @endif

        </div>

        <!-- Footer Note -->
        <footer class="text-center text-xs text-slate-400 py-8 mt-2">
            © 2026 Florabelle.id Palu · Jl. Dayodara – Jl. Meteorologi Blok B2 · 🌸 Dibuat dengan cinta
        </footer>
    </main>
</div>

</body>
</html>
