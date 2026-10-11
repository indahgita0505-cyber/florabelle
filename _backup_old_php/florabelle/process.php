<?php
require_once 'config.php';

$action = isset($_POST['action']) ? $_POST['action'] : (isset($_GET['action']) ? $_GET['action'] : '');

// LOGIN
if ($action === 'login') {
    $stmt = $db->prepare("SELECT * FROM users WHERE email = ?");
    $stmt->execute([$_POST['email']]);
    $u = $stmt->fetch(PDO::FETCH_ASSOC);
    if ($u && password_verify($_POST['password'], $u['password'])) {
        $_SESSION['user_id'] = $u['id'];
        $_SESSION['username'] = $u['username'];
        $_SESSION['role'] = $u['role'];
        toast("Selamat datang, " . $u['username'] . "!");
        redirect($u['role'] === 'admin' ? 'admin/index.php' : 'home.php');
    } else {
        $_SESSION['error'] = "Email atau password salah!";
        redirect('login.php');
    }
}

// REGISTER
if ($action === 'register') {
    if ($_POST['password'] !== $_POST['confirm_password']) {
        $_SESSION['error'] = "Password tidak cocok!";
        redirect('register.php');
    }
    $stmt = $db->prepare("SELECT id FROM users WHERE email=? OR username=?");
    $stmt->execute([$_POST['email'], $_POST['username']]);
    if ($stmt->fetch()) {
        $_SESSION['error'] = "Email atau username sudah terdaftar!";
        redirect('register.php');
    }
    $db->prepare("INSERT INTO users (username, email, password) VALUES (?,?,?)")
        ->execute([$_POST['username'], $_POST['email'], password_hash($_POST['password'], PASSWORD_DEFAULT)]);
    toast("Registrasi berhasil! Silakan login.");
    redirect('login.php');
}

// LOGOUT
if ($action === 'logout') {
    session_destroy();
    redirect('home.php');
}

// TAMBAH KERANJANG
if ($action === 'add_to_cart') {
    if (!isLoggedIn()) {
        toast("Silakan login dulu.", 'warning');
        redirect('login.php');
    }
    $pid = (int)$_POST['product_id'];
    $qty = (int)$_POST['quantity'];
    $stmt = $db->prepare("SELECT id, quantity FROM cart WHERE user_id=? AND product_id=?");
    $stmt->execute([$_SESSION['user_id'], $pid]);
    $ex = $stmt->fetch();
    if ($ex) {
        $db->prepare("UPDATE cart SET quantity = quantity + ? WHERE id = ?")->execute([$qty, $ex['id']]);
    } else {
        $db->prepare("INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?)")->execute([$_SESSION['user_id'], $pid, $qty]);
    }
    toast("Ditambahkan ke keranjang!");
    redirect($_POST['redirect'] ?: 'home.php');
}

// UPDATE KERANJANG (untuk AJAX dari cart.php)
if ($action === 'update_cart') {
    if (!isLoggedIn()) die('Unauthorized');
    $cart_id = (int)$_POST['cart_id'];
    $qty = (int)$_POST['quantity'];
    $stmt = $db->prepare("UPDATE cart SET quantity = ? WHERE id = ? AND user_id = ?");
    $stmt->execute([$qty, $cart_id, $_SESSION['user_id']]);
    die('OK');
}

// PROSES CHECKOUT (dari halaman checkout)
if ($action === 'process_checkout') {
    if (!isLoggedIn()) redirect('login.php');
    // Ambil item dari session yang disimpan di checkout.php
    $selected_cart_ids = $_SESSION['checkout_items'] ?? [];
    if (empty($selected_cart_ids)) {
        toast("Tidak ada item dipilih.", 'error');
        redirect('cart.php');
    }
    $placeholders = implode(',', array_fill(0, count($selected_cart_ids), '?'));
    $stmt = $db->prepare("SELECT c.*, p.name, p.price, p.stock FROM cart c JOIN products p ON c.product_id = p.id WHERE c.id IN ($placeholders) AND c.user_id = ?");
    $params = array_merge($selected_cart_ids, [$_SESSION['user_id']]);
    $stmt->execute($params);
    $items = $stmt->fetchAll();
    if (empty($items)) {
        toast("Keranjang kosong.", 'error');
        redirect('cart.php');
    }
    $total = 0;
    foreach ($items as $i) $total += $i['price'] * $i['quantity'];

    $payment_method = $_POST['payment_method'];
    $ewallet_number = ($payment_method == 'ewallet') ? trim($_POST['ewallet_number'] ?? '') : null;
    if ($payment_method == 'ewallet' && empty($ewallet_number)) {
        toast("Nomor e-wallet harus diisi.", 'error');
        redirect('checkout.php');
    }

    // Simpan order
    $stmt = $db->prepare("INSERT INTO orders (user_id, total, payment_method, customer_name, customer_phone, customer_address, notes, status, created_at) VALUES (?,?,?,?,?,?,?,'pending', NOW())");
    $stmt->execute([
        $_SESSION['user_id'],
        $total,
        $payment_method . ($ewallet_number ? " ($ewallet_number)" : ''),
        $_POST['customer_name'],
        $_POST['customer_phone'],
        $_POST['customer_address'],
        $_POST['notes']
    ]);
    $order_id = $db->lastInsertId();

    $stmt2 = $db->prepare("INSERT INTO order_items (order_id, product_id, product_name, price, quantity) VALUES (?,?,?,?,?)");
    foreach ($items as $i) {
        $stmt2->execute([$order_id, $i['product_id'], $i['name'], $i['price'], $i['quantity']]);
        $db->prepare("UPDATE products SET stock = stock - ? WHERE id = ?")->execute([$i['quantity'], $i['product_id']]);
    }
    // Hapus item yang sudah diproses dari cart
    $db->prepare("DELETE FROM cart WHERE id IN ($placeholders) AND user_id = ?")->execute(array_merge($selected_cart_ids, [$_SESSION['user_id']]));
    // Hapus session checkout
    unset($_SESSION['checkout_items']);

    toast("Pesanan berhasil!", 'success');
    redirect('order_success.php?oid=' . $order_id);
}

// BELI LANGSUNG -> redirect ke halaman checkout dengan product_id
if ($action === 'buy_now') {
    if (!isLoggedIn()) { 
        toast("Silakan login dulu.", 'warning'); 
        redirect('login.php'); 
    }
    $product_id = (int)$_POST['product_id'];
    // Cek apakah produk ada
    $stmt = $db->prepare("SELECT id FROM products WHERE id = ?");
    $stmt->execute([$product_id]);
    if (!$stmt->fetch()) {
        toast("Produk tidak ditemukan.", 'error');
        redirect('home.php');
    }
    // Redirect ke checkout.php dengan bawa product_id
    redirect('checkout.php?product_id=' . $product_id);
}

// PROSES PEMBAYARAN LANGSUNG (buy now)
if ($action === 'process_buy_now') {
    if (!isLoggedIn()) redirect('login.php');

    $product_id = (int)$_POST['product_id'];
    $quantity = 1;

    $stmt = $db->prepare("SELECT * FROM products WHERE id = ?");
    $stmt->execute([$product_id]);
    $product = $stmt->fetch();
    if (!$product || $product['stock'] < $quantity) {
        toast("Produk tidak tersedia atau stok habis.", 'error');
        redirect('home.php');
    }

    $customer_name    = $_POST['customer_name'] ?? '';
    $customer_phone   = $_POST['customer_phone'] ?? '';
    $customer_address = $_POST['customer_address'] ?? '';
    $payment_method   = $_POST['payment_method'] ?? 'cash';
    $notes            = $_POST['notes'] ?? '';
    $total = $product['price'] * $quantity;

    $stmt = $db->prepare("INSERT INTO orders (user_id, total, payment_method, customer_name, customer_phone, customer_address, notes, status, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, 'pending', NOW())");
    $stmt->execute([$_SESSION['user_id'], $total, $payment_method, $customer_name, $customer_phone, $customer_address, $notes]);
    $order_id = $db->lastInsertId();

    $stmt = $db->prepare("INSERT INTO order_items (order_id, product_id, product_name, price, quantity) VALUES (?, ?, ?, ?, ?)");
    $stmt->execute([$order_id, $product_id, $product['name'], $product['price'], $quantity]);

    $db->prepare("UPDATE products SET stock = stock - ? WHERE id = ?")->execute([$quantity, $product_id]);

    if (isset($_SESSION['buy_now_product'])) unset($_SESSION['buy_now_product']);

    redirect('order_success.php?oid=' . $order_id);
}

// UPDATE KERANJANG via AJAX
if ($action === 'update_cart') {
    if (!isLoggedIn()) die('Unauthorized');
    $cart_id = (int)$_POST['cart_id'];
    $qty = (int)$_POST['quantity'];
    $db->prepare("UPDATE cart SET quantity = ? WHERE id = ? AND user_id = ?")->execute([$qty, $cart_id, $_SESSION['user_id']]);
    die('OK');
}

// PROSES CHECKOUT DARI KERANJANG (dengan item yang dipilih)
if ($action === 'process_checkout') {
    if (!isLoggedIn()) redirect('login.php');
    $selected_cart_ids = $_SESSION['checkout_items'] ?? [];
    if (empty($selected_cart_ids)) {
        toast("Tidak ada item dipilih.", 'error');
        redirect('cart.php');
    }
    $placeholders = implode(',', array_fill(0, count($selected_cart_ids), '?'));
    $stmt = $db->prepare("SELECT c.*, p.name, p.price, p.stock FROM cart c JOIN products p ON c.product_id = p.id WHERE c.id IN ($placeholders) AND c.user_id = ?");
    $params = array_merge($selected_cart_ids, [$_SESSION['user_id']]);
    $stmt->execute($params);
    $items = $stmt->fetchAll();
    if (empty($items)) redirect('cart.php');
    $total = 0;
    foreach ($items as $i) $total += $i['price'] * $i['quantity'];

    $payment_method = $_POST['payment_method'];
    if ($payment_method == 'ewallet') {
        $ewallet_type = $_POST['ewallet_type'];
        $payment_method = "E-Wallet ($ewallet_type) - Transfer ke nomor penjual";
    }
    $stmt = $db->prepare("INSERT INTO orders (user_id, total, payment_method, customer_name, customer_phone, customer_address, notes, status, created_at) VALUES (?,?,?,?,?,?,?,'pending', NOW())");
    $stmt->execute([$_SESSION['user_id'], $total, $payment_method, $_POST['customer_name'], $_POST['customer_phone'], $_POST['customer_address'], $_POST['notes']]);
    $order_id = $db->lastInsertId();
    $stmt2 = $db->prepare("INSERT INTO order_items (order_id, product_id, product_name, price, quantity) VALUES (?,?,?,?,?)");
    foreach ($items as $i) {
        $stmt2->execute([$order_id, $i['product_id'], $i['name'], $i['price'], $i['quantity']]);
        $db->prepare("UPDATE products SET stock = stock - ? WHERE id = ?")->execute([$i['quantity'], $i['product_id']]);
    }
    $db->prepare("DELETE FROM cart WHERE id IN ($placeholders) AND user_id = ?")->execute(array_merge($selected_cart_ids, [$_SESSION['user_id']]));
    unset($_SESSION['checkout_items']);
    toast("Pesanan berhasil! Silakan lakukan pembayaran sesuai instruksi.", 'success');
    redirect("order_success.php?oid=$order_id");
}

// HAPUS ITEM KERANJANG
if ($action === 'remove_cart') {
    if (!isLoggedIn()) redirect('login.php');
    $id = (int)$_GET['id'];
    $db->prepare("DELETE FROM cart WHERE id = ? AND user_id = ?")->execute([$id, $_SESSION['user_id']]);
    toast("Item dihapus", "success");
    redirect('cart.php');  // <-- ini penting
}

// PROSES BELI LANGSUNG (sama seperti sebelumnya, tapi dengan e-wallet juga)
if ($action === 'process_buy_now') {
    if (!isLoggedIn()) redirect('login.php');
    $product_id = (int)$_POST['product_id'];
    $quantity = 1;
    $stmt = $db->prepare("SELECT * FROM products WHERE id = ?");
    $stmt->execute([$product_id]);
    $product = $stmt->fetch();
    if (!$product || $product['stock'] < $quantity) {
        toast("Produk tidak tersedia.", 'error');
        redirect('home.php');
    }
    $payment_method = $_POST['payment_method'];
    if ($payment_method == 'ewallet') {
        $ewallet_type = $_POST['ewallet_type'];
        $payment_method = "E-Wallet ($ewallet_type) - Transfer ke nomor penjual";
    }
    $total = $product['price'] * $quantity;
    $stmt = $db->prepare("INSERT INTO orders (user_id, total, payment_method, customer_name, customer_phone, customer_address, notes, status, created_at) VALUES (?,?,?,?,?,?,?,'pending', NOW())");
    $stmt->execute([$_SESSION['user_id'], $total, $payment_method, $_POST['customer_name'], $_POST['customer_phone'], $_POST['customer_address'], $_POST['notes']]);
    $order_id = $db->lastInsertId();
    $stmt = $db->prepare("INSERT INTO order_items (order_id, product_id, product_name, price, quantity) VALUES (?,?,?,?,?)");
    $stmt->execute([$order_id, $product_id, $product['name'], $product['price'], $quantity]);
    $db->prepare("UPDATE products SET stock = stock - ? WHERE id = ?")->execute([$quantity, $product_id]);
    toast("Pesanan berhasil! Silakan transfer sesuai instruksi.", 'success');
    redirect("order_success.php?oid=$order_id");
}

// PEMBATALAN PESANAN OLEH PEMBELI
if ($action === 'cancel_order') {
    if (!isLoggedIn()) {
        toast("Silakan login dulu.", 'warning');
        redirect('login.php');
    }
    $order_id = (int)$_GET['id'];
    // Cek kepemilikan pesanan dan status
    $stmt = $db->prepare("SELECT * FROM orders WHERE id = ? AND user_id = ?");
    $stmt->execute([$order_id, $_SESSION['user_id']]);
    $order = $stmt->fetch();
    if (!$order) {
        toast("Pesanan tidak ditemukan.", 'error');
        redirect('orders.php');
    }
    if (!in_array($order['status'], ['pending', 'confirmed'])) {
        toast("Pesanan tidak dapat dibatalkan karena sudah diproses/dikirim.", 'error');
        redirect('orders.php');
    }
    
    // Kembalikan stok produk
    $stmt2 = $db->prepare("SELECT product_id, quantity FROM order_items WHERE order_id = ?");
    $stmt2->execute([$order_id]);
    $items = $stmt2->fetchAll();
    foreach ($items as $item) {
        $db->prepare("UPDATE products SET stock = stock + ? WHERE id = ?")->execute([$item['quantity'], $item['product_id']]);
    }
    
    // Update status menjadi cancelled
    $db->prepare("UPDATE orders SET status = 'cancelled' WHERE id = ?")->execute([$order_id]);
    
    // Cek metode pembayaran: jika sudah transfer/e-wallet, beri catatan refund
    $payment = strtolower($order['payment_method']);
    $refund_note = "";
    if (strpos($payment, 'ewallet') !== false || strpos($payment, 'transfer') !== false || strpos($payment, 'bank') !== false) {
        $refund_note = "Karena Anda sudah melakukan pembayaran via e-wallet/transfer, dana akan dikembalikan dalam 1x24 jam ke akun Anda. Terima kasih.";
    } else {
        $refund_note = "Pesanan berhasil dibatalkan. Tidak ada tagihan karena metode pembayaran belum dilakukan.";
    }
    
    toast("Pesanan dibatalkan. " . $refund_note, 'success');
    redirect('orders.php');
}

// ADMIN: TAMBAH PRODUK
if ($action === 'add_product' && isAdmin()) {
    $image_url = trim($_POST['image_url'] ?? '');
    if (isset($_FILES['product_image']) && $_FILES['product_image']['error'] === UPLOAD_ERR_OK) {
        $allowed = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
        $ext = strtolower(pathinfo($_FILES['product_image']['name'], PATHINFO_EXTENSION));
        if (in_array($ext, $allowed)) {
            $filename = time() . '_' . uniqid() . '.' . $ext;
            $target = '../uploads/' . $filename;
            if (!is_dir('../uploads')) mkdir('../uploads', 0777, true);
            if (move_uploaded_file($_FILES['product_image']['tmp_name'], $target)) {
                $image_url = 'uploads/' . $filename;
            } else {
                toast("Gagal upload gambar.", 'error');
                redirect('admin/product_form.php');
            }
        } else {
            toast("Format file tidak didukung (JPG, PNG, GIF, WEBP).", 'error');
            redirect('admin/product_form.php');
        }
    }

    $stmt = $db->prepare("INSERT INTO products (name, description, price, image, image_url, category, stock) VALUES (?,?,?,?,?,?,?)");
    $stmt->execute([
        $_POST['name'],
        $_POST['description'],
        (float)$_POST['price'],
        $_POST['image'] ?? '🌹',
        $image_url,
        $_POST['category'],
        (int)$_POST['stock']
    ]);
    toast("Produk berhasil ditambahkan!", 'success');
    redirect('admin/products.php');
}

// ADMIN: EDIT PRODUK
if ($action === 'edit_product' && isAdmin()) {
    $id = (int)$_POST['id'];
    $stmt = $db->prepare("SELECT image_url FROM products WHERE id = ?");
    $stmt->execute([$id]);
    $old = $stmt->fetch();

    $image_url = trim($_POST['image_url'] ?? '');
    if (isset($_FILES['product_image']) && $_FILES['product_image']['error'] === UPLOAD_ERR_OK) {
        $allowed = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
        $ext = strtolower(pathinfo($_FILES['product_image']['name'], PATHINFO_EXTENSION));
        if (in_array($ext, $allowed)) {
            $filename = time() . '_' . uniqid() . '.' . $ext;
            $target = '../uploads/' . $filename;
            if (!is_dir('../uploads')) mkdir('../uploads', 0777, true);
            if (move_uploaded_file($_FILES['product_image']['tmp_name'], $target)) {
                if (!empty($old['image_url']) && file_exists('../' . $old['image_url'])) {
                    unlink('../' . $old['image_url']);
                }
                $image_url = 'uploads/' . $filename;
            } else {
                toast("Gagal upload gambar baru.", 'error');
                redirect('admin/product_form.php?id=' . $id);
            }
        } else {
            toast("Format file tidak didukung.", 'error');
            redirect('admin/product_form.php?id=' . $id);
        }
    } else {
        if (empty($image_url) && !empty($old['image_url'])) {
            $image_url = $old['image_url'];
        }
    }

    $stmt = $db->prepare("UPDATE products SET name=?, description=?, price=?, image=?, image_url=?, category=?, stock=? WHERE id=?");
    $stmt->execute([
        $_POST['name'],
        $_POST['description'],
        (float)$_POST['price'],
        $_POST['image'] ?? '🌹',
        $image_url,
        $_POST['category'],
        (int)$_POST['stock'],
        $id
    ]);
    toast("Produk berhasil diperbarui!", 'success');
    redirect('admin/products.php');
}

// ADMIN: HAPUS PRODUK (juga hapus file gambar)
if ($action === 'delete_product' && isAdmin()) {
    $id = (int)$_GET['id'];
    $stmt = $db->prepare("SELECT image_url FROM products WHERE id = ?");
    $stmt->execute([$id]);
    $p = $stmt->fetch();
    if ($p && !empty($p['image_url']) && file_exists('../' . $p['image_url'])) {
        unlink('../' . $p['image_url']);
    }
    $db->prepare("DELETE FROM products WHERE id = ?")->execute([$id]);
    toast("Produk dihapus!", 'success');
    redirect('admin/products.php');
}

// ADMIN: UPDATE STATUS PESANAN
if ($action === 'update_order_status' && isAdmin()) {
    $db->prepare("UPDATE orders SET status = ? WHERE id = ?")->execute([$_POST['status'], $_POST['order_id']]);
    toast("Status diperbarui!");
    redirect('admin/orders.php');
}

// ADMIN: PROMO / KUPON
if ($action === 'add_promo' && isAdmin()) {
    $code = trim($_POST['code']);
    $discount_type = $_POST['discount_type'];
    $discount_value = (float)$_POST['discount_value'];
    $valid_from = $_POST['valid_from'];
    $valid_until = $_POST['valid_until'];
    $min_purchase = (float)($_POST['min_purchase'] ?? 0);
    $usage_limit = !empty($_POST['usage_limit']) ? (int)$_POST['usage_limit'] : null;
    $active = isset($_POST['active']) ? 1 : 0;

    $stmt = $db->prepare("SELECT id FROM promos WHERE code = ?");
    $stmt->execute([$code]);
    if ($stmt->fetch()) {
        toast("Kode promo sudah ada!", 'error');
        redirect('admin/customers_promos.php');
    }

    $stmt = $db->prepare("INSERT INTO promos (code, discount_type, discount_value, valid_from, valid_until, min_purchase, usage_limit, active) VALUES (?,?,?,?,?,?,?,?)");
    $stmt->execute([$code, $discount_type, $discount_value, $valid_from, $valid_until, $min_purchase, $usage_limit, $active]);
    toast("Kupon berhasil ditambahkan!", 'success');
    redirect('admin/customers_promos.php');
}

if ($action === 'edit_promo' && isAdmin()) {
    $id = (int)$_POST['id'];
    $code = trim($_POST['code']);
    $discount_type = $_POST['discount_type'];
    $discount_value = (float)$_POST['discount_value'];
    $valid_from = $_POST['valid_from'];
    $valid_until = $_POST['valid_until'];
    $min_purchase = (float)($_POST['min_purchase'] ?? 0);
    $usage_limit = !empty($_POST['usage_limit']) ? (int)$_POST['usage_limit'] : null;
    $active = isset($_POST['active']) ? 1 : 0;

    $stmt = $db->prepare("SELECT id FROM promos WHERE code = ? AND id != ?");
    $stmt->execute([$code, $id]);
    if ($stmt->fetch()) {
        toast("Kode promo sudah dipakai promo lain!", 'error');
        redirect('admin/customers_promos.php');
    }

    $stmt = $db->prepare("UPDATE promos SET code=?, discount_type=?, discount_value=?, valid_from=?, valid_until=?, min_purchase=?, usage_limit=?, active=? WHERE id=?");
    $stmt->execute([$code, $discount_type, $discount_value, $valid_from, $valid_until, $min_purchase, $usage_limit, $active, $id]);
    toast("Kupon diperbarui!", 'success');
    redirect('admin/customers_promos.php');
}

if ($action === 'delete_promo' && isAdmin()) {
    $id = (int)$_GET['id'];
    $db->prepare("DELETE FROM promos WHERE id = ?")->execute([$id]);
    toast("Kupon dihapus!", 'success');
    redirect('admin/customers_promos.php');
}

// ADMIN: Update stok satuan (tangkai)
if ($action === 'update_unit_stock' && isAdmin()) {
    $product_id = (int)$_POST['product_id'];
    $stock_units = (int)$_POST['stock_units'];
    $stmt = $db->prepare("SELECT id FROM product_stock_details WHERE product_id = ?");
    $stmt->execute([$product_id]);
    if ($stmt->fetch()) {
        $db->prepare("UPDATE product_stock_details SET stock_units = ? WHERE product_id = ?")->execute([$stock_units, $product_id]);
    } else {
        $db->prepare("INSERT INTO product_stock_details (product_id, unit_type, unit_quantity, stock_units) VALUES (?, 'tangkai', 1, ?)")->execute([$product_id, $stock_units]);
    }
    toast("Stok satuan diperbarui", "success");
    redirect("admin/reports_stock.php");
}

// DEFAULT REDIRECT (jika tidak ada action yang cocok)
redirect('home.php');