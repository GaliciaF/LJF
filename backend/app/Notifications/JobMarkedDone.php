<?php
namespace App\Notifications;

use Illuminate\Notifications\Notification;
use App\Models\Job;

class JobMarkedDone extends Notification
{
    public function __construct(public Job $job) {}

    public function via($notifiable): array { return ['database']; }

    public function toArray($notifiable): array
    {
        return [
            'type'    => 'job_done',
            'title'   => 'Job Completed',
            'message' => "The job \"{$this->job->title}\" has been marked as done by the employer.",
            'job_id'  => $this->job->id,
            'icon'    => '🏁',
        ];
    }
}