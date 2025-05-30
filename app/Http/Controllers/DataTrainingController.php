<?php

namespace App\Http\Controllers;

use App\Models\DataTraining;
use Inertia\Inertia;

class DataTrainingController extends Controller
{
    public function data()
    {
        $dataTraining = DataTraining::with([
            'candidate.status'
        ])->paginate(20);



        return Inertia::render('Analysis/Index', [
            'dataTraining' => $dataTraining,
            'activeTab' => 'dataTraining',
        ]);
    }
}
