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
        Schema::table('training_data', function (Blueprint $table) {
            $table->dropForeign(['candidate_id']);
            $table->unsignedBigInteger('candidate_id')->change();
            $table->foreign('candidate_id')->references('id')->on('candidate')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('training_data', function (Blueprint $table) {
            $table->dropForeign(['candidate_id']);
            $table->integer('candidate_id')->change();
            $table->foreign('candidate_id')->references('id')->on('candidate')->onDelete('cascade');
        });
    }
};
