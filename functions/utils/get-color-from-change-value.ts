import chroma from "npm:chroma-js";

// Дивергирующая шкала: красный (-) → белый (0) → зеленый (+)
export function getColorFromChangeValue(
  value: number,
  min: number,
  max: number,
  negativeColor: string = "#ff4d4d",
  neutralColor: string = "#ffffff",
  positiveColor: string = "#4dff4d"
): string {
  const absMax = Math.max(Math.abs(min), Math.abs(max));
  return chroma
    .scale([negativeColor, neutralColor, positiveColor])
    .domain([-absMax, 0, absMax])
    .mode("lab")(value)
    .hex();
}
