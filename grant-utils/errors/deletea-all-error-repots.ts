// Import necessary modules

// Function to delete all error reports from Deno KV
export async function deleteAllErrorReports() {
  // Open the Deno KV store
  const kv = await Deno.openKv();

  // Retrieve all error report keys from Deno KV
  const entries = kv.list({ prefix: ["error_reports"] });

  // Delete each error report
  for await (const entry of entries) {
    await kv.delete(entry.key);
  }

  // Close the KV store
  await kv.close();

  console.log("All error reports have been deleted.");
}
