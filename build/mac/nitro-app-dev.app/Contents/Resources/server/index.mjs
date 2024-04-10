globalThis =  self || globalThis || global || {};globalThis._importMeta_={url:"file:///_entry.js",env:{}};(function (os) {
  'use strict';

  function _interopNamespaceDefault(e) {
    const n = Object.create(null, { [Symbol.toStringTag]: { value: 'Module' } });
    if (e) {
      for (const k in e) {
        if (k !== 'default') {
          const d = Object.getOwnPropertyDescriptor(e, k);
          Object.defineProperty(n, k, d.get ? d : {
            enumerable: true,
            get: function () { return e[k]; }
          });
        }
      }
    }
    n.default = e;
    return Object.freeze(n);
  }

  const os__namespace = /*#__PURE__*/_interopNamespaceDefault(os);

  const entry = {
    async fetch(request, env = {}, ctx) {
      const platform = os__namespace.platform();
      return new Response(platform);
    }
  };

  return entry;

})("socket:os");
//# sourceMappingURL=index.mjs.map
