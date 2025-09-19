<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class PremiumUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create a test user with active premium
        User::create([
            'name' => 'Premium User',
            'email' => 'premium@example.com',
            'password' => Hash::make('password'),
            'role' => 'user',
            'is_premium' => true,
            'premium_expires_at' => now()->addYear(), // Expires in 1 year
        ]);

        // Create a test user with lifetime premium
        User::create([
            'name' => 'Lifetime Premium User',
            'email' => 'lifetime@example.com',
            'password' => Hash::make('password'),
            'role' => 'user',
            'is_premium' => true,
            'premium_expires_at' => null, // Lifetime premium
        ]);

        // Create a test user with expired premium
        User::create([
            'name' => 'Expired Premium User',
            'email' => 'expired@example.com',
            'password' => Hash::make('password'),
            'role' => 'user',
            'is_premium' => true,
            'premium_expires_at' => now()->subDays(10), // Expired 10 days ago
        ]);

        // Update existing users to test the functionality
        $existingUser = User::first();
        if ($existingUser) {
            $existingUser->update([
                'is_premium' => false,
            ]);
        }
    }
}