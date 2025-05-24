<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('training_data',function(Blueprint $table){
            $table->id()->autoIncrement()->primary();
            $table->integer('candidate_id')->nullable()->foreign()->references('id')->on('candidate')->onDelete('cascade');
            $table->string('prediction_model')->nullable();
            $table->string('accuraty')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('training_data');
    }
};
