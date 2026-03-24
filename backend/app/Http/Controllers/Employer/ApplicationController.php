<?php
namespace App\Http\Controllers\Employer;

use App\Http\Controllers\Controller;
use App\Models\Application;
use App\Models\Job;
use App\Models\User;
use App\Notifications\ApplicationAccepted;
use App\Notifications\ApplicationDeclined;
use App\Notifications\WorkerApplied;
use Illuminate\Http\Request;

class ApplicationController extends Controller
{
    public function index(Job $job)
    {
        return response()->json(
            $job->applications()->with('worker.workerProfile')->latest()->get()
        );
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
                ->get()->each(function ($app) {
                    $app->update(['status' => 'declined']);
                    $app->worker->notify(new ApplicationDeclined($app));
                });
            $application->worker->notify(new ApplicationAccepted($application));
        } else {
            $application->worker->notify(new ApplicationDeclined($application));
        }

        return response()->json(['message' => "Applicant {$request->status}."]);
    }
}