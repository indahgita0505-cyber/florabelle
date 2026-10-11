<?php
require_once 'config.php';

// Kalau sudah login, lempar ke beranda
if (isLoggedIn()) {
    redirect('home.php');
}

// Ambil error (kalau ada)
$error = isset($_SESSION['error']) ? $_SESSION['error'] : '';
unset($_SESSION['error']);
?>

<?php require_once 'header.php'; ?>

<section class="aw">
    <div class="ac">
        <div class="text-center mb-3">
            <a href="home.php" class="nav-brand d-inline-flex" style="font-size:1.3rem">
                <i class="fas fa-seedling"></i> Flora<span>Belle</span>
            </a>
        </div>
        
        <h2 class="text-center">Buat Akun Baru</h2>
        <p class="sub text-center">Daftar sebagai pembeli</p>
        
        <?php if ($error) { ?>
        <div class="alert alert-danger py-2" style="font-size:.86rem">
            <i class="fas fa-exclamation-circle me-1"></i> <?= $error?>
        </div>
        <?php } ?>
        
        <form method="post" action="process.php">
            <input type="hidden" name="action" value="register">
            <div class="ff">
                <label>Nama Lengkap</label>
                <input type="text" name="username" required placeholder="Nama Anda">
            </div>
            <div class="ff">
                <label>Email</label>
                <input type="email" name="email" required placeholder="email@contoh.com">
            </div>
            <div class="ff">
                <label>Password</label>
                <input type="password" name="password" required placeholder="Min. 6 karakter" minlength="6">
            </div>
            <div class="ff">
                <label>Konfirmasi Password</label>
                <input type="password" name="confirm_password" required placeholder="Ulangi password">
            </div>
            <button type="submit" class="btn-a w-100 justify-content-center mt-2" style="padding:.8rem">
                Daftar
            </button>
        </form>
        
        <p class="text-center mt-3 mb-0" style="font-size:.86rem;color:var(--muted)">
            Sudah punya akun? <a href="login.php" style="color:var(--primary);font-weight:600">Masuk</a>
        </p>
    </div>
</section>

<?php require_once 'footer.php'; ?>