<?php
session_start();

// === KONFIGURASI DATABASE (SQLite) ===
$db_file = __DIR__.'/flowershop.db';
try {
    $db = new PDO('sqlite:'.$db_file);
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (Exception $e) {
    exit('<h2>Error: Ekstensi SQLite tidak aktif. Aktifkan di php.ini.</h2><p>'.$e->getMessage().'</p>');
}

// Buat tabel
$db->exec("CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT DEFAULT 'customer',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)");
$db->exec("CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    price REAL NOT NULL,
    image TEXT DEFAULT '🌹',
    category TEXT DEFAULT 'Bunga Potong',
    stock INTEGER DEFAULT 50,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)");
$db->exec('CREATE TABLE IF NOT EXISTS cart (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    product_id INTEGER,
    quantity INTEGER DEFAULT 1,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
)');
$db->exec("CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    total REAL,
    status TEXT DEFAULT 'pending',
    payment_method TEXT,
    customer_name TEXT,
    customer_phone TEXT,
    customer_address TEXT,
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
)");
$db->exec('CREATE TABLE IF NOT EXISTS order_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id INTEGER,
    product_id INTEGER,
    product_name TEXT,
    price REAL,
    quantity INTEGER,
    FOREIGN KEY (order_id) REFERENCES orders(id)
)');

// Seed produk jika kosong
if ($db->query('SELECT COUNT(*) FROM products')->fetchColumn() == 0) {
    $seeds = [
        ['Mawar Merah Premium', 'Mawar merah segar kualitas premium, simbol cinta sejati. Cocok untuk hadiah romantis dan anniversary.', 45000, '🌹', 'Bunga Potong', 100],
        ['Buket Lily Putih Elegan', 'Buket lily putih anggun dengan baby breath. Simbol kemurnian dan keanggunan abadi.', 85000, '🤍', 'Buket', 30],
        ['Bunga Matahari Ceria', 'Bunga matahari segar penuh energi positif. Ideal untuk mencerahkan hari seseorang.', 25000, '🌻', 'Bunga Potong', 80],
        ['Tulip Ungu Eksklusif', 'Tulip ungu langka dan mewah. Representasi kerajaan dan keanggunan tak terbatas.', 65000, '🌷', 'Bunga Potong', 40],
        ['Buket Mix Romantis', 'Kombinasi mawar merah, pink, dan baby breath. Buket sempurna untuk momen spesial.', 135000, '💐', 'Buket', 25],
        ['Anggrek Bulan Putih', 'Anggrek bulan putih memesona, bunga nasional Indonesia. Tahan lama dan elegan.', 150000, '🦋', 'Bunga Pot', 15],
        ['Krisan Kuning Segar', 'Krisan kuning cerah penuh makna persahabatan. Bisa tahan hingga 2 minggu.', 18000, '🌼', 'Bunga Potong', 120],
        ['Buket Pengantin Mewah', 'Buket eksklusif dengan mawar putih, lily, dan dedaunan hijau. Untuk hari terindah.', 280000, '👰', 'Buket', 10],
        ['Sakura Mini dalam Pot', 'Sakura mini Jepang dalam pot keramik cantik. Membawa suasana musim semi.', 175000, '🌸', 'Bunga Pot', 8],
        ['Baby Breath Lembut', 'Baby breath putih lembut, pelengkap sempurna untuk setiap buket dan rangkaian.', 12000, '🫧', 'Bunga Potong', 200],
        ['Dahlia Merah Besar', 'Dahlia merah besar mencolok, pusat perhatian setiap ruangan dan acara.', 70000, '🌺', 'Bunga Potong', 35],
        ['Buket Ulang Tahun Spesial', 'Buket pesta dengan bunga warna-warni dan balon mini. Kejutan sempurna!', 95000, '🎂', 'Buket', 20],
        ['Peony Pink Resort', 'Bunga peony pink mewah dengan aroma lembut. Favorit para penggemar bunga.', 110000, '🩷', 'Bunga Potong', 22],
        ['Rangkaian Meja Makan', 'Rangkaian bunga segar untuk hiasan meja makan. Segar dan natural setiap hari.', 55000, '🪴', 'Rangkaian', 18],
        ['Bunga Kaktus Mini Set', 'Koleksi 3 kaktus mini dalam pot cantik. Perawatan mudah, tampilan Instagramable.', 88000, '🌵', 'Bunga Pot', 45],
    ];
    $stmt = $db->prepare('INSERT INTO products (name,description,price,image,category,stock) VALUES (?,?,?,?,?,?)');
    foreach ($seeds as $s) {
        $stmt->execute($s);
    }
}

// Seed admin
if ($db->query("SELECT COUNT(*) FROM users WHERE role='admin'")->fetchColumn() == 0) {
    $db->exec("INSERT INTO users (username,email,password,role) VALUES ('admin','admin@florabelle.com','".password_hash('admin123', PASSWORD_DEFAULT)."','admin')");
}

// === HELPER FUNCTIONS ===
function isLoggedIn()
{
    return isset($_SESSION['user_id']);
}
function isAdmin()
{
    return isset($_SESSION['role']) && $_SESSION['role'] === 'admin';
}
function redirect($page)
{
    header('Location: ?page='.$page);
    exit;
}
function rupiah($n)
{
    return 'Rp '.number_format($n, 0, ',', '.');
}
function e($s)
{
    return htmlspecialchars($s ?? '', ENT_QUOTES, 'UTF-8');
}
function toast($msg, $type = 'success')
{
    $_SESSION['toast'] = ['msg' => $msg, 'type' => $type];
}
function getToast()
{
    if (isset($_SESSION['toast'])) {
        $t = $_SESSION['toast'];
        unset($_SESSION['toast']);

        return $t;
    }

    return null;
}

function cardGradient($cat)
{
    $map = [
        'Bunga Potong' => 'linear-gradient(135deg,#fce4ec,#f8bbd0)',
        'Buket' => 'linear-gradient(135deg,#fff3e0,#ffe0b2)',
        'Bunga Pot' => 'linear-gradient(135deg,#e8f5e9,#c8e6c9)',
        'Rangkaian' => 'linear-gradient(135deg,#e0f7fa,#b2ebf2)',
    ];

    return isset($map[$cat]) ? $map[$cat] : 'linear-gradient(135deg,#f3e5f5,#e1bee7)';
}

// === HANDLE ACTIONS ===
$action = isset($_POST['action']) ? $_POST['action'] : (isset($_GET['action']) ? $_GET['action'] : '');
$page = isset($_GET['page']) ? $_GET['page'] : 'home';
$search = isset($_GET['search']) ? $_GET['search'] : '';
$cat_filter = isset($_GET['category']) ? $_GET['category'] : '';

if ($action === 'login') {
    $stmt = $db->prepare('SELECT * FROM users WHERE email=?');
    $stmt->execute([$_POST['email'] ?? '']);
    $u = $stmt->fetch(PDO::FETCH_ASSOC);
    if ($u && password_verify($_POST['password'] ?? '', $u['password'])) {
        $_SESSION['user_id'] = $u['id'];
        $_SESSION['username'] = $u['username'];
        $_SESSION['role'] = $u['role'];
        toast('Selamat datang, '.$u['username'].'!');
        redirect('home');
    } else {
        $error = 'Email atau password salah!';
    }
}

if ($action === 'register') {
    $pw = $_POST['password'] ?? '';
    $pw2 = $_POST['confirm_password'] ?? '';
    if ($pw !== $pw2) {
        $error = 'Password tidak cocok!';
    } else {
        $stmt = $db->prepare('SELECT id FROM users WHERE email=? OR username=?');
        $stmt->execute([$_POST['email'], $_POST['username']]);
        if ($stmt->fetch()) {
            $error = 'Email atau username sudah terdaftar!';
        } else {
            $db->prepare('INSERT INTO users (username,email,password) VALUES (?,?,?)')
                ->execute([$_POST['username'], $_POST['email'], password_hash($pw, PASSWORD_DEFAULT)]);
            toast('Registrasi berhasil! Silakan login.');
            redirect('login');
        }
    }
}

if ($action === 'logout') {
    session_destroy();
    redirect('home');
}

if ($action === 'add_to_cart') {
    if (! isLoggedIn()) {
        toast('Silakan login terlebih dahulu.', 'warning');
        redirect('login');
    }
    $pid = (int) ($_POST['product_id'] ?? 0);
    $qty = (int) ($_POST['quantity'] ?? 1);
    $stmt = $db->prepare('SELECT id,quantity FROM cart WHERE user_id=? AND product_id=?');
    $stmt->execute([$_SESSION['user_id'], $pid]);
    $ex = $stmt->fetch();
    if ($ex) {
        $db->prepare('UPDATE cart SET quantity=quantity+? WHERE id=?')->execute([$qty, $ex['id']]);
    } else {
        $db->prepare('INSERT INTO cart (user_id,product_id,quantity) VALUES (?,?,?)')->execute([$_SESSION['user_id'], $pid, $qty]);
    }
    toast('Produk ditambahkan ke keranjang!');
    $ref = $_POST['redirect'] ?? 'home';
    redirect($ref);
}

if ($action === 'update_cart') {
    foreach ($_POST['quantity'] ?? [] as $cid => $qty) {
        if ($qty <= 0) {
            $db->prepare('DELETE FROM cart WHERE id=? AND user_id=?')->execute([$cid, $_SESSION['user_id']]);
        } else {
            $db->prepare('UPDATE cart SET quantity=? WHERE id=? AND user_id=?')->execute([$qty, $cid, $_SESSION['user_id']]);
        }
    }
    redirect('cart');
}

if ($action === 'remove_cart') {
    $db->prepare('DELETE FROM cart WHERE id=? AND user_id=?')->execute([$_GET['id'] ?? 0, $_SESSION['user_id']]);
    redirect('cart');
}

if ($action === 'checkout') {
    if (! isLoggedIn()) {
        redirect('login');
    }
    $stmt = $db->prepare('SELECT c.*,p.name,p.price,p.stock FROM cart c JOIN products p ON c.product_id=p.id WHERE c.user_id=?');
    $stmt->execute([$_SESSION['user_id']]);
    $items = $stmt->fetchAll();
    if (empty($items)) {
        toast('Keranjang kosong!', 'warning');
        redirect('cart');
    }
    $total = 0;
    foreach ($items as $i) {
        $total += $i['price'] * $i['quantity'];
    }
    $db->prepare('INSERT INTO orders (user_id,total,payment_method,customer_name,customer_phone,customer_address,notes) VALUES (?,?,?,?,?,?,?)')
        ->execute([$_SESSION['user_id'], $total, $_POST['payment_method'], $_POST['customer_name'], $_POST['customer_phone'], $_POST['customer_address'], $_POST['notes'] ?? '']);
    $oid = $db->lastInsertId();
    $stmt2 = $db->prepare('INSERT INTO order_items (order_id,product_id,product_name,price,quantity) VALUES (?,?,?,?,?)');
    foreach ($items as $i) {
        $stmt2->execute([$oid, $i['product_id'], $i['name'], $i['price'], $i['quantity']]);
        $db->prepare('UPDATE products SET stock=stock-? WHERE id=?')->execute([$i['quantity'], $i['product_id']]);
    }
    $db->prepare('DELETE FROM cart WHERE user_id=?')->execute([$_SESSION['user_id']]);
    redirect('order_success&oid='.$oid);
}

if ($action === 'add_product' && isAdmin()) {
    $db->prepare('INSERT INTO products (name,description,price,image,category,stock) VALUES (?,?,?,?,?,?)')
        ->execute([$_POST['name'], $_POST['description'], $_POST['price'], $_POST['image'], $_POST['category'], $_POST['stock']]);
    toast('Produk berhasil ditambahkan!');
    redirect('admin_products');
}
if ($action === 'edit_product' && isAdmin()) {
    $db->prepare('UPDATE products SET name=?,description=?,price=?,image=?,category=?,stock=? WHERE id=?')
        ->execute([$_POST['name'], $_POST['description'], $_POST['price'], $_POST['image'], $_POST['category'], $_POST['stock'], $_POST['id']]);
    toast('Produk berhasil diperbarui!');
    redirect('admin_products');
}
if ($action === 'delete_product' && isAdmin()) {
    $db->prepare('DELETE FROM products WHERE id=?')->execute([$_GET['id'] ?? 0]);
    toast('Produk berhasil dihapus!');
    redirect('admin_products');
}
if ($action === 'update_order_status' && isAdmin()) {
    $db->prepare('UPDATE orders SET status=? WHERE id=?')->execute([$_POST['status'], $_POST['order_id']]);
    toast('Status pesanan diperbarui!');
    redirect('admin_orders');
}

// Hitung keranjang
$cart_count = 0;
if (isLoggedIn()) {
    $c = $db->prepare('SELECT SUM(quantity) FROM cart WHERE user_id=?');
    $c->execute([$_SESSION['user_id']]);
    $cart_count = $c->fetchColumn() ?: 0;
}
$toast = getToast();
?>
<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Flora Belle - Toko Bunga Premium</title>
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
<link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400&family=DM+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet">
<style>
:root{--bg:#faf7f2;--fg:#1a1a1a;--muted:#8a8578;--accent:#c9787c;--accent-dark:#a85c60;--primary:#2d5a3d;--primary-dark:#1a3c2a;--primary-light:#3d7a52;--card:#ffffff;--border:#e8e2d8;--shadow:0 4px 24px rgba(26,60,42,0.08);--shadow-lg:0 12px 48px rgba(26,60,42,0.12);--radius:16px;--radius-sm:10px}
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'DM Sans',sans-serif;background:var(--bg);color:var(--fg);overflow-x:hidden;line-height:1.6}
h1,h2,h3,h4,h5{font-family:'Playfair Display',serif;font-weight:700;line-height:1.2}
a{text-decoration:none;color:inherit;transition:all .25s}
.navbar-custom{background:rgba(250,247,242,0.92);backdrop-filter:blur(20px);border-bottom:1px solid var(--border);padding:.75rem 0;position:sticky;top:0;z-index:1000;transition:box-shadow .3s}
.navbar-custom.scrolled{box-shadow:0 2px 20px rgba(0,0,0,0.08)}
.nav-brand{font-family:'Playfair Display',serif;font-size:1.65rem;font-weight:900;color:var(--primary-dark);display:flex;align-items:center;gap:.5rem}
.nav-brand span{color:var(--accent)}
.nav-link-custom{color:var(--fg)!important;font-weight:500;font-size:.92rem;padding:.5rem 1rem!important;border-radius:var(--radius-sm);transition:all .25s}
.nav-link-custom:hover,.nav-link-custom.active{color:var(--primary-dark)!important;background:rgba(45,90,61,0.08)}
.badge-cart{background:var(--accent);color:#fff;font-size:.7rem;min-width:18px;height:18px;display:inline-flex;align-items:center;justify-content:center;border-radius:50%;position:relative;top:-8px;left:-6px;font-weight:700}
.btn-nav{background:var(--primary);color:#fff!important;border:none;padding:.5rem 1.25rem;border-radius:var(--radius-sm);font-weight:600;font-size:.88rem;transition:all .25s}
.btn-nav:hover{background:var(--primary-dark);transform:translateY(-1px);box-shadow:0 4px 12px rgba(45,90,61,0.3)}
.hero-section{min-height:92vh;display:flex;align-items:center;position:relative;overflow:hidden;background:linear-gradient(160deg,#e8f5e9 0%,#faf7f2 40%,#fce4ec 100%)}
.hero-petals{position:absolute;inset:0;pointer-events:none;overflow:hidden}
.petal{position:absolute;border-radius:50% 0 50% 50%;opacity:.35;animation:floatPetal linear infinite}
@keyframes floatPetal{0%{transform:translateY(110vh) rotate(0deg) scale(1)}50%{transform:translateY(50vh) rotate(180deg) scale(1.1)}100%{transform:translateY(-10vh) rotate(360deg) scale(.8)}}
.hero-content{position:relative;z-index:2}
.hero-badge{display:inline-flex;align-items:center;gap:.5rem;background:rgba(45,90,61,0.1);color:var(--primary);padding:.4rem 1rem;border-radius:50px;font-size:.85rem;font-weight:600;margin-bottom:1.5rem}
.hero-title{font-size:clamp(2.5rem,6vw,4.5rem);color:var(--primary-dark);margin-bottom:1rem}
.hero-title em{font-style:italic;color:var(--accent);font-weight:900}
.hero-sub{font-size:1.15rem;color:var(--muted);max-width:500px;margin-bottom:2rem;font-weight:300}
.hero-img-area{position:relative;z-index:2}
.hero-img-circle{width:380px;height:380px;border-radius:50%;background:linear-gradient(135deg,#f8bbd0,#c8e6c9);display:flex;align-items:center;justify-content:center;font-size:10rem;box-shadow:var(--shadow-lg);animation:heroFloat 6s ease-in-out infinite;position:relative}
.hero-img-circle::after{content:'';position:absolute;inset:-20px;border-radius:50%;border:2px dashed var(--border);animation:spinSlow 30s linear infinite}
@keyframes heroFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-15px)}}
@keyframes spinSlow{to{transform:rotate(360deg)}}
.hero-stats{display:flex;gap:2.5rem;margin-top:2.5rem}
.hero-stat-num{font-family:'Playfair Display',serif;font-size:1.8rem;font-weight:900;color:var(--primary-dark)}
.hero-stat-label{font-size:.82rem;color:var(--muted);font-weight:500}
.btn-primary-custom{background:var(--primary);color:#fff;border:none;padding:.7rem 1.8rem;border-radius:var(--radius-sm);font-weight:600;font-size:.95rem;transition:all .3s;display:inline-flex;align-items:center;gap:.5rem}
.btn-primary-custom:hover{background:var(--primary-dark);color:#fff;transform:translateY(-2px);box-shadow:0 8px 24px rgba(45,90,61,0.25)}
.btn-accent{background:var(--accent);color:#fff;border:none;padding:.7rem 1.8rem;border-radius:var(--radius-sm);font-weight:600;font-size:.95rem;transition:all .3s;display:inline-flex;align-items:center;gap:.5rem}
.btn-accent:hover{background:var(--accent-dark);color:#fff;transform:translateY(-2px);box-shadow:0 8px 24px rgba(201,120,124,0.3)}
.btn-outline-custom{background:transparent;color:var(--primary);border:2px solid var(--primary);padding:.6rem 1.6rem;border-radius:var(--radius-sm);font-weight:600;font-size:.92rem;transition:all .3s}
.btn-outline-custom:hover{background:var(--primary);color:#fff;transform:translateY(-2px)}
.btn-sm-custom{padding:.4rem 1rem;font-size:.82rem;border-radius:8px}
.btn-danger-custom{background:#dc3545;color:#fff;border:none;padding:.4rem 1rem;border-radius:8px;font-size:.82rem;font-weight:600;transition:all .25s}
.btn-danger-custom:hover{background:#c82333;color:#fff}
.section-padding{padding:5rem 0}
.section-title{font-size:clamp(1.8rem,4vw,2.8rem);color:var(--primary-dark);margin-bottom:.5rem}
.section-sub{color:var(--muted);font-size:1rem;margin-bottom:3rem;font-weight:300}
.section-line{width:60px;height:3px;background:var(--accent);border-radius:2px;margin-bottom:1rem}
.product-card{background:var(--card);border-radius:var(--radius);overflow:hidden;box-shadow:var(--shadow);transition:all .35s;border:1px solid var(--border)}
.product-card:hover{transform:translateY(-6px);box-shadow:var(--shadow-lg)}
.product-card-img{height:200px;display:flex;align-items:center;justify-content:center;font-size:5rem;position:relative;overflow:hidden}
.product-card-img .cat-badge{position:absolute;top:12px;left:12px;background:rgba(255,255,255,0.9);backdrop-filter:blur(8px);padding:.2rem .7rem;border-radius:50px;font-size:.72rem;font-weight:600;color:var(--primary)}
.product-card-body{padding:1.25rem}
.product-card-name{font-family:'Playfair Display',serif;font-size:1.1rem;font-weight:700;color:var(--fg);margin-bottom:.3rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.product-card-desc{font-size:.82rem;color:var(--muted);margin-bottom:.75rem;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;line-height:1.5}
.product-card-footer{display:flex;align-items:center;justify-content:space-between}
.product-price{font-family:'Playfair Display',serif;font-size:1.15rem;font-weight:900;color:var(--primary-dark)}
.product-stock{font-size:.75rem;color:var(--muted)}
.btn-add-cart{width:40px;height:40px;border-radius:50%;background:var(--primary);color:#fff;border:none;display:flex;align-items:center;justify-content:center;transition:all .3s;font-size:.9rem}
.btn-add-cart:hover{background:var(--accent);transform:scale(1.1)}
.filter-bar{display:flex;flex-wrap:wrap;gap:.5rem;margin-bottom:2rem}
.filter-btn{padding:.45rem 1.1rem;border-radius:50px;border:1.5px solid var(--border);background:transparent;color:var(--muted);font-size:.85rem;font-weight:500;cursor:pointer;transition:all .25s}
.filter-btn:hover,.filter-btn.active{background:var(--primary);color:#fff;border-color:var(--primary)}
.search-box{position:relative;max-width:400px}
.search-box input{width:100%;padding:.65rem 1rem .65rem 2.8rem;border:1.5px solid var(--border);border-radius:var(--radius-sm);background:var(--card);font-size:.92rem;transition:all .25s}
.search-box input:focus{outline:none;border-color:var(--primary);box-shadow:0 0 0 3px rgba(45,90,61,0.1)}
.search-box i{position:absolute;left:1rem;top:50%;transform:translateY(-50%);color:var(--muted)}
.auth-wrapper{min-height:85vh;display:flex;align-items:center;justify-content:center;padding:2rem}
.auth-card{background:var(--card);border-radius:var(--radius);padding:2.5rem;box-shadow:var(--shadow-lg);max-width:440px;width:100%;border:1px solid var(--border)}
.auth-card h2{color:var(--primary-dark);margin-bottom:.25rem}
.auth-card .subtitle{color:var(--muted);font-size:.9rem;margin-bottom:2rem}
.form-floating-custom{position:relative;margin-bottom:1rem}
.form-floating-custom label{font-size:.82rem;font-weight:600;color:var(--muted);margin-bottom:.3rem;display:block}
.form-floating-custom input,.form-floating-custom select,.form-floating-custom textarea{width:100%;padding:.65rem 1rem;border:1.5px solid var(--border);border-radius:var(--radius-sm);font-size:.92rem;background:var(--bg);transition:all .25s;font-family:'DM Sans',sans-serif}
.form-floating-custom input:focus,.form-floating-custom select:focus,.form-floating-custom textarea:focus{outline:none;border-color:var(--primary);box-shadow:0 0 0 3px rgba(45,90,61,0.1);background:#fff}
.form-floating-custom textarea{resize:vertical;min-height:80px}
.cart-item{display:flex;align-items:center;gap:1rem;padding:1.25rem;background:var(--card);border-radius:var(--radius-sm);border:1px solid var(--border);margin-bottom:.75rem;transition:all .25s}
.cart-item:hover{box-shadow:var(--shadow)}
.cart-item-emoji{width:70px;height:70px;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:2.5rem;flex-shrink:0}
.cart-item-info{flex:1;min-width:0}
.cart-item-name{font-weight:600;font-size:.95rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.cart-item-price{color:var(--accent-dark);font-weight:700;font-size:.9rem}
.qty-control{display:flex;align-items:center;gap:.25rem}
.qty-control button{width:30px;height:30px;border-radius:8px;border:1.5px solid var(--border);background:var(--bg);cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all .2s;font-size:.8rem}
.qty-control button:hover{border-color:var(--primary);color:var(--primary)}
.qty-control input{width:42px;text-align:center;border:1.5px solid var(--border);border-radius:8px;padding:.2rem;font-size:.85rem;font-weight:600;background:var(--bg)}
.qty-control input:focus{outline:none;border-color:var(--primary)}
.order-summary{background:var(--card);border-radius:var(--radius);padding:1.75rem;border:1px solid var(--border);box-shadow:var(--shadow);position:sticky;top:90px}
.summary-row{display:flex;justify-content:space-between;padding:.6rem 0;font-size:.92rem}
.summary-row.total{border-top:2px solid var(--border);margin-top:.5rem;padding-top:1rem;font-weight:700;font-size:1.1rem;color:var(--primary-dark);font-family:'Playfair Display',serif}
.table-custom{width:100%;border-collapse:separate;border-spacing:0}
.table-custom thead th{background:var(--primary);color:#fff;padding:.8rem 1rem;font-size:.85rem;font-weight:600;text-align:left}
.table-custom thead th:first-child{border-radius:var(--radius-sm) 0 0 0}
.table-custom thead th:last-child{border-radius:0 var(--radius-sm) 0 0}
.table-custom tbody td{padding:.75rem 1rem;font-size:.88rem;border-bottom:1px solid var(--border);vertical-align:middle}
.table-custom tbody tr:hover{background:rgba(45,90,61,0.03)}
.status-badge{padding:.25rem .7rem;border-radius:50px;font-size:.75rem;font-weight:600;display:inline-block}
.status-pending{background:#fff3e0;color:#e65100}
.status-confirmed{background:#e3f2fd;color:#1565c0}
.status-shipped{background:#f3e5f5;color:#7b1fa2}
.status-delivered{background:#e8f5e9;color:#2e7d32}
.status-cancelled{background:#ffebee;color:#c62828}
.footer{background:var(--primary-dark);color:rgba(255,255,255,0.8);padding:3.5rem 0 1.5rem}
.footer h5{color:#fff;margin-bottom:1rem;font-size:1.1rem}
.footer a{color:rgba(255,255,255,0.7);transition:color .25s}
.footer a:hover{color:var(--accent)}
.footer-bottom{border-top:1px solid rgba(255,255,255,0.1);padding-top:1.5rem;margin-top:2.5rem;text-align:center;font-size:.85rem;color:rgba(255,255,255,0.5)}
.toast-container{position:fixed;top:90px;right:20px;z-index:9999}
.toast-msg{padding:.85rem 1.5rem;border-radius:var(--radius-sm);color:#fff;font-size:.9rem;font-weight:500;box-shadow:var(--shadow-lg);animation:slideInToast .4s ease;margin-bottom:.5rem;display:flex;align-items:center;gap:.5rem}
.toast-msg.success{background:#2e7d32}
.toast-msg.warning{background:#e65100}
.toast-msg.error{background:#c62828}
@keyframes slideInToast{from{transform:translateX(100%);opacity:0}to{transform:translateX(0);opacity:1}}
.feature-card{text-align:center;padding:2rem 1.5rem;background:var(--card);border-radius:var(--radius);border:1px solid var(--border);transition:all .35s}
.feature-card:hover{transform:translateY(-4px);box-shadow:var(--shadow);border-color:var(--accent)}
.feature-icon{width:64px;height:64px;border-radius:50%;background:linear-gradient(135deg,rgba(45,90,61,0.1),rgba(201,120,124,0.1));display:flex;align-items:center;justify-content:center;margin:0 auto 1rem;font-size:1.5rem;color:var(--primary)}
.feature-card h5{font-size:1rem;margin-bottom:.4rem}
.feature-card p{font-size:.84rem;color:var(--muted);margin:0}
.checkout-steps{display:flex;justify-content:center;gap:0;margin-bottom:2.5rem}
.step-item{display:flex;align-items:center;gap:.5rem;padding:.5rem 1.25rem;font-size:.88rem;font-weight:500;color:var(--muted)}
.step-item.active{color:var(--primary)}
.step-item .step-num{width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:.78rem;font-weight:700;border:2px solid var(--border);color:var(--muted)}
.step-item.active .step-num{background:var(--primary);color:#fff;border-color:var(--primary)}
.step-item.done .step-num{background:#2e7d32;color:#fff;border-color:#2e7d32}
.step-item.done{color:#2e7d32}
.payment-option{border:2px solid var(--border);border-radius:var(--radius-sm);padding:1rem 1.25rem;cursor:pointer;transition:all .25s;display:flex;align-items:center;gap:.75rem}
.payment-option:hover{border-color:var(--primary)}
.payment-option.selected{border-color:var(--primary);background:rgba(45,90,61,0.03)}
.payment-option input[type="radio"]{accent-color:var(--primary);width:18px;height:18px}
.payment-icon{width:44px;height:44px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:1.2rem}
.success-icon{width:100px;height:100px;border-radius:50%;background:linear-gradient(135deg,#2e7d32,#43a047);display:flex;align-items:center;justify-content:center;margin:0 auto 1.5rem;font-size:2.5rem;color:#fff;animation:successPop .5s ease}
@keyframes successPop{0%{transform:scale(0)}60%{transform:scale(1.15)}100%{transform:scale(1)}}
.empty-state{text-align:center;padding:4rem 2rem;color:var(--muted)}
.empty-state i{font-size:4rem;margin-bottom:1rem;opacity:.4}
.empty-state h4{color:var(--fg);margin-bottom:.5rem}
.fade-up{opacity:0;transform:translateY(30px);transition:all .6s ease}
.fade-up.visible{opacity:1;transform:translateY(0)}
::-webkit-scrollbar{width:8px}
::-webkit-scrollbar-track{background:var(--bg)}
::-webkit-scrollbar-thumb{background:var(--border);border-radius:4px}
::-webkit-scrollbar-thumb:hover{background:var(--muted)}
@media(max-width:768px){
    .hero-img-area{display:none}
    .hero-stats{gap:1.5rem}
    .cart-item{flex-wrap:wrap}
    .checkout-steps{flex-wrap:wrap;justify-content:center}
    .section-padding{padding:3rem 0}
    .order-summary{position:static}
}
</style>
</head>
<body>

<!-- TOAST -->
<div class="toast-container" id="toastContainer">
<?php if ($toast) { ?>
    <div class="toast-msg <?php echo $toast['type']; ?>">
        <i class="fas fa-<?php echo $toast['type'] === 'success' ? 'check-circle' : ($toast['type'] === 'warning' ? 'exclamation-triangle' : 'times-circle'); ?>"></i>
        <?php echo e($toast['msg']); ?>
    </div>
<?php } ?>
</div>

<!-- NAVBAR -->
<nav class="navbar-custom" id="navbar">
<div class="container">
    <div class="d-flex align-items-center justify-content-between">
        <a href="?page=home" class="nav-brand"><i class="fas fa-seedling"></i> Flora<span>Belle</span></a>
        <div class="d-flex align-items-center gap-1 gap-md-2 d-none d-md-flex">
            <a href="?page=home" class="nav-link-custom <?php echo $page === 'home' ? 'active' : ''; ?>">Beranda</a>
            <a href="?page=home#products" class="nav-link-custom">Katalog</a>
            <?php if (isAdmin()) { ?>
            <a href="?page=admin_products" class="nav-link-custom <?php echo strpos($page, 'admin') === 0 ? 'active' : ''; ?>">Admin</a>
            <?php } ?>
            <?php if (isLoggedIn()) { ?>
            <a href="?page=orders" class="nav-link-custom <?php echo $page === 'orders' ? 'active' : ''; ?>">Pesanan</a>
            <?php } ?>
        </div>
        <div class="d-flex align-items-center gap-2">
            <a href="?page=cart" class="nav-link-custom position-relative">
                <i class="fas fa-shopping-bag"></i>
                <?php if ($cart_count > 0) { ?><span class="badge-cart"><?php echo $cart_count; ?></span><?php } ?>
            </a>
            <?php if (isLoggedIn()) { ?>
                <span class="d-none d-md-inline nav-link-custom" style="cursor:default"><i class="fas fa-user-circle"></i> <?php echo e($_SESSION['username']); ?></span>
                <form method="post" class="d-inline"><button type="submit" name="action" value="logout" class="btn-nav btn-sm-custom">Keluar</button></form>
            <?php } else { ?>
                <a href="?page=login" class="btn-nav btn-sm-custom">Masuk</a>
            <?php } ?>
            <button class="d-md-none border-0 bg-transparent fs-5" onclick="document.getElementById('mobileMenu').classList.toggle('d-none')"><i class="fas fa-bars"></i></button>
        </div>
    </div>
    <div id="mobileMenu" class="d-none d-md-none mt-2 pt-2 border-top" style="border-color:var(--border)">
        <a href="?page=home" class="d-block py-2 px-2 rounded" style="color:var(--fg)">Beranda</a>
        <a href="?page=home#products" class="d-block py-2 px-2 rounded" style="color:var(--fg)">Katalog</a>
        <?php if (isAdmin()) { ?><a href="?page=admin_products" class="d-block py-2 px-2 rounded" style="color:var(--fg)">Admin Panel</a><?php } ?>
        <?php if (isLoggedIn()) { ?><a href="?page=orders" class="d-block py-2 px-2 rounded" style="color:var(--fg)">Pesanan Saya</a><?php } ?>
    </div>
</div>
</nav>

<?php

// ----- BERANDA -----
if ($page === 'home') {
    $where = '1=1';
    $params = [];
    if ($search) {
        $where .= ' AND (name LIKE ? OR description LIKE ?)';
        $params[] = "%$search%";
        $params[] = "%$search%";
    }
    if ($cat_filter) {
        $where .= ' AND category = ?';
        $params[] = $cat_filter;
    }
    $products = $db->prepare("SELECT * FROM products WHERE $where ORDER BY id DESC");
    $products->execute($params);
    $products = $products->fetchAll();
    $categories = $db->query('SELECT DISTINCT category FROM products ORDER BY category')->fetchAll(PDO::FETCH_COLUMN);
    ?>
<!-- HERO -->
<section class="hero-section">
    <div class="hero-petals">
        <?php for ($i = 0; $i < 15; $i++) { ?>
        <div class="petal" style="left:<?php echo rand(5, 95); ?>%;animation-duration:<?php echo rand(8, 18); ?>s;animation-delay:<?php echo rand(0, 10); ?>s;background:<?php echo ['#f8bbd0', '#c8e6c9', '#ffe0b2', '#b2dfdb', '#f3e5f5', '#fff9c4'][rand(0, 5)]; ?>;width:<?php echo rand(12, 28); ?>px;height:<?php echo rand(12, 28); ?>px"></div>
        <?php } ?>
    </div>
    <div class="container">
        <div class="row align-items-center">
            <div class="col-lg-7 hero-content">
                <div class="hero-badge"><i class="fas fa-leaf"></i> Bunga Segar Setiap Hari</div>
                <h1 class="hero-title">Keindahan Bunga untuk Setiap <em>Momen</em></h1>
                <p class="hero-sub">Rangkaian bunga premium dipilih langsung dari kebun terbaik. Sampai di tangan Anda segar dan sempurna.</p>
                <div class="d-flex flex-wrap gap-3">
                    <a href="?page=home#products" class="btn-primary-custom"><i class="fas fa-store"></i> Jelajahi Koleksi</a>
                    <a href="?page=cart" class="btn-outline-custom"><i class="fas fa-shopping-bag"></i> Keranjang</a>
                </div>
                <div class="hero-stats">
                    <div><div class="hero-stat-num">500+</div><div class="hero-stat-label">Pelanggan Bahagia</div></div>
                    <div><div class="hero-stat-num">50+</div><div class="hero-stat-label">Jenis Bunga</div></div>
                    <div><div class="hero-stat-num">4.9</div><div class="hero-stat-label">Rating Kami</div></div>
                </div>
            </div>
            <div class="col-lg-5 d-flex justify-content-center hero-img-area">
                <div class="hero-img-circle">💐</div>
            </div>
        </div>
    </div>
</section>

<!-- FITUR -->
<section class="section-padding" style="background:var(--card)">
    <div class="container">
        <div class="row g-4">
            <div class="col-md-3 col-6 fade-up"><div class="feature-card"><div class="feature-icon"><i class="fas fa-truck-fast"></i></div><h5>Pengiriman Cepat</h5><p>Sampai dalam 2-4 jam di area Jabodetabek</p></div></div>
            <div class="col-md-3 col-6 fade-up"><div class="feature-card"><div class="feature-icon"><i class="fas fa-leaf"></i></div><h5>100% Segar</h5><p>Dipetik langsung dari kebun pilihan</p></div></div>
            <div class="col-md-3 col-6 fade-up"><div class="feature-card"><div class="feature-icon"><i class="fas fa-palette"></i></div><h5>Kustomisasi</h5><p>Sesuaikan buket sesuai selera Anda</p></div></div>
            <div class="col-md-3 col-6 fade-up"><div class="feature-card"><div class="feature-icon"><i class="fas fa-shield-heart"></i></div><h5>Garansi Fresh</h5><p>Garansi segar atau uang kembali</p></div></div>
        </div>
    </div>
</section>

<!-- KATALOG -->
<section class="section-padding" id="products">
    <div class="container">
        <div class="text-center">
            <div class="section-line mx-auto"></div>
            <h2 class="section-title">Koleksi Bunga Kami</h2>
            <p class="section-sub">Temukan bunga terbaik untuk setiap kesempatan</p>
        </div>
        <div class="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-3">
            <div class="search-box flex-grow-1">
                <i class="fas fa-search"></i>
                <form method="get" class="d-flex">
                    <input type="hidden" name="page" value="home">
                    <input type="text" name="search" placeholder="Cari bunga..." value="<?php echo e($search); ?>" class="border-0 border-end" style="border-radius:var(--radius-sm) 0 0 var(--radius-sm)">
                    <button type="submit" class="btn btn-primary-custom btn-sm-custom" style="border-radius:0 var(--radius-sm) var(--radius-sm) 0"><i class="fas fa-search"></i></button>
                </form>
            </div>
        </div>
        <div class="filter-bar">
            <a href="?page=home<?php echo $search ? '&search='.$search : ''; ?>" class="filter-btn <?php echo ! $cat_filter ? 'active' : ''; ?>">Semua</a>
            <?php foreach ($categories as $cat) { ?>
            <a href="?page=home&category=<?php echo urlencode($cat); ?><?php echo $search ? '&search='.$search : ''; ?>" class="filter-btn <?php echo $cat_filter === $cat ? 'active' : ''; ?>"><?php echo e($cat); ?></a>
            <?php } ?>
        </div>
        <?php if (empty($products)) { ?>
        <div class="empty-state"><i class="fas fa-search"></i><h4>Produk tidak ditemukan</h4><p>Coba ubah kata kunci pencarian Anda</p></div>
        <?php } else { ?>
        <div class="row g-4">
            <?php foreach ($products as $p) { ?>
            <div class="col-lg-3 col-md-4 col-sm-6 fade-up">
                <div class="product-card h-100 d-flex flex-column">
                    <div class="product-card-img" style="background:<?php echo cardGradient($p['category']); ?>">
                        <span class="cat-badge"><?php echo e($p['category']); ?></span>
                        <span><?php echo $p['image']; ?></span>
                    </div>
                    <div class="product-card-body d-flex flex-column flex-grow-1">
                        <div class="product-card-name" title="<?php echo e($p['name']); ?>"><?php echo e($p['name']); ?></div>
                        <div class="product-card-desc"><?php echo e($p['description']); ?></div>
                        <div class="product-stock mb-2"><i class="fas fa-cubes"></i> Stok: <?php echo $p['stock']; ?></div>
                        <div class="product-card-footer mt-auto">
                            <div>
                                <div class="product-price"><?php echo rupiah($p['price']); ?></div>
                            </div>
                            <?php if ($p['stock'] > 0) { ?>
                            <form method="post" action="?page=home<?php echo $cat_filter ? '&category='.$cat_filter : ''; ?><?php echo $search ? '&search='.$search : ''; ?>#products">
                                <input type="hidden" name="action" value="add_to_cart">
                                <input type="hidden" name="product_id" value="<?php echo $p['id']; ?>">
                                <input type="hidden" name="quantity" value="1">
                                <input type="hidden" name="redirect" value="<?php echo e($page.($cat_filter ? '&category='.$cat_filter : '').($search ? '&search='.$search : '')); ?>">
                                <button type="submit" class="btn-add-cart" title="Tambah ke keranjang"><i class="fas fa-plus"></i></button>
                            </form>
                            <?php } else { ?>
                            <span class="btn-add-cart" style="background:#ccc;cursor:not-allowed" title="Habis"><i class="fas fa-ban"></i></span>
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

<?php
    // ----- LOGIN -----
} elseif ($page === 'login') {
    ?>
<section class="auth-wrapper">
    <div class="auth-card">
        <div class="text-center mb-3">
            <a href="?page=home" class="nav-brand d-inline-flex" style="font-size:1.4rem"><i class="fas fa-seedling"></i> Flora<span>Belle</span></a>
        </div>
        <h2 class="text-center">Masuk ke Akun</h2>
        <p class="subtitle text-center">Selamat datang kembali di FloraBelle</p>
        <?php if (isset($error)) { ?><div class="alert alert-danger py-2" style="font-size:.88rem"><i class="fas fa-exclamation-circle me-1"></i> <?php echo e($error); ?></div><?php } ?>
        <form method="post">
            <input type="hidden" name="action" value="login">
            <div class="form-floating-custom"><label>Email</label><input type="email" name="email" required placeholder="email@contoh.com"></div>
            <div class="form-floating-custom"><label>Password</label><input type="password" name="password" required placeholder="Masukkan password"></div>
            <button type="submit" class="btn-primary-custom w-100 justify-content-center mt-2" style="padding:.8rem">Masuk</button>
        </form>
        <p class="text-center mt-3 mb-0" style="font-size:.88rem;color:var(--muted)">Belum punya akun? <a href="?page=register" style="color:var(--primary);font-weight:600">Daftar sekarang</a></p>
        <div class="mt-3 p-3 rounded" style="background:var(--bg);font-size:.8rem;color:var(--muted)">
            <strong>Demo Admin:</strong> admin@florabelle.com / admin123<br>
            <strong>Demo Customer:</strong> Daftar akun baru
        </div>
    </div>
</section>

<?php
    // ----- REGISTER -----
} elseif ($page === 'register') {
    ?>
<section class="auth-wrapper">
    <div class="auth-card">
        <div class="text-center mb-3">
            <a href="?page=home" class="nav-brand d-inline-flex" style="font-size:1.4rem"><i class="fas fa-seedling"></i> Flora<span>Belle</span></a>
        </div>
        <h2 class="text-center">Buat Akun Baru</h2>
        <p class="subtitle text-center">Bergabung dan nikmati koleksi bunga terbaik</p>
        <?php if (isset($error)) { ?><div class="alert alert-danger py-2" style="font-size:.88rem"><i class="fas fa-exclamation-circle me-1"></i> <?php echo e($error); ?></div><?php } ?>
        <form method="post">
            <input type="hidden" name="action" value="register">
            <div class="form-floating-custom"><label>Nama Lengkap</label><input type="text" name="username" required placeholder="Nama Anda"></div>
            <div class="form-floating-custom"><label>Email</label><input type="email" name="email" required placeholder="email@contoh.com"></div>
            <div class="form-floating-custom"><label>Password</label><input type="password" name="password" required placeholder="Min. 6 karakter" minlength="6"></div>
            <div class="form-floating-custom"><label>Konfirmasi Password</label><input type="password" name="confirm_password" required placeholder="Ulangi password"></div>
            <button type="submit" class="btn-primary-custom w-100 justify-content-center mt-2" style="padding:.8rem">Daftar</button>
        </form>
        <p class="text-center mt-3 mb-0" style="font-size:.88rem;color:var(--muted)">Sudah punya akun? <a href="?page=login" style="color:var(--primary);font-weight:600">Masuk di sini</a></p>
    </div>
</section>

<?php
    // ----- KERANJANG -----
} elseif ($page === 'cart') {
    if (! isLoggedIn()) {
        header('Location: ?page=login');
        exit;
    }
    $stmt = $db->prepare('SELECT c.*, p.name, p.price, p.image, p.category, p.stock FROM cart c JOIN products p ON c.product_id=p.id WHERE c.user_id=? ORDER BY c.id');
    $stmt->execute([$_SESSION['user_id']]);
    $cart_items = $stmt->fetchAll();
    $cart_total = 0;
    $cart_qty_total = 0;
    foreach ($cart_items as $ci) {
        $cart_total += $ci['price'] * $ci['quantity'];
        $cart_qty_total += $ci['quantity'];
    }
    ?>
<section class="section-padding">
    <div class="container">
        <div class="section-line"></div>
        <h2 class="section-title">Keranjang Belanja</h2>
        <p class="section-sub"><?php echo count($cart_items); ?> item dalam keranjang Anda</p>
        <?php if (empty($cart_items)) { ?>
        <div class="empty-state"><i class="fas fa-shopping-bag"></i><h4>Keranjang masih kosong</h4><p>Mulai belanja dan temukan bunga favorit Anda</p><a href="?page=home#products" class="btn-primary-custom mt-3"><i class="fas fa-store"></i> Belanja Sekarang</a></div>
        <?php } else { ?>
        <form method="post">
            <input type="hidden" name="action" value="update_cart">
            <div class="row">
                <div class="col-lg-8">
                    <?php foreach ($cart_items as $item) { ?>
                    <div class="cart-item">
                        <div class="cart-item-emoji" style="background:<?php echo cardGradient($item['category']); ?>"><?php echo $item['image']; ?></div>
                        <div class="cart-item-info">
                            <div class="cart-item-name"><?php echo e($item['name']); ?></div>
                            <div class="cart-item-price"><?php echo rupiah($item['price']); ?></div>
                        </div>
                        <div class="qty-control">
                            <button type="button" onclick="changeQty(this,-1)"><i class="fas fa-minus"></i></button>
                            <input type="number" name="quantity[<?php echo $item['id']; ?>]" value="<?php echo $item['quantity']; ?>" min="0" max="<?php echo $item['stock']; ?>">
                            <button type="button" onclick="changeQty(this,1)"><i class="fas fa-plus"></i></button>
                        </div>
                        <div class="text-end" style="min-width:100px"><strong style="font-size:.95rem"><?php echo rupiah($item['price'] * $item['quantity']); ?></strong></div>
                        <a href="?action=remove_cart&id=<?php echo $item['id']; ?>" class="text-danger" style="font-size:1.1rem" title="Hapus"><i class="fas fa-trash-alt"></i></a>
                    </div>
                    <?php } ?>
                    <button type="submit" class="btn-outline-custom btn-sm-custom mt-2"><i class="fas fa-refresh"></i> Perbarui Keranjang</button>
                </div>
                <div class="col-lg-4">
                    <div class="order-summary">
                        <h5 style="font-size:1.1rem;margin-bottom:1rem">Ringkasan Pesanan</h5>
                        <div class="summary-row"><span>Subtotal (<?php echo $cart_qty_total; ?> item)</span><span><?php echo rupiah($cart_total); ?></span></div>
                        <div class="summary-row"><span>Ongkos Kirim</span><span style="color:#2e7d32">Gratis</span></div>
                        <div class="summary-row total"><span>Total</span><span><?php echo rupiah($cart_total); ?></span></div>
                        <a href="?page=checkout" class="btn-accent w-100 justify-content-center mt-3" style="padding:.8rem"><i class="fas fa-credit-card"></i> Lanjut Bayar</a>
                        <a href="?page=home#products" class="d-block text-center mt-2" style="font-size:.85rem;color:var(--muted)">Lanjut Belanja</a>
                    </div>
                </div>
            </div>
        </form>
        <?php } ?>
    </div>
</section>

<?php
    // ----- CHECKOUT -----
} elseif ($page === 'checkout') {
    if (! isLoggedIn()) {
        header('Location: ?page=login');
        exit;
    }
    $stmt = $db->prepare('SELECT c.*, p.name, p.price, p.image, p.category FROM cart c JOIN products p ON c.product_id=p.id WHERE c.user_id=?');
    $stmt->execute([$_SESSION['user_id']]);
    $checkout_items = $stmt->fetchAll();
    $checkout_total = 0;
    foreach ($checkout_items as $ci) {
        $checkout_total += $ci['price'] * $ci['quantity'];
    }
    if (empty($checkout_items)) {
        header('Location: ?page=cart');
        exit;
    }
    $user = $db->prepare('SELECT * FROM users WHERE id=?');
    $user->execute([$_SESSION['user_id']]);
    $user = $user->fetch();
    ?>
<section class="section-padding">
    <div class="container" style="max-width:900px">
        <div class="checkout-steps">
            <div class="step-item done"><span class="step-num"><i class="fas fa-check"></i></span> Keranjang</div>
            <div class="step-item active"><span class="step-num">2</span> Pembayaran</div>
            <div class="step-item"><span class="step-num">3</span> Selesai</div>
        </div>
        <form method="post">
            <input type="hidden" name="action" value="checkout">
            <div class="row g-4">
                <div class="col-lg-7">
                    <div class="p-4 rounded" style="background:var(--card);border:1px solid var(--border)">
                        <h5 style="font-size:1.05rem;margin-bottom:1.25rem"><i class="fas fa-user me-2" style="color:var(--primary)"></i>Informasi Penerima</h5>
                        <div class="row g-3">
                            <div class="col-md-6"><div class="form-floating-custom"><label>Nama Penerima</label><input type="text" name="customer_name" value="<?php echo e($user['username']); ?>" required></div></div>
                            <div class="col-md-6"><div class="form-floating-custom"><label>No. Telepon</label><input type="tel" name="customer_phone" placeholder="08xxxxxxxxxx" required></div></div>
                            <div class="col-12"><div class="form-floating-custom"><label>Alamat Pengiriman</label><textarea name="customer_address" required placeholder="Jalan, No. Rumah, RT/RW, Kelurahan, Kecamatan, Kota"></textarea></div></div>
                            <div class="col-12"><div class="form-floating-custom"><label>Catatan (opsional)</label><textarea name="notes" placeholder="Contoh: Tulis kartu ucapan 'Selamat Ulang Tahun'"></textarea></div></div>
                        </div>
                    </div>
                    <div class="p-4 rounded mt-3" style="background:var(--card);border:1px solid var(--border)">
                        <h5 style="font-size:1.05rem;margin-bottom:1.25rem"><i class="fas fa-wallet me-2" style="color:var(--primary)"></i>Metode Pembayaran</h5>
                        <div class="d-flex flex-column gap-2">
                            <label class="payment-option"><input type="radio" name="payment_method" value="transfer" checked><div class="payment-icon" style="background:#e3f2fd;color:#1565c0"><i class="fas fa-building-columns"></i></div><div><div style="font-weight:600;font-size:.9rem">Transfer Bank</div><div style="font-size:.78rem;color:var(--muted)">BCA, Mandiri, BNI, BRI</div></div></label>
                            <label class="payment-option"><input type="radio" name="payment_method" value="ewallet"><div class="payment-icon" style="background:#e8f5e9;color:#2e7d32"><i class="fas fa-mobile-screen-button"></i></div><div><div style="font-weight:600;font-size:.9rem">E-Wallet</div><div style="font-size:.78rem;color:var(--muted)">GoPay, OVO, DANA, ShopeePay</div></div></label>
                            <label class="payment-option"><input type="radio" name="payment_method" value="cod"><div class="payment-icon" style="background:#fff3e0;color:#e65100"><i class="fas fa-hand-holding-dollar"></i></div><div><div style="font-weight:600;font-size:.9rem">Bayar di Tempat (COD)</div><div style="font-size:.78rem;color:var(--muted)">Bayar saat bunga diterima</div></div></label>
                        </div>
                    </div>
                </div>
                <div class="col-lg-5">
                    <div class="order-summary">
                        <h5 style="font-size:1.05rem;margin-bottom:1rem">Pesanan Anda</h5>
                        <?php foreach ($checkout_items as $ci_item) { ?>
                        <div class="d-flex align-items-center gap-2 mb-3 pb-3" style="border-bottom:1px solid var(--border)">
                            <div style="width:45px;height:45px;border-radius:10px;background:<?php echo cardGradient($ci_item['category']); ?>;display:flex;align-items:center;justify-content:center;font-size:1.5rem;flex-shrink:0"><?php echo $ci_item['image']; ?></div>
                            <div class="flex-grow-1" style="min-width:0"><div style="font-size:.82rem;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis"><?php echo e($ci_item['name']); ?></div><div style="font-size:.75rem;color:var(--muted)"><?php echo $ci_item['quantity']; ?>x <?php echo rupiah($ci_item['price']); ?></div></div>
                            <div style="font-size:.88rem;font-weight:700"><?php echo rupiah($ci_item['price'] * $ci_item['quantity']); ?></div>
                        </div>
                        <?php } ?>
                        <div class="summary-row"><span>Subtotal</span><span><?php echo rupiah($checkout_total); ?></span></div>
                        <div class="summary-row"><span>Ongkir</span><span style="color:#2e7d32">Gratis</span></div>
                        <div class="summary-row total"><span>Total Bayar</span><span><?php echo rupiah($checkout_total); ?></span></div>
                        <button type="submit" class="btn-accent w-100 justify-content-center mt-3" style="padding:.85rem;font-size:1rem"><i class="fas fa-lock"></i> Bayar Sekarang</button>
                        <a href="?page=cart" class="d-block text-center mt-2" style="font-size:.85rem;color:var(--muted)"><i class="fas fa-arrow-left me-1"></i> Kembali ke Keranjang</a>
                    </div>
                </div>
            </div>
        </form>
    </div>
</section>

<?php
    // ----- ORDER SUCCESS -----
} elseif ($page === 'order_success') {
    $oid = (int) ($_GET['oid'] ?? 0);
    $order = $db->prepare('SELECT * FROM orders WHERE id=? AND user_id=?');
    $order->execute([$oid, $_SESSION['user_id'] ?? 0]);
    $order = $order->fetch();
    $order_items = $db->prepare('SELECT * FROM order_items WHERE order_id=?');
    $order_items->execute([$oid]);
    $order_items = $order_items->fetchAll();
    ?>
<section class="section-padding">
    <div class="container text-center" style="max-width:600px">
        <div class="success-icon"><i class="fas fa-check"></i></div>
        <h2 class="section-title">Pesanan Berhasil!</h2>
        <p class="section-sub">Terima kasih telah berbelanja di FloraBelle</p>
        <?php if ($order) { ?>
        <div class="p-4 rounded text-start mb-3" style="background:var(--card);border:1px solid var(--border)">
            <div class="row mb-2"><div class="col-4" style="font-size:.85rem;color:var(--muted)">No. Pesanan</div><div class="col-8" style="font-weight:700">#FLB-<?php echo str_pad($order['id'], 5, '0', STR_PAD_LEFT); ?></div></div>
            <div class="row mb-2"><div class="col-4" style="font-size:.85rem;color:var(--muted)">Tanggal</div><div class="col-8"><?php echo date('d M Y H:i', strtotime($order['created_at'])); ?></div></div>
            <div class="row mb-2"><div class="col-4" style="font-size:.85rem;color:var(--muted)">Pembayaran</div><div class="col-8 text-capitalize"><?php echo $order['payment_method']; ?></div></div>
            <div class="row mb-2"><div class="col-4" style="font-size:.85rem;color:var(--muted)">Status</div><div class="col-8"><span class="status-badge status-pending">Menunggu Konfirmasi</span></div></div>
            <div class="row"><div class="col-4" style="font-size:.85rem;color:var(--muted)">Total</div><div class="col-8" style="font-weight:900;font-size:1.15rem;color:var(--primary-dark)"><?php echo rupiah($order['total']); ?></div></div>
        </div>
        <h6 class="text-start mt-4 mb-3">Detail Item:</h6>
        <?php foreach ($order_items as $oi) { ?>
        <div class="d-flex justify-content-between align-items-center p-3 rounded mb-2" style="background:var(--card);border:1px solid var(--border);font-size:.9rem">
            <span><?php echo e($oi['product_name']); ?> (x<?php echo $oi['quantity']; ?>)</span>
            <strong><?php echo rupiah($oi['price'] * $oi['quantity']); ?></strong>
        </div>
        <?php } ?>
        <?php } ?>
        <div class="d-flex gap-3 justify-content-center mt-4">
            <a href="?page=orders" class="btn-outline-custom"><i class="fas fa-list"></i> Lihat Pesanan</a>
            <a href="?page=home#products" class="btn-primary-custom"><i class="fas fa-store"></i> Belanja Lagi</a>
        </div>
    </div>
</section>

<?php
    // ----- RIWAYAT PESANAN -----
} elseif ($page === 'orders') {
    if (! isLoggedIn()) {
        header('Location: ?page=login');
        exit;
    }
    $orders = $db->prepare('SELECT * FROM orders WHERE user_id=? ORDER BY id DESC');
    $orders->execute([$_SESSION['user_id']]);
    $orders = $orders->fetchAll();
    ?>
<section class="section-padding">
    <div class="container" style="max-width:900px">
        <div class="section-line"></div>
        <h2 class="section-title">Riwayat Pesanan</h2>
        <p class="section-sub"><?php echo count($orders); ?> pesanan</p>
        <?php if (empty($orders)) { ?>
        <div class="empty-state"><i class="fas fa-receipt"></i><h4>Belum ada pesanan</h4><p>Mulai belanja untuk membuat pesanan pertama Anda</p><a href="?page=home#products" class="btn-primary-custom mt-3"><i class="fas fa-store"></i> Belanja Sekarang</a></div>
        <?php } else { ?>
        <div class="rounded overflow-hidden" style="background:var(--card);border:1px solid var(--border);overflow-x:auto">
            <table class="table-custom">
                <thead><tr><th>No. Pesanan</th><th>Tanggal</th><th>Total</th><th>Pembayaran</th><th>Status</th><th></th></tr></thead>
                <tbody>
                <?php foreach ($orders as $o) {
                    $ois = $db->prepare('SELECT * FROM order_items WHERE order_id=?');
                    $ois->execute([$o['id']]);
                    $ois = $ois->fetchAll();
                    $status_map = ['pending' => 'Menunggu', 'confirmed' => 'Dikonfirmasi', 'shipped' => 'Dikirim', 'delivered' => 'Selesai', 'cancelled' => 'Dibatalkan'];
                    ?>
                <tr>
                    <td><strong>#FLB-<?php echo str_pad($o['id'], 5, '0', STR_PAD_LEFT); ?></strong></td>
                    <td><?php echo date('d M Y', strtotime($o['created_at'])); ?></td>
                    <td><strong><?php echo rupiah($o['total']); ?></strong></td>
                    <td class="text-capitalize" style="font-size:.82rem"><?php echo $o['payment_method']; ?></td>
                    <td><span class="status-badge status-<?php echo $o['status']; ?>"><?php echo isset($status_map[$o['status']]) ? $status_map[$o['status']] : $o['status']; ?></span></td>
                    <td><button class="btn btn-sm btn-outline-custom btn-sm-custom" onclick="toggleDetail(<?php echo $o['id']; ?>)"><i class="fas fa-eye"></i></button></td>
                </tr>
                <tr id="detail-<?php echo $o['id']; ?>" style="display:none"><td colspan="6" style="background:var(--bg)">
                    <div class="p-3">
                        <?php foreach ($ois as $oi) { ?>
                        <div class="d-flex justify-content-between mb-1" style="font-size:.85rem"><span><?php echo e($oi['product_name']); ?> x<?php echo $oi['quantity']; ?></span><span><?php echo rupiah($oi['price'] * $oi['quantity']); ?></span></div>
                        <?php } ?>
                        <?php if ($o['customer_address']) { ?><div style="font-size:.82rem;color:var(--muted);margin-top:.5rem"><i class="fas fa-map-marker-alt me-1"></i><?php echo e($o['customer_address']); ?></div><?php } ?>
                    </div>
                </td></tr>
                <?php } ?>
                </tbody>
            </table>
        </div>
        <?php } ?>
    </div>
</section>

<?php
// ----- ADMIN: PRODUK -----
} elseif ($page === 'admin_products') {
    if (! isAdmin()) {
        header('Location: ?page=home');
        exit;
    }
    $all_products = $db->query('SELECT * FROM products ORDER BY id DESC')->fetchAll();
    ?>
<section class="section-padding">
    <div class="container" style="max-width:1100px">
        <div class="d-flex flex-wrap justify-content-between align-items-center mb-4">
            <div>
                <div class="section-line"></div>
                <h2 class="section-title" style="margin-bottom:0">Kelola Produk</h2>
            </div>
            <a href="?page=admin_add_product" class="btn-primary-custom"><i class="fas fa-plus"></i> Tambah Produk</a>
        </div>
        <div class="rounded overflow-hidden" style="background:var(--card);border:1px solid var(--border);overflow-x:auto">
            <table class="table-custom">
                <thead><tr><th>ID</th><th>Produk</th><th>Kategori</th><th>Harga</th><th>Stok</th><th>Aksi</th></tr></thead>
                <tbody>
                <?php foreach ($all_products as $ap) { ?>
                <tr>
                    <td><?php echo $ap['id']; ?></td>
                    <td><div class="d-flex align-items-center gap-2"><span style="font-size:1.5rem"><?php echo $ap['image']; ?></span><div><div style="font-weight:600;font-size:.88rem"><?php echo e($ap['name']); ?></div><div style="font-size:.75rem;color:var(--muted);max-width:250px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis"><?php echo e($ap['description']); ?></div></div></div></td>
                    <td><span style="font-size:.82rem"><?php echo e($ap['category']); ?></span></td>
                    <td><strong><?php echo rupiah($ap['price']); ?></strong></td>
                    <td><span style="font-weight:600;<?php echo $ap['stock'] < 10 ? 'color:#dc3545' : ''; ?>"><?php echo $ap['stock']; ?></span></td>
                    <td>
                        <div class="d-flex gap-1">
                            <a href="?page=admin_edit_product&id=<?php echo $ap['id']; ?>" class="btn btn-sm btn-outline-custom btn-sm-custom"><i class="fas fa-edit"></i></a>
                            <a href="?action=delete_product&id=<?php echo $ap['id']; ?>" class="btn btn-sm btn-danger-custom" onclick="return confirm('Hapus produk ini?')"><i class="fas fa-trash"></i></a>
                        </div>
                    </td>
                </tr>
                <?php } ?>
                </tbody>
            </table>
        </div>
    </div>
</section>

<?php
    // ----- ADMIN: TAMBAH PRODUK -----
} elseif ($page === 'admin_add_product') {
    if (! isAdmin()) {
        header('Location: ?page=home');
        exit;
    }
    $all_categories = ['Bunga Potong', 'Buket', 'Bunga Pot', 'Rangkaian'];
    $emoji_options = ['🌹', '🤍', '🌻', '🌷', '💐', '🦋', '🌼', '👰', '🌸', '🫧', '🌺', '🎂', '🩷', '🪴', '🌵', '💮', '🏵️', '🪻', '🌷', '🌱'];
    ?>
<section class="section-padding">
    <div class="container" style="max-width:600px">
        <div class="section-line"></div>
        <h2 class="section-title">Tambah Produk Baru</h2>
        <p class="section-sub">Isi data produk di bawah ini</p>
        <form method="post" class="p-4 rounded" style="background:var(--card);border:1px solid var(--border)">
            <input type="hidden" name="action" value="add_product">
            <div class="form-floating-custom"><label>Nama Produk</label><input type="text" name="name" required></div>
            <div class="form-floating-custom"><label>Deskripsi</label><textarea name="description" required></textarea></div>
            <div class="row g-3">
                <div class="col-md-6"><div class="form-floating-custom"><label>Harga (Rp)</label><input type="number" name="price" min="0" required></div></div>
                <div class="col-md-6"><div class="form-floating-custom"><label>Stok</label><input type="number" name="stock" min="0" value="50" required></div></div>
            </div>
            <div class="form-floating-custom"><label>Kategori</label><select name="category" required><?php foreach ($all_categories as $c) { ?><option value="<?php echo $c; ?>"><?php echo $c; ?></option><?php } ?></select></div>
            <div class="form-floating-custom">
                <label>Ikon Produk</label>
                <div class="d-flex flex-wrap gap-2 p-2 rounded" style="border:1.5px solid var(--border);background:var(--bg)" id="emojiPicker">
                    <?php foreach ($emoji_options as $em) { ?>
                    <label style="cursor:pointer;font-size:1.5rem;padding:.3rem;border-radius:8px;transition:all .2s" class="emoji-opt">
                        <input type="radio" name="image" value="<?php echo $em; ?>" <?php echo $em === '🌹' ? 'checked' : ''; ?> style="display:none">
                        <span><?php echo $em; ?></span>
                    </label>
                    <?php } ?>
                </div>
            </div>
            <div class="d-flex gap-2 mt-3">
                <button type="submit" class="btn-primary-custom"><i class="fas fa-save"></i> Simpan Produk</button>
                <a href="?page=admin_products" class="btn-outline-custom">Batal</a>
            </div>
        </form>
    </div>
</section>

<?php
    // ----- ADMIN: EDIT PRODUK -----
} elseif ($page === 'admin_edit_product') {
    if (! isAdmin()) {
        header('Location: ?page=home');
        exit;
    }
    $edit_id = (int) ($_GET['id'] ?? 0);
    $ep = $db->prepare('SELECT * FROM products WHERE id=?');
    $ep->execute([$edit_id]);
    $ep = $ep->fetch();
    if (! $ep) {
        header('Location: ?page=admin_products');
        exit;
    }
    $all_categories = ['Bunga Potong', 'Buket', 'Bunga Pot', 'Rangkaian'];
    $emoji_options = ['🌹', '🤍', '🌻', '🌷', '💐', '🦋', '🌼', '👰', '🌸', '🫧', '🌺', '🎂', '🩷', '🪴', '🌵', '💮', '🏵️', '🪻', '🌷', '🌱'];
    ?>
<section class="section-padding">
    <div class="container" style="max-width:600px">
        <div class="section-line"></div>
        <h2 class="section-title">Edit Produk</h2>
        <p class="section-sub">#<?php echo $ep['id']; ?> - <?php echo e($ep['name']); ?></p>
        <form method="post" class="p-4 rounded" style="background:var(--card);border:1px solid var(--border)">
            <input type="hidden" name="action" value="edit_product">
            <input type="hidden" name="id" value="<?php echo $ep['id']; ?>">
            <div class="form-floating-custom"><label>Nama Produk</label><input type="text" name="name" value="<?php echo e($ep['name']); ?>" required></div>
            <div class="form-floating-custom"><label>Deskripsi</label><textarea name="description" required><?php echo e($ep['description']); ?></textarea></div>
            <div class="row g-3">
                <div class="col-md-6"><div class="form-floating-custom"><label>Harga (Rp)</label><input type="number" name="price" min="0" value="<?php echo $ep['price']; ?>" required></div></div>
                <div class="col-md-6"><div class="form-floating-custom"><label>Stok</label><input type="number" name="stock" min="0" value="<?php echo $ep['stock']; ?>" required></div></div>
            </div>
            <div class="form-floating-custom"><label>Kategori</label><select name="category" required><?php foreach ($all_categories as $c) { ?><option value="<?php echo $c; ?>" <?php echo $ep['category'] === $c ? 'selected' : ''; ?>><?php echo $c; ?></option><?php } ?></select></div>
            <div class="form-floating-custom">
                <label>Ikon Produk</label>
                <div class="d-flex flex-wrap gap-2 p-2 rounded" style="border:1.5px solid var(--border);background:var(--bg)" id="emojiPicker">
                    <?php foreach ($emoji_options as $em) { ?>
                    <label style="cursor:pointer;font-size:1.5rem;padding:.3rem;border-radius:8px;transition:all .2s" class="emoji-opt">
                        <input type="radio" name="image" value="<?php echo $em; ?>" <?php echo $ep['image'] === $em ? 'checked' : ''; ?> style="display:none">
                        <span><?php echo $em; ?></span>
                    </label>
                    <?php } ?>
                </div>
            </div>
            <div class="d-flex gap-2 mt-3">
                <button type="submit" class="btn-primary-custom"><i class="fas fa-save"></i> Perbarui Produk</button>
                <a href="?page=admin_products" class="btn-outline-custom">Batal</a>
            </div>
        </form>
    </div>
</section>

<?php
    // ----- ADMIN: PESANAN -----
} elseif ($page === 'admin_orders') {
    if (! isAdmin()) {
        header('Location: ?page=home');
        exit;
    }
    $all_orders = $db->query('SELECT o.*, u.username FROM orders o LEFT JOIN users u ON o.user_id=u.id ORDER BY o.id DESC')->fetchAll();
    $status_options = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];
    ?>
<section class="section-padding">
    <div class="container" style="max-width:1100px">
        <div class="section-line"></div>
        <h2 class="section-title">Kelola Pesanan</h2>
        <p class="section-sub"><?php echo count($all_orders); ?> pesanan masuk</p>
        <?php if (empty($all_orders)) { ?>
        <div class="empty-state"><i class="fas fa-inbox"></i><h4>Belum ada pesanan</h4></div>
        <?php } else { ?>
        <div class="rounded overflow-hidden" style="background:var(--card);border:1px solid var(--border);overflow-x:auto">
            <table class="table-custom">
                <thead><tr><th>No. Pesanan</th><th>Customer</th><th>Tanggal</th><th>Total</th><th>Bayar</th><th>Status</th><th>Aksi</th></tr></thead>
                <tbody>
                <?php foreach ($all_orders as $ao) {
                    $aois = $db->prepare('SELECT * FROM order_items WHERE order_id=?');
                    $aois->execute([$ao['id']]);
                    $aois = $aois->fetchAll();
                    ?>
                <tr>
                    <td><strong>#FLB-<?php echo str_pad($ao['id'], 5, '0', STR_PAD_LEFT); ?></strong></td>
                    <td><?php echo e($ao['customer_name'] ?: $ao['username']); ?></td>
                    <td><?php echo date('d M Y H:i', strtotime($ao['created_at'])); ?></td>
                    <td><strong><?php echo rupiah($ao['total']); ?></strong></td>
                    <td class="text-capitalize" style="font-size:.82rem"><?php echo $ao['payment_method']; ?></td>
                    <td><span class="status-badge status-<?php echo $ao['status']; ?>"><?php echo $ao['status']; ?></span></td>
                    <td>
                        <div class="d-flex gap-1 align-items-center">
                            <form method="post" class="d-flex gap-1 align-items-center">
                                <input type="hidden" name="action" value="update_order_status">
                                <input type="hidden" name="order_id" value="<?php echo $ao['id']; ?>">
                                <select name="status" class="form-select form-select-sm" style="font-size:.78rem;width:auto;padding:.2rem .5rem;border-radius:6px">
                                    <?php foreach ($status_options as $so) { ?><option value="<?php echo $so; ?>" <?php echo $ao['status'] === $so ? 'selected' : ''; ?>><?php echo $so; ?></option><?php } ?>
                                </select>
                                <button type="submit" class="btn btn-sm btn-primary-custom btn-sm-custom" style="padding:.2rem .5rem"><i class="fas fa-check"></i></button>
                            </form>
                            <button class="btn btn-sm btn-outline-custom btn-sm-custom" onclick="toggleDetail(<?php echo $ao['id']; ?>)"><i class="fas fa-eye"></i></button>
                        </div>
                    </td>
                </tr>
                <tr id="detail-<?php echo $ao['id']; ?>" style="display:none"><td colspan="7" style="background:var(--bg)">
                    <div class="p-3">
                        <?php foreach ($aois as $oi) { ?>
                        <div class="d-flex justify-content-between mb-1" style="font-size:.85rem"><span><?php echo e($oi['product_name']); ?> x<?php echo $oi['quantity']; ?></span><span><?php echo rupiah($oi['price'] * $oi['quantity']); ?></span></div>
                        <?php } ?>
                        <?php if ($ao['customer_phone']) { ?><div style="font-size:.82rem;color:var(--muted);margin-top:.5rem"><i class="fas fa-phone me-1"></i><?php echo e($ao['customer_phone']); ?></div><?php } ?>
                        <?php if ($ao['customer_address']) { ?><div style="font-size:.82rem;color:var(--muted)"><i class="fas fa-map-marker-alt me-1"></i><?php echo e($ao['customer_address']); ?></div><?php } ?>
                        <?php if ($ao['notes']) { ?><div style="font-size:.82rem;color:var(--muted)"><i class="fas fa-sticky-note me-1"></i><?php echo e($ao['notes']); ?></div><?php } ?>
                    </div>
                </td></tr>
                <?php } ?>
                </tbody>
            </table>
        </div>
        <?php } ?>
    </div>
</section>

<?php } else { ?>
<section class="section-padding"><div class="container text-center"><h2>Halaman tidak ditemukan</h2><a href="?page=home" class="btn-primary-custom mt-3">Kembali ke Beranda</a></div></section>
<?php } ?>

<!-- FOOTER -->
<footer class="footer">
    <div class="container">
        <div class="row g-4">
            <div class="col-lg-4">
                <div class="nav-brand d-inline-flex mb-3" style="color:#fff;font-size:1.4rem"><i class="fas fa-seedling"></i> Flora<span>Belle</span></div>
                <p style="font-size:.88rem;max-width:300px">Toko bunga premium dengan koleksi terbaik untuk setiap momen spesial dalam hidup Anda.</p>
                <div class="d-flex gap-3 mt-3">
                    <a href="#" style="width:36px;height:36px;border-radius:50%;background:rgba(255,255,255,0.1);display:flex;align-items:center;justify-content:center"><i class="fab fa-instagram"></i></a>
                    <a href="#" style="width:36px;height:36px;border-radius:50%;background:rgba(255,255,255,0.1);display:flex;align-items:center;justify-content:center"><i class="fab fa-whatsapp"></i></a>
                    <a href="#" style="width:36px;height:36px;border-radius:50%;background:rgba(255,255,255,0.1);display:flex;align-items:center;justify-content:center"><i class="fab fa-tiktok"></i></a>
                </div>
            </div>
            <div class="col-lg-2 col-6">
                <h5>Navigasi</h5>
                <div class="d-flex flex-column gap-2" style="font-size:.88rem">
                    <a href="?page=home">Beranda</a>
                    <a href="?page=home#products">Katalog</a>
                    <a href="?page=cart">Keranjang</a>
                    <a href="?page=orders">Pesanan</a>
                </div>
            </div>
            <div class="col-lg-3 col-6">
                <h5>Kategori</h5>
                <div class="d-flex flex-column gap-2" style="font-size:.88rem">
                    <a href="?page=home&category=Bunga+Potong">Bunga Potong</a>
                    <a href="?page=home&category=Buket">Buket</a>
                    <a href="?page=home&category=Bunga+Pot">Bunga Pot</a>
                    <a href="?page=home&category=Rangkaian">Rangkaian</a>
                </div>
            </div>
            <div class="col-lg-3">
                <h5>Kontak</h5>
                <div class="d-flex flex-column gap-2" style="font-size:.88rem">
                    <span><i class="fas fa-map-marker-alt me-2"></i>Jl. Bunga Melati No. 88, Jakarta Selatan</span>
                    <span><i class="fas fa-phone me-2"></i>0812-3456-7890</span>
                    <span><i class="fas fa-envelope me-2"></i>halo@florabelle.com</span>
                    <span><i class="fas fa-clock me-2"></i>Setiap hari, 08:00 - 21:00</span>
                </div>
            </div>
        </div>
        <div class="footer-bottom">&copy; <?php echo date('Y'); ?> FloraBelle. Semua hak dilindungi.</div>
    </div>
</footer>

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
<script>
var navbar = document.getElementById('navbar');
window.addEventListener('scroll', function() {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
});

var fadeEls = document.querySelectorAll('.fade-up');
if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry, i) {
            if (entry.isIntersecting) {
                setTimeout(function() { entry.target.classList.add('visible'); }, i * 80);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    fadeEls.forEach(function(el) { observer.observe(el); });
} else {
    fadeEls.forEach(function(el) { el.classList.add('visible'); });
}

function changeQty(btn, delta) {
    var input = btn.parentElement.querySelector('input[type="number"]');
    var val = parseInt(input.value) + delta;
    var max = parseInt(input.max) || 999;
    if (val < 0) val = 0;
    if (val > max) val = max;
    input.value = val;
}

function toggleDetail(id) {
    var row = document.getElementById('detail-' + id);
    row.style.display = row.style.display === 'none' ? '' : 'none';
}

document.querySelectorAll('.emoji-opt').forEach(function(label) {
    var radio = label.querySelector('input');
    function update() {
        label.style.background = radio.checked ? 'rgba(45,90,61,0.12)' : 'transparent';
        label.style.transform = radio.checked ? 'scale(1.15)' : 'scale(1)';
    }
    radio.addEventListener('change', update);
    update();
});

document.querySelectorAll('.payment-option').forEach(function(opt) {
    var radio = opt.querySelector('input[type="radio"]');
    radio.addEventListener('change', function() {
        document.querySelectorAll('.payment-option').forEach(function(o) { o.classList.remove('selected'); });
        opt.classList.add('selected');
    });
    if (radio.checked) opt.classList.add('selected');
});

setTimeout(function() {
    var toasts = document.querySelectorAll('.toast-msg');
    toasts.forEach(function(t) {
        t.style.opacity = '0';
        t.style.transform = 'translateX(100%)';
        t.style.transition = 'all .4s';
        setTimeout(function() { t.remove(); }, 400);
    });
}, 3500);
</script>
</body>
</html>