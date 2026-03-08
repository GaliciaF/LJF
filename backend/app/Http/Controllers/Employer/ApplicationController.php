<?php
namespace App\Http\Controllers\Employer;

use App\Http\Controllers\Controller;
use App\Models\Application;
use App\Models\Job;
use Illuminate\Http\Request;

class ApplicationController extends Controller
{
    // GET /api/employer/jobs/{job}/applicants
    public function index(Job $job)
    {
        return response()->json(
            $job->applications()->with('worker.workerProfile')->latest()->get()
        );
    }

    // PATCH /api/employer/applications/{id}
    // body: { status: 'accepted'|'declined' }
    public function update(Request $request, Application $application)
    {
        $request->validate(['status' => 'required|in:accepted,declined']);

        $application->update(['status' => $request->status]);

        if ($request->status === 'accepted') {
            $application->job()->update([
                'status'          => 'filled',
                'hired_worker_id' => $application->worker_id,
            ]);

            // Decline all other applicants
            Application::where('job_id', $application->job_id)
                ->where('id', '!=', $application->id)
                ->update(['status' => 'declined']);
        }

        return response()->json(['message' => "Applicant {$request->status}."]);
    }
}