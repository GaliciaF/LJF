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

        return response()->json($report, 201);
    }
}