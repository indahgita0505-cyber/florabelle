<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BouquetOption extends Model
{
    use HasFactory;

    protected $fillable = [
        'custom_category_id',
        'category',
        'tab_type',
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

    public function customCategory()
    {
        return $this->belongsTo(CustomCategory::class, 'custom_category_id');
    }
}
