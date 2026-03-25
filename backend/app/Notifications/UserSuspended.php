<?php
namespace App\Notifications;

use Illuminate\Notifications\Notification;
use App\Models\User;

class UserSuspended extends Notification
{
    public function __construct(public User $suspendedUser, public string $action) {}

    public function via($notifiable): array
    {
        return ['database'];
    }

    public function toArray($notifiable): array
    {
        $labels = [
            'suspended' => '🚫 User Suspended',
            'banned'    => '⛔ User Banned',
            'active'    => '✅ User Reinstated',
        ];
        return [
            'type'    => 'user_status_change',
            'title'   => $labels[$this->action] ?? '👤 User Status Changed',
            'message' => "{$this->suspendedUser->name} has been {$this->action}.",
            'user_id' => $this->suspendedUser->id,
            'action'  => $this->action,
            'icon'    => $this->action === 'active' ? '✅' : ($this->action === 'banned' ? '⛔' : '🚫'),
        ];
    }
}