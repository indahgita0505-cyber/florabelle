<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\OrderItem;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class AdminProductController extends Controller
{
    /**
     * Display a listing of the resource with search, filters, and pagination.
     */
    public function index(Request $request)
    {
        $query = Product::with('category')->latest();

        // 1. Search filter (nama atau deskripsi produk)
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        }

        // 2. Category filter
        if ($request->filled('category') && $request->category !== 'all') {
            $query->where('category_id', $request->category);
        }

        // 3. Status filter (Tersedia / Tidak Tersedia)
        if ($request->filled('status') && $request->status !== 'all') {
            if ($request->status === 'available') {
                $query->where(function ($q) {
                    $q->where('is_available', true)->where('stock', '>', 0);
                });
            } elseif ($request->status === 'unavailable') {
                $query->where(function ($q) {
                    $q->where('is_available', false)->orWhere('stock', '<=', 0);
                });
            }
        }

        // 8 cards per page (2 rows of 4 cards on desktop)
        $productsPaginator = $query->paginate(8)->withQueryString();

        // Resolve default fallback images for clean visual presentation
        $defaultProductImages = [
            1 => '/images/products/produk-1.jpg',
            2 => '/images/products/produk-2.jpg',
            3 => '/images/products/produk-3.jpg',
            4 => '/images/products/produk-4.jpg',
            5 => '/images/products/produk 1 (1).jpg',
            6 => '/images/custom/coklat.jpg',
            7 => '/images/hero_bouquet.jpg',
        ];

        $productsPaginator->getCollection()->transform(function ($prod) use ($defaultProductImages) {
            $img = $prod->image_url ?: ($prod->image ? Storage::url($prod->image) : null);
            if (! $img) {
                $img = $defaultProductImages[$prod->id] ?? '/images/hero_bouquet.jpg';
            }

            $isAvailable = (bool) ($prod->is_available ?? ($prod->stock > 0));

            return [
                'id' => $prod->id,
                'name' => $prod->name,
                'description' => $prod->description,
                'price' => (float) $prod->price,
                'price_formatted' => 'Rp '.number_format($prod->price, 0, ',', '.'),
                'stock' => (int) $prod->stock,
                'category_id' => $prod->category_id,
                'category_name' => $prod->category?->name ?? 'Buket Bunga',
                'image_url' => $img,
                'is_available' => $isAvailable,
                'status_label' => $isAvailable ? 'Tersedia' : 'Tidak Tersedia',
                'created_at' => $prod->created_at?->format('d M Y'),
            ];
        });

        $categories = Category::all(['id', 'name', 'slug']);

        return Inertia::render('Admin/Products/Index', [
            'products' => $productsPaginator,
            'categories' => $categories,
            'filters' => [
                'search' => $request->search ?? '',
                'category' => $request->category ?? 'all',
                'status' => $request->status ?? 'all',
            ],
        ]);
    }

    /**
     * Store a newly created product in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'category_id' => 'required|exists:categories,id',
            'price' => 'required|numeric|min:0',
            'stock' => 'nullable|integer|min:0',
            'is_available' => 'nullable|boolean',
            'description' => 'required|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
        ]);

        $data = [
            'name' => $validated['name'],
            'category_id' => $validated['category_id'],
            'price' => $validated['price'],
            'stock' => $validated['stock'] ?? 0,
            'is_available' => $request->has('is_available') ? (bool) $request->is_available : true,
            'description' => $validated['description'],
        ];

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('products', 'public');
            $data['image'] = $path;
            $data['image_url'] = Storage::url($path);
        }

        Product::create($data);

        return back()->with('success', 'Produk '.$validated['name'].' berhasil ditambahkan!');
    }

    /**
     * Update the specified product in storage.
     */
    public function update(Request $request, $id)
    {
        $product = Product::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'category_id' => 'required|exists:categories,id',
            'price' => 'required|numeric|min:0',
            'stock' => 'nullable|integer|min:0',
            'is_available' => 'nullable|boolean',
            'description' => 'required|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
        ]);

        $data = [
            'name' => $validated['name'],
            'category_id' => $validated['category_id'],
            'price' => $validated['price'],
            'stock' => $validated['stock'] ?? 0,
            'is_available' => $request->has('is_available') ? (bool) $request->is_available : true,
            'description' => $validated['description'],
        ];

        if ($request->hasFile('image')) {
            // Delete old custom uploaded image if stored in public disk
            if ($product->image) {
                Storage::disk('public')->delete($product->image);
            }
            $path = $request->file('image')->store('products', 'public');
            $data['image'] = $path;
            $data['image_url'] = Storage::url($path);
        }

        $product->update($data);

        return back()->with('success', 'Produk '.$product->name.' berhasil diperbarui!');
    }

    /**
     * Remove the specified product from storage safely.
     */
    public function destroy($id)
    {
        $product = Product::findOrFail($id);

        // Check if product is referenced in order items
        $hasOrders = OrderItem::where('product_id', $id)->exists();

        if ($hasOrders) {
            // Don't break transaction history; deactivate instead
            $product->update([
                'is_available' => false,
                'stock' => 0,
            ]);

            return back()->with('warning', 'Produk "'.$product->name.'" terhubung dengan riwayat pesanan. Status diubah menjadi Tidak Tersedia untuk menjaga integritas transaksi.');
        }

        if ($product->image) {
            Storage::disk('public')->delete($product->image);
        }

        $product->delete();

        return back()->with('success', 'Produk "'.$product->name.'" berhasil dihapus.');
    }
}
