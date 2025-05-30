<?php

namespace App\Http\Controllers;

use App\Models\DataTraining;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RunDecisionTreeController extends Controller
{
    public function runDecisionTree(Request $request)
    {
        $request->validate([
            'nama' => 'required|exists:training_data,id'
        ]);

        $id = $request->input('nama');
        $row = DataTraining::with('candidate.status')->findOrFail($id);

        // Ambil data dari relasi candidate
        $candidate = $row->candidate;
        $psikotest = (float) $candidate->psikotest;
        $pengalaman = (int) $candidate->pengalaman;
        $pendidikan = strtolower(trim($candidate->pendidikan));

        // Implementasi CART Decision Tree
        $prediction = $this->cartDecisionTree($psikotest, $pengalaman, $pendidikan);

        // Hitung akurasi berdasarkan status aktual
        $actualStatus = $candidate->status->description ?? '';
        $accuracy = $this->calculateAccuracy($prediction, $actualStatus);

        // Update prediction dan accuracy
        $row->update([
            'prediction_model' => $prediction,
            'accuracy' => $accuracy,
        ]);

        // Ambil data training yang sudah diupdate untuk ditampilkan
        $dataTraining = DataTraining::with(['candidate.status'])
            ->where('id', $id)
            ->paginate(1);

        return Inertia::render('Analysis/Data', [
            'dataTraining' => $dataTraining,
            'message' => 'Prediksi selesai dijalankan.',
            'prediction' => $prediction,
            'accuracy' => $accuracy,
            'calculationDetails' => $this->getCalculationDetails($psikotest, $pengalaman, $pendidikan, $prediction)
        ]);
    }

    /**
     * Implementasi CART Decision Tree Algorithm
     */
    private function cartDecisionTree($psikotest, $pengalaman, $pendidikan)
    {
        // Node 1: Root - Psikotest sebagai split utama
        if ($psikotest < 70) {
            return 'Tidak Diterima'; // Terminal node
        }

        // Node 2: Psikotest >= 65, split berdasarkan pengalaman
        if ($psikotest >= 65 && $psikotest <= 70) {
            // Node 3: Split berdasarkan pengalaman untuk kategori menengah
            if ($pengalaman < 1) {
                // Node 4: Split berdasarkan pendidikan
                if (in_array($pendidikan, ['smp', 'sma'])) {
                    return 'Tidak Diterima';
                } else {
                    return 'Dipertimbangkan';
                }
            } else {
                // Pengalaman >= 2
                return 'Dipertimbangkan';
            }
        }

        // Node 5: Psikotest > 80, split berdasarkan pengalaman
        if ($psikotest > 70) {
            if ($pengalaman >= 1) {
                // Node 6: Split berdasarkan pendidikan tinggi
                if (in_array($pendidikan, ['s1', 's2', 's3'])) {
                    return 'Diterima';
                } else {
                    return 'Dipertimbangkan';
                }
            } else {
                // Pengalaman < 3 tapi psikotest tinggi
                if (in_array($pendidikan, ['s1', 's2', 's3'])) {
                    return 'Dipertimbangkan';
                } else {
                    return 'Tidak Diterima';
                }
            }
        }

        // Default fallback
        return 'Dipertimbangkan';
    }

    /**
     * Hitung akurasi berdasarkan perbandingan prediksi vs aktual
     */
    private function calculateAccuracy($prediction, $actualStatus)
    {
        // Mapping status untuk perbandingan
        $statusMapping = [
            'Diterima' => ['diterima', 'd', 'accepted'],
            'Tidak Diterima' => ['tidak diterima', 'ditolak', 't', 'rejected'],
            'Dipertimbangkan' => ['dipertimbangkan', 'pertimbang', 'p', 'pending']
        ];

        $actualStatusLower = strtolower(trim($actualStatus));

        foreach ($statusMapping as $key => $values) {
            if (in_array($actualStatusLower, $values)) {
                return ($prediction === $key) ? 1 : 0;
            }
        }

        // Jika status tidak dikenali, return 0
        return 0;
    }

    /**
     * Dapatkan detail perhitungan untuk ditampilkan di frontend
     */
    private function getCalculationDetails($psikotest, $pengalaman, $pendidikan, $prediction)
    {
        $steps = [];

        $steps[] = "Langkah 1: Evaluasi Psikotest = {$psikotest}";

        if ($psikotest < 70) {
            $steps[] = "Psikotest < 70 → Tidak Diterima (Terminal)";
        } elseif ($psikotest >= 70 && $psikotest <= 80) {
            $steps[] = "Psikotest 70-80 → Evaluasi Pengalaman = {$pengalaman} tahun";
            $steps[] = "Langkah 2: Evaluasi Pendidikan = {$pendidikan}";
        } else {
            $steps[] = "Psikotest > 80 → Evaluasi Pengalaman = {$pengalaman} tahun";
            $steps[] = "Langkah 2: Evaluasi Pendidikan = {$pendidikan}";
        }

        $steps[] = "Hasil Prediksi: {$prediction}";

        return [
            'psikotest' => $psikotest,
            'pengalaman' => $pengalaman,
            'pendidikan' => $pendidikan,
            'steps' => $steps,
            'prediction' => $prediction
        ];
    }
}
