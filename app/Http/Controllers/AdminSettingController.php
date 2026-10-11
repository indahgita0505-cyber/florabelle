<?php

namespace App\Http\Controllers;

use App\Models\StoreSetting;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class AdminSettingController extends Controller
{
    public function index()
    {
        // Ambil semua setting dan ubah menjadi array asosiatif [key => value]
        $settings = StoreSetting::pluck('value', 'key')->toArray();

        return Inertia::render('Admin/Settings/Index', [
            'settings' => $settings
        ]);
    }

    public function update(Request $request)
    {
        $request->validate([
            'bank_account' => 'nullable|string|max:255',
            'store_address' => 'nullable|string',
            'whatsapp_number' => 'nullable|string|max:20',
            'qris_image' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
        ]);

        $data = $request->only(['bank_account', 'store_address', 'whatsapp_number']);

        // Proses update text fields
        foreach ($data as $key => $value) {
            StoreSetting::updateOrCreate(
                ['key' => $key],
                ['value' => $value]
            );
        }

        // Proses upload QRIS
        if ($request->hasFile('qris_image')) {
            $path = $request->file('qris_image')->store('settings', 'public');
            
            // Hapus QRIS lama jika ada
            $oldQris = StoreSetting::where('key', 'qris_image')->first();
            if ($oldQris && $oldQris->value) {
                $oldPath = str_replace('/storage/', '', $oldQris->value);
                Storage::disk('public')->delete($oldPath);
            }

            StoreSetting::updateOrCreate(
                ['key' => 'qris_image'],
                ['value' => Storage::url($path)]
            );
        }

        return back()->with('success', 'Pengaturan toko berhasil diperbarui.');
    }
}
