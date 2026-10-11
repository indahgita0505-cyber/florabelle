import { Head, router, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { useState, useRef } from 'react';

export default function BouquetOptionIndex({ options }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [editingOption, setEditingOption] = useState(null);
    const [deletingOption, setDeletingOption] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);
    
    // Default form ke kategori yang sedang dilihat
    const [activeTab, setActiveTab] = useState('isi');
    const fileInputRef = useRef(null);

    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        category: 'isi',
        name: '',
        image: null,
        color_hex: '#ffffff',
        description: '',
        price_adjustment: 0,
        is_active: true,
    });

    const categoryLabels = {
        'isi': 'Varian Isi Buket',
        'warna': 'Tema Warna',
        'wrapping': 'Warna Wrapping',
        'budget': 'Opsi Budget' // Untuk cadangan jika user mau ubah
    };

    // Filter opsi berdasarkan tab aktif
    const activeOptions = options.filter(opt => opt.category === activeTab);

    // Modal Handlers
    const openAddModal = () => {
        clearErrors();
        reset();
        setData('category', activeTab);
        setEditingOption(null);
        setPreviewImage(null);
        setIsModalOpen(true);
    };

    const openEditModal = (option) => {
        clearErrors();
        setData({
            category: option.category,
            name: option.name,
            image: null,
            color_hex: option.color_hex || '#ffffff',
            description: option.description || '',
            price_adjustment: option.price_adjustment || 0,
            is_active: option.is_active,
        });
        setEditingOption(option);
        setPreviewImage(option.image_url);
        setIsModalOpen(true);
    };

    const openDeleteModal = (option) => {
        setDeletingOption(option);
        setIsDeleteModalOpen(true);
    };

    const closeModals = () => {
        setIsModalOpen(false);
        setIsDeleteModalOpen(false);
        setEditingOption(null);
        setDeletingOption(null);
        setPreviewImage(null);
        reset();
        clearErrors();
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('image', file);
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingOption) {
            post(route('admin.bouquet-options.update', editingOption.id), {
                preserveScroll: true,
                onSuccess: () => closeModals(),
            });
        } else {
            post(route('admin.bouquet-options.store'), {
                preserveScroll: true,
                onSuccess: () => closeModals(),
            });
        }
    };

    const handleDelete = () => {
        if (deletingOption) {
            router.delete(route('admin.bouquet-options.destroy', deletingOption.id), {
                preserveScroll: true,
                onSuccess: () => closeModals(),
            });
        }
    };

    return (
        <AdminLayout>
            <Head title="Opsi Custom Buket - Florabelle.id" />

            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800">Manajemen Opsi Custom</h2>
                        <p className="text-slate-500 mt-1">Atur pilihan-pilihan yang akan muncul di form pembeli.</p>
                    </div>
                    <button 
                        onClick={openAddModal}
                        className="px-5 py-2.5 bg-pink-500 hover:bg-pink-600 text-white font-bold rounded-xl shadow-lg shadow-pink-500/30 transition-all flex items-center gap-2"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                        Tambah Opsi
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex space-x-2 border-b border-slate-200">
                    {Object.entries(categoryLabels).map(([key, label]) => (
                        <button
                            key={key}
                            onClick={() => setActiveTab(key)}
                            className={`px-4 py-3 font-semibold text-sm border-b-2 transition-colors ${
                                activeTab === key 
                                ? 'border-pink-500 text-pink-600' 
                                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                            }`}
                        >
                            {label}
                        </button>
                    ))}
                </div>

                {/* Table */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 text-slate-500 text-sm">
                                    <th className="px-6 py-4 font-semibold border-b border-slate-200 w-20">Preview</th>
                                    <th className="px-6 py-4 font-semibold border-b border-slate-200">Nama Pilihan</th>
                                    <th className="px-6 py-4 font-semibold border-b border-slate-200">Tambahan Harga</th>
                                    <th className="px-6 py-4 font-semibold border-b border-slate-200">Status</th>
                                    <th className="px-6 py-4 font-semibold border-b border-slate-200 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm divide-y divide-slate-100">
                                {activeOptions.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-10 text-center text-slate-400">
                                            Belum ada opsi untuk kategori ini.
                                        </td>
                                    </tr>
                                ) : (
                                    activeOptions.map((opt) => (
                                        <tr key={opt.id} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="px-6 py-4">
                                                {opt.category === 'warna' || opt.category === 'wrapping' ? (
                                                    <div 
                                                        className="w-10 h-10 rounded-full border border-slate-200 shadow-sm"
                                                        style={{ backgroundColor: opt.color_hex || '#e2e8f0' }}
                                                    ></div>
                                                ) : (
                                                    <div className="w-12 h-12 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center">
                                                        {opt.image_url ? (
                                                            <img src={opt.image_url} alt={opt.name} className="w-full h-full object-cover" />
                                                        ) : (
                                                            <span className="text-xl">🎁</span>
                                                        )}
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="font-bold text-slate-800">{opt.name}</p>
                                                {opt.description && <p className="text-xs text-slate-500 mt-1">{opt.description}</p>}
                                            </td>
                                            <td className="px-6 py-4 font-semibold text-slate-600">
                                                {opt.price_adjustment > 0 ? `+Rp ${parseFloat(opt.price_adjustment).toLocaleString('id-ID')}` : '-'}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${opt.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                                                    {opt.is_active ? 'Aktif' : 'Nonaktif'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right space-x-2">
                                                <button onClick={() => openEditModal(opt)} className="px-3 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 font-bold rounded-lg transition">Edit</button>
                                                <button onClick={() => openDeleteModal(opt)} className="px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 font-bold rounded-lg transition">Hapus</button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Modal Form */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={closeModals}></div>
                    <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="px-8 py-5 border-b border-slate-100 flex items-center justify-between">
                            <h3 className="text-xl font-bold text-slate-800">{editingOption ? 'Edit Opsi' : 'Tambah Opsi Baru'}</h3>
                            <button onClick={closeModals} className="text-slate-400 hover:text-slate-600">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>
                        
                        <div className="p-8 overflow-y-auto max-h-[70vh]">
                            <form id="optionForm" onSubmit={handleSubmit} className="space-y-5">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">Kategori</label>
                                    <select 
                                        value={data.category} 
                                        onChange={e => setData('category', e.target.value)}
                                        className="w-full rounded-xl border-slate-200 bg-slate-50 focus:border-pink-300 p-3"
                                        disabled={!!editingOption}
                                    >
                                        <option value="isi">Varian Isi Buket</option>
                                        <option value="warna">Tema Warna</option>
                                        <option value="wrapping">Warna Wrapping</option>
                                        <option value="budget">Opsi Budget</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">Nama Pilihan</label>
                                    <input 
                                        type="text" 
                                        value={data.name} 
                                        onChange={e => setData('name', e.target.value)}
                                        className="w-full rounded-xl border-slate-200 bg-slate-50 focus:border-pink-300 p-3"
                                        placeholder="Cth: Maroon Merah"
                                        required
                                    />
                                    {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name}</p>}
                                </div>

                                {(data.category === 'warna' || data.category === 'wrapping') && (
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">Pilih Kode Warna (Opsional)</label>
                                        <div className="flex gap-3 items-center">
                                            <input 
                                                type="color" 
                                                value={data.color_hex || '#ffffff'} 
                                                onChange={e => setData('color_hex', e.target.value)}
                                                className="w-14 h-14 rounded cursor-pointer border-0 p-0"
                                            />
                                            <input 
                                                type="text"
                                                value={data.color_hex || ''}
                                                onChange={e => setData('color_hex', e.target.value)}
                                                className="flex-1 rounded-xl border-slate-200 bg-slate-50 focus:border-pink-300 p-3 font-mono text-sm"
                                                placeholder="#HEXCODE"
                                            />
                                        </div>
                                    </div>
                                )}

                                {data.category === 'isi' && (
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">Foto Referensi (Opsional)</label>
                                        <div className="flex items-center gap-4">
                                            <div className="w-16 h-16 rounded-xl border border-slate-200 bg-slate-50 overflow-hidden flex items-center justify-center shrink-0">
                                                {previewImage ? (
                                                    <img src={previewImage} className="w-full h-full object-cover" />
                                                ) : <span className="text-slate-400">📷</span>}
                                            </div>
                                            <div>
                                                <input type="file" className="hidden" ref={fileInputRef} onChange={handleImageChange} accept="image/*" />
                                                <button type="button" onClick={() => fileInputRef.current.click()} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-sm font-bold rounded-lg text-slate-700 transition">Upload Foto</button>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">Tambahan Harga / Biaya (Opsional)</label>
                                    <input 
                                        type="number" 
                                        value={data.price_adjustment} 
                                        onChange={e => setData('price_adjustment', e.target.value)}
                                        className="w-full rounded-xl border-slate-200 bg-slate-50 focus:border-pink-300 p-3"
                                        placeholder="0"
                                    />
                                    <p className="text-xs text-slate-500 mt-1">Kosongkan atau isi 0 jika opsi ini gratis.</p>
                                </div>
                            </form>
                        </div>
                        
                        <div className="px-8 py-5 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
                            <button onClick={closeModals} className="px-5 py-2.5 rounded-xl font-bold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 transition">Batal</button>
                            <button type="submit" form="optionForm" disabled={processing} className="px-5 py-2.5 rounded-xl font-bold text-white bg-pink-500 hover:bg-pink-600 transition">
                                {processing ? 'Menyimpan...' : 'Simpan'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Delete */}
            {isDeleteModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={closeModals}></div>
                    <div className="relative bg-white rounded-3xl p-6 text-center max-w-sm w-full shadow-xl">
                        <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                        </div>
                        <h3 className="text-xl font-bold mb-2">Hapus Opsi?</h3>
                        <p className="text-sm text-slate-500 mb-6">Yakin menghapus opsi <strong>{deletingOption?.name}</strong>? Data pembeli tidak akan terpengaruh, tapi opsi ini tidak akan muncul lagi di form.</p>
                        <div className="flex gap-3">
                            <button onClick={closeModals} className="flex-1 px-4 py-2 bg-slate-100 font-bold rounded-xl text-slate-600">Batal</button>
                            <button onClick={handleDelete} className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 font-bold rounded-xl text-white">Hapus</button>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
