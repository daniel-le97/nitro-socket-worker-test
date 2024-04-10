import "#internal/nitro/virtual/polyfills";
import type { Context } from "socket:service-worker";
// import serviceWorker from "socket:service-worker";
import {nitroApp} from "nitropack/runtime/app"
import * as os from "socket:os"
// @ts-ignore
// export  { isPublicAssetURL } from "#internal/nitro/virtual/public-assets";

// export const nitroApp = useNitroApp();

export default {
  async fetch (request: Request, env = {}, ctx: Context) {

    const platform = os.platform()
    return new Response(platform);
  }
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