import { MarketData } from "../../models/market-data.ts";
import { getColorFromChangeValue } from "../utils/get-color-from-change-value.ts";
import { getColorFromValue } from "../utils/get-color-from-value.ts";

export function normalizeVolumeDeltaData(
  marketDataArray: MarketData[]
): MarketData[] {
  return marketDataArray.map((coinData) => {
    const { data } = coinData;

    // Извлекаем только нужные метрики
    const volumeDeltas = data.map((item) => item.volumeDelta ?? 0);
    const volumeDeltaChanges = data.map((item) => item.volumeDeltaChange ?? 0);

    // Рассчитываем min/max для volumeDelta
    const vdMin = Math.min(...volumeDeltas);
    const vdMax = Math.max(...volumeDeltas);
    const vdRange = vdMax - vdMin;
    const vdUniform = vdRange === 0;

    // Рассчитываем min/max для volumeDeltaChange
    const vdChangeMin = Math.min(...volumeDeltaChanges);
    const vdChangeMax = Math.max(...volumeDeltaChanges);

    // Обновляем данные с нормализацией и цветами
    const updatedData = data.map((item) => {
      // Нормализация volumeDelta
      const volumeDelta = item.volumeDelta ?? 0;
      const normalizedVd = vdUniform ? 1 : (volumeDelta - vdMin) / vdRange;
      const vdColor = getColorFromValue(normalizedVd); // Градиент от синего до оранжевого

      // Цвет для volumeDeltaChange (дивергирующая шкала)
      const vdChange = item.volumeDeltaChange ?? 0;
      const vdChangeColor = getColorFromChangeValue(
        vdChange,
        vdChangeMin,
        vdChangeMax
      );

      return {
        ...item,
        colors: {
          ...item.colors,
          volumeDelta: vdColor,
          volumeDeltaChange: vdChangeColor,
        },
        normalizedVolumeDelta: parseFloat(normalizedVd.toFixed(4)),
        normalizedVolumeDeltaChange: parseFloat(vdChange.toFixed(4)),
      };
    });

    return {
      ...coinData,
      data: updatedData,
    };
  });
}
