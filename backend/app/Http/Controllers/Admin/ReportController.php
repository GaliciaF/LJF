<?php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Report;
use App\Models\User;
use App\Notifications\UserReported;
use App\Notifications\UserSuspended;
use Illuminate\Http\Request;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Carbon;

// Create this new notification class in app/Notifications/AccountAction.php
// (shown below the controller)

class ReportController extends Controller
{
    // GET /api/admin/reports?status=pending
    public function index(Request $request)
    {
        $reports = Report::with(['reporter', 'reported'])
            ->when($request->status, fn($q) => $q->where('status', $request->status))
            ->latest()
            ->paginate(20);

        return response()->json($reports);
    }

    // PATCH /api/admin/reports/{id}
    // body: { action: 'warn'|'suspend'|'ban'|'dismiss', suspension_reason?, suspended_until? }
    public function update(Request $request, Report $report)
{
    $request->validate([
        'action'            => 'required|in:warn,suspend,ban,dismiss',
        'suspension_reason' => 'nullable|string|max:500',
        'suspended_until'   => 'nullable|date|after:now',
    ]);

    $reportedUser = User::find($report->reported_id);

    if ($request->action === 'dismiss') {
        $report->update(['status' => 'dismissed']);

    } elseif ($request->action === 'warn') {
        // User stays active — just gets a notification
        $reportedUser->notify(new \App\Notifications\AccountAction(
            action: 'warned',
            reason: $request->suspension_reason,
        ));

        // Notify all admins
        User::where('role', 'admin')->each(fn($admin) =>
            $admin->notify(new \App\Notifications\UserSuspended($reportedUser, 'warned'))
        );

        $report->update(['status' => 'resolved']);

    } elseif ($request->action === 'suspend') {
        $reportedUser->update([
            'status'            => 'suspended',
            'suspension_reason' => $request->suspension_reason,
            'suspended_until'   => $request->suspended_until,
        ]);

        $reportedUser->notify(new \App\Notifications\AccountAction(
            action: 'suspended',
            reason: $request->suspension_reason,
            suspendedUntil: $request->suspended_until,
        ));

        User::where('role', 'admin')->each(fn($admin) =>
            $admin->notify(new \App\Notifications\UserSuspended($reportedUser, 'suspended'))
        );

        $report->update(['status' => 'resolved']);

    } elseif ($request->action === 'ban') {
        $reportedUser->update([
            'status'            => 'banned',
            'suspension_reason' => $request->suspension_reason,
            'suspended_until'   => null,
        ]);

        $reportedUser->notify(new \App\Notifications\AccountAction(
            action: 'banned',
            reason: $request->suspension_reason,
        ));

        User::where('role', 'admin')->each(fn($admin) =>
            $admin->notify(new \App\Notifications\UserSuspended($reportedUser, 'banned'))
        );

        $report->update(['status' => 'resolved']);
    }

    return response()->json(['message' => 'Report handled.']);
}
}