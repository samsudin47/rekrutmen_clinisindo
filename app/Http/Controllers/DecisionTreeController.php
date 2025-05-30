<?php

namespace App\Http\Controllers;

use App\Models\DataTraining;
use Inertia\Inertia;

class DecisionTreeController extends Controller
{
    public function index()
    {
        $data = DataTraining::with('candidate')->get();

        $tree = $this->generateDecisionTree($data);

        return Inertia::render('Analysis/DecisionTree', [
            'tree' => $tree, // Pastikan nama variabel konsisten
        ]);
    }

    private function generateDecisionTree($data)
    {
        $countUnder70 = $data->where('candidate.psikotest', '<', 70)->count();
        $count70AndAbove = $data->where('candidate.psikotest', '>=', 70)->count();

        $tree = [
            'id' => 'root',
            'condition' => 'Psikotest',
            'threshold' => 70,
            'operator' => '>=',
            'children' => [
                [
                    'id' => 'left',
                    'condition' => 'Psikotest < 70',
                    'result' => 'Tidak Diterima',
                    'isTerminal' => true,
                    'color' => 'bg-red-500',
                    'count' => $countUnder70,
                ],
                [
                    'id' => 'right',
                    'condition' => 'Psikotest >= 70',
                    'threshold' => 80,
                    'operator' => '<=',
                    'children' => [
                        [
                            'id' => 'exp_check',
                            'condition' => 'Pengalaman',
                            'threshold' => 1,
                            'operator' => '>=',
                            'children' => [
                                [
                                    'id' => 'accepted',
                                    'condition' => 'Pendidikan',
                                    'children' => [
                                        [
                                            'id' => 'edu_high',
                                            'condition' => 'S1/S2/S3',
                                            'result' => 'Diterima',
                                            'isTerminal' => true,
                                            'color' => 'bg-green-500',
                                            'count' => $data->where('candidate.education', 'S1/S2/S3')->count(),
                                        ],
                                        [
                                            'id' => 'edu_low',
                                            'condition' => 'SMP/SMA',
                                            'result' => 'Dipertimbangkan',
                                            'isTerminal' => true,
                                            'color' => 'bg-yellow-500',
                                            'count' => $data->where('candidate.education', 'SMP/SMA')->count(),
                                        ],
                                    ],
                                ],
                            ],
                        ],
                    ],
                ],
            ],
        ];

        return $tree;
    }
}
