<?php
namespace App\Http\Controllers\Employer;

use App\Http\Controllers\Controller;
use App\Models\Message;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class MessageController extends Controller
{
    // GET /api/employer/messages — list of conversations
    public function conversations(Request $request)
    {
        $userId = $request->user()->id;

        $conversations = Message::where('sender_id', $userId)
            ->orWhere('receiver_id', $userId)
            ->get()
            ->groupBy(fn($m) => $m->sender_id === $userId ? $m->receiver_id : $m->sender_id)
            ->map(fn($messages, $otherId) => [
                'user'    => User::find($otherId)?->only(['id','name']),
                'last'    => $messages->sortByDesc('created_at')->first(),
                'unread'  => $messages->where('receiver_id', $userId)->where('is_read', false)->count(),
            ])
            ->values();

        return response()->json($conversations);
    }

    // GET /api/employer/messages/{userId} — thread with one user
    public function thread(Request $request, $userId)
    {
        $myId = $request->user()->id;

        $messages = Message::where(fn($q) =>
            $q->where('sender_id', $myId)->where('receiver_id', $userId)
        )->orWhere(fn($q) =>
            $q->where('sender_id', $userId)->where('receiver_id', $myId)
        )->orderBy('created_at')->get();

        // Mark as read
        Message::where('sender_id', $userId)->where('receiver_id', $myId)
            ->update(['is_read' => true]);

        return response()->json($messages);
    }

    // POST /api/employer/messages
    public function send(Request $request)
    {
        $data = $request->validate([
            'receiver_id' => 'required|exists:users,id',
            'body'        => 'required|string',
        ]);

        $message = Message::create([
            'sender_id'   => $request->user()->id,
            'receiver_id' => $data['receiver_id'],
            'body'        => $data['body'],
        ]);

        return response()->json($message, 201);
    }
}