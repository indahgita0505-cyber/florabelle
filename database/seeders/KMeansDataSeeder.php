<?php

namespace Database\Seeders;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\Review;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

/**
 * KMeansDataSeeder
 *
 * Membuat dataset dummy yang dirancang untuk K-Means Clustering
 * dengan 3 segmen pelanggan yang berbeda (RFM Analysis):
 *
 * - Cluster 1 (VIP / High Value)        : F=8-15 order, M=tinggi, R=1-14 hari
 * - Cluster 2 (Regular / Mid Value)     : F=3-7 order,  M=sedang, R=15-60 hari
 * - Cluster 3 (Occasional / Low Value)  : F=1-2 order,  M=rendah, R=60-365 hari
 *
 * Fitur yang dapat digunakan untuk clustering:
 * - recency         : Hari sejak transaksi terakhir
 * - frequency       : Total jumlah transaksi
 * - monetary        : Total nilai belanja (rupiah)
 * - avg_order_value : Rata-rata nilai per transaksi
 * - avg_rating      : Rata-rata rating yang diberikan (jika ada)
 */
class KMeansDataSeeder extends Seeder
{
    /** @var array<int, array{id: int, name: string, price: float}> */
    private array $productCatalog = [];

    public function run(): void
    {
        $this->loadProductCatalog();

        $this->seedCluster1Vip();
        $this->seedCluster2Regular();
        $this->seedCluster3Occasional();

        $this->command->info('✅ KMeansDataSeeder selesai!');
        $this->command->info('   - Cluster 1 (VIP)        : 15 pelanggan');
        $this->command->info('   - Cluster 2 (Regular)    : 20 pelanggan');
        $this->command->info('   - Cluster 3 (Occasional) : 15 pelanggan');
        $this->command->info('   Total: 50 pelanggan dummy');
    }

    // =========================================================================
    // CLUSTER 1: VIP / HIGH VALUE CUSTOMERS
    // Ciri: F=8-15 order, M=Rp1.5jt-5jt, R=1-14 hari, rating=4-5
    // =========================================================================

    private function seedCluster1Vip(): void
    {
        $profiles = [
            ['name' => 'Aulia Rahmawati',    'phone' => '081234560001', 'orders' => 14, 'min_days_ago' => 1,  'max_days_ago' => 90,  'last_days_ago' => 3,  'avg_spend' => 380000, 'rating' => [4, 5, 5]],
            ['name' => 'Bintang Prasetyo',   'phone' => '081234560002', 'orders' => 12, 'min_days_ago' => 3,  'max_days_ago' => 95,  'last_days_ago' => 5,  'avg_spend' => 420000, 'rating' => [5, 5, 4]],
            ['name' => 'Citra Dewi Lestari', 'phone' => '081234560003', 'orders' => 15, 'min_days_ago' => 2,  'max_days_ago' => 100, 'last_days_ago' => 1,  'avg_spend' => 310000, 'rating' => [5, 5, 5]],
            ['name' => 'Dian Puspita Sari',  'phone' => '081234560004', 'orders' => 11, 'min_days_ago' => 5,  'max_days_ago' => 88,  'last_days_ago' => 7,  'avg_spend' => 450000, 'rating' => [4, 5, 5]],
            ['name' => 'Eka Septiana Putri', 'phone' => '081234560005', 'orders' => 13, 'min_days_ago' => 1,  'max_days_ago' => 92,  'last_days_ago' => 2,  'avg_spend' => 390000, 'rating' => [5, 4, 5]],
            ['name' => 'Fajar Nugroho',      'phone' => '081234560006', 'orders' => 10, 'min_days_ago' => 4,  'max_days_ago' => 85,  'last_days_ago' => 10, 'avg_spend' => 520000, 'rating' => [5, 5, 4]],
            ['name' => 'Gita Permatasari',   'phone' => '081234560007', 'orders' => 14, 'min_days_ago' => 2,  'max_days_ago' => 110, 'last_days_ago' => 4,  'avg_spend' => 340000, 'rating' => [4, 4, 5]],
            ['name' => 'Hendra Kusuma',      'phone' => '081234560008', 'orders' => 9,  'min_days_ago' => 6,  'max_days_ago' => 80,  'last_days_ago' => 8,  'avg_spend' => 480000, 'rating' => [5, 5, 5]],
            ['name' => 'Indah Sulistyowati', 'phone' => '081234560009', 'orders' => 12, 'min_days_ago' => 3,  'max_days_ago' => 95,  'last_days_ago' => 6,  'avg_spend' => 360000, 'rating' => [4, 5, 4]],
            ['name' => 'Joko Santoso',       'phone' => '081234560010', 'orders' => 11, 'min_days_ago' => 7,  'max_days_ago' => 105, 'last_days_ago' => 12, 'avg_spend' => 400000, 'rating' => [5, 4, 5]],
            ['name' => 'Kartika Wulandari',  'phone' => '081234560011', 'orders' => 15, 'min_days_ago' => 1,  'max_days_ago' => 120, 'last_days_ago' => 2,  'avg_spend' => 290000, 'rating' => [5, 5, 5]],
            ['name' => 'Lukman Hakim',       'phone' => '081234560012', 'orders' => 10, 'min_days_ago' => 5,  'max_days_ago' => 90,  'last_days_ago' => 9,  'avg_spend' => 430000, 'rating' => [4, 5, 5]],
            ['name' => 'Maya Anggraeni',     'phone' => '081234560013', 'orders' => 13, 'min_days_ago' => 2,  'max_days_ago' => 88,  'last_days_ago' => 3,  'avg_spend' => 370000, 'rating' => [5, 5, 4]],
            ['name' => 'Nanda Rizky Putra',  'phone' => '081234560014', 'orders' => 8,  'min_days_ago' => 8,  'max_days_ago' => 75,  'last_days_ago' => 14, 'avg_spend' => 560000, 'rating' => [4, 5, 5]],
            ['name' => 'Octa Fitriani',      'phone' => '081234560015', 'orders' => 12, 'min_days_ago' => 3,  'max_days_ago' => 98,  'last_days_ago' => 5,  'avg_spend' => 410000, 'rating' => [5, 4, 4]],
        ];

        foreach ($profiles as $index => $profile) {
            $user = $this->createUser($profile, 'vip', $index + 1);
            $this->createOrdersForUser($user, $profile, 'high');
        }
    }

    // =========================================================================
    // CLUSTER 2: REGULAR / MID VALUE CUSTOMERS
    // Ciri: F=3-7 order, M=Rp400rb-1.2jt, R=15-60 hari, rating=3-4
    // =========================================================================

    private function seedCluster2Regular(): void
    {
        $profiles = [
            ['name' => 'Putri Rahayu',       'phone' => '081234560016', 'orders' => 6, 'min_days_ago' => 15, 'max_days_ago' => 180, 'last_days_ago' => 20, 'avg_spend' => 280000, 'rating' => [3, 4, 4]],
            ['name' => 'Qori Maharani',       'phone' => '081234560017', 'orders' => 5, 'min_days_ago' => 18, 'max_days_ago' => 160, 'last_days_ago' => 25, 'avg_spend' => 320000, 'rating' => [4, 3, 4]],
            ['name' => 'Reza Firmansyah',     'phone' => '081234560018', 'orders' => 7, 'min_days_ago' => 12, 'max_days_ago' => 170, 'last_days_ago' => 18, 'avg_spend' => 250000, 'rating' => [3, 4, 3]],
            ['name' => 'Sinta Melati',        'phone' => '081234560019', 'orders' => 4, 'min_days_ago' => 22, 'max_days_ago' => 150, 'last_days_ago' => 30, 'avg_spend' => 350000, 'rating' => [4, 4, 3]],
            ['name' => 'Teguh Wibowo',        'phone' => '081234560020', 'orders' => 6, 'min_days_ago' => 16, 'max_days_ago' => 190, 'last_days_ago' => 22, 'avg_spend' => 270000, 'rating' => [3, 3, 4]],
            ['name' => 'Ulfah Hasanah',       'phone' => '081234560021', 'orders' => 5, 'min_days_ago' => 20, 'max_days_ago' => 165, 'last_days_ago' => 28, 'avg_spend' => 300000, 'rating' => [4, 3, 3]],
            ['name' => 'Vika Amalia Putri',   'phone' => '081234560022', 'orders' => 7, 'min_days_ago' => 14, 'max_days_ago' => 200, 'last_days_ago' => 16, 'avg_spend' => 240000, 'rating' => [3, 4, 4]],
            ['name' => 'Wahyu Hidayat',       'phone' => '081234560023', 'orders' => 4, 'min_days_ago' => 25, 'max_days_ago' => 145, 'last_days_ago' => 35, 'avg_spend' => 380000, 'rating' => [4, 3, 4]],
            ['name' => 'Xenia Mahardhika',    'phone' => '081234560024', 'orders' => 6, 'min_days_ago' => 17, 'max_days_ago' => 175, 'last_days_ago' => 21, 'avg_spend' => 260000, 'rating' => [3, 4, 3]],
            ['name' => 'Yoga Pratama',        'phone' => '081234560025', 'orders' => 5, 'min_days_ago' => 19, 'max_days_ago' => 155, 'last_days_ago' => 26, 'avg_spend' => 290000, 'rating' => [4, 4, 3]],
            ['name' => 'Zara Puspita Dewi',   'phone' => '081234560026', 'orders' => 7, 'min_days_ago' => 13, 'max_days_ago' => 185, 'last_days_ago' => 17, 'avg_spend' => 230000, 'rating' => [3, 3, 4]],
            ['name' => 'Arif Budiman',        'phone' => '081234560027', 'orders' => 3, 'min_days_ago' => 28, 'max_days_ago' => 140, 'last_days_ago' => 40, 'avg_spend' => 420000, 'rating' => [4, 4, 4]],
            ['name' => 'Bella Maharani',      'phone' => '081234560028', 'orders' => 6, 'min_days_ago' => 15, 'max_days_ago' => 195, 'last_days_ago' => 19, 'avg_spend' => 270000, 'rating' => [3, 4, 3]],
            ['name' => 'Candra Permana',      'phone' => '081234560029', 'orders' => 5, 'min_days_ago' => 21, 'max_days_ago' => 158, 'last_days_ago' => 29, 'avg_spend' => 310000, 'rating' => [4, 3, 4]],
            ['name' => 'Dewi Kusumawati',     'phone' => '081234560030', 'orders' => 4, 'min_days_ago' => 24, 'max_days_ago' => 148, 'last_days_ago' => 33, 'avg_spend' => 340000, 'rating' => [3, 4, 4]],
            ['name' => 'Edi Kurniawan',       'phone' => '081234560031', 'orders' => 7, 'min_days_ago' => 11, 'max_days_ago' => 205, 'last_days_ago' => 15, 'avg_spend' => 220000, 'rating' => [4, 3, 3]],
            ['name' => 'Farida Agustin',      'phone' => '081234560032', 'orders' => 6, 'min_days_ago' => 16, 'max_days_ago' => 172, 'last_days_ago' => 23, 'avg_spend' => 280000, 'rating' => [3, 3, 4]],
            ['name' => 'Gilang Ramadhan',     'phone' => '081234560033', 'orders' => 5, 'min_days_ago' => 20, 'max_days_ago' => 162, 'last_days_ago' => 27, 'avg_spend' => 315000, 'rating' => [4, 4, 3]],
            ['name' => 'Hani Fitriyah',       'phone' => '081234560034', 'orders' => 4, 'min_days_ago' => 23, 'max_days_ago' => 143, 'last_days_ago' => 32, 'avg_spend' => 360000, 'rating' => [3, 4, 4]],
            ['name' => 'Ivan Pradipta',       'phone' => '081234560035', 'orders' => 6, 'min_days_ago' => 15, 'max_days_ago' => 178, 'last_days_ago' => 20, 'avg_spend' => 265000, 'rating' => [4, 3, 3]],
        ];

        foreach ($profiles as $index => $profile) {
            $user = $this->createUser($profile, 'regular', $index + 1);
            $this->createOrdersForUser($user, $profile, 'mid');
        }
    }

    // =========================================================================
    // CLUSTER 3: OCCASIONAL / LOW VALUE CUSTOMERS
    // Ciri: F=1-2 order, M=Rp50rb-350rb, R=60-365 hari, rating rendah/tidak review
    // =========================================================================

    private function seedCluster3Occasional(): void
    {
        $profiles = [
            ['name' => 'Jaya Kusuma',      'phone' => '081234560036', 'orders' => 1, 'min_days_ago' => 60,  'max_days_ago' => 200, 'last_days_ago' => 90,  'avg_spend' => 180000, 'rating' => [2]],
            ['name' => 'Kania Rahmah',     'phone' => '081234560037', 'orders' => 2, 'min_days_ago' => 80,  'max_days_ago' => 250, 'last_days_ago' => 120, 'avg_spend' => 150000, 'rating' => [3, 2]],
            ['name' => 'Lukito Wibisono',  'phone' => '081234560038', 'orders' => 1, 'min_days_ago' => 100, 'max_days_ago' => 300, 'last_days_ago' => 180, 'avg_spend' => 250000, 'rating' => []],
            ['name' => 'Mira Susanti',     'phone' => '081234560039', 'orders' => 2, 'min_days_ago' => 70,  'max_days_ago' => 280, 'last_days_ago' => 100, 'avg_spend' => 200000, 'rating' => [2, 3]],
            ['name' => 'Niko Alfian',      'phone' => '081234560040', 'orders' => 1, 'min_days_ago' => 120, 'max_days_ago' => 320, 'last_days_ago' => 200, 'avg_spend' => 180000, 'rating' => [1]],
            ['name' => 'Olivia Handayani', 'phone' => '081234560041', 'orders' => 2, 'min_days_ago' => 90,  'max_days_ago' => 360, 'last_days_ago' => 150, 'avg_spend' => 130000, 'rating' => []],
            ['name' => 'Pandu Wijaya',     'phone' => '081234560042', 'orders' => 1, 'min_days_ago' => 75,  'max_days_ago' => 220, 'last_days_ago' => 75,  'avg_spend' => 320000, 'rating' => [3]],
            ['name' => 'Qita Zahrani',     'phone' => '081234560043', 'orders' => 2, 'min_days_ago' => 110, 'max_days_ago' => 365, 'last_days_ago' => 200, 'avg_spend' => 120000, 'rating' => [2, 1]],
            ['name' => 'Randy Setiawan',   'phone' => '081234560044', 'orders' => 1, 'min_days_ago' => 65,  'max_days_ago' => 190, 'last_days_ago' => 65,  'avg_spend' => 200000, 'rating' => []],
            ['name' => 'Sari Wahyuni',     'phone' => '081234560045', 'orders' => 2, 'min_days_ago' => 85,  'max_days_ago' => 270, 'last_days_ago' => 130, 'avg_spend' => 160000, 'rating' => [2, 2]],
            ['name' => 'Tono Haryanto',    'phone' => '081234560046', 'orders' => 1, 'min_days_ago' => 95,  'max_days_ago' => 290, 'last_days_ago' => 165, 'avg_spend' => 180000, 'rating' => [1]],
            ['name' => 'Uswatun Hasanah',  'phone' => '081234560047', 'orders' => 2, 'min_days_ago' => 105, 'max_days_ago' => 340, 'last_days_ago' => 190, 'avg_spend' => 140000, 'rating' => []],
            ['name' => 'Vino Pratama',     'phone' => '081234560048', 'orders' => 1, 'min_days_ago' => 60,  'max_days_ago' => 180, 'last_days_ago' => 60,  'avg_spend' => 250000, 'rating' => [3]],
            ['name' => 'Windi Rachmawati', 'phone' => '081234560049', 'orders' => 2, 'min_days_ago' => 115, 'max_days_ago' => 355, 'last_days_ago' => 210, 'avg_spend' => 110000, 'rating' => [2, 1]],
            ['name' => 'Yanti Nilasari',   'phone' => '081234560050', 'orders' => 1, 'min_days_ago' => 130, 'max_days_ago' => 365, 'last_days_ago' => 240, 'avg_spend' => 150000, 'rating' => []],
        ];

        foreach ($profiles as $index => $profile) {
            $user = $this->createUser($profile, 'occasional', $index + 1);
            $this->createOrdersForUser($user, $profile, 'low');
        }
    }

    // =========================================================================
    // HELPERS
    // =========================================================================

    private function loadProductCatalog(): void
    {
        $products = Product::all();

        if ($products->isEmpty()) {
            throw new \RuntimeException(
                'Tidak ada produk di database! Jalankan DatabaseSeeder terlebih dahulu: php artisan db:seed'
            );
        }

        foreach ($products as $product) {
            $this->productCatalog[] = [
                'id' => $product->id,
                'name' => $product->name,
                'price' => (float) $product->price,
            ];
        }
    }

    private function createUser(array $profile, string $cluster, int $index): User
    {
        $slug = strtolower(str_replace(' ', '_', $profile['name']));
        $username = $slug.'_'.$cluster[0].$index;
        $email = $username.'@dummy.florabelle.test';

        return User::create([
            'username' => $username,
            'name' => $profile['name'],
            'email' => $email,
            'password' => Hash::make('password'),
            'role' => 'user',
            'whatsapp_number' => $profile['phone'],
        ]);
    }

    /** @param array{orders:int, min_days_ago:int, max_days_ago:int, last_days_ago:int, avg_spend:int, rating:array<int>} $profile */
    private function createOrdersForUser(User $user, array $profile, string $spendTier): void
    {
        $totalOrders = $profile['orders'];
        $lastDaysAgo = $profile['last_days_ago'];
        $ratings = $profile['rating'];

        $orderDates = $this->generateOrderDates($totalOrders, $profile['min_days_ago'], $profile['max_days_ago'], $lastDaysAgo);
        $reviewIndex = 0;
        $reviewedIds = [];

        $timeSlots = ['08:00 - 11:00', '11:00 - 14:00', '14:00 - 17:00', '17:00 - 20:00'];
        $paymentMethods = ['transfer', 'transfer', 'transfer', 'cod', 'cod'];
        $greetings = ['Happy Birthday!', 'Selamat ulang tahun!', 'I love you!', 'Get well soon!', 'Congratulations!'];

        foreach ($orderDates as $orderDate) {
            $items = $this->pickRandomProducts($spendTier);
            $subtotal = array_sum(array_column($items, 'subtotal'));
            $deliveryFee = collect([15000, 15000, 20000, 20000, 35000])->random();
            $total = $subtotal + $deliveryFee;
            $hasCard = rand(0, 2) !== 0;

            $order = Order::create([
                'user_id' => $user->id,
                'total' => $total,
                'delivery_fee' => $deliveryFee,
                'payment_method' => collect($paymentMethods)->random(),
                'customer_name' => $user->name,
                'customer_phone' => $profile['phone'],
                'customer_address' => $this->randomAddress(),
                'notes' => rand(0, 3) === 0 ? 'Tolong dibungkus rapi ya kak, untuk hadiah.' : null,
                'delivery_date' => $orderDate->copy()->addDays(rand(1, 3)),
                'delivery_time_slot' => collect($timeSlots)->random(),
                'card_to' => $hasCard ? $this->randomFirstName() : null,
                'card_from' => $hasCard ? $user->name : null,
                'card_message' => $hasCard ? collect($greetings)->random() : null,
                'status' => 'completed',
                'payment_status' => 'paid',
                'created_at' => $orderDate,
                'updated_at' => $orderDate,
            ]);

            foreach ($items as $item) {
                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $item['product_id'],
                    'product_name' => $item['product_name'],
                    'price' => $item['price'],
                    'quantity' => $item['quantity'],
                    'created_at' => $orderDate,
                    'updated_at' => $orderDate,
                ]);
            }

            // Tambahkan review jika tersedia skor untuk transaksi ini
            if (isset($ratings[$reviewIndex])) {
                $reviewable = array_filter($items, fn ($i) => ! in_array($i['product_id'], $reviewedIds, true));

                if (! empty($reviewable)) {
                    $chosen = collect(array_values($reviewable))->first();

                    Review::create([
                        'user_id' => $user->id,
                        'product_id' => $chosen['product_id'],
                        'rating' => $ratings[$reviewIndex],
                        'comment' => $this->generateComment($ratings[$reviewIndex]),
                        'created_at' => $orderDate->copy()->addDays(rand(1, 5)),
                        'updated_at' => $orderDate->copy()->addDays(rand(1, 5)),
                    ]);

                    $reviewedIds[] = $chosen['product_id'];
                }

                $reviewIndex++;
            }
        }
    }

    /**
     * Hasilkan array Carbon dates untuk order seorang pelanggan.
     *
     * @return Carbon[]
     */
    private function generateOrderDates(int $count, int $minDaysAgo, int $maxDaysAgo, int $lastDaysAgo): array
    {
        $now = Carbon::now();
        $dates = [];

        // Tanggal order paling terakhir sesuai profil cluster
        $dates[] = $now->copy()->subDays($lastDaysAgo)->subHours(rand(0, 12));

        // Order-order sebelumnya tersebar di rentang lastDaysAgo sampai maxDaysAgo
        for ($i = 1; $i < $count; $i++) {
            $daysAgo = rand($lastDaysAgo + 5, $maxDaysAgo);
            $dates[] = $now->copy()->subDays($daysAgo)->subHours(rand(0, 23));
        }

        usort($dates, fn ($a, $b) => $a->timestamp <=> $b->timestamp);

        return $dates;
    }

    /**
     * @return array<int, array{product_id:int, product_name:string, price:float, quantity:int, subtotal:float}>
     */
    private function pickRandomProducts(string $spendTier): array
    {
        $catalog = collect($this->productCatalog);
        $itemCount = match ($spendTier) {
            'high' => rand(2, 4),
            'mid' => rand(1, 3),
            default => rand(1, 2),
        };

        $sorted = match ($spendTier) {
            'high' => $catalog->sortByDesc('price'),
            'low' => $catalog->sortBy('price'),
            default => $catalog->shuffle(),
        };

        $items = [];

        foreach ($sorted->take($itemCount) as $product) {
            $quantity = rand(1, 2);
            $items[] = [
                'product_id' => $product['id'],
                'product_name' => $product['name'],
                'price' => $product['price'],
                'quantity' => $quantity,
                'subtotal' => $product['price'] * $quantity,
            ];
        }

        return $items;
    }

    private function generateComment(int $rating): ?string
    {
        return match (true) {
            $rating === 5 => collect([
                'Bunganya sangat segar dan cantik! Pengiriman tepat waktu. Sangat puas!',
                'Kualitas premium, packaging rapih, penerima sangat senang. Recommended!',
                'Luar biasa! Buketnya bahkan lebih indah dari foto. Akan pesan lagi.',
            ])->random(),
            $rating === 4 => collect([
                'Bunga cantik dan segar. Packaging bisa lebih rapih lagi tapi overall bagus.',
                'Cukup puas dengan kualitasnya. Akan pertimbangkan order lagi.',
            ])->random(),
            $rating === 3 => collect([
                'Bunga cukup bagus tapi tidak sesuai foto. Masih bisa diterima.',
                'Standar. Tidak terlalu istimewa tapi tidak kecewa juga.',
            ])->random(),
            default => collect([
                'Bunga tidak sesuai ekspektasi, kondisi kurang segar saat tiba.',
                'Kecewa dengan kualitasnya. Tidak sesuai dengan harga yang dibayar.',
            ])->random(),
        };
    }

    private function randomAddress(): string
    {
        $streets = ['Jl. Merpati', 'Jl. Rajawali', 'Jl. Garuda', 'Jl. Cendrawasih', 'Jl. Nuri', 'Jl. Flamboyan', 'Jl. Anggrek', 'Jl. Melati'];
        $areas = [
            'No. '.rand(1, 100).', Palu Barat',
            'No. '.rand(1, 100).', Palu Timur',
            'No. '.rand(1, 100).', Palu Selatan',
            'No. '.rand(1, 100).', Palu Utara',
        ];

        return collect($streets)->random().' '.collect($areas)->random().', Sulawesi Tengah';
    }

    private function randomFirstName(): string
    {
        return collect([
            'Budi', 'Siti', 'Andi', 'Rina', 'Dodi', 'Lina', 'Roni', 'Mira',
            'Dani', 'Yuni', 'Tono', 'Wati', 'Agus', 'Dewi', 'Hadi', 'Sari',
        ])->random();
    }
}
