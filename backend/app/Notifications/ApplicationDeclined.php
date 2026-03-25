<?php
namespace App\Notifications;

use Illuminate\Notifications\Notification;
use App\Models\Application;

class ApplicationDeclined extends Notification
{
    public function __construct(public Application $application) {}

    public function via($notifiable): array { return ['database']; }

    public function toArray($notifiable): array
    {
        return [
            'type'    => 'application_declined',
            'title'   => '📋 Application Update',
            'message' => "Your application for \"{$this->application->job->title}\" was not selected.",
            'job_id'  => $this->application->job_id,
            'icon'    => '📋',
        ];
    }
}