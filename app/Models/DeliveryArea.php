<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class DeliveryArea extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'fee', 'is_active'];
}
