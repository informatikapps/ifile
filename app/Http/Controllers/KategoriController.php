<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Kategori;
use App\Models\File;
use Carbon\Carbon;
use Illuminate\Support\Facades\Redirect;

class KategoriController extends Controller
{
    public function index()
    {
        $kategori = Kategori::all();

        return Inertia::render('Admin/Kategori', ['kategori'=>$kategori]);
    }

    public function showFormAdd()
    {
        $kategori = Kategori::all();
        return Inertia::render('Admin/AddKategori', ['kategori'=>$kategori]);
    }

    public function store(Request $request) 
    {
        $newKategori = new Kategori([
            'kategori' => $request->input('kategori'),
            'keterangan' => $request->input('keterangan'),
        ]);

        $newKategori->save();   

        return redirect()->route('kategori.index');
    }

    public function showFormEdit(Request $request)
    {
        $allKategori = Kategori::all(); 
        $kategori = Kategori::findOrFail($request->id);

        return Inertia::render('Admin/EditKategori', ['kategori'=>$kategori, 'allKategori'=>$allKategori]);
    }

    public function update(Request $request, $id)
    {
        $kategori = Kategori::findOrFail($id);

        $kategori->update([
            'kategori' => $request->input('kategori'),
            'keterangan' => $request->input('keterangan'),
        ]);

        return redirect()->route('kategori.index');
    }

    public function destroy(Request $request, $id)
    {
        $kategori = Kategori::findOrFail($id);

        $kategori->delete();

        return redirect()->route('kategori.index');
    }

    public function show(Request $request, $kategori)
{
    $k = Kategori::where('kategori', $kategori)->first();
    $kategori = Kategori::all();

    if (!$k) {
        return Redirect::route('home');
    }

    $files = File::where('kategori', $k->id)->with(['kategori', 'uploader'])->orderBy('tgl_upload', 'desc')->get();
    $userRole = 'uploader';

    $files->transform(function ($file) use($userRole) {
        $file->formattedDate = Carbon::createFromFormat('Y-m-d', $file->tgl_upload)->format('d M Y');
        $file->userRole = $userRole;
        return $file;
    });

    return Inertia::render('ShowKategori', ['files' => $files, 'kategori'=>$kategori, 'selectedKategori'=>$k->kategori]);
}

}
