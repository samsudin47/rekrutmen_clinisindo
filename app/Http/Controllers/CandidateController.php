<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Candidate;
use Inertia\Inertia;

class CandidateController extends Controller
{

    public function index(){
        $candidates = Candidate::all();

        return Inertia::render('Candidate/Index', [
            'candidates' => $candidates,
        ]);
    }

    public function create(Request $request){
        $request->validate([
            'kode'=>'required|unique:candidate,kode',
            'nama'=>'required',
            'posisi'=>'required',
            'pendidikan'=>'required',
            'pengalaman'=>'required',
            'gaji'=>'required',
            'psikotest'=>'required'
        ]);

        Candidate::create($request->all());

        return redirect()->route('candidates');
    }
}
