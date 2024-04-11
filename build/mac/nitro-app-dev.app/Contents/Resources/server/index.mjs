globalThis =  globalThis || self || global || {};globalThis._importMeta_={url:"file:///_entry.js",env:{}};import * as os from 'socket:os';

const entry = {
  async fetch(request, env = {}, ctx) {
    const platform = os.platform();
    return new Response(platform);
  }
};

export { entry as default };
//# sourceMappingURL=index.mjs.map
