<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Job;

class AdminDashboardController extends Controller
{
    public function stats()
    {
        return response()->json([
            'total_users' => User::count(),
            'total_workers' => User::where('role','worker')->count(),
            'total_employers' => User::where('role','employer')->count(),
            'total_jobs' => Job::count(),
            'active_jobs' => Job::where('status','open')->count(),
            'completed_jobs' => Job::where('status','completed')->count()
        ]);
    }
}