<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BouquetOption extends Model
{
    use HasFactory;

    protected $fillable = [
        'category',
        'name',
        'image_url',
        'color_hex',
        'description',
        'price_adjustment',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'price_adjustment' => 'decimal:2',
    ];
}
