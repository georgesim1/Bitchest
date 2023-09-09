<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Cryptocurrency extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name',
        'symbol',
        'price',
        'imageFilename',
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        // Any attributes you want to hide when the model is converted to an array or JSON
    ];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        // 'some_attribute' => 'datetime',
    ];
    
    // Define any relationships, getters, setters, or additional methods below...

    public function user()
{
    return $this->belongsToMany(User::class);
}
    
}
