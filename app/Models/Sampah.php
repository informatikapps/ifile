<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;


class Sampah extends Model
{
    use HasFactory;

    protected $table = 'sampah';

    protected $primaryKey = 'id';

    protected $fillable = [
        'nama_file',
        'deskripsi',
        'url',
        'kategori',
        'jenis_file',
        'tgl_buang',
        'waster',
    ];

    public $timestamps = false; 

    public function kategori()
    {
        return $this->belongsTo(Kategori::class, 'kategori');
    }

    public function waster()
    {
        return $this->belongsTo(User::class, 'waster');
    }
}
