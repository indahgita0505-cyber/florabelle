<?php

namespace Database\Seeders;

use App\Models\BouquetOption;
use Illuminate\Database\Seeder;

class BouquetOptionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        BouquetOption::truncate();

        $bouquetOptions = [
            // Jenis / Isi Buket Utama
            ['category' => 'isi', 'name' => 'Buket Bunga Segar (Fresh Flowers)', 'is_active' => true],
            ['category' => 'isi', 'name' => 'Buket Bunga Palsu (Artificial)', 'is_active' => true],
            ['category' => 'isi', 'name' => 'Buket Uang (Money Bouquet)', 'is_active' => true],
            ['category' => 'isi', 'name' => 'Buket Cokelat (Chocolate)', 'is_active' => true],
            ['category' => 'isi', 'name' => 'Buket Snack / Makanan Ringan', 'is_active' => true],

            // Tema Warna (Color Theme)
            ['category' => 'warna', 'name' => 'Pastel (Soft & Kalem)', 'color_hex' => '#FFB6C1', 'is_active' => true],
            ['category' => 'warna', 'name' => 'Merah Elegan (Romantic Red)', 'color_hex' => '#FF0000', 'is_active' => true],
            ['category' => 'warna', 'name' => 'Monokrom (Hitam & Putih)', 'color_hex' => '#000000', 'is_active' => true],
            ['category' => 'warna', 'name' => 'Warna-warni Cerah (Colorful)', 'color_hex' => '#FFD700', 'is_active' => true],

            // Gaya Pembungkus (Wrapping Style)
            ['category' => 'wrapping', 'name' => 'Premium Cellophane (Plastik Mewah)', 'is_active' => true],
            ['category' => 'wrapping', 'name' => 'Kertas Kraft (Gaya Rustic/Vintage)', 'is_active' => true],
            ['category' => 'wrapping', 'name' => 'Box Bloom (Dalam Kotak Eksklusif)', 'is_active' => true],

            // Anggaran (Budget)
            ['category' => 'budget', 'name' => 'Rp 100.000 - Rp 250.000', 'is_active' => true],
            ['category' => 'budget', 'name' => 'Rp 250.000 - Rp 500.000', 'is_active' => true],
            ['category' => 'budget', 'name' => '> Rp 500.000 (Premium)', 'is_active' => true],
        ];

        foreach ($bouquetOptions as $opt) {
            BouquetOption::create($opt);
        }
    }
}
