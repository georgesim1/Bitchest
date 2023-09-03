<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Response;


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
    
        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }
    
        $validatedData = $request->validate([
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|string|email|max:255|unique:users,email,' . $user->id,
            'password' => 'sometimes|string|min:6',
            'usertype' => 'sometimes|string|max:255', // Adding usertype validation
            'portfolio' => 'sometimes|string|max:255'  // Adjust this if there's a specific validation you want
        ]);
    
        $user->update($validatedData);
    
        return response()->json(['message' => 'User updated successfully', 'user' => $user], 200);
    }
    

    // Destroy - Delete a user by ID
    public function destroy($id)
    {
       try {
        $user = User::find($id);

        if(!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        $user->delete();

        return response()->json(['message' => 'User deleted successfully'], 200);
       } catch (\Throwable $th) {
        return response()->json(['message' => $th->getMessage()], 400);
       }
    }
}