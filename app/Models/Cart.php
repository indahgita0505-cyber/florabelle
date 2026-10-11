<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Cart extends Model
{
    protected $fillable = [
        'user_id',
        'product_id',
        'quantity',
        'custom_name',
        'custom_request',
        'custom_price',
        'custom_image',
        'custom_data',
    ];

    protected $casts = [
        'custom_data' => 'array',
        'custom_price' => 'float',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}
