<?php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Job;
use App\Models\Application;
use App\Models\Review;
use App\Models\Report;

class AnalyticsController extends Controller
{
    // GET /api/admin/analytics
    public function index()
    {
        $totalUsers    = User::where('role', '!=', 'admin')->count();
        $totalWorkers  = User::where('role', 'worker')->count();
        $totalEmployers= User::where('role', 'employer')->count();
        $totalJobs     = Job::count();
        $filledJobs    = Job::where('status', 'filled')->count();
        $hireRate      = $totalJobs > 0 ? round(($filledJobs / $totalJobs) * 100, 1) : 0;
        $avgRating     = round(Review::avg('rating') ?? 0, 1);
        $reportRate    = $totalUsers > 0 ? round((Report::count() / $totalUsers) * 100, 2) : 0;

        $byBarangay = User::where('role', '!=', 'admin')
            ->selectRaw('barangay, count(*) as count')
            ->join('worker_profiles', 'users.id', '=', 'worker_profiles.user_id')
            ->groupBy('barangay')
            ->orderByDesc('count')
            ->limit(5)
            ->get();

        return response()->json([
            'hire_success_rate' => $hireRate,
            'avg_rating'        => $avgRating,
            'report_rate'       => $reportRate,
            'total_users'       => $totalUsers,
            'total_workers'     => $totalWorkers,
            'total_employers'   => $totalEmployers,
            'total_jobs'        => $totalJobs,
            'top_barangays'     => $byBarangay,
        ]);
    }
}