<?php require_once 'config.php';
if (! isLoggedIn()) {
    redirect('login.php');
}

$product_id = (int) ($_GET['product_id'] ?? 0);
if (! $product_id) {
    redirect('home.php');
}

$stmt = $db->prepare('SELECT * FROM products WHERE id = ?');
$stmt->execute([$product_id]);
$product = $stmt->fetch();
if (! $product || $product['stock'] < 1) {
    redirect('home.php');
}

$ewallet_accounts = [
    'gopay' => '085712345678 (Gopay)',
    'ovo' => '087712345678 (OVO)',
    'dana' => '081234567890 (DANA)',
];
?>
<?php require_once 'header.php'; ?>
<section class="sec-p">
    <div class="container" style="max-width:600px">
        <div class="d-flex justify-content-between align-items-center mb-3">
            <h2 class="sec-t mb-0">Detail Pembayaran</h2>
            <a href="home.php" class="btn btn-outline-secondary"><i class="fas fa-arrow-left"></i> Kembali</a>
        </div>
        <div class="card mb-3">
            <div class="card-body">
                <h5><?= e($product['name']) ?></h5>
                <p class="text-muted"><?= e($product['description']) ?></p>
                <div class="fw-bold"><?= rupiah($product['price']) ?></div>
            </div>
        </div>
        <form method="post" action="process.php">
            <input type="hidden" name="action" value="process_buy_now">
            <input type="hidden" name="product_id" value="<?= $product_id ?>">
            <div class="mb-3">
                <label>Nama Lengkap</label>
                <input type="text" name="customer_name" class="form-control" required>
            </div>
            <div class="mb-3">
                <label>No. Telepon</label>
                <input type="text" name="customer_phone" class="form-control" required>
            </div>
            <div class="mb-3">
                <label>Alamat Lengkap</label>
                <textarea name="customer_address" class="form-control" rows="3" required></textarea>
            </div>
            <div class="mb-3">
                <label>Metode Pembayaran</label>
                <select name="payment_method" id="paymentMethod" class="form-select" required>
                    <option value="cash">💵 Tunai / Transfer Bank</option>
                    <option value="cod">🚚 Bayar di Tempat (COD)</option>
                    <option value="ewallet">📱 E-Wallet (Gopay, OVO, Dana)</option>
                </select>
            </div>
            <div class="mb-3" id="ewalletDetails" style="display:none;">
                <label>Pilih E-Wallet & Transfer ke:</label>
                <select name="ewallet_type" class="form-select">
                    <option value="gopay">Gopay - 085712345678</option>
                    <option value="ovo">OVO - 087712345678</option>
                    <option value="dana">DANA - 081234567890</option>
                </select>
                <small class="text-muted">Silakan transfer ke nomor di atas sesuai pilihan Anda. Pesanan akan diproses setelah pembayaran dikonfirmasi.</small>
            </div>
            <div class="mb-3">
                <label>Catatan (opsional)</label>
                <textarea name="notes" class="form-control" rows="2"></textarea>
            </div>
            <div class="d-flex gap-2">
                <button type="submit" class="btn-a flex-grow-1">Bayar Sekarang</button>
                <a href="home.php" class="btn btn-outline-secondary">Batal</a>
            </div>
        </form>
    </div>
</section>
<script>
document.getElementById('paymentMethod').addEventListener('change', function() {
    document.getElementById('ewalletDetails').style.display = this.value === 'ewallet' ? 'block' : 'none';
});
</script>
<?php require_once 'footer.php'; ?>