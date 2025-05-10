export const calculateCloseTime = (openTime: number, intervalMs: number) => {
  return Number(openTime) + Number(intervalMs);
};
