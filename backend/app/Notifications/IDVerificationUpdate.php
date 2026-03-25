<?php
namespace App\Notifications;

use Illuminate\Notifications\Notification;

class IDVerificationUpdate extends Notification
{
    public function __construct(public string $status, public ?string $reason = null) {}

    public function via($notifiable): array { return ['database']; }

    public function toArray($notifiable): array
    {
        $map = [
            'approved'   => ['title' => '✅ ID Verified!',           'message' => 'Your ID has been verified. Your profile now shows a verified badge.', 'icon' => '✅'],
            'rejected'   => ['title' => '❌ ID Verification Failed', 'message' => 'Your ID was rejected' . ($this->reason ? ": {$this->reason}" : '.'), 'icon' => '❌'],
            'needs_back' => ['title' => '🪪 ID Back Required',       'message' => 'Please upload the back of your ID to complete verification.', 'icon' => '🪪'],
        ];
        return array_merge($map[$this->status] ?? ['title' => 'ID Update', 'message' => "Status: {$this->status}", 'icon' => '🪪'], ['type' => 'id_verification']);
    }
}