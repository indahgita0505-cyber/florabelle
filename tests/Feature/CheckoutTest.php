<?php

namespace Tests\Feature;

use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CheckoutTest extends TestCase
{
    use RefreshDatabase;

    public function test_guest_is_redirected_from_checkout(): void
    {
        $response = $this->get('/checkout');

        $response->assertRedirect('/login');
    }

    public function test_authenticated_user_can_access_checkout(): void
    {
        $user = User::factory()->create();

        Product::create([
            'name' => 'Bucket Bunga Pita',
            'price' => 150000,
            'stock' => 10,
        ]);

        $response = $this->actingAs($user)->get('/checkout');

        $response->assertOk();
    }

    public function test_user_can_submit_order_from_checkout(): void
    {
        $user = User::factory()->create();

        Product::create([
            'name' => 'Bucket Bunga Pita',
            'price' => 150000,
            'stock' => 10,
        ]);

        $response = $this->actingAs($user)->postJson('/orders', [
            'customer_name' => 'Indah Gita Cahyani',
            'customer_phone' => '082345678910',
            'customer_address' => 'Jl. Mawar No. 12, Kota Palu',
            'payment_method' => 'Transfer Bank (Bank BCA)',
            'payment_detail_name' => 'Bank BCA',
            'delivery_fee' => 15000,
            'total' => 285000,
        ]);

        $response->assertOk()
            ->assertJson([
                'success' => true,
                'status' => 'pending',
            ]);

        $this->assertDatabaseHas('orders', [
            'user_id' => $user->id,
            'customer_name' => 'Indah Gita Cahyani',
            'status' => 'pending',
        ]);
    }
}
