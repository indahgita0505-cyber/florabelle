<?php

namespace Tests\Feature;

use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CustomBouquetTest extends TestCase
{
    use RefreshDatabase;

    public function test_custom_bouquet_page_is_rendered_successfully(): void
    {
        $response = $this->get('/custom-bouquet');

        $response->assertOk();
    }

    public function test_user_can_submit_custom_bouquet_uang_request(): void
    {
        $user = User::factory()->create();
        $product = Product::create([
            'name' => 'Buket Uang',
            'price' => 50000,
            'stock' => 10,
        ]);

        $payload = [
            'jenis_bucket' => 'Bucket Uang',
            'isi_request' => 'Rp1.000 × 10 lembar, Rp2.000 × 5 lembar',
            'warna_kertas' => 'Pink',
            'model_kertas' => 'Polos',
            'warna_pita' => 'Putih',
            'model_pita' => 'Pita Standar',
            'hiasan' => ['Kartu ucapan'],
            'komentar_khusus' => 'Saya mau bucket uang dengan campuran Rp1.000 dan Rp2.000, dibuat penuh.',
            'estimasi_harga' => 120000,
        ];

        $response = $this
            ->actingAs($user)
            ->postJson('/custom-bouquet', $payload);

        $response->assertOk()
            ->assertJson([
                'success' => true,
                'message' => 'Request bucket kamu telah berhasil dikirim. Silakan tunggu konfirmasi dari toko.',
            ]);

        $this->assertDatabaseHas('orders', [
            'user_id' => $user->id,
            'status' => 'pending',
            'total' => 120000,
        ]);

        $order = Order::where('user_id', $user->id)->latest()->first();
        $this->assertNotNull($order);
        $notes = json_decode($order->notes, true);
        $this->assertTrue($notes['is_custom_bucket']);
        $this->assertEquals('Bucket Uang', $notes['jenis_bucket']);
        $this->assertEquals('Rp1.000 × 10 lembar, Rp2.000 × 5 lembar', $notes['isi_request']);
    }

    public function test_user_can_submit_custom_bouquet_bunga_pita_request(): void
    {
        $user = User::factory()->create();
        $product = Product::create([
            'name' => 'Bucket Bunga Pita',
            'price' => 85000,
            'stock' => 10,
        ]);

        $payload = [
            'jenis_bucket' => 'Bucket Bunga Pita',
            'isi_request' => 'Bunga Pita Pink',
            'warna_bunga' => 'Pink',
            'warna_kertas' => 'Putih',
            'model_kertas' => 'Bergelombang',
            'warna_pita' => 'Pink',
            'model_pita' => 'Pita Standar',
            'hiasan' => ['Kartu ucapan', 'Boneka kecil'],
            'komentar_khusus' => 'Bunga pita warna pink, kertas putih, pita pengikat pink, ditambahkan boneka kecil dan kartu ucapan.',
            'estimasi_harga' => 135000,
        ];

        $response = $this
            ->actingAs($user)
            ->postJson('/custom-bouquet', $payload);

        $response->assertOk()
            ->assertJson([
                'success' => true,
            ]);

        $order = Order::where('user_id', $user->id)->latest()->first();
        $this->assertNotNull($order);
        $this->assertEquals('pending', $order->status);
        $notes = json_decode($order->notes, true);
        $this->assertEquals('Pink', $notes['warna_bunga']);
        $this->assertContains('Boneka kecil', $notes['hiasan']);
    }
}
