<?php
namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\EmployerProfile;
use App\Models\WorkerProfile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $data = $request->validate([
            'name'     => 'required|string|max:255',
            'email'    => 'nullable|email|unique:users',
            'phone'    => 'nullable|string|max:20|unique:users',
            'password' => 'required|string|min:8|confirmed',
            'role'     => 'required|in:employer,worker',
            'barangay' => 'nullable|string',
        ]);

        $user = User::create([
            'name'     => $data['name'],
            'email'    => $data['email'] ?? null,
            'phone'    => $data['phone'] ?? null,
            'password' => Hash::make($data['password']),
            'role'     => $data['role'],
        ]);

        if ($user->role === 'employer') {
            EmployerProfile::create([
                'user_id'        => $user->id,
                'household_name' => $data['name'],
                'phone'          => $data['phone'] ?? null,
                'barangay'       => $data['barangay'] ?? null,
            ]);
        } else {
            WorkerProfile::create([
                'user_id'   => $user->id,
                'full_name' => $data['name'],
                'phone'     => $data['phone'] ?? null,
                'barangay'  => $data['barangay'] ?? null,
            ]);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json(['user' => $user, 'token' => $token], 201);
    }

    public function login(Request $request)
    {
        $request->validate([
            'email'    => 'required',
            'password' => 'required',
        ]);

        $user = User::where('email', $request->email)
                    ->orWhere('phone', $request->email)
                    ->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['Incorrect credentials.'],
            ]);
        }

        // Auto-reinstate if suspension period has ended
        if ($user->status === 'suspended' && $user->suspended_until && now()->gt($user->suspended_until)) {
            $user->update([
                'status'            => 'active',
                'suspension_reason' => null,
                'suspended_until'   => null,
            ]);
            $user->notify(new \App\Notifications\UserActionTaken(
                action: 'warned',
                reason: 'Your suspension period has ended and your account is now active again.',
            ));
        }

        if ($user->status === 'suspended') {
            return response()->json([
                'status'            => 'suspended',
                'suspension_reason' => $user->suspension_reason,
                'suspended_until'   => $user->suspended_until?->format('F j, Y'),
            ], 403);
        }

        if ($user->status === 'banned') {
            return response()->json([
                'status'            => 'banned',
                'suspension_reason' => $user->suspension_reason,
            ], 403);
        }

        $user->tokens()->delete();
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json(['user' => $user, 'token' => $token]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Logged out.']);
    }

    public function me(Request $request)
    {
        $user = $request->user();

        // Auto-reinstate if suspension period has ended
        if ($user->status === 'suspended' && $user->suspended_until && now()->gt($user->suspended_until)) {
            $user->update([
                'status'            => 'active',
                'suspension_reason' => null,
                'suspended_until'   => null,
            ]);
            $user->notify(new \App\Notifications\UserActionTaken(
                action: 'warned',
                reason: 'Your suspension period has ended and your account is now active again.',
            ));
        }

        if ($user->status === 'suspended') {
            return response()->json([
                'status'            => 'suspended',
                'suspension_reason' => $user->suspension_reason,
                'suspended_until'   => $user->suspended_until?->format('F j, Y'),
            ], 403);
        }

        if ($user->status === 'banned') {
            return response()->json([
                'status'            => 'banned',
                'suspension_reason' => $user->suspension_reason,
            ], 403);
        }

        $relations = match($user->role) {
            'employer' => ['employerProfile'],
            'worker'   => ['workerProfile'],
            default    => [],
        };

        return response()->json($user->load($relations));
    }
}