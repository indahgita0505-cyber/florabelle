import { Head, Link, router, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { useState, useEffect, useRef } from 'react';
import { 
    Search, 
    Plus, 
    RotateCcw, 
    X, 
    Package, 
    Upload, 
    Image as ImageIcon, 
    Trash2, 
    Edit3, 
    Eye, 
    CheckCircle2, 
    AlertCircle, 
    Sparkles,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';

export default function ProductIndex({ products, categories = [], filters = {} }) {
    // Search & Filter State
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [categoryFilter, setCategoryFilter] = useState(filters.category || 'all');
    const [statusFilter, setStatusFilter] = useState(filters.status || 'all');

    // Modals
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const [selectedProduct, setSelectedProduct] = useState(null);
    const [editingProduct, setEditingProduct] = useState(null);
    const [deletingProduct, setDeletingProduct] = useState(null);

    const [previewImage, setPreviewImage] = useState(null);
    const fileInputRef = useRef(null);

    // Form handling
    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        name: '',
        category_id: '',
        price: '',
        stock: '',
        is_available: true,
        description: '',
        image: null,
    });

    // Debounced search
    const applyFilters = (newOverrides = {}) => {
        const queryParams = {
            search: searchTerm,
            category: categoryFilter,
            status: statusFilter,
            ...newOverrides,
        };

        const cleanParams = {};
        Object.keys(queryParams).forEach((k) => {
            if (queryParams[k] && queryParams[k] !== 'all' && queryParams[k] !== 'Semua Kategori' && queryParams[k] !== 'Semua Status') {
                cleanParams[k] = queryParams[k];
            }
        });

        router.get(route('admin.products.index'), cleanParams, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

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
        setCategoryFilter('all');
        setStatusFilter('all');
        router.get(route('admin.products.index'), {}, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    const hasActiveFilters = Boolean(
        searchTerm || 
        (categoryFilter && categoryFilter !== 'all') || 
        (statusFilter && statusFilter !== 'all')
    );

    // Open Add Modal
    const openAddModal = () => {
        clearErrors();
        reset();
        setData({
            name: '',
            category_id: categories.length > 0 ? categories[0].id : '',
            price: '',
            stock: '10',
            is_available: true,
            description: '',
            image: null,
        });
        setEditingProduct(null);
        setPreviewImage(null);
        setIsFormModalOpen(true);
    };

    // Open Edit Modal
    const openEditModal = (prod) => {
        clearErrors();
        setData({
            name: prod.name,
            category_id: prod.category_id || (categories.length > 0 ? categories[0].id : ''),
            price: prod.price,
            stock: prod.stock,
            is_available: prod.is_available,
            description: prod.description || '',
            image: null,
        });
        setEditingProduct(prod);
        setPreviewImage(prod.image_url);
        setIsFormModalOpen(true);
    };

    // Open Detail Modal
    const openDetailModal = (prod) => {
        setSelectedProduct(prod);
        setIsDetailModalOpen(true);
    };

    // Open Delete Modal
    const openDeleteModal = (prod) => {
        setDeletingProduct(prod);
        setIsDeleteModalOpen(true);
    };

    const closeModals = () => {
        setIsFormModalOpen(false);
        setIsDetailModalOpen(false);
        setIsDeleteModalOpen(false);
        setEditingProduct(null);
        setSelectedProduct(null);
        setDeletingProduct(null);
        setPreviewImage(null);
        reset();
        clearErrors();
    };

    // Image Upload Change
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('image', file);
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    // Submit Add/Edit
    const handleSubmit = (e) => {
        e.preventDefault();

        if (editingProduct) {
            post(route('admin.products.update', editingProduct.id), {
                preserveScroll: true,
                onSuccess: () => closeModals(),
            });
        } else {
            post(route('admin.products.store'), {
                preserveScroll: true,
                onSuccess: () => closeModals(),
            });
        }
    };

    // Submit Delete
    const handleDelete = () => {
        if (!deletingProduct) return;
        router.delete(route('admin.products.destroy', deletingProduct.id), {
            preserveScroll: true,
            onSuccess: () => closeModals(),
        });
    };

    const productList = products.data || [];

    return (
        <AdminLayout
            title="Produk Etalase"
            subtitle="Kelola katalog buket yang tersedia di Florabelle.id."
            quote="Buket Spesial Untuk Momen Spesial 💕"
        >
            <Head title="Produk Etalase - Florabelle.id" />

            <div className="space-y-6 max-w-7xl mx-auto">
                {/* Search, Filter, and Action Bar */}
                <div className="bg-white rounded-3xl p-5 border border-pink-100/60 shadow-xs">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        <div className="flex flex-wrap items-center gap-3 flex-1">
                            {/* Search Box */}
                            <div className="relative flex-1 min-w-[240px]">
                                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="Cari nama produk..."
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

                            {/* Category Filter */}
                            <select
                                value={categoryFilter}
                                onChange={(e) => {
                                    setCategoryFilter(e.target.value);
                                    applyFilters({ category: e.target.value });
                                }}
                                className="px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-pink-400/30 focus:border-pink-400 font-medium max-w-[190px]"
                            >
                                <option value="all">Semua Kategori</option>
                                {categories.map((c) => (
                                    <option key={c.id} value={c.id}>{c.name}</option>
                                ))}
                            </select>

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
                                <option value="available">Tersedia</option>
                                <option value="unavailable">Tidak Tersedia</option>
                            </select>

                            {/* Reset Button */}
                            {hasActiveFilters && (
                                <button
                                    onClick={handleResetFilters}
                                    className="p-2.5 rounded-2xl text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition border border-slate-200 cursor-pointer"
                                    title="Reset Semua Filter"
                                >
                                    <RotateCcw size={15} />
                                </button>
                            )}
                        </div>

                        {/* + Tambah Produk Button */}
                        <button
                            type="button"
                            onClick={openAddModal}
                            className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-400 hover:from-pink-600 hover:to-rose-500 text-white font-bold text-xs shadow-sm flex items-center justify-center gap-2 transition shrink-0 cursor-pointer self-start lg:self-auto"
                        >
                            <Plus size={16} />
                            <span>Tambah Produk</span>
                        </button>
                    </div>
                </div>

                {/* Product Grid (4 columns on desktop) */}
                {productList.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                        {productList.map((prod) => (
                            <div 
                                key={prod.id}
                                className="bg-white rounded-3xl p-4 border border-pink-100/70 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col group"
                            >
                                {/* Product Image Container */}
                                <div className="relative aspect-square rounded-2xl overflow-hidden bg-pink-50/50 mb-3.5 border border-pink-50">
                                    <img 
                                        src={prod.image_url} 
                                        alt={prod.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = '/images/hero_bouquet.jpg';
                                        }}
                                    />
                                    {/* Availability Tag overlay */}
                                    <div className="absolute top-2.5 right-2.5">
                                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold shadow-2xs ${
                                            prod.is_available 
                                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/90' 
                                                : 'bg-rose-50 text-rose-700 border border-rose-200/90'
                                        }`}>
                                            {prod.status_label}
                                        </span>
                                    </div>
                                </div>

                                {/* Product Info */}
                                <div className="flex-1 flex flex-col">
                                    <h4 className="font-bold text-slate-800 text-sm line-clamp-1 group-hover:text-pink-600 transition-colors">
                                        {prod.name}
                                    </h4>

                                    {/* Category Pill */}
                                    <div className="mt-1 mb-2">
                                        <span className="inline-block px-2 py-0.5 rounded-lg text-[10px] font-bold bg-[#fde2e8] text-pink-600 border border-pink-200/40">
                                            {prod.category_name}
                                        </span>
                                    </div>

                                    {/* Price and Stock */}
                                    <div className="mt-auto pt-2 border-t border-slate-50 flex items-baseline justify-between">
                                        <span className="font-extrabold text-pink-600 text-sm sm:text-base">
                                            {prod.price_formatted}
                                        </span>
                                        <span className="text-[11px] text-slate-400 font-medium">
                                            Stok: {prod.stock}
                                        </span>
                                    </div>

                                    {/* Action Buttons (Detail, Edit, Delete) matching screenshot */}
                                    <div className="grid grid-cols-5 gap-1.5 mt-3 pt-2">
                                        <button
                                            type="button"
                                            onClick={() => openDetailModal(prod)}
                                            className="col-span-2 py-1.5 px-2 rounded-xl bg-pink-50/60 hover:bg-pink-100/80 text-pink-600 font-bold text-xs border border-pink-200/60 transition shadow-2xs text-center cursor-pointer"
                                        >
                                            Detail
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => openEditModal(prod)}
                                            className="col-span-2 py-1.5 px-2 rounded-xl bg-pink-50/60 hover:bg-pink-100/80 text-pink-600 font-bold text-xs border border-pink-200/60 transition shadow-2xs text-center cursor-pointer"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => openDeleteModal(prod)}
                                            className="col-span-1 py-1.5 rounded-xl bg-pink-50/60 hover:bg-rose-50 text-pink-600 hover:text-rose-600 font-bold text-xs border border-pink-200/60 hover:border-rose-200 transition shadow-2xs flex items-center justify-center cursor-pointer"
                                            title="Hapus Produk"
                                        >
                                            <Trash2 size={13} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    /* Empty State */
                    <div className="bg-white rounded-3xl p-12 text-center border border-pink-100/60 shadow-xs">
                        <div className="w-16 h-16 rounded-3xl bg-pink-50 text-pink-500 flex items-center justify-center mx-auto text-2xl shadow-inner mb-3">
                            <Package size={30} />
                        </div>
                        <h4 className="text-base font-bold text-slate-800">
                            Tidak Ada Produk Ditemukan
                        </h4>
                        <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1 mb-5">
                            {hasActiveFilters 
                                ? 'Tidak ada produk yang cocok dengan pencarian dan filter Anda. Silakan reset filter.' 
                                : 'Belum ada produk etalase yang ditambahkan ke katalog toko.'}
                        </p>
                        {hasActiveFilters ? (
                            <button
                                onClick={handleResetFilters}
                                className="px-5 py-2.5 rounded-2xl bg-pink-50 text-pink-600 font-bold text-xs border border-pink-200 transition cursor-pointer"
                            >
                                Reset Filter
                            </button>
                        ) : (
                            <button
                                onClick={openAddModal}
                                className="px-5 py-2.5 rounded-2xl bg-pink-500 hover:bg-pink-600 text-white font-bold text-xs shadow-xs transition cursor-pointer"
                            >
                                + Tambah Produk Pertama
                            </button>
                        )}
                    </div>
                )}

                {/* Pagination */}
                {products.links && products.links.length > 3 && (
                    <div className="bg-white rounded-3xl p-4 border border-pink-100/60 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
                        <div>
                            Menampilkan <span className="font-bold text-slate-700">{products.from || 0}</span> - <span className="font-bold text-slate-700">{products.to || 0}</span> dari <span className="font-bold text-slate-700">{products.total || 0}</span> produk
                        </div>

                        <div className="flex items-center gap-1.5">
                            {products.links.map((link, i) => {
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
                    </div>
                )}
            </div>

            {/* Modal Tambah / Edit Produk (matching top-right mockup) */}
            {isFormModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div 
                        className="absolute inset-0 bg-slate-900/50 backdrop-blur-xs"
                        onClick={closeModals}
                    />

                    <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[92vh] flex flex-col overflow-hidden border border-pink-100 animate-in zoom-in-95 duration-150">
                        {/* Header */}
                        <div className="px-6 py-4.5 border-b border-pink-50 flex items-center justify-between bg-pink-50/30 shrink-0">
                            <div className="flex items-center gap-2.5">
                                <span className="text-xl">🌸</span>
                                <div>
                                    <h3 className="text-base font-bold text-slate-800">
                                        {editingProduct ? 'Edit Produk' : 'Tambah Produk'}
                                    </h3>
                                    <p className="text-xs text-slate-400">
                                        {editingProduct ? 'Perbarui informasi dan katalog buket' : 'Masukkan rincian katalog buket baru'}
                                    </p>
                                </div>
                            </div>
                            <button 
                                type="button"
                                onClick={closeModals}
                                className="w-8 h-8 rounded-full bg-white text-slate-400 hover:text-slate-600 flex items-center justify-center shadow-xs border border-slate-100 cursor-pointer"
                            >
                                <X size={16} />
                            </button>
                        </div>

                        {/* Form Body */}
                        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                {/* Left Column: Info Fields */}
                                <div className="space-y-4">
                                    {/* Nama Produk */}
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1">
                                            Nama Produk *
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            placeholder="Masukkan nama produk"
                                            className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs focus:ring-2 focus:ring-pink-400 focus:outline-hidden"
                                        />
                                        {errors.name && <p className="text-[11px] text-rose-500 mt-1">{errors.name}</p>}
                                    </div>

                                    {/* Kategori */}
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1">
                                            Kategori *
                                        </label>
                                        <select
                                            required
                                            value={data.category_id}
                                            onChange={(e) => setData('category_id', e.target.value)}
                                            className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs focus:ring-2 focus:ring-pink-400 focus:outline-hidden font-medium text-slate-700"
                                        >
                                            <option value="">Pilih kategori</option>
                                            {categories.map((c) => (
                                                <option key={c.id} value={c.id}>{c.name}</option>
                                            ))}
                                        </select>
                                        {errors.category_id && <p className="text-[11px] text-rose-500 mt-1">{errors.category_id}</p>}
                                    </div>

                                    {/* Harga */}
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1">
                                            Harga *
                                        </label>
                                        <div className="relative">
                                            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                                                Rp
                                            </span>
                                            <input
                                                type="number"
                                                required
                                                min="0"
                                                value={data.price}
                                                onChange={(e) => setData('price', e.target.value)}
                                                placeholder="Masukkan harga"
                                                className="w-full pl-10 pr-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs focus:ring-2 focus:ring-pink-400 focus:outline-hidden"
                                            />
                                        </div>
                                        {errors.price && <p className="text-[11px] text-rose-500 mt-1">{errors.price}</p>}
                                    </div>

                                    {/* Stok */}
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1">
                                            Stok
                                        </label>
                                        <input
                                            type="number"
                                            min="0"
                                            value={data.stock}
                                            onChange={(e) => setData('stock', e.target.value)}
                                            placeholder="Masukkan stok (opsional)"
                                            className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs focus:ring-2 focus:ring-pink-400 focus:outline-hidden"
                                        />
                                        {errors.stock && <p className="text-[11px] text-rose-500 mt-1">{errors.stock}</p>}
                                    </div>

                                    {/* Status Ketersediaan */}
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-2">
                                            Status Ketersediaan
                                        </label>
                                        <div className="flex items-center gap-5">
                                            <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-700">
                                                <input 
                                                    type="radio" 
                                                    name="is_available" 
                                                    checked={data.is_available === true}
                                                    onChange={() => setData('is_available', true)}
                                                    className="text-pink-500 focus:ring-pink-400"
                                                />
                                                <span className="font-medium">Tersedia</span>
                                            </label>
                                            <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-700">
                                                <input 
                                                    type="radio" 
                                                    name="is_available" 
                                                    checked={data.is_available === false}
                                                    onChange={() => setData('is_available', false)}
                                                    className="text-pink-500 focus:ring-pink-400"
                                                />
                                                <span className="font-medium">Tidak Tersedia</span>
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Column: Image Dropzone & Deskripsi */}
                                <div className="space-y-4">
                                    {/* Foto Produk */}
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1">
                                            Foto Produk *
                                        </label>
                                        <input 
                                            type="file" 
                                            ref={fileInputRef}
                                            accept="image/png, image/jpeg, image/jpg, image/webp"
                                            onChange={handleImageChange}
                                            className="hidden"
                                        />
                                        <div 
                                            onClick={() => fileInputRef.current?.click()}
                                            className={`border-2 border-dashed rounded-2xl p-4 text-center cursor-pointer transition-all flex flex-col items-center justify-center min-h-[170px] ${
                                                previewImage ? 'border-pink-300 bg-pink-50/20' : 'border-slate-200 hover:border-pink-300 bg-slate-50/60'
                                            }`}
                                        >
                                            {previewImage ? (
                                                <div className="relative group w-full h-36 rounded-xl overflow-hidden">
                                                    <img 
                                                        src={previewImage} 
                                                        alt="Preview" 
                                                        className="w-full h-full object-cover"
                                                    />
                                                    <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs font-bold transition">
                                                        Klik untuk mengganti foto
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="space-y-2 py-3">
                                                    <div className="w-10 h-10 rounded-2xl bg-pink-100 text-pink-600 flex items-center justify-center mx-auto">
                                                        <Upload size={20} />
                                                    </div>
                                                    <div>
                                                        <p className="text-xs font-bold text-slate-700">
                                                            Klik untuk mengunggah foto
                                                        </p>
                                                        <p className="text-[11px] text-slate-400">
                                                            atau tarik dan lepas
                                                        </p>
                                                    </div>
                                                    <p className="text-[10px] text-slate-400">
                                                        Format: JPG, PNG (maks. 2MB)
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                        {errors.image && <p className="text-[11px] text-rose-500 mt-1">{errors.image}</p>}
                                    </div>

                                    {/* Deskripsi */}
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1">
                                            Deskripsi *
                                        </label>
                                        <textarea
                                            required
                                            rows="4"
                                            value={data.description}
                                            onChange={(e) => setData('description', e.target.value)}
                                            placeholder="Masukkan deskripsi produk..."
                                            className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs focus:ring-2 focus:ring-pink-400 focus:outline-hidden resize-none"
                                        />
                                        {errors.description && <p className="text-[11px] text-rose-500 mt-1">{errors.description}</p>}
                                    </div>
                                </div>
                            </div>

                            {/* Modal Action Buttons */}
                            <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={closeModals}
                                    className="px-5 py-2.5 rounded-2xl bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-400 hover:from-pink-600 hover:to-rose-500 text-white font-bold text-xs shadow-sm transition disabled:opacity-50 cursor-pointer"
                                >
                                    {processing ? 'Menyimpan...' : 'Simpan'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal Detail Produk */}
            {isDetailModalOpen && selectedProduct && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div 
                        className="absolute inset-0 bg-slate-900/50 backdrop-blur-xs"
                        onClick={closeModals}
                    />

                    <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden border border-pink-100 animate-in zoom-in-95 duration-150">
                        <div className="relative h-64 bg-slate-100 overflow-hidden">
                            <img 
                                src={selectedProduct.image_url} 
                                alt={selectedProduct.name}
                                className="w-full h-full object-cover"
                            />
                            <button 
                                onClick={closeModals}
                                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/80 backdrop-blur-xs text-slate-600 hover:text-slate-900 flex items-center justify-center shadow-xs cursor-pointer"
                            >
                                <X size={16} />
                            </button>
                            <div className="absolute bottom-3 left-4">
                                <span className={`px-3 py-1 rounded-full text-xs font-bold shadow-xs ${
                                    selectedProduct.is_available 
                                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                                        : 'bg-rose-50 text-rose-700 border border-rose-200'
                                }`}>
                                    {selectedProduct.status_label}
                                </span>
                            </div>
                        </div>

                        <div className="p-6 space-y-4">
                            <div>
                                <span className="text-[11px] font-bold text-pink-600 uppercase tracking-wider block mb-1">
                                    {selectedProduct.category_name}
                                </span>
                                <h3 className="text-xl font-extrabold text-slate-800">
                                    {selectedProduct.name}
                                </h3>
                                <p className="text-2xl font-black text-pink-600 mt-1">
                                    {selectedProduct.price_formatted}
                                </p>
                            </div>

                            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between text-xs text-slate-600">
                                <span>Ketersediaan Stok:</span>
                                <span className="font-bold text-slate-800">{selectedProduct.stock} unit</span>
                            </div>

                            <div>
                                <h4 className="text-xs font-bold text-slate-700 mb-1">
                                    Deskripsi Produk:
                                </h4>
                                <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line">
                                    {selectedProduct.description || 'Tidak ada deskripsi rinci untuk produk ini.'}
                                </p>
                            </div>

                            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                                <span className="text-[11px] text-slate-400">
                                    Ditambahkan: {selectedProduct.created_at}
                                </span>
                                <button
                                    onClick={() => {
                                        closeModals();
                                        openEditModal(selectedProduct);
                                    }}
                                    className="px-4 py-2 rounded-xl bg-pink-50 text-pink-600 hover:bg-pink-100 border border-pink-200/60 font-bold text-xs transition cursor-pointer"
                                >
                                    Edit Produk
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Konfirmasi Hapus Produk */}
            {isDeleteModalOpen && deletingProduct && (
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
                                Hapus Produk Ini?
                            </h3>
                            <p className="text-xs text-slate-500 mt-1">
                                Apakah Anda yakin ingin menghapus <span className="font-bold text-slate-700">"{deletingProduct.name}"</span>? Tindakan ini tidak dapat dibatalkan.
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
