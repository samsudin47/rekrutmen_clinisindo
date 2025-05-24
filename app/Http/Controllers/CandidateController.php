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

        Candidate::create($request->all());

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

        return redirect()->route('candidates');
    }

}
