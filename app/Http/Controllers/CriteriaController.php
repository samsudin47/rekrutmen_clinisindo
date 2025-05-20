<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Criteria;
use Inertia\Inertia;
use App\Models\CategoryStatus;

class CriteriaController extends Controller
{
    public function index()
    {
        $criterias = Criteria::with('category')->paginate(10);

        return Inertia::render('Criteria/Index', [
            'criterias' => $criterias,
        ]);
    }

    public function create()
    {
        return Inertia::render('Criteria/Create',[
            'categoryList' => CategoryStatus::all(),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'kode'=>'required|unique:criterias,id',
            'nama'=>'required',
            'skala_pengukuran'=>'required',
            'deskripsi'=>'required',
            'kategori_id'=>'required'
        ]);

        Criteria::create($request->all());

        return redirect()->route('criterias');
    }

    public function edit(Criteria $criteria){
        return Inertia::render('Criteria/Edit',[
            'criteria' => $criteria,
            'categoryList' => CategoryStatus::all(),
        ]);
    }
}
