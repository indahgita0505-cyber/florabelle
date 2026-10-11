import { Head, Link, router, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { useState, useEffect } from 'react';
import { 
    Search, 
    Filter, 
    Calendar, 
    Plus, 
    RotateCcw, 
    ChevronLeft, 
    ChevronRight, 
    X, 
    MapPin, 
    Phone, 
    Mail, 
    FileText, 
    CreditCard, 
    CheckCircle2, 
    Clock, 
    AlertCircle,
    Eye,
    Check,
    ExternalLink,
    ShieldCheck,
    ShoppingBag,
    Image as ImageIcon
} from 'lucide-react';

export default function OrderIndex({ 
    orders, 
    bouquetTypes = [], 
    products = [], 
    filters = {},
    verifications = [],
    pendingVerificationCount = 0,
    activeTab: initialTab = 'all'
}) {
    const [currentTab, setCurrentTab] = useState(initialTab || 'all');

    // Search & Filter State
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [statusFilter, setStatusFilter] = useState(filters.status || 'all');
    const [bouquetFilter, setBouquetFilter] = useState(filters.bouquet_type || 'all');
    const [dateFilter, setDateFilter] = useState(filters.date || '');

    // Modals
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [updatingStatus, setUpdatingStatus] = useState(false);
    const [rejectReason, setRejectReason] = useState('');
    const [showRejectInput, setShowRejectInput] = useState(false);
    const [verifyingPayment, setVerifyingPayment] = useState(false);
    const [rejectingOrderId, setRejectingOrderId] = useState(null);

    // Form for Manual Order
    const { data: newOrder, setData: setNewOrder, post: submitNewOrder, processing: addingOrder, reset: resetNewOrder, errors: addErrors } = useForm({
        customer_name: '',
        customer_phone: '',
        customer_address: '',
        product_id: '',
        product_name: '',
        price: '',
        quantity: 1,
        notes: '',
        payment_method: 'Transfer Bank',
        status: 'pending',
    });

    // Apply Filter Function
    const applyFilters = (newOverrides = {}) => {
        const queryParams = {
            search: searchTerm,
            status: statusFilter,
            bouquet_type: bouquetFilter,
            date: dateFilter,
            ...newOverrides,
        };

        // Remove empty or 'all' params
        const cleanParams = {};
        Object.keys(queryParams).forEach((k) => {
            if (queryParams[k] && queryParams[k] !== 'all' && queryParams[k] !== 'Semua Status' && queryParams[k] !== 'Semua Jenis') {
                cleanParams[k] = queryParams[k];
            }
        });

        router.get(route('admin.orders.index'), cleanParams, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    // Debounced search
    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchTerm !== (filters.search || '')) {
                applyFilters({ search: searchTerm });
            }
        }, 400);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    const handleResetFilters = () => {
        setSearchTerm('');
        setStatusFilter('all');
        setBouquetFilter('all');
        setDateFilter('');
        router.get(route('admin.orders.index'), {}, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    const hasActiveFilters = Boolean(
        searchTerm || 
        (statusFilter && statusFilter !== 'all') || 
        (bouquetFilter && bouquetFilter !== 'all') || 
        dateFilter
    );

    // Order Detail Modal Handlers
    const openOrderDetail = (order) => {
        setSelectedOrder(order);
        setIsDetailModalOpen(true);
    };

    const closeOrderDetail = () => {
        setIsDetailModalOpen(false);
        setSelectedOrder(null);
        setShowRejectInput(false);
        setRejectReason('');
        setRejectingOrderId(null);
    };

    const handleVerifyPayment = (action, customReason = null, targetOrder = null) => {
        const ord = targetOrder || selectedOrder;
        if (!ord) return;
        setVerifyingPayment(true);
        router.patch(route('admin.orders.verify-payment', ord.raw_id || ord.id), {
            action: action,
            reason: customReason || rejectReason,
        }, {
            preserveScroll: true,
            onSuccess: () => {
                setVerifyingPayment(false);
                setShowRejectInput(false);
                setRejectReason('');
                setRejectingOrderId(null);
                if (selectedOrder) {
                    closeOrderDetail();
                }
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

    // Manual Order Handlers
    const handleProductSelect = (productId) => {
        const prod = products.find(p => p.id === parseInt(productId));
        if (prod) {
            setNewOrder({
                ...newOrder,
                product_id: prod.id,
                product_name: prod.name,
                price: prod.price,
            });
        }
    };

    const handleAddOrderSubmit = (e) => {
        e.preventDefault();
        submitNewOrder(route('admin.orders.store'), {
            preserveScroll: true,
            onSuccess: () => {
                setIsAddModalOpen(false);
                resetNewOrder();
            },
        });
    };

    // Status Badge Helpers
    const getStatusBadge = (statusKey) => {
        switch (statusKey) {
            case 'waiting_verification':
                return 'bg-purple-50 text-purple-700 border border-purple-200/80 font-bold';
            case 'pending':
                return 'bg-amber-50 text-amber-600 border border-amber-200/70';
            case 'processing':
                return 'bg-pink-50 text-pink-600 border border-pink-200/70';
            case 'completed':
                return 'bg-emerald-50 text-emerald-600 border border-emerald-200/70';
            case 'cancelled':
                return 'bg-slate-100 text-slate-500 border border-slate-200';
            default:
                return 'bg-slate-50 text-slate-700 border border-slate-200';
        }
    };

    const orderList = orders.data || [];

    return (
        <AdminLayout
            title="Daftar Pesanan"
            subtitle="Kelola dan pantau seluruh pesanan pelanggan."
            quote="Setiap Pesanan Punya Cerita Spesial 💕"
        >
            <Head title="Daftar Pesanan - Florabelle.id" />

            <div className="space-y-6 max-w-7xl mx-auto">
                {/* Top Tab Navigator */}
                <div className="flex items-center gap-2.5 border-b border-pink-100/80 pb-3">
                    <button
                        type="button"
                        onClick={() => {
                            setCurrentTab('all');
                            const url = new URL(window.location.href);
                            url.searchParams.delete('tab');
                            window.history.pushState({}, '', url);
                        }}
                        className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                            currentTab === 'all'
                                ? 'bg-pink-500 text-white shadow-xs'
                                : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200/80 hover:bg-pink-50/50'
                        }`}
                    >
                        <ShoppingBag size={15} />
                        <span>Semua Pesanan</span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            currentTab === 'all' ? 'bg-pink-400 text-white' : 'bg-slate-100 text-slate-600'
                        }`}>
                            {orders.total || 0}
                        </span>
                    </button>

                    <button
                        type="button"
                        onClick={() => {
                            setCurrentTab('verification');
                            const url = new URL(window.location.href);
                            url.searchParams.set('tab', 'verification');
                            window.history.pushState({}, '', url);
                        }}
                        className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                            currentTab === 'verification'
                                ? 'bg-purple-600 text-white shadow-xs'
                                : 'bg-white text-slate-600 hover:text-purple-700 border border-slate-200/80 hover:bg-purple-50/50'
                        }`}
                    >
                        <ShieldCheck size={15} />
                        <span>Verifikasi Pembayaran</span>
                        {pendingVerificationCount > 0 && (
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                currentTab === 'verification' ? 'bg-purple-500 text-white' : 'bg-purple-100 text-purple-700'
                            }`}>
                                {pendingVerificationCount} Perlu Dicek
                            </span>
                        )}
                    </button>
                </div>

                {/* Tab: Semua Pesanan */}
                {currentTab === 'all' && (
                    <div className="space-y-6">
                        {/* Search, Filter, and Action Bar */}
                        <div className="bg-white rounded-3xl p-5 border border-pink-100/60 shadow-xs">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        {/* Search & Select Filters */}
                        <div className="flex flex-wrap items-center gap-3 flex-1">
                            {/* Search Box */}
                            <div className="relative flex-1 min-w-[240px]">
                                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="Cari ID pesanan atau nama pelanggan..."
                                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs focus:outline-hidden focus:ring-2 focus:ring-pink-400/30 focus:border-pink-400 transition"
                                />
                                {searchTerm && (
                                    <button 
                                        onClick={() => setSearchTerm('')}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                    >
                                        <X size={14} />
                                    </button>
                                )}
                            </div>

                            {/* Status Filter */}
                            <select
                                value={statusFilter}
                                onChange={(e) => {
                                    setStatusFilter(e.target.value);
                                    applyFilters({ status: e.target.value });
                                }}
                                className="px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-pink-400/30 focus:border-pink-400 font-medium"
                            >
                                <option value="all">Semua Status</option>
                                <option value="waiting_verification">Menunggu Verifikasi</option>
                                <option value="pending">Menunggu Pembayaran</option>
                                <option value="processing">Diproses</option>
                                <option value="completed">Selesai</option>
                                <option value="cancelled">Dibatalkan</option>
                            </select>

                            {/* Bouquet Type Filter */}
                            <select
                                value={bouquetFilter}
                                onChange={(e) => {
                                    setBouquetFilter(e.target.value);
                                    applyFilters({ bouquet_type: e.target.value });
                                }}
                                className="px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-pink-400/30 focus:border-pink-400 font-medium max-w-[180px]"
                            >
                                <option value="all">Semua Jenis</option>
                                {bouquetTypes.map((bName, i) => (
                                    <option key={i} value={bName}>{bName}</option>
                                ))}
                            </select>

                            {/* Date Filter */}
                            <div className="relative">
                                <input
                                    type="date"
                                    value={dateFilter}
                                    onChange={(e) => {
                                        setDateFilter(e.target.value);
                                        applyFilters({ date: e.target.value });
                                    }}
                                    className="px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-pink-400/30 focus:border-pink-400 font-medium"
                                />
                            </div>

                            {/* Reset Filter Button */}
                            {hasActiveFilters && (
                                <button
                                    onClick={handleResetFilters}
                                    className="p-2.5 rounded-2xl text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition border border-slate-200"
                                    title="Reset Semua Filter"
                                >
                                    <RotateCcw size={15} />
                                </button>
                            )}
                        </div>

                        {/* + Tambah Pesanan Button */}
                        <button
                            onClick={() => setIsAddModalOpen(true)}
                            className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-400 hover:from-pink-600 hover:to-rose-500 text-white font-bold text-xs shadow-sm flex items-center justify-center gap-2 transition shrink-0 self-start lg:self-auto"
                        >
                            <Plus size={16} />
                            <span>Tambah Pesanan</span>
                        </button>
                    </div>
                </div>

                {/* Orders Table Card */}
                <div className="bg-white rounded-3xl border border-pink-100/60 shadow-xs overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-pink-50/30 text-slate-400 text-xs font-semibold uppercase tracking-wider">
                                    <th className="px-6 py-4 border-b border-pink-50">ID Pesanan</th>
                                    <th className="px-6 py-4 border-b border-pink-50">Tanggal</th>
                                    <th className="px-6 py-4 border-b border-pink-50">Pelanggan</th>
                                    <th className="px-6 py-4 border-b border-pink-50">Jenis Buket</th>
                                    <th className="px-6 py-4 border-b border-pink-50">Total Harga</th>
                                    <th className="px-6 py-4 border-b border-pink-50">Status</th>
                                    <th className="px-6 py-4 border-b border-pink-50 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="text-xs divide-y divide-pink-50/60">
                                {orderList.length === 0 ? (
                                    <tr>
                                        <td colSpan="7" className="px-6 py-16 text-center text-slate-400">
                                            <div className="w-14 h-14 rounded-full bg-pink-50 flex items-center justify-center mx-auto mb-3 text-2xl">
                                                🌸
                                            </div>
                                            <p className="font-bold text-slate-700 text-sm">Tidak ada pesanan ditemukan</p>
                                            <p className="text-xs text-slate-400 mt-1">Coba sesuaikan kata kunci pencarian atau reset filter.</p>
                                            {hasActiveFilters && (
                                                <button
                                                    onClick={handleResetFilters}
                                                    className="mt-4 px-4 py-2 rounded-xl bg-pink-100 text-pink-600 font-bold text-xs hover:bg-pink-200 transition"
                                                >
                                                    Reset Filter
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ) : (
                                    orderList.map((order, idx) => (
                                        <tr key={idx} className="hover:bg-pink-50/20 transition-colors">
                                            {/* ID Pesanan */}
                                            <td className="px-6 py-4 font-bold text-slate-800">
                                                {order.id}
                                            </td>

                                            {/* Tanggal */}
                                            <td className="px-6 py-4 text-slate-500 whitespace-nowrap">
                                                <div className="font-medium text-slate-700">{order.date_short}</div>
                                                <div className="text-[11px] text-slate-400">{order.created_at.slice(11, 16)}</div>
                                            </td>

                                            {/* Pelanggan */}
                                            <td className="px-6 py-4">
                                                <div className="font-bold text-slate-800">{order.customer_name}</div>
                                                <div className="text-[11px] text-slate-400 truncate max-w-[160px]">
                                                    {order.customer_email !== '-' ? order.customer_email : order.customer_phone}
                                                </div>
                                            </td>

                                            {/* Jenis Buket (Thumbnail + Name) */}
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-9 h-9 rounded-xl overflow-hidden bg-pink-50 border border-pink-100 shrink-0">
                                                        <img 
                                                            src={order.bouquet_image || '/images/hero_bouquet.jpg'} 
                                                            alt={order.bouquet_name}
                                                            className="w-full h-full object-cover"
                                                            onError={(e) => {
                                                                e.target.src = '/images/hero_bouquet.jpg';
                                                            }}
                                                        />
                                                    </div>
                                                    <span className="font-semibold text-slate-700 truncate max-w-[180px]">
                                                        {order.bouquet_name}
                                                    </span>
                                                </div>
                                            </td>

                                            {/* Total Harga */}
                                            <td className="px-6 py-4 font-bold text-slate-800 whitespace-nowrap">
                                                {order.total_formatted}
                                            </td>

                                            {/* Status Badge */}
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-block px-3 py-1 rounded-full text-[11px] font-bold ${getStatusBadge(order.status)}`}>
                                                    {order.status_label}
                                                </span>
                                            </td>

                                            {/* Aksi Button */}
                                            <td className="px-6 py-4 text-right whitespace-nowrap">
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

                    {/* Pagination Footer */}
                    <div className="px-6 py-4 bg-slate-50/50 border-t border-pink-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-slate-500">
                        <div>
                            Menampilkan <span className="font-bold text-slate-700">{orders.from || 0}</span> - <span className="font-bold text-slate-700">{orders.to || 0}</span> dari <span className="font-bold text-slate-700">{orders.total || 0}</span> pesanan
                        </div>

                        {/* Pagination Links */}
                        {orders.links && orders.links.length > 3 && (
                            <div className="flex items-center gap-1.5 self-end sm:self-auto">
                                {orders.links.map((link, i) => {
                                    // Remove &laquo; and &raquo; entities
                                    const label = link.label
                                        .replace('&laquo; Previous', '<')
                                        .replace('Next &raquo;', '>')
                                        .replace('&laquo;', '<')
                                        .replace('&raquo;', '>');

                                    if (!link.url) {
                                        return (
                                            <span 
                                                key={i} 
                                                className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-300 font-medium text-xs pointer-events-none"
                                            >
                                                {label}
                                            </span>
                                        );
                                    }

                                    return (
                                        <Link
                                            key={i}
                                            href={link.url}
                                            preserveScroll
                                            preserveState
                                            className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs transition ${
                                                link.active 
                                                    ? 'bg-pink-500 text-white shadow-xs' 
                                                    : 'bg-white hover:bg-pink-50 text-slate-600 border border-slate-200'
                                            }`}
                                        >
                                            {label}
                                        </Link>
                                    );
                                })}
                            </div>
                        )}
                        </div>
                    </div>
                </div>
            )}

                {/* Tab: Verifikasi Pembayaran */}
                {currentTab === 'verification' && (
                    <div className="space-y-5 animate-in fade-in-50 duration-200">
                        {/* Banner Info */}
                        <div className="bg-gradient-to-r from-purple-50 via-pink-50/40 to-white rounded-3xl p-5 border border-purple-100/70 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="flex items-center gap-3.5">
                                <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center text-xl shadow-inner shrink-0">
                                    <ShieldCheck size={24} />
                                </div>
                                <div>
                                    <h3 className="text-sm sm:text-base font-bold text-slate-800">
                                        Verifikasi Bukti Pembayaran Masuk
                                    </h3>
                                    <p className="text-xs text-slate-500">
                                        Periksa struk transfer bank atau QRIS dari pelanggan sebelum pesanan dirangkai dan dikirim.
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 self-start sm:self-auto">
                                <span className="px-3 py-1.5 rounded-xl bg-white border border-purple-200 text-xs font-bold text-purple-700 shadow-2xs">
                                    {verifications.length} Pesanan Butuh Review
                                </span>
                            </div>
                        </div>

                        {/* Verification Items Grid */}
                        {verifications.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                                {verifications.map((vItem) => (
                                    <div 
                                        key={vItem.id} 
                                        className="bg-white rounded-3xl border border-pink-100/70 shadow-xs hover:shadow-md transition flex flex-col overflow-hidden"
                                    >
                                        {/* Card Header */}
                                        <div className="p-4 border-b border-pink-50/80 bg-pink-50/20 flex items-center justify-between">
                                            <div>
                                                <span className="font-bold text-xs text-slate-900 block">
                                                    {vItem.id}
                                                </span>
                                                <span className="text-[10px] text-slate-400">
                                                    {vItem.created_at}
                                                </span>
                                            </div>
                                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                                                vItem.payment_status === 'paid'
                                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                                    : vItem.payment_status === 'rejected'
                                                        ? 'bg-rose-50 text-rose-700 border border-rose-200'
                                                        : 'bg-purple-50 text-purple-700 border border-purple-200'
                                            }`}>
                                                {vItem.payment_status === 'paid' ? 'Lunas' : vItem.payment_status === 'rejected' ? 'Ditolak' : 'Menunggu Verifikasi'}
                                            </span>
                                        </div>

                                        {/* Struk Image Preview */}
                                        <div className="p-4 flex gap-3">
                                            <a 
                                                href={vItem.payment_proof_url} 
                                                target="_blank" 
                                                rel="noreferrer"
                                                className="relative group w-24 h-28 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0 block"
                                                title="Klik untuk perbesar bukti transfer"
                                            >
                                                <img 
                                                    src={vItem.payment_proof_url} 
                                                    alt="Bukti Transfer" 
                                                    className="w-full h-full object-cover group-hover:scale-105 transition duration-200"
                                                />
                                                <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-[10px] font-bold transition">
                                                    Perbesar ↗
                                                </div>
                                            </a>

                                            <div className="flex-1 min-w-0 space-y-1.5 text-xs">
                                                <div>
                                                    <p className="font-bold text-slate-800 text-sm truncate">
                                                        {vItem.customer_name}
                                                    </p>
                                                    <p className="text-[11px] text-slate-400 truncate">
                                                        {vItem.customer_phone || '-'}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-[11px] text-slate-500">
                                                        Produk: <span className="font-semibold text-slate-700">{vItem.bouquet_name}</span>
                                                    </p>
                                                    <p className="text-[11px] text-slate-500">
                                                        Metode: <span className="font-semibold text-slate-700">{vItem.payment_method}</span>
                                                    </p>
                                                </div>
                                                <div className="pt-1">
                                                    <span className="text-slate-400 block text-[10px]">Total Tagihan:</span>
                                                    <span className="text-base font-extrabold text-pink-600 block leading-tight">
                                                        {vItem.total_formatted}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Rejection reason notice if rejected */}
                                        {vItem.payment_status === 'rejected' && vItem.rejection_reason && (
                                            <div className="mx-4 mb-2 p-2 rounded-xl bg-rose-50 border border-rose-200 text-[11px] text-rose-800">
                                                <span className="font-bold">Alasan Penolakan: </span>
                                                {vItem.rejection_reason}
                                            </div>
                                        )}

                                        {/* Card Actions Footer */}
                                        <div className="p-3 bg-slate-50/70 border-t border-slate-100 mt-auto flex flex-col gap-2">
                                            {rejectingOrderId === vItem.id ? (
                                                <div className="space-y-2 p-2 bg-rose-50/60 rounded-xl border border-rose-200/80 animate-in fade-in-50">
                                                    <p className="text-[11px] font-bold text-rose-800">
                                                        Pilih atau isi alasan penolakan:
                                                    </p>
                                                    <div className="flex flex-wrap gap-1">
                                                        {[
                                                            'Nominal tidak sesuai',
                                                            'Foto struk buram',
                                                            'Bukan bukti sah'
                                                        ].map((chip, cIdx) => (
                                                            <button
                                                                key={cIdx}
                                                                type="button"
                                                                onClick={() => setRejectReason(chip)}
                                                                className="text-[9px] px-1.5 py-0.5 rounded-md bg-white border border-rose-200 text-rose-700 hover:bg-rose-100 transition"
                                                            >
                                                                {chip}
                                                            </button>
                                                        ))}
                                                    </div>
                                                    <input
                                                        type="text"
                                                        value={rejectReason}
                                                        onChange={(e) => setRejectReason(e.target.value)}
                                                        placeholder="Alasan penolakan..."
                                                        className="w-full px-2.5 py-1 rounded-lg bg-white border border-rose-200 text-xs text-slate-800 focus:outline-hidden"
                                                    />
                                                    <div className="flex items-center gap-1.5 pt-1">
                                                        <button
                                                            type="button"
                                                            disabled={verifyingPayment}
                                                            onClick={() => handleVerifyPayment('reject', null, vItem)}
                                                            className="flex-1 py-1 px-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center justify-center gap-1 shadow-2xs transition disabled:opacity-50 cursor-pointer"
                                                        >
                                                            <X size={12} />
                                                            <span>Tolak</span>
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                setRejectingOrderId(null);
                                                                setRejectReason('');
                                                            }}
                                                            className="py-1 px-2.5 rounded-lg bg-white border border-slate-200 text-slate-600 text-xs font-semibold hover:bg-slate-100 transition cursor-pointer"
                                                        >
                                                            Batal
                                                        </button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        type="button"
                                                        disabled={verifyingPayment}
                                                        onClick={() => handleVerifyPayment('approve', null, vItem)}
                                                        className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-2xs transition disabled:opacity-50 cursor-pointer"
                                                    >
                                                        <Check size={14} />
                                                        <span>Setujui</span>
                                                    </button>

                                                    <button
                                                        type="button"
                                                        disabled={verifyingPayment}
                                                        onClick={() => {
                                                            setRejectingOrderId(vItem.id);
                                                            setRejectReason('');
                                                        }}
                                                        className="py-2 px-3 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 font-bold text-xs flex items-center justify-center gap-1 transition disabled:opacity-50 cursor-pointer"
                                                    >
                                                        <X size={14} />
                                                        <span>Tolak</span>
                                                    </button>

                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            const fullOrder = orderList.find(o => o.raw_id === vItem.raw_id) || vItem;
                                                            openOrderDetail(fullOrder);
                                                        }}
                                                        className="p-2 rounded-xl bg-white border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition shadow-2xs cursor-pointer"
                                                        title="Buka Detail Lengkap"
                                                    >
                                                        <Eye size={15} />
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="bg-white rounded-3xl p-12 text-center border border-pink-100/60 shadow-xs">
                                <div className="w-16 h-16 rounded-3xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto text-2xl shadow-inner mb-3">
                                    <CheckCircle2 size={32} />
                                </div>
                                <h4 className="text-base font-bold text-slate-800">
                                    Semua Pembayaran Telah Selesai Diverifikasi!
                                </h4>
                                <p className="text-xs text-slate-400 max-w-md mx-auto mt-1 mb-5">
                                    Tidak ada bukti transfer baru yang sedang menunggu persetujuan. Seluruh pesanan dapat langsung diproses atau dirangkai.
                                </p>
                                <button
                                    onClick={() => setCurrentTab('all')}
                                    className="px-5 py-2.5 rounded-2xl bg-pink-500 hover:bg-pink-600 text-white font-bold text-xs shadow-xs transition cursor-pointer"
                                >
                                    Lihat Semua Pesanan
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Modal Detail Pesanan */}
            {isDetailModalOpen && selectedOrder && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div 
                        className="absolute inset-0 bg-slate-900/50 backdrop-blur-xs"
                        onClick={closeOrderDetail}
                    />

                    <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden border border-pink-100 animate-in zoom-in-95 duration-150">
                        {/* Header */}
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
                                        Tanggal: {selectedOrder.date}
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

                        {/* Body */}
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
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${getStatusBadge(selectedOrder.status)}`}>
                                            {selectedOrder.status_label}
                                        </span>
                                        <span className="text-xs text-slate-500 font-medium">
                                            ({selectedOrder.payment_status === 'paid' ? 'Lunas' : 'Belum Lunas'})
                                        </span>
                                    </div>
                                    <p className="text-xl font-extrabold text-pink-600 mt-1">
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
                                                        src={selectedOrder.bouquet_image || '/images/hero_bouquet.jpg'} 
                                                        alt={item.product_name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-slate-800">{item.product_name}</p>
                                                    <p className="text-slate-400">{item.quantity} × {item.price_formatted}</p>
                                                    {item.custom_request && (
                                                        <p className="text-[11px] text-pink-600 mt-0.5 italic">Request: {item.custom_request}</p>
                                                    )}
                                                </div>
                                            </div>
                                            <span className="font-bold text-slate-700">
                                                {item.subtotal_formatted}
                                            </span>
                                        </div>
                                    ))}

                                    {/* Delivery fee if any */}
                                    {selectedOrder.delivery_fee > 0 && (
                                        <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100 text-slate-500">
                                            <span>Ongkos Kirim</span>
                                            <span>Rp {selectedOrder.delivery_fee.toLocaleString('id-ID')}</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Card message or Custom notes if any */}
                            {(selectedOrder.card_message || selectedOrder.notes) && (
                                <div className="p-4 bg-pink-50/40 rounded-2xl border border-pink-100 space-y-2 text-xs">
                                    {selectedOrder.card_message && (
                                        <div>
                                            <span className="font-bold text-pink-700 block mb-1">Pesan Kartu Ucapan:</span>
                                            <p className="text-slate-700 italic">"{selectedOrder.card_message}"</p>
                                            <p className="text-[11px] text-slate-400 mt-0.5">
                                                Dari: {selectedOrder.card_from || '-'} • Untuk: {selectedOrder.card_to || '-'}
                                            </p>
                                        </div>
                                    )}

                                    {selectedOrder.notes && (
                                        <div>
                                            <span className="font-bold text-pink-700 block mb-1">Catatan Pesanan:</span>
                                            <p className="text-slate-600">{selectedOrder.notes}</p>
                                        </div>
                                    )}
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

                            {/* Update Status Actions */}
                            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                <h4 className="text-xs font-bold text-slate-700 mb-2">
                                    Ubah Status Pesanan ke:
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                    {['Menunggu Pembayaran', 'Diproses', 'Selesai', 'Dibatalkan'].map((st) => (
                                        <button
                                            key={st}
                                            disabled={updatingStatus}
                                            onClick={() => handleUpdateStatus(st)}
                                            className="px-3 py-1.5 rounded-xl bg-white hover:bg-pink-500 hover:text-white border border-slate-200 hover:border-pink-500 text-xs font-semibold text-slate-700 transition shadow-2xs disabled:opacity-50"
                                        >
                                            {st}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between shrink-0">
                            <span className="text-xs text-slate-400">ID: {selectedOrder.id}</span>
                            <button
                                onClick={closeOrderDetail}
                                className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-100 transition shadow-2xs"
                            >
                                Selesai
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Tambah Pesanan Manual */}
            {isAddModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div 
                        className="absolute inset-0 bg-slate-900/50 backdrop-blur-xs"
                        onClick={() => setIsAddModalOpen(false)}
                    />

                    <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden border border-pink-100 animate-in zoom-in-95 duration-150">
                        {/* Header */}
                        <div className="px-6 py-4.5 border-b border-pink-50 flex items-center justify-between bg-pink-50/30 shrink-0">
                            <div className="flex items-center gap-2.5">
                                <span className="text-xl">🌸</span>
                                <div>
                                    <h3 className="text-base font-bold text-slate-800">Tambah Pesanan Manual</h3>
                                    <p className="text-xs text-slate-400">Input transaksi pelanggan langsung ke sistem</p>
                                </div>
                            </div>
                            <button 
                                onClick={() => setIsAddModalOpen(false)}
                                className="w-8 h-8 rounded-full bg-white text-slate-400 hover:text-slate-600 flex items-center justify-center shadow-xs border border-slate-100"
                            >
                                <X size={16} />
                            </button>
                        </div>

                        {/* Form Body */}
                        <form onSubmit={handleAddOrderSubmit} className="p-6 overflow-y-auto space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">Nama Pelanggan *</label>
                                <input
                                    type="text"
                                    required
                                    value={newOrder.customer_name}
                                    onChange={(e) => setNewOrder('customer_name', e.target.value)}
                                    placeholder="Contoh: Anisa Rahma"
                                    className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs focus:ring-2 focus:ring-pink-400 focus:outline-hidden"
                                />
                                {addErrors.customer_name && <p className="text-[11px] text-rose-500 mt-1">{addErrors.customer_name}</p>}
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1">Nomor WhatsApp *</label>
                                    <input
                                        type="text"
                                        required
                                        value={newOrder.customer_phone}
                                        onChange={(e) => setNewOrder('customer_phone', e.target.value)}
                                        placeholder="081234567890"
                                        className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs focus:ring-2 focus:ring-pink-400 focus:outline-hidden"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1">Metode Bayar</label>
                                    <select
                                        value={newOrder.payment_method}
                                        onChange={(e) => setNewOrder('payment_method', e.target.value)}
                                        className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs focus:ring-2 focus:ring-pink-400 focus:outline-hidden"
                                    >
                                        <option value="Transfer Bank">Transfer Bank</option>
                                        <option value="QRIS">QRIS</option>
                                        <option value="Cash / Tunai">Cash / Tunai</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">Alamat Pengiriman *</label>
                                <textarea
                                    required
                                    rows="2"
                                    value={newOrder.customer_address}
                                    onChange={(e) => setNewOrder('customer_address', e.target.value)}
                                    placeholder="Jl. Mawar No. 12, Kota Palu"
                                    className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs focus:ring-2 focus:ring-pink-400 focus:outline-hidden"
                                />
                            </div>

                            <div className="pt-2 border-t border-slate-100">
                                <label className="block text-xs font-bold text-slate-700 mb-1">Pilih Produk atau Tulis Manual *</label>
                                <div className="space-y-2">
                                    {products.length > 0 && (
                                        <select
                                            onChange={(e) => handleProductSelect(e.target.value)}
                                            className="w-full px-3.5 py-2 rounded-2xl bg-slate-50 border border-slate-200 text-xs focus:ring-2 focus:ring-pink-400 focus:outline-hidden text-slate-600 mb-2"
                                        >
                                            <option value="">-- Pilih dari Katalog Produk --</option>
                                            {products.map(p => (
                                                <option key={p.id} value={p.id}>{p.name} (Rp {parseInt(p.price).toLocaleString('id-ID')})</option>
                                            ))}
                                        </select>
                                    )}
                                    <input
                                        type="text"
                                        required
                                        value={newOrder.product_name}
                                        onChange={(e) => setNewOrder('product_name', e.target.value)}
                                        placeholder="Nama Buket (misal: Buket Uang Custom)"
                                        className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs focus:ring-2 focus:ring-pink-400 focus:outline-hidden"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1">Harga Satuan (Rp) *</label>
                                    <input
                                        type="number"
                                        required
                                        min="0"
                                        value={newOrder.price}
                                        onChange={(e) => setNewOrder('price', e.target.value)}
                                        placeholder="150000"
                                        className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs focus:ring-2 focus:ring-pink-400 focus:outline-hidden"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1">Jumlah (Qty)</label>
                                    <input
                                        type="number"
                                        min="1"
                                        value={newOrder.quantity}
                                        onChange={(e) => setNewOrder('quantity', parseInt(e.target.value) || 1)}
                                        className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs focus:ring-2 focus:ring-pink-400 focus:outline-hidden"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">Status Awal</label>
                                <select
                                    value={newOrder.status}
                                    onChange={(e) => setNewOrder('status', e.target.value)}
                                    className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs focus:ring-2 focus:ring-pink-400 focus:outline-hidden font-medium"
                                >
                                    <option value="pending">Menunggu Pembayaran</option>
                                    <option value="processing">Diproses</option>
                                    <option value="completed">Selesai (Sudah Lunas)</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">Catatan / Keterangan</label>
                                <input
                                    type="text"
                                    value={newOrder.notes}
                                    onChange={(e) => setNewOrder('notes', e.target.value)}
                                    placeholder="Warna pita, wrapping, ucapan..."
                                    className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs focus:ring-2 focus:ring-pink-400 focus:outline-hidden"
                                />
                            </div>

                            {/* Modal Action Buttons */}
                            <div className="pt-4 flex items-center justify-end gap-2.5 border-t border-slate-100">
                                <button
                                    type="button"
                                    onClick={() => setIsAddModalOpen(false)}
                                    className="px-4 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={addingOrder}
                                    className="px-5 py-2.5 rounded-2xl bg-pink-500 hover:bg-pink-600 text-white text-xs font-bold shadow-sm transition disabled:opacity-50"
                                >
                                    {addingOrder ? 'Menyimpan...' : 'Simpan Pesanan'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
