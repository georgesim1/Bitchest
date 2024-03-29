<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Cryptocurrency;
use App\Models\Transaction;
use Illuminate\Support\Facades\Log;

class TransactionController extends Controller
{
    public function index(Request $request)
    {
        $user = auth()->user();
    
        if (!$user) {
            return response()->json(['message' => 'Authentication required'], 401);
        }
    
        $transactions = Transaction::where('user_id', $user->id)->with('cryptocurrency')->get();
    
        return response()->json($transactions);
    }

    public function buy(Request $request)
    {
         // Get required data from the request
        $userId = $request->input('userId');
        $cryptoId = $request->input('cryptoId');
        $quantity = $request->input('quantity');

        Log::info('Quantity: ' . $quantity);

        // Fetch the user from the database using the provided ID.
        $user = User::find($userId);
        // If user not found, return a 404 Not Found error.
        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }
        // Fetch the cryptocurrency using the provided ID.
        $crypto = Cryptocurrency::where('id', $cryptoId)->first();

        if ($crypto === null) {
            return response()->json(['message' => 'Cryptocurrency not found'], 404);
        }

        // Calculate the total price of the purchase.
        $totalPrice = $crypto->price * $quantity;
        if($user->wallet->balance < $totalPrice) {
            return response()->json(['message' => 'Insufficient balance'], 400);
        }
        // Deduct the total price from the user's wallet balance.
        $wallet = $user->wallet;
        $wallet->balance -= $totalPrice;
        $wallet->save();

        // Check if the user already has an entry for this cryptocurrency
        $ownedCrypto = $user->cryptos()->where('cryptocurrency_id', $cryptoId)->first();

        if($ownedCrypto) {
            $ownedCrypto->pivot->quantity += $quantity;
            $ownedCrypto->pivot->save();
        } else {
            $user->cryptos()->attach($cryptoId, ['quantity' => $quantity]);
        }

        Transaction::create([
            'user_id' => $userId,
            'cryptocurrency_id' => $cryptoId,
            'amount' => $quantity,
            'price_at_transaction' => $crypto->price,
            'transaction_type' => 'buy'
        ]);

        return response()->json(['message' => 'Successfully bought']);
    }

    public function sell(Request $request)
    {
        $userId = $request->input('user_id');
        $cryptoName = $request->input('crypto_id');
        $quantity = $request->input('quantity');
    
        $user = User::find($userId);
        $crypto = Cryptocurrency::where('name', $cryptoName)->first();
    
        if ($crypto === null) {
            return response()->json(['message' => 'Cryptocurrency not found'], 404);
        }
    
        $ownedCrypto = $user->cryptos()->where('cryptocurrency_id', $crypto->id)->first();
    
        if (!$ownedCrypto) {
            return response()->json(['message' => 'Cryptocurrency not owned by the user'], 400);
        }
    
        if ($ownedCrypto->pivot->quantity < $quantity) {
            return response()->json(['message' => 'Not enough crypto to sell'], 400);
        }
    
        $totalAmount = $crypto->price * $quantity;
        $user->wallet->balance += $totalAmount;
        $user->wallet->save();
    
        $ownedCrypto->pivot->quantity -= $quantity;
        $ownedCrypto->pivot->save();
    
        if ($ownedCrypto->pivot->quantity <= 0) {
            $user->cryptos()->detach($crypto->id);
        }
    
        Transaction::create([
            'user_id' => $userId,
            'cryptocurrency_id' => $crypto->id,
            'amount' => $quantity,
            'price_at_transaction' => $crypto->price,
            'transaction_type' => 'sell'
        ]);
    
        return response()->json(['message' => 'Successfully sold']);
    }
}
