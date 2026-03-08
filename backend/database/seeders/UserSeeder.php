<?php
namespace Database\Seeders;

use App\Models\User;
use App\Models\EmployerProfile;
use App\Models\WorkerProfile;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // Admin
        $admin = User::firstOrCreate(['email' => 'admin@localjobfinder.ph'], [
            'name'     => 'Admin User',
            'phone'    => '09000000000',
            'password' => Hash::make('password'),
            'role'     => 'admin',
            'status'   => 'active',
        ]);

        // Employer
        $employer = User::firstOrCreate(['email' => 'employer@localjobfinder.ph'], [
            'name'     => 'Santos Household',
            'phone'    => '09171234567',
            'password' => Hash::make('password'),
            'role'     => 'employer',
            'status'   => 'active',
        ]);
        EmployerProfile::firstOrCreate(['user_id' => $employer->id], [
            'household_name' => 'Santos Household',
            'phone'          => '09171234567',
            'barangay'       => 'Brgy. San Jose',
            'purok'          => 'Purok 3',
        ]);

        // Worker
        $worker = User::firstOrCreate(['email' => 'worker@localjobfinder.ph'], [
            'name'     => 'Juan dela Cruz',
            'phone'    => '09123456789',
            'password' => Hash::make('password'),
            'role'     => 'worker',
            'status'   => 'active',
        ]);
        WorkerProfile::firstOrCreate(['user_id' => $worker->id], [
            'full_name'        => 'Juan dela Cruz',
            'phone'            => '09123456789',
            'barangay'         => 'Brgy. Dolores',
            'skills'           => ['Plumbing', 'Electrical'],
            'years_experience' => 5,
            'expected_rate'    => 800,
            'rate_type'        => 'Daily',
            'negotiable'       => true,
            'is_available'     => true,
        ]);
    }
}