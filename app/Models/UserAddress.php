<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

use Illuminate\Database\Eloquent\Attributes\Fillable;

#[Fillable(['user_id', 'label', 'recipient_name', 'phone_number', 'full_address', 'is_primary'])]
class UserAddress extends Model
{
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
