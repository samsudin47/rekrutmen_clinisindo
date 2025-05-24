<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class AnalaysisController extends Controller
{
    public function index(){
        return inertia('Analysis/Index');
    }
}
