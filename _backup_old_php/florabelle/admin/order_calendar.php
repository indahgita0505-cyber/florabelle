<?php require_once '../config.php'; ?>
<?php
$orders = $db->query("SELECT id, customer_name, delivery_date, total, status FROM orders WHERE delivery_date IS NOT NULL ORDER BY delivery_date ASC")->fetchAll();

$calendarData = [];
foreach($orders as $o) {
    $date = $o['delivery_date'];
    if(!isset($calendarData[$date])) $calendarData[$date] = [];
    $calendarData[$date][] = $o;
}
?>
<?php require_once 'header.php'; ?>

<div class="admin-topbar">
    <h4><i class="fas fa-calendar-alt me-2"></i> Kalender Pesanan (Pengiriman)</h4>
</div>

<div class="admin-body">
    <div class="card">
        <div class="card-header bg-white fw-semibold">📅 Jadwal Pengiriman Pesanan</div>
        <div class="card-body">
            <div class="row">
                <?php foreach($calendarData as $date => $ordersOnDate): ?>
                <div class="col-md-4 mb-3">
                    <div class="border rounded-3 p-3 h-100 bg-light">
                        <h5 class="text-primary"><?=date('d F Y', strtotime($date))?></h5>
                        <ul class="list-unstyled">
                            <?php foreach($ordersOnDate as $ord): ?>
                            <li><i class="fas fa-truck me-1"></i> #FLB-<?=str_pad($ord['id'],5,'0',STR_PAD_LEFT)?> - <?=e($ord['customer_name'])?> (<?=rupiah($ord['total'])?>) <span class="badge bg-secondary"><?=$ord['status']?></span></li>
                            <?php endforeach; ?>
                        </ul>
                    </div>
                </div>
                <?php endforeach; ?>
                <?php if(empty($calendarData)): ?>
                    <p class="text-muted">Belum ada pesanan dengan tanggal pengiriman yang diatur.</p>
                <?php endif; ?>
            </div>
        </div>
    </div>
</div>

<?php require_once 'footer.php'; ?>