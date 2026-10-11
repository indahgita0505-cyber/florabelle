<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Flora Belle - Toko Bunga Premium</title>
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
<link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400&family=DM+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="style.css">
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
<script src="script.js"></script>
</head>
<body>
<div class="toast-c"><?php if($toast): ?><div class="toast-m <?=$toast['type']?>"><i class="fas fa-<?= $toast['type']==='success'?'check-circle':'exclamation-triangle' ?>"></i> <?=e($toast['msg'])?></div><?php endif; ?></div>
<nav class="navbar-c">
<div class="container">
    <div class="d-flex align-items-center justify-content-between">
        <a href="home.php" class="nav-brand"><i class="fas fa-seedling"></i> Flora<span>Belle</span></a>
        <!-- MENU PENJUAL (ADMIN) -->
        <?php if(isAdmin()): ?>
        <div class="d-none d-md-flex align-items-center gap-1">
            <a href="admin/index.php" class="nav-l"><i class="fas fa-chart-line me-1"></i>Dashboard</a>
            <a href="admin/products.php" class="nav-l"><i class="fas fa-box me-1"></i>Produk</a>
            <a href="admin/orders.php" class="nav-l"><i class="fas fa-receipt me-1"></i>Pesanan</a>
        </div>
        <!-- MENU PEMBELI (CUSTOMER) -->
        <?php else: ?>
        <div class="d-none d-md-flex align-items-center gap-1">
            <a href="home.php" class="nav-l">Beranda</a>
            <a href="home.php#products" class="nav-l">Katalog</a>
            <?php if(!isAdmin()): ?><a href="orders.php" class="nav-l">Pesanan</a><?php endif; ?>
        </div>
        <?php endif; ?>
        <!-- IKON KANAN -->
        <div class="d-flex align-items-center gap-2">
            <?php if(!isAdmin()): ?>
            <a href="cart.php" class="nav-l position-relative">
                <i class="fas fa-shopping-bag"></i>
                <?php if($cart_count>0): ?><span class="badge-c"><?=$cart_count?></span><?php endif; ?>
            </a>
            <?php endif; ?>
            <?php if(isLoggedIn()): ?>
                <span class="d-none d-md-inline nav-l" style="cursor:default"><i class="fas fa-user-circle"></i> <?=e($_SESSION['username'])?></span>
                <form method="post" action="process.php" class="d-inline"><button type="submit" name="action" value="logout" class="btn-p btn-sm">Keluar</button></form>
            <?php else: ?>
                <a href="login.php" class="btn-p btn-sm">Masuk</a>
            <?php endif; ?>
            <button class="d-md-none border-0 bg-transparent fs-5" onclick="document.getElementById('mm').classList.toggle('d-none')"><i class="fas fa-bars"></i></button>
        </div>
    </div>
    <!-- MOBILE MENU -->
    <div id="mm" class="d-none d-md-none mt-2 pt-2 border-top" style="border-color:var(--border)">
        <?php if(isAdmin()): ?>
            <a href="admin/index.php" class="d-block py-2 px-2 rounded" style="color:var(--fg)"><i class="fas fa-chart-line me-2"></i>Dashboard</a>
            <a href="admin/products.php" class="d-block py-2 px-2 rounded" style="color:var(--fg)"><i class="fas fa-box me-2"></i>Produk</a>
            <a href="admin/orders.php" class="d-block py-2 px-2 rounded" style="color:var(--fg)"><i class="fas fa-receipt me-2"></i>Pesanan</a>
        <?php else: ?>
            <a href="home.php" class="d-block py-2 px-2 rounded" style="color:var(--fg)">Beranda</a>
            <a href="cart.php" class="d-block py-2 px-2 rounded" style="color:var(--fg)">Keranjang</a>
            <?php if(isLoggedIn()): ?><a href="orders.php" class="d-block py-2 px-2 rounded" style="color:var(--fg)">Pesanan</a><?php endif; ?>
        <?php endif; ?>
    </div>
</div>
</nav>