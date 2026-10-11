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
use App\Models\Product;
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

    Route::get('/admin/orders', [AdminOrderController::class, 'index'])->name('admin.orders.index');
    Route::patch('/admin/orders/{id}/status', [AdminOrderController::class, 'updateStatus'])->name('admin.orders.status.update');

    Route::get('/admin/products', [AdminProductController::class, 'index'])->name('admin.products.index');
    Route::post('/admin/products', [AdminProductController::class, 'store'])->name('admin.products.store');
    Route::post('/admin/products/{id}', [AdminProductController::class, 'update'])->name('admin.products.update');
    Route::delete('/admin/products/{id}', [AdminProductController::class, 'destroy'])->name('admin.products.destroy');

    Route::get('/admin/data-mining', [AdminDataMiningController::class, 'index'])->name('admin.data-mining.index');
});

Route::get('/', function () {
    return view('welcome');
})->name('home');

Route::get('/products', [ProductController::class, 'index'])->name('products.index');

Route::get('/custom-bouquet', [CustomBouquetController::class, 'index'])->name('custom.index');
Route::post('/custom-bouquet', [CustomBouquetController::class, 'store'])->name('custom.store');
Route::get('/custom-bouquet/success', [CustomBouquetController::class, 'success'])->name('custom.success');

Route::get('/dashboard', function () {
    if (auth()->user()->role === 'admin') {
        return redirect()->route('admin.dashboard');
    }

    return Inertia::render('Dashboard', [
        'products' => Product::all(),
    ]);
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Checkout Route
    Route::get('/checkout', function () {
        return Inertia::render('Checkout/Index');
    })->name('checkout.index');

    // Payment Instruction Route
    Route::get('/payment-instruction', function () {
        return Inertia::render('Checkout/Payment');
    })->name('checkout.payment');

    // Cart Routes
    Route::get('/cart', [CartController::class, 'index'])->name('cart.index');
    Route::post('/cart', [CartController::class, 'store'])->name('cart.store');
    Route::put('/cart/{cart}', [CartController::class, 'update'])->name('cart.update');
    Route::delete('/cart/{cart}', [CartController::class, 'destroy'])->name('cart.destroy');

    // Order Routes
    Route::get('/orders', [OrderController::class, 'index'])->name('orders.index');
    Route::get('/orders/{order}', [OrderController::class, 'show'])->name('orders.show');
    Route::post('/orders', [OrderController::class, 'store'])->name('orders.store');
    Route::post('/orders/{order}/simulate-payment', [OrderController::class, 'simulatePayment'])->name('orders.simulate-payment');
});

require __DIR__.'/auth.php';
