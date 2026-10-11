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
        Schema::create('bouquet_options', function (Blueprint $table) {
            $table->id();
            $table->enum('category', ['isi', 'warna', 'wrapping', 'budget']);
            $table->string('name');
            $table->string('image_url')->nullable();
            $table->string('color_hex')->nullable();
            $table->text('description')->nullable();
            $table->decimal('price_adjustment', 15, 2)->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bouquet_options');
    }
};
