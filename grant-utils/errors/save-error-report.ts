export async function saveErrorReport(
  projectName: string,
  functionName: string,
  error: string
) {
  // Open the Deno KV store
  const kv = await Deno.openKv();

  // Create a unique key for the error report
  const errorId = crypto.randomUUID();

  // Define the error report object
  const errorReport = {
    id: errorId,
    projectName,
    functionName,
    error,
    timestamp: new Date().toISOString(),
  };

  // Save the error report to Deno KV
  await kv.set(["error_reports", errorId], errorReport);

  // Close the KV store
  await kv.close();

  return errorId;
}
