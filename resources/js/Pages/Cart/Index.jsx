import { Head, Link, usePage, router, useForm } from '@inertiajs/react';
import { useState } from 'react';

/* ─────────────────── helpers ─────────────────── */
const fmt = (n) => 'Rp ' + Number(n).toLocaleString('id-ID');
const ONGKIR = 15000;

/* ─────────────────── EMPTY STATE ─────────────────── */
function EmptyCart() {
    return (
        <div className="flex flex-col items-center justify-center py-24 px-8 text-center">
            <div className="w-28 h-28 rounded-full flex items-center justify-center text-6xl mb-6"
                style={{ background: 'linear-gradient(135deg, #fce7f3, #eff6ff)' }}>
                
            </div>
            <h2 className="text-xl font-extrabold text-slate-700 mb-2">
                Keranjangmu masih kosong
            </h2>
            <p className="text-sm text-slate-400 max-w-xs mb-8">
                Yuk, temukan buket impianmu dan buat momen spesialmu semakin berkesan bersama Florabelle.id Palu!
            </p>
            <Link
                href={route('dashboard')}
                className="inline-flex items-center gap-2 text-white font-bold px-7 py-3.5 rounded-2xl shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl"
                style={{ background: 'linear-gradient(135deg, #f472b6, #e879a0)', boxShadow: '0 8px 25px rgba(244,114,182,0.35)' }}
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7 16l-4-4m0 0l4-4m-4 4h18" />
                </svg>
                Mulai Belanja Sekarang
            </Link>
        </div>
    );
}

/* ─────────────────── STAR ROW ─────────────────── */
function Stars({ rating = 4.8 }) {
    return (
        <span className="inline-flex items-center gap-0.5">
            {[...Array(5)].map((_, i) => (
                <svg key={i} className="w-3 h-3" viewBox="0 0 20 20"
                    fill={i < Math.floor(rating) ? '#fbbf24' : '#e2e8f0'}>
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
            ))}
            <span className="text-[10px] text-slate-400 ml-0.5 font-medium">{rating}</span>
        </span>
    );
}

/* ─────────────────── MAIN PAGE ─────────────────── */
export default function Index({ carts = [], recommendations = [] }) {
    const { flash } = usePage().props;

    const [selectedItems, setSelectedItems] = useState(carts.map((c) => c.id));
    const [cardMessages, setCardMessages]   = useState({});
    const [voucherCode, setVoucherCode]     = useState('');
    const [discount, setDiscount]           = useState(0);
    const [voucherMsg, setVoucherMsg]       = useState(null);
    const [removingId, setRemovingId]       = useState(null);

    /* selection helpers */
    const allSelected = selectedItems.length === carts.length && carts.length > 0;
    const toggleItem  = (id) => setSelectedItems((p) => p.includes(id) ? p.filter((x) => x !== id) : [...p, id]);
    const toggleAll   = ()   => setSelectedItems(allSelected ? [] : carts.map((c) => c.id));

    /* backend: update qty */
    const updateQty = (cartId, current, delta) => {
        const next = current + delta;
        if (next < 1) return;
        router.put(route('cart.update', cartId), { quantity: next }, { preserveScroll: true });
    };

    /* backend: remove */
    const removeItem = (cartId) => {
        setRemovingId(cartId);
        router.delete(route('cart.destroy', cartId), {
            preserveScroll: true,
            onFinish: () => setRemovingId(null),
        });
    };

    /* voucher */
    const applyVoucher = () => {
        const code = voucherCode.trim().toUpperCase();
        if (code === 'FLORA10') {
            setDiscount(0.1);
            setVoucherMsg({ ok: true, text: ' Voucher FLORA10 aktif! Diskon 10% berhasil diterapkan.' });
        } else if (code === '') {
            setVoucherMsg({ ok: false, text: ' Masukkan kode voucher terlebih dahulu.' });
        } else {
            setDiscount(0);
            setVoucherMsg({ ok: false, text: ' Kode voucher tidak valid atau sudah kedaluwarsa.' });
        }
    };

    /* checkout form */
    const { data, setData, post, processing, errors } = useForm({
        cart_ids: [],
        payment_method: 'transfer',
        customer_name: '',
        customer_phone: '',
        customer_address: '',
        notes: '',
    });

    const submitOrder = (e) => {
        e.preventDefault();
        if (selectedItems.length === 0) {
            alert('Pilih minimal satu item untuk dilanjutkan ke checkout.');
            return;
        }
        post(route('orders.store'), {
            onBefore: () => setData('cart_ids', selectedItems),
        });
    };

    /* totals */
    const selectedCarts = carts.filter((c) => selectedItems.includes(c.id));
    const subtotal      = selectedCarts.reduce((s, c) => s + ((c.product?.price ?? 0) * c.quantity), 0);
    const discountAmt   = Math.round(subtotal * discount);
    const ongkir        = selectedCarts.length > 0 ? ONGKIR : 0;
    const total         = subtotal - discountAmt + ongkir;

    /* customization chips (placeholder for demo) */
    const customDetails = [
        'Warna Kertas: Soft Pink',
        'Pita: Putih Cream',
        'Ukuran: Medium (12 tangkai)',
    ];

    return (
        <div className="min-h-screen bg-[#f8f9fc]" style={{ fontFamily: "'Inter','Segoe UI',sans-serif" }}>
            <Head title="Keranjang Belanja — Florabelle.id" />

            {/* ── TOP NAV ── */}
            <header className="sticky top-0 z-20 bg-white/90 backdrop-blur-md border-b border-slate-100 px-5 lg:px-10 py-4 flex items-center gap-4 shadow-sm">
                <Link
                    href={route('dashboard')}
                    className="flex items-center gap-1.5 text-slate-400 hover:text-pink-400 transition text-sm font-semibold"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    <span className="hidden sm:inline">Kembali Belanja</span>
                </Link>

                <div className="flex items-center gap-2.5 mx-auto">
                    <div className="w-8 h-8 rounded-xl bg-pink-50 flex items-center justify-center text-lg"></div>
                    <h1 className="text-base font-extrabold text-slate-700">Keranjang Belanja</h1>
                    {usePage().props.cartCount > 0 && (
                        <span className="bg-pink-400 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full leading-tight">
                            {usePage().props.cartCount}
                        </span>
                    )}
                </div>

                <Link href="/" className="flex items-center gap-1.5 ml-auto flex-shrink-0">
                    <span className="text-xl"></span>
                    <span className="hidden sm:block text-sm font-extrabold text-pink-400">Florabelle.id</span>
                </Link>
            </header>

            {/* ── FLASH MESSAGES ── */}
            {(flash?.success || flash?.error) && (
                <div className="max-w-6xl mx-auto px-5 lg:px-8 pt-5">
                    <div className={`flex items-center gap-3 px-5 py-3.5 rounded-2xl text-sm font-medium border ${
                        flash?.success ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-600'
                    }`}>
                        <span>{flash?.success ? '' : ''}</span>
                        {flash?.success ?? flash?.error}
                    </div>
                </div>
            )}

            {/* ── MAIN ── */}
            <main className="max-w-6xl mx-auto px-4 lg:px-8 py-6 lg:py-8">

                {/* BIG WHITE CARD */}
                <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">

                    {carts.length === 0 ? (
                        <EmptyCart />
                    ) : (
                        <div className="flex flex-col lg:flex-row min-h-[600px]">

                            {/* ════════════════════════════════════════════════
                                KOLOM KIRI — DAFTAR PRODUK (65%)
                            ════════════════════════════════════════════════ */}
                            <div className="flex-1 min-w-0 border-b lg:border-b-0 lg:border-r border-slate-100">

                                {/* Select all bar */}
                                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
                                    <label className="flex items-center gap-3 cursor-pointer select-none group">
                                        <div
                                            onClick={toggleAll}
                                            className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition cursor-pointer ${
                                                allSelected ? 'bg-pink-400 border-pink-400' : 'border-blue-200 bg-white group-hover:border-pink-300'
                                            }`}
                                        >
                                            {allSelected && (
                                                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                </svg>
                                            )}
                                        </div>
                                        <span className="text-sm font-semibold text-slate-600">
                                            Pilih Semua
                                        </span>
                                    </label>
                                    <div className="flex items-center gap-3">
                                        <span className="text-xs text-slate-400">
                                            {selectedItems.length} / {carts.length} item dipilih
                                        </span>
                                        {selectedItems.length > 0 && (
                                            <span className="text-xs font-bold text-pink-400 bg-pink-50 px-2.5 py-1 rounded-full">
                                                 Siap checkout
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Items list */}
                                <div className="divide-y divide-slate-100">
                                    {carts.map((item, idx) => {
                                        const isSelected = selectedItems.includes(item.id);
                                        const isRemoving = removingId === item.id;

                                        return (
                                            <div
                                                key={item.id}
                                                className={`transition-all duration-300 ${isRemoving ? 'opacity-40 scale-98' : 'opacity-100'} ${isSelected ? 'bg-pink-50/30' : 'bg-white'}`}
                                            >
                                                {/* ── Item row ── */}
                                                <div className="px-6 py-5 flex gap-4">

                                                    {/* Checkbox */}
                                                    <div className="flex-shrink-0 pt-1">
                                                        <div
                                                            onClick={() => toggleItem(item.id)}
                                                            className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition cursor-pointer ${
                                                                isSelected ? 'bg-pink-400 border-pink-400 shadow-sm shadow-pink-200' : 'border-blue-200 bg-white hover:border-pink-300'
                                                            }`}
                                                        >
                                                            {isSelected && (
                                                                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                                </svg>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* Product image */}
                                                    <div className="w-20 h-20 lg:w-[88px] lg:h-[88px] rounded-2xl overflow-hidden flex-shrink-0 border-2 border-pink-100 bg-pink-50 shadow-sm">
                                                        {item.product.image_url ? (
                                                            <img
                                                                src={item.product.image_url}
                                                                alt={item.product.name}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center text-4xl">
                                                                {item.product.image || ''}
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Info */}
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-start justify-between gap-3">
                                                            <div className="min-w-0 flex-1">
                                                                {/* Badge + Name */}
                                                                <div className="flex items-center gap-2 flex-wrap mb-1">
                                                                    <span className="text-[10px] font-bold bg-pink-100 text-pink-500 px-2 py-0.5 rounded-full">
                                                                        {item.product.category || 'Bunga Segar'}
                                                                    </span>
                                                                    <Stars rating={4.8} />
                                                                </div>
                                                                <h3 className="text-[14px] lg:text-base font-bold text-slate-700 leading-snug truncate">
                                                                    {item.product.name}
                                                                </h3>

                                                                {/* Customization chips */}
                                                                <div className="flex flex-wrap gap-1.5 mt-2">
                                                                    {customDetails.map((d) => (
                                                                        <span key={d}
                                                                            className="text-[10px] text-slate-500 bg-slate-100 border border-slate-200 px-2.5 py-0.5 rounded-full font-medium"
                                                                        >
                                                                            {d}
                                                                        </span>
                                                                    ))}
                                                                </div>
                                                            </div>

                                                            {/* Delete button */}
                                                            <button
                                                                onClick={() => removeItem(item.id)}
                                                                disabled={isRemoving}
                                                                className="flex-shrink-0 w-8 h-8 rounded-xl bg-red-50 text-red-400 hover:bg-red-100 hover:text-red-500 flex items-center justify-center transition disabled:opacity-50"
                                                                title="Hapus dari keranjang"
                                                            >
                                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round"
                                                                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                                </svg>
                                                            </button>
                                                        </div>

                                                        {/* Price + Qty row */}
                                                        <div className="flex items-center justify-between mt-3 flex-wrap gap-2">
                                                            <div>
                                                                <p className="text-[10px] text-slate-400 font-medium">Harga Satuan</p>
                                                                <p className="text-base font-extrabold text-pink-400">
                                                                    {fmt(item.product?.price ?? 0)}
                                                                </p>
                                                            </div>

                                                            {/* Qty stepper */}
                                                            <div className="flex items-center gap-0 rounded-2xl border-2 border-blue-200 overflow-hidden bg-white shadow-sm">
                                                                <button
                                                                    onClick={() => updateQty(item.id, item.quantity, -1)}
                                                                    className="w-9 h-9 flex items-center justify-center font-bold text-blue-400 hover:bg-blue-50 transition text-lg leading-none"
                                                                    disabled={item.quantity <= 1}
                                                                >
                                                                    −
                                                                </button>
                                                                <span className="w-10 text-center text-sm font-extrabold text-slate-700 select-none">
                                                                    {item.quantity}
                                                                </span>
                                                                <button
                                                                    onClick={() => updateQty(item.id, item.quantity, 1)}
                                                                    className="w-9 h-9 flex items-center justify-center font-bold text-blue-400 hover:bg-blue-50 transition text-lg leading-none"
                                                                >
                                                                    +
                                                                </button>
                                                            </div>

                                                            <div className="text-right">
                                                                <p className="text-[10px] text-slate-400 font-medium">Subtotal</p>
                                                                <p className="text-sm font-extrabold text-slate-700">
                                                                    {fmt((item.product?.price ?? 0) * item.quantity)}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* ── Card message textarea ── */}
                                                <div className="px-6 pb-5 pl-[calc(1.5rem+20px+1rem+88px+1rem)]">
                                                    <div className="flex items-center gap-1.5 mb-1.5">
                                                        <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round"
                                                                d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                                                        </svg>
                                                        <label className="text-[11px] font-semibold text-slate-400">
                                                            Catatan Ucapan di Kartu <span className="font-normal">(Opsional)</span>
                                                        </label>
                                                    </div>
                                                    <textarea
                                                        rows={2}
                                                        value={cardMessages[item.id] || ''}
                                                        onChange={(e) =>
                                                            setCardMessages((prev) => ({ ...prev, [item.id]: e.target.value }))
                                                        }
                                                        placeholder={`Contoh: "Selamat ulang tahun, semoga selalu bahagia! Dengan cinta "`}
                                                        className="w-full text-xs px-4 py-2.5 rounded-xl border-2 border-blue-100 bg-blue-50/30 text-slate-600 placeholder-slate-300 focus:outline-none focus:border-pink-300 focus:ring-2 focus:ring-pink-100 transition resize-none"
                                                    />
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Add more CTA */}
                                <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/40">
                                    <Link
                                        href={route('dashboard')}
                                        className="inline-flex items-center gap-2 text-sm font-semibold text-blue-400 hover:text-pink-400 transition"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                                        </svg>
                                        Tambah produk lainnya
                                    </Link>
                                </div>
                            </div>

                            {/* ════════════════════════════════════════════════
                                REKOMENDASI APRIORI (Jika ada)
                            ════════════════════════════════════════════════ */}
                            {recommendations && recommendations.length > 0 && (
                                <div className="px-6 py-6 border-t border-slate-100 bg-gradient-to-br from-pink-50/50 to-white">
                                    <div className="flex items-center gap-2 mb-4">
                                        <div className="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center text-pink-500">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                            </svg>
                                        </div>
                                        <h3 className="text-base font-extrabold text-slate-700">Sering Dibeli Bersamaan</h3>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {recommendations.map(prod => (
                                            <div key={prod.id} className="bg-white p-3 rounded-2xl border border-pink-100 shadow-sm flex items-center gap-4 hover:shadow-md transition">
                                                <div className="w-16 h-16 rounded-xl bg-pink-50 overflow-hidden border border-pink-50 shrink-0">
                                                    {prod.image_url ? (
                                                        <img src={prod.image_url} alt={prod.name} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-2xl">{prod.image || ''}</div>
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="text-sm font-bold text-slate-700 truncate">{prod.name}</h4>
                                                    <p className="text-xs font-bold text-pink-500">{fmt(prod.price)}</p>
                                                </div>
                                                <button
                                                    onClick={() => router.post(route('cart.store'), { product_id: prod.id, quantity: 1 }, { preserveScroll: true })}
                                                    className="w-8 h-8 rounded-full bg-pink-50 text-pink-500 hover:bg-pink-500 hover:text-white flex items-center justify-center shrink-0 transition"
                                                    title="Tambah ke Keranjang"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                                    </svg>
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* ════════════════════════════════════════════════
                                KOLOM KANAN — RINGKASAN PEMBAYARAN (35%)
                            ════════════════════════════════════════════════ */}
                            <div className="w-full lg:w-[360px] xl:w-[380px] flex-shrink-0 bg-[#f7fbff]">
                                <div className="px-6 py-6 h-full flex flex-col gap-5">

                                    {/* Header */}
                                    <div className="flex items-center gap-2.5">
                                        <div className="w-8 h-8 rounded-xl bg-blue-100 flex items-center justify-center text-base"></div>
                                        <div>
                                            <h2 className="text-sm font-extrabold text-slate-700">Ringkasan Pembayaran</h2>
                                            <p className="text-[10px] text-slate-400">{selectedItems.length} item dipilih</p>
                                        </div>
                                    </div>

                                    {/* Price breakdown */}
                                    <div className="bg-white rounded-2xl border border-blue-100/80 p-4 space-y-3">
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-slate-500">Total Harga Bunga</span>
                                            <span className="font-semibold text-slate-700">{fmt(subtotal)}</span>
                                        </div>
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-slate-500 flex items-center gap-1.5">
                                                <span className="text-base"></span>
                                                Estimasi Ongkir
                                                <span className="text-[10px] text-slate-400">(Grab Palu)</span>
                                            </span>
                                            <span className="font-semibold text-slate-700">
                                                {ongkir > 0 ? fmt(ongkir) : '—'}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-green-500 flex items-center gap-1.5">
                                                <span className="text-base"></span>
                                                Potongan Diskon Voucher
                                            </span>
                                            <span className="font-semibold text-green-500">
                                                {discountAmt > 0 ? `− ${fmt(discountAmt)}` : 'Rp 0'}
                                            </span>
                                        </div>

                                        <div className="border-t border-dashed border-blue-100 pt-3 flex items-center justify-between">
                                            <span className="text-sm font-extrabold text-slate-700">Total Akhir</span>
                                            <span className="text-xl font-extrabold text-pink-400">{fmt(total)}</span>
                                        </div>
                                    </div>

                                    {/* Voucher input */}
                                    <div>
                                        <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                                            Kode Voucher / Promo
                                        </p>
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                value={voucherCode}
                                                onChange={(e) => setVoucherCode(e.target.value.toUpperCase())}
                                                onKeyDown={(e) => e.key === 'Enter' && applyVoucher()}
                                                placeholder="Ketik kode promo..."
                                                className="flex-1 px-4 py-2.5 rounded-xl border-2 border-blue-200 bg-white text-sm text-slate-700 placeholder-slate-300 font-mono tracking-widest focus:outline-none focus:border-pink-300 focus:ring-2 focus:ring-pink-100 transition"
                                            />
                                            <button
                                                onClick={applyVoucher}
                                                className="px-4 py-2.5 rounded-xl text-sm font-bold text-white bg-blue-400 hover:bg-blue-500 transition shadow-sm active:scale-95 flex-shrink-0"
                                            >
                                                Pakai
                                            </button>
                                        </div>
                                        {voucherMsg && (
                                            <p className={`mt-2 text-xs font-medium ${voucherMsg.ok ? 'text-green-500' : 'text-red-400'}`}>
                                                {voucherMsg.text}
                                            </p>
                                        )}
                                        <p className="mt-1.5 text-[10px] text-slate-400">
                                            Coba kode: <span className="font-bold text-pink-400 tracking-widest cursor-pointer hover:underline"
                                                onClick={() => setVoucherCode('FLORA10')}>FLORA10</span> untuk diskon 10%
                                        </p>
                                    </div>

                                    {/* Delivery info */}
                                    <div className="bg-blue-50 rounded-2xl p-3.5 flex gap-3 items-start border border-blue-100">
                                        <span className="text-xl flex-shrink-0 mt-0.5"></span>
                                        <div>
                                            <p className="text-xs font-bold text-slate-700">Grab Delivery · Ojek Online Palu</p>
                                            <p className="text-[10px] text-slate-500 mt-0.5 leading-relaxed">
                                                Pengiriman ekspres ke seluruh Kota Palu. Estimasi tiba <span className="font-bold text-blue-500">30–60 menit</span> setelah pesanan dikonfirmasi.
                                            </p>
                                        </div>
                                    </div>

                                    {/* Spacer */}
                                    <div className="flex-1" />

                                    {/* ── CTA BUTTON ── */}
                                    <div className="space-y-3 border-t border-blue-100 pt-5">
                                        {selectedItems.length > 0 ? (
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    sessionStorage.setItem('cartCheckoutData', JSON.stringify({
                                                        isCart: true,
                                                        cartIds: selectedItems,
                                                        budget: total,
                                                        itemsText: selectedCarts.map(c => `${c.product.name} (x${c.quantity})`).join(', ')
                                                    }));
                                                    sessionStorage.removeItem('customBouquetData');
                                                    router.get('/checkout');
                                                }}
                                                className="w-full py-4 rounded-2xl text-white font-extrabold text-[15px] tracking-wide flex items-center justify-center gap-2.5 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 shadow-lg"
                                                style={{
                                                    background: 'linear-gradient(135deg, #f472b6 0%, #e879a0 100%)',
                                                    boxShadow: '0 10px 30px rgba(244,114,182,0.40)',
                                                }}
                                            >
                                                Lanjutkan ke Pembayaran &gt;
                                            </button>
                                        ) : (
                                            <button
                                                type="button"
                                                disabled
                                                className="w-full py-4 rounded-2xl bg-slate-200 text-slate-400 font-bold text-sm cursor-not-allowed"
                                            >
                                                Pilih item untuk melanjutkan
                                            </button>
                                        )}

                                        <p className="text-center text-[10px] text-slate-400 flex items-center justify-center gap-1">
                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round"
                                                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                            </svg>
                                            Transaksi aman & terenkripsi · Florabelle.id Palu
                                        </p>
                                    </div>
                                </div>
                            </div>

                        </div>
                    )}
                </div>
            </main>

            {/* ── FOOTER ── */}
            <footer className="text-center text-xs text-slate-300 py-8">
                © 2026 Florabelle.id Palu · Jl. Dayodara – Jl. Meteorologi Blok B2 ·  Dibuat dengan cinta
            </footer>
        </div>
    );
}
