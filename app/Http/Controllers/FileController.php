<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;
use App\Models\File;
use App\Models\Kategori;

class FileController extends Controller
{
    public function index()
    {
        $files = File::with(['kategori', 'uploader'])->get();
        $kategori = Kategori::all();
        $userRole = 'uploader';

        $files->transform(function ($file) use ($userRole) {
            $file->formattedDate = Carbon::createFromFormat('Y-m-d', $file->tgl_upload)->format('d M Y');
            $file->userRole = $userRole;
            return $file;
        });

        return Inertia::render('Admin/File', ['files' => $files, 'kategori' => $kategori]);
    }
}