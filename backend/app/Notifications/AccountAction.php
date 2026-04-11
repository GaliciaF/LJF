<?php
namespace App\Notifications;

use Illuminate\Notifications\Notification;

class AccountAction extends Notification
{
    public function __construct(
        public string  $action,          // 'warned' | 'suspended' | 'banned'
        public ?string $reason = null,
        public ?string $suspendedUntil = null,
    ) {}

    public function via($notifiable): array
    {
        return ['database'];
    }

    public function toArray($notifiable): array
    {
        $map = [
            'warned' => [
                'icon'    => '⚠️',
                'title'   => 'You have received a warning',
                'subtype' => 'warning',
            ],
            'suspended' => [
                'icon'    => '🚫',
                'title'   => 'Your account has been suspended',
                'subtype' => 'suspended',
            ],
            'banned' => [
                'icon'    => '⛔',
                'title'   => 'Your account has been permanently banned',
                'subtype' => 'banned',
            ],
        ];

        $info = $map[$this->action] ?? [
            'icon'    => '👤',
            'title'   => 'Account action taken',
            'subtype' => $this->action,
        ];

        $message = $this->reason ?? 'Violation of community guidelines.';

        if ($this->action === 'suspended' && $this->suspendedUntil) {
            $until   = \Illuminate\Support\Carbon::parse($this->suspendedUntil)
                            ->toFormattedDateString();
            $message .= " Your account will be reinstated on {$until}.";
        }

        return [
            'type'    => 'account_action',
            'subtype' => $info['subtype'],
            'title'   => $info['title'],
            'message' => $message,
            'icon'    => $info['icon'],
        ];
    }
}