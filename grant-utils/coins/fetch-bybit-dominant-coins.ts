import { Coin } from "../models/coin.ts";
import { ServantsConfigOperator } from "../servants/operators/servants-config-operator.ts";

export async function fetchBybitDominantCoins() {
  const config = ServantsConfigOperator.getConfig();

  let coins;
  try {
    const response = await fetch(config.coinsApi);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    coins = (await response.json()).coins;
    const binanceCoins = coins.filter(
      (coin: Coin) =>
        coin.exchanges.includes("Binance") && !coin.exchanges.includes("Bybit")
    );
    const bybitCoins = coins.filter((coin: Coin) =>
      coin.exchanges.includes("Bybit")
    );

    console.log("binanceCoins", binanceCoins.length);
    return {
      binanceCoins,
      bybitCoins,
    };
  } catch (error) {
    console.error("Failed to fetch or parse coins data:", error);
    throw error; // Re-throw the error if you want to handle it further up the call stack
  }
}
