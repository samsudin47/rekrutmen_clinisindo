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
        // Create the status_candidate table
        Schema::create('status_candidate', function (Blueprint $table) {
            $table->id();
            $table->integer('code')->unique();
            $table->string('description')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Drop the status_candidate table
        Schema::dropIfExists('status_candidate');
    }
};
