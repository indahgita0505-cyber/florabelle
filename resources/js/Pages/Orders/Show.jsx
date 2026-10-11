import { Head, Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
import UserDashboardLayout from '@/Layouts/UserDashboardLayout';
import dayjs from 'dayjs';
import 'dayjs/locale/id';

dayjs.locale('id');

const formatRupiah = (n) => 'Rp ' + Number(n).toLocaleString('id-ID');

export default function OrdersShow({ order }) {
    const { auth } = usePage().props;
    const user = auth?.user;

    const dateObj = dayjs(order?.created_at || new Date());
    const formattedCode = `#BK${dateObj.format('YYYYMMDD')}${String(order?.id || 1).padStart(3, '0')}`;
    const formattedDate = dateObj.format('D MMM YYYY - HH:mm');

    // Status mapping & badge
    let statusLabel = 'Diproses';
    let statusType = 'processing';

    if (order?.status === 'pending') {
        statusLabel = 'Menunggu Konfirmasi';
        statusType = 'pending';
    } else if (order?.status === 'processing') {
        statusLabel = 'Diproses';
        statusType = 'processing';
    } else if (order?.status === 'created') {
        statusLabel = 'Dibuat';
        statusType = 'created';
    } else if (order?.status === 'shipped' || order?.status === 'delivering') {
        statusLabel = 'Dikirim';
        statusType = 'shipped';
    } else if (order?.status === 'completed' || order?.status === 'delivered') {
        statusLabel = 'Selesai';
        statusType = 'completed';
    } else if (order?.status === 'cancelled' || order?.status === 'rejected') {
        statusLabel = 'Dibatalkan';
        statusType = 'cancelled';
    }

    // Parse custom bucket notes if present
    let customNotes = null;
    try {
        if (order?.notes && (order.notes.startsWith('{') || order.notes.includes('"is_custom_bucket"'))) {
            customNotes = JSON.parse(order.notes);
        }
    } catch (e) {
        customNotes = null;
    }

    let customImage = 'https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?auto=format&fit=crop&w=400&q=80';
    if (customNotes && customNotes.is_custom_bucket) {
        const jb = (customNotes.jenis_bucket || '').toLowerCase();
        if (jb.includes('uang')) customImage = '/images/custom/uang.jpg';
        else if (jb.includes('coklat') || jb.includes('cokelat')) customImage = '/images/custom/coklat.jpg';
        else if (jb.includes('snack')) customImage = '/images/custom/snack.jpg';
        else if (jb.includes('boneka')) customImage = '/images/custom/boneka.jpg';
        else if (jb.includes('kombinasi')) customImage = '/images/custom/kombinasi.jpg';
        else customImage = '/images/custom/bunga_pita.jpg';
    }

    // Default reference data if items are empty or to match mockup
    const items = order?.items && order.items.length > 0 ? order.items : [
        {
            id: 1,
            product_name: customNotes ? customNotes.jenis_bucket : 'Bucket Uang Custom',
            price: order?.total || 200000,
            quantity: 1,
            product: {
                image_url: customImage,
            }
        }
    ];

    const firstItem = items[0];

    // Customer details
    const recipientName = order?.customer_name || user?.name || 'Indah Gita Cahyani';
    const recipientPhone = order?.customer_phone || user?.whatsapp_number || '0823 4567 8910';
    const recipientAddress = order?.customer_address || 'Jl. Melati No 12, Kel. Tondo, Kec. Mantikulore, Kota Palu, Sulawesi Tengah 94118';

    // WhatsApp Contact URL
    const whatsappAdminNumber = '6282345678910';
    const waText = encodeURIComponent(
        `Halo Florabelle, saya ingin menanyakan status pesanan ${formattedCode} atas nama ${recipientName}.`
    );
    const whatsappUrl = `https://wa.me/${whatsappAdminNumber}?text=${waText}`;

    // Request Notes / Custom Details
    const requestNote = customNotes
        ? (customNotes.komentar_khusus || `Request untuk ${customNotes.jenis_bucket}: ${customNotes.isi_request}`)
        : (order?.notes || order?.card_message || 'Bucket uang, kertas pink, pakai pita satin warna pink, tambahkan bunga mawar dan bunga baby pink.');

    // Specification items
    const specs = customNotes && customNotes.is_custom_bucket ? [
        {
            label: 'Jenis Bucket',
            value: customNotes.jenis_bucket || 'Kostum Bucket',
            icon: (
                <svg className="w-5 h-5 text-[#d84062]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <rect x="2" y="5" width="20" height="14" rx="2" />
                    <line x1="2" y1="10" x2="22" y2="10" />
                    <circle cx="12" cy="15" r="2" />
                </svg>
            ),
        },
        {
            label: 'Isi / Request',
            value: customNotes.isi_request || '-',
            icon: (
                <svg className="w-5 h-5 text-[#d84062]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <circle cx="12" cy="12" r="3" fill="currentColor" fillOpacity="0.2"/>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3a4 4 0 0 0-4 4c0 1.9 1.3 3.5 3.1 3.9L10 19l2-1 2 1-1.1-8.1C14.7 10.5 16 8.9 16 7a4 4 0 0 0-4-4z"/>
                </svg>
            ),
        },
        ...(customNotes.warna_bunga ? [{
            label: 'Warna Bunga Pita',
            value: customNotes.warna_bunga,
            icon: (
                <svg className="w-5 h-5 text-[#d84062]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <circle cx="12" cy="12" r="4" fill="currentColor" fillOpacity="0.3"/>
                </svg>
            ),
        }] : []),
        {
            label: 'Kertas Pembungkus',
            value: `${customNotes.warna_kertas || 'Sesuai request'} ${customNotes.model_kertas ? `(${customNotes.model_kertas})` : ''}`,
            icon: (
                <svg className="w-5 h-5 text-[#d84062]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
            ),
        },
        {
            label: 'Pita Pengikat',
            value: `${customNotes.warna_pita || 'Sesuai request'} ${customNotes.model_pita ? `(${customNotes.model_pita})` : ''}`,
            icon: (
                <svg className="w-5 h-5 text-[#d84062]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
                    <line x1="12" y1="22" x2="12" y2="7" />
                    <polyline points="20 12 20 22 4 22 4 12" />
                </svg>
            ),
        },
        ...(customNotes.hiasan && customNotes.hiasan.length > 0 ? [{
            label: 'Hiasan Tambahan',
            value: customNotes.hiasan.join(', '),
            icon: (
                <svg className="w-5 h-5 text-[#d84062]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 2l2.4 5.6L20 10l-5.6 2.4L12 18l-2.4-5.6L4 10l5.6-2.4L12 2z" />
                </svg>
            ),
        }] : []),
    ] : [
        {
            label: 'Jenis Isi',
            value: firstItem?.product_name?.toLowerCase().includes('uang') ? 'Uang' : (firstItem?.product_name?.toLowerCase().includes('snack') ? 'Snack' : 'Bunga Segar'),
            icon: (
                <svg className="w-5 h-5 text-[#d84062]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <rect x="2" y="5" width="20" height="14" rx="2" />
                    <line x1="2" y1="10" x2="22" y2="10" />
                    <circle cx="12" cy="15" r="2" />
                </svg>
            ),
        },
        {
            label: 'Jenis Bunga',
            value: 'Mawar + Baby Pink',
            icon: (
                <svg className="w-5 h-5 text-[#d84062]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <circle cx="12" cy="12" r="3" fill="currentColor" fillOpacity="0.2"/>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3a4 4 0 0 0-4 4c0 1.9 1.3 3.5 3.1 3.9L10 19l2-1 2 1-1.1-8.1C14.7 10.5 16 8.9 16 7a4 4 0 0 0-4-4z"/>
                </svg>
            ),
        },
        {
            label: 'Kertas Pembungkus',
            value: 'Pink',
            icon: (
                <svg className="w-5 h-5 text-[#d84062]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
            ),
        },
        {
            label: 'Pita',
            value: 'Pita Satin Pink',
            icon: (
                <svg className="w-5 h-5 text-[#d84062]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
                    <line x1="12" y1="22" x2="12" y2="7" />
                    <polyline points="20 12 20 22 4 22 4 12" />
                </svg>
            ),
        },
    ];

    // Status Badge helper
    const renderStatusBadge = () => {
        switch (statusType) {
            case 'pending':
                return (
                    <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-600 border border-amber-200/80 shadow-2xs">
                        <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
                        <span>{statusLabel}</span>
                    </span>
                );
            case 'processing':
                return (
                    <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-600 border border-amber-200/80 shadow-2xs">
                        <svg className="w-3.5 h-3.5 animate-spin" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        <span>{statusLabel}</span>
                    </span>
                );
            case 'created':
                return (
                    <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-semibold bg-purple-50 text-purple-600 border border-purple-200/80 shadow-2xs">
                        <span>{statusLabel}</span>
                    </span>
                );
            case 'shipped':
                return (
                    <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-600 border border-blue-200/80 shadow-2xs">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                        </svg>
                        <span>{statusLabel}</span>
                    </span>
                );
            case 'completed':
                return (
                    <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-600 border border-emerald-200/80 shadow-2xs">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        <span>{statusLabel}</span>
                    </span>
                );
            case 'cancelled':
                return (
                    <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-500 border border-slate-200 shadow-2xs">
                        <span>{statusLabel}</span>
                    </span>
                );
            default:
                return (
                    <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200">
                        <span>{statusLabel}</span>
                    </span>
                );
        }
    };

    return (
        <UserDashboardLayout activeNav="orders">
            <Head title={`Detail Pesanan ${formattedCode} — Florabelle`} />

            <div className="space-y-6">
                {/* ── BACK LINK ── */}
                <div>
                    <Link
                        href={route('orders.index')}
                        className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-500 hover:text-[#d84062] transition duration-200"
                    >
                        <span>←</span>
                        <span>Kembali ke Riwayat Pesanan</span>
                    </Link>
                </div>

                {/* ── ORDER HEADER & STATUS ── */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1 border-b border-rose-100/60">
                    <div>
                        <h1 className="font-bold text-2xl lg:text-3xl text-slate-800 tracking-tight">
                            Pesanan {formattedCode}
                        </h1>
                        <p className="text-xs text-slate-400 mt-1 font-medium">
                            {formattedDate}
                        </p>
                    </div>

                    <div>
                        {renderStatusBadge()}
                    </div>
                </div>

                {/* ── TWO COLUMN LAYOUT ── */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    {/* ──── LEFT COLUMN (60%) ──── */}
                    <div className="lg:col-span-7 space-y-5">
                        {/* 1. PRODUCT SUMMARY CARD */}
                        <div className="space-y-3">
                            {items.map((item) => (
                                <div
                                    key={item.id}
                                    className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-100 shadow-2xs flex items-center justify-between gap-4"
                                >
                                    <div className="flex items-center gap-3.5 sm:gap-4 min-w-0">
                                        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-rose-50/50 flex-shrink-0 border border-slate-100">
                                            <img
                                                src={item.product?.image_url || 'https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?auto=format&fit=crop&w=400&q=80'}
                                                alt={item.product_name}
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src = '/images/products/produk-2.jpg';
                                                }}
                                            />
                                        </div>

                                        <div className="min-w-0">
                                            <h3 className="font-bold text-sm sm:text-base text-slate-800 truncate leading-snug">
                                                {item.product_name}
                                            </h3>
                                            <p className="font-extrabold text-sm sm:text-base text-[#d84062] mt-1">
                                                {formatRupiah(item.price)}
                                            </p>
                                            <p className="text-[11px] text-slate-400 mt-0.5">
                                                {item.quantity || 1} Item
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* 2. DETAIL REQUEST CARD */}
                        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-100 shadow-2xs space-y-4">
                            {/* Card Header */}
                            <div className="flex items-center gap-2">
                                <div className="w-7 h-7 rounded-lg bg-rose-50 text-[#d84062] flex items-center justify-center text-sm shadow-2xs">
                                    🌸
                                </div>
                                <h3 className="font-bold text-sm sm:text-base text-slate-800">
                                    Detail Request
                                </h3>
                            </div>

                            {/* Request Quote Box */}
                            <div className="p-4 rounded-xl bg-gradient-to-r from-rose-50/80 to-pink-50/60 border border-rose-100 text-xs sm:text-sm text-slate-700 leading-relaxed italic font-serif">
                                "{requestNote}"
                            </div>

                            {/* 4 Specifications Cards */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 pt-1">
                                {specs.map((spec, idx) => (
                                    <div
                                        key={idx}
                                        className="bg-white rounded-xl p-3 border border-slate-100/90 shadow-2xs flex flex-col items-start"
                                    >
                                        <div className="w-8 h-8 rounded-lg bg-rose-50/80 flex items-center justify-center mb-2">
                                            {spec.icon}
                                        </div>
                                        <span className="text-[10px] text-slate-400 font-medium">
                                            {spec.label}
                                        </span>
                                        <span className="text-xs font-bold text-slate-800 mt-0.5 truncate w-full">
                                            {spec.value}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* ──── RIGHT COLUMN (40%) ──── */}
                    <div className="lg:col-span-5 space-y-5">
                        {/* 1. INFORMASI PESANAN CARD */}
                        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-100 shadow-2xs space-y-4">
                            <h3 className="font-bold text-sm sm:text-base text-slate-800 border-b border-slate-100 pb-3">
                                Informasi Pesanan
                            </h3>

                            <div className="space-y-3.5 text-xs">
                                {/* Nomor Pesanan */}
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-slate-500">
                                        <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                        <span>Nomor Pesanan</span>
                                    </div>
                                    <span className="font-semibold text-slate-800">{formattedCode}</span>
                                </div>

                                {/* Tanggal Pesanan */}
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-slate-500">
                                        <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                                            <line x1="16" y1="2" x2="16" y2="6" />
                                            <line x1="8" y1="2" x2="8" y2="6" />
                                            <line x1="3" y1="10" x2="21" y2="10" />
                                        </svg>
                                        <span>Tanggal Pesanan</span>
                                    </div>
                                    <span className="font-semibold text-slate-800">{formattedDate}</span>
                                </div>

                                {/* Status */}
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-slate-500">
                                        <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                            <circle cx="12" cy="12" r="10" />
                                            <polyline points="12 6 12 12 16 14" />
                                        </svg>
                                        <span>Status</span>
                                    </div>
                                    <div>{renderStatusBadge()}</div>
                                </div>

                                {/* Metode Pembayaran */}
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-slate-500">
                                        <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                            <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                                            <line x1="1" y1="10" x2="23" y2="10" />
                                        </svg>
                                        <span>Metode Pembayaran</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 font-semibold text-slate-800">
                                        <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                                        <span className="capitalize">{order?.payment_method || 'Transfer Bank (BRI)'}</span>
                                    </div>
                                </div>

                                {/* Total Pembayaran */}
                                <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                                    <div className="flex items-center gap-2 font-medium text-slate-600">
                                        <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <span>Total Pembayaran</span>
                                    </div>
                                    <span className="font-extrabold text-base text-[#d84062]">
                                        {formatRupiah(order?.total || 200000)}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* 2. ALAMAT PENGIRIMAN CARD */}
                        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-100 shadow-2xs space-y-3">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <span className="text-[#d84062] text-sm">📍</span>
                                    <h3 className="font-bold text-sm sm:text-base text-slate-800">
                                        Alamat Pengiriman
                                    </h3>
                                </div>
                                <Link
                                    href="/profile"
                                    className="text-[11px] font-semibold text-[#d84062] hover:text-[#be2f50] flex items-center gap-1 border border-rose-200 hover:border-rose-300 px-2.5 py-1 rounded-full transition"
                                >
                                    <span>✏️</span>
                                    <span>Edit Alamat</span>
                                </Link>
                            </div>

                            <div className="text-xs space-y-1 pt-1">
                                <p className="font-bold text-slate-800 text-xs sm:text-sm">
                                    {recipientName}
                                </p>
                                <p className="text-slate-500 font-medium">
                                    {recipientPhone}
                                </p>
                                <p className="text-slate-600 leading-relaxed pt-1 text-[11px] sm:text-xs">
                                    {recipientAddress}
                                </p>
                            </div>
                        </div>

                        {/* 3. HUBUNGI PENJUAL (WHATSAPP BUTTON) */}
                        <div>
                            <a
                                href={whatsappUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full inline-flex items-center justify-center gap-2 py-3 px-5 rounded-full bg-[#d84062] hover:bg-[#be2f50] text-white font-bold text-xs sm:text-sm shadow-md shadow-rose-200 transition-all duration-200 active:scale-98 cursor-pointer"
                            >
                                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                                </svg>
                                <span>Hubungi Penjual</span>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </UserDashboardLayout>
    );
}
