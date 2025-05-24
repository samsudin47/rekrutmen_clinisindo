<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\DataTraining;
use Inertia\Inertia;

class DataTrainingController extends Controller
{
    public function candidatesForTraining()
    {
        $dataTraining = DataTraining::with('candidate')->whereHas('candidate', function ($query) {
        $query->where('status', 'proses');
        })->get();

        return inertia('DataTraining', [
        'candidates' => $dataTraining,
    ]);
    }
}
