<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Product;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Admin user
        User::create([
            'username' => 'admin',
            'name' => 'Admin Florabelle',
            'email' => 'admin@florabelle.com',
            'password' => Hash::make('password'),
            'role' => 'admin',
        ]);

        // Regular user
        User::create([
            'username' => 'user',
            'name' => 'Pelanggan Setia',
            'email' => 'user@florabelle.com',
            'password' => Hash::make('password'),
            'role' => 'user',
        ]);

        // Delivery Areas
        \App\Models\DeliveryArea::insert([
            ['name' => 'Palu Barat', 'fee' => 15000, 'is_active' => true],
            ['name' => 'Palu Timur', 'fee' => 15000, 'is_active' => true],
            ['name' => 'Palu Selatan', 'fee' => 20000, 'is_active' => true],
            ['name' => 'Palu Utara', 'fee' => 20000, 'is_active' => true],
            ['name' => 'Sigi (Batas Kota)', 'fee' => 35000, 'is_active' => true],
        ]);

        // Categories
        $categories = [
            'fresh' => \App\Models\Category::create(['name' => 'Bunga Segar (Fresh)', 'slug' => 'fresh']),
            'dried' => \App\Models\Category::create(['name' => 'Bunga Kering (Dried)', 'slug' => 'dried']),
            'artificial' => \App\Models\Category::create(['name' => 'Bunga Tiruan (Artificial)', 'slug' => 'artificial']),
        ];

        // Custom Bouquet Options
        $bouquetOptions = [
            // Isi
            ['category' => 'isi', 'name' => 'Mawar Merah', 'is_active' => true],
            ['category' => 'isi', 'name' => 'Mawar Putih', 'is_active' => true],
            ['category' => 'isi', 'name' => 'Bunga Matahari', 'is_active' => true],
            ['category' => 'isi', 'name' => 'Baby\'s Breath', 'is_active' => true],
            ['category' => 'isi', 'name' => 'Lily', 'is_active' => true],
            // Warna
            ['category' => 'warna', 'name' => 'Pastel Pink', 'color_hex' => '#FFB6C1', 'is_active' => true],
            ['category' => 'warna', 'name' => 'Classic Red', 'color_hex' => '#FF0000', 'is_active' => true],
            ['category' => 'warna', 'name' => 'Pure White', 'color_hex' => '#FFFFFF', 'is_active' => true],
            ['category' => 'warna', 'name' => 'Lilac', 'color_hex' => '#C8A2C8', 'is_active' => true],
            // Wrapping
            ['category' => 'wrapping', 'name' => 'Premium Cellophane', 'is_active' => true],
            ['category' => 'wrapping', 'name' => 'Kraft Paper (Rustic)', 'is_active' => true],
            ['category' => 'wrapping', 'name' => 'Bloom Box', 'is_active' => true],
            // Budget
            ['category' => 'budget', 'name' => 'Rp 150.000 - Rp 300.000', 'is_active' => true],
            ['category' => 'budget', 'name' => 'Rp 300.000 - Rp 500.000', 'is_active' => true],
            ['category' => 'budget', 'name' => '> Rp 500.000 (Sultan)', 'is_active' => true],
        ];

        foreach ($bouquetOptions as $opt) {
            \App\Models\BouquetOption::create($opt);
        }

        // Products
        $products = [
            [
                'name' => 'Buket Mawar Merah',
                'description' => 'Buket 12 tangkai mawar merah segar dengan balutan kertas premium yang elegan.',
                'price' => 250000,
                'category_id' => $categories['fresh']->id,
                'stock' => 15,
            ],
            [
                'name' => 'Anggrek Bulan Putih',
                'description' => 'Tanaman anggrek bulan putih dalam pot keramik. Sangat cocok untuk hiasan meja.',
                'price' => 350000,
                'category_id' => $categories['fresh']->id,
                'stock' => 8,
            ],
            [
                'name' => 'Edelweiss Frame',
                'description' => 'Bunga abadi edelweiss asli yang dirangkai dalam bingkai kayu eksklusif.',
                'price' => 180000,
                'category_id' => $categories['dried']->id,
                'stock' => 20,
            ],
            [
                'name' => 'Tulip Spring Blossom',
                'description' => 'Buket tulip import berbagai warna dengan kesegaran maksimal.',
                'price' => 450000,
                'category_id' => $categories['fresh']->id,
                'stock' => 5,
            ],
            [
                'name' => 'Artificial Peony Box',
                'description' => 'Bloom box eksklusif berisi bunga peony tiruan premium yang sangat mirip asli.',
                'price' => 320000,
                'category_id' => $categories['artificial']->id,
                'stock' => 10,
            ]
        ];

        foreach ($products as $p) {
            Product::create($p);
        }
    }
}
