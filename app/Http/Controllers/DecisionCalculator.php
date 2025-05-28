<?php

namespace App\Http\Controllers;

use App\Models\DataTraining;
use Inertia\Inertia;


class DecisionCalculator extends Controller
{
    public function calculateDecision()
    {
        $dataTraining = DataTraining::with(['candidate.status'])->get();

        return Inertia::render('Analysis/DecisionCalculator', [
            'dataTraining' => $dataTraining,
            'activeTab' => 'decisionCalculator',
        ]);
    }
}
