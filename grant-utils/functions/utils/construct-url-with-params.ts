// Helper function to construct URL with query parameters
export function constructUrlWithParams(
  baseUrl: string,
  params: Record<string, string>
): string {
  // Create a URL object
  const url = new URL(baseUrl);

  // Create URLSearchParams object to handle query parameters
  const searchParams = new URLSearchParams();

  // Add query parameters
  for (const [key, value] of Object.entries(params)) {
    searchParams.append(key, value);
  }

  // Assign the search parameters to the URL object
  url.search = searchParams.toString();

  // Convert the URL object back to a string
  return url.toString();
}
