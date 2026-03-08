<?php
namespace App\Http\Controllers\Worker;

use App\Http\Controllers\Controller;
use App\Models\Application;
use App\Models\Job;
use Illuminate\Http\Request;

class ApplicationController extends Controller
{
    // GET /api/worker/applications
    public function index(Request $request)
    {
        $applications = Application::where('worker_id', $request->user()->id)
            ->with('job.employer.employerProfile', 'job.category')
            ->latest()
            ->get();

        return response()->json($applications);
    }

    // POST /api/worker/jobs/{job}/apply
    public function store(Request $request, Job $job)
    {
        if ($job->status !== 'open') {
            return response()->json(['message' => 'This job is no longer accepting applications.'], 422);
        }

        $exists = Application::where('job_id', $job->id)
            ->where('worker_id', $request->user()->id)
            ->exists();

        if ($exists) {
            return response()->json(['message' => 'You have already applied to this job.'], 422);
        }

        $data = $request->validate(['cover_message' => 'nullable|string']);

        $application = Application::create([
            'job_id'        => $job->id,
            'worker_id'     => $request->user()->id,
            'cover_message' => $data['cover_message'] ?? null,
        ]);

        return response()->json($application, 201);
    }
}