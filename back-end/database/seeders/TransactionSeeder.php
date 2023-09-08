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
        $user = User::first(); // Or however you'd like to fetch the user
    
        Transaction::create([
            'user_id' => $user->id,
            'cryptocurrency_id' => 1, // ID for the cryptocurrency of your choice
            'amount' => 100, // Default amount
            'price_at_transaction' => 50, // Default price
            'transaction_type' => 'buy', // Default type
        ]);
    }
    
}
