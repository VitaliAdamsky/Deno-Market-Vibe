// Function to read all error reports from Deno KV
export async function readAllErrorReports() {
  // Open the Deno KV store
  const kv = await Deno.openKv();

  // Retrieve all error reports from Deno KV
  const errorReports = [];
  const entries = kv.list({ prefix: ["error_reports"] });

  for await (const entry of entries) {
    errorReports.push(entry.value);
  }

  // Close the KV store
  await kv.close();

  return errorReports;
}
