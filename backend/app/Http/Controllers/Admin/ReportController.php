<?php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Report;
use App\Models\User;
use Illuminate\Http\Request;

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
        $request->validate(['action' => 'required|in:warn,suspend,ban,dismiss']);

        if ($request->action === 'dismiss') {
            $report->update(['status' => 'dismissed']);
        } else {
            $statusMap = ['suspend' => 'suspended', 'ban' => 'banned'];
            if (isset($statusMap[$request->action])) {
                User::find($report->reported_id)->update([
                    'status'            => $statusMap[$request->action],
                    'suspension_reason' => $request->suspension_reason,
                    'suspended_until'   => $request->suspended_until,
                ]);
            }
            $report->update(['status' => 'resolved']);
        }

        return response()->json(['message' => 'Report handled.']);
    }
}