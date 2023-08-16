<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\AuthenticatedSessionController;

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


Route::post('login', function (Request $request) {
    $controller = new \App\Http\Controllers\Auth\AuthenticatedSessionController;

    // Call the Breeze logic
    $response = $controller->create($request);

    // Check if the user was authenticated
    if (Auth::check()) {
        return response()->json(['message' => 'Logged in successfully', 'user' => Auth::user()], 200);
    }

    return response()->json(['message' => 'Invalid credentials'], 401);
})->name('api.login');

// Logout route
Route::post('logout', function (Request $request) {
    $controller = new \App\Http\Controllers\Auth\AuthenticatedSessionController;

    // Call the Breeze logic
    $controller->destroy($request);
    return response()->json(['message' => 'Logged out successfully'], 200);
})->name('api.logout');

// Get current user info
Route::get('user', function () {
    if ($user = Auth::user()) {
        return response()->json(['user' => $user], 200);
    }

    return response()->json(['message' => 'Not logged in'], 401);
})->name('api.user');