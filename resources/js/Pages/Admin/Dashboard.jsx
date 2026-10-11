import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { useState } from 'react';
import { 
    ShoppingBag, 
    Clock, 
    Wallet, 
    ArrowUpRight, 
    Calendar, 
    ChevronRight, 
    BarChart3, 
    PieChart,
    X,
    CheckCircle2,
    Truck,
    MapPin,
    Phone,
    Mail,
    FileText,
    Check,
    ExternalLink,
    ShieldCheck,
    AlertCircle
} from 'lucide-react';

export default function AdminDashboard({ auth, stats, recentOrders = [], weeklySales = [], statusDistribution }) {
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [updatingStatus, setUpdatingStatus] = useState(false);
    const [rejectReason, setRejectReason] = useState('');
    const [showRejectInput, setShowRejectInput] = useState(false);
    const [verifyingPayment, setVerifyingPayment] = useState(false);

    const openOrderDetail = (order) => {
        setSelectedOrder(order);
        setIsDetailModalOpen(true);
    };

    const closeOrderDetail = () => {
        setIsDetailModalOpen(false);
        setSelectedOrder(null);
        setShowRejectInput(false);
        setRejectReason('');
    };

    const handleVerifyPayment = (action, customReason = null) => {
        if (!selectedOrder) return;
        setVerifyingPayment(true);
        router.patch(route('admin.orders.verify-payment', selectedOrder.raw_id || selectedOrder.id), {
            action: action,
            reason: customReason || rejectReason,
        }, {
            preserveScroll: true,
            onSuccess: () => {
                setVerifyingPayment(false);
                setShowRejectInput(false);
                setRejectReason('');
                closeOrderDetail();
            },
            onError: () => setVerifyingPayment(false),
        });
    };

    const handleUpdateStatus = (newStatus) => {
        if (!selectedOrder) return;
        setUpdatingStatus(true);
        router.patch(route('admin.orders.status.update', selectedOrder.raw_id || selectedOrder.id), {
            status: newStatus
        }, {
            preserveScroll: true,
            onSuccess: () => {
                setUpdatingStatus(false);
                closeOrderDetail();
            },
            onError: () => setUpdatingStatus(false),
        });
    };

    const getStatusBadge = (statusKey, label) => {
        switch (statusKey) {
            case 'waiting_verification':
                return 'bg-purple-50 text-purple-700 border border-purple-200/80 font-bold';
            case 'pending':
                return 'bg-amber-50 text-amber-600 border border-amber-200/60';
            case 'processing':
                return 'bg-pink-50 text-pink-600 border border-pink-200/60';
            case 'completed':
                return 'bg-emerald-50 text-emerald-600 border border-emerald-200/60';
            case 'cancelled':
                return 'bg-slate-100 text-slate-600 border border-slate-200/60';
            default:
                return 'bg-slate-50 text-slate-700 border border-slate-200';
        }
    };

    // Calculation for Weekly Sales Bar Chart
    const maxSaleValue = Math.max(...weeklySales.map(d => d.sales), 1000000);
    // Round up ceiling to nice increments
    const chartCeiling = Math.ceil(maxSaleValue / 200000) * 200000 || 1000000;

    // Calculation for Donut Chart
    const donutTotal = statusDistribution?.total || 1;
    let accumulatedAngle = 0;
    const donutSegments = (statusDistribution?.items || []).map((item) => {
        const angle = (item.count / donutTotal) * 360;
        const segment = {
            ...item,
            startAngle: accumulatedAngle,
            angle: angle,
        };
        accumulatedAngle += angle;
        return segment;
    });

    return (
        <AdminLayout
            title="Panel Kelola Toko"
            subtitle="Florabelle.id - Artificial Flower Bouquet Shop"
            quote="Bunga Abadi Untuk Setiap Momen Spesial 💕"
        >
            <Head title="Dashboard Admin - Florabelle.id" />

            <div className="space-y-6 max-w-7xl mx-auto">
                {/* Greeting & Date Section */}
                <div className="bg-white rounded-3xl p-6 border border-pink-100/60 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-xl sm:text-2xl font-bold font-serif text-slate-800">
                            Selamat datang kembali, {auth?.user?.name || 'Admin Florabelle'}! 👋
                        </h2>
                        <p className="text-xs sm:text-sm text-slate-500 mt-1">
                            Berikut adalah ringkasan performa toko Anda hari ini.
                        </p>
                    </div>

                    <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-pink-50/70 border border-pink-100 text-pink-700 text-xs font-semibold self-start sm:self-auto shrink-0 shadow-2xs">
                        <Calendar size={15} className="text-pink-500" />
                        <span>{stats?.currentDateFormatted || 'Sabtu, 11 Oktober 2026'}</span>
                    </div>
                </div>

                {/* 3 Main Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {/* 1. Pesanan Hari Ini */}
                    <div className="bg-white rounded-3xl p-6 border border-pink-100/60 shadow-xs flex items-center gap-4 hover:shadow-md transition-shadow">
                        <div className="w-14 h-14 rounded-2xl bg-[#fde2e8] text-pink-600 flex items-center justify-center text-2xl shrink-0 shadow-inner">
                            <ShoppingBag size={26} className="text-pink-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-slate-400">Pesanan Hari Ini</p>
                            <h3 className="text-2xl lg:text-3xl font-extrabold text-slate-900 mt-0.5 tracking-tight">
                                {stats?.ordersToday ?? 0}
                            </h3>
                            <div className="flex items-center gap-1 mt-1 text-[11px] font-medium text-emerald-600">
                                <ArrowUpRight size={13} className="text-emerald-500" />
                                <span>{stats?.ordersTodayTrend || '10% dari kemarin'}</span>
                            </div>
                        </div>
                    </div>

                    {/* 2. Pesanan Belum Diproses */}
                    <div className="bg-white rounded-3xl p-6 border border-pink-100/60 shadow-xs flex items-center gap-4 hover:shadow-md transition-shadow">
                        <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center text-2xl shrink-0 shadow-inner">
                            <Clock size={26} className="text-amber-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-slate-400">Pesanan Belum Diproses</p>
                            <h3 className="text-2xl lg:text-3xl font-extrabold text-slate-900 mt-0.5 tracking-tight">
                                {stats?.unprocessedOrders ?? 0}
                            </h3>
                            <p className="text-[11px] font-medium text-amber-600 mt-1">
                                Perlu ditindaklanjuti
                            </p>
                        </div>
                    </div>

                    {/* 3. Pendapatan Bulan Ini */}
                    <div className="bg-white rounded-3xl p-6 border border-pink-100/60 shadow-xs flex items-center gap-4 hover:shadow-md transition-shadow">
                        <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-2xl shrink-0 shadow-inner">
                            <Wallet size={26} className="text-emerald-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-slate-400">Pendapatan Bulan Ini</p>
                            <h3 className="text-xl lg:text-2xl font-extrabold text-slate-900 mt-0.5 tracking-tight truncate">
                                {stats?.incomeThisMonthFormatted || 'Rp 0'}
                            </h3>
                            <div className="flex items-center gap-1 mt-1 text-[11px] font-medium text-emerald-600">
                                <ArrowUpRight size={13} className="text-emerald-500" />
                                <span>{stats?.incomeTrend || '15% dari bulan lalu'}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Aktivitas Pesanan Terbaru */}
                <div className="bg-white rounded-3xl border border-pink-100/60 shadow-xs overflow-hidden">
                    <div className="px-6 py-4.5 border-b border-pink-50 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span className="text-pink-500 font-bold text-base">🌸</span>
                            <h3 className="text-sm sm:text-base font-bold text-slate-800">
                                Aktivitas Pesanan Terbaru
                            </h3>
                        </div>
                        <Link 
                            href={route('admin.orders.index')}
                            className="inline-flex items-center gap-1 text-xs font-bold text-pink-600 hover:text-pink-700 transition"
                        >
                            <span>Lihat Semua</span>
                            <ChevronRight size={14} />
                        </Link>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-pink-50/30 text-slate-400 text-xs font-semibold uppercase tracking-wider">
                                    <th className="px-6 py-3.5 border-b border-pink-50">ID Pesanan</th>
                                    <th className="px-6 py-3.5 border-b border-pink-50">Pelanggan</th>
                                    <th className="px-6 py-3.5 border-b border-pink-50">Produk</th>
                                    <th className="px-6 py-3.5 border-b border-pink-50">Status</th>
                                    <th className="px-6 py-3.5 border-b border-pink-50">Total</th>
                                    <th className="px-6 py-3.5 border-b border-pink-50 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="text-xs divide-y divide-pink-50/60">
                                {recentOrders.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-10 text-center text-slate-400">
                                            Belum ada aktivitas pesanan terbaru.
                                        </td>
                                    </tr>
                                ) : (
                                    recentOrders.map((order, idx) => (
                                        <tr key={idx} className="hover:bg-pink-50/20 transition-colors">
                                            <td className="px-6 py-4 font-bold text-slate-800">
                                                {order.id}
                                            </td>
                                            <td className="px-6 py-4 text-slate-700 font-semibold">
                                                {order.customer_name}
                                            </td>
                                            <td className="px-6 py-4 text-slate-600">
                                                {order.product_name}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-block px-3 py-1 rounded-full text-[11px] font-bold ${getStatusBadge(order.status, order.status_label)}`}>
                                                    {order.status_label}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 font-bold text-slate-800">
                                                {order.total_formatted}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button 
                                                    onClick={() => openOrderDetail(order)}
                                                    className="px-3.5 py-1.5 rounded-xl bg-pink-50 text-pink-600 hover:bg-pink-100 font-bold text-xs transition border border-pink-200/50"
                                                >
                                                    Detail
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Bottom Row: 2 Visual Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left: Grafik Penjualan Mingguan (2 Columns wide on LG) */}
                    <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-pink-100/60 shadow-xs flex flex-col justify-between">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded-xl bg-pink-100/60 text-pink-600 flex items-center justify-center">
                                    <BarChart3 size={17} />
                                </div>
                                <h3 className="text-sm font-bold text-slate-800">
                                    Grafik Penjualan Mingguan
                                </h3>
                            </div>
                            <span className="text-[11px] px-3 py-1 rounded-full bg-slate-100 text-slate-600 font-semibold border border-slate-200/60">
                                7 Hari Terakhir
                            </span>
                        </div>

                        {/* Bar Chart Area */}
                        <div className="h-56 w-full flex items-end gap-3 sm:gap-6 pt-4 pb-2 border-b border-slate-100 relative">
                            {/* Horizontal guide lines */}
                            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-20">
                                <div className="border-b border-slate-300 w-full"></div>
                                <div className="border-b border-slate-300 w-full"></div>
                                <div className="border-b border-slate-300 w-full"></div>
                                <div className="border-b border-slate-300 w-full"></div>
                            </div>

                            {weeklySales.map((day, idx) => {
                                const heightPercent = chartCeiling > 0 ? Math.min(100, Math.max(4, Math.round((day.sales / chartCeiling) * 100))) : 4;
                                const isPositive = day.sales > 0;

                                return (
                                    <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end z-10 group relative">
                                        {/* Hover Tooltip */}
                                        <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-[10px] py-1 px-2.5 rounded-lg whitespace-nowrap pointer-events-none z-20 shadow-lg">
                                            {day.sales_formatted} ({day.order_count} pesanan)
                                        </div>

                                        {/* Bar */}
                                        <div 
                                            style={{ height: `${heightPercent}%` }}
                                            className={`w-full max-w-[42px] rounded-t-xl transition-all duration-500 ${
                                                isPositive 
                                                    ? 'bg-gradient-to-t from-pink-400 to-rose-300 group-hover:from-pink-500 group-hover:to-rose-400 shadow-xs' 
                                                    : 'bg-slate-100'
                                            }`}
                                        />
                                        <span className="text-[11px] text-slate-400 font-semibold mt-2.5 truncate w-full text-center">
                                            {day.label}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Chart Legend / Scale Info */}
                        <div className="flex items-center justify-between text-[11px] text-slate-400 pt-3">
                            <span>Mulai: {weeklySales[0]?.label || '-'}</span>
                            <span>Maksimal Skala: Rp {chartCeiling.toLocaleString('id-ID')}</span>
                            <span>Sampai: {weeklySales[weeklySales.length - 1]?.label || '-'}</span>
                        </div>
                    </div>

                    {/* Right: Grafik Status Pesanan (Donut Chart) */}
                    <div className="bg-white rounded-3xl p-6 border border-pink-100/60 shadow-xs flex flex-col justify-between">
                        <div className="flex items-center gap-2.5 mb-4">
                            <div className="w-8 h-8 rounded-xl bg-pink-100/60 text-pink-600 flex items-center justify-center">
                                <PieChart size={17} />
                            </div>
                            <h3 className="text-sm font-bold text-slate-800">
                                Status Pesanan
                            </h3>
                        </div>

                        {/* Donut and Legend Layout */}
                        <div className="flex flex-col items-center justify-center my-auto py-2">
                            {/* SVG Donut */}
                            <div className="relative w-36 h-36 flex items-center justify-center">
                                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                                    {/* Background Circle */}
                                    <circle
                                        cx="50"
                                        cy="50"
                                        r="38"
                                        fill="transparent"
                                        stroke="#f1f5f9"
                                        strokeWidth="15"
                                    />

                                    {/* Segments */}
                                    {donutSegments.map((seg, i) => {
                                        const radius = 38;
                                        const circumference = 2 * Math.PI * radius;
                                        const strokeDasharray = `${(seg.count / donutTotal) * circumference} ${circumference}`;
                                        const strokeDashoffset = -((seg.startAngle / 360) * circumference);

                                        if (seg.count === 0) return null;

                                        return (
                                            <circle
                                                key={i}
                                                cx="50"
                                                cy="50"
                                                r={radius}
                                                fill="transparent"
                                                stroke={seg.color}
                                                strokeWidth="15"
                                                strokeDasharray={strokeDasharray}
                                                strokeDashoffset={strokeDashoffset}
                                                className="transition-all duration-700 ease-out"
                                            />
                                        );
                                    })}
                                </svg>

                                {/* Center Count */}
                                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                                    <span className="text-2xl font-extrabold text-slate-800 leading-none">
                                        {statusDistribution?.total ?? 0}
                                    </span>
                                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">
                                        Total
                                    </span>
                                </div>
                            </div>

                            {/* Legend with exact count and percentage */}
                            <div className="w-full mt-6 space-y-2">
                                {(statusDistribution?.items || []).map((st, i) => (
                                    <div key={i} className="flex items-center justify-between text-xs py-0.5">
                                        <div className="flex items-center gap-2">
                                            <span 
                                                className="w-2.5 h-2.5 rounded-full shrink-0" 
                                                style={{ backgroundColor: st.color }}
                                            />
                                            <span className="text-slate-600 font-medium">{st.label}</span>
                                        </div>
                                        <div className="font-bold text-slate-800">
                                            {st.count} <span className="text-slate-400 font-normal">({st.percentage}%)</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal Detail Pesanan */}
            {isDetailModalOpen && selectedOrder && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div 
                        className="absolute inset-0 bg-slate-900/50 backdrop-blur-xs"
                        onClick={closeOrderDetail}
                    />

                    <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden border border-pink-100 animate-in zoom-in-95 duration-150">
                        {/* Modal Header */}
                        <div className="px-6 py-4.5 border-b border-pink-50 flex items-center justify-between bg-pink-50/30 shrink-0">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-2xl bg-pink-100 flex items-center justify-center text-pink-600 font-bold text-sm">
                                    🌸
                                </div>
                                <div>
                                    <h3 className="text-base font-bold text-slate-800">
                                        Detail Pesanan {selectedOrder.id}
                                    </h3>
                                    <p className="text-xs text-slate-400">
                                        {selectedOrder.created_at}
                                    </p>
                                </div>
                            </div>
                            <button 
                                onClick={closeOrderDetail}
                                className="w-8 h-8 rounded-full bg-white text-slate-400 hover:text-slate-600 flex items-center justify-center shadow-xs border border-slate-100"
                            >
                                <X size={16} />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 overflow-y-auto space-y-6">
                            {/* Customer & Payment Info */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="bg-slate-50/70 p-4 rounded-2xl border border-slate-100 space-y-2">
                                    <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                                        Informasi Pelanggan
                                    </h4>
                                    <p className="font-bold text-slate-800 text-sm">{selectedOrder.customer_name}</p>
                                    <div className="flex items-center gap-2 text-xs text-slate-600">
                                        <Phone size={13} className="text-slate-400 shrink-0" />
                                        <span>{selectedOrder.customer_phone || '-'}</span>
                                    </div>
                                    <div className="flex items-start gap-2 text-xs text-slate-600">
                                        <MapPin size={13} className="text-slate-400 shrink-0 mt-0.5" />
                                        <span>{selectedOrder.customer_address || '-'}</span>
                                    </div>
                                </div>

                                <div className="bg-slate-50/70 p-4 rounded-2xl border border-slate-100 space-y-2">
                                    <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                                        Status & Pembayaran
                                    </h4>
                                    <div className="flex items-center gap-2">
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${getStatusBadge(selectedOrder.status, selectedOrder.status_label)}`}>
                                            {selectedOrder.status_label}
                                        </span>
                                        <span className="text-xs text-slate-500 font-medium">
                                            ({selectedOrder.payment_status === 'paid' ? 'Lunas' : 'Belum Lunas'})
                                        </span>
                                    </div>
                                    <p className="text-lg font-extrabold text-pink-600 mt-1">
                                        {selectedOrder.total_formatted}
                                    </p>
                                    <p className="text-xs text-slate-500">
                                        Metode: {selectedOrder.payment_method || 'Transfer Bank'}
                                    </p>
                                </div>
                            </div>

                            {/* Item Products List */}
                            <div className="border border-pink-100/60 rounded-2xl p-4 bg-white">
                                <h4 className="text-xs font-bold text-slate-700 mb-3 pb-2 border-b border-pink-50">
                                    Rincian Produk Pesanan
                                </h4>
                                <div className="space-y-3">
                                    {(selectedOrder.items || []).map((item, idx) => (
                                        <div key={idx} className="flex items-center justify-between text-xs">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl overflow-hidden bg-pink-50 shrink-0 border border-pink-100">
                                                    <img 
                                                        src={selectedOrder.product_image || '/images/hero_bouquet.jpg'} 
                                                        alt={item.product_name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-slate-800">{item.product_name}</p>
                                                    <p className="text-slate-400">{item.quantity} × {item.price_formatted}</p>
                                                </div>
                                            </div>
                                            <span className="font-bold text-slate-700">
                                                Rp {(item.quantity * item.price).toLocaleString('id-ID')}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Custom notes if any */}
                            {selectedOrder.notes && (
                                <div className="p-3.5 bg-pink-50/40 rounded-2xl border border-pink-100 text-xs">
                                    <span className="font-bold text-pink-700 block mb-1">Catatan / Keterangan Khusus:</span>
                                    <p className="text-slate-600">{selectedOrder.notes}</p>
                                </div>
                            )}

                            {/* Verifikasi & Status Pembayaran */}
                            <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-200/80 space-y-3">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <ShieldCheck size={16} className="text-pink-600" />
                                        <h4 className="text-xs font-bold text-slate-800">
                                            Verifikasi Pembayaran
                                        </h4>
                                    </div>
                                    <Link 
                                        href={route('admin.payments.index')}
                                        className="text-[11px] font-semibold text-pink-600 hover:text-pink-700 flex items-center gap-1 transition"
                                    >
                                        <span>Buka Menu Verifikasi</span>
                                        <ExternalLink size={12} />
                                    </Link>
                                </div>

                                {selectedOrder.payment_proof_url ? (
                                    <div className="bg-white p-3.5 rounded-xl border border-slate-200/60 space-y-3">
                                        <div className="flex items-start gap-3">
                                            <a 
                                                href={selectedOrder.payment_proof_url} 
                                                target="_blank" 
                                                rel="noreferrer"
                                                className="relative group block rounded-lg overflow-hidden border border-slate-200 shrink-0 w-24 h-24 bg-slate-100 shadow-2xs"
                                                title="Klik untuk melihat bukti ukuran penuh"
                                            >
                                                <img 
                                                    src={selectedOrder.payment_proof_url} 
                                                    alt="Bukti Transfer" 
                                                    className="w-full h-full object-cover group-hover:scale-105 transition duration-200"
                                                />
                                                <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-[10px] font-bold transition">
                                                    Lihat Penuh ↗
                                                </div>
                                            </a>
                                            <div className="flex-1 min-w-0 space-y-1">
                                                <p className="text-xs font-bold text-slate-800">
                                                    Bukti Transfer Terlampir
                                                </p>
                                                <p className="text-[11px] text-slate-500">
                                                    Metode: <span className="font-semibold text-slate-700">{selectedOrder.payment_method || 'Transfer Bank'}</span>
                                                </p>
                                                <p className="text-[11px] text-slate-500">
                                                    Total Tagihan: <span className="font-bold text-pink-600">{selectedOrder.total_formatted}</span>
                                                </p>
                                                <div className="pt-0.5">
                                                    {selectedOrder.payment_status === 'paid' ? (
                                                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                                            <CheckCircle2 size={12} />
                                                            Pembayaran Lunas & Terverifikasi
                                                        </span>
                                                    ) : selectedOrder.payment_status === 'rejected' ? (
                                                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                                                            <AlertCircle size={12} />
                                                            Bukti Pembayaran Ditolak
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
                                                            <Clock size={12} />
                                                            Menunggu Konfirmasi Admin
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Rejection reason notice if rejected */}
                                        {selectedOrder.payment_status === 'rejected' && selectedOrder.rejection_reason && (
                                            <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800">
                                                <span className="font-bold">Alasan Penolakan: </span>
                                                {selectedOrder.rejection_reason}
                                            </div>
                                        )}

                                        {/* Verification Action Buttons */}
                                        {selectedOrder.payment_status !== 'paid' && (
                                            <div className="pt-2 border-t border-slate-100 space-y-2">
                                                {!showRejectInput ? (
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            type="button"
                                                            disabled={verifyingPayment}
                                                            onClick={() => handleVerifyPayment('approve')}
                                                            className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition disabled:opacity-50 cursor-pointer"
                                                        >
                                                            <Check size={14} />
                                                            <span>{verifyingPayment ? 'Memproses...' : 'Setujui Pembayaran'}</span>
                                                        </button>
                                                        <button
                                                            type="button"
                                                            disabled={verifyingPayment}
                                                            onClick={() => setShowRejectInput(true)}
                                                            className="py-2 px-3.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 font-bold text-xs flex items-center justify-center gap-1 transition disabled:opacity-50 cursor-pointer"
                                                        >
                                                            <X size={14} />
                                                            <span>Tolak Bukti</span>
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <div className="bg-rose-50/60 p-3 rounded-xl border border-rose-200/80 space-y-2 animate-in fade-in-50">
                                                        <label className="block text-[11px] font-bold text-rose-800">
                                                            Alasan Penolakan Bukti Transfer:
                                                        </label>
                                                        <div className="flex flex-wrap gap-1.5 mb-1.5">
                                                            {[
                                                                'Nominal tidak sesuai',
                                                                'Foto struk buram / tidak terbaca',
                                                                'Bukan bukti transfer yang sah'
                                                            ].map((reasonChip, rIdx) => (
                                                                <button
                                                                    key={rIdx}
                                                                    type="button"
                                                                    onClick={() => setRejectReason(reasonChip)}
                                                                    className="text-[10px] px-2 py-0.5 rounded-lg bg-white border border-rose-200 text-rose-700 hover:bg-rose-100 transition"
                                                                >
                                                                    {reasonChip}
                                                                </button>
                                                            ))}
                                                        </div>
                                                        <input
                                                            type="text"
                                                            value={rejectReason}
                                                            onChange={(e) => setRejectReason(e.target.value)}
                                                            placeholder="Tuliskan alasan penolakan..."
                                                            className="w-full px-3 py-1.5 rounded-xl bg-white border border-rose-200 text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-rose-400"
                                                        />
                                                        <div className="flex items-center gap-2 pt-1">
                                                            <button
                                                                type="button"
                                                                disabled={verifyingPayment}
                                                                onClick={() => handleVerifyPayment('reject')}
                                                                className="py-1.5 px-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center gap-1 shadow-2xs transition disabled:opacity-50 cursor-pointer"
                                                            >
                                                                <X size={13} />
                                                                <span>Kirim Penolakan</span>
                                                            </button>
                                                            <button
                                                                type="button"
                                                                onClick={() => {
                                                                    setShowRejectInput(false);
                                                                    setRejectReason('');
                                                                }}
                                                                className="py-1.5 px-3 rounded-xl bg-white border border-slate-200 text-slate-600 text-xs font-semibold hover:bg-slate-100 transition cursor-pointer"
                                                            >
                                                                Batal
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="bg-white p-3.5 rounded-xl border border-slate-200/60 flex items-center justify-between gap-3 text-xs">
                                        <div className="flex items-center gap-2 text-slate-500">
                                            <AlertCircle size={15} className="text-amber-500 shrink-0" />
                                            <span>Belum ada file bukti transfer yang diunggah pelanggan.</span>
                                        </div>
                                        {selectedOrder.payment_status !== 'paid' && (
                                            <button
                                                type="button"
                                                disabled={verifyingPayment}
                                                onClick={() => handleVerifyPayment('approve')}
                                                className="py-1.5 px-3 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 font-bold text-xs transition disabled:opacity-50 shrink-0 cursor-pointer"
                                            >
                                                Tandai Lunas Manual
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Quick Update Status Section */}
                            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                <h4 className="text-xs font-bold text-slate-700 mb-2">
                                    Ubah Status Pesanan
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                    {['Menunggu Pembayaran', 'Diproses', 'Selesai', 'Dibatalkan'].map((st) => (
                                        <button
                                            key={st}
                                            disabled={updatingStatus}
                                            onClick={() => handleUpdateStatus(st)}
                                            className="px-3 py-1.5 rounded-xl bg-white hover:bg-pink-500 hover:text-white border border-slate-200 hover:border-pink-500 text-xs font-semibold text-slate-700 transition shadow-2xs disabled:opacity-50"
                                        >
                                            Set ke: {st}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between shrink-0">
                            <span className="text-xs text-slate-400">Florabelle.id Order Manager</span>
                            <button
                                onClick={closeOrderDetail}
                                className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-100 transition shadow-2xs"
                            >
                                Tutup
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
