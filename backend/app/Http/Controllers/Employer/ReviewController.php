<?php
namespace App\Http\Controllers\Employer;

use App\Http\Controllers\Controller;
use App\Models\Review;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    // GET /api/employer/reviews — reviews received by this employer
    public function index(Request $request)
    {
        $reviews = Review::where('reviewee_id', $request->user()->id)
            ->with('reviewer', 'job')
            ->latest()
            ->get();
        return response()->json($reviews);
    }

    // POST /api/employer/reviews
    public function store(Request $request)
    {
        $data = $request->validate([
            'job_id'     => 'required|exists:jobs,id',
            'reviewee_id'=> 'required|exists:users,id',
            'rating'     => 'required|integer|min:1|max:5',
            'comment'    => 'nullable|string',
        ]);

        $review = Review::updateOrCreate(
            ['job_id' => $data['job_id'], 'reviewer_id' => $request->user()->id],
            ['reviewee_id' => $data['reviewee_id'], 'rating' => $data['rating'], 'comment' => $data['comment']]
        );

        return response()->json($review, 201);
    }
}