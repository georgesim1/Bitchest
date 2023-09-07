<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CryptoWalletTableSeeder extends Seeder
{
    public function run()
    {
        $wallets = DB::table('wallets')->get();
        $cryptocurrencies = DB::table('cryptocurrencies')->get();

        foreach ($wallets as $wallet) {
            foreach ($cryptocurrencies as $crypto) {
                DB::table('crypto_wallets')->insert([
                    'wallet_id' => $wallet->id,
                    'crypto_id' => $crypto->id,
                    'amount' => mt_rand(1, 10000) / 100,  // Random amount. Adjust as needed.
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }
    }
}
