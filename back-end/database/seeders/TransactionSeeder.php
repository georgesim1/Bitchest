<?php

namespace Database\Seeders;

use App\Models\Transaction;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class TransactionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        $user = User::first();
    
        Transaction::create([
            'user_id' => $user->id,
            'cryptocurrency_id' => 1, 
            'amount' => 100, 
            'price_at_transaction' => 50, 
            'transaction_type' => 'buy', 
        ]);
    }
    
}
