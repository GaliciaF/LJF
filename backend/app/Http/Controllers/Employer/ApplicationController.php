<?php
namespace App\Http\Controllers\Employer;

use App\Http\Controllers\Controller;
use App\Models\Application;
use App\Models\Job;
use App\Notifications\ApplicationAccepted;
use App\Notifications\ApplicationDeclined;
use Illuminate\Http\Request;

class ApplicationController extends Controller
{
    public function index(Job $job)
    {
        $applications = $job->applications()
            ->with('worker.workerProfile')
            ->latest()
            ->get()
            ->map(function ($app) {
                if (!$app->resume_path) {
                    $app->resume_url = null;
                } elseif (str_starts_with($app->resume_path, 'http')) {
                    // Old bad records: stored full URL — extract filename and rebuild correctly
                    $filename = basename(parse_url($app->resume_path, PHP_URL_PATH));
                    $app->resume_url = url('storage/resumes/' . $filename);
                } else {
                    // New clean records: relative path like "resumes/filename.docx"
                    $app->resume_url = url('storage/' . $app->resume_path);
                }
                return $app;
            });

        return response()->json($applications);
    }

    public function update(Request $request, Application $application)
    {
        $request->validate(['status' => 'required|in:accepted,declined']);

        $application->load('job', 'worker');
        $application->update(['status' => $request->status]);

        if ($request->status === 'accepted') {
            $application->job()->update([
                'status'          => 'not_available',
                'hired_worker_id' => $application->worker_id,
            ]);

            Application::where('job_id', $application->job_id)
                ->where('id', '!=', $application->id)
                ->get()
                ->each(function ($app) {
                    $app->update(['status' => 'declined']);
                    $app->load('job');
                    $app->worker->notify(new ApplicationDeclined($app));
                });

            $application->worker->notify(new ApplicationAccepted($application));

        } else {
            $application->worker->notify(new ApplicationDeclined($application));
        }

        return response()->json(['message' => "Applicant {$request->status}."]);
    }
}