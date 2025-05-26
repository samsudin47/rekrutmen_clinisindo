<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\DataTraining;
use Inertia\Inertia;

class DataTrainingController extends Controller
{
    public function data()
    {
        $dataTraining = DataTraining::with([
            'candidate.status'
        ])->get();

        $metrics = [
            // 'accuracy' => DataTraining::avg('accuracy'),
            // 'totalData' => DataTraining::count(),
            // 'totalCandidates' => DataTraining::distinct('candidate_id')->count(),
            'akurasi' => '86.67%' // Example static value, replace with actual calculation if needed
        ];

        return Inertia::render('Analysis/Data', [
            'dataTraining' => $dataTraining,
            'activeTab' => 'dataTraining',
            'metrics'=> $metrics,
        ]);
    }
}
