<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Candidate extends Model
{
    protected $table = 'candidate';

    protected $primaryKey = 'id';
    public function trainingData()
    {
        return $this->hasOne(DataTraining::class, 'candidate_id');
    }

    public function status()
    {
        return $this->belongsTo(CandidateStatus::class, 'status_id');
    }

    protected $fillable = [
        'kode',
        'nama',
        'posisi',
        'pendidikan',
        'pengalaman',
        'gaji',
        'psikotest',
        'status_id'
    ];
}
