<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Transaction extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'cryptocurrency_id',
        'amount',
        'price_at_transaction',
        'transaction_type',
    ];

    // Relationship to the User model
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Relationship to the Cryptocurrency model
    public function cryptocurrency()
    {
        return $this->belongsTo(Cryptocurrency::class);
    }
}

