<?php

namespace App\Http\Controllers;

use App\Models\Cryptocurrency;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CryptoController extends Controller
{
    /**
     * Get all cryptocurrencies.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getAllCryptos() {
        $cryptos = Cryptocurrency::all();
        return response()->json($cryptos);
    }

    /**
     * Get the authenticated user's wallet and its crypto holdings.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function getUserWallet(Request $request) {
        $user = $request->user();
        

        // Ensure user is authenticated
        if (!$user) {
            return response()->json(['message' => 'User not authenticated'], 401);
        }

        // Fetch the user's wallet and its associated cryptocurrencies.
        $wallet = $user->wallet;
        
        // Ensure the user has a wallet
        if (!$wallet) {
            return response()->json(['message' => 'User does not have a wallet'], 404);
        }

        // Fetch crypto holdings from the wallet
        $cryptoHoldings = $wallet->cryptoHoldings; // Assuming a relation 'cryptoHoldings' exists on the Wallet model
       
        $totalInEuros = 0; 
        $cryptos = [];

        foreach ($cryptoHoldings as $holding) {
            $cryptos[] = [
                'name' => $holding->crypto->name, // Assuming a 'crypto' relation on crypto_wallet model
                'amount' => $holding->amount
            ];

            // Calculate total in euros based on the current price of the crypto.
            $totalInEuros += $holding->crypto->price * $holding->amount;
        }

        return response()->json([
            'totalInEuros' => $totalInEuros,
            'cryptos' => $cryptos
        ]);
    }
}
