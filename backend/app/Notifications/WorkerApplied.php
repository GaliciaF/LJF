<?php
namespace App\Notifications;

use Illuminate\Notifications\Notification;
use App\Models\Application;

class WorkerApplied extends Notification
{
    public function __construct(public Application $application) {}

    public function via($notifiable): array { return ['database']; }

    public function toArray($notifiable): array
    {
        return [
            'type'      => 'new_application',
            'title'     => '👷 New Application',
            'message'   => "{$this->application->worker->name} applied to your job: \"{$this->application->job->title}\"",
            'job_id'    => $this->application->job_id,
            'worker_id' => $this->application->worker_id,
            'icon'      => '👷',
        ];
    }
}