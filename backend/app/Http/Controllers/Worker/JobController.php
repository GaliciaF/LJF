<?php
namespace App\Http\Controllers\Worker;

use App\Http\Controllers\Controller;
use App\Models\Job;
use Illuminate\Http\Request;

class JobController extends Controller
{
    // GET /api/worker/jobs — only available jobs show up for workers
    public function index(Request $request)
    {
        $jobs = Job::where('status', 'available')
            ->with(['employer.employerProfile', 'category'])
            ->withCount('applications')
            ->when($request->barangay,    fn($q) => $q->where('barangay', $request->barangay))
            ->when($request->category_id, fn($q) => $q->where('category_id', $request->category_id))
            ->when($request->min_rate,    fn($q) => $q->where('salary', '>=', $request->min_rate))
            ->when($request->max_rate,    fn($q) => $q->where('salary', '<=', $request->max_rate))
            ->when($request->search,      fn($q) => $q->where('title', 'like', "%{$request->search}%"))
            ->latest()
            ->paginate(20);

        return response()->json($jobs);
    }

    // GET /api/worker/jobs/{id}
    public function show(Job $job)
    {
        return response()->json($job->load(['employer.employerProfile', 'category']));
    }
}