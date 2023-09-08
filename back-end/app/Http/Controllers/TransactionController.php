<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Cryptocurrency;
use App\Models\Transaction;

class TransactionController extends Controller
{
    public function buy(Request $request)
    {
        $userId = $request->input('user_id');
        $cryptoId = $request->input('cryptoId');
        $quantity = $request->input('quantity');

        $user = User::find($userId);
        $crypto = Cryptocurrency::where('id',$cryptoId )->first();

        // Check if crypto exists
        if ($crypto === null) {
            return response()->json(['message' => 'Cryptocurrency not found'], 404);
            
        }

        // Check if the user can afford the purchase
        $totalPrice = $crypto->price * $quantity;
        if($user->balance < $totalPrice) {
            return response()->json(['message' => 'Insufficient balance'], 400);
        }

        // Deduct from user's balance and save the crypto purchase
        $user->balance -= $totalPrice;
        $user->cryptos()->attach($cryptoId, ['quantity' => $quantity]);
        $user->save();

        // Log the transaction
        Transaction::create([
            'user_id' => $userId,
            'crypto_id' => $cryptoId,
            'quantity' => $quantity,
            'type' => 'buy'
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
            'crypto_id' => $cryptoId,
            'quantity' => $quantity,
            'type' => 'sell'
        ]);

        return response()->json(['message' => 'Successfully sold']);
    }
}
