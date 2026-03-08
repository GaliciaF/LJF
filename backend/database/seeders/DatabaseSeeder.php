<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create system admin
        $this->call([
            CategorySeeder::class,
            UserSeeder::class,
            JobSeeder::class,
        ]);

        // You can also seed some dummy users if you want
        // User::factory(5)->create();
    }
} 