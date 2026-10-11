<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    protected $fillable = [
        'user_id',
        'total',
        'payment_method',
        'customer_name',
        'customer_phone',
        'customer_address',
        'notes',
        'status',
        'payment_status',
        'payment_proof_url',
        'rejection_reason',
        'delivery_date',
        'delivery_time_slot',
        'card_to',
        'card_from',
        'card_message',
        'delivery_fee',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }
}
