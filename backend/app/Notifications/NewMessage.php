<?php
namespace App\Notifications;

use Illuminate\Notifications\Notification;
use App\Models\Message;

class NewMessage extends Notification
{
    public function __construct(public Message $message) {}

    public function via($notifiable): array { return ['database']; }

    public function toArray($notifiable): array
    {
        return [
            'type'      => 'new_message',
            'title'     => 'New Message',
            'message'   => "{$this->message->sender->name}: {$this->message->body}",
            'sender_id' => $this->message->sender_id,
            'icon'      => '💬',
        ];
    }
}