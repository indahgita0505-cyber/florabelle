<?php require_once 'config.php';

// CEK: Kalau yang login penjual, sembunyikan tombol beli
$is_admin_viewing = isAdmin();

$search = isset($_GET['search']) ? $_GET['search'] : '';
$cat = isset($_GET['category']) ? $_GET['category'] : '';
$where = '1=1';
$params = [];
if ($search) {
    $where .= ' AND (name LIKE ? OR description LIKE ?)';
    $params[] = "%$search%";
    $params[] = "%$search%";
}
if ($cat) {
    $where .= ' AND category = ?';
    $params[] = $cat;
}
$stmt = $db->prepare("SELECT * FROM products WHERE $where ORDER BY id DESC");
$stmt->execute($params);
$products = $stmt->fetchAll();
$cats = $db->query('SELECT DISTINCT category FROM products ORDER BY category')->fetchAll(PDO::FETCH_COLUMN);
?>
<?php require_once 'header.php'; ?>

<section class="hero-s">
    <div class="hero-p"><?php for ($i = 0; $i < 12; $i++) { ?><div class="petal" style="left:<?= rand(5, 95)?>%;animation-duration:<?= rand(8, 18)?>s;animation-delay:<?= rand(0, 10)?>s;background:<?= ['#f8bbd0', '#c8e6c9', '#ffe0b2', '#b2dfdb', '#f3e5f5', '#fff9c4'][rand(0, 5)]?>;width:<?= rand(12, 25)?>px;height:<?= rand(12, 25)?>px"></div><?php } ?></div>
    <div class="container"><div class="row align-items-center">
        <div class="col-lg-7">
            <div class="hero-badge"><i class="fas fa-leaf"></i> Bunga Segar Setiap Hari</div>
            <h1 class="hero-t">Keindahan Bunga untuk Setiap <em>Momen</em></h1>
            <p class="hero-sub">Rangkaian bunga premium dipilih langsung dari kebun terbaik.</p>
            <div class="d-flex flex-wrap gap-3">
                <a href="#products" class="btn-a"><i class="fas fa-store"></i> Jelajahi Koleksi</a>
                <?php if (! $is_admin_viewing) { ?>
                <a href="cart.php" class="btn-o"><i class="fas fa-shopping-bag"></i> Keranjang</a>
                <?php } ?>
            </div>
            <div class="hero-stats">
                <div><div class="hs-n">500+</div><div class="hs-l">Pelanggan</div></div>
                <div><div class="hs-n">50+</div><div class="hs-l">Jenis Bunga</div></div>
                <div><div class="hs-n">4.9</div><div class="hs-l">Rating</div></div>
            </div>
        </div>
        <div class="col-lg-5 d-flex justify-content-center"><div class="hero-img"><img src="https://images.unsplash.com/photo-1487530811176-3780de880c2d?w=500&h=500&fit=crop" alt="Bunga"></div></div>
    </div></div>
</section>

<section class="sec-p" style="background:var(--card)">
    <div class="container"><div class="row g-4">
        <div class="col-md-3 col-6 fu"><div class="fc"><div class="fi"><i class="fas fa-truck-fast"></i></div><h5 style="font-size:.95rem">Pengiriman Cepat</h5><p style="font-size:.82rem;color:var(--muted);margin:0">2-4 jam Jabodetabek</p></div></div>
        <div class="col-md-3 col-6 fu"><div class="fc"><div class="fi"><i class="fas fa-leaf"></i></div><h5 style="font-size:.95rem">100% Segar</h5><p style="font-size:.82rem;color:var(--muted);margin:0">Dari kebun pilihan</p></div></div>
        <div class="col-md-3 col-6 fu"><div class="fc"><div class="fi"><i class="fas fa-palette"></i></div><h5 style="font-size:.95rem">Kustomisasi</h5><p style="font-size:.82rem;color:var(--muted);margin:0">Sesuai selera</p></div></div>
        <div class="col-md-3 col-6 fu"><div class="fc"><div class="fi"><i class="fas fa-shield-heart"></i></div><h5 style="font-size:.95rem">Garansi Fresh</h5><p style="font-size:.82rem;color:var(--muted);margin:0">Uang kembali</p></div></div>
    </div></div>
</section>

<section class="sec-p" id="products">
    <div class="container">
        <div class="text-center"><div class="sec-l mx-auto"></div><h2 class="sec-t">Koleksi Bunga Kami</h2><p class="sec-s">Temukan bunga terbaik untuk setiap kesempatan</p></div>
        
        <div class="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-3">
            <div class="sb flex-grow-1"><i class="fas fa-search"></i><form method="get" class="d-flex"><input type="text" name="search" placeholder="Cari bunga..." value="<?= e($search)?>" class="border-0 border-end" style="border-radius:var(--radius-sm) 0 0 var(--radius-sm)"><button type="submit" class="btn-p btn-sm" style="border-radius:0 var(--radius-sm) var(--radius-sm) 0"><i class="fas fa-search"></i></button></form></div>
        </div>
        
        <div class="fb">
            <a href="home.php<?= $search ? '&search='.$search : ''?>" class="fbtn <?= ! $cat ? 'active' : ''?>">Semua</a>
            <?php foreach ($cats as $c) { ?>
            <a href="home.php?category=<?= urlencode($c)?><?= $search ? '&search='.$search : ''?>" class="fbtn <?= $cat === $c ? 'active' : ''?>"><?= e($c)?></a>
            <?php } ?>
        </div>

        <?php if (empty($products)) { ?>
        <div class="es"><i class="fas fa-search"></i><h4>Tidak ditemukan</h4></div>
        <?php } else { ?>
        <div class="row g-4">
        <?php foreach ($products as $p) { ?>
            <div class="col-lg-3 col-md-4 col-sm-6 fu">
                <div class="pc h-100 d-flex flex-column">
                    <div class="pc-img">
                        <?php if (! empty($p['image_url'])) { ?>
                        <img src="<?= e($p['image_url'])?>" alt="<?= e($p['name'])?>" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">
                        <?php } ?>
                        <div class="ef" style="<?= ! empty($p['image_url']) ? 'display:none' : ''?>;background:<?= cardGradient($p['category'])?>"><?= $p['image']?></div>
                        <span class="cb"><?= e($p['category'])?></span>
                    </div>
                    <div class="pc-body d-flex flex-column flex-grow-1">
                        <div class="pc-name" title="<?= e($p['name'])?>"><?= e($p['name'])?></div>
                        <div class="pc-desc"><?= e($p['description'])?></div>
                        <div class="pc-stock mb-2"><i class="fas fa-cubes"></i> Stok: <?= $p['stock']?></div>
                        <div class="d-flex align-items-center justify-content-between mt-auto gap-1">
                            <div class="pc-price"><?= rupiah($p['price'])?></div>
                            <?php if ($p['stock'] > 0 && ! $is_admin_viewing) { ?>
                            <div class="d-flex gap-1">
                                <form method="post" action="process.php">
                                    <input type="hidden" name="action" value="add_to_cart">
                                    <input type="hidden" name="product_id" value="<?= $p['id']?>">
                                    <input type="hidden" name="quantity" value="1">
                                    <input type="hidden" name="redirect" value="home.php<?= ($cat ? '?category='.$cat : '').($search ? '&search='.$search : '')?>">
                                    <button type="submit" class="btn-ac" title="Tambah ke keranjang"><i class="fas fa-plus"></i></button>
                                </form>
                                
                                    <!-- KODE YANG SUDAH BENAR UNTUK TOMBOL BELI -->
                                <form method="post" action="process.php" style="display:inline;">
                                    <input type="hidden" name="action" value="buy_now">
                                    <input type="hidden" name="product_id" value="<?= $p['id'] ?>">
                                    <button type="submit" class="btn-bn"><i class="fas fa-bolt"></i> BELI</button>
                                </form>
                            </div>
                            <?php } else { ?>
                            <span style="font-size:.72rem;color:<?= ($p['stock'] > 0) ? 'var(--muted)' : '#dc3545'?>;font-weight:600"><?= ($p['stock'] > 0) ? 'Mode Tampilan' : 'HABIS'?></span>
                            <?php } ?>
                        </div>
                    </div>
                </div>
            </div>
        <?php } ?>
        </div>
        <?php } ?>
    </div>
</section>

<?php require_once 'footer.php'; ?>>Lainnya<