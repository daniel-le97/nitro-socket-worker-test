import "#internal/nitro/virtual/polyfills";
import type { Context } from "socket:service-worker";
// @ts-ignore
import { isPublicAssetURL } from "#internal/nitro/virtual/public-assets";

import { nitroApp } from "nitropack/runtime/app";
import * as os from "socket:os";
// @ts-ignore
// export  { isPublicAssetURL } from "#internal/nitro/virtual/public-assets";

// export const nitroApp = useNitroApp();

export default {
  async fetch(request: Request, env = {}, ctx: Context) {
    ctx.data = "hello from service worker";
    const url = new URL(request.url);
    // const req = new Request(request)
    // const res = {
    //   request,
    //   env,
    //   ctx,
    //   os: os.platform(),
    // }
    // return new Response(JSON.stringify(res))
    // const url = new URL(request.url);
    if (isPublicAssetURL(url.pathname) || url.pathname.includes("/_server/")) {
      return;
    }

    let res = await handleEvent(url, request);
    console.log({res, url, env,ctx});
    return res
    // const platform = os.platform();
    // return new Response(nitroApp.h3App.options.debug + " " + platform);
  },
};


async function handleEvent(url: URL, request: Request) {
  let body = undefined;
  if (request.body) {
    body = await request.arrayBuffer();
  }

  return await nitroApp.localFetch(url.pathname + url.search, {
    host: url.hostname,
    protocol: url.protocol,
    headers: request.headers,
    method: request.method,
    redirect: 'follow',
    body,
  });
}
// import type { Context } from "socket:service-worker/context";
// import type {NitroApp} from "nitropack"

// class MyWorker {
//   nitroApp: NitroApp
//   constructor() {
//     this.nitroApp = useNitroApp();
//   }

//   async handleEvent(url: URL, event: any) {
//     let body;
//     if (event.request.body) {
//       body = await event.request.arrayBuffer();
//     }

//     return await this.nitroApp.localFetch(url.pathname + url.search, {
//       host: url.hostname,
//       protocol: url.protocol,
//       headers: event.request.headers,
//       method: event.request.method,
//       redirect: event.request.redirect,
//       body,
//     });
//   }

//   async handler (
//     request: Request,
//     env: Record<string, any>,
//     ctx: Context
//   ) {

//     return await this.handleEvent(new URL(request.url), ctx)
//   }

// }

// const main = new MyWorker()

// export default main.handler
