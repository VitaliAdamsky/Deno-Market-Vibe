import { MarketData } from "../../models/market-data.ts";
import { getColorFromChangeValue } from "../utils/get-color-from-change-value.ts";
import { getColorFromValue } from "../utils/get-color-from-value.ts";

export function normalizeOpenInterestData(
  marketDataArray: MarketData[]
): MarketData[] {
  return marketDataArray.map((coinData) => {
    const { data } = coinData;

    // Извлекаем значения для нормализации
    const openInterests = data.map((item) => item.openInterest);
    const openInterestChanges = data.map((item) => item.openInterestChange);

    // Рассчитываем min/max для openInterest
    const oiMin = Math.min(...openInterests);
    const oiMax = Math.max(...openInterests);
    const oiRange = oiMax - oiMin;
    const oiUniform = oiRange === 0;

    // Рассчитываем min/max для openInterestChange
    const oiChangeMin = Math.min(...openInterestChanges);
    const oiChangeMax = Math.max(...openInterestChanges);

    // Обновляем данные с нормализацией и цветами
    const updatedData = data.map((item) => {
      // Нормализация openInterest
      const normalizedOi = oiUniform
        ? 1
        : (item.openInterest - oiMin) / oiRange;
      const oiColor = getColorFromValue(normalizedOi); // Градиент зеленого

      // Цвет для openInterestChange (дивергирующая шкала)
      const oiChangeColor = getColorFromChangeValue(
        item.openInterestChange,
        oiChangeMin,
        oiChangeMax
      );

      // Возвращаем обновленный элемент с цветами в поле `colors`
      return {
        ...item,
        colors: {
          ...item.colors,
          openInterest: oiColor,
          openInterestChange: oiChangeColor,
        },
        normalizedOpenInterest: parseFloat(normalizedOi.toFixed(4)),
      };
    });

    return {
      ...coinData,
      data: updatedData,
    };
  });
}
