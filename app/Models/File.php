<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;


class File extends Model
{
    use HasFactory;

    protected $table = 'file';

    protected $primaryKey = 'id';

    protected $fillable = [
        'nama_file',
        'deskripsi',
        'url',
        'kategori',
        'jenis_file',
        'tgl_upload',
        'uploader',
    ];

    public $timestamps = false; 

    public function kategori()
    {
        return $this->belongsTo(Kategori::class, 'kategori');
    }

    public function uploader()
    {
        return $this->belongsTo(User::class, 'uploader');
    }
}
