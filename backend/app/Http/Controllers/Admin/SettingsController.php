<?php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class SettingsController extends Controller
{
    // GET /api/admin/settings
    public function index()
    {
        return response()->json(Cache::get('platform_settings', [
            'platform_name'         => 'Local Job Finder',
            'municipality'          => 'Dolores, Eastern Samar',
            'admin_email'           => 'admin@localjobfinder.ph',
            'support_phone'         => '0917-123-4567',
            'otp_verification'      => true,
            'auto_suspend'          => true,
            'maintenance_mode'      => false,
            'block_unverified_jobs' => true,
            'barangays'             => ['Brgy. Dolores','Brgy. San Jose','Brgy. Sta. Cruz','Brgy. Bagong Silang','Brgy. Poblacion'],
        ]));
    }

    // PUT /api/admin/settings
    public function update(Request $request)
    {
        $settings = $request->validate([
            'platform_name'         => 'sometimes|string',
            'municipality'          => 'sometimes|string',
            'admin_email'           => 'sometimes|email',
            'support_phone'         => 'sometimes|string',
            'otp_verification'      => 'sometimes|boolean',
            'auto_suspend'          => 'sometimes|boolean',
            'maintenance_mode'      => 'sometimes|boolean',
            'block_unverified_jobs' => 'sometimes|boolean',
            'barangays'             => 'sometimes|array',
        ]);

        $existing = Cache::get('platform_settings', []);
        Cache::forever('platform_settings', array_merge($existing, $settings));

        return response()->json(['message' => 'Settings saved.']);
    }
}