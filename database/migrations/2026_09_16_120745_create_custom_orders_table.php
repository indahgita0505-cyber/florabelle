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
        Schema::create('custom_orders', function (Blueprint $table) {
            $table->id();
            $table->json('isi_buket')->nullable();
            $table->string('tema_warna')->nullable();
            $table->string('wrapping')->nullable();
            $table->decimal('budget', 12, 2)->default(0);
            $table->text('ucapan')->nullable();
            $table->string('status')->default('pending'); // pending, processed, completed, cancelled
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('custom_orders');
    }
};
