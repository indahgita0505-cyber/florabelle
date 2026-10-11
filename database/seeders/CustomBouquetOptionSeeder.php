<?php

namespace Database\Seeders;

use App\Models\BouquetOption;
use App\Models\CustomCategory;
use Illuminate\Database\Seeder;

class CustomBouquetOptionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $cats = CustomCategory::all();

        foreach ($cats as $cat) {
            // 1. Wrapping options
            if (BouquetOption::where('custom_category_id', $cat->id)->where('tab_type', 'wrapping')->count() === 0) {
                BouquetOption::create([
                    'custom_category_id' => $cat->id,
                    'category' => 'wrapping',
                    'tab_type' => 'wrapping',
                    'name' => 'Cellophane Soft Pink',
                    'price_adjustment' => 0,
                    'image_url' => '/images/custom/bunga_pita.jpg',
                    'is_active' => true,
                ]);
                BouquetOption::create([
                    'custom_category_id' => $cat->id,
                    'category' => 'wrapping',
                    'tab_type' => 'wrapping',
                    'name' => 'Kertas Kraft Natural',
                    'price_adjustment' => 10000,
                    'image_url' => '/images/custom/uang.jpg',
                    'is_active' => true,
                ]);
                BouquetOption::create([
                    'custom_category_id' => $cat->id,
                    'category' => 'wrapping',
                    'tab_type' => 'wrapping',
                    'name' => 'Kertas Transparan Mewah',
                    'price_adjustment' => 15000,
                    'image_url' => '/images/custom/kombinasi.jpg',
                    'is_active' => true,
                ]);
                BouquetOption::create([
                    'custom_category_id' => $cat->id,
                    'category' => 'wrapping',
                    'tab_type' => 'wrapping',
                    'name' => 'Cellophane Korea Berlayer',
                    'price_adjustment' => 15000,
                    'image_url' => '/images/custom/bunga_pita.jpg',
                    'is_active' => false,
                ]);
            }

            // 2. Pita options
            if (BouquetOption::where('custom_category_id', $cat->id)->where('tab_type', 'pita')->count() === 0) {
                BouquetOption::create([
                    'custom_category_id' => $cat->id,
                    'category' => 'warna',
                    'tab_type' => 'pita',
                    'name' => 'Pita Satin Baby Pink',
                    'price_adjustment' => 0,
                    'color_hex' => '#f472b6',
                    'is_active' => true,
                ]);
                BouquetOption::create([
                    'custom_category_id' => $cat->id,
                    'category' => 'warna',
                    'tab_type' => 'pita',
                    'name' => 'Pita Merah Maroon',
                    'price_adjustment' => 0,
                    'color_hex' => '#b91c1c',
                    'is_active' => true,
                ]);
                BouquetOption::create([
                    'custom_category_id' => $cat->id,
                    'category' => 'warna',
                    'tab_type' => 'pita',
                    'name' => 'Pita Gold Glamour',
                    'price_adjustment' => 5000,
                    'color_hex' => '#eab308',
                    'is_active' => true,
                ]);
                BouquetOption::create([
                    'custom_category_id' => $cat->id,
                    'category' => 'warna',
                    'tab_type' => 'pita',
                    'name' => 'Pita Renda Organza',
                    'price_adjustment' => 10000,
                    'color_hex' => '#ffffff',
                    'is_active' => true,
                ]);
            }

            // 3. Dekorasi Tambahan options
            if (BouquetOption::where('custom_category_id', $cat->id)->where('tab_type', 'dekorasi')->count() === 0) {
                BouquetOption::create([
                    'custom_category_id' => $cat->id,
                    'category' => 'isi',
                    'tab_type' => 'dekorasi',
                    'name' => 'Kartu Ucapan Hardcover Custom',
                    'price_adjustment' => 10000,
                    'image_url' => '/images/custom/bunga_pita.jpg',
                    'is_active' => true,
                ]);
                BouquetOption::create([
                    'custom_category_id' => $cat->id,
                    'category' => 'isi',
                    'tab_type' => 'dekorasi',
                    'name' => 'Lampu LED Warm White',
                    'price_adjustment' => 15000,
                    'image_url' => '/images/custom/kombinasi.jpg',
                    'is_active' => true,
                ]);
                BouquetOption::create([
                    'custom_category_id' => $cat->id,
                    'category' => 'isi',
                    'tab_type' => 'dekorasi',
                    'name' => 'Topper Akrilik Happy Birthday/Graduation',
                    'price_adjustment' => 15000,
                    'image_url' => '/images/custom/boneka.jpg',
                    'is_active' => true,
                ]);
                BouquetOption::create([
                    'custom_category_id' => $cat->id,
                    'category' => 'isi',
                    'tab_type' => 'dekorasi',
                    'name' => 'Hiasan Kupu-kupu 3D Gold',
                    'price_adjustment' => 12000,
                    'image_url' => '/images/custom/bunga_pita.jpg',
                    'is_active' => false,
                ]);
            }

            // 4. Informasi Khusus
            if (BouquetOption::where('custom_category_id', $cat->id)->where('tab_type', 'info')->count() === 0) {
                if ($cat->slug === 'uang') {
                    BouquetOption::create([
                        'custom_category_id' => $cat->id,
                        'category' => 'budget',
                        'tab_type' => 'info',
                        'name' => 'Pecahan Uang Rp 10.000 / Rp 20.000 (10-20 lembar)',
                        'price_adjustment' => 0,
                        'description' => 'Nominal uang asli belum termasuk jasa.',
                        'is_active' => true,
                    ]);
                    BouquetOption::create([
                        'custom_category_id' => $cat->id,
                        'category' => 'budget',
                        'tab_type' => 'info',
                        'name' => 'Pecahan Uang Rp 50.000 / Rp 100.000 (20-50 lembar)',
                        'price_adjustment' => 20000,
                        'description' => 'Slot ekstra pengaman plastik khusus uang.',
                        'is_active' => true,
                    ]);
                } elseif ($cat->slug === 'snack') {
                    BouquetOption::create([
                        'custom_category_id' => $cat->id,
                        'category' => 'budget',
                        'tab_type' => 'info',
                        'name' => 'Snack Campur (Chocolatos, Beng-beng, Pocky)',
                        'price_adjustment' => 0,
                        'is_active' => true,
                    ]);
                    BouquetOption::create([
                        'custom_category_id' => $cat->id,
                        'category' => 'budget',
                        'tab_type' => 'info',
                        'name' => 'Snack Premium Import (Nutella, Oreo Mini, Lotus)',
                        'price_adjustment' => 35000,
                        'is_active' => true,
                    ]);
                } elseif ($cat->slug === 'cokelat') {
                    BouquetOption::create([
                        'custom_category_id' => $cat->id,
                        'category' => 'budget',
                        'tab_type' => 'info',
                        'name' => 'Silverqueen Chunky Bar & Cadbury',
                        'price_adjustment' => 0,
                        'is_active' => true,
                    ]);
                    BouquetOption::create([
                        'custom_category_id' => $cat->id,
                        'category' => 'budget',
                        'tab_type' => 'info',
                        'name' => 'Ferrero Rocher Box Set',
                        'price_adjustment' => 50000,
                        'is_active' => true,
                    ]);
                } else {
                    BouquetOption::create([
                        'custom_category_id' => $cat->id,
                        'category' => 'budget',
                        'tab_type' => 'info',
                        'name' => 'Boneka Wisuda Teddy Bear Cokelat (15cm)',
                        'price_adjustment' => 0,
                        'is_active' => true,
                    ]);
                    BouquetOption::create([
                        'custom_category_id' => $cat->id,
                        'category' => 'budget',
                        'tab_type' => 'info',
                        'name' => 'Boneka Karakter Kartun / Custom Ukuran 25cm',
                        'price_adjustment' => 30000,
                        'is_active' => true,
                    ]);
                }
            }
        }
    }
}
