<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Wallet extends Model
{
    protected $fillable = ['user_id']; // Add other fields as necessary

    // Define the relationship to a user
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Define the relationship to cryptocurrencies
    public function cryptoHoldings()
    {
        return $this->hasMany(crypto_wallet::class);
            
    }
}

