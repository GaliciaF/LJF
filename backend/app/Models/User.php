<?php
namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use HasApiTokens, Notifiable;

    protected $fillable = [
        'name', 'email', 'phone', 'password',
        'role', 'status', 'suspension_reason', 'suspended_until',
    ];

    protected $hidden = ['password', 'remember_token'];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'suspended_until'   => 'datetime',
        'password'          => 'hashed',
    ];

    // Relationships
    public function employerProfile() { return $this->hasOne(EmployerProfile::class); }
    public function workerProfile()   { return $this->hasOne(WorkerProfile::class); }
    public function jobs()            { return $this->hasMany(Job::class, 'employer_id'); }
    public function applications()    { return $this->hasMany(Application::class, 'worker_id'); }
    public function sentMessages()    { return $this->hasMany(Message::class, 'sender_id'); }
    public function receivedMessages(){ return $this->hasMany(Message::class, 'receiver_id'); }
    public function reviewsGiven()    { return $this->hasMany(Review::class, 'reviewer_id'); }
    public function reviewsReceived() { return $this->hasMany(Review::class, 'reviewee_id'); }
    public function reports()         { return $this->hasMany(Report::class, 'reporter_id'); }
    public function idVerification()  { return $this->hasOne(IdVerification::class, 'worker_id'); }

    // Computed
    public function getAverageRatingAttribute()
    {
        return round($this->reviewsReceived()->avg('rating') ?? 0, 1);
    }
}