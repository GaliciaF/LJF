<?php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Job;
use Illuminate\Http\Request;

class JobController extends Controller
{
    // GET /api/admin/jobs?status=open&search=plumber
    public function index(Request $request)
    {
        $jobs = Job::with(['employer', 'category'])
            ->withCount('applications')
            ->when($request->status, fn($q) => $q->where('status', $request->status))
            ->when($request->search, fn($q) => $q->where('title', 'like', "%{$request->search}%"))
            ->latest()
            ->paginate(20);

        return response()->json($jobs);
    }

    // PATCH /api/admin/jobs/{id}/status
    public function updateStatus(Request $request, Job $job)
    {
        $request->validate(['status' => 'required|in:open,filled,closed,flagged']);
        $job->update(['status' => $request->status]);
        return response()->json(['message' => 'Job updated.']);
    }

    // DELETE /api/admin/jobs/{id}
    public function destroy(Job $job)
    {
        $job->delete();
        return response()->json(['message' => 'Job removed.']);
    }
}