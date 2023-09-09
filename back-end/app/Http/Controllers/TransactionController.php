<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Cryptocurrency;
use App\Models\Transaction;
use Illuminate\Support\Facades\Log;

class TransactionController extends Controller
{
    public function buy(Request $request)
    {
        $userId = $request->input('userId');
        $cryptoId = $request->input('cryptoId');
        $quantity = $request->input('quantity');
        Log::info('Quantity: ' . $quantity);

        $user = User::find($userId);
            if (!$user) {
                return response()->json(['message' => 'User not found'], 404);
            }
        $crypto = Cryptocurrency::where('id',$cryptoId )->first();

        // Check if crypto exists
        if ($crypto === null) {
            return response()->json(['message' => 'Cryptocurrency not found'], 404);
            
        }

        // Check if the user can afford the purchase
        $totalPrice = $crypto->price * $quantity;
        if($user->wallet->balance < $totalPrice) {
            return response()->json(['message' => 'Insufficient balance'], 400);
        }

        // Deduct from user's balance and save the crypto purchase
        $wallet = $user->wallet;
        $wallet->balance -= $totalPrice;
        $wallet->save();
        // $user->cryptos()->attach($cryptoId, ['quantity' => $quantity]);

        // Log the transaction
        Transaction::create([
            'user_id' => $userId,
            'cryptocurrency_id' => $cryptoId,
            'amount' => $quantity,  // This is the quantity of the cryptocurrency
            'price_at_transaction' => $crypto->price,  // Price of the cryptocurrency at the time of transaction
            'transaction_type' => 'buy'  // Or 'sell' based on the method
        ]);        

        return response()->json(['message' => 'Successfully bought']);
    }

    public function sell(Request $request)
    {
        $userId = $request->input('user_id');
        $cryptoId = $request->input('crypto_id');
        $quantity = $request->input('quantity');

        $user = User::find($userId);
        $crypto = Cryptocurrency::find($cryptoId);

        // Check if crypto exists
        if ($crypto === null) {
            return response()->json(['message' => 'Cryptocurrency not found'], 404);
        }

        // Check if the user has enough of the crypto to sell
        $ownedCrypto = $user->cryptos()->where('crypto_id', $cryptoId)->first();
        if(!$ownedCrypto || $ownedCrypto->pivot->quantity < $quantity) {
            return response()->json(['message' => 'Not enough crypto to sell'], 400);
        }

        // Add to user's balance and deduct the crypto
        $totalAmount = $crypto->price * $quantity;
        $user->balance += $totalAmount;
        $ownedCrypto->pivot->quantity -= $quantity;
        $ownedCrypto->pivot->save();

        if($ownedCrypto->pivot->quantity <= 0) {
            $user->cryptos()->detach($cryptoId);
        }
        $user->save();

        // Log the transaction
        Transaction::create([
            'user_id' => $userId,
            'cryptocurrency_id' => $cryptoId,
            'quantity' => $quantity,
            'type' => 'sell'
        ]);

        return response()->json(['message' => 'Successfully sold']);
    }
}
