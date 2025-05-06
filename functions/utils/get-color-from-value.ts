import chroma from "npm:chroma-js";

// Дивергирующая шкала с явным доменом
export function getColorFromValue(
  value: number,
  startColor: string = "#004b23",
  endColor: string = "#00ff00"
): string {
  return chroma.scale([startColor, endColor]).mode("lab")(value).hex();
}
