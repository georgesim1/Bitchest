<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\User>
 */
class UserFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => $this->faker->name(), // $this->faker-> - if there are problems you can delete the ($this->) part and just leave faker
            'email' => $this->faker->unique()->safeEmail(),
            'email_verified_at' => now(),
            'password' => '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
            'remember_token' => Str::random(10),
            // 'balance' => $this->randomFloat(5, 15) 
        ];
        
    }

    /**
     * Indicate that the model's email address should be unverified.
     */
    public function unverified(): static
    {
        return $this->state(fn (array $attributes) => [
            'email_verified_at' => null,
        ]);
    }

    /**
     * Generate a random float number between two numbers
     *
     * @param float $min Minimum value
     * @param float $max Maximum value
     * @param int $precision Number of decimal places
     * @return float Random float value
     */
    private function randomFloat($min = 0, $max = 1, $precision = 2): float
    {
        if ($min > $max) {
            throw new \InvalidArgumentException("Minimum value cannot be greater than the maximum value.");
        }

        $factor = pow(10, $precision);
        return mt_rand($min * $factor, $max * $factor) / $factor;
    }

    
}
