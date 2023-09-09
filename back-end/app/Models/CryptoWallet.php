<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CryptoWallet extends Model
{
    use HasFactory;

    protected $fillable = ['wallet_id', 'cryptocurrency_id', 'amount'];

    // Relationship to Wallet
    public function wallet ()
    {
        return $this->belongsTo(Wallet::class);
    }

    // Relationship to Cryptocurrency
    public function cryptocurrency() {
        return $this->belongsTo(Cryptocurrency::class, 'crypto_id');
    }
}
