import { MarketData } from "../../models/market-data.ts";
import { getColorFromChangeValue } from "../utils/get-color-from-change-value.ts";
import { getColorFromValue } from "../utils/get-color-from-value.ts";

export function normalizeBuyerRatioData(
  marketDataArray: MarketData[]
): MarketData[] {
  return marketDataArray.map((coinData) => {
    const { data } = coinData;

    // Извлекаем только нужные метрики
    const buyerRatios = data.map((item) => item.buyerRatio ?? 0);
    const buyerRatioChanges = data.map((item) => item.buyerRatioChange ?? 0);

    // Рассчитываем min/max для buyerRatio
    const brMin = Math.min(...buyerRatios);
    const brMax = Math.max(...buyerRatios);
    const brRange = brMax - brMin;
    const brUniform = brRange === 0;

    // Рассчитываем min/max для buyerRatioChange
    const brChangeMin = Math.min(...buyerRatioChanges);
    const brChangeMax = Math.max(...buyerRatioChanges);

    // Обновляем данные с нормализацией и цветами
    const updatedData = data.map((item) => {
      // Нормализация buyerRatio
      const buyerRatio = item.buyerRatio ?? 0;
      const normalizedBr = brUniform ? 1 : (buyerRatio - brMin) / brRange;
      const brColor = getColorFromValue(normalizedBr); // Градиент от синего до оранжевого

      // Цвет для buyerRatioChange (дивергирующая шкала)
      const buyerRatioChange = item.buyerRatioChange ?? 0;
      const brChangeColor = getColorFromChangeValue(
        buyerRatioChange,
        brChangeMin,
        brChangeMax
      );

      return {
        ...item,
        colors: {
          ...item.colors,
          buyerRatio: brColor,
          buyerRatioChange: brChangeColor,
        },
        normalizedBuyerRatio: parseFloat(normalizedBr.toFixed(4)),
        normalizedBuyerRatioChange: parseFloat(buyerRatioChange.toFixed(4)),
      };
    });

    return {
      ...coinData,
      data: updatedData,
    };
  });
}
