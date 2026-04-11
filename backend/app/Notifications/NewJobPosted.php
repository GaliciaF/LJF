<?php

namespace App\Notifications;

use Illuminate\Notifications\Notification;
use App\Models\Job;

class NewJobPosted extends Notification
{
    public function __construct(public Job $job) {}

    public function via($notifiable): array
    {
        return ['database'];
    }

    public function toArray($notifiable): array
    {
        return [
            'type'    => 'new_job',
            'title'   => '📢 New Job Available',
            'message' => "A new job \"{$this->job->title}\" has been posted in {$this->job->barangay}.",
            'job_id'  => $this->job->id,
            'icon'    => '📢',
        ];
    }
}