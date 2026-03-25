<?php

namespace App\Http\Controllers\Employer;

use App\Http\Controllers\Controller;
use App\Models\Job;
use Illuminate\Http\Request;

class JobController extends Controller
{
    // GET /api/employer/jobs
    public function index(Request $request)
    {
        $jobs = Job::where('employer_id', $request->user()->id)
            ->with(['category', 'hiredWorker.workerProfile'])
            ->withCount('applications')
            ->when($request->status, fn($q) => $q->where('status', $request->status))
            ->latest()
            ->get();

        return response()->json($jobs);
    }

    // POST /api/employer/jobs
    public function store(Request $request)
    {
        $data = $request->validate([
            'title'         => 'required|string',
            'category_id'   => 'nullable|exists:categories,id',
            'category_name' => 'nullable|string',
            'description'   => 'required|string',
            'salary'        => 'required|numeric|min:0',
            'rate_type'     => 'required|in:Daily,Hourly,Per Service,Monthly',
            'negotiable'    => 'boolean',
            'barangay'      => 'required|string',
            'purok'         => 'nullable|string',
            'latitude'      => 'nullable|numeric',
            'longitude'     => 'nullable|numeric',
            'start_date'    => 'nullable|date',
            'start_time'    => 'nullable|string',
            'notify_nearby' => 'boolean',
        ]);

        if (empty($data['category_id']) && empty($data['category_name'])) {
            return response()->json(['message' => 'Category is required.'], 422);
        }

        $job = Job::create([
            ...$data,
            'employer_id' => $request->user()->id,
            'status' => 'available'
        ]);

        return response()->json($job->load('category'), 201);
    }

    // GET /api/employer/jobs/{id}
    public function show(Request $request, Job $job)
    {
        $this->authorize('view', $job);

        return response()->json(
            $job->load(['category', 'applications.worker.workerProfile'])
        );
    }

    // PUT /api/employer/jobs/{id}
    public function update(Request $request, Job $job)
    {
        // 🔥 IMPORTANT: allow update if owner
        if ($job->employer_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $data = $request->validate([
            'title'         => 'sometimes|string',
            'description'   => 'sometimes|string',
            'salary'        => 'sometimes|numeric',
            'rate_type'     => 'sometimes|in:Daily,Hourly,Per Service,Monthly',
            'negotiable'    => 'sometimes|boolean',
            'status'        => 'sometimes|in:available,not_available,done',
            'category_id'   => 'sometimes|nullable|exists:categories,id',
            'category_name' => 'sometimes|string',
            'barangay'      => 'sometimes|string',
            'purok'         => 'sometimes|nullable|string',
            'start_date'    => 'sometimes|nullable|date',
            'start_time'    => 'sometimes|nullable|string',
        ]);

        // ✅ Update job
        $job->update($data);

        // ✅ Safe notification (NO CRASH)
        if (
            isset($data['status']) &&
            $data['status'] === 'done' &&
            $job->hiredWorker
        ) {
            $job->hiredWorker->notify(
                new \App\Notifications\JobMarkedDone($job)
            );
        }

        return response()->json($job->load('category', 'hiredWorker'));
    }

    // DELETE /api/employer/jobs/{id}
    public function destroy(Request $request, Job $job)
    {
        if ($job->employer_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $job->delete();

        return response()->json(['message' => 'Job removed.']);
    }
}