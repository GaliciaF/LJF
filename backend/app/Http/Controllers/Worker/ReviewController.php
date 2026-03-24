<?php
namespace App\Http\Controllers\Worker;

use App\Http\Controllers\Controller;
use App\Models\Review;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    public function index(Request $request)
    {
        return response()->json(
            Review::where('reviewee_id', $request->user()->id)
                ->with('reviewer', 'job')->latest()->get()
        );
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'job_id'      => 'required|exists:jobs,id',
            'reviewee_id' => 'required|exists:users,id',
            'rating'      => 'required|integer|min:1|max:5',
            'comment'     => 'nullable|string',
        ]);

        $review = Review::updateOrCreate(
            ['job_id' => $data['job_id'], 'reviewer_id' => $request->user()->id],
            ['reviewee_id' => $data['reviewee_id'], 'rating' => $data['rating'], 'comment' => $data['comment']]
        );
$review->load('reviewer');
\App\Models\User::find($data['reviewee_id'])
    ->notify(new \App\Notifications\NewReview($review));
        return response()->json($review, 201);
    }
}