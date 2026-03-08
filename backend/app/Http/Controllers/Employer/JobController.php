<?php
namespace App\Http\Controllers\Employer;

use App\Http\Controllers\Controller;
use App\Models\Job;
use Illuminate\Http\Request;

class JobController extends Controller
{
    // GET /api/employer/jobs?status=open
    public function index(Request $request)
    {
        $jobs = Job::where('employer_id', $request->user()->id)
            ->with('category')
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
            'title'          => 'required|string',
            'category_id'    => 'required|exists:categories,id',
            'description'    => 'required|string',
            'salary'         => 'required|numeric|min:0',
            'rate_type'      => 'required|in:Daily,Hourly,Per Service,Monthly',
            'negotiable'     => 'boolean',
            'barangay'       => 'required|string',
            'purok'          => 'nullable|string',
            'latitude'       => 'nullable|numeric',
            'longitude'      => 'nullable|numeric',
            'start_date'     => 'nullable|date',
            'start_time'     => 'nullable|string',
            'notify_nearby'  => 'boolean',
        ]);

        $job = Job::create([...$data, 'employer_id' => $request->user()->id]);

        return response()->json($job->load('category'), 201);
    }

    // GET /api/employer/jobs/{id}
    public function show(Request $request, Job $job)
    {
        $this->authorize('view', $job);
        return response()->json($job->load(['category', 'applications.worker.workerProfile']));
    }

    // PUT /api/employer/jobs/{id}
    public function update(Request $request, Job $job)
    {
        $this->authorize('update', $job);
        $data = $request->validate([
            'title'       => 'sometimes|string',
            'description' => 'sometimes|string',
            'salary'      => 'sometimes|numeric',
            'rate_type'   => 'sometimes|in:Daily,Hourly,Per Service,Monthly',
            'negotiable'  => 'sometimes|boolean',
            'status'      => 'sometimes|in:open,filled,closed',
        ]);
        $job->update($data);
        return response()->json($job);
    }

    // DELETE /api/employer/jobs/{id}
    public function destroy(Request $request, Job $job)
    {
        $this->authorize('delete', $job);
        $job->delete();
        return response()->json(['message' => 'Job removed.']);
    }
}