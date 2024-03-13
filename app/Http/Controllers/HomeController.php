<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Kategori;
use App\Models\Mahasiswa;
use App\Imports\MahasiswaImport;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Redirect;
use Maatwebsite\Excel\Facades\Excel;
use Illuminate\Support\Facades\Validator;

class HomeController extends Controller
{
    public function index()
    {
        $kategori = Kategori::all();
        $mahasiswa = Mahasiswa::all();

        return Inertia::render('Home', ['kategori'=>$kategori, 'mahasiswaData'=>$mahasiswa]);
    }

    public function indexAdmin()
    {
        $kategori = Kategori::all();
        $mahasiswa = Mahasiswa::all();

        return Inertia::render('Admin/Home', ['kategori'=>$kategori, 'mahasiswaData'=>$mahasiswa]);
    }

    public function show($angkatan) {
        $mahasiswa = Mahasiswa::where('angkatan', $angkatan)->get();
        $kategori = Kategori::all();
        return Inertia::render('ShowDetail', ['kategori'=>$kategori,'mahasiswa'=>$mahasiswa, 'angkatan'=>$angkatan]);
    }

    public function updateStatus(Request $request, $nim) {
    
    $mahasiswa = Mahasiswa::find($nim);
    $status = $request->input('status');


    $mahasiswa->status = $status;
    $mahasiswa->save();

    return redirect()->back();
}

    public function showFormAdd() {
        $kategori = Kategori::all();
        return Inertia::render('AddMahasiswa', ['kategori'=>$kategori]);
    }

    public function store(Request $request) {
        $mahasiswa = new Mahasiswa;
        $mahasiswa->nim = $request->input('nim');
        $mahasiswa->nama = $request->input('nama');
        $mahasiswa->jenis_kelamin = $request->input('jenis_kelamin');
        $mahasiswa->agama = $request->input('agama');
        $mahasiswa->jalur_masuk = $request->input('jalur_masuk');
        $mahasiswa->angkatan = $request->input('angkatan');
        $mahasiswa->status = $request->input('status');
        $mahasiswa->save();

        return redirect()->route('home');

    }

    public function batchStore(Request $request)
{
    Log::info('Request: ' . json_encode($request->json('data')));
    try {
        foreach ($request->json('data') as $item) {
            Mahasiswa::create([
                'nama' => $item['nama'],
                'nim' => $item['nim'],
                'angkatan' => $item['angkatan'],
                'jenis_kelamin' => $item['jenis_kelamin'],
                'agama' => $item['agama'],
                'jalur_masuk' => $item['jalur_masuk'],
                'status' => $item['status'],
            ]);
        }
        return redirect()->back();
    } catch (\Exception $e) {
        Log::error('Error in batchStore: ' . $e->getMessage());
        return response()->json([
            'message' => 'Error in batchStore: ' . $e->getMessage()
        ], 500);
    }
}
}