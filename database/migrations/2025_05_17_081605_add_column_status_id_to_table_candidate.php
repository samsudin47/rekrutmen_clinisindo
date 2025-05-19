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
        // Schema::table('candidate', function (Blueprint $table) {
        //     // Add the status_id column to the candidate table
        //     $table->foreignId('status_id')->nullable()->constrained('status_candidate')->onDelete('cascade');
        //     // Add an index to the status_id column
        //     $table->index('status_id');
        // });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('candidate', function (Blueprint $table) {
            // Drop the foreign key constraint and index on the status_id column
            $table->dropForeign(['status_id']);
            $table->dropIndex(['status_id']);
            // Drop the status_id column
            $table->dropColumn('status_id');
        });
    }
};
