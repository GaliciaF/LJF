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
      Schema::create('disputes', function (Blueprint $table) {
    $table->id();
    $table->foreignId('job_id')->constrained()->cascadeOnDelete();
    $table->foreignId('raised_by')->constrained('users')->cascadeOnDelete();
    $table->text('worker_claim')->nullable();
    $table->text('employer_claim')->nullable();
    $table->enum('type', ['payment','identity','no-show','other'])->default('other');
    $table->enum('status', ['open','resolved','dismissed'])->default('open');
    $table->enum('urgency', ['normal','urgent'])->default('normal');
    $table->string('resolution')->nullable();
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
