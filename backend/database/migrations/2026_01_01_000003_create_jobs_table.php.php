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
      Schema::create('jobs', function (Blueprint $table) {
    $table->id();
    $table->foreignId('employer_id')->constrained('users')->cascadeOnDelete();
    $table->foreignId('category_id')
      ->nullable()
      ->constrained()
      ->nullOnDelete();
    $table->string('title');
    $table->text('description');
    $table->decimal('salary', 10, 2);
    $table->string('rate_type'); // Daily|Hourly|Per Service|Monthly
    $table->boolean('negotiable')->default(false);
    $table->string('barangay');
    $table->string('purok')->nullable();
    $table->decimal('latitude', 10, 7)->nullable();
    $table->decimal('longitude', 10, 7)->nullable();
    $table->date('start_date')->nullable();
    $table->time('start_time')->nullable();
    $table->boolean('notify_nearby')->default(true);
    $table->enum('status', ['open', 'filled', 'closed', 'flagged'])->default('open');
    $table->foreignId('hired_worker_id')->nullable()->constrained('users')->nullOnDelete();
    $table->timestamps();
});
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
       Schema::dropIfExists('jobs');
    }
};
