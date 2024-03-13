<?php

namespace App\Http\Controllers;

use App\Models\Kategori;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Models\File;
use CloudinaryLabs\CloudinaryLaravel\Facades\Cloudinary;
use Illuminate\Contracts\Filesystem\Cloud;

class EditFileController extends Controller
{
    public function index(Request $request)
    {
        $file = File::findOrFail($request->id);
        $kategori = Kategori::all();
        $namaFile = $file->nama_file;

        // $file->file = cloudinary()->getFile('iFile/'.$namaFile);

        return Inertia::render('EditFile', [
            'kategori' => $kategori,
            'file' => $file,
        ]);
    }

    public function update(Request $request, $id)
    {
        $file = File::findOrFail($id);
        
        $idKategori = $request->input('kategori');
        $nama_file = $request->input('nama_file');
    
        $fileUrl = null;
        $kategori = Kategori::find($idKategori);
        $namaKategori = $kategori->kategori;

        if ($request->input('jenisFile') === 'upload') {

            $Updatedfile = $request->file('file');

            $cloudinaryUpload = Cloudinary::upload($Updatedfile->getRealPath(), [
                'folder' => 'iFile/'.$namaKategori, 
                'public_id' => $nama_file,
            ]);

            $fileUrl = cloudinary()->getPath();
        } elseif ($request->input('jenisFile') === 'link') {
            $fileUrl = $request->input('link');
        }

        $file->update([
            'nama_file' => $request->input('nama_file'),
            'deskripsi' => $request->input('deskripsi'),
            'url' => $fileUrl,
            'kategori' => $request->input('kategori'),
            'tgl_upload' => now(),
            'uploader' => auth()->user()->id,
        ]);

        if ($request->user()->isAdmin()) {
            return redirect()->route('file.index')->with('success', 'File berhasil diperbarui.');
        } else {
            return redirect()->route('eksplor.index')->with('success', 'File berhasil diperbarui.');
        }
        
    }
}