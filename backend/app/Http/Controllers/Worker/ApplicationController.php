<?php
namespace App\Http\Controllers\Worker;

use App\Http\Controllers\Controller;
use App\Models\Application;
use App\Models\Job;
use App\Notifications\WorkerApplied;
use Illuminate\Http\Request;

class ApplicationController extends Controller
{
    public function index(Request $request)
    {
        $applications = Application::where('worker_id', $request->user()->id)
            ->with('job.employer.employerProfile', 'job.category')
            ->latest()
            ->get()
            ->map(fn($app) => $this->appendResumeUrl($app));

        return response()->json($applications);
    }

    public function store(Request $request, Job $job)
    {
        if ($job->status !== 'available') {
            return response()->json(['message' => 'This job is no longer accepting applications.'], 422);
        }

        $exists = Application::where('job_id', $job->id)
            ->where('worker_id', $request->user()->id)->exists();
        if ($exists) {
            return response()->json(['message' => 'You have already applied to this job.'], 422);
        }

        $data = $request->validate([
            'cover_message' => 'nullable|string',
            'resume'        => 'nullable|file|mimes:pdf,doc,docx|max:5120',
        ]);

        $resumePath = null;
        if ($request->hasFile('resume')) {
            // Store only the relative path e.g. "resumes/filename.docx"
            $resumePath = $request->file('resume')->store('resumes', 'public');
        }

        $application = Application::create([
            'job_id'        => $job->id,
            'worker_id'     => $request->user()->id,
            'cover_message' => $data['cover_message'] ?? null,
            'resume_path'   => $resumePath,
        ]);

        $application->load('worker', 'job');

        $job->employer->notify(new WorkerApplied($application));

        return response()->json($this->appendResumeUrl($application), 201);
    }

    // Appends a correctly built resume_url to any application instance
    private function appendResumeUrl(Application $app): Application
    {
        $app->resume_url = $app->resume_path
            ? url('storage/' . $app->resume_path)
            : null;
        return $app;
    }
}