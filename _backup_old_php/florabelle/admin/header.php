<?php if (! isAdmin()) {
    redirect('../home.php');
} ?>
<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Admin Panel - Flora Belle</title>
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
<link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
<link rel="stylesheet" href="../assets/css/admin-style.css">
<script src="../script.js"></script>
</head>
<body>
<div class="toast-c"><?php if ($toast) { ?><div class="toast-m <?= $toast['type']?>"><i class="fas fa-<?= $toast['type'] === 'success' ? 'check-circle' : 'exclamation-triangle' ?>"></i> <?= e($toast['msg'])?></div><?php } ?></div>

<div class="admin-wrapper" style="display: flex;">
    <aside class="admin-sidebar">
        <div class="sidebar-brand">
            <a href="index.php"><i class="fas fa-seedling"></i> Flora<span>Belle</span></a>
        </div>
        <div class="sidebar-label">Menu Utama</div>
        <a href="index.php" class="sidebar-link <?= basename($_SERVER['PHP_SELF']) === 'index.php' ? 'active' : ''?>"><i class="fas fa-chart-pie"></i> <span>Dashboard</span></a>
        <a href="products.php" class="sidebar-link <?= in_array(basename($_SERVER['PHP_SELF']), ['products.php', 'product_form.php']) ? 'active' : ''?>"><i class="fas fa-box-open"></i> <span>Kelola Produk</span></a>
        <a href="orders.php" class="sidebar-link <?= basename($_SERVER['PHP_SELF']) === 'orders.php' ? 'active' : ''?>"><i class="fas fa-file-invoice-dollar"></i> <span>Pesanan Masuk</span></a>
        <a href="customers_promos.php" class="sidebar-link <?= basename($_SERVER['PHP_SELF']) === 'customers_promos.php' ? 'active' : ''?>"><i class="fas fa-users"></i> <span>Pelanggan & Promo</span></a>
        <a href="reports_stock.php" class="sidebar-link <?= basename($_SERVER['PHP_SELF']) === 'reports_stock.php' ? 'active' : ''?>"><i class="fas fa-chart-line"></i> <span>Laporan & Stok</span></a>
        <a href="../home.php" class="sidebar-link"><i class="fas fa-eye"></i> <span>Pratinjau Toko</span></a>
        
        <div class="sidebar-bottom">
            <form method="post" action="../process.php">
                <button type="submit" name="action" value="logout" class="sidebar-link" style="width:100%; background:none; border:none; cursor:pointer;"><i class="fas fa-sign-out-alt"></i> <span>Keluar</span></button>
            </form>
        </div>
    </aside>

    <main class="admin-content">
        <!-- Topbar sederhana hanya untuk judul halaman, tidak ada menu di sini -->