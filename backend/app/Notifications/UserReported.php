<?php
namespace App\Notifications;

use Illuminate\Notifications\Notification;
use App\Models\Report;

class UserReported extends Notification
{
    public function __construct(public Report $report) {}

    public function via($notifiable): array { return ['database']; }

    public function toArray($notifiable): array
    {
        return [
            'type'    => 'user_reported',
            'title'   => 'New Report Filed',
            'message' => "{$this->report->reporter->name} reported {$this->report->reported->name}: {$this->report->reason}",
            'icon'    => '🚨',
        ];
    }
}