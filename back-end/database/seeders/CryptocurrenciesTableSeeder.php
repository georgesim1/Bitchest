<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class CryptocurrenciesTableSeeder extends Seeder
{
    public function run()
    {
      
        $cryptocurrencies = [
            ['name' => 'Bitcoin', 'symbol' => 'BTC',  'price' => rand(100, 300)],
            ['name' => 'Bitcoin-cash', 'symbol' => 'BCH',  'price' => rand(100, 300)],
            ['name' => 'Cardano', 'symbol' => 'ADA', 'price' => rand(100, 300)],
            ['name' => 'Dash', 'symbol' => 'DASH',  'price' => rand(100, 300)],
            ['name' => 'Ethereum', 'symbol' => 'ETH',  'price' => rand(100, 300)],
            ['name' => 'Iota', 'symbol' => 'IOTA',  'price' => rand(100, 300)],
            ['name' => 'Litecoin', 'symbol' => 'LTC',  'price' => rand(100, 300)],
            ['name' => 'Nem', 'symbol' => 'XEM', 'price' => rand(100, 300)],
            ['name' => 'Ripple', 'symbol' => 'XRP',  'price' => rand(100, 300)],
            ['name' => 'Stellar', 'symbol' => 'XLM', 'price' => rand(100, 300)],
        ];

        foreach ($cryptocurrencies as $crypto) {
            $slugifiedCryptoName = Str::slug($crypto['name'], '-');
            $imageName = $slugifiedCryptoName . '.png';
            DB::table('cryptocurrencies')->insert([
                'name' => $crypto['name'],
                'symbol' => $crypto['symbol'],
                'price' => $crypto['price'],
                'image' => env('APP_URL') . '/images/' . $imageName,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
