import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import UserDashboardLayout from '@/Layouts/UserDashboardLayout';

const formatRupiah = (n) => 'Rp' + Number(n || 0).toLocaleString('id-ID');
const ONGKIR = 15000;

export default function CartIndex({ carts = [], recommendations = [] }) {
    const { flash } = usePage().props;
    const [editingItem, setEditingItem] = useState(null);
    const [editedRequestText, setEditedRequestText] = useState('');
    const [deletingId, setDeletingId] = useState(null);

    // Hitung total belanja
    const subtotal = carts.reduce((sum, item) => {
        const itemPrice = item.custom_price ?? (item.product ? item.product.price : 150000);
        return sum + (itemPrice * item.quantity);
    }, 0);

    const totalItemsCount = carts.reduce((sum, item) => sum + item.quantity, 0);
    const totalPembayaran = carts.length > 0 ? subtotal + ONGKIR : 0;

    // Update quantity
    const handleUpdateQty = (cartId, currentQty, delta) => {
        const newQty = currentQty + delta;
        if (newQty < 1) return;
        router.put(route('cart.update', cartId), { quantity: newQty }, {
            preserveScroll: true,
        });
    };

    // Delete item
    const handleDeleteItem = (cartId) => {
        if (!confirm('Hapus bucket ini dari keranjang?')) return;
        setDeletingId(cartId);
        router.delete(route('cart.destroy', cartId), {
            preserveScroll: true,
            onFinish: () => setDeletingId(null),
        });
    };

    // Open edit request modal
    const handleOpenEdit = (item) => {
        setEditingItem(item);
        setEditedRequestText(item.custom_request || '');
    };

    // Save edited request
    const handleSaveRequest = (e) => {
        e.preventDefault();
        if (!editingItem) return;
        router.put(route('cart.update', editingItem.id), {
            custom_request: editedRequestText,
        }, {
            preserveScroll: true,
            onSuccess: () => setEditingItem(null),
        });
    };

    // Reset dummy data
    const handleResetDummy = () => {
        router.post(route('cart.reset-dummy'), {}, {
            preserveScroll: true,
        });
    };

    return (
        <UserDashboardLayout activeNav="cart">
            <Head title="Keranjang Belanja — BungaKita" />

            {/* Flash Message */}
            {flash?.success && (
                <div className="mb-5 p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs rounded-2xl flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span>✓</span>
                        <span>{flash.success}</span>
                    </div>
                </div>
            )}

            {/* Header Screen 1 */}
            <div className="flex items-center gap-3.5 mb-6">
                <div className="w-10 h-10 rounded-2xl bg-rose-100/80 text-[#d84062] flex items-center justify-center shadow-xs">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                </div>
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold font-serif text-slate-800 tracking-tight">
                        Keranjang Belanja
                    </h1>
                    <p className="text-xs text-slate-400 mt-0.5">
                        Berikut adalah pesanan bucket yang telah kamu pilih.
                    </p>
                </div>
            </div>

            {carts.length === 0 ? (
                /* Empty Cart State */
                <div className="bg-white rounded-3xl p-10 sm:p-14 border border-rose-100/80 text-center shadow-xs max-w-2xl mx-auto my-6">
                    <div className="w-20 h-20 rounded-full bg-rose-50 text-[#d84062] flex items-center justify-center mx-auto mb-4 text-3xl">
                        🛒
                    </div>
                    <h3 className="text-lg font-bold text-slate-800 mb-1">
                        Keranjang kamu masih kosong.
                    </h3>
                    <p className="text-xs text-slate-400 max-w-sm mx-auto mb-6">
                        Belum ada bucket yang dipilih. Yuk jelajahi kreasi bucket impianmu sekarang!
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                        <Link
                            href={route('custom.index')}
                            className="px-6 py-2.5 rounded-full bg-[#d84062] hover:bg-[#be2f50] text-white text-xs font-bold shadow-md shadow-rose-200 transition active:scale-95"
                        >
                            Mulai Belanja
                        </Link>
                        <button
                            type="button"
                            onClick={handleResetDummy}
                            className="px-5 py-2.5 rounded-full bg-rose-50 hover:bg-rose-100 text-[#d84062] text-xs font-semibold border border-rose-200 transition active:scale-95 cursor-pointer"
                        >
                            Muat Data Contoh Mockup
                        </button>
                    </div>
                </div>
            ) : (
                /* Active Cart Screen */
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                    {/* Left Column: Daftar Pesanan */}
                    <div className="lg:col-span-2 space-y-4">
                        {carts.map((item) => {
                            const name = item.custom_name ?? (item.product ? item.product.name : 'Bucket Bunga');
                            const image = item.custom_image ?? (item.product?.image_url || '/images/custom/bunga_pita.jpg');
                            const price = item.custom_price ?? (item.product ? item.product.price : 150000);
                            const requestSummary = item.custom_request || 'Sesuai pesanan custom';

                            return (
                                <div
                                    key={item.id}
                                    className="bg-white rounded-3xl p-4 sm:p-5 border border-rose-100/80 shadow-xs hover:border-rose-200 transition flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                                >
                                    <div className="flex items-start gap-4 flex-1 min-w-0">
                                        {/* Foto Bucket */}
                                        <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden bg-rose-50 flex-shrink-0 border border-rose-100/70">
                                            <img
                                                src={image}
                                                alt={name}
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    e.currentTarget.src = '/images/custom/bunga_pita.jpg';
                                                }}
                                            />
                                        </div>

                                        {/* Detail Bucket */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                                                <h3 className="font-bold text-slate-800 text-sm sm:text-base leading-snug">
                                                    {name}
                                                </h3>
                                                <span className="px-2 py-0.5 rounded-full bg-rose-50 text-[#d84062] border border-rose-200/60 text-[10px] font-semibold">
                                                    Custom Request
                                                </span>
                                            </div>

                                            {/* Ringkasan Request */}
                                            <p className="text-xs text-slate-500 italic leading-relaxed line-clamp-2">
                                                «{requestSummary}»
                                            </p>

                                            {/* Tombol Edit Request */}
                                            <div className="mt-2 flex items-center gap-3">
                                                <button
                                                    type="button"
                                                    onClick={() => handleOpenEdit(item)}
                                                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#d84062] hover:text-[#be2f50] hover:underline cursor-pointer"
                                                >
                                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                                    </svg>
                                                    Edit Request
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Kolom Harga & Qty & Hapus */}
                                    <div className="flex items-center sm:flex-col sm:items-end justify-between w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                                        <div className="text-right">
                                            <span className="text-[10px] text-slate-400 block sm:hidden">Harga:</span>
                                            <span className="font-extrabold text-[#d84062] text-sm sm:text-base">
                                                {formatRupiah(price)}
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-3 mt-2 sm:mt-3">
                                            {/* Quantity Pill */}
                                            <div className="flex items-center border border-rose-200 rounded-full bg-[#fffbfa] px-1 py-0.5 shadow-2xs">
                                                <button
                                                    type="button"
                                                    onClick={() => handleUpdateQty(item.id, item.quantity, -1)}
                                                    disabled={item.quantity <= 1}
                                                    className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-slate-600 hover:bg-rose-100 disabled:opacity-30 cursor-pointer"
                                                >
                                                    -
                                                </button>
                                                <span className="w-7 text-center text-xs font-bold text-slate-700">
                                                    {item.quantity}
                                                </span>
                                                <button
                                                    type="button"
                                                    onClick={() => handleUpdateQty(item.id, item.quantity, 1)}
                                                    className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-slate-600 hover:bg-rose-100 cursor-pointer"
                                                >
                                                    +
                                                </button>
                                            </div>

                                            {/* Tombol Hapus */}
                                            <button
                                                type="button"
                                                onClick={() => handleDeleteItem(item.id)}
                                                disabled={deletingId === item.id}
                                                className="w-8 h-8 rounded-full flex items-center justify-center text-rose-400 hover:text-red-600 hover:bg-red-50 border border-transparent hover:border-red-100 transition cursor-pointer"
                                                title="Hapus dari keranjang"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}

                        {/* Link Lanjut Belanja di Bawah List */}
                        <div className="pt-2 flex items-center justify-between">
                            <Link
                                href={route('custom.index')}
                                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#d84062] hover:text-[#be2f50] hover:underline"
                            >
                                <span>←</span>
                                <span>Lanjut Belanja</span>
                            </Link>

                            <button
                                type="button"
                                onClick={handleResetDummy}
                                className="text-[11px] text-slate-400 hover:text-slate-600 underline cursor-pointer"
                            >
                                Muat Ulang Contoh Mockup
                            </button>
                        </div>
                    </div>

                    {/* Right Column: Ringkasan Belanja */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-3xl p-6 border border-rose-100/90 shadow-sm sticky top-24">
                            <h2 className="font-bold text-slate-800 text-base mb-4 font-serif">
                                Ringkasan Belanja
                            </h2>

                            <div className="space-y-3 text-xs">
                                <div className="flex items-center justify-between text-slate-600">
                                    <span>Total Harga ({totalItemsCount} barang)</span>
                                    <span className="font-semibold text-slate-800">{formatRupiah(subtotal)}</span>
                                </div>
                                <div className="flex items-center justify-between text-slate-600">
                                    <span>Ongkos Kirim</span>
                                    <span className="font-semibold text-slate-800">{formatRupiah(ONGKIR)}</span>
                                </div>
                            </div>

                            <div className="border-t border-rose-100/70 my-4"></div>

                            <div className="flex items-center justify-between mb-5">
                                <span className="font-bold text-slate-800 text-sm">Total Pembayaran</span>
                                <span className="font-extrabold text-[#d84062] text-xl">
                                    {formatRupiah(totalPembayaran)}
                                </span>
                            </div>

                            {/* Tombol Checkout Sekarang */}
                            <Link
                                href={route('checkout.index')}
                                className="w-full py-3.5 px-4 rounded-2xl bg-[#d84062] hover:bg-[#be2f50] text-white text-xs sm:text-sm font-bold shadow-md shadow-rose-200 transition active:scale-98 flex items-center justify-center gap-2 block text-center"
                            >
                                <span>Checkout Sekarang</span>
                                <span>→</span>
                            </Link>

                            {/* Estimasi Pengiriman Badge */}
                            <div className="mt-4 p-3 rounded-2xl bg-rose-50/50 border border-rose-100/70 flex items-center gap-2.5 text-[11px] text-slate-500">
                                <span className="text-base flex-shrink-0">🚚</span>
                                <span>Estimasi pengiriman 2 - 4 hari (Tergantung lokasi)</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Edit Request */}
            {editingItem && (
                <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-rose-100 animate-in zoom-in-95">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold text-slate-800 text-sm">
                                Edit Request Bucket
                            </h3>
                            <button
                                type="button"
                                onClick={() => setEditingItem(null)}
                                className="text-slate-400 hover:text-slate-600 text-sm p-1"
                            >
                                ✕
                            </button>
                        </div>
                        <p className="text-xs text-slate-500 mb-3">
                            Ubah catatan request untuk <strong>{editingItem.custom_name || editingItem.product?.name}</strong>:
                        </p>
                        <form onSubmit={handleSaveRequest}>
                            <textarea
                                value={editedRequestText}
                                onChange={(e) => setEditedRequestText(e.target.value)}
                                rows={4}
                                className="w-full text-xs p-3 border border-rose-200 rounded-2xl focus:ring-2 focus:ring-rose-200 focus:outline-none mb-4 text-slate-700"
                                placeholder="Tuliskan warna bunga, kertas pembungkus, pita, atau ucapan khusus..."
                            ></textarea>
                            <div className="flex items-center justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => setEditingItem(null)}
                                    className="px-4 py-2 rounded-xl text-xs text-slate-500 hover:bg-slate-100 font-semibold"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    className="px-5 py-2 rounded-xl text-xs text-white bg-[#d84062] hover:bg-[#be2f50] font-bold shadow-xs"
                                >
                                    Simpan Perubahan
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </UserDashboardLayout>
    );
}
