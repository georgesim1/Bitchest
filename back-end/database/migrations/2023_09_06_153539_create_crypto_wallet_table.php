<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('crypto_wallets', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('wallet_id'); // Foreign key referencing wallets table
            $table->unsignedBigInteger('crypto_id'); // Foreign key referencing cryptos table
            $table->decimal('amount', 18, 8)->default(0); // Amount of crypto
            $table->decimal('global_value', 8, 2)->default(0); // Or whatever default you'd like
            $table->timestamps();
    
            // Set foreign key constraints
            $table->foreign('wallet_id')->references('id')->on('wallets')->onDelete('cascade');
            $table->foreign('crypto_id')->references('id')->on('cryptocurrencies')->onDelete('cascade');
        });
    }
    

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('crypto_wallets');
    }
};
