import { MarketData } from "../../models/market-data.ts";
import { getColorFromChangeValue } from "../utils/get-color-from-change-value.ts";
import { getColorFromValue } from "../utils/get-color-from-value.ts";

export function normalizeSpotPerpData(
  marketDataArray: MarketData[]
): MarketData[] {
  return marketDataArray.map((coinData) => {
    const { data } = coinData;

    // Извлекаем только нужные метрики
    const spotPrices = data.map((item) => item.spotClosePrice ?? 0);
    const perpSpotDiffs = data.map((item) => item.perpSpotDiff ?? 0);

    // Рассчитываем min/max для spotClosePrice
    const spMin = Math.min(...spotPrices);
    const spMax = Math.max(...spotPrices);
    const spRange = spMax - spMin;
    const spUniform = spRange === 0;

    // Рассчитываем min/max для perpSpotDiff (дивергирующая шкала)
    const psMin = Math.min(...perpSpotDiffs);
    const psMax = Math.max(...perpSpotDiffs);

    // Обновляем данные с нормализацией и цветами
    const updatedData = data.map((item) => {
      // Нормализация spotClosePrice
      const spotPrice = item.spotClosePrice ?? 0;
      const normalizedSp = spUniform ? 1 : (spotPrice - spMin) / spRange;
      const spColor = getColorFromValue(normalizedSp); // Градиент от синего до оранжевого

      // Цвет для perpSpotDiff (дивергирующая шкала)
      const perpSpotDiff = item.perpSpotDiff ?? 0;
      const psColor = getColorFromChangeValue(perpSpotDiff, psMin, psMax);

      return {
        ...item,
        colors: {
          ...item.colors,
          spotClosePrice: spColor,
          perpSpotDiff: psColor,
        },
        normalizedSpotClosePrice: parseFloat(normalizedSp.toFixed(4)),
        normalizedPerpSpotDiff: parseFloat(perpSpotDiff.toFixed(4)),
      };
    });

    return {
      ...coinData,
      data: updatedData,
    };
  });
}
