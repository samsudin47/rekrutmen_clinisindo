<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

class PremiumAccountTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_check_if_premium_is_active()
    {
        // Create a user with active premium
        $user = User::factory()->create([
            'is_premium' => true,
            'premium_expires_at' => now()->addMonth(),
        ]);

        $this->assertTrue($user->isPremiumActive());
    }

    public function test_user_with_expired_premium_returns_false()
    {
        // Create a user with expired premium
        $user = User::factory()->create([
            'is_premium' => true,
            'premium_expires_at' => now()->subDay(),
        ]);

        $this->assertFalse($user->isPremiumActive());
    }

    public function test_user_with_lifetime_premium_returns_true()
    {
        // Create a user with lifetime premium (null expiry)
        $user = User::factory()->create([
            'is_premium' => true,
            'premium_expires_at' => null,
        ]);

        $this->assertTrue($user->isPremiumActive());
    }

    public function test_user_without_premium_returns_false()
    {
        // Create a user without premium
        $user = User::factory()->create([
            'is_premium' => false,
        ]);

        $this->assertFalse($user->isPremiumActive());
    }

    public function test_premium_status_attribute_returns_correct_text()
    {
        // Test free account
        $freeUser = User::factory()->create(['is_premium' => false]);
        $this->assertEquals('Free Account', $freeUser->premium_status);

        // Test active premium
        $premiumUser = User::factory()->create([
            'is_premium' => true,
            'premium_expires_at' => now()->addMonth(),
        ]);
        $this->assertEquals('Premium (Active)', $premiumUser->premium_status);

        // Test lifetime premium
        $lifetimeUser = User::factory()->create([
            'is_premium' => true,
            'premium_expires_at' => null,
        ]);
        $this->assertEquals('Premium (Lifetime)', $lifetimeUser->premium_status);

        // Test expired premium
        $expiredUser = User::factory()->create([
            'is_premium' => true,
            'premium_expires_at' => now()->subDay(),
        ]);
        $this->assertEquals('Premium (Expired)', $expiredUser->premium_status);
    }
}