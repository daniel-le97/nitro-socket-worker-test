import { existsSync, promises as fsp } from "node:fs";
import { resolve } from "pathe";
import { joinURL } from "ufo";
import type { Nitro } from "nitropack";
import type { NitroPreset } from "nitropack";
console.log('using nitro preset');

const htmlTemplate = (baseURL = "/") => `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
  <script type="module">
  import fetcher from 'socket:fetch';
    setInterval(async() => {
    //  const reg =  await navigator.serviceWorker.getRegistrations();
     const fetched = await fetcher('/nitro/hello');
    //  console.log(reg);
     if(fetched.ok){
       const response = await fetched.text();
       console.log(response);
       document.getElementById('app').innerText = response;
     }
    }, 2500)
  </script>
</head>
<body>
    <div id="app">
    Initializing nitro service worker...
    </div>
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
  // unenv:{
  //   ''
  // }
  node: false,
  noExternals: true,
  exportConditions: ["socket"],
  entry: process.cwd() + "/preset/entry.ts",
  output: {
    serverDir: "{{ output.dir }}/public/server",
  },
  // commands: {
  //   preview: "npx serve ./public",
  // },
  // esbuild:{
  //   'options':{
  //     'platform': 'browser',
  //   }
  // },
  externals:[/^socket:.*/],
  rollupConfig: {
    external: [/^socket:.*/],
    'output':{
      'format': 'es'
      // 'globals':{
      //   'socket:os': 'socket:os',

      // }
    }
    // 'preserveEntrySignatures': 'strict',
    // 'shimMissingExports': true,
  },
  // wasm: {
  //   esmImport: true,
  //   lazy: false,
  // },
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
      let changedContents = `globalThis =  globalThis || self || global || {};` + fileContents
      changedContents = changedContents.replace('_global.process = _global.process || process$1;', '').replace('const process = _global.process;', 'const process = _global.process || process$1;')

      await fsp.writeFile(dir + "/index.mjs", changedContents, "utf8");

      await fsp.writeFile(
        resolve(nitro.options.output.publicDir, "sw.js"),
        `self.importScripts('${joinURL(
          nitro.options.baseURL,
          "server/index.mjs"
        )}');`,
        "utf8"
      );

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
