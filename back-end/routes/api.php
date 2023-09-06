<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\AuthenticatedSessionController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\CryptoController;


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
Route::get('/', [NFTController::class, 'index'])->middleware(['auth', 'admin'])->name('home'); ;

Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
    return $request->user();
});

Route::get('/get-csrf-token', function() {
    return response()->json(['csrfToken' => csrf_token()]);
});

Route::get('/users', [UserController::class, 'index']);

// Get current user info
Route::get('user', function () {
    if ($user = Auth::user()) {
        return response()->json(['user' => $user], 200);
    }

    return response()->json(['message' => 'Not logged in'], 401);
})->name('api.user');

// Get user balance
Route::middleware(['auth:sanctum'])->get('/users/portfolio', [UserController::class, 'getPortfolio']);

// Get all crypto currencies
Route::get('/crypto', [CryptoController::class, 'getAllCryptos']);

// Update a user - this assumes you have a "update" method in your UserController
Route::put('/users/{id}', [UserController::class, 'update']);

// Delete a user - this assumes you have a "destroy" method in your UserController
Route::middleware(['auth:sanctum'])->delete('/users/{id}', [UserController::class, 'destroy']);