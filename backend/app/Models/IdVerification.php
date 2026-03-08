<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class IdVerification extends Model
{
    protected $fillable = [
        'worker_id','id_type','front_path','back_path',
        'status','rejection_reason',
    ];

    public function worker() { return $this->belongsTo(User::class, 'worker_id'); }
}