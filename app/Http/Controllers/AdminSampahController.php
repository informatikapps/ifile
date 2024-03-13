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
use CloudinaryLabs\CloudinaryLaravel\Facades\Cloudinary;

class AdminSampahController extends Controller
{
    public function index()
    {
        $trashes= Sampah::with(['kategori', 'waster'])->get();
        $kategori = Kategori::all();
        $userRole = 'waster';

        $trashes->transform(function ($trash) use ($userRole) {
            $trash->formattedDate = Carbon::createFromFormat('Y-m-d', $trash->tgl_buang)->format('d M Y');
            $trash->userRole = $userRole;
            return $trash;
        });

        return Inertia::render('Admin/Sampah', ['files' => $trashes, 'kategori'=>$kategori]);
    }

    public function destroy($id)
    {
        $trash = Sampah::findOrFail($id);
        $nama_file = $trash->nama_file;

        if($trash->jenis_file === 'upload') {
            Cloudinary::destroy($nama_file);
        }

        $trash->delete();

        return redirect()->route('sampah.index')->with('success', 'File successfully deleted.');
    }
}