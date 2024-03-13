<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;

class AuthController extends Controller
{
    

// ...
    public function login(Request $request)
    {
        $credentials = $request->only('username', 'password'); 
        dd($credentials);
        Log::info('AuthController login terpanggil');
        if (Auth::attempt($credentials)) {
            $role = Auth::user()->role;


            Log::info("User '{$credentials['username']}' with role '{$role}' logged in.");

            return match ($role) {
                'admin' => Inertia::location(route('admin')),
                default => Inertia::location(route('home')),
            };
        }

        return back()->withErrors(['username' => 'Invalid credentials']);
    }

    protected function authenticated(Request $request, $user)
{
    if ($user->role === 'admin') {
        return redirect()->route('admin');
    }

    return redirect('/home');
}


}
