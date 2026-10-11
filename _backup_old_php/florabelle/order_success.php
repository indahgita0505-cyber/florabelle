<?php require_once 'config.php';
if (! isLoggedIn()) {
    redirect('login.php');
}
$oid = (int) ($_GET['oid'] ?? 0);
$stmt = $db->prepare('SELECT * FROM orders WHERE id=? AND user_id=?');
$stmt->execute([$oid, $_SESSION['user_id']]);
$order = $stmt->fetch();
$stmt = $db->prepare('SELECT * FROM order_items WHERE order_id=?');
$stmt->execute([$oid]);
$ois = $stmt->fetchAll();
?>
<?php require_once 'header.php'; ?>
<section class="sec-p"><div class="container text-center" style="max-width:600px">
    <div class="si"><i class="fas fa-check"></i></div>
    <h2 class="sec-t">Pesanan Berhasil!</h2><p class="sec-s">Terima kasih telah berbelanja</p>
    <?php if ($order) { ?>
    <div class="p-4 rounded text-start mb-3" style="background:var(--card);border:1px solid var(--border)">
        <div class="row mb-2"><div class="col-4" style="font-size:.83rem;color:var(--muted)">No. Pesanan</div><div class="col-8" style="font-weight:700">#FLB-<?= str_pad($order['id'], 5, '0', '0')?></div></div>
        <div class="row mb-2"><div class="col-4" style="font-size:.83rem;color:var(--muted)">Tanggal</div><div class="col-8"><?= date('d M Y H:i', strtotime($order['created_at']))?></div></div>
        <div class="row mb-2"><div class="col-4" style="font-size:.83rem;color:var(--muted)">Pembayaran</div><div class="col-8 text-capitalize"><?= $order['payment_method']?></div></div>
        <div class="row"><div class="col-4" style="font-size:.83rem;color:var(--muted)">Total</div><div class="col-8" style="font-weight:900;font-size:1.1rem;color:var(--primary-dark)"><?= rupiah($order['total'])?></div></div>
    </div>
    <?php foreach ($ois as $oi) { ?>
    <div class="d-flex justify-content-between p-3 rounded mb-2" style="background:var(--card);border:1px solid var(--border);font-size:.88rem"><span><?= e($oi['product_name'])?> (x<?= $oi['quantity']?>)</span><strong><?= rupiah($oi['price'] * $oi['quantity'])?></strong></div>
    <?php } ?>
    <?php } ?>
    <div class="d-flex gap-3 justify-content-center mt-4"><a href="orders.php" class="btn-o"><i class="fas fa-list"></i> Pesanan</a><a href="home.php" class="btn-a"><i class="fas fa-store"></i> Belanja Lagi</a></div>
    </div></section>
    <?php if (strpos($order['payment_method'], 'E-Wallet') !== false) { ?>
        <div class="alert alert-info mt-3">
            <strong>Instruksi Pembayaran:</strong> Transfer sejumlah <strong><?= rupiah($order['total'])?></strong> ke nomor E-Wallet penjual sesuai pilihan Anda. Setelah transfer, konfirmasi ke admin via WhatsApp atau menu konfirmasi (jika ada).
        </div>
<?php } ?>
<?php require_once 'footer.php'; ?>