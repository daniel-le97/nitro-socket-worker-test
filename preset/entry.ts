import "#internal/nitro/virtual/polyfills";
import type { Context } from "socket:service-worker";
// @ts-ignore
import { isPublicAssetURL } from "#internal/nitro/virtual/public-assets";

import { nitroApp } from "nitropack/runtime/app";
// import fetcher from "socket:fetch";
import os from "socket:os";
// import * as ok from "socket:process";
// @ts-ignore
// export  { isPublicAssetURL } from "#internal/nitro/virtual/public-assets";

// export const nitroApp = useNitroApp();
// globalThis.process = ok
export default {
  async fetch(request: Request, env = {}, ctx: Context) {
    ctx.data = os.uptime();
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
    // console.log(await res.text());
    
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

//  const res = await nitroApp.localCall({
//     url: url.pathname + url.search,
//     'headers': request.headers,
//     method: request.method,
//     'body': body,
//     'protocol': url.protocol,
//   })

//   return new Response(res.body, {
//     'headers': res.headers,
//     'status': res.status,
//     'statusText': res.statusText
//   })
  return await nitroApp.localFetch(url.pathname + url.search, {
    host: url.hostname,
    protocol: url.protocol,
    headers: request.headers,
    method: request.method,
    redirect: 'manual',
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
