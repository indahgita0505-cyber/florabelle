import { Head, useForm, usePage, router } from '@inertiajs/react';
import { useState, useRef } from 'react';
import UserDashboardLayout from '@/Layouts/UserDashboardLayout';

export default function Edit({ stats = {}, primaryAddress = null, status = null }) {
    const { auth } = usePage().props;
    const user = auth?.user;

    const fileInputRef = useRef(null);
    const [avatarPreview, setAvatarPreview] = useState(null);
    const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

    // Active edit modal: 'name' | 'email' | 'phone' | 'password' | 'address' | null
    const [activeEditModal, setActiveEditModal] = useState(null);
    const [toastMessage, setToastMessage] = useState(null);

    // Separate forms for individual field editing
    const nameForm = useForm({
        name: user?.name || '',
    });

    const emailForm = useForm({
        email: user?.email || '',
    });

    const phoneForm = useForm({
        whatsapp_number: user?.whatsapp_number || '',
    });

    const passwordForm = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const addressForm = useForm({
        recipient_name: primaryAddress?.recipient_name || user?.name || '',
        phone_number: primaryAddress?.phone_number || user?.whatsapp_number || '0823 4567 8910',
        full_address: primaryAddress?.full_address || 'Jl. Melati No. 12, Kel. Tatura, Kec. Mantikulore, Kota Palu, Sulawesi Tengah 94118',
        label: primaryAddress?.label || 'Alamat Utama',
    });

    // ── SUBMIT HANDLERS ──
    const handleNameSubmit = (e) => {
        e.preventDefault();
        nameForm.patch(route('profile.update'), {
            preserveScroll: true,
            onSuccess: () => {
                setActiveEditModal(null);
                setToastMessage('Nama lengkap berhasil diperbarui! ✨');
                setTimeout(() => setToastMessage(null), 3000);
            },
        });
    };

    const handleEmailSubmit = (e) => {
        e.preventDefault();
        emailForm.patch(route('profile.update'), {
            preserveScroll: true,
            onSuccess: () => {
                setActiveEditModal(null);
                setToastMessage('Alamat email berhasil diperbarui! ✨');
                setTimeout(() => setToastMessage(null), 3000);
            },
        });
    };

    const handlePhoneSubmit = (e) => {
        e.preventDefault();
        phoneForm.patch(route('profile.update'), {
            preserveScroll: true,
            onSuccess: () => {
                setActiveEditModal(null);
                setToastMessage('Nomor telepon berhasil diperbarui! ✨');
                setTimeout(() => setToastMessage(null), 3000);
            },
        });
    };

    const handlePasswordSubmit = (e) => {
        e.preventDefault();
        passwordForm.put(route('password.update'), {
            preserveScroll: true,
            onSuccess: () => {
                passwordForm.reset();
                setActiveEditModal(null);
                setToastMessage('Kata sandi berhasil diperbarui! 🔒');
                setTimeout(() => setToastMessage(null), 3000);
            },
        });
    };

    const openAddressModal = () => {
        addressForm.setData({
            full_address: primaryAddress?.full_address || '',
            label: primaryAddress?.label || 'Alamat Utama',
            recipient_name: primaryAddress?.recipient_name || user?.name || '',
            phone_number: primaryAddress?.phone_number || user?.whatsapp_number || '',
        });
        addressForm.clearErrors();
        setActiveEditModal('address');
    };

    const handleAddressSubmit = (e) => {
        e.preventDefault();
        addressForm.post(route('profile.address.update'), {
            preserveScroll: true,
            onSuccess: () => {
                setActiveEditModal(null);
                setToastMessage('Alamat pengiriman berhasil disimpan! 🏡');
                setTimeout(() => setToastMessage(null), 3000);
            },
        });
    };

    const handleAvatarChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            setToastMessage('Harap pilih file gambar (JPG, PNG, atau WEBP).');
            setTimeout(() => setToastMessage(null), 3000);
            return;
        }

        const preview = URL.createObjectURL(file);
        setAvatarPreview(preview);
        setIsUploadingAvatar(true);

        const formData = new FormData();
        formData.append('avatar', file);

        router.post(route('profile.avatar.update'), formData, {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                setIsUploadingAvatar(false);
                setToastMessage('Foto profil berhasil diperbarui! 🌸');
                setTimeout(() => setToastMessage(null), 3000);
            },
            onError: (errors) => {
                setIsUploadingAvatar(false);
                setAvatarPreview(null);
                setToastMessage(errors.avatar || 'Gagal mengunggah foto profil.');
                setTimeout(() => setToastMessage(null), 3000);
            },
        });
    };

    return (
        <UserDashboardLayout activeNav="profile">
            <Head title="Profil Saya - Florabelle" />

            {/* Toast Alert */}
            {toastMessage && (
                <div className="fixed bottom-6 right-6 z-50 bg-slate-900/95 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 text-sm animate-fade-in border border-rose-500/30">
                    <svg className="w-4 h-4 text-rose-400 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>{toastMessage}</span>
                    <button onClick={() => setToastMessage(null)} className="ml-2 text-slate-400 hover:text-white text-xs cursor-pointer">
                        ✕
                    </button>
                </div>
            )}

            <div className="max-w-4xl space-y-6">
                {/* ── PAGE TITLE & SUBTITLE ── */}
                <div>
                    <h2 className="font-bold text-2xl lg:text-3xl text-slate-800 tracking-tight">
                        Profil Saya
                    </h2>
                    <p className="text-xs lg:text-sm text-slate-400 mt-1">
                        Kelola informasi akun dan alamat pengiriman Anda.
                    </p>
                </div>

                {/* ── 1. TOP PROFILE CARD WITH STATS ── */}
                <div
                    className="relative overflow-hidden rounded-[28px] p-6 lg:p-8 border border-rose-100 shadow-2xs"
                    style={{
                        background: 'linear-gradient(135deg, #fff2f5 0%, #fde2e8 50%, #fcd4dc 100%)',
                    }}
                >
                    {/* Background SVG Watermark */}
                    <div className="absolute top-4 right-8 select-none pointer-events-none opacity-15 text-rose-300">
                        <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2a9 9 0 0 0-9 9c0 4.97 4.03 9 9 9s9-4.03 9-9a9 9 0 0 0-9-9zm0 2c1.7 0 3.2.6 4.4 1.6l-8 8A6.98 6.98 0 0 1 5 11c0-3.9 3.1-7 7-7zm0 14c-1.7 0-3.2-.6-4.4-1.6l8-8c1 1.2 1.6 2.7 1.6 4.4 0 3.9-3.1 7-7 7z" />
                        </svg>
                    </div>

                    <div className="relative z-10">
                        {/* Avatar & User Details */}
                        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
                            {/* Hidden file input for photo gallery */}
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleAvatarChange}
                                accept="image/png, image/jpeg, image/jpg, image/webp"
                                className="hidden"
                            />

                            {/* Avatar circle with camera edit badge */}
                            <div
                                onClick={() => fileInputRef.current?.click()}
                                className="relative flex-shrink-0 cursor-pointer group"
                                title="Klik untuk mengganti foto profil dari galeri"
                            >
                                <div className="w-20 h-20 rounded-full bg-[#f8d2dc] text-[#d84062] flex items-center justify-center shadow-inner border-4 border-white/80 overflow-hidden relative">
                                    {(avatarPreview || user?.avatar) ? (
                                        <img
                                            src={avatarPreview || user.avatar}
                                            alt={user?.name}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <svg className="w-10 h-10 text-[#d84062]" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                        </svg>
                                    )}

                                    {/* Hover overlay */}
                                    <div className="absolute inset-0 bg-black/35 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[10px] font-bold">
                                        {isUploadingAvatar ? '...' : 'Pilih Foto'}
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        fileInputRef.current?.click();
                                    }}
                                    disabled={isUploadingAvatar}
                                    className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-[#d84062] hover:bg-[#be2f50] text-white flex items-center justify-center shadow-md border-2 border-white transition active:scale-95 cursor-pointer"
                                    title="Pilih foto dari galeri"
                                    aria-label="Pilih foto dari galeri"
                                >
                                    {isUploadingAvatar ? (
                                        <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                                        </svg>
                                    ) : (
                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                    )}
                                </button>
                            </div>

                            {/* Name & Email (Edit Profil button removed as requested) */}
                            <div className="text-center sm:text-left flex-1 min-w-0 pt-1">
                                <h3 className="font-bold text-lg lg:text-xl text-slate-800">
                                    {user?.name}
                                </h3>
                                <p className="text-xs lg:text-sm text-slate-500 mt-0.5">
                                    {user?.email}
                                </p>
                            </div>
                        </div>

                        {/* Order Stats Row */}
                        <div className="bg-white/90 backdrop-blur-xs rounded-2xl p-4 mt-6 border border-rose-100/80 grid grid-cols-3 gap-2 text-center shadow-2xs">
                            {/* Total Pesanan */}
                            <div className="flex flex-col items-center">
                                <div className="w-8 h-8 rounded-full bg-rose-50 text-[#d84062] flex items-center justify-center mb-1">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                    </svg>
                                </div>
                                <span className="text-[10px] sm:text-xs text-slate-400 font-medium">Total Pesanan</span>
                                <span className="font-bold text-slate-800 text-sm sm:text-base mt-0.5">
                                    {stats?.total_orders ?? 0}
                                </span>
                            </div>

                            {/* Pesanan Diproses */}
                            <div className="flex flex-col items-center border-x border-slate-100">
                                <div className="w-8 h-8 rounded-full bg-rose-50 text-[#d84062] flex items-center justify-center mb-1">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                    </svg>
                                </div>
                                <span className="text-[10px] sm:text-xs text-slate-400 font-medium">Pesanan Diproses</span>
                                <span className="font-bold text-slate-800 text-sm sm:text-base mt-0.5">
                                    {stats?.processing_orders ?? 0}
                                </span>
                            </div>

                            {/* Pesanan Selesai */}
                            <div className="flex flex-col items-center">
                                <div className="w-8 h-8 rounded-full bg-rose-50 text-[#d84062] flex items-center justify-center mb-1">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <span className="text-[10px] sm:text-xs text-slate-400 font-medium">Pesanan Selesai</span>
                                <span className="font-bold text-slate-800 text-sm sm:text-base mt-0.5">
                                    {stats?.completed_orders ?? 0}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── 2. INFORMASI AKUN ── */}
                <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-2xs">
                    <h3 className="font-bold text-base text-slate-800 mb-5">
                        Informasi Akun
                    </h3>

                    <div className="space-y-4">
                        {/* Nama Lengkap */}
                        <div className="flex items-center justify-between py-2 border-b border-slate-50">
                            <div className="flex items-center gap-3.5">
                                <div className="w-9 h-9 rounded-full bg-slate-50 text-slate-500 flex items-center justify-center">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-[11px] text-slate-400 font-medium">Nama Lengkap</p>
                                    <p className="text-sm font-semibold text-slate-800">{user?.name}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => {
                                    nameForm.setData('name', user?.name || '');
                                    nameForm.clearErrors();
                                    setActiveEditModal('name');
                                }}
                                className="text-xs font-semibold text-[#d84062] hover:text-[#be2f50] flex items-center gap-1.5 cursor-pointer"
                            >
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                </svg>
                                <span>Edit</span>
                            </button>
                        </div>

                        {/* Email */}
                        <div className="flex items-center justify-between py-2 border-b border-slate-50">
                            <div className="flex items-center gap-3.5">
                                <div className="w-9 h-9 rounded-full bg-slate-50 text-slate-500 flex items-center justify-center">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-[11px] text-slate-400 font-medium">Email</p>
                                    <p className="text-sm font-semibold text-slate-800">{user?.email}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => {
                                    emailForm.setData('email', user?.email || '');
                                    emailForm.clearErrors();
                                    setActiveEditModal('email');
                                }}
                                className="text-xs font-semibold text-[#d84062] hover:text-[#be2f50] flex items-center gap-1.5 cursor-pointer"
                            >
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                </svg>
                                <span>Edit</span>
                            </button>
                        </div>

                        {/* No. Telepon */}
                        <div className="flex items-center justify-between py-2 border-b border-slate-50">
                            <div className="flex items-center gap-3.5">
                                <div className="w-9 h-9 rounded-full bg-slate-50 text-slate-500 flex items-center justify-center">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-[11px] text-slate-400 font-medium">No. Telepon</p>
                                    <p className="text-sm font-semibold text-slate-800">
                                        {user?.whatsapp_number || '0823 4567 8910'}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => {
                                    phoneForm.setData('whatsapp_number', user?.whatsapp_number || '');
                                    phoneForm.clearErrors();
                                    setActiveEditModal('phone');
                                }}
                                className="text-xs font-semibold text-[#d84062] hover:text-[#be2f50] flex items-center gap-1.5 cursor-pointer"
                            >
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                </svg>
                                <span>Edit</span>
                            </button>
                        </div>

                        {/* Password */}
                        <div className="flex items-center justify-between py-2">
                            <div className="flex items-center gap-3.5">
                                <div className="w-9 h-9 rounded-full bg-slate-50 text-slate-500 flex items-center justify-center">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-[11px] text-slate-400 font-medium">Password</p>
                                    <p className="text-sm font-semibold text-slate-800 tracking-widest">••••••••</p>
                                </div>
                            </div>
                            <button
                                onClick={() => {
                                    passwordForm.reset();
                                    passwordForm.clearErrors();
                                    setActiveEditModal('password');
                                }}
                                className="text-xs font-semibold text-[#d84062] hover:text-[#be2f50] flex items-center gap-1.5 cursor-pointer"
                            >
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                                <span>Ubah Password</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* ── 3. ALAMAT PENGIRIMAN ── */}
                <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-2xs">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-base text-slate-800">
                            Alamat Pengiriman
                        </h3>
                        <button
                            onClick={openAddressModal}
                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-rose-50 text-[#d84062] hover:bg-rose-100 border border-rose-200/80 text-xs font-semibold transition cursor-pointer"
                        >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                            </svg>
                            <span>Tambah Alamat</span>
                        </button>
                    </div>

                    {/* Address Box */}
                    <div className="bg-[#fdfafb] rounded-2xl p-4 border border-rose-100/70 flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3.5">
                            <div className="w-9 h-9 rounded-full bg-rose-100/60 text-[#d84062] flex items-center justify-center flex-shrink-0 mt-0.5">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </div>
                            <div>
                                <span className="inline-block bg-rose-100 text-[#d84062] text-[10px] font-bold px-2 py-0.5 rounded-full mb-1">
                                    {primaryAddress?.label || 'Alamat Utama'}
                                </span>
                                <p className="text-xs sm:text-sm font-semibold text-slate-700 leading-relaxed">
                                    {primaryAddress?.full_address || 'Jl. Melati No. 12, Kel. Tatura, Kec. Mantikulore, Kota Palu, Sulawesi Tengah 94118'}
                                </p>
                                {primaryAddress?.phone_number && (
                                    <p className="text-[11px] text-slate-400 mt-1">
                                        Penerima: {primaryAddress.recipient_name || user?.name} ({primaryAddress.phone_number})
                                    </p>
                                )}
                            </div>
                        </div>

                        <button
                            onClick={openAddressModal}
                            className="text-xs font-semibold text-[#d84062] hover:text-[#be2f50] flex-shrink-0 flex items-center gap-1.5 cursor-pointer"
                        >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                            <span>Edit Alamat</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* ═══════════════════════════════════════════════
                 MODAL 1: EDIT NAMA LENGKAP SAJA
            ═══════════════════════════════════════════════ */}
            {activeEditModal === 'name' && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
                    <div className="bg-white rounded-[24px] max-w-md w-full p-6 shadow-2xl border border-rose-100 animate-scale-up">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h4 className="font-bold text-lg text-slate-800">Edit Nama Lengkap</h4>
                                <p className="text-xs text-slate-400 mt-0.5">Ubah nama yang tertera pada akun dan pesanan Anda.</p>
                            </div>
                            <button
                                onClick={() => setActiveEditModal(null)}
                                className="w-8 h-8 rounded-full bg-slate-100 text-slate-400 hover:text-slate-700 flex items-center justify-center text-sm cursor-pointer"
                            >
                                ✕
                            </button>
                        </div>

                        <form onSubmit={handleNameSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Nama Lengkap</label>
                                <input
                                    type="text"
                                    value={nameForm.data.name}
                                    onChange={(e) => nameForm.setData('name', e.target.value)}
                                    placeholder="Masukkan nama lengkap..."
                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100"
                                    required
                                    autoFocus
                                />
                                {nameForm.errors.name && (
                                    <p className="text-xs text-red-500 mt-1">{nameForm.errors.name}</p>
                                )}
                            </div>

                            <div className="flex justify-end gap-2.5 pt-3">
                                <button
                                    type="button"
                                    onClick={() => setActiveEditModal(null)}
                                    className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition cursor-pointer"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={nameForm.processing}
                                    className="px-5 py-2 rounded-xl bg-[#d84062] hover:bg-[#be2f50] text-white text-xs font-semibold shadow-xs transition disabled:opacity-50 cursor-pointer"
                                >
                                    {nameForm.processing ? 'Menyimpan...' : 'Simpan Nama'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ═══════════════════════════════════════════════
                 MODAL 2: EDIT EMAIL SAJA
            ═══════════════════════════════════════════════ */}
            {activeEditModal === 'email' && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
                    <div className="bg-white rounded-[24px] max-w-md w-full p-6 shadow-2xl border border-rose-100 animate-scale-up">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h4 className="font-bold text-lg text-slate-800">Edit Alamat Email</h4>
                                <p className="text-xs text-slate-400 mt-0.5">Alamat email ini digunakan untuk login akun.</p>
                            </div>
                            <button
                                onClick={() => setActiveEditModal(null)}
                                className="w-8 h-8 rounded-full bg-slate-100 text-slate-400 hover:text-slate-700 flex items-center justify-center text-sm cursor-pointer"
                            >
                                ✕
                            </button>
                        </div>

                        <form onSubmit={handleEmailSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Alamat Email</label>
                                <input
                                    type="email"
                                    value={emailForm.data.email}
                                    onChange={(e) => emailForm.setData('email', e.target.value)}
                                    placeholder="nama@email.com"
                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100"
                                    required
                                    autoFocus
                                />
                                {emailForm.errors.email && (
                                    <p className="text-xs text-red-500 mt-1">{emailForm.errors.email}</p>
                                )}
                            </div>

                            <div className="flex justify-end gap-2.5 pt-3">
                                <button
                                    type="button"
                                    onClick={() => setActiveEditModal(null)}
                                    className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition cursor-pointer"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={emailForm.processing}
                                    className="px-5 py-2 rounded-xl bg-[#d84062] hover:bg-[#be2f50] text-white text-xs font-semibold shadow-xs transition disabled:opacity-50 cursor-pointer"
                                >
                                    {emailForm.processing ? 'Menyimpan...' : 'Simpan Email'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ═══════════════════════════════════════════════
                 MODAL 3: EDIT NO. TELEPON SAJA
            ═══════════════════════════════════════════════ */}
            {activeEditModal === 'phone' && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
                    <div className="bg-white rounded-[24px] max-w-md w-full p-6 shadow-2xl border border-rose-100 animate-scale-up">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h4 className="font-bold text-lg text-slate-800">Edit Nomor Telepon</h4>
                                <p className="text-xs text-slate-400 mt-0.5">Nomor WhatsApp aktif untuk konfirmasi pesanan.</p>
                            </div>
                            <button
                                onClick={() => setActiveEditModal(null)}
                                className="w-8 h-8 rounded-full bg-slate-100 text-slate-400 hover:text-slate-700 flex items-center justify-center text-sm cursor-pointer"
                            >
                                ✕
                            </button>
                        </div>

                        <form onSubmit={handlePhoneSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-slate-600 mb-1.5">No. Telepon / WhatsApp</label>
                                <input
                                    type="text"
                                    value={phoneForm.data.whatsapp_number}
                                    onChange={(e) => phoneForm.setData('whatsapp_number', e.target.value)}
                                    placeholder="Contoh: 0823 4567 8910"
                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100"
                                    required
                                    autoFocus
                                />
                                {phoneForm.errors.whatsapp_number && (
                                    <p className="text-xs text-red-500 mt-1">{phoneForm.errors.whatsapp_number}</p>
                                )}
                            </div>

                            <div className="flex justify-end gap-2.5 pt-3">
                                <button
                                    type="button"
                                    onClick={() => setActiveEditModal(null)}
                                    className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition cursor-pointer"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={phoneForm.processing}
                                    className="px-5 py-2 rounded-xl bg-[#d84062] hover:bg-[#be2f50] text-white text-xs font-semibold shadow-xs transition disabled:opacity-50 cursor-pointer"
                                >
                                    {phoneForm.processing ? 'Menyimpan...' : 'Simpan Nomor'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ═══════════════════════════════════════════════
                 MODAL 4: UBAH PASSWORD
            ═══════════════════════════════════════════════ */}
            {activeEditModal === 'password' && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
                    <div className="bg-white rounded-[24px] max-w-md w-full p-6 shadow-2xl border border-rose-100 animate-scale-up">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h4 className="font-bold text-lg text-slate-800">Ubah Kata Sandi</h4>
                                <p className="text-xs text-slate-400 mt-0.5">Pastikan kata sandi baru Anda aman dan kuat.</p>
                            </div>
                            <button
                                onClick={() => setActiveEditModal(null)}
                                className="w-8 h-8 rounded-full bg-slate-100 text-slate-400 hover:text-slate-700 flex items-center justify-center text-sm cursor-pointer"
                            >
                                ✕
                            </button>
                        </div>

                        <form onSubmit={handlePasswordSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-slate-600 mb-1">Kata Sandi Saat Ini</label>
                                <input
                                    type="password"
                                    value={passwordForm.data.current_password}
                                    onChange={(e) => passwordForm.setData('current_password', e.target.value)}
                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100"
                                    required
                                    autoFocus
                                />
                                {passwordForm.errors.current_password && (
                                    <p className="text-xs text-red-500 mt-1">{passwordForm.errors.current_password}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-600 mb-1">Kata Sandi Baru</label>
                                <input
                                    type="password"
                                    value={passwordForm.data.password}
                                    onChange={(e) => passwordForm.setData('password', e.target.value)}
                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100"
                                    required
                                />
                                {passwordForm.errors.password && (
                                    <p className="text-xs text-red-500 mt-1">{passwordForm.errors.password}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-600 mb-1">Konfirmasi Kata Sandi Baru</label>
                                <input
                                    type="password"
                                    value={passwordForm.data.password_confirmation}
                                    onChange={(e) => passwordForm.setData('password_confirmation', e.target.value)}
                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100"
                                    required
                                />
                                {passwordForm.errors.password_confirmation && (
                                    <p className="text-xs text-red-500 mt-1">{passwordForm.errors.password_confirmation}</p>
                                )}
                            </div>

                            <div className="flex justify-end gap-2.5 pt-3">
                                <button
                                    type="button"
                                    onClick={() => setActiveEditModal(null)}
                                    className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition cursor-pointer"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={passwordForm.processing}
                                    className="px-5 py-2 rounded-xl bg-[#d84062] hover:bg-[#be2f50] text-white text-xs font-semibold shadow-xs transition disabled:opacity-50 cursor-pointer"
                                >
                                    {passwordForm.processing ? 'Menyimpan...' : 'Perbarui Kata Sandi'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ═══════════════════════════════════════════════
                 MODAL 5: EDIT ALAMAT PENGIRIMAN
            ═══════════════════════════════════════════════ */}
            {activeEditModal === 'address' && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
                    <div className="bg-white rounded-[24px] max-w-md w-full p-6 shadow-2xl border border-rose-100 animate-scale-up">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h4 className="font-bold text-lg text-slate-800">Alamat Pengiriman</h4>
                                <p className="text-xs text-slate-400 mt-0.5">Alamat tujuan pengantaran pesanan bunga.</p>
                            </div>
                            <button
                                onClick={() => setActiveEditModal(null)}
                                className="w-8 h-8 rounded-full bg-slate-100 text-slate-400 hover:text-slate-700 flex items-center justify-center text-sm cursor-pointer"
                            >
                                ✕
                            </button>
                        </div>

                        <form onSubmit={handleAddressSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Alamat Lengkap Pengiriman</label>
                                <textarea
                                    rows="4"
                                    value={addressForm.data.full_address}
                                    onChange={(e) => addressForm.setData('full_address', e.target.value)}
                                    placeholder="Jalan, No. Rumah, RT/RW, Kelurahan, Kecamatan, Kota Palu, Sulawesi Tengah..."
                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100"
                                    required
                                    autoFocus
                                />
                                {addressForm.errors.full_address && (
                                    <p className="text-xs text-red-500 mt-1">{addressForm.errors.full_address}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Catatan / Label Alamat (Opsional)</label>
                                <input
                                    type="text"
                                    value={addressForm.data.label}
                                    onChange={(e) => addressForm.setData('label', e.target.value)}
                                    placeholder="Contoh: Rumah, Kantor, Patokan: Pagar Hitam"
                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100"
                                />
                            </div>

                            <div className="flex justify-end gap-2.5 pt-3">
                                <button
                                    type="button"
                                    onClick={() => setActiveEditModal(null)}
                                    className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition cursor-pointer"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={addressForm.processing}
                                    className="px-5 py-2 rounded-xl bg-[#d84062] hover:bg-[#be2f50] text-white text-xs font-semibold shadow-xs transition disabled:opacity-50 cursor-pointer"
                                >
                                    {addressForm.processing ? 'Menyimpan...' : 'Simpan Alamat'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </UserDashboardLayout>
    );
}
