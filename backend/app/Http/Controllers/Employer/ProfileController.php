<?php
namespace App\Http\Controllers\Employer;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ProfileController extends Controller
{
    public function show(Request $request)
    {
        $user    = $request->user()->load('employerProfile');
        $profile = $user->employerProfile;
        if ($profile && $profile->photo_path && !str_starts_with($profile->photo_path, 'http')) {
            $profile->photo_path = Storage::disk('public')->url($profile->photo_path);
        }
        return response()->json($user);
    }

    public function update(Request $request)
    {
        $data = $request->validate([
            'household_name' => 'nullable|string',
            'phone'          => 'nullable|string',
            'alt_phone'      => 'nullable|string',
            'email'          => 'nullable|email',
            'barangay'       => 'nullable|string',
            'purok'          => 'nullable|string',
            'latitude'       => 'nullable|numeric',
            'longitude'      => 'nullable|numeric',
            'show_profile'   => 'nullable|boolean',
            'allow_location' => 'nullable|boolean',
            'receive_alerts' => 'nullable|boolean',
            'two_factor'     => 'nullable|boolean',
        ]);

        $request->user()->employerProfile()->updateOrCreate(
            ['user_id' => $request->user()->id],
            $data
        );

        return response()->json(['message' => 'Profile updated.']);
    }

    public function uploadPhoto(Request $request)
    {
        $request->validate(['photo' => 'required|image|max:5120']);
        $path = $request->file('photo')->store('employer-photos', 'public');
        $url  = Storage::disk('public')->url($path);
        $request->user()->employerProfile()->update(['photo_path' => $url]);
        return response()->json(['photo_url' => $url]);
    }
}