<?php
namespace App\Http\Controllers\Worker;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ProfileController extends Controller
{
    // GET /api/worker/profile
    public function show(Request $request)
    {
        return response()->json($request->user()->load('workerProfile'));
    }

    // PUT /api/worker/profile
    public function update(Request $request)
    {
        $data = $request->validate([
            'full_name'       => 'nullable|string',
            'phone'           => 'nullable|string',
            'email'           => 'nullable|email',
            'barangay'        => 'nullable|string',
            'purok'           => 'nullable|string',
            'latitude'        => 'nullable|numeric',
            'longitude'       => 'nullable|numeric',
            'bio'             => 'nullable|string',
            'skills'          => 'nullable|array',
            'years_experience'=> 'nullable|integer',
            'travel_distance' => 'nullable|string',
            'expected_rate'   => 'nullable|numeric',
            'rate_type'       => 'nullable|in:Daily,Hourly,Per Service,Monthly',
            'negotiable'      => 'nullable|boolean',
            'is_available'    => 'nullable|boolean',
            'work_days'       => 'nullable|array',
            'work_start'      => 'nullable|string',
            'work_end'        => 'nullable|string',
            'blocked_dates'   => 'nullable|array',
            'show_profile'    => 'nullable|boolean',
            'allow_location'  => 'nullable|boolean',
            'receive_alerts'  => 'nullable|boolean',
            'two_factor'      => 'nullable|boolean',
        ]);

        $request->user()->workerProfile()->updateOrCreate(
            ['user_id' => $request->user()->id],
            $data
        );

        return response()->json(['message' => 'Profile updated.']);
    }

    // POST /api/worker/profile/photo
    public function uploadPhoto(Request $request)
    {
        $request->validate(['photo' => 'required|image|max:5120']);
        $path = $request->file('photo')->store('worker-photos', 'public');
        $request->user()->workerProfile()->update(['photo_path' => $path]);
        return response()->json(['photo_url' => Storage::url($path)]);
    }
}