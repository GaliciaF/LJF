<?php
namespace App\Notifications;

use Illuminate\Notifications\Notification;
use App\Models\Application;

class ApplicationAccepted extends Notification
{
    public function __construct(public Application $application) {}

    public function via($notifiable): array { return ['database']; }

    public function toArray($notifiable): array
    {
        return [
            'type'    => 'application_accepted',
            'title'   => '🎉 Application Accepted!',
            'message' => "Your application for \"{$this->application->job->title}\" has been accepted.",
            'job_id'  => $this->application->job_id,
            'icon'    => '✅',
        ];
    }
}