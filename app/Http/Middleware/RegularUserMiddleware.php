<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use Illuminate\Support\Facades\Redirect;


class RegularUserMiddleware
{
    public function handle(Request $request, Closure $next)
    {
        if ($request->getRequestUri() !== '/' && substr($request->getRequestUri(), -1) === '/') {
            return Redirect::to(rtrim($request->getRequestUri(), '/'), 301);
        }

        if (auth()->check() && !auth()->user()->isAdmin()) {
            return $next($request);
        }

        return redirect()->route('admin')->with('error', 'Unauthorized access.');
    }
}
