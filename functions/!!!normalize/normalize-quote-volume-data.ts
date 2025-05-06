import { MarketData } from "../../models/market-data.ts";
import { getColorFromChangeValue } from "../utils/get-color-from-change-value.ts";
import { getColorFromValue } from "../utils/get-color-from-value.ts";

export function normalizeQuoteVolumeData(
  marketDataArray: MarketData[]
): MarketData[] {
  return marketDataArray.map((coinData) => {
    const { data } = coinData;

    // Извлекаем только нужные метрики
    const quoteVolumes = data.map((item) => item.quoteVolume ?? 0);
    const quoteVolumeChanges = data.map((item) => item.quoteVolumeChange ?? 0);

    // Рассчитываем min/max для quoteVolume
    const qvMin = Math.min(...quoteVolumes);
    const qvMax = Math.max(...quoteVolumes);
    const qvRange = qvMax - qvMin;
    const qvUniform = qvRange === 0;

    // Рассчитываем min/max для quoteVolumeChange
    const qvChangeMin = Math.min(...quoteVolumeChanges);
    const qvChangeMax = Math.max(...quoteVolumeChanges);

    // Обновляем данные с нормализацией и цветами
    const updatedData = data.map((item) => {
      // Нормализация quoteVolume
      const quoteVolume = item.quoteVolume ?? 0;
      const normalizedQv = qvUniform ? 1 : (quoteVolume - qvMin) / qvRange;
      const qvColor = getColorFromValue(normalizedQv); // Градиент от синего до оранжевого

      // Цвет для quoteVolumeChange (дивергирующая шкала)
      const qvChange = item.quoteVolumeChange ?? 0;
      const qvChangeColor = getColorFromChangeValue(
        qvChange,
        qvChangeMin,
        qvChangeMax
      );

      return {
        ...item,
        colors: {
          ...item.colors,
          quoteVolume: qvColor,
          quoteVolumeChange: qvChangeColor,
        },
        normalizedQuoteVolume: parseFloat(normalizedQv.toFixed(4)),
        normalizedQuoteVolumeChange: parseFloat(qvChange.toFixed(4)),
      };
    });

    return {
      ...coinData,
      data: updatedData,
    };
  });
}
