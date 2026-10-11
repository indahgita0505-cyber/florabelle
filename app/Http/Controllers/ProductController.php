<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Product;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $query = Product::with('category');

        // Filter kategori
        if ($request->filled('category') && $request->category !== 'all') {
            $query->whereHas('category', function ($q) use ($request) {
                $q->where('slug', $request->category);
            });
        }

        // Pencarian
        if ($request->filled('search')) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }

        // Sorting harga
        if ($request->sort === 'price_asc') {
            $query->orderBy('price', 'asc');
        } elseif ($request->sort === 'price_desc') {
            $query->orderBy('price', 'desc');
        } else {
            $query->latest();
        }

        $products = $query->get();
        
        // Dapatkan semua produk untuk perhitungan count kategori
        $allProductsCount = Product::count();
        $categoriesFromDb = \App\Models\Category::withCount('products')->get();

        return view('products', [
            'products'         => $products,
            'allProductsCount' => $allProductsCount,
            'categoriesFromDb' => $categoriesFromDb,
            'activeCategory'   => $request->category ?? 'all',
            'searchQuery'      => $request->search ?? '',
            'activeSort'       => $request->sort ?? 'newest',
        ]);
    }

    public function show(Product $product)
    {
        return view('product-detail', compact('product'));
    }
}
