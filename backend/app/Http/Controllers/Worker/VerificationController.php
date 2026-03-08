<?php
namespace App\Http\Controllers\Worker;

use App\Http\Controllers\Controller;
use App\Models\IdVerification;
use Illuminate\Http\Request;

class VerificationController extends Controller
{
    // POST /api/worker/id-verification
    public function store(Request $request)
    {
        $request->validate([
            'id_type'  => 'required|in:PhilSys,Driver\'s License,Postal ID,Passport',
            'front'    => 'required|image|max:10240',
            'back'     => 'nullable|image|max:10240',
        ]);

        $frontPath = $request->file('front')->store('id-verifications', 'public');
        $backPath  = $request->file('back')?->store('id-verifications', 'public');

        $verification = IdVerification::updateOrCreate(
            ['worker_id' => $request->user()->id],
            [
                'id_type'    => $request->id_type,
                'front_path' => $frontPath,
                'back_path'  => $backPath,
                'status'     => 'pending',
            ]
        );

        $request->user()->workerProfile()->update(['id_verification_status' => 'pending']);

        return response()->json($verification, 201);
    }
}