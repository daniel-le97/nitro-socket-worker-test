import "#internal/nitro/virtual/polyfills";
import { nitroApp } from "nitropack/runtime/app";
// @ts-ignore
import { isPublicAssetURL } from "#internal/nitro/virtual/public-assets";
import type { Context } from "socket:service-worker";
import { platform } from "socket:os";


const useSocket = async(mod = 'os') => {
  return await import(`socket:${mod}`);
}

// path.RESOURCES
export default {
  async fetch(request: Request, env = {}, ctx: Context) {
    ctx.data = platform()
    const url = new URL(request.url);
    if (isPublicAssetURL(url.pathname) || url.pathname.includes("/_server/")) {
      return;
    }

    const response = await handleEvent(url, request);
    const clonedResponse = response.clone();
    // { response: 'hello world!' }
    console.log({response: clonedResponse.headers.get('content-type')});
    return response
  },
};


async function handleEvent(url: URL, request: Request) {
  let body = undefined;
  if (request.body) {
    body = await request.arrayBuffer();
  }
  request.headers.set('runtime-preload-injection', 'disabled')
  return await nitroApp.localFetch(url.pathname + url.search, {
    host: url.hostname,
    protocol: url.protocol,
    headers: request.headers,
    method: request.method,
    redirect: "follow",
    body,
  });
}
