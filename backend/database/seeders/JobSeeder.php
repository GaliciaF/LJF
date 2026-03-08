<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Job;

class JobSeeder extends Seeder
{
    public function run(): void
    {
        Job::create([
            'employer_id' => 2,
            'category_id' => 1,
            'title' => 'Fix Kitchen Sink',
            'description' => 'Need plumber to fix leaking sink',
            'salary' => 500,
            'rate_type' => 'Per Service',
            'barangay' => 'San Isidro',
        ]);
    }
}