export async function query(query: string) {
  const result = await fetch(GRAPHQL_ENDPOINT, {
    method: "POST",
    headers: {
      "Dg-Auth": GRAPHQL_TOKEN,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query,
    }),
  });
  return await result.json();
}
