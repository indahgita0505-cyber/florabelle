<?php

namespace App\Http\Controllers;

use App\Models\BouquetOption;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class AdminBouquetOptionController extends Controller
{
    public function index()
    {
        $options = BouquetOption::orderBy('category')->orderBy('name')->get();

        return Inertia::render('Admin/BouquetOptions/Index', [
            'options' => $options
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'category' => 'required|in:isi,warna,wrapping,budget',
            'name' => 'required|string|max:255',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
            'color_hex' => 'nullable|string|max:20',
            'description' => 'nullable|string',
            'price_adjustment' => 'nullable|numeric|min:0',
            'is_active' => 'boolean',
        ]);

        $data = $request->except('image');

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('bouquet_options', 'public');
            $data['image_url'] = Storage::url($path);
        }

        BouquetOption::create($data);

        return back()->with('success', 'Opsi berhasil ditambahkan.');
    }

    public function update(Request $request, $id)
    {
        $option = BouquetOption::findOrFail($id);

        $request->validate([
            'category' => 'required|in:isi,warna,wrapping,budget',
            'name' => 'required|string|max:255',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
            'color_hex' => 'nullable|string|max:20',
            'description' => 'nullable|string',
            'price_adjustment' => 'nullable|numeric|min:0',
            'is_active' => 'boolean',
        ]);

        $data = $request->except('image');

        if ($request->hasFile('image')) {
            // hapus foto lama jika ada
            if ($option->image_url) {
                // Konversi dari URL ke Path storage
                $oldPath = str_replace('/storage/', '', $option->image_url);
                Storage::disk('public')->delete($oldPath);
            }
            $path = $request->file('image')->store('bouquet_options', 'public');
            $data['image_url'] = Storage::url($path);
        }

        $option->update($data);

        return back()->with('success', 'Opsi berhasil diperbarui.');
    }

    public function destroy($id)
    {
        $option = BouquetOption::findOrFail($id);

        if ($option->image_url) {
            $oldPath = str_replace('/storage/', '', $option->image_url);
            Storage::disk('public')->delete($oldPath);
        }

        $option->delete();

        return back()->with('success', 'Opsi berhasil dihapus.');
    }
}
