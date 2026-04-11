<?php
namespace App\Http\Controllers\Worker;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Hash;

class ProfileController extends Controller
{
    public function show(Request $request)
    {
        $user    = $request->user()->load('workerProfile');
        $profile = $user->workerProfile;
        if ($profile && $profile->photo_path && !str_starts_with($profile->photo_path, 'http')) {
            $profile->photo_path = Storage::disk('public')->url($profile->photo_path);
        }
        return response()->json($user);
    }

    public function index(Request $request)
    {
        $workers = User::where('role', 'worker')
            ->with(['workerProfile'])
            ->withAvg('reviewsReceived as avg_rating', 'rating')
            ->withCount('reviewsReceived as review_count')
            ->whereHas('workerProfile', fn($q) =>
                $q->where('is_available', true)->where('show_profile', true)
            )
            ->when($request->search, fn($q) =>
                $q->where('name', 'like', "%{$request->search}%")
                  ->orWhereHas('workerProfile', fn($q2) =>
                      $q2->whereJsonContains('skills', $request->search)
                  )
            )
            ->when($request->barangay, fn($q) =>
                $q->whereHas('workerProfile', fn($q2) =>
                    $q2->where('barangay', $request->barangay)
                )
            )
            ->latest()
            ->paginate(20);

        return response()->json($workers);
    }

    public function update(Request $request)
    {
        $data = $request->validate([
            'full_name'             => 'nullable|string',
            'phone'                 => 'nullable|string',
            'email'                 => 'nullable|email',
            'barangay'              => 'nullable|string',
            'purok'                 => 'nullable|string',
            'latitude'              => 'nullable|numeric',
            'longitude'             => 'nullable|numeric',
            'bio'                   => 'nullable|string',
            'skills'                => 'nullable|array',
            'years_experience'      => 'nullable|integer',
            'travel_distance'       => 'nullable|string',
            'expected_rate'         => 'nullable|numeric',
            'rate_type'             => 'nullable|in:Daily,Hourly,Per Service,Monthly',
            'negotiable'            => 'nullable|boolean',
            'is_available'          => 'nullable|boolean',
            'work_days'             => 'nullable|array',
            'work_start'            => 'nullable|string',
            'work_end'              => 'nullable|string',
            'blocked_dates'         => 'nullable|array',
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

        $request->user()->workerProfile()->updateOrCreate(
            ['user_id' => $request->user()->id],
            $profileData
        );

        if (!empty($profileData['full_name'])) {
            $request->user()->update(['name' => $profileData['full_name']]);
        }

        $user = $request->user()->fresh()->load('workerProfile');
        if ($user->workerProfile?->photo_path && !str_starts_with($user->workerProfile->photo_path, 'http')) {
            $user->workerProfile->photo_path = Storage::disk('public')->url($user->workerProfile->photo_path);
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
        $path = $request->file('photo')->store('worker-photos', 'public');
        $url  = Storage::disk('public')->url($path);
        $request->user()->workerProfile()->update(['photo_path' => $url]);
        return response()->json(['photo_url' => $url]);
    }
}