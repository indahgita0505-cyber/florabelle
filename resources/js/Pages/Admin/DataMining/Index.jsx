import { Head } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { useState } from 'react';
import { Crown, Star, Leaf } from 'lucide-react';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const rupiah = (val) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);

const clusterTheme = {
    gold: {
        bg: 'bg-amber-50',
        border: 'border-amber-200',
        badge: 'bg-amber-100 text-amber-800 border border-amber-300',
        header: 'bg-gradient-to-r from-amber-400 to-yellow-300',
        dot: 'bg-amber-400',
        ring: 'ring-amber-300',
        text: 'text-amber-700',
        stat: 'bg-amber-50 border-amber-100',
    },
    silver: {
        bg: 'bg-slate-50',
        border: 'border-slate-200',
        badge: 'bg-slate-100 text-slate-700 border border-slate-300',
        header: 'bg-gradient-to-r from-slate-400 to-slate-300',
        dot: 'bg-slate-400',
        ring: 'ring-slate-300',
        text: 'text-slate-600',
        stat: 'bg-slate-50 border-slate-100',
    },
    bronze: {
        bg: 'bg-orange-50',
        border: 'border-orange-200',
        badge: 'bg-orange-100 text-orange-800 border border-orange-300',
        header: 'bg-gradient-to-r from-orange-400 to-amber-300',
        dot: 'bg-orange-400',
        ring: 'ring-orange-300',
        text: 'text-orange-700',
        stat: 'bg-orange-50 border-orange-100',
    },
};

// ─── Sub-components ────────────────────────────────────────────────────────────

function SummaryBadge({ result }) {
    if (!result) return null;
    return (
        <div className="flex flex-wrap gap-3 items-center">
            <span className="inline-flex items-center gap-1.5 bg-violet-50 text-violet-700 border border-violet-200 rounded-full px-4 py-1.5 text-sm font-semibold">
                🔬 {result.total_customers} Pelanggan Dianalisis
            </span>
            <span className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-full px-4 py-1.5 text-sm font-semibold">
                📐 K = {result.k} Cluster
            </span>
            <span className="inline-flex items-center gap-1.5 bg-green-50 text-green-700 border border-green-200 rounded-full px-4 py-1.5 text-sm font-semibold">
                ✅ Konvergen dalam {result.iterations} Iterasi
            </span>
        </div>
    );
}

function ClusterCard({ cluster }) {
    const [open, setOpen] = useState(false);
    const theme = clusterTheme[cluster.color] || clusterTheme.silver;
    const stats = cluster.stats || {};

    return (
        <div className={`rounded-2xl border ${theme.border} overflow-hidden shadow-sm transition-all duration-300`}>
            {/* Header */}
            <div className={`${theme.header} px-6 py-4 flex items-center justify-between`}>
                <div className="flex items-center gap-3">
                    <span className="text-white drop-shadow">
                        {cluster.color === 'gold' && <Crown size={32} />}
                        {cluster.color === 'silver' && <Star size={32} />}
                        {cluster.color === 'bronze' && <Leaf size={32} />}
                    </span>
                    <div>
                        <h3 className="font-bold text-white text-lg drop-shadow">{cluster.label}</h3>
                        <p className="text-white/80 text-sm">{cluster.description}</p>
                    </div>
                </div>
                <div className="bg-white/30 backdrop-blur-sm rounded-xl px-4 py-2 text-center text-white">
                    <p className="text-2xl font-extrabold leading-none">{cluster.count}</p>
                    <p className="text-xs font-medium opacity-90">pelanggan</p>
                </div>
            </div>

            {/* Stats Row */}
            <div className={`${theme.bg} grid grid-cols-3 divide-x divide-${theme.border} border-b ${theme.border}`}>
                <div className="px-4 py-3 text-center">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Recency (hari)</p>
                    <p className={`text-xl font-extrabold ${theme.text} mt-0.5`}>{stats.avg_recency ?? '-'}</p>
                </div>
                <div className="px-4 py-3 text-center">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Frequency</p>
                    <p className={`text-xl font-extrabold ${theme.text} mt-0.5`}>{stats.avg_frequency ?? '-'}x</p>
                </div>
                <div className="px-4 py-3 text-center">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Avg. Monetary</p>
                    <p className={`text-xl font-extrabold ${theme.text} mt-0.5`}>{stats.avg_monetary ? rupiah(stats.avg_monetary) : '-'}</p>
                </div>
            </div>

            {/* Toggle Members */}
            <div className={`${theme.bg}`}>
                <button
                    onClick={() => setOpen(!open)}
                    className={`w-full flex items-center justify-between px-6 py-3 text-sm font-semibold ${theme.text} hover:opacity-80 transition-opacity`}
                >
                    <span>{open ? 'Sembunyikan' : 'Lihat'} Daftar Anggota ({cluster.count})</span>
                    <span className={`transform transition-transform duration-200 ${open ? 'rotate-180' : ''}`}>▼</span>
                </button>

                {open && (
                    <div className="overflow-x-auto border-t border-slate-100">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-white/60 text-slate-500 text-xs uppercase tracking-wide">
                                    <th className="px-4 py-3 text-left font-semibold">Nama</th>
                                    <th className="px-4 py-3 text-center font-semibold">Recency</th>
                                    <th className="px-4 py-3 text-center font-semibold">Frequency</th>
                                    <th className="px-4 py-3 text-right font-semibold">Monetary</th>
                                    <th className="px-4 py-3 text-center font-semibold">Avg Rating</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {cluster.members.map((m) => (
                                    <tr key={m.user_id} className="hover:bg-white/80 transition-colors">
                                        <td className="px-4 py-2.5 font-medium text-slate-800">{m.name}</td>
                                        <td className="px-4 py-2.5 text-center text-slate-600">{m.recency} hari</td>
                                        <td className="px-4 py-2.5 text-center text-slate-600">{m.frequency}x</td>
                                        <td className="px-4 py-2.5 text-right font-semibold text-slate-700">{rupiah(m.monetary)}</td>
                                        <td className="px-4 py-2.5 text-center">
                                            {m.avg_rating ? (
                                                <span className="inline-flex items-center gap-1 text-amber-600 font-bold">
                                                    ⭐ {m.avg_rating}
                                                </span>
                                            ) : (
                                                <span className="text-slate-400 text-xs">-</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}

function RfmTable({ dataset }) {
    const [search, setSearch] = useState('');
    const [sortKey, setSortKey] = useState('monetary');
    const [sortDir, setSortDir] = useState('desc');

    const toggleSort = (key) => {
        if (sortKey === key) {
            setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
        } else {
            setSortKey(key);
            setSortDir('desc');
        }
    };

    const filtered = dataset
        .filter((r) => r.name.toLowerCase().includes(search.toLowerCase()))
        .sort((a, b) => {
            const dir = sortDir === 'asc' ? 1 : -1;
            return (a[sortKey] > b[sortKey] ? 1 : -1) * dir;
        });

    const SortIcon = ({ col }) => (
        <span className="ml-1 opacity-50 text-xs">
            {sortKey === col ? (sortDir === 'asc' ? '▲' : '▼') : '⇅'}
        </span>
    );

    return (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                    <h3 className="text-lg font-bold text-slate-800">📋 Dataset Lengkap (RFM)</h3>
                    <p className="text-sm text-slate-500 mt-0.5">{dataset.length} pelanggan · Klik kolom untuk sort</p>
                </div>
                <input
                    type="text"
                    placeholder="Cari nama pelanggan..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="border border-slate-200 rounded-xl px-4 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-violet-300 w-full sm:w-64"
                />
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="bg-slate-50 text-slate-500 border-b border-slate-200 text-xs uppercase tracking-wide">
                            <th className="px-5 py-3 text-left font-semibold">#</th>
                            <th className="px-5 py-3 text-left font-semibold">Nama</th>
                            <th className="px-5 py-3 text-center font-semibold cursor-pointer hover:text-violet-600 transition-colors select-none" onClick={() => toggleSort('recency')}>
                                Recency <SortIcon col="recency" />
                            </th>
                            <th className="px-5 py-3 text-center font-semibold cursor-pointer hover:text-violet-600 transition-colors select-none" onClick={() => toggleSort('frequency')}>
                                Frequency <SortIcon col="frequency" />
                            </th>
                            <th className="px-5 py-3 text-right font-semibold cursor-pointer hover:text-violet-600 transition-colors select-none" onClick={() => toggleSort('monetary')}>
                                Monetary <SortIcon col="monetary" />
                            </th>
                            <th className="px-5 py-3 text-right font-semibold cursor-pointer hover:text-violet-600 transition-colors select-none" onClick={() => toggleSort('avg_order_value')}>
                                Avg Order <SortIcon col="avg_order_value" />
                            </th>
                            <th className="px-5 py-3 text-center font-semibold cursor-pointer hover:text-violet-600 transition-colors select-none" onClick={() => toggleSort('avg_rating')}>
                                Avg Rating <SortIcon col="avg_rating" />
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {filtered.map((row, idx) => (
                            <tr key={row.user_id} className="hover:bg-slate-50/70 transition-colors">
                                <td className="px-5 py-3 text-slate-400 font-mono text-xs">{idx + 1}</td>
                                <td className="px-5 py-3 font-medium text-slate-800">{row.name}</td>
                                <td className="px-5 py-3 text-center text-slate-600">{Math.round(row.recency)} hr</td>
                                <td className="px-5 py-3 text-center text-slate-600">{row.frequency}x</td>
                                <td className="px-5 py-3 text-right font-semibold text-slate-700">{rupiah(row.monetary)}</td>
                                <td className="px-5 py-3 text-right text-slate-600">{rupiah(row.avg_order_value)}</td>
                                <td className="px-5 py-3 text-center">
                                    {row.avg_rating ? (
                                        <span className="inline-flex items-center gap-1 text-amber-600 font-bold text-xs">
                                            ⭐ {Number(row.avg_rating).toFixed(1)}
                                        </span>
                                    ) : (
                                        <span className="text-slate-400 text-xs">–</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filtered.length === 0 && (
                    <div className="text-center py-12 text-slate-400">
                        <p className="text-4xl mb-2">🔍</p>
                        <p className="font-medium">Tidak ada hasil untuk "{search}"</p>
                    </div>
                )}
            </div>
        </div>
    );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────

export default function DataMiningIndex({ result, clusterMembers, dataset, message }) {
    return (
        <AdminLayout>
            <Head title="Data Mining - Florabelle Admin" />

            <div className="space-y-8">

                {/* Page Header */}
                <div className="bg-gradient-to-br from-violet-600 to-indigo-600 rounded-2xl p-8 text-white shadow-lg">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div>
                            <h2 className="text-3xl font-extrabold tracking-tight">🔬 Data Mining</h2>
                            <p className="text-violet-200 mt-1 text-sm max-w-xl">
                                Segmentasi pelanggan menggunakan algoritma <strong className="text-white">K-Means Clustering</strong> berbasis
                                analisis <strong className="text-white">RFM</strong> (Recency · Frequency · Monetary).
                            </p>
                        </div>
                        <SummaryBadge result={result} />
                    </div>

                    {/* Algorithm Info Pills */}
                    <div className="mt-5 flex flex-wrap gap-2">
                        {[
                            { icon: '📅', label: 'Recency', desc: 'Hari sejak transaksi terakhir' },
                            { icon: '🔄', label: 'Frequency', desc: 'Total jumlah transaksi' },
                            { icon: '💰', label: 'Monetary', desc: 'Total nilai belanja (Rp)' },
                        ].map((f) => (
                            <div key={f.label} className="flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-xl px-4 py-2">
                                <span className="text-lg">{f.icon}</span>
                                <div>
                                    <p className="text-xs font-bold text-white">{f.label}</p>
                                    <p className="text-xs text-violet-200">{f.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Error / Empty State */}
                {message && (
                    <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 text-amber-800 font-medium flex items-center gap-3">
                        <span className="text-2xl">⚠️</span>
                        <span>{message}</span>
                    </div>
                )}

                {/* Cluster Cards */}
                {clusterMembers && clusterMembers.length > 0 && (
                    <div>
                        <h3 className="text-xl font-bold text-slate-800 mb-4">Hasil Clustering</h3>
                        <div className="grid grid-cols-1 gap-6">
                            {clusterMembers.map((cluster) => (
                                <ClusterCard key={cluster.cluster_id} cluster={cluster} />
                            ))}
                        </div>
                    </div>
                )}

                {/* Raw Dataset Table */}
                {dataset && dataset.length > 0 && (
                    <RfmTable dataset={dataset} />
                )}

                {/* Algorithm Explanation Card */}
                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                    <h3 className="text-lg font-bold text-slate-800 mb-4">📖 Cara Kerja Algoritma K-Means</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[
                            { step: '1', title: 'Normalisasi Min-Max', desc: 'Semua nilai fitur RFM dinormalisasi ke rentang [0, 1] agar tidak ada fitur yang mendominasi karena skalanya.' },
                            { step: '2', title: 'Inisialisasi Centroid', desc: 'K = 3 centroid dipilih secara acak dari dataset sebagai titik awal cluster.' },
                            { step: '3', title: 'Assignment', desc: 'Setiap pelanggan di-assign ke cluster dengan centroid terdekat berdasarkan jarak Euclidean.' },
                            { step: '4', title: 'Update & Konvergensi', desc: 'Centroid diperbarui dengan rata-rata anggota cluster. Diulang hingga tidak ada perubahan assignment.' },
                        ].map((item) => (
                            <div key={item.step} className="flex gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
                                <div className="w-8 h-8 rounded-full bg-violet-600 text-white flex items-center justify-center font-bold text-sm shrink-0">
                                    {item.step}
                                </div>
                                <div>
                                    <p className="font-semibold text-slate-800 text-sm">{item.title}</p>
                                    <p className="text-slate-500 text-sm mt-0.5">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </AdminLayout>
    );
}
