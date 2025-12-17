<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->alias([
            'role' => \App\Http\Middleware\CheckRole::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        //
    })->create();

// Vercel Read-Only Filesystem Fix
if (isset($_ENV['VERCEL'])) {
    $path = '/tmp/storage';
    $app->useStoragePath($path);
    
    // Create directories if not exist
    if (!is_dir($path)) {
        mkdir($path, 0777, true);
        mkdir($path . '/framework/views', 0777, true);
        mkdir($path . '/framework/cache', 0777, true);
        mkdir($path . '/framework/sessions', 0777, true);
        mkdir($path . '/logs', 0777, true);
    }
}

return $app;
