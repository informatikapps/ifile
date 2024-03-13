<?php

namespace App\Http\Controllers;

use App\Models\Kategori;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Models\File;
use CloudinaryLabs\CloudinaryLaravel\Facades\Cloudinary;

class AddFileController extends Controller
{
    public function index()
    {
        $kategori = Kategori::all();

        return Inertia::render('AddFile', [
            'kategori' => $kategori,
        ]);
    }

    public function store(Request $request)
{

    $namaFile = $request->input('namaFile');
    $deskripsi = $request->input('deskripsi');
    $idKategori = $request->input('kategori');
    
    $fileUrl = null;
    $kategori = Kategori::find($idKategori);
    $namaKategori = $kategori->kategori;

    if ($request->input('jenisFile') === 'upload') {

        $file = $request->file('file');

        $cloudinaryUpload = Cloudinary::upload($file->getRealPath(), [
            'folder' => 'iFile/'.$namaKategori, 
            'public_id' => $namaFile,
        ]);

        $fileUrl = cloudinary()->getPath();
    } elseif ($request->input('jenisFile') === 'link') {
        $fileUrl = $request->input('link');
    }

    $newFile = new File([
        'nama_file' => $namaFile,
        'deskripsi' => $deskripsi,
        'url' => $fileUrl,
        'kategori' => $request->input('kategori'), 
        'jenis_file' => $request->input('jenisFile'),
        'tgl_upload' => now(), 
        'uploader' => auth()->user()->id,
    ]);

    $newFile->save();

    if ($request->user()->isAdmin()) {
        return redirect()->route('file.index')->with('success', 'File berhasil diperbarui.');
    } else {
        return redirect()->route('eksplor.index')->with('success', 'File berhasil diperbarui.');
    }
}
}