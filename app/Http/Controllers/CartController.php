<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\Cart;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class CartController extends Controller
{
    public function index()
    {
        $carts = Cart::with('product')->where('user_id', Auth::id())->get();
        
        // --- DATA MINING (APRIORI) LOGIC ---
        $cartProductIds = $carts->pluck('product_id')->toArray();
        $recommendations = collect([]);

        if (count($cartProductIds) > 0) {
            // 1. Cari ID pesanan (order_id) masa lalu yang pernah membeli produk yang sama dengan isi keranjang
            $orderIds = \Illuminate\Support\Facades\DB::table('order_items')
                ->whereIn('product_id', $cartProductIds)
                ->pluck('order_id');

            if ($orderIds->count() > 0) {
                // 2. Cari produk LAIN yang ada di dalam order_id tersebut, lalu hitung frekuensi kemunculannya (Support)
                $recommendedProductIds = \Illuminate\Support\Facades\DB::table('order_items')
                    ->whereIn('order_id', $orderIds)
                    ->whereNotIn('product_id', $cartProductIds) // Jangan rekomendasikan produk yang sudah ada di keranjang
                    ->select('product_id', \Illuminate\Support\Facades\DB::raw('count(*) as frequency'))
                    ->groupBy('product_id')
                    ->orderBy('frequency', 'desc')
                    ->take(2) // Ambil 2 produk yang paling sering dibeli bersamaan
                    ->pluck('product_id');

                // 3. Ambil detail produknya dari database
                $recommendations = \App\Models\Product::whereIn('id', $recommendedProductIds)
                    ->where('stock', '>', 0)
                    ->get();
            }
        }

        return Inertia::render('Cart/Index', [
            'carts' => $carts,
            'recommendations' => $recommendations
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required|integer|min:1'
        ]);

        $cart = Cart::where('user_id', Auth::id())
            ->where('product_id', $request->product_id)
            ->first();

        if ($cart) {
            $cart->increment('quantity', $request->quantity);
        } else {
            Cart::create([
                'user_id' => Auth::id(),
                'product_id' => $request->product_id,
                'quantity' => $request->quantity
            ]);
        }

        return redirect()->back()->with('success', 'Ditambahkan ke keranjang!');
    }

    public function update(Request $request, Cart $cart)
    {
        if ($cart->user_id !== Auth::id()) {
            abort(403);
        }

        $request->validate([
            'quantity' => 'required|integer|min:1'
        ]);

        $cart->update(['quantity' => $request->quantity]);

        return redirect()->back();
    }

    public function destroy(Cart $cart)
    {
        if ($cart->user_id !== Auth::id()) {
            abort(403);
        }

        $cart->delete();

        return redirect()->back();
    }
}
