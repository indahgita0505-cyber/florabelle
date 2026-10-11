<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Halaman Pembayaran - Florabelle.id Palu</title>
    <meta name="description" content="Selesaikan pembayaran pesanan bunga segar dan buket cantik Anda di Florabelle.id Palu.">

    <!-- Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Playfair+Display:ital,wght@0,600;0,700;0,800;1,600&display=swap" rel="stylesheet">

    <!-- Tailwind CSS (via Vite) -->
    @vite(['resources/js/app.jsx'])

    <style>
        body {
            font-family: 'Plus Jakarta Sans', 'Segoe UI', sans-serif;
        }
        .font-serif {
            font-family: 'Playfair Display', Georgia, serif;
        }

        /* Custom Soft Pink Button & Accents */
        .btn-soft-pink {
            background-color: #f472b6; /* pink-400 */
            transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .btn-soft-pink:hover {
            background-color: #ec4899; /* pink-500 */
            transform: translateY(-2px);
            box-shadow: 0 14px 28px -6px rgba(244, 114, 182, 0.45);
        }
        .btn-soft-pink:active {
            transform: translateY(0);
        }

        /* Radio & Card Transitions */
        .payment-radio-card {
            transition: all 0.2s ease-in-out;
        }
        .payment-radio-card.active-card {
            border-color: #f472b6;
            background-color: #fffafc;
            box-shadow: 0 4px 20px rgba(244, 114, 182, 0.12);
        }

        /* Upload Area Animation */
        .drag-zone {
            transition: all 0.2s ease;
        }
        .drag-zone.drag-active {
            border-color: #60a5fa;
            background-color: #eff6ff;
        }
    </style>
</head>
<body class="bg-[#fcfbf9] text-slate-800 min-h-screen antialiased flex flex-col justify-between selection:bg-pink-100 selection:text-pink-600">

    <!-- =========================================================================
         1. NAVBAR / HEADER ATAS (Minimalis & Navigasi Mundur)
    ========================================================================== -->
    <header class="bg-white/80 backdrop-blur-md border-b border-pink-100/60 sticky top-0 z-30 shadow-xs">
        <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <!-- Navigasi Mundur -->
            <a href="{{ url('/cart') }}" class="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-pink-500 transition-colors group">
                <span class="w-8 h-8 rounded-xl bg-pink-50 text-pink-500 group-hover:bg-pink-100 flex items-center justify-center transition-colors">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
                    </svg>
                </span>
                <span class="font-medium">← Kembali ke Keranjang Belanja</span>
            </a>

            <!-- Brand Logo Singkat -->
            <div class="flex items-center gap-2">
                <span class="text-xl">🌸</span>
                <span class="font-serif font-bold text-slate-800 tracking-tight hidden sm:inline">Florabelle<span class="text-pink-500">.id</span> <span class="text-xs font-sans font-semibold text-slate-400 ml-1">Palu</span></span>
            </div>
        </div>
    </header>

    <!-- =========================================================================
         MAIN CONTAINER (Tata Letak Dua Kolom Responsif)
    ========================================================================== -->
    <main class="flex-1">
        <div class="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">

            <!-- Title & Breadcrumb Ringkas -->
            <div class="mb-6">
                <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-50 border border-pink-100 text-pink-600 text-xs font-semibold mb-2">
                    <span>✨ Pembayaran Aman & Cepat</span>
                </div>
                <h1 class="text-2xl sm:text-3xl font-extrabold text-slate-800 font-serif">Halaman Pembayaran</h1>
                <p class="text-xs sm:text-sm text-slate-500 mt-1">Lengkapi alamat pengiriman di Palu dan pilih metode pembayaran favorit Anda.</p>
            </div>

            <!-- Form Checkout Pembungkus Utama -->
            <form action="{{ url('/orders') }}" method="POST" enctype="multipart/form-data" id="form-checkout">
                @csrf

                <div class="flex flex-col lg:flex-row gap-6">

                    <!-- =====================================================================
                         2. KOLOM KIRI (Detail Pengiriman & Pembayaran - 60%)
                    ====================================================================== -->
                    <div class="w-full lg:w-[60%] space-y-6">

                        <!-- ================= CARD 1: SHIPPING INFO ================= -->
                        <div class="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 sm:p-7 relative overflow-hidden">
                            <!-- Aksen Header Card -->
                            <div class="flex items-center justify-between pb-4 mb-5 border-b border-slate-100">
                                <div class="flex items-center gap-3">
                                    <div class="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-lg shadow-xs">
                                        📍
                                    </div>
                                    <div>
                                        <h2 class="text-base font-bold text-slate-800">Informasi Pengiriman (Shipping Info)</h2>
                                        <p class="text-xs text-slate-400">Koordinasi kurir Grab / Ojek Online wilayah Kota Palu</p>
                                    </div>
                                </div>
                                <span class="hidden sm:inline-block text-[11px] font-semibold bg-blue-50 text-blue-600 px-2.5 py-1 rounded-lg border border-blue-100">
                                    Kota Palu
                                </span>
                            </div>

                            <div class="space-y-4">
                                <!-- Input: Nama Penerima -->
                                <div>
                                    <label for="recipient_name" class="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                                        Nama Penerima (Recipient's Name) <span class="text-pink-500">*</span>
                                    </label>
                                    <input 
                                        type="text" 
                                        id="recipient_name" 
                                        name="recipient_name" 
                                        required 
                                        placeholder="Contoh: Sarah Aulia / Kak Fadhil" 
                                        class="w-full bg-[#f8fbff] border border-blue-200 text-slate-800 text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-blue-400 focus:ring-3 focus:ring-blue-100 transition-all placeholder:text-slate-400"
                                        value="{{ old('recipient_name') }}"
                                    >
                                </div>

                                <!-- Input: Nomor WhatsApp Aktif -->
                                <div>
                                    <label for="whatsapp_number" class="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                                        Nomor WhatsApp Aktif <span class="text-pink-500">*</span>
                                    </label>
                                    <div class="relative flex rounded-xl shadow-xs">
                                        <span class="inline-flex items-center px-4 rounded-l-xl border border-r-0 border-blue-200 bg-blue-50/70 text-slate-600 text-sm font-semibold">
                                            🇮🇩 +62
                                        </span>
                                        <input 
                                            type="tel" 
                                            id="whatsapp_number" 
                                            name="whatsapp_number" 
                                            required 
                                            placeholder="812-3456-7890" 
                                            class="w-full bg-[#f8fbff] border border-blue-200 text-slate-800 text-sm rounded-r-xl px-4 py-3 focus:outline-none focus:border-blue-400 focus:ring-3 focus:ring-blue-100 transition-all placeholder:text-slate-400"
                                            value="{{ old('whatsapp_number') }}"
                                        >
                                    </div>
                                    <p class="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
                                        <span>📲</span> Kurir akan melakukan konfirmasi via WhatsApp/Telepon sebelum mengantar buket.
                                    </p>
                                </div>

                                <!-- Input: Alamat Lengkap Pengiriman -->
                                <div>
                                    <label for="shipping_address" class="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                                        Alamat Lengkap Pengiriman <span class="text-pink-500">*</span>
                                    </label>
                                    <textarea 
                                        id="shipping_address" 
                                        name="shipping_address" 
                                        rows="3" 
                                        required 
                                        placeholder="Tuliskan nama jalan, nomor rumah/kantor/gedung, patokan lokasi terdekat (misal: Samping Warkop / Depan Masjid), Kecamatan & Kelurahan di Kota Palu..." 
                                        class="w-full bg-[#f8fbff] border border-blue-200 text-slate-800 text-sm rounded-xl p-4 focus:outline-none focus:border-blue-400 focus:ring-3 focus:ring-blue-100 transition-all placeholder:text-slate-400 resize-none"
                                    >{{ old('shipping_address') }}</textarea>
                                    <p class="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
                                        <span>🛵</span> Pengiriman didukung oleh Grab Express Instant / Kurir Khusus Florabelle Palu.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <!-- ================= CARD 2: PAYMENT METHODS ================= -->
                        <div class="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 sm:p-7">
                            <div class="flex items-center gap-3 pb-4 mb-5 border-b border-slate-100">
                                <div class="w-10 h-10 rounded-xl bg-pink-50 text-pink-500 flex items-center justify-center text-lg shadow-xs">
                                    💳
                                </div>
                                <div>
                                    <h2 class="text-base font-bold text-slate-800">Metode Pembayaran (Payment Methods)</h2>
                                    <p class="text-xs text-slate-400">Pilih salah satu cara pembayaran praktis di bawah</p>
                                </div>
                            </div>

                            <div class="space-y-3.5">
                                
                                <!-- Opsi 1: QRIS Instan (Rekomendasi) -->
                                <label for="payment_qris" class="payment-radio-card active-card block border-2 border-pink-400 rounded-xl p-4 sm:p-5 cursor-pointer hover:border-pink-300">
                                    <div class="flex items-start justify-between">
                                        <div class="flex items-start gap-3.5">
                                            <input 
                                                type="radio" 
                                                id="payment_qris" 
                                                name="payment_method" 
                                                value="qris" 
                                                checked 
                                                class="mt-1 text-pink-500 focus:ring-pink-400 h-4 w-4 border-slate-300"
                                                onchange="switchPaymentMethod('qris')"
                                            >
                                            <div>
                                                <div class="flex items-center gap-2 flex-wrap">
                                                    <span class="font-bold text-slate-800 text-sm sm:text-base">QRIS Instan</span>
                                                    <span class="bg-gradient-to-r from-pink-500 to-rose-400 text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-xs">
                                                        Rekomendasi
                                                    </span>
                                                </div>
                                                <p class="text-xs text-slate-500 mt-1">Verifikasi instan otomatis via BCA Mobile, Livin' Mandiri, GoPay, OVO, Dana, ShopeePay, dll.</p>
                                            </div>
                                        </div>
                                        <span class="text-2xl hidden sm:inline-block">⚡</span>
                                    </div>

                                    <!-- QRIS Badge List -->
                                    <div class="mt-3.5 pt-3 border-t border-pink-100/70 flex items-center gap-2 flex-wrap">
                                        <span class="text-[11px] font-semibold bg-white border border-slate-200 text-slate-600 px-2 py-0.5 rounded-md">BCA Mobile</span>
                                        <span class="text-[11px] font-semibold bg-white border border-slate-200 text-slate-600 px-2 py-0.5 rounded-md">Livin' Mandiri</span>
                                        <span class="text-[11px] font-semibold bg-white border border-slate-200 text-slate-600 px-2 py-0.5 rounded-md">GoPay / OVO</span>
                                        <span class="text-[11px] font-semibold bg-white border border-slate-200 text-slate-600 px-2 py-0.5 rounded-md">Dana / ShopeePay</span>
                                    </div>
                                </label>

                                <!-- Opsi 2: Transfer Bank Manual (BCA / Mandiri) -->
                                <label for="payment_transfer" class="payment-radio-card block border-2 border-slate-200 rounded-xl p-4 sm:p-5 cursor-pointer hover:border-blue-300">
                                    <div class="flex items-start justify-between">
                                        <div class="flex items-start gap-3.5">
                                            <input 
                                                type="radio" 
                                                id="payment_transfer" 
                                                name="payment_method" 
                                                value="transfer" 
                                                class="mt-1 text-pink-500 focus:ring-pink-400 h-4 w-4 border-slate-300"
                                                onchange="switchPaymentMethod('transfer')"
                                            >
                                            <div>
                                                <span class="font-bold text-slate-800 text-sm sm:text-base">Transfer Bank Manual (BCA / Mandiri)</span>
                                                <p class="text-xs text-slate-500 mt-1">Transfer langsung ke rekening resmi Florabelle.id Palu dan unggah bukti transfer.</p>
                                            </div>
                                        </div>
                                        <span class="text-2xl hidden sm:inline-block">🏦</span>
                                    </div>

                                    <!-- DETAIL REKENING FLORABELLE (Ditampilkan bila memilih Bank Manual) -->
                                    <div id="bank-accounts-detail" class="hidden mt-4 pt-4 border-t border-slate-200 space-y-3">
                                        <!-- Bank BCA -->
                                        <div class="bg-blue-50/70 border border-blue-100 rounded-xl p-3.5 flex items-center justify-between gap-3">
                                            <div>
                                                <span class="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-100/80 px-2 py-0.5 rounded-sm">Bank BCA</span>
                                                <p class="text-sm font-extrabold text-slate-800 font-mono mt-1 tracking-wide">1234-5678-90</p>
                                                <p class="text-xs text-slate-500">a.n. <strong class="text-slate-700">Florabelle ID Palu</strong></p>
                                            </div>
                                            <button type="button" onclick="copyToClipboard('1234567890', this)" class="text-xs font-bold text-blue-600 bg-white border border-blue-200 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-colors shadow-xs active:scale-95">
                                                Salin No. Rek
                                            </button>
                                        </div>

                                        <!-- Bank Mandiri -->
                                        <div class="bg-amber-50/70 border border-amber-100 rounded-xl p-3.5 flex items-center justify-between gap-3">
                                            <div>
                                                <span class="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-100/80 px-2 py-0.5 rounded-sm">Bank Mandiri</span>
                                                <p class="text-sm font-extrabold text-slate-800 font-mono mt-1 tracking-wide">1550-0987-6543-21</p>
                                                <p class="text-xs text-slate-500">a.n. <strong class="text-slate-700">Florabelle ID Palu</strong></p>
                                            </div>
                                            <button type="button" onclick="copyToClipboard('15500987654321', this)" class="text-xs font-bold text-amber-700 bg-white border border-amber-200 hover:bg-amber-50 px-3 py-1.5 rounded-lg transition-colors shadow-xs active:scale-95">
                                                Salin No. Rek
                                            </button>
                                        </div>

                                        <p class="text-[11px] text-slate-400 italic">
                                            *Mohon transfer tepat sesuai nominal Final Total agar pesanan dapat segera dirangkai oleh tim Florist.
                                        </p>
                                    </div>
                                </label>

                            </div>
                        </div>

                    </div>

                    <!-- =====================================================================
                         3. KOLOM KANAN (Ringkasan Belanja & Konfirmasi Akhir - 40%)
                    ====================================================================== -->
                    <div class="w-full lg:w-[40%] space-y-6">

                        <!-- ================= CARD 3: RINGKASAN BELANJA (ORDER SUMMARY) ================= -->
                        <div class="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 sm:p-7">
                            <div class="flex items-center gap-3 pb-4 mb-5 border-b border-slate-100">
                                <div class="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-lg shadow-xs">
                                    🧾
                                </div>
                                <div>
                                    <h3 class="text-base font-bold text-slate-800">Ringkasan Belanja (Order Summary)</h3>
                                    <p class="text-xs text-slate-400">Rincian produk dan biaya pengiriman</p>
                                </div>
                            </div>

                            <!-- Preview Item Buket Bunga -->
                            <div class="space-y-3 mb-5">
                                <div class="flex items-center gap-3 bg-[#fbfdff] border border-blue-50 p-2.5 rounded-xl">
                                    <div class="w-12 h-12 rounded-lg bg-pink-100 text-pink-600 flex items-center justify-center text-xl flex-shrink-0">
                                        💐
                                    </div>
                                    <div class="flex-1 min-w-0">
                                        <p class="text-xs font-bold text-slate-800 truncate">Premium Fresh Rose & Lily Bouquet</p>
                                        <p class="text-[11px] text-slate-400">1x Rangkaian Bunga Eksklusif</p>
                                    </div>
                                    <span class="text-xs font-bold text-slate-700">Rp 600.000</span>
                                </div>
                            </div>

                            <!-- Rincian Biaya -->
                            <div class="space-y-3 text-sm border-t border-dashed border-slate-200 pt-4">
                                <div class="flex items-center justify-between text-slate-600">
                                    <span>Total Harga Bunga</span>
                                    <span class="font-semibold text-slate-800">Rp 600.000</span>
                                </div>
                                <div class="flex items-center justify-between text-slate-600">
                                    <span class="flex items-center gap-1.5">
                                        <span>🛵</span>
                                        <span>Ongkir Grab Delivery Palu</span>
                                    </span>
                                    <span class="font-semibold text-slate-800">Rp 15.000</span>
                                </div>

                                <!-- Final Total Highlighted -->
                                <div class="pt-4 mt-2 border-t border-slate-200 flex items-center justify-between">
                                    <div>
                                        <span class="text-xs font-extrabold uppercase tracking-wider text-slate-400 block">Final Total Tagihan</span>
                                        <span class="text-xs text-emerald-600 font-semibold">Bebas Biaya Layanan</span>
                                    </div>
                                    <span class="text-2xl font-black text-pink-500 font-serif">Rp 615.000</span>
                                </div>
                            </div>
                        </div>

                        <!-- ================= CARD 4: UPLOAD BUKTI TRANSFER ================= -->
                        <div class="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 sm:p-7">
                            <div class="flex items-center gap-3 pb-3 mb-4 border-b border-slate-100">
                                <div class="w-9 h-9 rounded-xl bg-pink-50 text-pink-500 flex items-center justify-center text-base shadow-xs">
                                    📷
                                </div>
                                <div>
                                    <h3 class="text-sm font-bold text-slate-800">Upload Bukti Transfer</h3>
                                    <p class="text-[11px] text-slate-400">Khusus pembayaran metode Transfer Bank Manual</p>
                                </div>
                            </div>

                            <!-- Minimalist Drag & Drop File Area (Kotak Putus-putus) -->
                            <div 
                                id="drop-zone-container"
                                class="drag-zone border-2 border-dashed border-blue-200 rounded-xl p-5 text-center bg-[#f8fbff] hover:bg-blue-50/50 cursor-pointer transition-all"
                                onclick="document.getElementById('proof_file_input').click()"
                                ondragover="handleFileDragOver(event)"
                                ondragleave="handleFileDragLeave(event)"
                                ondrop="handleFileDrop(event)"
                            >
                                <input 
                                    type="file" 
                                    id="proof_file_input" 
                                    name="payment_proof" 
                                    accept="image/png, image/jpeg, image/jpg, image/webp" 
                                    class="hidden" 
                                    onchange="handleFileInputChange(this)"
                                >

                                <div id="upload-placeholder">
                                    <div class="w-10 h-10 rounded-full bg-blue-100/70 text-blue-500 flex items-center justify-center mx-auto mb-2 text-lg">
                                        📁
                                    </div>
                                    <p class="text-xs font-bold text-slate-700">Tarik & Letakkan atau <span class="text-pink-500 underline">Pilih File</span></p>
                                    <p class="text-[10px] text-slate-400 mt-1">Format: JPG, PNG, atau WEBP (Maks. 5MB)</p>
                                </div>

                                <div id="upload-preview" class="hidden">
                                    <div class="flex items-center justify-center gap-2 text-emerald-600 text-xs font-bold mb-1">
                                        <span>✓ File Siap Diunggah:</span>
                                    </div>
                                    <p id="preview-filename" class="text-xs font-semibold text-slate-700 truncate max-w-xs mx-auto"></p>
                                    <button type="button" onclick="clearSelectedFile(event)" class="text-[11px] text-rose-500 hover:underline mt-2 inline-block">
                                        Hapus / Ganti File
                                    </button>
                                </div>
                            </div>
                        </div>

                        <!-- ================= TOMBOL AKSI UTAMA (CTA) ================= -->
                        <div class="space-y-3 pt-2">
                            <button 
                                type="submit" 
                                class="btn-soft-pink w-full py-4 px-6 rounded-xl text-white font-extrabold text-base tracking-wide shadow-lg shadow-pink-200/80 flex items-center justify-center gap-2.5 cursor-pointer"
                            >
                                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                </svg>
                                <span>Konfirmasi & Bayar Sekarang</span>
                            </button>

                            <!-- Jaminan Keamanan -->
                            <div class="flex items-center justify-center gap-1.5 text-[11px] text-slate-400 text-center">
                                <svg class="w-3.5 h-3.5 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd" d="M10 1.944A11.954 11.954 0 012.166 5C2.056 5.649 2 6.319 2 7c0 5.225 3.34 9.67 8 11.317C14.66 16.67 18 12.225 18 7c0-.682-.057-1.35-.166-2.001A11.954 11.954 0 0110 1.944zM11 14a1 1 0 11-2 0 1 1 0 012 0zm0-7a1 1 0 10-2 0v3a1 1 0 102 0V7z" clip-rule="evenodd"/>
                                </svg>
                                <span>Garansi Kesegaran Bunga 100% Florabelle.id Palu</span>
                            </div>
                        </div>

                    </div>

                </div>
            </form>

        </div>
    </main>

    <!-- =========================================================================
         FOOTER MINIMALIS
    ========================================================================== -->
    <footer class="border-t border-slate-100 bg-white py-6 text-center text-xs text-slate-400 mt-12">
        <div class="max-w-6xl mx-auto px-4">
            <p>© {{ date('Y') }} <strong class="text-slate-600 font-semibold">Florabelle.id Palu</strong>. Seluruh Hak Cipta Dilindungi.</p>
        </div>
    </footer>

    <!-- =========================================================================
         INTERACTIVE JAVASCRIPT (Toggle Radio, Salin Rekening, Drag & Drop File)
    ========================================================================== -->
    <script>
        // 1. Switch Metode Pembayaran & Tampilkan Detail Rekening
        function switchPaymentMethod(type) {
            const cardQris = document.getElementById('payment_qris').closest('.payment-radio-card');
            const cardTransfer = document.getElementById('payment_transfer').closest('.payment-radio-card');
            const bankDetail = document.getElementById('bank-accounts-detail');

            if (type === 'qris') {
                cardQris.classList.add('active-card', 'border-pink-400');
                cardQris.classList.remove('border-slate-200');

                cardTransfer.classList.remove('active-card', 'border-pink-400');
                cardTransfer.classList.add('border-slate-200');

                bankDetail.classList.add('hidden');
            } else {
                cardTransfer.classList.add('active-card', 'border-pink-400');
                cardTransfer.classList.remove('border-slate-200');

                cardQris.classList.remove('active-card', 'border-pink-400');
                cardQris.classList.add('border-slate-200');

                bankDetail.classList.remove('hidden');
            }
        }

        // 2. Salin Nomor Rekening ke Clipboard
        function copyToClipboard(text, buttonElement) {
            navigator.clipboard.writeText(text).then(() => {
                const originalText = buttonElement.innerText;
                buttonElement.innerText = '✓ Tersalin!';
                buttonElement.classList.remove('bg-white', 'text-blue-600', 'text-amber-700');
                buttonElement.classList.add('bg-emerald-500', 'text-white', 'border-emerald-500');

                setTimeout(() => {
                    buttonElement.innerText = originalText;
                    buttonElement.classList.remove('bg-emerald-500', 'text-white', 'border-emerald-500');
                    buttonElement.classList.add('bg-white');
                }, 2000);
            }).catch(err => {
                console.error('Gagal menyalin:', err);
            });
        }

        // 3. Drag & Drop File Upload Handler
        function handleFileDragOver(e) {
            e.preventDefault();
            document.getElementById('drop-zone-container').classList.add('drag-active');
        }

        function handleFileDragLeave(e) {
            e.preventDefault();
            document.getElementById('drop-zone-container').classList.remove('drag-active');
        }

        function handleFileDrop(e) {
            e.preventDefault();
            const container = document.getElementById('drop-zone-container');
            container.classList.remove('drag-active');

            if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                const file = e.dataTransfer.files[0];
                const fileInput = document.getElementById('proof_file_input');
                fileInput.files = e.dataTransfer.files;
                displayFilePreview(file.name);
            }
        }

        function handleFileInputChange(input) {
            if (input.files && input.files[0]) {
                displayFilePreview(input.files[0].name);
            }
        }

        function displayFilePreview(fileName) {
            document.getElementById('upload-placeholder').classList.add('hidden');
            const preview = document.getElementById('upload-preview');
            preview.classList.remove('hidden');
            document.getElementById('preview-filename').innerText = fileName;
        }

        function clearSelectedFile(e) {
            e.stopPropagation();
            const fileInput = document.getElementById('proof_file_input');
            fileInput.value = '';
            document.getElementById('upload-preview').classList.add('hidden');
            document.getElementById('upload-placeholder').classList.remove('hidden');
        }
    </script>
</body>
</html>
