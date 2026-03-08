<?php
namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            ['name' => 'Plumbing',   'emoji' => '🔧'],
            ['name' => 'Electrical', 'emoji' => '⚡'],
            ['name' => 'Cleaning',   'emoji' => '🧹'],
            ['name' => 'Carpentry',  'emoji' => '🏗️'],
            ['name' => 'Gardening',  'emoji' => '🌿'],
        ];

        foreach ($categories as $c) {
            Category::firstOrCreate(['name' => $c['name']], $c);
        }
    }
}