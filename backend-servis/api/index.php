<?php

// Handle CORS for Vercel Serverless
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Origin, Content-Type, Accept, Authorization, X-Requested-With');

// Handle Preflight Request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Clear caches for Vercel environment to ensure fresh routes
if (getenv('APP_ENV') === 'production') {
    // Opsional: Hapus komentar ini jika ingin clear cache setiap request (agak berat)
    // tapi sangat ampuh untuk debug 404
    // \Illuminate\Support\Facades\Artisan::call('optimize:clear');
}

require __DIR__ . '/../public/index.php';
