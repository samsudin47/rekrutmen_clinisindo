<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Candidate extends Model
{
    protected $table = 'candidate';

    protected $fillable = [
        'kode',
        'nama',
        'posisi',
        'pendidikan',
        'pengalaman',
        'gaji',
        'psikotest'
    ];
}
