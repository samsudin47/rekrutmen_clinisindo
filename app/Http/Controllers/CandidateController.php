<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Candidate;
use Inertia\Inertia;
use App\Models\CandidateStatus;

class CandidateController extends Controller
{

    public function index(){
        $candidates = Candidate::with('status')->paginate(10);

        return Inertia::render('Candidate/Index', [
            'candidates' => $candidates,
        ]);
    }

    public function create(){
        return Inertia::render('Candidate/Create',[
            'statusList' => CandidateStatus::all(),
        ]);

    }

    public function store(Request $request){
        $request->validate([
            'kode'=>'required|unique:candidate,kode',
            'nama'=>'required',
            'posisi'=>'required',
            'pendidikan'=>'required',
            'pengalaman'=>'required',
            'gaji'=>'required',
            'psikotest'=>'required',
            'status_id'=>'required'
        ]);

        $candidate = Candidate::create($request->all());

        $candidate->trainingData()->create([
            'prediction_model' => 'Model Name', // Replace with actual model name
            'accuracy' => 0.0, // Initial accuracy, replace with actual value if needed
        ]);

        return redirect()->route('candidates');
    }

    public function edit(Candidate $candidate){
        return Inertia::render('Candidate/Edit', [
            'candidate' => $candidate,
            'statusList' => CandidateStatus::all(),
        ]);
    }

    public function update(Request $request, Candidate $candidate){
        $request->validate([
            'kode'=>'required|unique:candidate,kode,'.$candidate->id,
            'nama'=>'required',
            'posisi'=>'required',
            'pendidikan'=>'required',
            'pengalaman'=>'required',
            'gaji'=>'required',
            'psikotest'=>'required',
            'status_id'=>'nullable|exists:status_candidate,id'
        ]);

        $candidate->update($request->all());

        if($candidate->trainingData) {
            $candidate->trainingData->update([
                'prediction_model' => 'Updated Model Name', // Replace with actual updated model name
                'accuracy' => 0.0, // Update accuracy if needed
            ]);
        }

        return redirect()->route('candidates');
    }

}
