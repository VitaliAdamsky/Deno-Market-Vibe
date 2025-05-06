import { MarketData } from "../../models/market-data.ts";
import { getColorFromChangeValue } from "../utils/get-color-from-change-value.ts";
import { getColorFromValue } from "../utils/get-color-from-value.ts";

export function normalizeClosePriceData(
  marketDataArray: MarketData[]
): MarketData[] {
  return marketDataArray.map((coinData) => {
    const { data } = coinData;

    // Извлекаем значения для нормализации
    const closePrices = data.map((item) => item.closePrice ?? 0);
    const closePriceChanges = data.map((item) => item.closePriceChange ?? 0);

    // Рассчитываем min/max для closePrice
    const cpMin = Math.min(...closePrices);
    const cpMax = Math.max(...closePrices);
    const cpRange = cpMax - cpMin;
    const cpUniform = cpRange === 0;

    // Рассчитываем min/max для closePriceChange
    const cpChangeMin = Math.min(...closePriceChanges);
    const cpChangeMax = Math.max(...closePriceChanges);

    // Обновляем данные с нормализацией и цветами
    const updatedData = data.map((item) => {
      // Нормализация closePrice
      const closePrice = item.closePrice ?? 0;
      const normalizedCp = cpUniform ? 1 : (closePrice - cpMin) / cpRange;
      const cpColor = getColorFromValue(normalizedCp); // Градиент синего

      // Цвет для closePriceChange (дивергирующая шкала)
      const cpChange = item.closePriceChange ?? 0;
      const cpChangeColor = getColorFromChangeValue(
        cpChange,
        cpChangeMin,
        cpChangeMax
      );

      // Возвращаем обновленный элемент с цветами в `colors`
      return {
        ...item,
        colors: {
          ...item.colors,
          closePrice: cpColor,
          closePriceChange: cpChangeColor,
        },
        normalizedClosePrice: parseFloat(normalizedCp.toFixed(4)),
        normalizedClosePriceChange: parseFloat(cpChange.toFixed(4)),
      };
    });

    return {
      ...coinData,
      data: updatedData,
    };
  });
}
