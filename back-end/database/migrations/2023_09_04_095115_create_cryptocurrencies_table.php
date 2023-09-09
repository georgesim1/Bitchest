<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCryptocurrenciesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('cryptocurrencies', function (Blueprint $table) {
            // $table->unsignedBigInteger('user_id')->nullable();
            
            $table->id(); // Primary key
            $table->string('name'); // Name of the cryptocurrency
            $table->string('symbol')->unique(); // Ticker symbol, like BTC for Bitcoin
            $table->decimal('price', 16, 2); // Current price. Adjust precision as needed.
            $table->text('image')->nullable(); // Path or URL to the image of the cryptocurrency
            $table->timestamps(); // created_at and updated_at columns
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('cryptocurrencies');
    }
}

