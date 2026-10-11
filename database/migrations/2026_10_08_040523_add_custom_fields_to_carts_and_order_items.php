<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('carts', function (Blueprint $table) {
            $table->string('custom_name')->nullable()->after('quantity');
            $table->text('custom_request')->nullable()->after('custom_name');
            $table->decimal('custom_price', 15, 2)->nullable()->after('custom_request');
            $table->string('custom_image')->nullable()->after('custom_price');
            $table->json('custom_data')->nullable()->after('custom_image');
        });

        Schema::table('order_items', function (Blueprint $table) {
            $table->text('custom_request')->nullable()->after('quantity');
            $table->string('image_url')->nullable()->after('custom_request');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('carts', function (Blueprint $table) {
            $table->dropColumn(['custom_name', 'custom_request', 'custom_price', 'custom_image', 'custom_data']);
        });

        Schema::table('order_items', function (Blueprint $table) {
            $table->dropColumn(['custom_request', 'image_url']);
        });
    }
};
