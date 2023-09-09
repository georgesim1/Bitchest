<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\AuthenticatedSessionController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\CryptoController;
use App\Http\Controllers\TransactionController;

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

// Get current user info
Route::get('user', function () {
    if ($user = Auth::user()) {
        return response()->json(['user' => $user], 200);
    }

    return response()->json(['message' => 'Not logged in'], 401);
})->name('api.user');
// Get crypto 30 days price
Route::get('crypto-price-history/{cryptoname}', [CryptoController::class, 'getPriceHistory']);
// Get user balance
Route::middleware(['auth:sanctum'])->get('/users/portfolio', [UserController::class, 'getPortfolio']);

// Get all crypto currencies
Route::get('/crypto', [CryptoController::class, 'getAllCryptos']);

// Create a new user - this assumes you have a "store" method in your UserController
Route::post('/users', [UserController::class, 'store']);

// Update a user - this assumes you have a "update" method in your UserController
Route::put('/users/{id}', [UserController::class, 'update']);

// Delete a user - this assumes you have a "destroy" method in your UserController
Route::middleware(['auth:sanctum'])->delete('/users/{id}', [UserController::class, 'destroy']);

// Get user's wallet data
Route::middleware(['auth:sanctum'])->get('/user-wallet', [CryptoController::class, 'getUserWallet']);

Route::middleware(['auth:sanctum'])->group(function () {
    Route::get('transactions', [TransactionController::class]);
});

// Route::get('/transaction/buy', [TransactionController::class, 'buy']);
Route::post('/transaction/buy', [TransactionController::class, 'buy']);
Route::post('/transaction/sell', [TransactionController::class, 'sell']);


