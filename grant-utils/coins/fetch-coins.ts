import { ServantsConfigOperator } from "../servants/operators/servants-config-operator.ts";

export async function fetchCoins() {
  try {
    const config = ServantsConfigOperator.getConfig();
    if (!config.coinsApi) {
      throw new Error("Coins API URL is not configured.");
    }

    const response = await fetch(config.coinsApi);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const coins = (await response.json()).coins;
    return coins;
  } catch (error) {
    console.error("Failed to fetch or parse coins data:", error);
    throw error; // Re-throw the error if you want to handle it further up the call stack
  }
}
