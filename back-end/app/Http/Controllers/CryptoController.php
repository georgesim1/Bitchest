<?php

namespace App\Http\Controllers;

use App\Models\Cryptocurrency;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

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
    
        // Fetch the user's wallet
        $wallet = $user->wallet;
    
        // Ensure the user has a wallet
        if (!$wallet) {
            return response()->json(['message' => 'User does not have a wallet'], 404);
        }
    
        $cryptoHoldings = $user->cryptos; 
    
        $totalInEuros = 0; 
        $cryptos = [];
    
        foreach ($cryptoHoldings as $crypto) {
            $cryptos[] = [
                'name' => $crypto->name,
                'amount' => $crypto->pivot->quantity
            ];
    
            // Calculate total in euros based on the current price of the crypto.
            $totalInEuros += $crypto->price * $crypto->pivot->quantity;
        }
    
        return response()->json([
            'totalInEuros' => $totalInEuros,
            'cryptos' => $cryptos,
            'wallet' => $wallet
        ]);
    }
    
    

    public function getPriceHistory($cryptoname)
    {
        $firstCotation = $this->getFirstCotation($cryptoname);
        $priceData = [];
        $dates = [];

        // Generate data for the last 30 days
        for ($i = 29; $i >= 0; $i--) {
            $date = now()->subDays($i)->toDateString();
            $dates[] = $date;

            if ($i == 29) {
                $priceData[] = $firstCotation;
            } else {
                $priceData[] = $priceData[count($priceData) - 1] + $this->getCotationFor($cryptoname);
            }
        }

        return response()->json([
            'dates' => $dates,
            'prices' => $priceData,
        ]);
    }

    private function getFirstCotation($cryptoname)
    {
        return ord(substr($cryptoname, 0, 1)) + rand(0, 10);
    }

    private function getCotationFor($cryptoname)
    {
        return ((rand(0, 99) > 40) ? 1 : -1) * ((rand(0, 99) > 49) ? ord(substr($cryptoname, 0, 1)) : ord(substr($cryptoname, -1))) * (rand(1, 10) * .01);
    }

    /**
     * Process a cryptocurrency transaction.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function processTransaction(Request $request) {
        $user = $request->user();
    
        // Ensure user is authenticated
        if (!$user) {
            return response()->json(['message' => 'User not authenticated'], 401);
        }
    
        $action = $request->input('action'); // 'buy' or 'sell'
        $cryptoName = $request->input('cryptoName'); // Name of the cryptocurrency
        $amount = $request->input('amount'); // Amount of cryptocurrency to buy/sell
    
        $wallet = $user->wallet;
        if (!$wallet) {
            return response()->json(['message' => 'User does not have a wallet'], 404);
        }
    
        // Fetch crypto
        $crypto = Cryptocurrency::where('name', $cryptoName)->first();
        if (!$crypto) {
            return response()->json(['message' => 'Cryptocurrency not found'], 404);
        }
    
        $cryptoHolding = DB::table('crypto_wallets')
            ->where('wallet_id', $wallet->id)
            ->where('crypto_id', $crypto->id)
            ->first();
    
        if ($action === 'buy') {
            $totalCost = $crypto->price * $amount;
            if ($wallet->balance < $totalCost) {
                return response()->json(['message' => 'Insufficient funds'], 400);
            }
    
            // Deduct the cost from user's wallet and add crypto
            $wallet->balance -= $totalCost;
            $wallet->save();
    
            if ($cryptoHolding) {
                DB::table('crypto_wallets')
                    ->where('id', $cryptoHolding->id)
                    ->increment('amount', $amount);
            } else {
                DB::table('crypto_wallets')->insert([
                    'wallet_id' => $wallet->id,
                    'crypto_id' => $crypto->id,
                    'amount' => $amount,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
    
        } elseif ($action === 'sell') {
            if (!$cryptoHolding || $cryptoHolding->amount < $amount) {
                return response()->json(['message' => 'Not enough cryptocurrency in wallet'], 400);
            }
    
            // Add the euros to user's wallet and deduct the crypto
            $wallet->balance += $crypto->price * $amount;
            $wallet->save();
    
            $newAmount = $cryptoHolding->amount - $amount;
            if ($newAmount == 0) {
                DB::table('crypto_wallets')->where('id', $cryptoHolding->id)->delete();
            } else {
                DB::table('crypto_wallets')
                    ->where('id', $cryptoHolding->id)
                    ->update(['amount' => $newAmount]);
            }
    
        } else {
            return response()->json(['message' => 'Invalid action'], 400);
        }
    
        return response()->json(['message' => ucfirst($action) . ' successful']);
    }
    
}
