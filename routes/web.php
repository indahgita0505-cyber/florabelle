<?php

use App\Http\Controllers\AdminBouquetOptionController;
use App\Http\Controllers\AdminCustomerController;
use App\Http\Controllers\AdminDashboardController;
use App\Http\Controllers\AdminDataMiningController;
use App\Http\Controllers\AdminOrderController;
use App\Http\Controllers\AdminPaymentController;
use App\Http\Controllers\AdminProductController;
use App\Http\Controllers\AdminSettingController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\CustomBouquetController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ProfileController;
use App\Models\Cart;
use App\Models\Order;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware(['auth', 'admin'])->group(function () {
    Route::get('/admin/dashboard', [AdminDashboardController::class, 'index'])->name('admin.dashboard');

    Route::get('/admin/settings', [AdminSettingController::class, 'index'])->name('admin.settings.index');
    Route::post('/admin/settings', [AdminSettingController::class, 'update'])->name('admin.settings.update');

    Route::get('/admin/customers', [AdminCustomerController::class, 'index'])->name('admin.customers.index');

    Route::get('/admin/payments', [AdminPaymentController::class, 'index'])->name('admin.payments.index');
    Route::patch('/admin/payments/{id}/approve', [AdminPaymentController::class, 'approve'])->name('admin.payments.approve');
    Route::patch('/admin/payments/{id}/reject', [AdminPaymentController::class, 'reject'])->name('admin.payments.reject');

    Route::get('/admin/bouquet-options', [AdminBouquetOptionController::class, 'index'])->name('admin.bouquet-options.index');
    Route::post('/admin/bouquet-options', [AdminBouquetOptionController::class, 'store'])->name('admin.bouquet-options.store');
    Route::post('/admin/bouquet-options/{id}', [AdminBouquetOptionController::class, 'update'])->name('admin.bouquet-options.update');
    Route::delete('/admin/bouquet-options/{id}', [AdminBouquetOptionController::class, 'destroy'])->name('admin.bouquet-options.destroy');

    Route::post('/admin/custom-categories', [AdminBouquetOptionController::class, 'storeCategory'])->name('admin.custom-categories.store');
    Route::post('/admin/custom-categories/{id}', [AdminBouquetOptionController::class, 'updateCategory'])->name('admin.custom-categories.update');
    Route::delete('/admin/custom-categories/{id}', [AdminBouquetOptionController::class, 'destroyCategory'])->name('admin.custom-categories.destroy');

    Route::get('/admin/orders', [AdminOrderController::class, 'index'])->name('admin.orders.index');
    Route::post('/admin/orders', [AdminOrderController::class, 'store'])->name('admin.orders.store');
    Route::patch('/admin/orders/{id}/status', [AdminOrderController::class, 'updateStatus'])->name('admin.orders.status.update');
    Route::patch('/admin/orders/{id}/verify-payment', [AdminOrderController::class, 'verifyPayment'])->name('admin.orders.verify-payment');

    Route::get('/admin/products', [AdminProductController::class, 'index'])->name('admin.products.index');
    Route::post('/admin/products', [AdminProductController::class, 'store'])->name('admin.products.store');
    Route::post('/admin/products/{id}', [AdminProductController::class, 'update'])->name('admin.products.update');
    Route::delete('/admin/products/{id}', [AdminProductController::class, 'destroy'])->name('admin.products.destroy');

    Route::get('/admin/data-mining', [AdminDataMiningController::class, 'index'])->name('admin.data-mining.index');
});

Route::get('/', function () {
    $products = Product::with('category')->latest()->take(10)->get();

    return view('welcome', compact('products'));
})->name('home');

Route::get('/products', [ProductController::class, 'index'])->name('products.index');

Route::get('/custom-bouquet', [CustomBouquetController::class, 'index'])->name('custom.index');
Route::post('/custom-bouquet', [CustomBouquetController::class, 'store'])->name('custom.store');
Route::get('/custom-bouquet/success', [CustomBouquetController::class, 'success'])->name('custom.success');

Route::get('/dashboard', function () {
    if (auth()->user()->role === 'admin') {
        return redirect()->route('admin.dashboard');
    }

    $activeOrder = Order::where('user_id', auth()->id())
        ->whereIn('status', ['pending', 'processing'])
        ->latest()
        ->first();

    return Inertia::render('Dashboard', [
        'products' => Product::all(),
        'activeOrder' => $activeOrder ? [
            'id' => 'FLR-'.str_pad($activeOrder->id, 4, '0', STR_PAD_LEFT),
            'raw_id' => $activeOrder->id,
            'status' => $activeOrder->status,
            'total' => $activeOrder->total,
            'customer_address' => $activeOrder->customer_address,
            'created_at' => $activeOrder->created_at->format('d M Y, H:i'),
        ] : null,
    ]);
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::post('/profile/avatar', [ProfileController::class, 'updateAvatar'])->name('profile.avatar.update');
    Route::post('/profile/address', [ProfileController::class, 'updateAddress'])->name('profile.address.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Checkout Route
    Route::get('/checkout', function (Request $request) {
        $user = $request->user();
        $primaryAddress = $user ? ($user->addresses()->where('is_primary', true)->first()
            ?? $user->addresses()->latest()->first()) : null;

        if (! $primaryAddress && $user) {
            $latestOrderAddress = Order::where('user_id', $user->id)->whereNotNull('customer_address')->latest()->value('customer_address');
            if ($latestOrderAddress) {
                $primaryAddress = (object) [
                    'id' => null,
                    'label' => 'Alamat Utama',
                    'recipient_name' => $user->name,
                    'phone_number' => $user->whatsapp_number ?: '',
                    'full_address' => $latestOrderAddress,
                    'is_primary' => true,
                ];
            }
        }

        $carts = Cart::where('user_id', $user?->id)->with('product')->get();

        if ($carts->isEmpty() && $user && ! session()->get('cart_cleared')) {
            $firstProduct = Product::first();
            $prodId = $firstProduct ? $firstProduct->id : 1;

            Cart::create([
                'user_id' => $user->id,
                'product_id' => $prodId,
                'quantity' => 1,
                'custom_name' => 'Bucket Bunga Pita',
                'custom_request' => 'Bunga pita warna pink, kertas putih, pita pink, dan kartu ucapan.',
                'custom_price' => 150000,
                'custom_image' => '/images/custom/bunga_pita.jpg',
                'custom_data' => [
                    'is_custom' => true,
                    'jenis_bucket' => 'Bucket Bunga Pita',
                    'warna_bunga' => 'Pink',
                    'warna_kertas' => 'Putih',
                    'warna_pita' => 'Pink',
                    'hiasan' => ['Kartu ucapan'],
                ],
            ]);

            Cart::create([
                'user_id' => $user->id,
                'product_id' => $prodId,
                'quantity' => 1,
                'custom_name' => 'Bucket Snack',
                'custom_request' => 'Snack Chocolatos, Beng-beng, Kertas cream, pita pink...',
                'custom_price' => 120000,
                'custom_image' => '/images/custom/snack.jpg',
                'custom_data' => [
                    'is_custom' => true,
                    'jenis_bucket' => 'Bucket Snack',
                    'isi_request' => 'Snack Chocolatos & Beng-beng',
                    'warna_kertas' => 'Cream',
                    'warna_pita' => 'Pink',
                ],
            ]);

            $carts = Cart::where('user_id', $user->id)->with('product')->get();
        }

        return Inertia::render('Checkout/Index', [
            'carts' => $carts,
            'defaultAddress' => $primaryAddress ? $primaryAddress->full_address : 'Jl. Mawar No. 12, Kel. Palu, Kota Palu, Sulawesi Tengah',
            'defaultPhone' => $primaryAddress ? ($primaryAddress->phone_number ?: ($user?->whatsapp_number ?: '0823 4567 8910')) : ($user?->whatsapp_number ?: '0823 4567 8910'),
            'defaultName' => $primaryAddress ? ($primaryAddress->recipient_name ?: ($user?->name ?: 'Indah Gita Cahyani')) : ($user?->name ?: 'Indah Gita Cahyani'),
            'primaryAddress' => $primaryAddress,
            'initialStep' => $request->query('step', 'shipping'),
            'initialMethod' => $request->query('method', 'bank'),
        ]);
    })->name('checkout.index');

    // Payment Instruction Route
    Route::get('/payment-instruction', function () {
        return Inertia::render('Checkout/Payment');
    })->name('checkout.payment');

    // Cart Routes
    Route::get('/cart', [CartController::class, 'index'])->name('cart.index');
    Route::post('/cart', [CartController::class, 'store'])->name('cart.store');
    Route::post('/cart/reset-dummy', [CartController::class, 'resetDummy'])->name('cart.reset-dummy');
    Route::put('/cart/{cart}', [CartController::class, 'update'])->name('cart.update');
    Route::delete('/cart/{cart}', [CartController::class, 'destroy'])->name('cart.destroy');

    // Order Routes
    Route::get('/orders', [OrderController::class, 'index'])->name('orders.index');
    Route::get('/orders/{order}', [OrderController::class, 'show'])->name('orders.show');
    Route::post('/orders', [OrderController::class, 'store'])->name('orders.store');
    Route::post('/orders/{order}/simulate-payment', [OrderController::class, 'simulatePayment'])->name('orders.simulate-payment');
});

require __DIR__.'/auth.php';
