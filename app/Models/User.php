<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'is_premium',
        'premium_expires_at',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'is_premium' => 'boolean',
            'premium_expires_at' => 'datetime',
        ];
    }

    /**
     * Check if user has active premium subscription
     */
    public function isPremiumActive(): bool
    {
        if (!$this->is_premium) {
            return false;
        }

        // If premium_expires_at is null, it means lifetime premium
        if ($this->premium_expires_at === null) {
            return true;
        }

        return $this->premium_expires_at->isFuture();
    }

    /**
     * Get premium status label
     */
    public function getPremiumStatusAttribute(): string
    {
        if (!$this->is_premium) {
            return 'Free Account';
        }

        if ($this->premium_expires_at === null) {
            return 'Premium (Lifetime)';
        }

        if ($this->premium_expires_at->isFuture()) {
            return 'Premium (Active)';
        }

        return 'Premium (Expired)';
    }
}
