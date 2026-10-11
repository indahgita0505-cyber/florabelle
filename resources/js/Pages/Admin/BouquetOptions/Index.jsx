import { Head, Link, router, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { useState, useRef, useEffect } from 'react';
import { 
    Plus, 
    ArrowLeft, 
    Trash2, 
    Edit3, 
    Upload, 
    X, 
    Palette, 
    Package, 
    Sparkles, 
    CheckCircle2, 
    AlertCircle,
    Sliders,
    Layers,
    Tag,
    Info
} from 'lucide-react';

export default function BouquetOptionIndex({ categories = [], options = [], initialCategoryId = null }) {
    // Current Active View: null = Categories Overview, number = Category ID for "Pengaturan Opsi"
    const [activeCategoryId, setActiveCategoryId] = useState(initialCategoryId);
    
    // Tab within "Pengaturan Opsi": 'wrapping', 'pita', 'dekorasi', 'info'
    const [activeTab, setActiveTab] = useState('wrapping');

    // Modals
    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
    const [isOptionModalOpen, setIsOptionModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    // Selected items for editing / deleting
    const [editingCategory, setEditingCategory] = useState(null);
    const [editingOption, setEditingOption] = useState(null);
    const [deletingItem, setDeletingItem] = useState(null); // { type: 'category' | 'option', data: object }

    // Previews & File refs
    const [categoryPreviewImage, setCategoryPreviewImage] = useState(null);
    const [optionPreviewImage, setOptionPreviewImage] = useState(null);
    const categoryFileRef = useRef(null);
    const optionFileRef = useRef(null);

    // Form for Category
    const { 
        data: catData, 
        setData: setCatData, 
        post: postCategory, 
        processing: savingCategory, 
        errors: catErrors, 
        reset: resetCat, 
        clearErrors: clearCatErrors 
    } = useForm({
        name: '',
        description: '',
        base_price: '',
        is_active: true,
        image: null,
    });

    // Form for Option
    const { 
        data: optData, 
        setData: setOptData, 
        post: postOption, 
        processing: savingOption, 
        errors: optErrors, 
        reset: resetOpt, 
        clearErrors: clearOptErrors 
    } = useForm({
        custom_category_id: '',
        tab_type: 'wrapping',
        name: '',
        price_adjustment: '0',
        is_active: true,
        image: null,
        color_hex: '#ffffff',
        description: '',
    });

    // Active Category Object
    const activeCategory = categories.find(c => c.id === activeCategoryId) || null;

    // Filter options for currently selected category and tab
    const categoryOptions = options.filter(opt => opt.custom_category_id === activeCategoryId);
    const tabOptions = categoryOptions.filter(opt => opt.tab_type === activeTab);

    // Tabs definition
    const tabsList = [
        { id: 'wrapping', label: 'Pilihan Wrapping', icon: <Layers size={14} /> },
        { id: 'pita', label: 'Pita', icon: <Tag size={14} /> },
        { id: 'dekorasi', label: 'Dekorasi Tambahan', icon: <Sparkles size={14} /> },
        { id: 'info', label: 'Info Khusus', icon: <Info size={14} /> },
    ];

    // ===================================
    // Category Modal Handlers
    // ===================================
    const openAddCategoryModal = () => {
        clearCatErrors();
        resetCat();
        setEditingCategory(null);
        setCategoryPreviewImage(null);
        setIsCategoryModalOpen(true);
    };

    const openEditCategoryModal = (cat) => {
        clearCatErrors();
        setCatData({
            name: cat.name,
            description: cat.description || '',
            base_price: cat.base_price,
            is_active: cat.is_active,
            image: null,
        });
        setEditingCategory(cat);
        setCategoryPreviewImage(cat.image_url);
        setIsCategoryModalOpen(true);
    };

    const handleCategorySubmit = (e) => {
        e.preventDefault();
        if (editingCategory) {
            postCategory(route('admin.custom-categories.update', editingCategory.id), {
                preserveScroll: true,
                onSuccess: () => closeModals(),
            });
        } else {
            postCategory(route('admin.custom-categories.store'), {
                preserveScroll: true,
                onSuccess: () => closeModals(),
            });
        }
    };

    // ===================================
    // Option Modal Handlers
    // ===================================
    const openAddOptionModal = () => {
        clearOptErrors();
        resetOpt();
        setOptData({
            custom_category_id: activeCategoryId,
            tab_type: activeTab,
            name: '',
            price_adjustment: '0',
            is_active: true,
            image: null,
            color_hex: '#ffffff',
            description: '',
        });
        setEditingOption(null);
        setOptionPreviewImage(null);
        setIsOptionModalOpen(true);
    };

    const openEditOptionModal = (opt) => {
        clearOptErrors();
        setOptData({
            custom_category_id: opt.custom_category_id,
            tab_type: opt.tab_type,
            name: opt.name,
            price_adjustment: opt.price_adjustment,
            is_active: opt.is_active,
            image: null,
            color_hex: opt.color_hex || '#ffffff',
            description: opt.description || '',
        });
        setEditingOption(opt);
        setOptionPreviewImage(opt.image_url);
        setIsOptionModalOpen(true);
    };

    const handleOptionSubmit = (e) => {
        e.preventDefault();
        if (editingOption) {
            postOption(route('admin.bouquet-options.update', editingOption.id), {
                preserveScroll: true,
                onSuccess: () => closeModals(),
            });
        } else {
            postOption(route('admin.bouquet-options.store'), {
                preserveScroll: true,
                onSuccess: () => closeModals(),
            });
        }
    };

    // ===================================
    // Delete Handlers
    // ===================================
    const openDeleteModal = (type, data) => {
        setDeletingItem({ type, data });
        setIsDeleteModalOpen(true);
    };

    const handleDelete = () => {
        if (!deletingItem) return;
        if (deletingItem.type === 'category') {
            router.delete(route('admin.custom-categories.destroy', deletingItem.data.id), {
                preserveScroll: true,
                onSuccess: () => {
                    if (activeCategoryId === deletingItem.data.id) {
                        setActiveCategoryId(null);
                    }
                    closeModals();
                },
            });
        } else {
            router.delete(route('admin.bouquet-options.destroy', deletingItem.data.id), {
                preserveScroll: true,
                onSuccess: () => closeModals(),
            });
        }
    };

    const closeModals = () => {
        setIsCategoryModalOpen(false);
        setIsOptionModalOpen(false);
        setIsDeleteModalOpen(false);
        setEditingCategory(null);
        setEditingOption(null);
        setDeletingItem(null);
        setCategoryPreviewImage(null);
        setOptionPreviewImage(null);
        resetCat();
        resetOpt();
        clearCatErrors();
        clearOptErrors();
    };

    return (
        <AdminLayout
            title={activeCategory ? `Pengaturan Opsi – ${activeCategory.name}` : "Opsi Custom Bucket"}
            subtitle={activeCategory ? `Kelola pilihan dan opsi untuk kategori ${activeCategory.name}.` : "Kelola pilihan dan ketentuan buket custom sesuai permintaan pelanggan."}
            quote="Custom Bouquet Sesuai Impian, Cantik Spesial! 🌸"
        >
            <Head title={activeCategory ? `Pengaturan Opsi ${activeCategory.name} - Florabelle.id` : "Opsi Custom Bucket - Florabelle.id"} />

            <div className="space-y-6 max-w-7xl mx-auto">
                {/* ======================================================== */}
                {/* VIEW 1: Overview 4 Kategori Custom (Matching bottom-left) */}
                {/* ======================================================== */}
                {!activeCategory ? (
                    <div className="space-y-6">
                        {/* Header Action Bar */}
                        <div className="bg-white rounded-3xl p-5 border border-pink-100/60 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div>
                                <h3 className="text-base font-bold text-slate-800">
                                    Kategori Custom Bouquet
                                </h3>
                                <p className="text-xs text-slate-400">
                                    Pilih kategori untuk mengatur opsi wrapping, pita, dekorasi tambahan, dan ketentuan khusus.
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={openAddCategoryModal}
                                className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-400 hover:from-pink-600 hover:to-rose-500 text-white font-bold text-xs shadow-sm flex items-center justify-center gap-2 transition shrink-0 cursor-pointer self-start sm:self-auto"
                            >
                                <Plus size={16} />
                                <span>Tambah Kategori</span>
                            </button>
                        </div>

                        {/* 4 Category Cards Grid (4 columns on desktop) */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                            {categories.map((cat) => (
                                <div 
                                    key={cat.id}
                                    className="bg-white rounded-3xl p-4 border border-pink-100/70 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col group"
                                >
                                    {/* Category Image */}
                                    <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-pink-50/50 mb-3.5 border border-pink-50">
                                        <img 
                                            src={cat.image_url} 
                                            alt={cat.name}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = '/images/custom/kombinasi.jpg';
                                            }}
                                        />
                                        <div className="absolute top-2.5 right-2.5">
                                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold shadow-2xs ${
                                                cat.is_active 
                                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/90' 
                                                    : 'bg-slate-100 text-slate-500 border border-slate-200'
                                            }`}>
                                                {cat.is_active ? 'Aktif' : 'Nonaktif'}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Category Content */}
                                    <div className="flex-1 flex flex-col">
                                        <h4 className="font-bold text-slate-800 text-base group-hover:text-pink-600 transition-colors">
                                            {cat.name}
                                        </h4>
                                        <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                                            {cat.description || 'Pilihan buket kustom spesial dengan bahan berkualitas.'}
                                        </p>

                                        {/* Base Price */}
                                        <div className="mt-3 pt-2.5 border-t border-slate-50 flex items-center justify-between text-xs">
                                            <span className="text-slate-400">Harga dasar:</span>
                                            <span className="font-extrabold text-slate-900">
                                                {cat.base_price_formatted}
                                            </span>
                                        </div>

                                        {/* Action Buttons: Atur Opsi (solid pink), Edit (outline), Delete (outline) */}
                                        <div className="grid grid-cols-6 gap-1.5 mt-3 pt-2">
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setActiveCategoryId(cat.id);
                                                    setActiveTab('wrapping');
                                                }}
                                                className="col-span-3 py-2 px-3 rounded-xl bg-pink-500 hover:bg-pink-600 text-white font-bold text-xs shadow-xs transition text-center flex items-center justify-center gap-1 cursor-pointer"
                                            >
                                                <span>Atur Opsi</span>
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => openEditCategoryModal(cat)}
                                                className="col-span-2 py-2 px-2.5 rounded-xl bg-pink-50/60 hover:bg-pink-100/80 text-pink-600 font-bold text-xs border border-pink-200/60 transition shadow-2xs text-center cursor-pointer"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => openDeleteModal('category', cat)}
                                                className="col-span-1 py-2 rounded-xl bg-pink-50/60 hover:bg-rose-50 text-pink-600 hover:text-rose-600 font-bold text-xs border border-pink-200/60 hover:border-rose-200 transition shadow-2xs flex items-center justify-center cursor-pointer"
                                                title="Hapus Kategori"
                                            >
                                                <Trash2 size={13} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    /* ======================================================== */
                    /* VIEW 2: Pengaturan Opsi – [Kategori] (Matching bottom-mid) */
                    /* ======================================================== */
                    <div className="space-y-6 animate-in fade-in-50 duration-200">
                        {/* Top Back Navigation Bar */}
                        <div className="bg-white rounded-3xl p-5 border border-pink-100/60 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <button
                                    type="button"
                                    onClick={() => setActiveCategoryId(null)}
                                    className="w-10 h-10 rounded-2xl bg-pink-50 hover:bg-pink-100 text-pink-600 flex items-center justify-center transition border border-pink-100 cursor-pointer shadow-2xs"
                                    title="Kembali ke Daftar Kategori"
                                >
                                    <ArrowLeft size={18} />
                                </button>
                                <div>
                                    <h3 className="text-base font-bold text-slate-800">
                                        Pengaturan Opsi – {activeCategory.name}
                                    </h3>
                                    <p className="text-xs text-slate-400">
                                        Kelola pilihan dan detail untuk kategori {activeCategory.name}.
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 self-start sm:self-auto">
                                <span className="px-3 py-1.5 rounded-xl bg-pink-50 text-pink-600 border border-pink-200/60 text-xs font-bold">
                                    Harga Dasar: {activeCategory.base_price_formatted}
                                </span>
                            </div>
                        </div>

                        {/* Tab Switcher (Wrapping, Pita, Dekorasi Tambahan, Info Khusus) */}
                        <div className="flex flex-wrap items-center gap-2 border-b border-pink-100 pb-1">
                            {tabsList.map((tab) => (
                                <button
                                    key={tab.id}
                                    type="button"
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`px-4.5 py-2.5 rounded-2xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                                        activeTab === tab.id
                                            ? 'bg-pink-500 text-white shadow-xs'
                                            : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200/80 hover:bg-pink-50/50'
                                    }`}
                                >
                                    {tab.icon}
                                    <span>{tab.label}</span>
                                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                        activeTab === tab.id ? 'bg-pink-400 text-white' : 'bg-slate-100 text-slate-600'
                                    }`}>
                                        {categoryOptions.filter(o => o.tab_type === tab.id).length}
                                    </span>
                                </button>
                            ))}
                        </div>

                        {/* Active Tab Table Content */}
                        <div className="bg-white rounded-3xl border border-pink-100/60 shadow-xs overflow-hidden">
                            {/* Tab Header with Add Button */}
                            <div className="p-5 border-b border-pink-50 flex items-center justify-between">
                                <div>
                                    <h4 className="text-sm font-bold text-slate-800">
                                        {tabsList.find(t => t.id === activeTab)?.label}
                                    </h4>
                                    <p className="text-xs text-slate-400 mt-0.5">
                                        Daftar pilihan {tabsList.find(t => t.id === activeTab)?.label.toLowerCase()} yang aktif dan tersedia untuk pelanggan.
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={openAddOptionModal}
                                    className="px-4 py-2 rounded-2xl bg-pink-500 hover:bg-pink-600 text-white font-bold text-xs shadow-xs flex items-center gap-1.5 transition cursor-pointer"
                                >
                                    <Plus size={14} />
                                    <span>Tambah Opsi</span>
                                </button>
                            </div>

                            {/* Options Table matching screenshot */}
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse text-xs">
                                    <thead>
                                        <tr className="bg-pink-50/30 text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                                            <th className="px-6 py-3.5 border-b border-pink-50">Nama Opsi</th>
                                            <th className="px-6 py-3.5 border-b border-pink-50">Harga Tambahan</th>
                                            <th className="px-6 py-3.5 border-b border-pink-50">Status</th>
                                            <th className="px-6 py-3.5 border-b border-pink-50 text-right">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-pink-50/60">
                                        {tabOptions.length > 0 ? (
                                            tabOptions.map((opt) => (
                                                <tr key={opt.id} className="hover:bg-pink-50/20 transition-colors">
                                                    {/* Nama Opsi & Image Thumbnail */}
                                                    <td className="px-6 py-3.5">
                                                        <div className="flex items-center gap-3">
                                                            {opt.image_url ? (
                                                                <div className="w-10 h-10 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                                                                    <img 
                                                                        src={opt.image_url} 
                                                                        alt={opt.name} 
                                                                        className="w-full h-full object-cover"
                                                                    />
                                                                </div>
                                                            ) : opt.color_hex ? (
                                                                <div 
                                                                    className="w-10 h-10 rounded-xl border border-slate-200 shrink-0 shadow-2xs"
                                                                    style={{ backgroundColor: opt.color_hex }}
                                                                />
                                                            ) : (
                                                                <div className="w-10 h-10 rounded-xl bg-pink-50 text-pink-500 flex items-center justify-center shrink-0 border border-pink-100">
                                                                    <Palette size={16} />
                                                                </div>
                                                            )}
                                                            <div>
                                                                <span className="font-bold text-slate-800 block text-xs">
                                                                    {opt.name}
                                                                </span>
                                                                {opt.description && (
                                                                    <span className="text-[11px] text-slate-400 block mt-0.5">
                                                                        {opt.description}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </td>

                                                    {/* Harga Tambahan */}
                                                    <td className="px-6 py-3.5 font-bold text-slate-700">
                                                        {opt.price_adjustment > 0 ? opt.price_formatted : 'Rp 0'}
                                                    </td>

                                                    {/* Status Badge */}
                                                    <td className="px-6 py-3.5">
                                                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                                                            opt.is_active 
                                                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                                                                : 'bg-slate-100 text-slate-500 border border-slate-200'
                                                        }`}>
                                                            {opt.is_active ? 'Aktif' : 'Nonaktif'}
                                                        </span>
                                                    </td>

                                                    {/* Actions */}
                                                    <td className="px-6 py-3.5 text-right">
                                                        <div className="flex items-center justify-end gap-1.5">
                                                            <button
                                                                type="button"
                                                                onClick={() => openEditOptionModal(opt)}
                                                                className="px-2.5 py-1.5 rounded-xl bg-pink-50 text-pink-600 hover:bg-pink-100 font-bold text-xs transition border border-pink-200/50 cursor-pointer"
                                                            >
                                                                Edit
                                                            </button>
                                                            <button
                                                                type="button"
                                                                onClick={() => openDeleteModal('option', opt)}
                                                                className="p-1.5 rounded-xl bg-pink-50 text-pink-600 hover:bg-rose-50 hover:text-rose-600 font-bold transition border border-pink-200/50 hover:border-rose-200 cursor-pointer"
                                                                title="Hapus Opsi"
                                                            >
                                                                <Trash2 size={13} />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="4" className="px-6 py-12 text-center text-slate-400">
                                                    <p className="text-xs">Belum ada opsi yang ditambahkan untuk tab ini.</p>
                                                    <button
                                                        type="button"
                                                        onClick={openAddOptionModal}
                                                        className="mt-2 text-xs font-bold text-pink-600 hover:underline cursor-pointer"
                                                    >
                                                        + Tambah Opsi Sekarang
                                                    </button>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* ======================================================== */}
            {/* MODAL 1: Tambah / Edit Kategori Custom */}
            {/* ======================================================== */}
            {isCategoryModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div 
                        className="absolute inset-0 bg-slate-900/50 backdrop-blur-xs"
                        onClick={closeModals}
                    />

                    <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden border border-pink-100 animate-in zoom-in-95 duration-150">
                        {/* Header */}
                        <div className="px-6 py-4.5 border-b border-pink-50 flex items-center justify-between bg-pink-50/30">
                            <div>
                                <h3 className="text-base font-bold text-slate-800">
                                    {editingCategory ? 'Edit Kategori Custom' : 'Tambah Kategori Custom'}
                                </h3>
                                <p className="text-xs text-slate-400">
                                    Tentukan jenis buket yang dapat dipesan custom oleh pelanggan
                                </p>
                            </div>
                            <button 
                                onClick={closeModals}
                                className="w-8 h-8 rounded-full bg-white text-slate-400 hover:text-slate-600 flex items-center justify-center shadow-xs border border-slate-100 cursor-pointer"
                            >
                                <X size={16} />
                            </button>
                        </div>

                        {/* Body */}
                        <form onSubmit={handleCategorySubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">
                                    Nama Kategori *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={catData.name}
                                    onChange={(e) => setCatData('name', e.target.value)}
                                    placeholder="Contoh: Bucket Snack"
                                    className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs focus:ring-2 focus:ring-pink-400 focus:outline-hidden"
                                />
                                {catErrors.name && <p className="text-[11px] text-rose-500 mt-1">{catErrors.name}</p>}
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">
                                    Deskripsi Singkat *
                                </label>
                                <textarea
                                    required
                                    rows="2"
                                    value={catData.description}
                                    onChange={(e) => setCatData('description', e.target.value)}
                                    placeholder="Deskripsi singkat kategori buket..."
                                    className="w-full px-3.5 py-2 rounded-2xl bg-slate-50 border border-slate-200 text-xs focus:ring-2 focus:ring-pink-400 focus:outline-hidden resize-none"
                                />
                                {catErrors.description && <p className="text-[11px] text-rose-500 mt-1">{catErrors.description}</p>}
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1">
                                        Harga Dasar (Rp) *
                                    </label>
                                    <input
                                        type="number"
                                        required
                                        min="0"
                                        value={catData.base_price}
                                        onChange={(e) => setCatData('base_price', e.target.value)}
                                        placeholder="120000"
                                        className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs focus:ring-2 focus:ring-pink-400 focus:outline-hidden"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1">
                                        Status
                                    </label>
                                    <div className="flex items-center gap-3 pt-2">
                                        <label className="flex items-center gap-1.5 text-xs text-slate-700 cursor-pointer">
                                            <input 
                                                type="radio" 
                                                name="cat_status"
                                                checked={catData.is_active === true}
                                                onChange={() => setCatData('is_active', true)}
                                                className="text-pink-500"
                                            />
                                            <span>Aktif</span>
                                        </label>
                                        <label className="flex items-center gap-1.5 text-xs text-slate-700 cursor-pointer">
                                            <input 
                                                type="radio" 
                                                name="cat_status"
                                                checked={catData.is_active === false}
                                                onChange={() => setCatData('is_active', false)}
                                                className="text-pink-500"
                                            />
                                            <span>Nonaktif</span>
                                        </label>
                                    </div>
                                </div>
                            </div>

                            {/* Foto Kategori */}
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">
                                    Foto Kategori
                                </label>
                                <input 
                                    type="file" 
                                    ref={categoryFileRef}
                                    accept="image/*"
                                    onChange={(e) => {
                                        const f = e.target.files[0];
                                        if (f) {
                                            setCatData('image', f);
                                            setCategoryPreviewImage(URL.createObjectURL(f));
                                        }
                                    }}
                                    className="hidden"
                                />
                                <div 
                                    onClick={() => categoryFileRef.current?.click()}
                                    className="border-2 border-dashed border-slate-200 hover:border-pink-300 rounded-2xl p-3 text-center cursor-pointer bg-slate-50/50 flex items-center justify-center gap-3"
                                >
                                    {categoryPreviewImage ? (
                                        <div className="flex items-center gap-3 w-full">
                                            <img src={categoryPreviewImage} alt="Preview" className="w-12 h-12 rounded-xl object-cover" />
                                            <span className="text-xs text-pink-600 font-bold">Ganti foto kategori</span>
                                        </div>
                                    ) : (
                                        <span className="text-xs text-slate-500 font-medium">Klik untuk upload foto kategori (JPG, PNG)</span>
                                    )}
                                </div>
                            </div>

                            {/* Buttons */}
                            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
                                <button
                                    type="button"
                                    onClick={closeModals}
                                    className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={savingCategory}
                                    className="px-5 py-2 rounded-xl bg-pink-500 hover:bg-pink-600 text-white font-bold text-xs shadow-xs transition disabled:opacity-50 cursor-pointer"
                                >
                                    {savingCategory ? 'Menyimpan...' : 'Simpan'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ======================================================== */}
            {/* MODAL 2: Tambah / Edit Opsi (Matching bottom-right mockup) */}
            {/* ======================================================== */}
            {isOptionModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div 
                        className="absolute inset-0 bg-slate-900/50 backdrop-blur-xs"
                        onClick={closeModals}
                    />

                    <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden border border-pink-100 animate-in zoom-in-95 duration-150">
                        {/* Header */}
                        <div className="px-6 py-4.5 border-b border-pink-50 flex items-center justify-between bg-pink-50/30">
                            <div>
                                <h3 className="text-base font-bold text-slate-800">
                                    {editingOption ? 'Edit Opsi' : `Tambah Opsi ${tabsList.find(t => t.id === activeTab)?.label}`}
                                </h3>
                                <p className="text-xs text-slate-400">
                                    Kategori: {activeCategory?.name}
                                </p>
                            </div>
                            <button 
                                onClick={closeModals}
                                className="w-8 h-8 rounded-full bg-white text-slate-400 hover:text-slate-600 flex items-center justify-center shadow-xs border border-slate-100 cursor-pointer"
                            >
                                <X size={16} />
                            </button>
                        </div>

                        {/* Body */}
                        <form onSubmit={handleOptionSubmit} className="p-6 space-y-4">
                            {/* Nama Opsi */}
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">
                                    Nama Opsi *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={optData.name}
                                    onChange={(e) => setOptData('name', e.target.value)}
                                    placeholder="Contoh: Kertas Kraft Premium"
                                    className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs focus:ring-2 focus:ring-pink-400 focus:outline-hidden"
                                />
                                {optErrors.name && <p className="text-[11px] text-rose-500 mt-1">{optErrors.name}</p>}
                            </div>

                            {/* Harga Tambahan */}
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">
                                    Harga Tambahan
                                </label>
                                <div className="relative">
                                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                                        Rp
                                    </span>
                                    <input
                                        type="number"
                                        min="0"
                                        value={optData.price_adjustment}
                                        onChange={(e) => setOptData('price_adjustment', e.target.value)}
                                        placeholder="Masukkan harga tambahan (0 jika gratis)"
                                        className="w-full pl-10 pr-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs focus:ring-2 focus:ring-pink-400 focus:outline-hidden"
                                    />
                                </div>
                                {optErrors.price_adjustment && <p className="text-[11px] text-rose-500 mt-1">{optErrors.price_adjustment}</p>}
                            </div>

                            {/* Status */}
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-2">
                                    Status
                                </label>
                                <div className="flex items-center gap-5">
                                    <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                                        <input 
                                            type="radio" 
                                            name="opt_status"
                                            checked={optData.is_active === true}
                                            onChange={() => setOptData('is_active', true)}
                                            className="text-pink-500"
                                        />
                                        <span className="font-medium">Aktif</span>
                                    </label>
                                    <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                                        <input 
                                            type="radio" 
                                            name="opt_status"
                                            checked={optData.is_active === false}
                                            onChange={() => setOptData('is_active', false)}
                                            className="text-pink-500"
                                        />
                                        <span className="font-medium">Nonaktif</span>
                                    </label>
                                </div>
                            </div>

                            {/* Foto Opsi (dropzone matching mockup) */}
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">
                                    Foto Opsi
                                </label>
                                <input 
                                    type="file" 
                                    ref={optionFileRef}
                                    accept="image/*"
                                    onChange={(e) => {
                                        const f = e.target.files[0];
                                        if (f) {
                                            setOptData('image', f);
                                            setOptionPreviewImage(URL.createObjectURL(f));
                                        }
                                    }}
                                    className="hidden"
                                />
                                <div 
                                    onClick={() => optionFileRef.current?.click()}
                                    className="border-2 border-dashed border-slate-200 hover:border-pink-300 rounded-2xl p-4 text-center cursor-pointer bg-slate-50/60 transition-colors flex flex-col items-center justify-center min-h-[120px]"
                                >
                                    {optionPreviewImage ? (
                                        <div className="relative group w-20 h-20 rounded-xl overflow-hidden border border-slate-200">
                                            <img src={optionPreviewImage} alt="Preview" className="w-full h-full object-cover" />
                                            <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-[10px] font-bold">
                                                Ganti
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="space-y-1">
                                            <div className="w-8 h-8 rounded-xl bg-pink-100 text-pink-500 flex items-center justify-center mx-auto mb-1">
                                                <Upload size={16} />
                                            </div>
                                            <p className="text-xs font-bold text-slate-700">
                                                Klik untuk mengunggah foto
                                            </p>
                                            <p className="text-[10px] text-slate-400">
                                                Format: JPG, PNG (maks. 2MB)
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Buttons matching mockup */}
                            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
                                <button
                                    type="button"
                                    onClick={closeModals}
                                    className="px-5 py-2.5 rounded-2xl bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={savingOption}
                                    className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-400 hover:from-pink-600 hover:to-rose-500 text-white font-bold text-xs shadow-sm transition disabled:opacity-50 cursor-pointer"
                                >
                                    {savingOption ? 'Menyimpan...' : 'Simpan'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ======================================================== */}
            {/* MODAL 3: Konfirmasi Hapus Kategori / Opsi */}
            {/* ======================================================== */}
            {isDeleteModalOpen && deletingItem && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div 
                        className="absolute inset-0 bg-slate-900/50 backdrop-blur-xs"
                        onClick={closeModals}
                    />

                    <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-sm p-6 text-center border border-pink-100 animate-in zoom-in-95 duration-150 space-y-4">
                        <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center mx-auto shadow-inner">
                            <Trash2 size={26} />
                        </div>

                        <div>
                            <h3 className="text-base font-bold text-slate-800">
                                {deletingItem.type === 'category' ? 'Hapus Kategori Custom?' : 'Hapus Opsi Custom?'}
                            </h3>
                            <p className="text-xs text-slate-500 mt-1">
                                Yakin ingin menghapus <span className="font-bold text-slate-700">"{deletingItem.data.name}"</span>?
                                {deletingItem.type === 'category' && ' Seluruh opsi di dalam kategori ini juga akan ikut terhapus.'}
                            </p>
                        </div>

                        <div className="flex items-center justify-center gap-2 pt-2">
                            <button
                                type="button"
                                onClick={closeModals}
                                className="flex-1 py-2.5 rounded-2xl bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
                            >
                                Batal
                            </button>
                            <button
                                type="button"
                                onClick={handleDelete}
                                className="flex-1 py-2.5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs transition cursor-pointer"
                            >
                                Ya, Hapus
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
