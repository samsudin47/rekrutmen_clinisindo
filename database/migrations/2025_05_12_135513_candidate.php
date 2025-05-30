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
        Schema::create('candidate', function(Blueprint $table){
            $table->id();
            $table->string(column: 'kode')->unique();
            $table->string('nama');
            $table->string('posisi');
            $table->string('pendidikan');
            $table->string('pengalaman');
            $table->string('gaji');
            $table->string('psikotest');
            $table->foreignId('status_id')->nullable()->constrained(table: 'status_candidate', column: 'id')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('candidate');
    }
};
