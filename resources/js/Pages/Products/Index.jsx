import { Head, Link, usePage, router } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import { useState } from 'react';

export default function Index({ products = [] }) {
    const { auth, flash } = usePage().props;
    const [addingId, setAddingId] = useState(null);
    const [buyingId, setBuyingId] = useState(null);
    const [toastMsg, setToastMsg] = useState(null);

    const isAdmin = auth?.user?.role === 'admin';

    const [search, setSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [priceRange, setPriceRange] = useState('');

    const categories = [...new Set(products.map(p => p.category).filter(Boolean))];

    const filteredProducts = products.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || 
                              (p.description && p.description.toLowerCase().includes(search.toLowerCase()));
        const matchesCategory = selectedCategory ? p.category === selectedCategory : true;
        
        let matchesPrice = true;
        if (priceRange === 'under-50') matchesPrice = Number(p.price) < 50000;
        else if (priceRange === '50-100') matchesPrice = Number(p.price) >= 50000 && Number(p.price) <= 100000;
        else if (priceRange === 'above-100') matchesPrice = Number(p.price) > 100000;

        return matchesSearch && matchesCategory && matchesPrice;
    });

    const addToCart = (productId) => {
        if (!auth.user) {
            router.visit(route('login'));
            return;
        }

        setAddingId(productId);
        router.post(route('cart.store'), {
            product_id: productId,
            quantity: 1
        }, {
            preserveScroll: true,
            onSuccess: () => {
                setToastMsg('Berhasil ditambahkan ke keranjang!');
                setTimeout(() => setToastMsg(null), 3000);
            },
            onError: () => {
                setToastMsg('Gagal menambahkan ke keranjang.');
                setTimeout(() => setToastMsg(null), 3000);
            },
            onFinish: () => {
                setAddingId(null);
            }
        });
    };

    const buyNow = (productId) => {
        if (!auth.user) {
            router.visit(route('login'));
            return;
        }

        setBuyingId(productId);
        router.post(route('cart.store'), {
            product_id: productId,
            quantity: 1
        }, {
            preserveScroll: true,
            onSuccess: () => {
                router.visit(route('checkout.index'));
            },
            onError: () => {
                setToastMsg('Gagal memproses pembelian.');
                setTimeout(() => setToastMsg(null), 3000);
            },
            onFinish: () => {
                setBuyingId(null);
            }
        });
    };

    return (
        <MainLayout>
            <Head title="Katalog Bunga" />

            {/* Hero Section */}
            <div className="relative bg-gradient-to-r from-pink-100 to-rose-50 overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 relative z-10">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <span className="inline-block py-1 px-3 rounded-full bg-pink-200 text-pink-800 text-sm font-semibold mb-4">
                                 Bunga Segar Setiap Hari
                            </span>
                            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-6">
                                Keindahan Bunga untuk Setiap <span className="text-pink-500 italic">Momen</span>
                            </h1>
                            <p className="text-lg text-gray-600 mb-8 max-w-lg">
                                Rangkaian bunga premium dipilih langsung dari kebun terbaik untuk menyampaikan pesan cinta Anda.
                            </p>
                            <div className="flex flex-wrap gap-4">
                                <a href="#products" className="bg-pink-500 text-white px-6 py-3 rounded-full font-bold hover:bg-pink-600 shadow-md transition transform hover:-translate-y-1">
                                    Jelajahi Koleksi
                                </a>
                            </div>
                        </div>
                        <div className="hidden lg:block relative">
                            {/* Decorative element */}
                            <div className="absolute inset-0 bg-pink-200 rounded-full blur-3xl opacity-50 transform translate-x-10 translate-y-10"></div>
                            <img src="https://images.unsplash.com/photo-1487530811176-3780de880c2d?w=800&h=800&fit=crop" alt="Bunga" className="rounded-2xl shadow-2xl relative z-10 border-4 border-white" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Features */}
            <div className="bg-white py-12 border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                        <div className="p-4 rounded-xl bg-pink-50 hover:bg-pink-100 transition cursor-pointer">
                            <div className="text-3xl mb-2"></div>
                            <h4 className="font-bold text-gray-800">Pengiriman Cepat</h4>
                            <p className="text-sm text-gray-500">2-4 jam Jabodetabek</p>
                        </div>
                        <div className="p-4 rounded-xl bg-green-50 hover:bg-green-100 transition cursor-pointer">
                            <div className="text-3xl mb-2"></div>
                            <h4 className="font-bold text-gray-800">100% Segar</h4>
                            <p className="text-sm text-gray-500">Dari kebun pilihan</p>
                        </div>
                        <div className="p-4 rounded-xl bg-purple-50 hover:bg-purple-100 transition cursor-pointer">
                            <div className="text-3xl mb-2"></div>
                            <h4 className="font-bold text-gray-800">Kustomisasi</h4>
                            <p className="text-sm text-gray-500">Sesuai selera</p>
                        </div>
                        <div className="p-4 rounded-xl bg-rose-50 hover:bg-rose-100 transition cursor-pointer">
                            <div className="text-3xl mb-2"></div>
                            <h4 className="font-bold text-gray-800">Garansi Fresh</h4>
                            <p className="text-sm text-gray-500">Uang kembali</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Products Section */}
            <div id="products" className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Koleksi Bunga Kami</h2>
                    <p className="text-gray-500 max-w-2xl mx-auto">Temukan bunga terbaik untuk setiap kesempatan, dirangkai dengan penuh cinta dan keahlian.</p>
                </div>

                {/* Filters */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                    <div className="flex flex-wrap gap-2 items-center">
                        <button 
                            onClick={() => setSelectedCategory('')}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition ${!selectedCategory ? 'bg-pink-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                        >
                            Semua
                        </button>
                        {categories.map(c => (
                            <button 
                                key={c}
                                onClick={() => setSelectedCategory(c)}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition ${selectedCategory === c ? 'bg-pink-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                            >
                                {c}
                            </button>
                        ))}

                        <div className="ml-2 border-l border-gray-200 pl-4 py-1">
                            <select 
                                value={priceRange} 
                                onChange={(e) => setPriceRange(e.target.value)}
                                className="px-4 py-2 rounded-full text-sm font-medium border-gray-200 text-gray-600 focus:ring-pink-500 focus:border-pink-500 bg-gray-50"
                            >
                                <option value="">Harga: Semua</option>
                                <option value="under-50">Di Bawah 50K</option>
                                <option value="50-100">50K - 100K</option>
                                <option value="above-100">Di Atas 100K</option>
                            </select>
                        </div>
                    </div>

                    <div className="w-full md:w-auto relative mt-4 md:mt-0">
                        <input 
                            type="text" 
                            placeholder="Cari bunga..." 
                            className="w-full md:w-64 pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:ring-pink-500 focus:border-pink-500"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                        <span className="absolute left-3 top-2.5 text-gray-400"></span>
                    </div>
                </div>

                {/* Product Grid */}
                {filteredProducts.length === 0 ? (
                    <div className="text-center py-20 bg-gray-50 rounded-2xl">
                        <div className="text-5xl mb-4"></div>
                        <h3 className="text-xl font-medium text-gray-600">Bunga tidak ditemukan</h3>
                        <p className="text-gray-500">Coba kata kunci lain atau ubah kategori pencarian.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {filteredProducts.map(product => (
                            <div key={product.id} className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-100 group flex flex-col h-full">
                                <div className="relative aspect-square overflow-hidden bg-gray-100 flex items-center justify-center">
                                    {product.image_url ? (
                                        <img src={product.image_url} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                    ) : (
                                        <div className="text-6xl group-hover:scale-110 transition-transform duration-500">{product.image || ''}</div>
                                    )}
                                    {product.category && (
                                        <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-gray-700 shadow-sm">
                                            {product.category}
                                        </span>
                                    )}
                                </div>
                                <div className="p-5 flex flex-col flex-grow">
                                    <h3 className="font-bold text-gray-900 text-lg mb-1 truncate">{product.name}</h3>
                                    <p className="text-sm text-gray-500 line-clamp-2 mb-4 flex-grow">{product.description}</p>
                                    
                                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-50">
                                        <div className="font-black text-pink-600 text-lg">
                                            Rp {Number(product.price).toLocaleString('id-ID')}
                                        </div>
                                        {!isAdmin && product.stock > 0 && (
                                            <div className="flex items-center gap-2">
                                                <button 
                                                    onClick={() => addToCart(product.id)}
                                                    disabled={addingId === product.id || buyingId === product.id}
                                                    className="p-2 rounded-xl bg-pink-50 text-pink-600 hover:bg-pink-100 transition-all duration-200 disabled:opacity-50 border border-pink-200/60 shadow-2xs"
                                                    title="Tambah ke Keranjang"
                                                >
                                                    {addingId === product.id ? (
                                                        <span className="text-[10px] font-bold">...</span>
                                                    ) : (
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                                        </svg>
                                                    )}
                                                </button>
                                                <button 
                                                    onClick={() => buyNow(product.id)}
                                                    disabled={addingId === product.id || buyingId === product.id}
                                                    className="px-3.5 py-2 rounded-xl bg-pink-600 hover:bg-pink-700 active:scale-95 text-white font-bold text-xs shadow-xs transition duration-200 disabled:opacity-50"
                                                    title="Beli Sekarang"
                                                >
                                                    {buyingId === product.id ? '...' : 'Beli'}
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                    {product.stock <= 0 && (
                                        <div className="mt-2 text-center text-sm font-medium text-red-500 bg-red-50 py-1 rounded-md">
                                            Habis
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Floating Toast Notification */}
            {toastMsg && (
                <div className="fixed bottom-6 right-6 z-50 bg-slate-900/90 backdrop-blur text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 animate-bounce">
                    <span className="text-sm font-semibold">{toastMsg}</span>
                    <Link href={route('cart.index')} className="text-xs bg-pink-500 text-white font-bold px-3 py-1.5 rounded-xl hover:bg-pink-600 transition">
                        Lihat Keranjang 
                    </Link>
                </div>
            )}
        </MainLayout>
    );
}
