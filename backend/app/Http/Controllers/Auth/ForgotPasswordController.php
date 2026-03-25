<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\PasswordResetOtp;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;

class ForgotPasswordController extends Controller
{
    /**
     * STEP 1: User submits their email or phone.
     * We find the account, generate a 6-digit OTP, and send it.
     */
    public function sendOtp(Request $request)
    {
        $request->validate([
            'identifier' => 'required|string',
        ]);

        $identifier = trim($request->identifier);

        // Find user by email OR phone
        $user = User::where('email', $identifier)
                    ->orWhere('phone', $identifier)
                    ->first();

        if (!$user) {
            return response()->json([
                'message' => 'No account found with that email or phone number.'
            ], 404);
        }

        // Delete old unused OTPs for this user
        PasswordResetOtp::where('user_id', $user->id)->delete();

        // Generate a random 6-digit OTP
        $otp = str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);

        // Save OTP to database (expires in 10 minutes)
        PasswordResetOtp::create([
            'user_id'    => $user->id,
            'otp'        => $otp,
            'identifier' => $identifier,
            'used'       => false,
            'expires_at' => now()->addMinutes(10),
        ]);

        // Detect if identifier is email or phone
        $isEmail = filter_var($identifier, FILTER_VALIDATE_EMAIL);

        if ($isEmail) {
            $this->sendViaEmail($user, $otp);
        } else {
            $this->sendViaSms($user, $otp, $identifier);
        }

        return response()->json([
            'message' => 'OTP sent successfully.',
            'method'  => $isEmail ? 'email' : 'sms',
            // Mask the identifier for display (e.g. "jo***@gmail.com")
            'masked'  => $isEmail
                ? $this->maskEmail($identifier)
                : $this->maskPhone($identifier),
        ]);
    }

    /**
     * STEP 2: User submits the OTP to verify it.
     */
    public function verifyOtp(Request $request)
    {
        $request->validate([
            'identifier' => 'required|string',
            'otp'        => 'required|string|size:6',
        ]);

        $record = PasswordResetOtp::where('identifier', $request->identifier)
                                  ->where('otp', $request->otp)
                                  ->where('used', false)
                                  ->latest()
                                  ->first();

        if (!$record) {
            return response()->json(['message' => 'Invalid OTP.'], 422);
        }

        if ($record->isExpired()) {
            return response()->json(['message' => 'OTP has expired. Please request a new one.'], 422);
        }

        return response()->json(['message' => 'OTP verified.', 'valid' => true]);
    }

    /**
     * STEP 3: User submits the new password along with OTP for final verification.
     */
    public function resetPassword(Request $request)
    {
        $request->validate([
            'identifier'            => 'required|string',
            'otp'                   => 'required|string|size:6',
            'password'              => 'required|string|min:8|confirmed',
        ]);

        $record = PasswordResetOtp::where('identifier', $request->identifier)
                                  ->where('otp', $request->otp)
                                  ->where('used', false)
                                  ->latest()
                                  ->first();

        if (!$record) {
            return response()->json(['message' => 'Invalid OTP.'], 422);
        }

        if ($record->isExpired()) {
            return response()->json(['message' => 'OTP has expired. Please request a new one.'], 422);
        }

        // Update the user's password
        $user = $record->user;
        $user->update(['password' => Hash::make($request->password)]);

        // Mark OTP as used
        $record->update(['used' => true]);

        // Revoke all tokens so they must log in fresh
        $user->tokens()->delete();

        return response()->json(['message' => 'Password reset successfully. Please log in.']);
    }

    // ─────────────────────────────────────────────────────────────
    // PRIVATE HELPERS
    // ─────────────────────────────────────────────────────────────

    private function sendViaEmail(User $user, string $otp): void
    {
        Mail::send([], [], function ($message) use ($user, $otp) {
            $message->to($user->email)
                    ->subject('Your LocalJobFinder Password Reset OTP')
                    ->html("
                        <div style='font-family: sans-serif; max-width: 480px; margin: auto;'>
                            <h2 style='color: #7c3aed;'>Password Reset</h2>
                            <p>Hi <strong>{$user->name}</strong>,</p>
                            <p>Use the OTP below to reset your password. It expires in <strong>10 minutes</strong>.</p>
                            <div style='font-size: 36px; font-weight: bold; letter-spacing: 10px; color: #4f46e5; padding: 20px 0;'>
                                {$otp}
                            </div>
                            <p style='color: #888; font-size: 13px;'>If you did not request this, ignore this email.</p>
                        </div>
                    ");
        });
    }

    private function sendViaSms(User $user, string $otp, string $phone): void
    {
        // ---------------------------------------------------------------
        // OPTION A: Twilio (recommended)
        // Run: composer require twilio/sdk
        // Add to .env: TWILIO_SID, TWILIO_TOKEN, TWILIO_FROM
        // ---------------------------------------------------------------
        // $twilio = new \Twilio\Rest\Client(
        //     config('services.twilio.sid'),
        //     config('services.twilio.token')
        // );
        // $twilio->messages->create($phone, [
        //     'from' => config('services.twilio.from'),
        //     'body' => "Your LocalJobFinder OTP is: {$otp}. Valid for 10 minutes.",
        // ]);

        // ---------------------------------------------------------------
        // OPTION B: Semaphore (popular in PH)
        // Run: composer require semaphore/sms
        // Add to .env: SEMAPHORE_API_KEY, SEMAPHORE_SENDER_NAME
        // ---------------------------------------------------------------
        // $semaphore = new \Semaphore\SmsClient(config('services.semaphore.api_key'));
        // $semaphore->send($phone, "Your LocalJobFinder OTP is: {$otp}. Valid for 10 minutes.");

        // ---------------------------------------------------------------
        // FALLBACK: Log to Laravel log (for local testing without SMS)
        // ---------------------------------------------------------------
        \Log::info("SMS OTP for {$phone}: {$otp}");
    }

    private function maskEmail(string $email): string
    {
        [$local, $domain] = explode('@', $email);
        $masked = substr($local, 0, 2) . str_repeat('*', max(strlen($local) - 2, 3));
        return $masked . '@' . $domain;
    }

    private function maskPhone(string $phone): string
    {
        return substr($phone, 0, 4) . str_repeat('*', max(strlen($phone) - 7, 3)) . substr($phone, -3);
    }
}