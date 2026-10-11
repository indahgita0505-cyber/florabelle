<?php

namespace App\Http\Controllers;

use App\Models\BouquetOption;
use App\Models\CustomCategory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;

class AdminBouquetOptionController extends Controller
{
    /**
     * Display a listing of custom categories and their options.
     */
    public function index(Request $request)
    {
        $categories = CustomCategory::with('options')->orderBy('id')->get()->map(function ($cat) {
            return [
                'id' => $cat->id,
                'name' => $cat->name,
                'slug' => $cat->slug,
                'description' => $cat->description,
                'base_price' => (float) $cat->base_price,
                'base_price_formatted' => 'Rp '.number_format($cat->base_price, 0, ',', '.'),
                'image_url' => $cat->image_url ?: '/images/custom/'.($cat->slug === 'cokelat' ? 'coklat.jpg' : $cat->slug.'.jpg'),
                'is_active' => (bool) $cat->is_active,
                'options_count' => $cat->options->count(),
            ];
        });

        $options = BouquetOption::with('customCategory')->get()->map(function ($opt) {
            return [
                'id' => $opt->id,
                'custom_category_id' => $opt->custom_category_id,
                'category' => $opt->category,
                'tab_type' => $opt->tab_type ?: $this->resolveTabType($opt->category),
                'name' => $opt->name,
                'image_url' => $opt->image_url,
                'color_hex' => $opt->color_hex,
                'description' => $opt->description,
                'price_adjustment' => (float) ($opt->price_adjustment ?? 0),
                'price_formatted' => 'Rp '.number_format($opt->price_adjustment ?? 0, 0, ',', '.'),
                'is_active' => (bool) $opt->is_active,
            ];
        });

        return Inertia::render('Admin/BouquetOptions/Index', [
            'categories' => $categories,
            'options' => $options,
            'initialCategoryId' => $request->category_id ? (int) $request->category_id : null,
        ]);
    }

    /**
     * Helper to map legacy category enum to new tab_type.
     */
    private function resolveTabType($category)
    {
        return match ($category) {
            'wrapping' => 'wrapping',
            'warna' => 'pita',
            'isi' => 'dekorasi',
            'budget' => 'info',
            default => 'wrapping',
        };
    }

    /**
     * Store a newly created option.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'custom_category_id' => 'required|exists:custom_categories,id',
            'tab_type' => 'required|in:wrapping,pita,dekorasi,info',
            'name' => 'required|string|max:255',
            'price_adjustment' => 'nullable|numeric|min:0',
            'is_active' => 'nullable|boolean',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
            'color_hex' => 'nullable|string|max:20',
            'description' => 'nullable|string',
        ]);

        // Map tab_type to legacy enum for backwards compatibility
        $categoryEnum = match ($validated['tab_type']) {
            'wrapping' => 'wrapping',
            'pita' => 'warna',
            'dekorasi' => 'isi',
            'info' => 'budget',
            default => 'wrapping',
        };

        $data = [
            'custom_category_id' => $validated['custom_category_id'],
            'category' => $categoryEnum,
            'tab_type' => $validated['tab_type'],
            'name' => $validated['name'],
            'price_adjustment' => $validated['price_adjustment'] ?? 0,
            'is_active' => $request->has('is_active') ? (bool) $request->is_active : true,
            'color_hex' => $validated['color_hex'] ?? null,
            'description' => $validated['description'] ?? null,
        ];

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('bouquet_options', 'public');
            $data['image_url'] = Storage::url($path);
        }

        BouquetOption::create($data);

        return back()->with('success', 'Opsi '.$validated['name'].' berhasil ditambahkan!');
    }

    /**
     * Update an option.
     */
    public function update(Request $request, $id)
    {
        $option = BouquetOption::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'price_adjustment' => 'nullable|numeric|min:0',
            'is_active' => 'nullable|boolean',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
            'color_hex' => 'nullable|string|max:20',
            'description' => 'nullable|string',
            'tab_type' => 'nullable|string',
        ]);

        $data = [
            'name' => $validated['name'],
            'price_adjustment' => $validated['price_adjustment'] ?? 0,
            'is_active' => $request->has('is_active') ? (bool) $request->is_active : true,
            'color_hex' => $validated['color_hex'] ?? $option->color_hex,
            'description' => $validated['description'] ?? $option->description,
        ];

        if ($request->hasFile('image')) {
            if ($option->image_url && str_contains($option->image_url, '/storage/')) {
                $oldPath = str_replace('/storage/', '', $option->image_url);
                Storage::disk('public')->delete($oldPath);
            }
            $path = $request->file('image')->store('bouquet_options', 'public');
            $data['image_url'] = Storage::url($path);
        }

        $option->update($data);

        return back()->with('success', 'Opsi '.$option->name.' berhasil diperbarui!');
    }

    /**
     * Delete an option.
     */
    public function destroy($id)
    {
        $option = BouquetOption::findOrFail($id);

        if ($option->image_url && str_contains($option->image_url, '/storage/')) {
            $oldPath = str_replace('/storage/', '', $option->image_url);
            Storage::disk('public')->delete($oldPath);
        }

        $option->delete();

        return back()->with('success', 'Opsi berhasil dihapus.');
    }

    /**
     * Store a new custom category.
     */
    public function storeCategory(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'base_price' => 'required|numeric|min:0',
            'is_active' => 'nullable|boolean',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
        ]);

        $slug = Str::slug($validated['name']);
        if (CustomCategory::where('slug', $slug)->exists()) {
            $slug = $slug.'-'.time();
        }

        $data = [
            'name' => $validated['name'],
            'slug' => $slug,
            'description' => $validated['description'],
            'base_price' => $validated['base_price'],
            'is_active' => $request->has('is_active') ? (bool) $request->is_active : true,
            'image_url' => '/images/custom/kombinasi.jpg',
        ];

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('custom_categories', 'public');
            $data['image_url'] = Storage::url($path);
        }

        CustomCategory::create($data);

        return back()->with('success', 'Kategori custom '.$validated['name'].' berhasil ditambahkan!');
    }

    /**
     * Update custom category.
     */
    public function updateCategory(Request $request, $id)
    {
        $category = CustomCategory::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'base_price' => 'required|numeric|min:0',
            'is_active' => 'nullable|boolean',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
        ]);

        $data = [
            'name' => $validated['name'],
            'description' => $validated['description'],
            'base_price' => $validated['base_price'],
            'is_active' => $request->has('is_active') ? (bool) $request->is_active : true,
        ];

        if ($request->hasFile('image')) {
            if ($category->image_url && str_contains($category->image_url, '/storage/')) {
                $oldPath = str_replace('/storage/', '', $category->image_url);
                Storage::disk('public')->delete($oldPath);
            }
            $path = $request->file('image')->store('custom_categories', 'public');
            $data['image_url'] = Storage::url($path);
        }

        $category->update($data);

        return back()->with('success', 'Kategori custom '.$category->name.' berhasil diperbarui!');
    }

    /**
     * Delete custom category safely.
     */
    public function destroyCategory($id)
    {
        $category = CustomCategory::findOrFail($id);

        // Delete associated options
        $category->options()->delete();

        if ($category->image_url && str_contains($category->image_url, '/storage/')) {
            $oldPath = str_replace('/storage/', '', $category->image_url);
            Storage::disk('public')->delete($oldPath);
        }

        $category->delete();

        return back()->with('success', 'Kategori custom berhasil dihapus.');
    }
}
