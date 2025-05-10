export function delay(minutes: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, minutes * 60 * 1000);
  });
}
