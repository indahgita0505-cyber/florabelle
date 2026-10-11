<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\UserAddress;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class OrderController extends Controller
{
    public function index()
    {
        $orders = Order::where('user_id', Auth::id())
            ->with(['items.product'])
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('Orders/Index', [
            'orders' => $orders,
        ]);
    }

    public function show(Order $order)
    {
        if ($order->user_id !== Auth::id()) {
            abort(403);
        }

        return Inertia::render('Orders/Show', [
            'order' => $order->load(['items.product']),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'customer_name' => 'required|string',
            'customer_phone' => 'required|string',
            'customer_address' => 'required|string',
            'payment_method' => 'required|string',
        ]);

        $userId = Auth::id();

        // Cari item keranjang yang akan di-checkout
        if ($request->has('cart_ids') && is_array($request->cart_ids) && count($request->cart_ids) > 0) {
            $carts = Cart::whereIn('id', $request->cart_ids)
                ->where('user_id', $userId)
                ->with('product')
                ->get();
        } else {
            $carts = Cart::where('user_id', $userId)->with('product')->get();
        }

        // Handle upload bukti pembayaran jika ada
        $paymentProofUrl = null;
        if ($request->hasFile('payment_proof')) {
            $path = $request->file('payment_proof')->store('payments', 'public');
            $paymentProofUrl = '/storage/'.$path;
        } elseif ($request->filled('payment_proof_url')) {
            $paymentProofUrl = $request->payment_proof_url;
        }

        // Hitung total dan ongkir
        $deliveryFee = (float) ($request->delivery_fee ?? 15000);

        if ($carts->isNotEmpty()) {
            $subtotal = $carts->sum(function ($c) {
                $price = $c->custom_price ?? ($c->product ? $c->product->price : 150000);

                return $price * $c->quantity;
            });
            $total = $subtotal + $deliveryFee;
        } else {
            $total = (float) ($request->total ?? 285000);
        }

        // Catatan alamat lengkap & metadata custom
        $notesData = [
            'provinsi' => $request->provinsi ?? 'Sulawesi Tengah',
            'kota' => $request->kota ?? 'Kota Palu',
            'kecamatan' => $request->kecamatan ?? 'Palu Selatan',
            'kode_pos' => $request->kode_pos ?? '94221',
            'metode_detail' => $request->payment_detail_name ?? $request->payment_method,
            'items_summary' => [],
        ];

        DB::beginTransaction();
        try {
            $order = Order::create([
                'user_id' => $userId,
                'total' => $total,
                'delivery_fee' => $deliveryFee,
                'payment_method' => $request->payment_method,
                'customer_name' => $request->customer_name,
                'customer_phone' => $request->customer_phone,
                'customer_address' => $request->customer_address,
                'notes' => json_encode($notesData),
                'status' => 'pending', // Menunggu Verifikasi
                'payment_status' => 'pending',
                'payment_proof_url' => $paymentProofUrl,
            ]);

            $firstProduct = Product::first();
            $fallbackProductId = $firstProduct ? $firstProduct->id : 1;

            if ($carts->isNotEmpty()) {
                foreach ($carts as $cart) {
                    $itemPrice = $cart->custom_price ?? ($cart->product ? $cart->product->price : 150000);
                    $itemName = $cart->custom_name ?? ($cart->product ? $cart->product->name : 'Bucket Bunga Pita');
                    $itemImage = $cart->custom_image ?? ($cart->product ? $cart->product->image_url : '/images/custom/bunga_pita.jpg');

                    OrderItem::create([
                        'order_id' => $order->id,
                        'product_id' => $cart->product_id ?? $fallbackProductId,
                        'product_name' => $itemName,
                        'price' => $itemPrice,
                        'quantity' => $cart->quantity,
                        'custom_request' => $cart->custom_request ?? '',
                        'image_url' => $itemImage,
                    ]);
                }

                // Kosongkan keranjang yang sudah dicheckout
                Cart::whereIn('id', $carts->pluck('id'))->delete();
            } else {
                // Buat item pesanan dummy jika di-checkout tanpa cart row di DB
                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $fallbackProductId,
                    'product_name' => 'Bucket Bunga Pita',
                    'price' => 150000,
                    'quantity' => 1,
                    'custom_request' => 'Bunga pita warna pink, kertas putih, pita pink, dan kartu ucapan.',
                    'image_url' => '/images/custom/bunga_pita.jpg',
                ]);

                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $fallbackProductId,
                    'product_name' => 'Bucket Snack',
                    'price' => 120000,
                    'quantity' => 1,
                    'custom_request' => 'Snack Chocolatos, Beng-beng, Kertas cream, pita pink...',
                    'image_url' => '/images/custom/snack.jpg',
                ]);
            }

            // Simpan alamat untuk pesanan berikutnya jika dicentang
            if ($request->boolean('save_address')) {
                UserAddress::updateOrCreate(
                    ['user_id' => $userId, 'is_primary' => true],
                    [
                        'label' => 'Alamat Utama',
                        'recipient_name' => $request->customer_name,
                        'phone_number' => $request->customer_phone,
                        'full_address' => $request->customer_address,
                    ]
                );
            }

            DB::commit();

            $orderCode = '#BK'.$order->created_at->format('Ymd').str_pad($order->id, 3, '0', STR_PAD_LEFT);

            if ($request->wantsJson() || $request->ajax()) {
                return response()->json([
                    'success' => true,
                    'order_id' => $order->id,
                    'order_code' => $orderCode,
                    'total' => $order->total,
                    'status' => 'pending',
                    'status_label' => 'Menunggu Verifikasi',
                    'message' => 'Bukti pembayaran kamu berhasil dikirim dan sedang menunggu verifikasi dari toko.',
                    'redirect' => route('orders.index'),
                ]);
            }

            return redirect()->route('orders.index')->with('success', 'Pembayaran berhasil dikirim!');
        } catch (\Exception $e) {
            DB::rollBack();

            if ($request->wantsJson() || $request->ajax()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Gagal membuat pesanan: '.$e->getMessage(),
                ], 500);
            }

            return redirect()->back()->with('error', 'Gagal membuat pesanan: '.$e->getMessage());
        }
    }

    public function simulatePayment(Order $order)
    {
        if ($order->user_id !== Auth::id()) {
            abort(403);
        }

        if ($order->status !== 'pending') {
            return redirect()->back()->with('error', 'Pesanan ini tidak dapat disimulasikan pembayarannya karena statusnya bukan pending.');
        }

        $order->update([
            'status' => 'processing',
            'payment_status' => 'paid',
        ]);

        return redirect()->back()->with('success', 'Simulasi Pembayaran Berhasil! Pesanan sekarang sedang diproses.');
    }
}
