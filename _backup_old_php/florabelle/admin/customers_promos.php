<?php require_once '../config.php'; ?>
<?php
// Ambil daftar pelanggan (user biasa, bukan admin)
$customers = $db->query("SELECT id, username, email, created_at FROM users WHERE role != 'admin' OR role IS NULL ORDER BY id DESC")->fetchAll();

// Ambil daftar promo
$promos = $db->query("SELECT * FROM promos ORDER BY id DESC")->fetchAll();
?>
<?php require_once 'header.php'; ?>

<div class="admin-topbar">
    <h4><i class="fas fa-users me-2" style="color:var(--primary)"></i> Pelanggan & Promo</h4>
</div>

<div class="admin-body">
    <!-- Tab Navigation -->
    <ul class="nav nav-tabs mb-4" id="myTab" role="tablist">
        <li class="nav-item" role="presentation">
            <button class="nav-link active" id="customers-tab" data-bs-toggle="tab" data-bs-target="#customers" type="button" role="tab">👥 Pelanggan</button>
        </li>
        <li class="nav-item" role="presentation">
            <button class="nav-link" id="promos-tab" data-bs-toggle="tab" data-bs-target="#promos" type="button" role="tab">🏷️ Promo / Kupon</button>
        </li>
    </ul>

    <div class="tab-content">
        <!-- TAB PELANGGAN -->
        <div class="tab-pane fade show active" id="customers" role="tabpanel">
            <div class="rounded" style="background:#fff;border:1px solid #e5e7eb;overflow-x:auto">
                <table class="tc">
                    <thead>
                        <tr><th>ID</th><th>Username</th><th>Email</th><th>Terdaftar</th><th>Total Pesanan</th><th>Total Belanja</th></tr>
                    </thead>
                    <tbody>
                    <?php foreach($customers as $c): 
                        // Ambil statistik pesanan per customer
                        $stmt = $db->prepare("SELECT COUNT(*) as total_order, COALESCE(SUM(total),0) as total_spent FROM orders WHERE user_id = ?");
                        $stmt->execute([$c['id']]);
                        $stats = $stmt->fetch();
                    ?>
                    <tr>
                        <td><?=$c['id']?></td>
                        <td><?=e($c['username'])?></td>
                        <td><?=e($c['email'])?></td>
                        <td style="font-size:.82rem"><?=date('d M Y', strtotime($c['created_at']))?></td>
                        <td><?=$stats['total_order']?></td>
                        <td><?=rupiah($stats['total_spent'])?></td>
                    </tr>
                    <?php endforeach; ?>
                    <?php if(empty($customers)): ?>
                    <tr><td colspan="6" class="text-center">Belum ada pelanggan</td></tr>
                    <?php endif; ?>
                    </tbody>
                </table>
            </div>
        </div>

        <!-- TAB PROMO -->
        <div class="tab-pane fade" id="promos" role="tabpanel">
            <div class="d-flex justify-content-end mb-3">
                <button class="btn-a btn-sm" data-bs-toggle="modal" data-bs-target="#addPromoModal"><i class="fas fa-plus"></i> Tambah Kupon</button>
            </div>
            <div class="rounded" style="background:#fff;border:1px solid #e5e7eb;overflow-x:auto">
                <table class="tc">
                    <thead>
                        <tr><th>Kode</th><th>Diskon</th><th>Min. Belanja</th><th>Berlaku</th><th>Terpakai / Limit</th><th>Status</th><th>Aksi</th></tr>
                    </thead>
                    <tbody>
                    <?php foreach($promos as $p): 
                        $expired = (strtotime($p['valid_until']) < time());
                        $active = ($p['active'] && !$expired);
                    ?>
                    <tr>
                        <td><strong><?=e($p['code'])?></strong></td>
                        <td><?= $p['discount_type']=='percent' ? $p['discount_value'].'%' : rupiah($p['discount_value']) ?></td>
                        <td><?= $p['min_purchase'] > 0 ? rupiah($p['min_purchase']) : 'Tanpa minimal' ?></td>
                        <td style="font-size:.75rem">
                            <?=date('d/m/Y', strtotime($p['valid_from']))?> - <?=date('d/m/Y', strtotime($p['valid_until']))?>
                        </td>
                        <td><?=$p['used_count']?> / <?=$p['usage_limit'] ?? '∞'?></td>
                        <td>
                            <?php if($expired): ?>
                                <span class="stb st-cancelled">Kadaluarsa</span>
                            <?php elseif($p['active']): ?>
                                <span class="stb st-confirmed">Aktif</span>
                            <?php else: ?>
                                <span class="stb st-pending">Nonaktif</span>
                            <?php endif; ?>
                        </td>
                        <td>
                            <div class="d-flex gap-1">
                                <button class="btn btn-sm btn-o" onclick="editPromo(<?=$p['id']?>,'<?=e($p['code'])?>','<?=$p['discount_type']?>','<?=$p['discount_value']?>','<?=$p['min_purchase']?>','<?=date('Y-m-d\TH:i',strtotime($p['valid_from']))?>','<?=date('Y-m-d\TH:i',strtotime($p['valid_until']))?>','<?=$p['usage_limit']?>','<?=$p['active']?>')"><i class="fas fa-edit"></i></button>
                                <a href="../process.php?action=delete_promo&id=<?=$p['id']?>" class="btn btn-sm btn-d" onclick="return confirm('Hapus kupon ini?')"><i class="fas fa-trash"></i></a>
                            </div>
                        </td>
                    </tr>
                    <?php endforeach; ?>
                    <?php if(empty($promos)): ?>
                    <tr><td colspan="7" class="text-center">Belum ada promo</td></tr>
                    <?php endif; ?>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</div>

<!-- MODAL TAMBAH PROMO -->
<div class="modal fade" id="addPromoModal" tabindex="-1">
    <div class="modal-dialog">
        <div class="modal-content">
            <form method="post" action="../process.php">
                <input type="hidden" name="action" value="add_promo">
                <div class="modal-header">
                    <h5 class="modal-title">Tambah Kupon Baru</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <div class="ff mb-2"><label>Kode Kupon</label><input type="text" name="code" required placeholder="contoh: FLORA10"></div>
                    <div class="row g-2 mb-2">
                        <div class="col-6"><label>Tipe Diskon</label><select name="discount_type" class="form-select"><option value="percent">Persen (%)</option><option value="fixed">Nominal (Rp)</option></select></div>
                        <div class="col-6"><label>Nilai Diskon</label><input type="number" name="discount_value" step="0.01" required></div>
                    </div>
                    <div class="row g-2 mb-2">
                        <div class="col-6"><label>Mulai Berlaku</label><input type="datetime-local" name="valid_from" required></div>
                        <div class="col-6"><label>Sampai</label><input type="datetime-local" name="valid_until" required></div>
                    </div>
                    <div class="row g-2 mb-2">
                        <div class="col-6"><label>Minimal Belanja (Rp)</label><input type="number" name="min_purchase" value="0" step="1000"></div>
                        <div class="col-6"><label>Batas Penggunaan</label><input type="number" name="usage_limit" placeholder="Kosongkan = tidak terbatas"></div>
                    </div>
                    <div class="form-check"><input class="form-check-input" type="checkbox" name="active" value="1" checked> <label class="form-check-label">Aktif</label></div>
                </div>
                <div class="modal-footer"><button type="submit" class="btn-a">Simpan</button></div>
            </form>
        </div>
    </div>
</div>

<!-- MODAL EDIT PROMO -->
<div class="modal fade" id="editPromoModal" tabindex="-1">
    <div class="modal-dialog">
        <div class="modal-content">
            <form method="post" action="../process.php">
                <input type="hidden" name="action" value="edit_promo">
                <input type="hidden" name="id" id="edit_id">
                <div class="modal-header"><h5 class="modal-title">Edit Kupon</h5><button type="button" class="btn-close" data-bs-dismiss="modal"></button></div>
                <div class="modal-body">
                    <div class="ff mb-2"><label>Kode Kupon</label><input type="text" name="code" id="edit_code" required></div>
                    <div class="row g-2 mb-2">
                        <div class="col-6"><label>Tipe</label><select name="discount_type" id="edit_discount_type" class="form-select"><option value="percent">Persen (%)</option><option value="fixed">Nominal (Rp)</option></select></div>
                        <div class="col-6"><label>Nilai</label><input type="number" name="discount_value" id="edit_discount_value" step="0.01" required></div>
                    </div>
                    <div class="row g-2 mb-2">
                        <div class="col-6"><label>Mulai</label><input type="datetime-local" name="valid_from" id="edit_valid_from" required></div>
                        <div class="col-6"><label>Sampai</label><input type="datetime-local" name="valid_until" id="edit_valid_until" required></div>
                    </div>
                    <div class="row g-2 mb-2">
                        <div class="col-6"><label>Min Belanja</label><input type="number" name="min_purchase" id="edit_min_purchase" step="1000"></div>
                        <div class="col-6"><label>Batas Penggunaan</label><input type="number" name="usage_limit" id="edit_usage_limit" placeholder="Kosongkan = tidak terbatas"></div>
                    </div>
                    <div class="form-check"><input class="form-check-input" type="checkbox" name="active" value="1" id="edit_active"> <label class="form-check-label">Aktif</label></div>
                </div>
                <div class="modal-footer"><button type="submit" class="btn-a">Update</button></div>
            </form>
        </div>
    </div>
</div>

<script>
function editPromo(id, code, type, value, min_purchase, valid_from, valid_until, usage_limit, active) {
    document.getElementById('edit_id').value = id;
    document.getElementById('edit_code').value = code;
    document.getElementById('edit_discount_type').value = type;
    document.getElementById('edit_discount_value').value = value;
    document.getElementById('edit_min_purchase').value = min_purchase;
    document.getElementById('edit_valid_from').value = valid_from;
    document.getElementById('edit_valid_until').value = valid_until;
    document.getElementById('edit_usage_limit').value = usage_limit == 'null' ? '' : usage_limit;
    document.getElementById('edit_active').checked = (active == '1');
    new bootstrap.Modal(document.getElementById('editPromoModal')).show();
}
</script>

<?php require_once 'footer.php'; ?>