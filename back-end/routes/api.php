<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
    return $request->user();
});

Route::get('/get-csrf-token', function() {
    return response()->json(['csrfToken' => csrf_token()]);
});

Route::get('/users', [UserController::class, 'index']);

Route::middleware(['auth:sanctum'])->group(function() {
    Route::post('/users', [UserController::class, 'store']);   // Create
    Route::get('/users/{id}', [UserController::class, 'show']); // View
    Route::put('/users/{id}', [UserController::class, 'update']); // Modify
    Route::delete('/users/{id}', [UserController::class, 'destroy']); // Delete
});
