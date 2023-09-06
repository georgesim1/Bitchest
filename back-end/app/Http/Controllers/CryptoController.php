<?php

namespace App\Http\Controllers;

use App\Models\Cryptocurrency;
use Illuminate\Http\Request;

class CryptoController extends Controller
{
    public function getAllCryptos() {
        $cryptos = Cryptocurrency::all();
        return response()->json($cryptos);
    }
}
