<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    protected $fillable = ['name','emoji','is_active'];

    protected $casts = ['is_active' => 'boolean'];

    public function jobs() { return $this->hasMany(Job::class); }
}