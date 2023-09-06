<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class CryptocurrenciesTableSeeder extends Seeder
{
    public function run()
    {
        // Optional: Clear the table
        // If you want to clear existing data every time you seed, uncomment the line below
        // DB::table('cryptocurrencies')->delete();


        $cryptocurrencies = [
            ['name' => 'Bitcoin', 'symbol' => 'BTC',  'price' => rand(30000, 60000)],
            ['name' => 'Bitcoin-cash', 'symbol' => 'BCH',  'price' => rand(1000, 3000)],
            ['name' => 'Cardano', 'symbol' => 'ADA', 'price' => rand(1, 3)],
            ['name' => 'Dash', 'symbol' => 'DASH',  'price' => rand(100, 300)],
            ['name' => 'Ethereum', 'symbol' => 'ETH',  'price' => rand(2000, 4000)],
            ['name' => 'Iota', 'symbol' => 'IOTA',  'price' => rand(0.5, 1.5)],
            ['name' => 'Litecoin', 'symbol' => 'LTC',  'price' => rand(100, 200)],
            ['name' => 'Nem', 'symbol' => 'XEM', 'price' => rand(0.2, 0.8)],
            ['name' => 'Ripple', 'symbol' => 'XRP',  'price' => rand(0.5, 1)],
            ['name' => 'Stellar', 'symbol' => 'XLM', 'price' => rand(0.2, 0.6)],
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
