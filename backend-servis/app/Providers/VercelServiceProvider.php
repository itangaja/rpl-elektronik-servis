<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

class VercelServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        if (isset($_ENV['VERCEL'])) {
            $path = '/tmp/storage';
            $this->app->useStoragePath($path);
            
            // Fix for view cache
            $this->app['config']->set('view.compiled', "{$path}/framework/views");
            
            // Create directories if not exist
            if (!is_dir($path)) {
                mkdir($path, 0777, true);
                mkdir($path . '/framework/views', 0777, true);
                mkdir($path . '/framework/cache', 0777, true);
                mkdir($path . '/framework/sessions', 0777, true);
                mkdir($path . '/logs', 0777, true);
            }
        }
    }
}
