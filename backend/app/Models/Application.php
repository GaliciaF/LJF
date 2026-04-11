<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class Application extends Model
{
    protected $fillable = [
        'job_id',
        'worker_id',
        'cover_message',
        'resume_path',   // ← ADD THIS
        'status',
    ];

    public function job()    { return $this->belongsTo(Job::class); }
    public function worker() { return $this->belongsTo(User::class, 'worker_id'); }
}