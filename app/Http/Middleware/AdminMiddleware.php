<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Redirect;

class AdminMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    // public function handle(Request $request, Closure $next): Response
    // {
    //     return $next($request);
    // }

public function handle(Request $request, Closure $next)
{
    if ($request->getRequestUri() !== '/' && substr($request->getRequestUri(), -1) === '/') {
        return Redirect::to(rtrim($request->getRequestUri(), '/'), 301);
    }

    if (auth()->check()) {
        $role = auth()->user()->role;
        Log::info("User '{$request->user()->email}' has role '{$role}'.");

        if ($role === 'admin') {
            return $next($request);
        }
    }

    return redirect()->route('home')->with('error', 'Unauthorized access.');
}


}
