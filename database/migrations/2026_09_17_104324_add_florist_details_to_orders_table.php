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
        Schema::table('orders', function (Blueprint $table) {
            $table->date('delivery_date')->nullable()->after('notes');
            $table->string('delivery_time_slot')->nullable()->after('delivery_date');

            $table->string('card_to')->nullable()->after('delivery_time_slot');
            $table->string('card_from')->nullable()->after('card_to');
            $table->text('card_message')->nullable()->after('card_from');

            $table->decimal('delivery_fee', 10, 2)->default(0)->after('total');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn([
                'delivery_date',
                'delivery_time_slot',
                'card_to',
                'card_from',
                'card_message',
                'delivery_fee',
            ]);
        });
    }
};
