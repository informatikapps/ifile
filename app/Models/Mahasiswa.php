<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Mahasiswa extends Model
{
    use HasFactory;

    protected $table = 'mahasiswa';

    protected $primaryKey = 'nim'; 

    protected $fillable = [
        'nim',
        'angkatan',
        'nama',
        'jenis_kelamin',
        'agama',
        'jalur_masuk',
        'status'
    ];

    public $timestamps = false; 
}