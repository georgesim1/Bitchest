<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    // Index - List all users
    public function index()
    {
        return response()->json(User::all(), 200);
    }

    // Store - Create a new user
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:6',
            // Add validation rules for other fields if needed
        ]);

        $user = User::create($validatedData);
        
        return response()->json(['message' => 'User created successfully', 'user' => $user], 201);
    }

    // Show - Display a specific user by ID
    public function show($id)
    {
        $user = User::find($id);

        if(!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        return response()->json($user, 200);
    }

    // Update - Modify an existing user by ID
    public function update(Request $request, $id)
    {
        $user = User::find($id);

        if(!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        $validatedData = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'email' => 'sometimes|required|string|email|max:255|unique:users,email,' . $user->id,
            'password' => 'sometimes|required|string|min:6',
            // Add validation rules for other fields if needed
        ]);

        $user->update($validatedData);

        return response()->json(['message' => 'User updated successfully', 'user' => $user], 200);
    }

    // Destroy - Delete a user by ID
    public function destroy($id)
    {
        $user = User::find($id);

        if(!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        $user->delete();

        return response()->json(['message' => 'User deleted successfully'], 200);
    }
}