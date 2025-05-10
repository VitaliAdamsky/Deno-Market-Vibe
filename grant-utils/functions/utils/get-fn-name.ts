export function getFnName(): string {
  try {
    const error = new Error();
    if (error.stack) {
      // Parse the stack trace to get the caller function's name
      const stackLines = error.stack.split("\n");
      // The caller is typically the third line in the stack trace
      const callerLine = stackLines[2];
      // Extract the function name from the line
      const functionNameMatch = callerLine.match(/at (\S+)/);
      if (functionNameMatch && functionNameMatch[1]) {
        return functionNameMatch[1];
      }
    }
  } catch (e) {
    console.error("Failed to get function name:", e);
  }
  return "unknown";
}
