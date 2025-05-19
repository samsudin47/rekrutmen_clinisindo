<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CandidateStatus extends Model
{
    // Define the table associated with the model
    protected $table = 'status_candidate';
    // Define the primary key for the table
    protected $primaryKey = 'id';

    protected $fillable = [
        'code',
        'description'
    ];
}
