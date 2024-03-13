<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Auth\Events\Registered;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use App\Models\Kategori;

class UserController extends Controller
{
    public function index()
    {
        $kategori = Kategori::all();
        $users = User::all();

        $filteredUsers = $users->reject(function ($user) {
            return $user->username === 'admin' || $user->id === Auth::id();
        });

        return Inertia::render('Admin/User', ['users' => $filteredUsers, 'kategori'=> $kategori]);

    }

    public function showFormAdd()
    {
        $kategori = Kategori::all();
        return Inertia::render('Admin/AddUser', ['kategori' => $kategori]);
    }

    public function store(Request $request) 
    {
        $user = User::create([
            'username' => $request->username,
            'password' => Hash::make($request->password),
            'role' => $request->role,
        ]);

        event(new Registered($user));

        return redirect()->route('pengguna.index');
    }

    public function showFormEdit(Request $request)
    {
        $user = User::find($request->id);
        $kategori = Kategori::all();

        return Inertia::render('Admin/EditUser', ['user' => $user, 'kategori' => $kategori]);
    }

    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);

        $user->update([
            'username' => $request->username,
            'password' => Hash::make($request->password),
            'role' => $request->role,
        ]);

        return redirect()->route('pengguna.index');

    }

    public function destroy(Request $request, $id)
    {
        $user = User::findOrFail($id);

        $user->delete();

        return redirect()->route('pengguna.index');
    }
}