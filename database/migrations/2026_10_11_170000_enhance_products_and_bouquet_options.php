<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // 1. Add is_available to products table if not exists
        if (! Schema::hasColumn('products', 'is_available')) {
            Schema::table('products', function (Blueprint $table) {
                $table->boolean('is_available')->default(true)->after('stock');
            });
        }

        // 2. Create custom_categories table if not exists
        if (! Schema::hasTable('custom_categories')) {
            Schema::create('custom_categories', function (Blueprint $table) {
                $table->id();
                $table->string('name');
                $table->string('slug')->unique();
                $table->text('description')->nullable();
                $table->decimal('base_price', 15, 2)->default(0);
                $table->string('image_url')->nullable();
                $table->boolean('is_active')->default(true);
                $table->timestamps();
            });

            // Seed initial 4 categories matching design
            DB::table('custom_categories')->insert([
                [
                    'name' => 'Bucket Uang',
                    'slug' => 'uang',
                    'description' => 'Buket yang berisi uang dengan berbagai nominal sesuai permintaan.',
                    'base_price' => 150000,
                    'image_url' => '/images/custom/uang.jpg',
                    'is_active' => true,
                    'created_at' => now(),
                    'updated_at' => now(),
                ],
                [
                    'name' => 'Snack Bucket',
                    'slug' => 'snack',
                    'description' => 'Buket kombinasi snack dengan beragam macam pilihan menarik.',
                    'base_price' => 120000,
                    'image_url' => '/images/custom/snack.jpg',
                    'is_active' => true,
                    'created_at' => now(),
                    'updated_at' => now(),
                ],
                [
                    'name' => 'Bucket Cokelat',
                    'slug' => 'cokelat',
                    'description' => 'Buket tema cokelat dengan variasi merk dan pilihan manis.',
                    'base_price' => 150000,
                    'image_url' => '/images/custom/coklat.jpg',
                    'is_active' => true,
                    'created_at' => now(),
                    'updated_at' => now(),
                ],
                [
                    'name' => 'Bucket Boneka',
                    'slug' => 'boneka',
                    'description' => 'Buket berisi boneka lucu untuk berbagai momen istimewa.',
                    'base_price' => 130000,
                    'image_url' => '/images/custom/boneka.jpg',
                    'is_active' => true,
                    'created_at' => now(),
                    'updated_at' => now(),
                ],
            ]);
        }

        // 3. Add custom_category_id and tab_type to bouquet_options table
        if (! Schema::hasColumn('bouquet_options', 'custom_category_id')) {
            Schema::table('bouquet_options', function (Blueprint $table) {
                $table->unsignedBigInteger('custom_category_id')->nullable()->after('id');
                $table->string('tab_type', 50)->default('wrapping')->after('category');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (Schema::hasColumn('bouquet_options', 'custom_category_id')) {
            Schema::table('bouquet_options', function (Blueprint $table) {
                $table->dropColumn(['custom_category_id', 'tab_type']);
            });
        }

        Schema::dropIfExists('custom_categories');

        if (Schema::hasColumn('products', 'is_available')) {
            Schema::table('products', function (Blueprint $table) {
                $table->dropColumn('is_available');
            });
        }
    }
};
