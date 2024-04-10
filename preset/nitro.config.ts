import { existsSync, promises as fsp } from "node:fs";
import { resolve } from "pathe";
import { joinURL } from "ufo";
import type { Nitro } from "nitropack";
import type { NitroPreset } from "nitropack";
console.log('using nitro preset');

const scriptTemplate = (baseURL = "/") => `
<script>
async function register () {
  const registration = await navigator.serviceWorker.register('${joinURL(
    baseURL,
    "sw.js"
  )}')
  await navigator.serviceWorker.ready
  registration.active.addEventListener('statechange', (event) => {
    if (event.target.state === 'activated') {
      window.location.reload()
    }
  })
}
if ('serviceWorker' in navigator) {
  if (location.hostname !== 'localhost' && location.protocol === 'http:') {
    location.replace(location.href.replace('http://', 'https://'))
  } else {
    register()
  }
}
</script>
`;

const htmlTemplate = (baseURL = "/") => `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
    <meta
      http-equiv="Content-Security-Policy"
      content="
        connect-src socket: https: http: blob: ipc: wss: ws: ws://localhost:*;
         script-src socket: https: http: blob: http://localhost:* 'unsafe-eval' 'unsafe-inline';
         worker-src socket: https: http: blob: 'unsafe-eval' 'unsafe-inline';
          frame-src socket: https: http: blob: http://localhost:*;
            img-src socket: https: http: blob: http://localhost:*;
          child-src socket: https: http: blob:;
         object-src 'none';
      "
    >
  <script type="module">
    setInterval(async() => {
     const resp =  await navigator.serviceWorker.getRegistrations();
     const fetched = await fetch('/hello');
     console.log(resp);
     console.log(fetched);
    }, 2000)
  </script>
</head>
<body>
  Initializing nitro service worker...
</body>
</html>`;

export default <NitroPreset>{
  // replace: {
  //   "globalThis": "self"
  // },
  minify: false,
  extends: "service-worker",
  // replace:{
  //   "node:*": "socket:*"
  // },
  node: false,
  noExternals: true,
  exportConditions: ["socket", "socket:*"],
  entry: process.cwd() + "/preset/entry.ts",
  output: {
    serverDir: "{{ output.dir }}/public/server",
  },
  // commands: {
  //   preview: "npx serve ./public",
  // },
  esbuild:{
    'options':{
      'platform': 'browser',
    }
  },
  rollupConfig: {
    external: [/^socket:.*/],
    'output':{
      'globals':{
        'socket:os': 'socket:os',

      }
    }
    // 'preserveEntrySignatures': 'strict',
    // 'shimMissingExports': true,
  },
  wasm: {
    esmImport: true,
    lazy: false,
  },
  hooks: {
    "prerender:generate"(route, nitro) {
      console.log("prerender:generate", route);

      // route.contents = route.contents?.replace(
      //   "</head>",
      //   `${script}\n</head>`
      // );
    },
    async compiled(nitro: Nitro) {
      const dir = nitro.options.output.serverDir
      const fileContents = (await fsp.readFile(dir + "/index.mjs", "utf8"))
      const pre = `globalThis =  self || globalThis || global || {};` + fileContents
      // const pre = fileContents.replace(/globalThis/g, 'self')
      // .replace('globalThis._importMeta_={url:"file:///_entry.js",env:{}};', '').replace('globalThis._importMeta_={url:"file:///_entry.js",env:{}},function', 'function def')
      // console.log(file);
      await fsp.writeFile(dir + "/index.mjs", pre, "utf8");

      // await fsp.writeFile(resolve(nitro.options.output.publicDir, "/server/index.mjs"), output.replace('globalThis._importMeta_={url:"file:///_entry.js",env:{}};', ''), "utf8");
      // Write sw.js file
      // await fsp.writeFile(
      //   resolve(nitro.options.output.publicDir, "sw.js"),
      //   `self.importScripts('${joinURL(
      //     nitro.options.baseURL,
      //     "server/index.mjs"
      //   )}');`,
      //   "utf8"
      // );
      await fsp.writeFile(
        resolve(nitro.options.output.publicDir, "sw.js"),
        `onactivate = (event) => {
          globalThis.clients.claim()
        }
        
        oninstall = (event) => {
          globalThis.skipWaiting()
        }
        
        onfetch = (event) => {
          event.respondWith(fetch('/icon.png'))
        }`,
        "utf8"
      );

      // await fsp.writeFile(
      //   resolve(nitro.options.output.publicDir, "sw.js"),
      //   `import * as mod from "socket:module";

      //   const require = mod.createRequire(import.meta.url);
        
      //   const nitro = require("./server/index.mjs");
        
      //   export default (req, env, ctx) => {
      //       return new Response("Hello, World!")
      //   }`,
      //   "utf8"
      // );
      // Write fallback initializer files
      const html = htmlTemplate(nitro.options.baseURL);
      if (!existsSync(resolve(nitro.options.output.publicDir, "index.html"))) {
        await fsp.writeFile(
          resolve(nitro.options.output.publicDir, "index.html"),
          html,
          "utf8"
        );
      }
    },
  },
};
