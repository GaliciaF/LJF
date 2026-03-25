<?php
namespace App\Http\Controllers\Worker;

use App\Http\Controllers\Controller;
use App\Models\Message;
use App\Models\User;
use Illuminate\Http\Request;

class MessageController extends Controller
{
    public function conversations(Request $request)
    {
        $userId = $request->user()->id;

        $conversations = Message::where('sender_id', $userId)
            ->orWhere('receiver_id', $userId)
            ->get()
            ->groupBy(fn($m) => $m->sender_id === $userId ? $m->receiver_id : $m->sender_id)
            ->map(function($messages, $otherId) use ($userId) {
                $other = User::with('workerProfile', 'employerProfile')->find($otherId);
                $photo = $other?->workerProfile?->photo_path
                      ?? $other?->employerProfile?->photo_path
                      ?? null;
                return [
                    'user'   => ['id' => $other?->id, 'name' => $other?->name, 'photo' => $photo],
                    'last'   => $messages->sortByDesc('created_at')->first(),
                    'unread' => $messages->where('receiver_id', $userId)->where('is_read', false)->count(),
                ];
            })->values();

        return response()->json($conversations);
    }

    public function thread(Request $request, $userId)
    {
        $myId = $request->user()->id;

        $messages = Message::where(fn($q) =>
            $q->where('sender_id', $myId)->where('receiver_id', $userId)
        )->orWhere(fn($q) =>
            $q->where('sender_id', $userId)->where('receiver_id', $myId)
        )->orderBy('created_at')->get();

        Message::where('sender_id', $userId)->where('receiver_id', $myId)
            ->update(['is_read' => true]);

        return response()->json($messages);
    }

    public function send(Request $request)
    {
        $data = $request->validate([
            'receiver_id' => 'required|exists:users,id',
            'body'        => 'required|string',
        ]);
        $message = \App\Models\Message::create([
            'sender_id'   => $request->user()->id,
            'receiver_id' => $data['receiver_id'],
            'body'        => $data['body'],
        ]);
        $message->load('sender');
        \App\Models\User::find($data['receiver_id'])
            ->notify(new \App\Notifications\NewMessage($message));
        return response()->json($message, 201);
    }
}