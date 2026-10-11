<?php
require_once '../config.php';
$edit_id = isset($_GET['id']) ? (int) $_GET['id'] : 0;
$p = null;
if ($edit_id) {
    $stmt = $db->prepare('SELECT * FROM products WHERE id = ?');
    $stmt->execute([$edit_id]);
    $p = $stmt->fetch();
    if (! $p) {
        redirect('products.php');
    }
}

$categories = ['Bunga Potong', 'Buket', 'Bunga Pot', 'Rangkaian'];
$emojis = ['🌹', '🤍', '🌻', '🌷', '💐', '🦋', '🌼', '👰', '🌸', '🫧', '🌺', '🎂', '🩷', '🪴', '🌵'];
?>
<?php require_once 'header.php'; ?>

<div class="admin-topbar">
    <h4><i class="fas fa-<?= ($p ? 'pen-to-square' : 'plus-circle')?>" me-2 style="color:var(--primary)"></i> <?= $p ? 'Edit' : 'Tambah'?> Produk</h4>
    <a href="products.php" class="btn-o btn-sm"><i class="fas fa-arrow-left me-1"></i> Kembali</a>
</div>

<div class="admin-body">
<div class="p-4 rounded" style="background:#fff;border:1px solid #e5e7eb;max-width:700px">
    <form method="post" action="../process.php" enctype="multipart/form-data">
    <input type="hidden" name="action" value="<?= $p ? 'edit_product' : 'add_product'?>">
    <?php if ($p) { ?><input type="hidden" name="id" value="<?= $p['id']?>"><?php } ?>
    
    <div class="row g-3">
        <div class="col-md-6"><div class="ff"><label>Nama Produk</label><input type="text" name="name" value="<?= e($p['name'] ?? '')?>" required></div></div>
        <div class="col-md-6"><div class="ff"><label>Kategori</label>
            <select name="category" required>
                <?php foreach ($categories as $c) { ?>
                <option value="<?= $c?>" <?= isset($p) && $p['category'] === $c ? 'selected' : ''?>><?= $c?></option>
                <?php } ?>
            </select>
        </div></div>
    </div>
    <div class="ff"><label>Deskripsi</label><textarea name="description" required rows="3"><?= e($p['description'] ?? '')?></textarea></div>
    
    <div class="row g-3">
        <div class="col-md-4"><div class="ff"><label>Harga (Rp)</label><input type="number" name="price" min="0" value="<?= e($p['price'] ?? '0')?>" required></div></div>
        <div class="col-md-4"><div class="ff"><label>Stok</label><input type="number" name="stock" min="0" value="<?= e($p['stock'] ?? '50')?>" required></div></div>
    </div>

    <div class="ff">
        <label>Upload Gambar (pilih file)</label>
        <input type="file" name="product_image" accept="image/jpeg,image/png,image/webp,image/gif" class="form-control">
        <small class="text-muted">Format: JPG, PNG, WEBP, GIF. Maks 2MB.</small>
    </div>
    <div class="ff">
        <label>URL Gambar (opsional, kosongkan jika sudah upload)</label>
        <input type="url" name="image_url" value="<?= e($p['image_url'] ?? '')?>" placeholder="https://...">
    </div>
    <div class="ff">
        <label>Ikon Fallback</label>
        <div class="d-flex flex-wrap gap-2 p-2 rounded" style="border:1.5px solid var(--border);background:var(--bg)">
            <?php foreach ($emojis as $em) { ?>
            <label style="cursor:pointer;font-size:1.5rem;padding:.3rem;border-radius:8px;transition:all .2s" class="emoji-opt">
                <input type="radio" name="image" value="<?= $em?>" <?= ! $p && $em === '🌹' ? 'checked' : (isset($p) && $p['image'] === $em ? 'checked' : '')?> style="display:none">
                <span><?= $em?></span>
            </label>
            <?php } ?>
        </div>
    </div>
    
    <!-- TOMBOL SIMPAN & PENUTUP FORM -->
    <button type="submit" class="btn-a mt-3"><i class="fas fa-save"></i> Simpan Produk</button>
</form>
</div>
</div>

<?php require_once 'footer.php'; ?>