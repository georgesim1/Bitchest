<?php

/**
 * Renvoie la valeur de mise sur le marché de la crypto monnaie
 * @param $cryptoname {string} Le nom de la crypto monnaie
 */
/**
 * Retrieve the initial quotation of a cryptocurrency.
 *
 * @param string $cryptoname The name of the cryptocurrency.
 * @return int The initial quotation of the cryptocurrency.
 */
function getFirstCotation($cryptoname) {
  return ord(substr($cryptoname, 0, 1)) + rand(0, 10);
}

/**
* Retrieve the daily variation of a cryptocurrency's quotation.
*
* @param string $cryptoname The name of the cryptocurrency.
* @return float The daily variation of the cryptocurrency's quotation.
*/
function getCotationFor($cryptoname) {
  $direction = rand(0, 99) > 40 ? 1 : -1;
  $charCode = rand(0, 99) > 49 ? ord(substr($cryptoname, 0, 1)) : ord(substr($cryptoname, -1));
  
  return $direction * $charCode * (rand(1, 10) * 0.01);
}

/**
* Calculate the cryptocurrency's price over the past 30 days.
*
* @param string $cryptoname The name of the cryptocurrency.
* @return array An array of prices over the past 30 days.
*/
function generatePastMonthPrices($cryptoname) {
  $prices = [];
  $currentPrice = getFirstCotation($cryptoname);
  
  for ($i = 0; $i < 30; $i++) {
      array_unshift($prices, $currentPrice); // prepend the current price to the start of the array
      $currentPrice += getCotationFor($cryptoname);
  }
  
  return $prices;
}

// Usage
$bitcoinPrices = generatePastMonthPrices('Bitcoin');
print_r($bitcoinPrices);
