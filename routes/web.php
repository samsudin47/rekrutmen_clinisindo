<?php

use App\Http\Controllers\AnalaysisController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\CandidateController;
use App\Http\Controllers\CriteriaController;
use App\Http\Controllers\DataTrainingController;
use App\Http\Controllers\DecisionCalculator;
use App\Http\Controllers\RunDecisionTreeController;
use App\Http\Controllers\DecisionTreeController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware(['auth', 'admin'])->group(function(){
    Route::get('/users', [UserController::class, 'index'])->name('users');
    Route::get('/users/create', [UserController::class, 'create'])->name('users.create');
    Route::post('/users/store', [UserController::class, 'store'])->name('users.store');
    Route::get('/users/edit/{user}', [UserController::class, 'edit'])->name('users.edit');
    Route::patch('/users/update/{user}', [UserController::class, 'update'])->name('users.update');
});

Route::middleware('auth')->group(function(){
    Route::get('/candidates', [CandidateController::class, 'index'])->name('candidates');
    Route::get('/candidates/create', [CandidateController::class, 'create'])->name('candidates.create');
    Route::post('/candidates/store', [CandidateController::class, 'store'])->name('candidates.store');
    Route::get('/candidates/edit/{candidate}', [CandidateController::class, 'edit'])->name('candidates.edit');
    Route::patch('/candidates/update/{candidate}', [CandidateController::class, 'update'])->name('candidates.update');
});

Route::middleware('auth')->group(function(){
    Route::get('/criterias', [CriteriaController::class, 'index'])->name('criterias');
    Route::get('/criterias/create', [CriteriaController::class, 'create'])->name('criterias.create');
    Route::post('/criterias/store', [CriteriaController::class, 'store'])->name('criterias.store');
    Route::get('/criterias/edit/{criteria}', [CriteriaController::class, 'edit'])->name('criterias.edit');
    Route::patch('/criterias/update/{criteria}', [CriteriaController::class, 'update'])->name('criterias.update');
});

Route::middleware('auth')->group((function(){
    Route::get('/analysis', [AnalaysisController::class, 'index'])->name('analysis');
}));

Route::middleware('auth')->prefix('analysis')->group(function(){
    Route::get('/dataTraining', [DataTrainingController::class, 'data'])->name('dataTraining.data');
    Route::get('/decisionCalculator', [DecisionCalculator::class, 'calculateDecision'])->name('decisionCalculator.calculateDecision');
    Route::post('/run-decision-tree', [RunDecisionTreeController::class, 'runDecisionTree'])->name('run-decision-tree.runDecisionTree');
    Route::get('/decision-tree', [DecisionTreeController::class, 'index'])->name('decision-tree.index');
    Route::get('/decision-tree/data', [DecisionTreeController::class, 'getTreeData'])->name('decision-tree.getTreeData');
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
