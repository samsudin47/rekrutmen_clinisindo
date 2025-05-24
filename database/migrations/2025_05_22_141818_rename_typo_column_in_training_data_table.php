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
            // Rename the column 'accuraty' to 'accuracy'
            $table->renameColumn('accuraty', 'accuracy');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('training_data', function (Blueprint $table) {
            $table->renameColumn('accuracy', 'accuraty');
        });
    }
};
