import { Head, router, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { useState, useRef } from 'react';

export default function ProductIndex({ products }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [deletingProduct, setDeletingProduct] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);
    const fileInputRef = useRef(null);

    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        name: '',
        category: '',
        price: '',
        stock: '',
        image: null,
    });

    const categories = ['Fresh Flowers', 'Artificial Flowers', 'Bloom Box', 'Money Bouquet', 'Snack Bouquet', 'Lainnya'];

    // Buka modal untuk Tambah Produk
    const openAddModal = () => {
        clearErrors();
        reset();
        setEditingProduct(null);
        setPreviewImage(null);
        setIsModalOpen(true);
    };

    // Buka modal untuk Edit Produk
    const openEditModal = (product) => {
        clearErrors();
        setData({
            name: product.name,
            category: product.category,
            price: product.price,
            stock: product.stock,
            image: null, // Kita kosongkan karena gambar lama ada di database
        });
        setEditingProduct(product);
        setPreviewImage(product.image_url);
        setIsModalOpen(true);
    };

    // Buka modal konfirmasi hapus
    const openDeleteModal = (product) => {
        setDeletingProduct(product);
        setIsDeleteModalOpen(true);
    };

    // Tutup semua modal
    const closeModals = () => {
        setIsModalOpen(false);
        setIsDeleteModalOpen(false);
        setEditingProduct(null);
        setDeletingProduct(null);
        setPreviewImage(null);
        reset();
        clearErrors();
    };

    // Handle gambar yang dipilih
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('image', file);
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    // Simpan Data (Create/Update)
    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (editingProduct) {
            // Karena method PUT susah untuk upload file di Inertia, kita gunakan POST ke route khusus update
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

    // Eksekusi Hapus Data
    const handleDelete = () => {
        if (deletingProduct) {
            router.delete(route('admin.products.destroy', deletingProduct.id), {
                preserveScroll: true,
                onSuccess: () => closeModals(),
            });
        }
    };

    return (
        <AdminLayout>
            <Head title="Katalog Produk - Florabelle.id" />

            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800">Katalog Produk</h2>
                        <p className="text-slate-500 mt-1">Kelola etalase produk yang tampil di halaman depan pembeli.</p>
                    </div>
                    <button 
                        onClick={openAddModal}
                        className="px-5 py-2.5 bg-pink-500 hover:bg-pink-600 text-white font-bold rounded-xl shadow-lg shadow-pink-500/30 transition-all flex items-center gap-2"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                        </svg>
                        Tambah Produk
                    </button>
                </div>

                {/* Tabel Produk */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 text-slate-500 text-sm">
                                    <th className="px-6 py-4 font-semibold border-b border-slate-200 w-24">Foto</th>
                                    <th className="px-6 py-4 font-semibold border-b border-slate-200">Nama Produk</th>
                                    <th className="px-6 py-4 font-semibold border-b border-slate-200">Kategori</th>
                                    <th className="px-6 py-4 font-semibold border-b border-slate-200">Harga</th>
                                    <th className="px-6 py-4 font-semibold border-b border-slate-200">Stok</th>
                                    <th className="px-6 py-4 font-semibold border-b border-slate-200 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm divide-y divide-slate-100">
                                {products.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-10 text-center text-slate-400">
                                            Belum ada produk di etalase. Klik "Tambah Produk" untuk memulai.
                                        </td>
                                    </tr>
                                ) : (
                                    products.map((product) => (
                                        <tr key={product.id} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="w-16 h-16 rounded-lg overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                                                    {product.image_url ? (
                                                        <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-2xl">📸</div>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 font-bold text-slate-800">{product.name}</td>
                                            <td className="px-6 py-4 text-slate-600">
                                                <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs font-semibold">
                                                    {product.category || '-'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 font-semibold text-pink-600">
                                                Rp {parseFloat(product.price).toLocaleString('id-ID')}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`font-bold ${product.stock > 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                                                    {product.stock} {product.stock === 0 && '(Habis)'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right space-x-2">
                                                <button 
                                                    onClick={() => openEditModal(product)}
                                                    className="px-3 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 font-bold rounded-lg transition"
                                                >
                                                    Edit
                                                </button>
                                                <button 
                                                    onClick={() => openDeleteModal(product)}
                                                    className="px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 font-bold rounded-lg transition"
                                                >
                                                    Hapus
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Modal Tambah/Edit Produk */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={closeModals}></div>
                    <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="px-8 py-5 border-b border-slate-100 flex items-center justify-between shrink-0">
                            <h3 className="text-xl font-bold text-slate-800">
                                {editingProduct ? 'Edit Produk' : 'Tambah Produk Baru'}
                            </h3>
                            <button onClick={closeModals} className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>
                        
                        <div className="p-8 overflow-y-auto">
                            <form id="productForm" onSubmit={handleSubmit} className="space-y-6">
                                {/* Upload Foto */}
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">Foto Produk</label>
                                    <div className="flex items-center gap-6">
                                        <div 
                                            className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 flex flex-col items-center justify-center text-slate-400 overflow-hidden cursor-pointer hover:bg-slate-100 transition shrink-0"
                                            onClick={() => fileInputRef.current.click()}
                                        >
                                            {previewImage ? (
                                                <img src={previewImage} alt="Preview" className="w-full h-full object-cover" />
                                            ) : (
                                                <>
                                                    <svg className="w-8 h-8 mb-1" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                                                    <span className="text-xs font-semibold">Pilih Foto</span>
                                                </>
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <input 
                                                type="file" 
                                                className="hidden" 
                                                ref={fileInputRef} 
                                                onChange={handleImageChange} 
                                                accept="image/*"
                                            />
                                            <button 
                                                type="button"
                                                onClick={() => fileInputRef.current.click()}
                                                className="px-4 py-2 bg-slate-100 text-slate-700 text-sm font-bold rounded-lg hover:bg-slate-200 transition"
                                            >
                                                Jelajahi File
                                            </button>
                                            <p className="text-xs text-slate-400 mt-2">Maksimal 2MB. Format JPG, PNG.</p>
                                            {errors.image && <p className="text-sm text-red-500 mt-1">{errors.image}</p>}
                                        </div>
                                    </div>
                                </div>

                                {/* Field Nama & Kategori */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">Nama Produk</label>
                                        <input 
                                            type="text" 
                                            value={data.name} 
                                            onChange={e => setData('name', e.target.value)}
                                            className="w-full rounded-xl border-slate-200 bg-slate-50 focus:border-pink-300 focus:ring focus:ring-pink-100 transition p-3"
                                            required
                                        />
                                        {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">Kategori</label>
                                        <select 
                                            value={data.category} 
                                            onChange={e => setData('category', e.target.value)}
                                            className="w-full rounded-xl border-slate-200 bg-slate-50 focus:border-pink-300 focus:ring focus:ring-pink-100 transition p-3"
                                        >
                                            <option value="">Pilih Kategori...</option>
                                            {categories.map(cat => (
                                                <option key={cat} value={cat}>{cat}</option>
                                            ))}
                                        </select>
                                        {errors.category && <p className="text-sm text-red-500 mt-1">{errors.category}</p>}
                                    </div>
                                </div>

                                {/* Field Harga & Stok */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">Harga (Rp)</label>
                                        <input 
                                            type="number" 
                                            value={data.price} 
                                            onChange={e => setData('price', e.target.value)}
                                            className="w-full rounded-xl border-slate-200 bg-slate-50 focus:border-pink-300 focus:ring focus:ring-pink-100 transition p-3"
                                            required
                                        />
                                        {errors.price && <p className="text-sm text-red-500 mt-1">{errors.price}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">Stok</label>
                                        <input 
                                            type="number" 
                                            value={data.stock} 
                                            onChange={e => setData('stock', e.target.value)}
                                            className="w-full rounded-xl border-slate-200 bg-slate-50 focus:border-pink-300 focus:ring focus:ring-pink-100 transition p-3"
                                            required
                                        />
                                        {errors.stock && <p className="text-sm text-red-500 mt-1">{errors.stock}</p>}
                                    </div>
                                </div>
                            </form>
                        </div>

                        <div className="px-8 py-5 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-3 shrink-0">
                            <button onClick={closeModals} className="px-5 py-2.5 rounded-xl font-bold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 transition">Batal</button>
                            <button 
                                type="submit" 
                                form="productForm"
                                disabled={processing}
                                className="px-5 py-2.5 rounded-xl font-bold text-white bg-pink-500 hover:bg-pink-600 transition disabled:opacity-75 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                {processing ? 'Menyimpan...' : 'Simpan Produk'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Konfirmasi Hapus */}
            {isDeleteModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={closeModals}></div>
                    <div className="relative bg-white rounded-3xl shadow-xl w-full max-w-sm p-6 text-center animate-in zoom-in-95 duration-200">
                        <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                        </div>
                        <h3 className="text-xl font-bold text-slate-800 mb-2">Hapus Produk?</h3>
                        <p className="text-slate-500 text-sm mb-6">Anda yakin ingin menghapus <strong>{deletingProduct?.name}</strong>? Data ini tidak dapat dikembalikan.</p>
                        
                        <div className="flex gap-3">
                            <button onClick={closeModals} className="flex-1 px-4 py-2.5 rounded-xl font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition">Batal</button>
                            <button onClick={handleDelete} className="flex-1 px-4 py-2.5 rounded-xl font-bold text-white bg-red-500 hover:bg-red-600 transition">Ya, Hapus</button>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
