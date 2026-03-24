<?php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\IdVerification;
use App\Models\WorkerProfile;
use Illuminate\Http\Request;

class VerificationController extends Controller
{
    // GET /api/admin/verifications?status=pending
    public function index(Request $request)
    {
        $verifications = IdVerification::with('worker.workerProfile')
            ->when($request->status, fn($q) => $q->where('status', $request->status))
            ->latest()
            ->paginate(20);

        return response()->json($verifications);
    }

    // PATCH /api/admin/verifications/{id}
    // body: { action: 'approve'|'reject'|'request_back', rejection_reason?: '...' }
    public function update(Request $request, IdVerification $verification)
    {
        $request->validate([
            'action'           => 'required|in:approve,reject,request_back',
            'rejection_reason' => 'nullable|string',
        ]);

        $statusMap = [
            'approve'      => 'approved',
            'reject'       => 'rejected',
            'request_back' => 'needs_back',
        ];

        $verification->update([
            'status'           => $statusMap[$request->action],
            'rejection_reason' => $request->rejection_reason,
        ]);

        // Sync to worker profile
        WorkerProfile::where('user_id', $verification->worker_id)
            ->update(['id_verification_status' => $statusMap[$request->action]]);
// After WorkerProfile::where(...)->update(...), add:
$verification->worker->notify(
    new \App\Notifications\IDVerificationUpdate($statusMap[$request->action], $request->rejection_reason)
);
        return response()->json(['message' => 'Verification updated.']);
    }
}