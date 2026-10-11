<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CustomOrder extends Model
{
    use HasFactory;

    protected $fillable = [
        'isi_buket',
        'tema_warna',
        'wrapping',
        'budget',
        'ucapan',
        'status',
        'customer_name',
        'customer_phone',
        'customer_address',
        'payment_method',
        'payment_status',
        'payment_proof_url',
    ];

    protected $casts = [
        'isi_buket' => 'array',
        'budget' => 'decimal:2',
    ];
}
