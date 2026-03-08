<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class WorkerProfile extends Model
{
    protected $fillable = [
        'user_id','full_name','phone','email','barangay','purok',
        'latitude','longitude','photo_path','bio','skills',
        'years_experience','travel_distance','expected_rate','rate_type',
        'negotiable','is_available','work_days','work_start','work_end',
        'blocked_dates','id_verification_status',
        'show_profile','allow_location','receive_alerts','two_factor',
    ];

    protected $casts = [
        'skills'         => 'array',
        'work_days'      => 'array',
        'blocked_dates'  => 'array',
        'negotiable'     => 'boolean',
        'is_available'   => 'boolean',
        'show_profile'   => 'boolean',
        'allow_location' => 'boolean',
        'receive_alerts' => 'boolean',
        'two_factor'     => 'boolean',
    ];

    public function user() { return $this->belongsTo(User::class); }
}