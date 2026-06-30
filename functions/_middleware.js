export async function onRequest({ request, next }) {
  const response = await next();
  if (response.status === 404) {
    const url = new URL(request.url);
    const indexUrl = new URL("/", url.origin);
    const indexResponse = await fetch(indexUrl.toString());
    return new Response(await indexResponse.text(), {
      status: 200,
      headers: { "Content-Type": "text/html" },
    });
  }
  return response;
}
