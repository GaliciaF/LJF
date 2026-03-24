<?php
namespace App\Notifications;

use Illuminate\Notifications\Notification;
use App\Models\Review;

class NewReview extends Notification
{
    public function __construct(public Review $review) {}

    public function via($notifiable): array { return ['database']; }

    public function toArray($notifiable): array
    {
        $stars = str_repeat('⭐', $this->review->rating);
        return [
            'type'    => 'new_review',
            'title'   => 'You received a review',
            'message' => "{$this->review->reviewer->name} rated you {$stars}" . ($this->review->comment ? ": \"{$this->review->comment}\"" : ''),
            'icon'    => '⭐',
        ];
    }
}