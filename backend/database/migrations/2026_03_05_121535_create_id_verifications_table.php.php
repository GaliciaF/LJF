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
      Schema::create('id_verifications', function (Blueprint $table) {
    $table->id();
    $table->foreignId('worker_id')->constrained('users')->cascadeOnDelete();
    $table->string('id_type'); // PhilSys|Driver's License|Postal ID|Passport
    $table->string('front_path');
    $table->string('back_path')->nullable();
    $table->enum('status', ['pending','approved','rejected','needs_back'])->default('pending');
    $table->string('rejection_reason')->nullable();
    $table->timestamps();
});
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
    }
};
