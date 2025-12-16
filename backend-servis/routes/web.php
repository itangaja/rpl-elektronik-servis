<?php

use Illuminate\Support\Facades\Route;

// Serve React app for all routes except API
Route::get('/', function () {
    return response()->json(['status' => 'Backend is running', 'message' => 'Please access the frontend URL']);
});

