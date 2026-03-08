<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class EmployerProfile extends Model
{
    protected $fillable = [
        'user_id','household_name','phone','alt_phone','email',
        'barangay','purok','latitude','longitude','photo_path',
        'show_profile','allow_location','receive_alerts','two_factor',
    ];

    protected $casts = [
        'show_profile'   => 'boolean',
        'allow_location' => 'boolean',
        'receive_alerts' => 'boolean',
        'two_factor'     => 'boolean',
    ];

    public function user() { return $this->belongsTo(User::class); }
}