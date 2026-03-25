<?php
namespace App\Http\Controllers\Employer;

use App\Http\Controllers\Controller;
use App\Models\Report;
use App\Models\User;
use App\Notifications\UserReported;
use Illuminate\Http\Request;

class ReportController extends Controller
{
    public function store(Request $request)
    {
        $data = $request->validate([
            'reported_id' => 'required|exists:users,id',
            'reason'      => 'required|string',
            'details'     => 'nullable|string',
        ]);

        $report = Report::create([
            ...$data,
            'reporter_id' => $request->user()->id,
            'status'      => 'pending',
        ]);

        $report->load('reporter', 'reported');

        // Notify ALL admins
        User::where('role', 'admin')->get()
            ->each(fn($admin) => $admin->notify(new UserReported($report)));

        return response()->json($report, 201);
    }
}