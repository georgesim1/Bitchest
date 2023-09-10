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
                $amount = mt_rand(1, 10000) / 100;

                DB::table('crypto_wallets')->insert([
                    'wallet_id' => $wallet->id,
                    'crypto_id' => $crypto->id,
                    'amount' => $amount,
                    'global_value' => $amount * mt_rand(10, 1000) / 100, 
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }
    }
}
