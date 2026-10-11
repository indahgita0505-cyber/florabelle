<?php require_once '../config.php'; ?>
<?php
// ==================== DASHBOARD DATA ====================
$today = date('Y-m-d');
$firstDayMonth = date('Y-m-01');
$firstDayWeek = date('Y-m-d', strtotime('-6 days'));

// Penjualan hari ini
$stmt = $db->prepare("SELECT COALESCE(SUM(total),0) as revenue, COUNT(*) as orders FROM orders WHERE DATE(created_at) = ? AND status != 'cancelled'");
$stmt->execute([$today]);
$todayStats = $stmt->fetch();

// Penjualan bulan ini
$stmt = $db->prepare("SELECT COALESCE(SUM(total),0) as revenue, COUNT(*) as orders FROM orders WHERE created_at >= ? AND status != 'cancelled'");
$stmt->execute([$firstDayMonth]);
$monthStats = $stmt->fetch();

// Total produk & total pesanan
$totalProducts = $db->query("SELECT COUNT(*) FROM products")->fetchColumn();
$totalOrders = $db->query("SELECT COUNT(*) FROM orders WHERE status != 'cancelled'")->fetchColumn();

// ---------- DATA GRAFIK (7 Hari Terakhir) ----------
$stmt = $db->prepare("
    SELECT DATE(created_at) as date, COUNT(*) as total_orders
    FROM orders
    WHERE created_at >= ? AND status != 'cancelled'
    GROUP BY DATE(created_at)
    ORDER BY date ASC
");
$stmt->execute([$firstDayWeek]);
$chartData = $stmt->fetchAll(PDO::FETCH_ASSOC);

$dates = [];
$ordersCount = [];
for ($i = 6; $i >= 0; $i--) {
    $date = date('Y-m-d', strtotime("-$i days"));
    $dates[] = $date;
    $found = false;
    foreach ($chartData as $row) {
        if ($row['date'] == $date) {
            $ordersCount[] = $row['total_orders'];
            $found = true;
            break;
        }
    }
    if (!$found) $ordersCount[] = 0;
}
// ---------- END GRAFIK ----------

// Pesanan terbaru (5)
$recentOrders = $db->query("
    SELECT o.*, u.username 
    FROM orders o 
    LEFT JOIN users u ON o.user_id = u.id 
    WHERE o.status != 'cancelled'
    ORDER BY o.id DESC LIMIT 5
")->fetchAll();

// Stok menipis (<=5)
$lowStockProducts = $db->query("SELECT * FROM products WHERE stock <= 5 ORDER BY stock ASC LIMIT 5")->fetchAll();

// Aktivitas (ulasan & inquiry)
$activities = [];
$tableReviews = $db->query("SHOW TABLES LIKE 'reviews'")->rowCount() > 0;
if ($tableReviews) {
    $reviews = $db->query("
        SELECT r.*, u.username, p.name as product_name
        FROM reviews r
        JOIN users u ON r.user_id = u.id
        JOIN products p ON r.product_id = p.id
        ORDER BY r.id DESC LIMIT 5
    ")->fetchAll();
    foreach ($reviews as $rv) {
        $activities[] = [
            'type' => 'review',
            'icon' => 'fa-star',
            'title' => 'Ulasan dari ' . e($rv['username']),
            'detail' => '⭐ ' . $rv['rating'] . '/5 - ' . substr(e($rv['review']), 0, 60),
            'time' => $rv['created_at']
        ];
    }
}
$tableInquiries = $db->query("SHOW TABLES LIKE 'inquiries'")->rowCount() > 0;
if ($tableInquiries) {
    $inquiries = $db->query("SELECT * FROM inquiries ORDER BY id DESC LIMIT 5")->fetchAll();
    foreach ($inquiries as $inq) {
        $activities[] = [
            'type' => 'inquiry',
            'icon' => 'fa-question-circle',
            'title' => 'Pertanyaan dari ' . e($inq['name']),
            'detail' => e($inq['subject']),
            'time' => $inq['created_at']
        ];
    }
}
usort($activities, function($a, $b) { return strtotime($b['time']) - strtotime($a['time']); });
$activities = array_slice($activities, 0, 5);

$statusMap = ['pending' => 'Menunggu', 'confirmed' => 'Dikonfirmasi', 'shipped' => 'Dikirim', 'delivered' => 'Selesai', 'cancelled' => 'Dibatalkan'];
?>
<?php require_once 'header.php'; ?>

<!-- TOPBAR -->
<div class="admin-topbar">
    <h4><i class="fas fa-chart-line me-2" style="color:var(--primary);"></i> Dashboard</h4>
    <div class="admin-user">
        <div class="avatar"><i class="fas fa-user-circle fa-2x"></i></div>
        <span><?= e($_SESSION['username']) ?></span>
    </div>
</div>

<div class="admin-body">
    <!-- 4 Statistik Cards -->
    <div class="row g-4 mb-4">
        <div class="col-md-3 col-6">
            <div class="stat-card" style="background: white; border-radius: 24px; padding: 1.2rem; border: 1px solid #edf2f7;">
                <div class="stat-icon" style="font-size: 2rem; color: var(--primary);"><i class="fas fa-box-open"></i></div>
                <div class="stat-value fw-bold fs-2 mt-2"><?=$totalProducts?></div>
                <div class="stat-label text-muted small">Total Produk</div>
            </div>
        </div>
        <div class="col-md-3 col-6">
            <div class="stat-card" style="background: white; border-radius: 24px; padding: 1.2rem; border: 1px solid #edf2f7;">
                <div class="stat-icon" style="font-size: 2rem; color: var(--primary);"><i class="fas fa-shopping-cart"></i></div>
                <div class="stat-value fw-bold fs-2 mt-2"><?=$totalOrders?></div>
                <div class="stat-label text-muted small">Total Pesanan</div>
            </div>
        </div>
        <div class="col-md-3 col-6">
            <div class="stat-card" style="background: white; border-radius: 24px; padding: 1.2rem; border: 1px solid #edf2f7;">
                <div class="stat-icon" style="font-size: 2rem; color: #f59e0b;"><i class="fas fa-calendar-day"></i></div>
                <div class="stat-value fw-bold fs-2 mt-2"><?=rupiah($todayStats['revenue'])?></div>
                <div class="stat-label text-muted small">Penjualan Hari Ini</div>
                <div class="small text-muted"><?=$todayStats['orders']?> pesanan</div>
            </div>
        </div>
        <div class="col-md-3 col-6">
            <div class="stat-card" style="background: white; border-radius: 24px; padding: 1.2rem; border: 1px solid #edf2f7;">
                <div class="stat-icon" style="font-size: 2rem; color: #10b981;"><i class="fas fa-calendar-alt"></i></div>
                <div class="stat-value fw-bold fs-2 mt-2"><?=rupiah($monthStats['revenue'])?></div>
                <div class="stat-label text-muted small">Penjualan Bulan Ini</div>
                <div class="small text-muted"><?=$monthStats['orders']?> pesanan</div>
            </div>
        </div>
    </div>

    <!-- GRAFIK TREN PESANAN (Chart.js) -->
    <div class="card mb-4 border-0 shadow-sm" style="border-radius: 24px;">
        <div class="card-header bg-white border-0 pt-3">
            <h5 class="mb-0 fw-semibold"><i class="fas fa-chart-line me-2 text-primary"></i> Tren Pesanan (7 Hari Terakhir)</h5>
        </div>
        <div class="card-body">
            <canvas id="ordersChart" style="max-height: 300px; width: 100%;"></canvas>
        </div>
    </div>

    <!-- Dua Kolom: Pesanan Terbaru & Stok Menipis -->
    <div class="row g-4 mb-4">
        <div class="col-lg-7">
            <div class="card border-0 shadow-sm h-100" style="border-radius: 24px;">
                <div class="card-header bg-white border-0 d-flex justify-content-between align-items-center pt-3">
                    <span class="fw-semibold"><i class="fas fa-truck-fast me-2 text-primary"></i> Pesanan Terbaru</span>
                    <a href="orders.php" class="btn btn-sm btn-outline-primary rounded-pill">Lihat Semua</a>
                </div>
                <div class="card-body p-0">
                    <?php if(empty($recentOrders)): ?>
                        <div class="p-5 text-center text-muted">Belum ada pesanan</div>
                    <?php else: ?>
                        <div class="table-responsive">
                            <table class="table table-hover mb-0" style="font-size: 0.85rem;">
                                <thead class="bg-light">
                                    <tr><th>No. Pesanan</th><th>Pelanggan</th><th>Total</th><th>Status</th><th>Tanggal</th></tr>
                                </thead>
                                <tbody>
                                <?php foreach($recentOrders as $o): ?>
                                    <tr>
                                        <td><strong>#FLB-<?=str_pad($o['id'],5,'0',STR_PAD_LEFT)?></strong></td>
                                        <td><?=e($o['customer_name'] ?: $o['username'])?></td>
                                        <td><?=rupiah($o['total'])?></td>
                                        <td><span class="badge <?= $o['status']=='pending'?'bg-warning':($o['status']=='confirmed'?'bg-info':($o['status']=='shipped'?'bg-primary':'bg-success')) ?>"><?=$statusMap[$o['status']]?></span></td>
                                        <td class="text-muted"><?=date('d/m H:i', strtotime($o['created_at']))?></td>
                                    </tr>
                                <?php endforeach; ?>
                                </tbody>
                            </table>
                        </div>
                    <?php endif; ?>
                </div>
            </div>
        </div>
        <div class="col-lg-5">
            <div class="card border-0 shadow-sm h-100" style="border-radius: 24px;">
                <div class="card-header bg-white border-0 pt-3">
                    <h5 class="mb-0 fw-semibold"><i class="fas fa-exclamation-triangle me-2 text-warning"></i> Stok Menipis (≤5)</h5>
                </div>
                <div class="card-body">
                    <?php if(empty($lowStockProducts)): ?>
                        <div class="text-center py-4 text-muted"><i class="fas fa-check-circle text-success me-1"></i> Semua stok aman</div>
                    <?php else: ?>
                        <?php foreach($lowStockProducts as $p): ?>
                            <div class="d-flex justify-content-between align-items-center mb-1">
                                <div><strong><?=e($p['name'])?></strong> <span class="text-danger">(Stok: <?=$p['stock']?>)</span></div>
                                <a href="product_form.php?id=<?=$p['id']?>" class="btn btn-sm btn-outline-secondary rounded-pill">Edit</a>
                            </div>
                            <div class="progress mb-3" style="height: 6px;"><div class="progress-bar bg-danger" style="width: <?=min(100, ($p['stock']/10)*100)?>%"></div></div>
                        <?php endforeach; ?>
                        <div class="text-end"><a href="products.php" class="small">Kelola semua →</a></div>
                    <?php endif; ?>
                </div>
            </div>
        </div>
    </div>

    <!-- Aktivitas Terakhir -->
    <div class="card border-0 shadow-sm" style="border-radius: 24px;">
        <div class="card-header bg-white border-0 pt-3">
            <h5 class="mb-0 fw-semibold"><i class="fas fa-history me-2 text-primary"></i> Aktivitas Terakhir</h5>
        </div>
        <div class="card-body">
            <?php if(empty($activities)): ?>
                <div class="text-center py-4 text-muted">Belum ada ulasan atau pertanyaan</div>
            <?php else: ?>
                <div class="list-group list-group-flush">
                <?php foreach($activities as $act): ?>
                    <div class="list-group-item px-0">
                        <div class="d-flex">
                            <div class="me-3"><i class="fas <?=$act['icon']?> text-primary fa-fw"></i></div>
                            <div>
                                <div class="fw-semibold"><?=$act['title']?></div>
                                <div class="small text-muted"><?=$act['detail']?></div>
                                <small class="text-muted"><i class="far fa-clock me-1"></i><?=date('d M Y H:i', strtotime($act['time']))?></small>
                            </div>
                        </div>
                    </div>
                <?php endforeach; ?>
                </div>
            <?php endif; ?>
        </div>
    </div>
</div>

<script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"></script>
<script>
document.addEventListener('DOMContentLoaded', function() {
    const ctx = document.getElementById('ordersChart').getContext('2d');
    const dates = <?= json_encode(array_map(function($d) { return date('d/m', strtotime($d)); }, $dates)) ?>;
    const orders = <?= json_encode($ordersCount) ?>;
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: dates,
            datasets: [{
                label: 'Jumlah Pesanan',
                data: orders,
                backgroundColor: 'rgba(45, 90, 61, 0.7)',
                borderColor: 'var(--primary)',
                borderWidth: 2,
                borderRadius: 8,
                barPercentage: 0.65,
                categoryPercentage: 0.8,
                tension: 0.3
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: { position: 'top', labels: { font: { size: 12 } } },
                tooltip: { 
                    callbacks: {
                        label: function(context) {
                            return `Pesanan: ${context.raw}`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: { color: '#e9ecef' },
                    title: { display: true, text: 'Jumlah Pesanan', font: { weight: 'bold' } }
                },
                x: {
                    grid: { display: false },
                    title: { display: true, text: 'Tanggal', font: { weight: 'bold' } }
                }
            }
        }
    });
});
</script>

<?php require_once 'footer.php'; ?>