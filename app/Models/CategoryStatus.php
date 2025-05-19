<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CategoryStatus extends Model
{
    protected $table = 'status_category';
    protected $fillable = [
        'description',
        'code'
    ];
}
