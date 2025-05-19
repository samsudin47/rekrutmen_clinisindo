<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Criteria extends Model
{
    protected $table = 'criterias';

    public function category()
    {
        return $this->belongsTo(CategoryStatus::class, 'kategori_id');
    }

    protected $fillable =[
        'kode',
        'nama',
        'skala_pengukuran',
        'deskripsi',
        'kategori_id',
    ];
}
