export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (/\.\w+$/.test(url.pathname)) {
      return env.ASSETS.fetch(request);
    }
    url.pathname = "/index.html";
    return env.ASSETS.fetch(url.toString());
  },
};
