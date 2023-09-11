<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
      

        \App\Models\User::factory()->create([
            'name' => 'Jérôme',
            'email' => 'admin@bitchest.com',
            'usertype' => 'admin',
        ]);
        
        \App\Models\User::factory(10)->create();

        $this->call([CryptocurrenciesTableSeeder::class, WalletsTableSeeder::class]);
    }
}
