<?php
namespace App\Http\Controllers\Employer;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Hash;

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
            'household_name'        => 'nullable|string',
            'phone'                 => 'nullable|string',
            'alt_phone'             => 'nullable|string',
            'email'                 => 'nullable|email',
            'barangay'              => 'nullable|string',
            'purok'                 => 'nullable|string',
            'latitude'              => 'nullable|numeric',
            'longitude'             => 'nullable|numeric',
            'show_profile'          => 'nullable|boolean',
            'allow_location'        => 'nullable|boolean',
            'receive_alerts'        => 'nullable|boolean',
            'two_factor'            => 'nullable|boolean',
            'current_password'      => 'nullable|string',
            'password'              => 'nullable|string|min:8',
            'password_confirmation' => 'nullable|string|same:password',
        ]);

        if (!empty($data['password'])) {
            if (empty($data['current_password']) || !Hash::check($data['current_password'], $request->user()->password)) {
                return response()->json(['message' => 'Current password is incorrect.'], 422);
            }
            $request->user()->update([
                'password' => Hash::make($data['password']),
            ]);
            $request->user()->tokens()->delete();
            $newToken = $request->user()->createToken('auth_token')->plainTextToken;
        }

        $profileData = collect($data)->except(['current_password', 'password', 'password_confirmation'])->toArray();

        $request->user()->employerProfile()->updateOrCreate(
            ['user_id' => $request->user()->id],
            $profileData
        );

        if (!empty($profileData['household_name'])) {
            $request->user()->update(['name' => $profileData['household_name']]);
        }

        $user = $request->user()->fresh()->load('employerProfile');
        if ($user->employerProfile?->photo_path && !str_starts_with($user->employerProfile->photo_path, 'http')) {
            $user->employerProfile->photo_path = Storage::disk('public')->url($user->employerProfile->photo_path);
        }

        $response = ['message' => 'Profile updated.', 'user' => $user];
        if (!empty($newToken)) {
            $response['token'] = $newToken;
        }

        return response()->json($response);
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