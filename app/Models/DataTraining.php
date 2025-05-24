<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DataTraining extends Model
{
    protected $table = 'training_data';
    protected $primaryKey = 'id';

    public function candidate()
    {
        return $this->belongsTo(Candidate::class, 'candidate_id');
    }
    protected $fillable = [
        'candidate_id',
        'prediction_model',
        'accuracy'
    ];

}
