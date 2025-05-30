<?php

namespace App\Http\Controllers;

use App\Models\DataTraining;
use Inertia\Inertia;

class DecisionTreeController extends Controller
{
    public function index()
    {
        try {
            $data = DataTraining::with('candidate')->get();
            $tree = $this->generateDecisionTree($data);

            return Inertia::render('Analysis/Index', [
                'initialTree' => $tree,
                'totalData' => $data->count(),
                'activeTab' => 'decision-tree',
            ]);
        } catch (\Exception $e) {
            return Inertia::render('Analysis/Index', [
                'initialTree' => null,
                'totalData' => 0,
                'error' => 'Gagal memuat data: ' . $e->getMessage()
            ]);
        }
    }

    public function getTreeData()
    {
        try {
            $data = DataTraining::with('candidate')->get();
            $tree = $this->generateDecisionTree($data);

            return response()->json([
                'success' => true,
                'tree' => $tree,
                'totalData' => $data->count(),
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Gagal memuat data: ' . $e->getMessage()
            ], 500);
        }
    }

    private function generateDecisionTree($data)
    {
        if ($data->isEmpty()) {
            return [
                'id' => 'empty',
                'condition' => 'Tidak ada data',
                'result' => 'Tidak ada data untuk dianalisis',
                'isTerminal' => true,
                'color' => 'bg-gray-500',
                'count' => 0,
                'details' => []
            ];
        }

        // Analisis distribusi berdasarkan prediction_model
        $distributions = $this->analyzeData($data);

        // Generate tree berdasarkan analisis
        return $this->buildTree($data, $distributions);
    }

    private function analyzeData($data)
    {
        $stats = [
            'total' => $data->count(),
            'byPrediction' => $data->groupBy('prediction_model')->map->count(),
            'byAccuracy' => $data->groupBy('accuracy')->map->count(),
        ];

        // Analisis berdasarkan psikotest dan hasil prediksi
        $psikotestAnalysis = [];
        foreach ($data as $item) {
            $psikotest = $item->candidate->psikotest ?? 0;
            $prediction = $item->prediction_model ?? 'Unknown';

            if ($psikotest < 70) {
                $psikotestAnalysis['under_70'][$prediction] = ($psikotestAnalysis['under_70'][$prediction] ?? 0) + 1;
            } else {
                $psikotestAnalysis['70_and_above'][$prediction] = ($psikotestAnalysis['70_and_above'][$prediction] ?? 0) + 1;
            }
        }

        // Analisis berdasarkan pendidikan
        $educationAnalysis = [];
        foreach ($data as $item) {
            $education = $item->candidate->education ?? 'Unknown';
            $prediction = $item->prediction_model ?? 'Unknown';
            $educationAnalysis[$education][$prediction] = ($educationAnalysis[$education][$prediction] ?? 0) + 1;
        }

        // Analisis berdasarkan pengalaman
        $experienceAnalysis = [];
        foreach ($data as $item) {
            $experience = $item->candidate->experience ?? 0;
            $prediction = $item->prediction_model ?? 'Unknown';

            if ($experience >= 2) {
                $experienceAnalysis['experienced'][$prediction] = ($experienceAnalysis['experienced'][$prediction] ?? 0) + 1;
            } else {
                $experienceAnalysis['novice'][$prediction] = ($experienceAnalysis['novice'][$prediction] ?? 0) + 1;
            }
        }

        return [
            'stats' => $stats,
            'psikotest' => $psikotestAnalysis,
            'education' => $educationAnalysis,
            'experience' => $experienceAnalysis,
        ];
    }

    private function buildTree($data, $distributions)
    {
        // Root node berdasarkan psikotest sebagai faktor utama
        $psikotestUnder70 = $data->filter(function ($item) {
            return ($item->candidate->psikotest ?? 0) < 70;
        });

        $psikotest70AndAbove = $data->filter(function ($item) {
            return ($item->candidate->psikotest ?? 0) >= 70;
        });

        return [
            'id' => 'root',
            'condition' => 'Nilai Psikotest',
            'threshold' => 70,
            'operator' => '>=',
            'isTerminal' => false,
            'children' => [
                $this->buildPsikotestUnder70Node($psikotestUnder70),
                $this->buildPsikotest70AboveNode($psikotest70AndAbove),
            ],
        ];
    }

    private function buildPsikotestUnder70Node($data)
    {
        if ($data->isEmpty()) {
            return [
                'id' => 'psikotest_under_70',
                'condition' => 'Psikotest < 70',
                'result' => 'Tidak ada data',
                'isTerminal' => true,
                'color' => 'bg-gray-500',
                'count' => 0,
                'details' => [],
            ];
        }

        $predictions = $data->groupBy('prediction_model')->map->count();
        $dominant = $predictions->keys()->first() ?? 'Tidak Diterima';

        return [
            'id' => 'psikotest_under_70',
            'condition' => 'Psikotest < 70',
            'result' => $this->mapPredictionToResult($dominant),
            'isTerminal' => true,
            'color' => $this->getColorByResult($this->mapPredictionToResult($dominant)),
            'count' => $data->count(),
            'details' => $predictions->toArray(),
        ];
    }

    private function buildPsikotest70AboveNode($data)
    {
        if ($data->isEmpty()) {
            return [
                'id' => 'psikotest_70_above',
                'condition' => 'Psikotest >= 70',
                'result' => 'Tidak ada data',
                'isTerminal' => true,
                'color' => 'bg-gray-500',
                'count' => 0,
                'details' => [],
            ];
        }

        return [
            'id' => 'psikotest_70_above',
            'condition' => 'Psikotest >= 70',
            'isTerminal' => false,
            'children' => [
                $this->buildExperienceNode($data),
            ],
        ];
    }

    private function buildExperienceNode($data)
    {
        $experienced = $data->filter(function ($item) {
            return ($item->candidate->experience ?? 0) >= 2;
        });

        $novice = $data->filter(function ($item) {
            return ($item->candidate->experience ?? 0) < 2;
        });

        return [
            'id' => 'experience_check',
            'condition' => 'Pengalaman Kerja',
            'threshold' => 2,
            'operator' => '>=',
            'isTerminal' => false,
            'children' => [
                $this->buildNoviceNode($novice),
                $this->buildExperiencedNode($experienced),
            ],
        ];
    }

    private function buildNoviceNode($data)
    {
        if ($data->isEmpty()) {
            return [
                'id' => 'novice',
                'condition' => 'Pengalaman < 2 tahun',
                'result' => 'Tidak ada data',
                'isTerminal' => true,
                'color' => 'bg-gray-500',
                'count' => 0,
                'details' => [],
            ];
        }

        $predictions = $data->groupBy('prediction_model')->map->count();
        $dominant = $predictions->keys()->first() ?? 'Tidak Diterima';

        return [
            'id' => 'novice',
            'condition' => 'Pengalaman < 2 tahun',
            'result' => $this->mapPredictionToResult($dominant),
            'isTerminal' => true,
            'color' => $this->getColorByResult($this->mapPredictionToResult($dominant)),
            'count' => $data->count(),
            'details' => $predictions->toArray(),
        ];
    }

    private function buildExperiencedNode($data)
    {
        if ($data->isEmpty()) {
            return [
                'id' => 'experienced',
                'condition' => 'Pengalaman >= 2 tahun',
                'result' => 'Tidak ada data',
                'isTerminal' => true,
                'color' => 'bg-gray-500',
                'count' => 0,
                'details' => [],
            ];
        }

        return [
            'id' => 'experienced',
            'condition' => 'Pengalaman >= 2 tahun',
            'isTerminal' => false,
            'children' => [
                $this->buildEducationNode($data),
            ],
        ];
    }

    private function buildEducationNode($data)
    {
        $highEducation = $data->filter(function ($item) {
            $edu = $item->candidate->education ?? '';
            return in_array($edu, ['S1', 'S2', 'S3', 'Sarjana', 'Magister', 'Doktor']);
        });

        $lowEducation = $data->filter(function ($item) {
            $edu = $item->candidate->education ?? '';
            return in_array($edu, ['SMP', 'SMA', 'SMK', 'Diploma']);
        });

        return [
            'id' => 'education_check',
            'condition' => 'Tingkat Pendidikan',
            'isTerminal' => false,
            'children' => [
                $this->buildEducationLowNode($lowEducation),
                $this->buildEducationHighNode($highEducation),
            ],
        ];
    }

    private function buildEducationLowNode($data)
    {
        if ($data->isEmpty()) {
            return [
                'id' => 'education_low',
                'condition' => 'SMP/SMA/SMK/Diploma',
                'result' => 'Tidak ada data',
                'isTerminal' => true,
                'color' => 'bg-gray-500',
                'count' => 0,
                'details' => [],
            ];
        }

        $predictions = $data->groupBy('prediction_model')->map->count();
        $dominant = $predictions->keys()->first() ?? 'Tidak Diterima';

        return [
            'id' => 'education_low',
            'condition' => 'SMP/SMA/SMK/Diploma',
            'result' => $this->mapPredictionToResult($dominant),
            'isTerminal' => true,
            'color' => $this->getColorByResult($this->mapPredictionToResult($dominant)),
            'count' => $data->count(),
            'details' => $predictions->toArray(),
        ];
    }

    private function buildEducationHighNode($data)
    {
        if ($data->isEmpty()) {
            return [
                'id' => 'education_high',
                'condition' => 'S1/S2/S3',
                'result' => 'Tidak ada data',
                'isTerminal' => true,
                'color' => 'bg-gray-500',
                'count' => 0,
                'details' => [],
            ];
        }

        $predictions = $data->groupBy('prediction_model')->map->count();
        $dominant = $predictions->keys()->first() ?? 'Tidak Diterima';

        return [
            'id' => 'education_high',
            'condition' => 'S1/S2/S3',
            'result' => $this->mapPredictionToResult($dominant),
            'isTerminal' => true,
            'color' => $this->getColorByResult($this->mapPredictionToResult($dominant)),
            'count' => $data->count(),
            'details' => $predictions->toArray(),
        ];
    }

    private function mapPredictionToResult($prediction)
    {
        $mapping = [
            'Diterima' => 'Diterima',
            'Dipertimbangkan' => 'Dipertimbangkan',
            'Tidak Diterima' => 'Tidak Diterima',
        ];

        return $mapping[$prediction] ?? 'Tidak Diterima';
    }

    private function getColorByResult($result)
    {
        $colors = [
            'Diterima' => 'bg-green-500',
            'Dipertimbangkan' => 'bg-yellow-500',
            'Tidak Diterima' => 'bg-red-500',
        ];

        return $colors[$result] ?? 'bg-gray-500';
    }
}
