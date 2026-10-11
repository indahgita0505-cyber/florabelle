<?php 
require_once 'config.php'; 

// Kalau sudah login, langsung lempar ke beranda
if(isLoggedIn()) {
    redirect(isAdmin() ? 'admin/index.php' : 'home.php');
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
        
        <h2 class="text-center">Masuk ke Akun</h2>
        <p class="sub text-center">Selamat datang kembali</p>
        
        <?php if($error): ?>
        <div class="alert alert-danger py-2" style="font-size:.86rem">
            <i class="fas fa-exclamation-circle me-1"></i> <?=$error?>
        </div>
        <?php endif; ?>
        
        <form method="post" action="process.php">
            <input type="hidden" name="action" value="login">
            <div class="ff">
                <label>Email</label>
                <input type="email" name="email" required placeholder="email@contoh.com">
            </div>
            <div class="ff">
                <label>Password</label>
                <input type="password" name="password" required placeholder="Masukkan password">
            </div>
            <button type="submit" class="btn-a w-100 justify-content-center mt-2" style="padding:.8rem">
                Masuk
            </button>
        </form>
        
        <p class="text-center mt-3 mb-0" style="font-size:.86rem;color:var(--muted)">
            Belum punya akun? <a href="register.php" style="color:var(--primary);font-weight:600">Daftar</a>
        </p>
        
        <div class="mt-3 p-3 rounded" style="background:var(--bg);font-size:.78rem;color:var(--muted)">
            <strong>Penjual:</strong> penjual@florabelle.com / penjual123<br>
            <strong>Pembeli:</strong> pembeli@gmail.com / pembeli123
        </div>
    </div>
</section>

<?php require_once 'footer.php'; ?>