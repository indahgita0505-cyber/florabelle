<?php require_once '../config.php'; ?>
<?php $products = $db->query("SELECT * FROM products ORDER BY id DESC")->fetchAll(); ?>
<?php require_once 'header.php'; ?>

<div class="admin-topbar">
    <h4><i class="fas fa-box-open me-2" style="color:var(--primary)"></i> Kelola Produk</h4>
    <a href="product_form.php" class="btn-a btn-sm"><i class="fas fa-plus"></i> Tambah Produk</a>
</div>

<div class="admin-body">
    <div class="rounded overflow-hidden" style="background:#fff;border:1px solid #e5e7eb;overflow-x:auto">
        <table class="tc">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Produk</th>
                    <th>Kategori</th>
                    <th>Harga</th>
                    <th>Stok</th>
                    <th>Aksi</th>
                </tr>
            </thead>
            <tbody>
            <?php foreach($products as $p): 
                // Cek apakah ada file gambar yang benar-benar ada
                $hasImage = false;
                $imagePath = '';
                if (!empty($p['image_url'])) {
                    $fullPath = '../' . $p['image_url'];
                    if (file_exists($fullPath)) {
                        $hasImage = true;
                        $imagePath = '../' . e($p['image_url']);
                    }
                }
            ?>
            <tr>
                <td><?=$p['id']?></td>
                <td>
                    <div class="d-flex align-items-center gap-2">
                        <?php if($hasImage): ?>
                        <div style="width:45px;height:45px;border-radius:8px;overflow:hidden;flex-shrink:0">
                            <img src="<?=$imagePath?>" style="width:100%;height:100%;object-fit:cover" 
                                 onerror="this.parentElement.innerHTML='<?=addslashes($p['image'])?>'">
                        </div>
                        <?php else: ?>
                        <div style="width:45px;height:45px;border-radius:8px;background:<?=cardGradient($p['category'])?>;display:flex;align-items:center;justify-content:center;font-size:1.4rem;flex-shrink:0"><?=$p['image']?></div>
                        <?php endif; ?>
                        <div><div style="font-weight:600;font-size:.86rem"><?=e($p['name'])?></div></div>
                    </div>
                </td>
                <td style="font-size:.82rem"><?=e($p['category'])?></td>
                <td><strong><?=rupiah($p['price'])?></strong></td>
                <td><span style="font-weight:600;<?=$p['stock']<10?'color:#dc3545':''?>"><?=$p['stock']?></span></td>
                <td>
                    <div class="d-flex gap-1">
                        <a href="product_form.php?id=<?=$p['id']?>" class="btn btn-sm btn-o" style="padding:.2rem .6rem"><i class="fas fa-edit"></i></a>
                        <a href="../process.php?action=delete_product&id=<?=$p['id']?>" class="btn btn-sm btn-d" onclick="return confirm('Hapus produk ini?')"><i class="fas fa-trash"></i></a>
                    </div>
                </td>
            </tr>
            <?php endforeach; ?>
            </tbody>
        </table>
    </div>
</div>

<?php require_once 'footer.php'; ?>