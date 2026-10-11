<?php
require_once '../config.php';         // Ambil config dari folder atas
require_once 'OrderManager.php';      // Ambil class dari folder admin
require_once 'header.php';            // Header admin

$orderManager = new OrderManager($db);
$orders = $orderManager->getAllOrders();
$status_opts = $orderManager->getStatusOptions();
?>

<div class="admin-topbar">
    <h4><i class="fas fa-file-invoice-dollar me-2" style="color:var(--primary)"></i> Pesanan Masuk</h4>
    <span style="font-size:.88rem;color:var(--muted)"><?= count($orders)?> pesanan</span>
</div>

<div class="admin-body">
    <?php if (empty($orders)) { ?>
    <div class="p-5 text-center rounded" style="background:#fff;border:1px solid #e5e7eb;color:var(--muted)">
        <i class="fas fa-inbox" style="font-size:3rem;opacity:.3;display:block;margin-bottom:1rem"></i>
        <h5 style="color:var(--fg)">Belum ada pesanan</h5>
    </div>
    <?php } else { ?>
    <div class="rounded overflow-hidden" style="background:#fff;border:1px solid #e5e7eb;overflow-x:auto">
        <table class="tc">
            <thead><tr><th>No. Pesanan</th><th>Customer</th><th>Tanggal</th><th>Total</th><th>Bayar</th><th>Status</th><th>Aksi</th></tr></thead>
            <tbody>
            <?php foreach ($orders as $o) {
                $ois = $orderManager->getOrderItems($o['id']);
                ?>
            <tr>
                <td><strong><?= $orderManager->formatOrderNumber($o['id'])?></strong></td>
                <td><?= e($o['customer_name'] ?: $o['username'])?></td>
                <td style="font-size:.82rem;color:var(--muted)"><?= date('d M Y H:i', strtotime($o['created_at']))?></td>
                <td><strong><?= rupiah($o['total'])?></strong></td>
                <td class="text-capitalize" style="font-size:.8rem"><?= $o['payment_method']?></td>
                <td><span class="stb st-<?= $o['status']?>"><?= $orderManager->getStatusLabel($o['status'])?></span></td>
                <td>
                    <div class="d-flex gap-1 align-items-center">
                        <form method="post" action="../process.php" class="d-flex gap-1 align-items-center">
                            <input type="hidden" name="action" value="update_order_status">
                            <input type="hidden" name="order_id" value="<?= $o['id']?>">
                            <select name="status" class="form-select form-select-sm" style="font-size:.78rem;width:auto;padding:.2rem .5rem;border-radius:6px">
                                <?php foreach ($status_opts as $so) { ?>
                                <option value="<?= $so?>" <?= $o['status'] === $so ? 'selected' : ''?>><?= $orderManager->getStatusLabel($so)?></option>
                                <?php } ?>
                            </select>
                            <button type="submit" class="btn btn-sm btn-p" style="padding:.2rem .5rem"><i class="fas fa-check"></i></button>
                        </form>
                        <button class="btn btn-sm btn-o" style="padding:.2rem .6rem" onclick="tD(<?= $o['id']?>)"><i class="fas fa-eye"></i></button>
                    </div>
                </td>
            </tr>
            <tr id="d-<?= $o['id']?>" style="display:none"><td colspan="7" style="background:#f9fafb">
                <div class="p-3">
                    <?php foreach ($ois as $oi) { ?>
                    <div class="d-flex justify-content-between mb-1" style="font-size:.83rem"><span><?= e($oi['product_name'])?> x<?= $oi['quantity']?></span><span><?= rupiah($oi['price'] * $oi['quantity'])?></span></div>
                    <?php } ?>
                    <?php if ($o['customer_phone']) { ?><div style="font-size:.8rem;color:var(--muted);margin-top:.4rem"><i class="fas fa-phone me-1"></i><?= e($o['customer_phone'])?></div><?php } ?>
                    <?php if ($o['customer_address']) { ?><div style="font-size:.8rem;color:var(--muted)"><i class="fas fa-map-marker-alt me-1"></i><?= e($o['customer_address'])?></div><?php } ?>
                </div>
            </td></tr>
            <?php } ?>
            </tbody>
        </table>
    </div>
    <?php } ?>
</div>

<?php require_once 'footer.php'; ?>