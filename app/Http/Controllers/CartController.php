<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class CartController extends Controller
{
    public function index()
    {
        $userId = Auth::id();
        $carts = Cart::with('product')->where('user_id', $userId)->get();

        // Inisialisasi data dummy keranjang sesuai mockup referensi jika keranjang kosong
        if ($carts->isEmpty() && ! session()->get('cart_cleared')) {
            $firstProduct = Product::first();
            $prodId = $firstProduct ? $firstProduct->id : 1;

            Cart::create([
                'user_id' => $userId,
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
                'user_id' => $userId,
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

            $carts = Cart::with('product')->where('user_id', $userId)->get();
        }

        // --- DATA MINING (APRIORI) LOGIC ---
        $cartProductIds = $carts->pluck('product_id')->filter()->toArray();
        $recommendations = collect([]);

        if (count($cartProductIds) > 0) {
            $orderIds = DB::table('order_items')
                ->whereIn('product_id', $cartProductIds)
                ->pluck('order_id');

            if ($orderIds->count() > 0) {
                $recommendedProductIds = DB::table('order_items')
                    ->whereIn('order_id', $orderIds)
                    ->whereNotIn('product_id', $cartProductIds)
                    ->select('product_id', DB::raw('count(*) as frequency'))
                    ->groupBy('product_id')
                    ->orderBy('frequency', 'desc')
                    ->take(2)
                    ->pluck('product_id');

                $recommendations = Product::whereIn('id', $recommendedProductIds)
                    ->where('stock', '>', 0)
                    ->get();
            }
        }

        return Inertia::render('Cart/Index', [
            'carts' => $carts,
            'recommendations' => $recommendations,
        ]);
    }

    public function store(Request $request)
    {
        $userId = Auth::id();

        // Custom Bouquet item submission
        if ($request->has('is_custom') || $request->has('custom_name')) {
            $firstProduct = Product::first();
            $prodId = $request->product_id ?? ($firstProduct ? $firstProduct->id : 1);

            $cart = Cart::create([
                'user_id' => $userId,
                'product_id' => $prodId,
                'quantity' => max(1, (int) ($request->quantity ?? 1)),
                'custom_name' => $request->custom_name ?? 'Custom Bucket',
                'custom_request' => $request->custom_request ?? 'Sesuai request kustom',
                'custom_price' => (float) ($request->custom_price ?? 150000),
                'custom_image' => $request->custom_image ?? '/images/custom/bunga_pita.jpg',
                'custom_data' => $request->custom_data ?? null,
            ]);

            session()->forget('cart_cleared');

            if ($request->wantsJson() || $request->ajax()) {
                return response()->json([
                    'success' => true,
                    'message' => 'Bucket custom berhasil dimasukkan ke keranjang belanja!',
                    'cart_id' => $cart->id,
                    'redirect' => route('cart.index'),
                ]);
            }

            return redirect()->route('cart.index')->with('success', 'Bucket custom berhasil dimasukkan ke keranjang belanja!');
        }

        $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required|integer|min:1',
        ]);

        $cart = Cart::where('user_id', $userId)
            ->where('product_id', $request->product_id)
            ->whereNull('custom_name')
            ->first();

        if ($cart) {
            $cart->increment('quantity', $request->quantity);
        } else {
            Cart::create([
                'user_id' => $userId,
                'product_id' => $request->product_id,
                'quantity' => $request->quantity,
            ]);
        }

        session()->forget('cart_cleared');

        return redirect()->back()->with('success', 'Ditambahkan ke keranjang!');
    }

    public function update(Request $request, Cart $cart)
    {
        if ($cart->user_id !== Auth::id()) {
            abort(403);
        }

        $updateData = [];

        if ($request->has('quantity')) {
            $updateData['quantity'] = max(1, (int) $request->quantity);
        }

        if ($request->has('custom_request')) {
            $updateData['custom_request'] = $request->custom_request;
        }

        if (! empty($updateData)) {
            $cart->update($updateData);
        }

        return redirect()->back()->with('success', 'Keranjang diperbarui.');
    }

    public function destroy(Cart $cart)
    {
        if ($cart->user_id !== Auth::id()) {
            abort(403);
        }

        $cart->delete();

        $remaining = Cart::where('user_id', Auth::id())->count();
        if ($remaining === 0) {
            session()->put('cart_cleared', true);
        }

        return redirect()->back()->with('success', 'Item berhasil dihapus dari keranjang.');
    }

    public function resetDummy()
    {
        $userId = Auth::id();
        Cart::where('user_id', $userId)->delete();
        session()->forget('cart_cleared');

        return redirect()->route('cart.index')->with('success', 'Data keranjang contoh berhasil dimuat ulang!');
    }
}
