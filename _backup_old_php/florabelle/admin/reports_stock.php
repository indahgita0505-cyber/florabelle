<?php require_once '../config.php'; ?>
<?php
// Prediksi kebutuhan berdasarkan penjualan tahun lalu (tidak ditampilkan lagi, tapi data mungkin masih dipakai? kita hapus saja)
// Langsung ambil produk untuk stok satuan
$products = $db->query('SELECT id, name, stock, category FROM products ORDER BY name')->fetchAll();

// Data untuk rekomendasi pemesanan (best seller tahun lalu)
$lastYear = date('Y') - 1;
$stmt = $db->prepare("
    SELECT p.name, SUM(oi.quantity) as total_sold
    FROM order_items oi
    JOIN products p ON oi.product_id = p.id
    JOIN orders o ON oi.order_id = o.id
    WHERE YEAR(o.created_at) = ? AND o.status != 'cancelled'
    GROUP BY p.id
    ORDER BY total_sold DESC
    LIMIT 10
");
$stmt->execute([$lastYear]);
$bestSellers = $stmt->fetchAll();
?>
<?php require_once 'header.php'; ?>

<div class="admin-topbar">
    <h4><i class="fas fa-chart-line me-2"></i> Laporan & Stok</h4>
</div>

<div class="admin-body">
    <!-- Stok Satuan (per tangkai) -->
    <div class="card mb-4">
        <div class="card-header bg-white fw-semibold">📦 Stok Satuan (per tangkai / ikat)</div>
        <div class="card-body">
            <div class="table-responsive">
                <table class="table table-bordered align-middle">
                    <thead class="table-light">
                        <tr><th>Produk</th><th>Kategori</th><th>Stok (produk)</th><th>Estimasi Satuan (tangkai)</th><th>Aksi</th></tr>
                    </thead>
                    <tbody>
                    <?php foreach ($products as $p) {
                        $stmt = $db->prepare('SELECT stock_units FROM product_stock_details WHERE product_id = ?');
                        $stmt->execute([$p['id']]);
                        $detail = $stmt->fetch();
                        $unitStock = $detail ? $detail['stock_units'] : ($p['stock'] * 10); // asumsi 1 produk = 10 tangkai
                        ?>
                        <tr>
                            <td><?= e($p['name'])?></td>
                            <td><?= e($p['category'])?></td>
                            <td><span class="badge bg-secondary"><?= $p['stock']?></span></td>
                            <td><?= $unitStock?> tangkai</td>
                            <td>
                                <form method="post" action="../process.php" class="row g-1">
                                    <input type="hidden" name="action" value="update_unit_stock">
                                    <input type="hidden" name="product_id" value="<?= $p['id']?>">
                                    <div class="col-auto"><input type="number" name="stock_units" value="<?= $unitStock?>" class="form-control form-control-sm" style="width:100px"></div>
                                    <div class="col-auto"><button class="btn btn-sm btn-primary">Simpan</button></div>
                                </form>
                             </td>
                         </tr>
                    <?php } ?>
                    </tbody>
                </table>
            </div>
        </div>
    </div>

    <!-- Rekomendasi Pemesanan Stok -->
    <div class="card">
        <div class="card-header bg-white fw-semibold">🔄 Rekomendasi Pemesanan Stok</div>
        <div class="card-body">
            <?php if (! empty($bestSellers)) { ?>
                <ul class="list-group">
                <?php foreach ($bestSellers as $bs) { ?>
                    <li class="list-group-item"><?= e($bs['name'])?> - terjual <strong><?= $bs['total_sold']?></strong> unit tahun lalu. Persiapkan minimal <strong><?= ceil($bs['total_sold'] * 1.2)?></strong> unit untuk tahun ini.</li>
                <?php } ?>
                </ul>
            <?php } else { ?>
                <p class="text-muted">Belum ada data penjualan tahun lalu.</p>
            <?php } ?>
        </div>
    </div>
</div>

<?php require_once 'footer.php'; ?>