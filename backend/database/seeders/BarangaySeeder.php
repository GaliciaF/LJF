<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class BarangaySeeder extends Seeder
{
    public function run()
    {
        $barangays = [
            'Banlasan',
            'Bongbong',
            'Catoogan',
            'Guinob-an',
            'Hinlayagan Ilaud',
            'Hinlayagan Ilaya',
            'Kauswagan',
            'Kinan-oan',
            'La Victoria',
            'La Union',
            'Mabuhay Cabigohan',
            'Mahagbu',
            'Manuel M. Roxas',
            'Poblacion',
            'San Isidro',
            'San Vicente',
            'Santo Tomas',
            'Soom',
            'Tagum Norte',
            'Tagum Sur'
        ];

        foreach ($barangays as $brgy) {
            DB::table('barangays')->insert([
                'name' => $brgy
            ]);
        }
    }
}