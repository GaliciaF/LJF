<?php
namespace App\Http\Controllers\Employer;

use App\Http\Controllers\Controller;
use App\Models\Report;
use Illuminate\Http\Request;

class ReportController extends Controller
{
    // POST /api/employer/reports
    public function store(Request $request)
    {
        $data = $request->validate([
            'reported_id' => 'required|exists:users,id',
            'reason'      => 'required|string',
            'details'     => 'nullable|string',
        ]);

        $report = Report::create([...$data, 'reporter_id' => $request->user()->id]);
// After $report = Report::create(...), add:
$report->load('reporter', 'reported');
\App\Models\User::where('role', 'admin')->get()
    ->each(fn($admin) => $admin->notify(new \App\Notifications\UserReported($report)));
        return response()->json($report, 201);
    }
}