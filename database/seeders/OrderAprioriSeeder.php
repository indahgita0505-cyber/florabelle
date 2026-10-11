<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use Illuminate\Database\Seeder;

class OrderAprioriSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Pastikan produk pelengkap (Cokelat & Kartu Ucapan) ada
        $freshCat = Category::where('slug', 'fresh')->first();

        $cokelat = Product::firstOrCreate(
            ['name' => 'Cokelat Valentine Premium'],
            [
                'description' => 'Cokelat premium lezat, sangat cocok disandingkan dengan buket mawar.',
                'price' => 75000,
                'category_id' => $freshCat->id,
                'stock' => 100,
            ]
        );

        $kartu = Product::firstOrCreate(
            ['name' => 'Kartu Ucapan Kustom (Hardcover)'],
            [
                'description' => 'Kartu ucapan elegan dengan tulisan tangan untuk pesan yang lebih personal.',
                'price' => 25000,
                'category_id' => $freshCat->id,
                'stock' => 100,
            ]
        );

        $mawarId = 1; // Buket Mawar Merah
        $tulipId = 4; // Tulip Spring Blossom
        $cokelatId = $cokelat->id;
        $kartuId = $kartu->id;

        // 2. Buat Transaksi Palsu (Market Basket Simulation)

        // Pola 1: Beli Mawar sering dibarengi Cokelat (80% confidence)
        // Kita buat 20 transaksi: 16 Mawar + Cokelat, 4 Mawar saja
        for ($i = 0; $i < 20; $i++) {
            $order = Order::create([
                'user_id' => 2, // User Pelanggan Setia
                'total' => 0, // Akan diupdate nanti
                'payment_method' => 'transfer',
                'customer_name' => 'Dummy Customer '.$i,
                'customer_phone' => '08123456789',
                'customer_address' => 'Jl. Dummy '.$i,
                'status' => 'completed',
                'payment_status' => 'paid',
            ]);

            OrderItem::create(['order_id' => $order->id, 'product_id' => $mawarId, 'product_name' => 'Buket Mawar Merah', 'quantity' => 1, 'price' => 250000]);

            if ($i < 16) {
                // 16 transaksi dengan Cokelat
                OrderItem::create(['order_id' => $order->id, 'product_id' => $cokelatId, 'product_name' => 'Cokelat Valentine Premium', 'quantity' => 1, 'price' => 75000]);
            } else {
                // Sisa 4 transaksi mungkin beli Kartu Ucapan sebagai variasi
                OrderItem::create(['order_id' => $order->id, 'product_id' => $kartuId, 'product_name' => 'Kartu Ucapan Kustom (Hardcover)', 'quantity' => 1, 'price' => 25000]);
            }
        }

        // Pola 2: Beli Tulip sering dibarengi Kartu Ucapan (75% confidence)
        // Kita buat 12 transaksi: 9 Tulip + Kartu, 3 Tulip saja
        for ($i = 20; $i < 32; $i++) {
            $order = Order::create([
                'user_id' => 2,
                'total' => 0,
                'payment_method' => 'transfer',
                'customer_name' => 'Dummy Customer '.$i,
                'customer_phone' => '08123456789',
                'customer_address' => 'Jl. Dummy '.$i,
                'status' => 'completed',
                'payment_status' => 'paid',
            ]);

            OrderItem::create(['order_id' => $order->id, 'product_id' => $tulipId, 'product_name' => 'Tulip Spring Blossom', 'quantity' => 1, 'price' => 450000]);

            if ($i < 29) {
                OrderItem::create(['order_id' => $order->id, 'product_id' => $kartuId, 'product_name' => 'Kartu Ucapan Kustom (Hardcover)', 'quantity' => 1, 'price' => 25000]);
            }
        }

        // Pola 3: Transaksi Acak (Noise) agar algoritma terlihat natural
        for ($i = 32; $i < 40; $i++) {
            $order = Order::create([
                'user_id' => 2,
                'total' => 0,
                'payment_method' => 'transfer',
                'customer_name' => 'Dummy Customer '.$i,
                'customer_phone' => '08123456789',
                'customer_address' => 'Jl. Dummy '.$i,
                'status' => 'completed',
                'payment_status' => 'paid',
            ]);

            OrderItem::create(['order_id' => $order->id, 'product_id' => 2, 'product_name' => 'Anggrek Bulan Putih', 'quantity' => 1, 'price' => 350000]); // Anggrek
            OrderItem::create(['order_id' => $order->id, 'product_id' => $cokelatId, 'product_name' => 'Cokelat Valentine Premium', 'quantity' => 1, 'price' => 75000]);
        }

        // Update Total Harga semua Order yang baru dibuat
        $orders = Order::all();
        foreach ($orders as $o) {
            $o->total = $o->items()->sum('price');
            $o->save();
        }
    }
}
