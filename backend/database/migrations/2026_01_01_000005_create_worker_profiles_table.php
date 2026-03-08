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
      Schema::create('worker_profiles', function (Blueprint $table) {
    $table->id();
    $table->foreignId('user_id')->constrained()->cascadeOnDelete();
    $table->string('full_name')->nullable();
    $table->string('phone')->nullable();
    $table->string('email')->nullable();
    $table->string('barangay')->nullable();
    $table->string('purok')->nullable();
    $table->decimal('latitude', 10, 7)->nullable();
    $table->decimal('longitude', 10, 7)->nullable();
    $table->string('photo_path')->nullable();
    $table->text('bio')->nullable();
    $table->json('skills')->nullable();        // ['Plumbing','Electrical']
    $table->integer('years_experience')->default(0);
    $table->string('travel_distance')->default('Up to 3km');
    $table->decimal('expected_rate', 10, 2)->nullable();
    $table->string('rate_type')->default('Daily'); // Daily|Hourly|Per Service
    $table->boolean('negotiable')->default(true);
    $table->boolean('is_available')->default(true);
    $table->json('work_days')->nullable();     // ['M','T','W','Th','F']
    $table->time('work_start')->nullable();
    $table->time('work_end')->nullable();
    $table->json('blocked_dates')->nullable(); // ['2025-03-01','2025-03-08']
    $table->enum('id_verification_status', ['none','pending','verified','rejected'])->default('none');
    $table->boolean('show_profile')->default(true);
    $table->boolean('allow_location')->default(true);
    $table->boolean('receive_alerts')->default(true);
    $table->boolean('two_factor')->default(false);
    $table->timestamps();
});
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('worker_profiles');
    }
};
