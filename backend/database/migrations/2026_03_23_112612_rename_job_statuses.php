<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // Step 1: Allow both old and new ENUM values
        DB::statement("
            ALTER TABLE jobs 
            MODIFY status ENUM(
                'open',
                'filled',
                'closed',
                'available',
                'not_available',
                'done'
            )
        ");

        // Step 2: Update values
        DB::statement("UPDATE jobs SET status = 'available' WHERE status = 'open'");
        DB::statement("UPDATE jobs SET status = 'not_available' WHERE status = 'filled'");
        DB::statement("UPDATE jobs SET status = 'done' WHERE status = 'closed'");

        // Step 3: Remove old ENUM values (optional but clean)
        DB::statement("
            ALTER TABLE jobs 
            MODIFY status ENUM(
                'available',
                'not_available',
                'done'
            )
        ");
    }

    public function down(): void
    {
        // Step 1: Allow both again
        DB::statement("
            ALTER TABLE jobs 
            MODIFY status ENUM(
                'open',
                'filled',
                'closed',
                'available',
                'not_available',
                'done'
            )
        ");

        // Step 2: Revert values
        DB::statement("UPDATE jobs SET status = 'open' WHERE status = 'available'");
        DB::statement("UPDATE jobs SET status = 'filled' WHERE status = 'not_available'");
        DB::statement("UPDATE jobs SET status = 'closed' WHERE status = 'done'");

        // Step 3: Restore original ENUM
        DB::statement("
            ALTER TABLE jobs 
            MODIFY status ENUM(
                'open',
                'filled',
                'closed'
            )
        ");
    }
};