<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Sampah;
use App\Models\Kategori;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;
use App\Models\File;

class MySampahController extends Controller
{
    public function index()
    {
        $trashes= Sampah::with(['kategori', 'waster'])->orderBy('tgl_buang', 'desc')->get();
        $kategori = Kategori::all();
        $userRole = 'waster';

        $trashes->transform(function ($trash) use ($userRole) {
            $trash->formattedDate = Carbon::createFromFormat('Y-m-d', $trash->tgl_buang)->format('d M Y');
            $trash->userRole = $userRole;
            return $trash;
        });

        return Inertia::render('Sampah', ['files' => $trashes, 'kategori'=>$kategori]);
    }

    public function restore(Request $request,$id)
    {
        $trash = Sampah::find($id);

        File::create([
            'nama_file' => $trash->nama_file,
            'deskripsi' => $trash->deskripsi,
            'url' => $trash->url,
            'kategori' => $trash->kategori,
            'jenis_file' => $trash->jenis_file,
            'tgl_upload' => now(),
            'uploader' => auth()->user()->id,
        ]);

        $trash->delete();

        if ($request->user()->isAdmin()) {
            return redirect()->route('sampah.index')->with('success', 'File berhasil diperbarui.');
        } else {
            return redirect()->route('sampah-saya.index')->with('success', 'File berhasil diperbarui.');
        }
    }
}