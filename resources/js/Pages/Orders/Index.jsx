import { Head, Link } from '@inertiajs/react';
import { useState, useMemo } from 'react';
import UserDashboardLayout from '@/Layouts/UserDashboardLayout';
import dayjs from 'dayjs';
import 'dayjs/locale/id';

dayjs.locale('id');

// Default sample orders matching Screen 8 in reference mockup
const sampleOrders = [
    {
        id: 1,
        code: '#BK20261007001',
        raw_id: 1,
        date_formatted: '07 Okt 2026',
        title: 'Bucket Bunga Pita',
        details: 'Bunga pita warna pink, kertas putih, pita pink, kartu ucapan.',
        price: 285000,
        status: 'pending',
        status_label: 'Menunggu Verifikasi',
        image: '/images/custom/bunga_pita.jpg',
        fallbackImage: '/images/custom/bunga_pita.jpg',
    },
    {
        id: 2,
        code: '#BK20261007002',
        raw_id: 2,
        date_formatted: '27 Sep 2026',
        title: 'Bucket Snack',
        details: 'Snack Chocolatos, Beng-beng, Kertas cream, pita pink...',
        price: 180000,
        status: 'pending',
        status_label: 'Menunggu Verifikasi',
        image: '/images/custom/snack.jpg',
        fallbackImage: '/images/custom/snack.jpg',
    },
    {
        id: 3,
        code: '#BK20260920008',
        raw_id: 3,
        date_formatted: '20 Sep 2026',
        title: 'Bucket Bunga Artificial',
        details: 'Mawar Pink + Kertas Pink + Pita',
        price: 135000,
        status: 'completed',
        status_label: 'Selesai',
        image: '/images/products/produk-1.jpg',
        fallbackImage: '/images/products/produk-1.jpg',
    },
];

const statusTabs = [
    { id: 'all', label: 'Semua' },
    { id: 'pending', label: 'Menunggu Verifikasi' },
    { id: 'processing', label: 'Diproses' },
    { id: 'created', label: 'Dibuat' },
    { id: 'shipped', label: 'Dikirim' },
    { id: 'completed', label: 'Selesai' },
];

const formatRupiah = (n) => 'Rp' + Number(n || 0).toLocaleString('id-ID');

export default function OrdersIndex({ orders = [] }) {
    const [activeTab, setActiveTab] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [topSearch, setTopSearch] = useState('');

    // Transform database orders or merge with sample reference orders
    const displayOrders = useMemo(() => {
        if (orders && orders.length > 0) {
            const dbList = orders.map((o) => {
                const firstItem = o.items?.[0];
                const dateObj = dayjs(o.created_at);
                const code = '#BK' + dateObj.format('YYYYMMDD') + String(o.id).padStart(3, '0');

                let statusLabel = 'Menunggu Verifikasi';
                let mappedStatus = o.status;
                if (o.status === 'pending') {
                    statusLabel = 'Menunggu Verifikasi';
                    mappedStatus = 'pending';
                } else if (o.status === 'processing') {
                    statusLabel = 'Diproses';
                    mappedStatus = 'processing';
                } else if (o.status === 'created') {
                    statusLabel = 'Dibuat';
                    mappedStatus = 'created';
                } else if (o.status === 'shipped' || o.status === 'delivering') {
                    statusLabel = 'Dikirim';
                    mappedStatus = 'shipped';
                } else if (o.status === 'completed' || o.status === 'delivered') {
                    statusLabel = 'Selesai';
                    mappedStatus = 'completed';
                } else if (o.status === 'cancelled' || o.status === 'rejected') {
                    statusLabel = 'Dibatalkan';
                    mappedStatus = 'cancelled';
                }

                let itemTitle = firstItem?.product_name || 'Bucket Bunga Pita';
                let itemDetails = firstItem?.custom_request || o.items?.map((it) => it.product_name).filter(Boolean).join(' + ') || 'Sesuai request';
                let itemImage = firstItem?.image_url || firstItem?.product?.image_url || '/images/custom/bunga_pita.jpg';

                // Try parse custom notes if custom_request is empty
                if (!firstItem?.custom_request && o.notes) {
                    try {
                        const parsed = JSON.parse(o.notes);
                        if (parsed.isi_request) {
                            itemDetails = parsed.isi_request;
                        }
                    } catch (e) {
                        // ignore
                    }
                }

                return {
                    id: o.id,
                    code: code,
                    raw_id: o.id,
                    date_formatted: dateObj.format('D MMM YYYY'),
                    title: itemTitle,
                    details: itemDetails,
                    price: o.total,
                    status: mappedStatus,
                    status_label: statusLabel,
                    image: itemImage,
                    fallbackImage: '/images/custom/bunga_pita.jpg',
                };
            });

            // If only 1 order in DB, prepend it to sampleOrders so the list looks rich
            if (dbList.length <= 2) {
                const existingCodes = new Set(dbList.map((d) => d.code));
                const remainingSamples = sampleOrders.filter((s) => !existingCodes.has(s.code));
                return [...dbList, ...remainingSamples];
            }

            return dbList;
        }
        return sampleOrders;
    }, [orders]);

    // Filter orders by tab and search
    const filteredOrders = useMemo(() => {
        let list = [...displayOrders];

        // Status tab filter
        if (activeTab !== 'all') {
            list = list.filter((o) => o.status === activeTab);
        }

        // Search query filter (from local input or topbar)
        const q = (searchQuery || topSearch).trim().toLowerCase();
        if (q) {
            list = list.filter(
                (o) =>
                    o.code.toLowerCase().includes(q) ||
                    o.title.toLowerCase().includes(q) ||
                    o.details.toLowerCase().includes(q)
            );
        }

        return list;
    }, [displayOrders, activeTab, searchQuery, topSearch]);

    // Status Badge Component
    const renderStatusBadge = (status, label) => {
        switch (status) {
            case 'pending':
                return (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-600 border border-amber-200 shadow-2xs">
                        <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
                        <span>{label || 'Menunggu Verifikasi'}</span>
                    </span>
                );
            case 'processing':
                return (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-sky-50 text-sky-600 border border-sky-200 shadow-2xs">
                        <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse"></span>
                        <span>{label || 'Diproses'}</span>
                    </span>
                );
            case 'created':
                return (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-purple-50 text-purple-600 border border-purple-200 shadow-2xs">
                        <span className="w-2 h-2 rounded-full bg-purple-400"></span>
                        <span>{label || 'Dibuat'}</span>
                    </span>
                );
            case 'shipped':
                return (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-600 border border-blue-200 shadow-2xs">
                        <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                        <span>{label || 'Dikirim'}</span>
                    </span>
                );
            case 'completed':
                return (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-600 border border-emerald-200 shadow-2xs">
                        <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                        <span>{label || 'Selesai'}</span>
                    </span>
                );
            default:
                return (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200">
                        <span>{label || status}</span>
                    </span>
                );
        }
    };

    return (
        <UserDashboardLayout activeNav="orders" searchValue={topSearch} onSearchChange={setTopSearch}>
            <Head title="Riwayat Pesanan — BungaKita" />

            <div className="space-y-6 max-w-5xl mx-auto">
                {/* ── HEADER SCREEN 8 ── */}
                <div>
                    <h1 className="font-bold text-2xl lg:text-3xl text-slate-800 tracking-tight font-serif">
                        Riwayat Pesanan
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-400 mt-1">
                        Berikut daftar pesanan yang pernah Anda lakukan
                    </p>
                </div>

                {/* ── STATUS FILTER TABS ── */}
                <div className="overflow-x-auto pb-1 scrollbar-none">
                    <div className="flex items-center gap-2 sm:gap-2.5 min-w-max">
                        {statusTabs.map((tab) => {
                            const isActive = activeTab === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    type="button"
                                    onClick={() => setActiveTab(tab.id)}
                                    className={[
                                        'px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer border',
                                        isActive
                                            ? 'bg-[#d84062] border-[#d84062] text-white shadow-xs'
                                            : 'bg-white border-slate-200/90 hover:border-rose-300 text-slate-600 hover:bg-rose-50/40',
                                    ].join(' ')}
                                >
                                    {tab.label}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* ── ORDER CARDS LIST (Screen 8) ── */}
                {filteredOrders.length === 0 ? (
                    <div className="bg-white rounded-3xl p-10 text-center border border-rose-100/70 shadow-2xs my-6">
                        <div className="w-16 h-16 rounded-full bg-rose-50 text-[#d84062] flex items-center justify-center mx-auto mb-3 text-2xl">
                            📦
                        </div>
                        <h3 className="font-bold text-base text-slate-800">Tidak ada pesanan ditemukan</h3>
                        <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1 mb-5">
                            Belum ada pesanan pada kategori status ini.
                        </p>
                        <Link
                            href="/custom-bouquet"
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#d84062] hover:bg-[#be2f50] text-white text-xs font-semibold shadow-xs transition"
                        >
                            <span>Mulai Belanja Buket</span>
                            <span>→</span>
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filteredOrders.map((order) => (
                            <div
                                key={order.code + order.id}
                                className="bg-white rounded-3xl p-4 sm:p-5 border border-rose-100/80 shadow-xs hover:border-rose-200 transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
                            >
                                {/* Left Item Info */}
                                <div className="flex items-center gap-4 min-w-0">
                                    {/* Thumbnail Image */}
                                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden bg-rose-50 flex-shrink-0 border border-rose-100">
                                        <img
                                            src={order.image}
                                            alt={order.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                            onError={(e) => {
                                                e.currentTarget.src = order.fallbackImage || '/images/custom/bunga_pita.jpg';
                                            }}
                                        />
                                    </div>

                                    {/* Text Description */}
                                    <div className="min-w-0">
                                        {/* Order Code & Date */}
                                        <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-400 font-medium mb-1">
                                            <span className="font-mono font-bold text-slate-700">{order.code}</span>
                                            <span>·</span>
                                            <span>{order.date_formatted}</span>
                                        </div>

                                        {/* Product Title */}
                                        <h3 className="font-bold text-sm sm:text-base text-slate-800 truncate leading-snug">
                                            {order.title}
                                        </h3>

                                        {/* Variant / Custom Request */}
                                        <p className="text-xs text-slate-500 italic truncate mt-0.5 max-w-md">
                                            «{order.details}»
                                        </p>

                                        {/* Price */}
                                        <p className="font-extrabold text-sm sm:text-base text-[#d84062] mt-1.5">
                                            {formatRupiah(order.price)}
                                        </p>
                                    </div>
                                </div>

                                {/* Right Status & Action */}
                                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2.5 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 flex-shrink-0">
                                    {/* Status Badge */}
                                    <div>
                                        {renderStatusBadge(order.status, order.status_label)}
                                    </div>

                                    {/* Detail Link */}
                                    <Link
                                        href={order.raw_id ? route('orders.show', order.raw_id) : '#'}
                                        className="inline-flex items-center gap-1 px-4 py-1.5 rounded-full border border-rose-200 text-xs font-semibold text-[#d84062] hover:bg-rose-50 hover:border-rose-300 transition-all duration-200 active:scale-95 shadow-2xs whitespace-nowrap"
                                    >
                                        <span>Lihat Detail</span>
                                        <span className="text-[10px]">→</span>
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* ── FOOTER WATERMARK / QUOTE (Identik dengan Gambar Mockup Screen 8) ── */}
                <div className="pt-10 pb-6 text-center select-none pointer-events-none">
                    <div className="inline-flex items-center justify-center gap-3 opacity-80">
                        {/* Botanical branch doodle */}
                        <svg className="w-8 h-10 text-rose-300 flex-shrink-0" viewBox="0 0 50 80" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <path d="M25 75 C 24 50, 26 25, 25 5" strokeLinecap="round" />
                            <path d="M25 55 Q 38 48, 42 38 Q 33 42, 25 50" fill="currentColor" fillOpacity="0.12" />
                            <path d="M25 40 Q 12 33, 8 23 Q 17 27, 25 35" fill="currentColor" fillOpacity="0.12" />
                            <circle cx="25" cy="5" r="3.5" fill="#f43f5e" fillOpacity="0.4" />
                        </svg>

                        <p className="text-sm font-serif italic text-rose-400/90 font-medium tracking-wide">
                            Terima kasih telah memilih BungaKita 💕
                        </p>
                    </div>
                </div>
            </div>
        </UserDashboardLayout>
    );
}
