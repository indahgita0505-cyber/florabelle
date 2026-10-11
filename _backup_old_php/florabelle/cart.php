<?php
require_once 'config.php';
if (! isLoggedIn()) {
    redirect('login.php');
}

$stmt = $db->prepare('SELECT c.id as cart_id, c.quantity, p.* FROM cart c JOIN products p ON c.product_id = p.id WHERE c.user_id = ?');
$stmt->execute([$_SESSION['user_id']]);
$items = $stmt->fetchAll();
?>
<?php require_once 'header.php'; ?>

<section class="sec-p">
    <div class="container">
        <h2 class="sec-t">Keranjang Belanja</h2>
        <?php if (empty($items)) { ?>
            <div class="alert alert-info">Keranjang kosong.</div>
        <?php } else { ?>
            <form method="post" action="checkout_cart.php" id="cartForm">
                <div class="table-responsive">
                    <table class="table table-bordered align-middle">
                        <thead>
                            <tr>
                                <th width="5%"><input type="checkbox" id="selectAll"> Pilih</th>
                                <th>Produk</th>
                                <th>Harga</th>
                                <th>Jumlah</th>
                                <th>Subtotal</th>
                                <th>Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php foreach ($items as $item) { ?>
                            <tr>
                                <td><input type="checkbox" name="selected[]" value="<?= $item['cart_id']?>" class="item-checkbox"></td>
                                <td>
                                    <div class="d-flex gap-2 align-items-center">
                                        <?php if (! empty($item['image_url'])) { ?>
                                            <img src="<?= e($item['image_url'])?>" width="60" height="60" style="object-fit:cover; border-radius:8px">
                                        <?php } else { ?>
                                            <div style="width:60px;height:60px;background:#eee;display:flex;align-items:center;justify-content:center;border-radius:8px"><?= $item['image']?></div>
                                        <?php } ?>
                                        <strong><?= e($item['name'])?></strong>
                                    </div>
                                 </td>
                                <td><?= rupiah($item['price'])?></td>
                                <td>
                                    <div class="d-flex gap-1">
                                        <form method="post" action="process.php" class="d-inline">
                                            <input type="hidden" name="action" value="update_cart">
                                            <input type="hidden" name="cart_id" value="<?= $item['cart_id']?>">
                                            <input type="number" name="quantity" value="<?= $item['quantity']?>" min="1" max="<?= $item['stock']?>" style="width:70px" class="form-control form-control-sm">
                                            <button type="submit" class="btn btn-sm btn-secondary mt-1">Update</button>
                                        </form>
                                    </div>
                                 </td>
                                <td class="subtotal"><?= rupiah($item['price'] * $item['quantity'])?></td>
                                <td>
                                    <a href="process.php?action=remove_cart&id=<?= $item['cart_id']?>" class="btn btn-sm btn-danger" onclick="return confirm('Hapus item ini?')">Hapus</a>
                                 </td>
                             </tr>
                            <?php } ?>
                        </tbody>
                        <tfoot>
                            <tr>
                                <td colspan="5" class="text-end fw-bold">Total (item terpilih):</td>
                                <td class="fw-bold text-primary" id="totalSelected">Rp 0</td>
                             </tr>
                        </tfoot>
                     </table>
                </div>
                <div class="d-flex justify-content-between mt-3">
                    <a href="home.php" class="btn btn-outline-secondary">Lanjut Belanja</a>
                    <button type="submit" class="btn btn-primary" id="checkoutBtn" disabled>Checkout (Item Terpilih)</button>
                </div>
            </form>
        <?php } ?>
    </div>
</section>

<script>
    const selectAll = document.getElementById('selectAll');
    const checkboxes = document.querySelectorAll('.item-checkbox');
    const checkoutBtn = document.getElementById('checkoutBtn');
    const totalSpan = document.getElementById('totalSelected');

    function updateTotal() {
        let total = 0;
        let anyChecked = false;
        const rows = document.querySelectorAll('tbody tr');
        rows.forEach((row, idx) => {
            const cb = checkboxes[idx];
            if (cb && cb.checked) {
                anyChecked = true;
                const subtotalText = row.querySelector('.subtotal').innerText;
                const subtotal = parseInt(subtotalText.replace(/[^0-9]/g, ''));
                total += subtotal;
            }
        });
        totalSpan.innerText = 'Rp ' + total.toLocaleString('id-ID');
        checkoutBtn.disabled = !anyChecked;
    }

    selectAll.addEventListener('change', function() {
        checkboxes.forEach(cb => cb.checked = selectAll.checked);
        updateTotal();
    });
    checkboxes.forEach(cb => cb.addEventListener('change', updateTotal));
    updateTotal();
</script>

<?php require_once 'footer.php'; ?>