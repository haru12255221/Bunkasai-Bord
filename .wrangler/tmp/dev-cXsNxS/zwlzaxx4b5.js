var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// .wrangler/tmp/bundle-2rlCEs/checked-fetch.js
var urls = /* @__PURE__ */ new Set();
function checkURL(request, init) {
  const url = request instanceof URL ? request : new URL(
    (typeof request === "string" ? new Request(request, init) : request).url
  );
  if (url.port && url.port !== "443" && url.protocol === "https:") {
    if (!urls.has(url.toString())) {
      urls.add(url.toString());
      console.warn(
        `WARNING: known issue with \`fetch()\` requests to custom HTTPS ports in published Workers:
 - ${url.toString()} - the custom port will be ignored when the Worker is published using the \`wrangler deploy\` command.
`
      );
    }
  }
}
__name(checkURL, "checkURL");
globalThis.fetch = new Proxy(globalThis.fetch, {
  apply(target, thisArg, argArray) {
    const [request, init] = argArray;
    checkURL(request, init);
    return Reflect.apply(target, thisArg, argArray);
  }
});

// .wrangler/tmp/pages-zN1i4F/bundledWorker-0.4044258597897734.mjs
var __defProp2 = Object.defineProperty;
var __name2 = /* @__PURE__ */ __name((target, value) => __defProp2(target, "name", { value, configurable: true }), "__name");
import("node:buffer").then(({ Buffer: Buffer2 }) => {
  globalThis.Buffer = Buffer2;
}).catch(() => null);
var __ALSes_PROMISE__ = import("node:async_hooks").then(({ AsyncLocalStorage }) => {
  globalThis.AsyncLocalStorage = AsyncLocalStorage;
  const envAsyncLocalStorage = new AsyncLocalStorage();
  const requestContextAsyncLocalStorage = new AsyncLocalStorage();
  globalThis.process = {
    env: new Proxy(
      {},
      {
        ownKeys: /* @__PURE__ */ __name2(() => Reflect.ownKeys(envAsyncLocalStorage.getStore()), "ownKeys"),
        getOwnPropertyDescriptor: /* @__PURE__ */ __name2((_, ...args) => Reflect.getOwnPropertyDescriptor(envAsyncLocalStorage.getStore(), ...args), "getOwnPropertyDescriptor"),
        get: /* @__PURE__ */ __name2((_, property) => Reflect.get(envAsyncLocalStorage.getStore(), property), "get"),
        set: /* @__PURE__ */ __name2((_, property, value) => Reflect.set(envAsyncLocalStorage.getStore(), property, value), "set")
      }
    )
  };
  globalThis[Symbol.for("__cloudflare-request-context__")] = new Proxy(
    {},
    {
      ownKeys: /* @__PURE__ */ __name2(() => Reflect.ownKeys(requestContextAsyncLocalStorage.getStore()), "ownKeys"),
      getOwnPropertyDescriptor: /* @__PURE__ */ __name2((_, ...args) => Reflect.getOwnPropertyDescriptor(requestContextAsyncLocalStorage.getStore(), ...args), "getOwnPropertyDescriptor"),
      get: /* @__PURE__ */ __name2((_, property) => Reflect.get(requestContextAsyncLocalStorage.getStore(), property), "get"),
      set: /* @__PURE__ */ __name2((_, property, value) => Reflect.set(requestContextAsyncLocalStorage.getStore(), property, value), "set")
    }
  );
  return { envAsyncLocalStorage, requestContextAsyncLocalStorage };
}).catch(() => null);
var re = Object.create;
var U = Object.defineProperty;
var ae = Object.getOwnPropertyDescriptor;
var ne = Object.getOwnPropertyNames;
var ie = Object.getPrototypeOf;
var oe = Object.prototype.hasOwnProperty;
var N = /* @__PURE__ */ __name2((e, t) => () => (e && (t = e(e = 0)), t), "N");
var V = /* @__PURE__ */ __name2((e, t) => () => (t || e((t = { exports: {} }).exports, t), t.exports), "V");
var ce = /* @__PURE__ */ __name2((e, t, r, s) => {
  if (t && typeof t == "object" || typeof t == "function") for (let n of ne(t)) !oe.call(e, n) && n !== r && U(e, n, { get: /* @__PURE__ */ __name2(() => t[n], "get"), enumerable: !(s = ae(t, n)) || s.enumerable });
  return e;
}, "ce");
var $ = /* @__PURE__ */ __name2((e, t, r) => (r = e != null ? re(ie(e)) : {}, ce(t || !e || !e.__esModule ? U(r, "default", { value: e, enumerable: true }) : r, e)), "$");
var g;
var u = N(() => {
  g = { collectedLocales: [] };
});
var f;
var l = N(() => {
  f = { version: 3, routes: { none: [{ src: "^(?:/((?:[^/]+?)(?:/(?:[^/]+?))*))/$", headers: { Location: "/$1" }, status: 308, continue: true }, { src: "^/_next/__private/trace$", dest: "/404", status: 404, continue: true }, { src: "^/404/?$", status: 404, continue: true, missing: [{ type: "header", key: "x-prerender-revalidate" }] }, { src: "^/500$", status: 500, continue: true }, { src: "^/?$", has: [{ type: "header", key: "rsc" }], dest: "/index.rsc", headers: { vary: "RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch" }, continue: true, override: true }, { src: "^/((?!.+\\.rsc).+?)(?:/)?$", has: [{ type: "header", key: "rsc" }], dest: "/$1.rsc", headers: { vary: "RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch" }, continue: true, override: true }], filesystem: [{ src: "^/index(\\.action|\\.rsc)$", dest: "/", continue: true }, { src: "^/_next/data/(.*)$", dest: "/_next/data/$1", check: true }, { src: "^/\\.prefetch\\.rsc$", dest: "/__index.prefetch.rsc", check: true }, { src: "^/(.+)/\\.prefetch\\.rsc$", dest: "/$1.prefetch.rsc", check: true }, { src: "^/\\.rsc$", dest: "/index.rsc", check: true }, { src: "^/(.+)/\\.rsc$", dest: "/$1.rsc", check: true }], miss: [{ src: "^/_next/static/(?:[^/]+/pages|pages|chunks|runtime|css|image|media)/.+$", status: 404, check: true, dest: "$0" }], rewrite: [{ src: "^/_next/data/(.*)$", dest: "/404", status: 404 }], resource: [{ src: "^/.*$", status: 404 }], hit: [{ src: "^/_next/static/(?:[^/]+/pages|pages|chunks|runtime|css|image|media|3ncHuAey88_kB16BRZKZe)/.+$", headers: { "cache-control": "public,max-age=31536000,immutable" }, continue: true, important: true }, { src: "^/index(?:/)?$", headers: { "x-matched-path": "/" }, continue: true, important: true }, { src: "^/((?!index$).*?)(?:/)?$", headers: { "x-matched-path": "/$1" }, continue: true, important: true }], error: [{ src: "^/.*$", dest: "/404", status: 404 }, { src: "^/.*$", dest: "/500", status: 500 }] }, images: { domains: [], sizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840, 16, 32, 48, 64, 96, 128, 256, 384], remotePatterns: [], minimumCacheTTL: 60, formats: ["image/webp"], dangerouslyAllowSVG: false, contentSecurityPolicy: "script-src 'none'; frame-src 'none'; sandbox;", contentDispositionType: "attachment" }, overrides: { "404.html": { path: "404", contentType: "text/html; charset=utf-8" }, "500.html": { path: "500", contentType: "text/html; charset=utf-8" }, "_app.rsc.json": { path: "_app.rsc", contentType: "application/json" }, "_error.rsc.json": { path: "_error.rsc", contentType: "application/json" }, "_document.rsc.json": { path: "_document.rsc", contentType: "application/json" }, "404.rsc.json": { path: "404.rsc", contentType: "application/json" } }, framework: { version: "15.3.5" }, crons: [] };
});
var m;
var h = N(() => {
  m = { "/404.html": { type: "override", path: "/404.html", headers: { "content-type": "text/html; charset=utf-8" } }, "/404.rsc.json": { type: "override", path: "/404.rsc.json", headers: { "content-type": "application/json" } }, "/500.html": { type: "override", path: "/500.html", headers: { "content-type": "text/html; charset=utf-8" } }, "/_app.rsc.json": { type: "override", path: "/_app.rsc.json", headers: { "content-type": "application/json" } }, "/_document.rsc.json": { type: "override", path: "/_document.rsc.json", headers: { "content-type": "application/json" } }, "/_error.rsc.json": { type: "override", path: "/_error.rsc.json", headers: { "content-type": "application/json" } }, "/_next/static/3ncHuAey88_kB16BRZKZe/_buildManifest.js": { type: "static" }, "/_next/static/3ncHuAey88_kB16BRZKZe/_ssgManifest.js": { type: "static" }, "/_next/static/chunks/4bd1b696-52a6696c08e3276c.js": { type: "static" }, "/_next/static/chunks/684-d252a3b20a10e7f9.js": { type: "static" }, "/_next/static/chunks/app/_not-found/page-5bfe245ad955586d.js": { type: "static" }, "/_next/static/chunks/app/api/posts/route-dfe475b923acbb5d.js": { type: "static" }, "/_next/static/chunks/app/layout-61cf67fb5332a213.js": { type: "static" }, "/_next/static/chunks/app/page-706f12ea4aeae27e.js": { type: "static" }, "/_next/static/chunks/framework-f593a28cde54158e.js": { type: "static" }, "/_next/static/chunks/main-app-fb3bc51c2aeeeabd.js": { type: "static" }, "/_next/static/chunks/main-c09f9dcdf4e52331.js": { type: "static" }, "/_next/static/chunks/pages/_app-da15c11dea942c36.js": { type: "static" }, "/_next/static/chunks/pages/_error-cc3f077a18ea1793.js": { type: "static" }, "/_next/static/chunks/polyfills-42372ed130431b0a.js": { type: "static" }, "/_next/static/chunks/webpack-f029a09104d09cbc.js": { type: "static" }, "/_next/static/css/a1b3be4f6e34910d.css": { type: "static" }, "/_next/static/media/569ce4b8f30dc480-s.p.woff2": { type: "static" }, "/_next/static/media/747892c23ea88013-s.woff2": { type: "static" }, "/_next/static/media/8d697b304b401681-s.woff2": { type: "static" }, "/_next/static/media/93f479601ee12b01-s.p.woff2": { type: "static" }, "/_next/static/media/9610d9e46709d722-s.woff2": { type: "static" }, "/_next/static/media/ba015fad6dcf6784-s.woff2": { type: "static" }, "/file.svg": { type: "static" }, "/globe.svg": { type: "static" }, "/next.svg": { type: "static" }, "/vercel.svg": { type: "static" }, "/window.svg": { type: "static" }, "/api/posts": { type: "function", entrypoint: "__next-on-pages-dist__/functions/api/posts.func.js" }, "/api/posts.rsc": { type: "function", entrypoint: "__next-on-pages-dist__/functions/api/posts.func.js" }, "/404": { type: "override", path: "/404.html", headers: { "content-type": "text/html; charset=utf-8" } }, "/500": { type: "override", path: "/500.html", headers: { "content-type": "text/html; charset=utf-8" } }, "/_app.rsc": { type: "override", path: "/_app.rsc.json", headers: { "content-type": "application/json" } }, "/_error.rsc": { type: "override", path: "/_error.rsc.json", headers: { "content-type": "application/json" } }, "/_document.rsc": { type: "override", path: "/_document.rsc.json", headers: { "content-type": "application/json" } }, "/404.rsc": { type: "override", path: "/404.rsc.json", headers: { "content-type": "application/json" } }, "/favicon.ico": { type: "override", path: "/favicon.ico", headers: { "cache-control": "public, max-age=0, must-revalidate", "content-type": "image/x-icon", "x-next-cache-tags": "_N_T_/layout,_N_T_/favicon.ico/layout,_N_T_/favicon.ico/route,_N_T_/favicon.ico", vary: "RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch" } }, "/index.html": { type: "override", path: "/index.html", headers: { "x-nextjs-stale-time": "300", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/page,_N_T_/", vary: "RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch" } }, "/index": { type: "override", path: "/index.html", headers: { "x-nextjs-stale-time": "300", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/page,_N_T_/", vary: "RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch" } }, "/": { type: "override", path: "/index.html", headers: { "x-nextjs-stale-time": "300", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/page,_N_T_/", vary: "RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch" } }, "/index.rsc": { type: "override", path: "/index.rsc", headers: { "x-nextjs-stale-time": "300", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/page,_N_T_/", vary: "RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch", "content-type": "text/x-component" } } };
});
var q = V((ze, F) => {
  "use strict";
  u();
  l();
  h();
  function w(e, t) {
    e = String(e || "").trim();
    let r = e, s, n = "";
    if (/^[^a-zA-Z\\\s]/.test(e)) {
      s = e[0];
      let o = e.lastIndexOf(s);
      n += e.substring(o + 1), e = e.substring(1, o);
    }
    let a = 0;
    return e = he(e, (o) => {
      if (/^\(\?[P<']/.test(o)) {
        let c = /^\(\?P?[<']([^>']+)[>']/.exec(o);
        if (!c) throw new Error(`Failed to extract named captures from ${JSON.stringify(o)}`);
        let d = o.substring(c[0].length, o.length - 1);
        return t && (t[a] = c[1]), a++, `(${d})`;
      }
      return o.substring(0, 3) === "(?:" || a++, o;
    }), e = e.replace(/\[:([^:]+):\]/g, (o, c) => w.characterClasses[c] || o), new w.PCRE(e, n, r, n, s);
  }
  __name(w, "w");
  __name2(w, "w");
  function he(e, t) {
    let r = 0, s = 0, n = false;
    for (let i = 0; i < e.length; i++) {
      let a = e[i];
      if (n) {
        n = false;
        continue;
      }
      switch (a) {
        case "(":
          s === 0 && (r = i), s++;
          break;
        case ")":
          if (s > 0 && (s--, s === 0)) {
            let o = i + 1, c = r === 0 ? "" : e.substring(0, r), d = e.substring(o), p = String(t(e.substring(r, o)));
            e = c + p + d, i = r;
          }
          break;
        case "\\":
          n = true;
          break;
        default:
          break;
      }
    }
    return e;
  }
  __name(he, "he");
  __name2(he, "he");
  (function(e) {
    class t extends RegExp {
      static {
        __name(this, "t");
      }
      static {
        __name2(this, "t");
      }
      constructor(s, n, i, a, o) {
        super(s, n), this.pcrePattern = i, this.pcreFlags = a, this.delimiter = o;
      }
    }
    e.PCRE = t, e.characterClasses = { alnum: "[A-Za-z0-9]", word: "[A-Za-z0-9_]", alpha: "[A-Za-z]", blank: "[ \\t]", cntrl: "[\\x00-\\x1F\\x7F]", digit: "\\d", graph: "[\\x21-\\x7E]", lower: "[a-z]", print: "[\\x20-\\x7E]", punct: "[\\]\\[!\"#$%&'()*+,./:;<=>?@\\\\^_`{|}~-]", space: "\\s", upper: "[A-Z]", xdigit: "[A-Fa-f0-9]" };
  })(w || (w = {}));
  w.prototype = w.PCRE.prototype;
  F.exports = w;
});
var Q = V((H) => {
  "use strict";
  u();
  l();
  h();
  H.parse = be;
  H.serialize = ve;
  var Pe = Object.prototype.toString, T = /^[\u0009\u0020-\u007e\u0080-\u00ff]+$/;
  function be(e, t) {
    if (typeof e != "string") throw new TypeError("argument str must be a string");
    for (var r = {}, s = t || {}, n = s.decode || Se, i = 0; i < e.length; ) {
      var a = e.indexOf("=", i);
      if (a === -1) break;
      var o = e.indexOf(";", i);
      if (o === -1) o = e.length;
      else if (o < a) {
        i = e.lastIndexOf(";", a - 1) + 1;
        continue;
      }
      var c = e.slice(i, a).trim();
      if (r[c] === void 0) {
        var d = e.slice(a + 1, o).trim();
        d.charCodeAt(0) === 34 && (d = d.slice(1, -1)), r[c] = Ee(d, n);
      }
      i = o + 1;
    }
    return r;
  }
  __name(be, "be");
  __name2(be, "be");
  function ve(e, t, r) {
    var s = r || {}, n = s.encode || Ce;
    if (typeof n != "function") throw new TypeError("option encode is invalid");
    if (!T.test(e)) throw new TypeError("argument name is invalid");
    var i = n(t);
    if (i && !T.test(i)) throw new TypeError("argument val is invalid");
    var a = e + "=" + i;
    if (s.maxAge != null) {
      var o = s.maxAge - 0;
      if (isNaN(o) || !isFinite(o)) throw new TypeError("option maxAge is invalid");
      a += "; Max-Age=" + Math.floor(o);
    }
    if (s.domain) {
      if (!T.test(s.domain)) throw new TypeError("option domain is invalid");
      a += "; Domain=" + s.domain;
    }
    if (s.path) {
      if (!T.test(s.path)) throw new TypeError("option path is invalid");
      a += "; Path=" + s.path;
    }
    if (s.expires) {
      var c = s.expires;
      if (!ke(c) || isNaN(c.valueOf())) throw new TypeError("option expires is invalid");
      a += "; Expires=" + c.toUTCString();
    }
    if (s.httpOnly && (a += "; HttpOnly"), s.secure && (a += "; Secure"), s.priority) {
      var d = typeof s.priority == "string" ? s.priority.toLowerCase() : s.priority;
      switch (d) {
        case "low":
          a += "; Priority=Low";
          break;
        case "medium":
          a += "; Priority=Medium";
          break;
        case "high":
          a += "; Priority=High";
          break;
        default:
          throw new TypeError("option priority is invalid");
      }
    }
    if (s.sameSite) {
      var p = typeof s.sameSite == "string" ? s.sameSite.toLowerCase() : s.sameSite;
      switch (p) {
        case true:
          a += "; SameSite=Strict";
          break;
        case "lax":
          a += "; SameSite=Lax";
          break;
        case "strict":
          a += "; SameSite=Strict";
          break;
        case "none":
          a += "; SameSite=None";
          break;
        default:
          throw new TypeError("option sameSite is invalid");
      }
    }
    return a;
  }
  __name(ve, "ve");
  __name2(ve, "ve");
  function Se(e) {
    return e.indexOf("%") !== -1 ? decodeURIComponent(e) : e;
  }
  __name(Se, "Se");
  __name2(Se, "Se");
  function Ce(e) {
    return encodeURIComponent(e);
  }
  __name(Ce, "Ce");
  __name2(Ce, "Ce");
  function ke(e) {
    return Pe.call(e) === "[object Date]" || e instanceof Date;
  }
  __name(ke, "ke");
  __name2(ke, "ke");
  function Ee(e, t) {
    try {
      return t(e);
    } catch {
      return e;
    }
  }
  __name(Ee, "Ee");
  __name2(Ee, "Ee");
});
u();
l();
h();
u();
l();
h();
u();
l();
h();
var P = "INTERNAL_SUSPENSE_CACHE_HOSTNAME.local";
u();
l();
h();
u();
l();
h();
u();
l();
h();
u();
l();
h();
var D = $(q());
function C(e, t, r) {
  if (t == null) return { match: null, captureGroupKeys: [] };
  let s = r ? "" : "i", n = [];
  return { match: (0, D.default)(`%${e}%${s}`, n).exec(t), captureGroupKeys: n };
}
__name(C, "C");
__name2(C, "C");
function b(e, t, r, { namedOnly: s } = {}) {
  return e.replace(/\$([a-zA-Z0-9_]+)/g, (n, i) => {
    let a = r.indexOf(i);
    return s && a === -1 ? n : (a === -1 ? t[parseInt(i, 10)] : t[a + 1]) || "";
  });
}
__name(b, "b");
__name2(b, "b");
function A(e, { url: t, cookies: r, headers: s, routeDest: n }) {
  switch (e.type) {
    case "host":
      return { valid: t.hostname === e.value };
    case "header":
      return e.value !== void 0 ? I(e.value, s.get(e.key), n) : { valid: s.has(e.key) };
    case "cookie": {
      let i = r[e.key];
      return i && e.value !== void 0 ? I(e.value, i, n) : { valid: i !== void 0 };
    }
    case "query":
      return e.value !== void 0 ? I(e.value, t.searchParams.get(e.key), n) : { valid: t.searchParams.has(e.key) };
  }
}
__name(A, "A");
__name2(A, "A");
function I(e, t, r) {
  let { match: s, captureGroupKeys: n } = C(e, t);
  return r && s && n.length ? { valid: !!s, newRouteDest: b(r, s, n, { namedOnly: true }) } : { valid: !!s };
}
__name(I, "I");
__name2(I, "I");
u();
l();
h();
function B(e) {
  let t = new Headers(e.headers);
  return e.cf && (t.set("x-vercel-ip-city", encodeURIComponent(e.cf.city)), t.set("x-vercel-ip-country", e.cf.country), t.set("x-vercel-ip-country-region", e.cf.regionCode), t.set("x-vercel-ip-latitude", e.cf.latitude), t.set("x-vercel-ip-longitude", e.cf.longitude)), t.set("x-vercel-sc-host", P), new Request(e, { headers: t });
}
__name(B, "B");
__name2(B, "B");
u();
l();
h();
function x(e, t, r) {
  let s = t instanceof Headers ? t.entries() : Object.entries(t);
  for (let [n, i] of s) {
    let a = n.toLowerCase(), o = r?.match ? b(i, r.match, r.captureGroupKeys) : i;
    a === "set-cookie" ? e.append(a, o) : e.set(a, o);
  }
}
__name(x, "x");
__name2(x, "x");
function v(e) {
  return /^https?:\/\//.test(e);
}
__name(v, "v");
__name2(v, "v");
function R(e, t) {
  for (let [r, s] of t.entries()) {
    let n = /^nxtP(.+)$/.exec(r), i = /^nxtI(.+)$/.exec(r);
    n?.[1] ? (e.set(r, s), e.set(n[1], s)) : i?.[1] ? e.set(i[1], s.replace(/(\(\.+\))+/, "")) : (!e.has(r) || !!s && !e.getAll(r).includes(s)) && e.append(r, s);
  }
}
__name(R, "R");
__name2(R, "R");
function L(e, t) {
  let r = new URL(t, e.url);
  return R(r.searchParams, new URL(e.url).searchParams), r.pathname = r.pathname.replace(/\/index.html$/, "/").replace(/\.html$/, ""), new Request(r, e);
}
__name(L, "L");
__name2(L, "L");
function S(e) {
  return new Response(e.body, e);
}
__name(S, "S");
__name2(S, "S");
function O(e) {
  return e.split(",").map((t) => {
    let [r, s] = t.split(";"), n = parseFloat((s ?? "q=1").replace(/q *= */gi, ""));
    return [r.trim(), isNaN(n) ? 1 : n];
  }).sort((t, r) => r[1] - t[1]).map(([t]) => t === "*" || t === "" ? [] : t).flat();
}
__name(O, "O");
__name2(O, "O");
u();
l();
h();
function j(e) {
  switch (e) {
    case "none":
      return "filesystem";
    case "filesystem":
      return "rewrite";
    case "rewrite":
      return "resource";
    case "resource":
      return "miss";
    default:
      return "miss";
  }
}
__name(j, "j");
__name2(j, "j");
async function k(e, { request: t, assetsFetcher: r, ctx: s }, { path: n, searchParams: i }) {
  let a, o = new URL(t.url);
  R(o.searchParams, i);
  let c = new Request(o, t);
  try {
    switch (e?.type) {
      case "function":
      case "middleware": {
        let d = await import(e.entrypoint);
        try {
          a = await d.default(c, s);
        } catch (p) {
          let y = p;
          throw y.name === "TypeError" && y.message.endsWith("default is not a function") ? new Error(`An error occurred while evaluating the target edge function (${e.entrypoint})`) : p;
        }
        break;
      }
      case "override": {
        a = S(await r.fetch(L(c, e.path ?? n))), e.headers && x(a.headers, e.headers);
        break;
      }
      case "static": {
        a = await r.fetch(L(c, n));
        break;
      }
      default:
        a = new Response("Not Found", { status: 404 });
    }
  } catch (d) {
    return console.error(d), new Response("Internal Server Error", { status: 500 });
  }
  return S(a);
}
__name(k, "k");
__name2(k, "k");
function G(e, t) {
  let r = "^//?(?:", s = ")/(.*)$";
  return !e.startsWith(r) || !e.endsWith(s) ? false : e.slice(r.length, -s.length).split("|").every((i) => t.has(i));
}
__name(G, "G");
__name2(G, "G");
u();
l();
h();
function de(e, { protocol: t, hostname: r, port: s, pathname: n }) {
  return !(t && e.protocol.replace(/:$/, "") !== t || !new RegExp(r).test(e.hostname) || s && !new RegExp(s).test(e.port) || n && !new RegExp(n).test(e.pathname));
}
__name(de, "de");
__name2(de, "de");
function pe(e, t) {
  if (e.method !== "GET") return;
  let { origin: r, searchParams: s } = new URL(e.url), n = s.get("url"), i = Number.parseInt(s.get("w") ?? "", 10), a = Number.parseInt(s.get("q") ?? "75", 10);
  if (!n || Number.isNaN(i) || Number.isNaN(a) || !t?.sizes?.includes(i) || a < 0 || a > 100) return;
  let o = new URL(n, r);
  if (o.pathname.endsWith(".svg") && !t?.dangerouslyAllowSVG) return;
  let c = n.startsWith("//"), d = n.startsWith("/") && !c;
  if (!d && !t?.domains?.includes(o.hostname) && !t?.remotePatterns?.find((_) => de(o, _))) return;
  let p = e.headers.get("Accept") ?? "", y = t?.formats?.find((_) => p.includes(_))?.replace("image/", "");
  return { isRelative: d, imageUrl: o, options: { width: i, quality: a, format: y } };
}
__name(pe, "pe");
__name2(pe, "pe");
function fe(e, t, r) {
  let s = new Headers();
  if (r?.contentSecurityPolicy && s.set("Content-Security-Policy", r.contentSecurityPolicy), r?.contentDispositionType) {
    let i = t.pathname.split("/").pop(), a = i ? `${r.contentDispositionType}; filename="${i}"` : r.contentDispositionType;
    s.set("Content-Disposition", a);
  }
  e.headers.has("Cache-Control") || s.set("Cache-Control", `public, max-age=${r?.minimumCacheTTL ?? 60}`);
  let n = S(e);
  return x(n.headers, s), n;
}
__name(fe, "fe");
__name2(fe, "fe");
async function K(e, { buildOutput: t, assetsFetcher: r, imagesConfig: s }) {
  let n = pe(e, s);
  if (!n) return new Response("Invalid image resizing request", { status: 400 });
  let { isRelative: i, imageUrl: a } = n, c = await (i && a.pathname in t ? r.fetch.bind(r) : fetch)(a);
  return fe(c, a, s);
}
__name(K, "K");
__name2(K, "K");
u();
l();
h();
u();
l();
h();
u();
l();
h();
async function E(e) {
  return import(e);
}
__name(E, "E");
__name2(E, "E");
var me = "x-vercel-cache-tags";
var ge = "x-next-cache-soft-tags";
var ye = Symbol.for("__cloudflare-request-context__");
async function Z(e) {
  let t = `https://${P}/v1/suspense-cache/`;
  if (!e.url.startsWith(t)) return null;
  try {
    let r = new URL(e.url), s = await xe();
    if (r.pathname === "/v1/suspense-cache/revalidate") {
      let i = r.searchParams.get("tags")?.split(",") ?? [];
      for (let a of i) await s.revalidateTag(a);
      return new Response(null, { status: 200 });
    }
    let n = r.pathname.replace("/v1/suspense-cache/", "");
    if (!n.length) return new Response("Invalid cache key", { status: 400 });
    switch (e.method) {
      case "GET": {
        let i = z(e, ge), a = await s.get(n, { softTags: i });
        return a ? new Response(JSON.stringify(a.value), { status: 200, headers: { "Content-Type": "application/json", "x-vercel-cache-state": "fresh", age: `${(Date.now() - (a.lastModified ?? Date.now())) / 1e3}` } }) : new Response(null, { status: 404 });
      }
      case "POST": {
        let i = globalThis[ye], a = /* @__PURE__ */ __name2(async () => {
          let o = await e.json();
          o.data.tags === void 0 && (o.tags ??= z(e, me) ?? []), await s.set(n, o);
        }, "a");
        return i ? i.ctx.waitUntil(a()) : await a(), new Response(null, { status: 200 });
      }
      default:
        return new Response(null, { status: 405 });
    }
  } catch (r) {
    return console.error(r), new Response("Error handling cache request", { status: 500 });
  }
}
__name(Z, "Z");
__name2(Z, "Z");
async function xe() {
  return process.env.__NEXT_ON_PAGES__KV_SUSPENSE_CACHE ? W("kv") : W("cache-api");
}
__name(xe, "xe");
__name2(xe, "xe");
async function W(e) {
  let t = `./__next-on-pages-dist__/cache/${e}.js`, r = await E(t);
  return new r.default();
}
__name(W, "W");
__name2(W, "W");
function z(e, t) {
  return e.headers.get(t)?.split(",")?.filter(Boolean);
}
__name(z, "z");
__name2(z, "z");
function X() {
  globalThis[J] || (Re(), globalThis[J] = true);
}
__name(X, "X");
__name2(X, "X");
function Re() {
  let e = globalThis.fetch;
  globalThis.fetch = async (...t) => {
    let r = new Request(...t), s = await we(r);
    return s || (s = await Z(r), s) ? s : (_e(r), e(r));
  };
}
__name(Re, "Re");
__name2(Re, "Re");
async function we(e) {
  if (e.url.startsWith("blob:")) try {
    let r = `./__next-on-pages-dist__/assets/${new URL(e.url).pathname}.bin`, s = (await E(r)).default, n = { async arrayBuffer() {
      return s;
    }, get body() {
      return new ReadableStream({ start(i) {
        let a = Buffer.from(s);
        i.enqueue(a), i.close();
      } });
    }, async text() {
      return Buffer.from(s).toString();
    }, async json() {
      let i = Buffer.from(s);
      return JSON.stringify(i.toString());
    }, async blob() {
      return new Blob(s);
    } };
    return n.clone = () => ({ ...n }), n;
  } catch {
  }
  return null;
}
__name(we, "we");
__name2(we, "we");
function _e(e) {
  e.headers.has("user-agent") || e.headers.set("user-agent", "Next.js Middleware");
}
__name(_e, "_e");
__name2(_e, "_e");
var J = Symbol.for("next-on-pages fetch patch");
u();
l();
h();
var Y = $(Q());
var M = class {
  static {
    __name(this, "M");
  }
  static {
    __name2(this, "M");
  }
  constructor(t, r, s, n, i) {
    this.routes = t;
    this.output = r;
    this.reqCtx = s;
    this.url = new URL(s.request.url), this.cookies = (0, Y.parse)(s.request.headers.get("cookie") || ""), this.path = this.url.pathname || "/", this.headers = { normal: new Headers(), important: new Headers() }, this.searchParams = new URLSearchParams(), R(this.searchParams, this.url.searchParams), this.checkPhaseCounter = 0, this.middlewareInvoked = [], this.wildcardMatch = i?.find((a) => a.domain === this.url.hostname), this.locales = new Set(n.collectedLocales);
  }
  url;
  cookies;
  wildcardMatch;
  path;
  status;
  headers;
  searchParams;
  body;
  checkPhaseCounter;
  middlewareInvoked;
  locales;
  checkRouteMatch(t, { checkStatus: r, checkIntercept: s }) {
    let n = C(t.src, this.path, t.caseSensitive);
    if (!n.match || t.methods && !t.methods.map((a) => a.toUpperCase()).includes(this.reqCtx.request.method.toUpperCase())) return;
    let i = { url: this.url, cookies: this.cookies, headers: this.reqCtx.request.headers, routeDest: t.dest };
    if (!t.has?.find((a) => {
      let o = A(a, i);
      return o.newRouteDest && (i.routeDest = o.newRouteDest), !o.valid;
    }) && !t.missing?.find((a) => A(a, i).valid) && !(r && t.status !== this.status)) {
      if (s && t.dest) {
        let a = /\/(\(\.+\))+/, o = a.test(t.dest), c = a.test(this.path);
        if (o && !c) return;
      }
      return { routeMatch: n, routeDest: i.routeDest };
    }
  }
  processMiddlewareResp(t) {
    let r = "x-middleware-override-headers", s = t.headers.get(r);
    if (s) {
      let c = new Set(s.split(",").map((d) => d.trim()));
      for (let d of c.keys()) {
        let p = `x-middleware-request-${d}`, y = t.headers.get(p);
        this.reqCtx.request.headers.get(d) !== y && (y ? this.reqCtx.request.headers.set(d, y) : this.reqCtx.request.headers.delete(d)), t.headers.delete(p);
      }
      t.headers.delete(r);
    }
    let n = "x-middleware-rewrite", i = t.headers.get(n);
    if (i) {
      let c = new URL(i, this.url), d = this.url.hostname !== c.hostname;
      this.path = d ? `${c}` : c.pathname, R(this.searchParams, c.searchParams), t.headers.delete(n);
    }
    let a = "x-middleware-next";
    t.headers.get(a) ? t.headers.delete(a) : !i && !t.headers.has("location") ? (this.body = t.body, this.status = t.status) : t.headers.has("location") && t.status >= 300 && t.status < 400 && (this.status = t.status), x(this.reqCtx.request.headers, t.headers), x(this.headers.normal, t.headers), this.headers.middlewareLocation = t.headers.get("location");
  }
  async runRouteMiddleware(t) {
    if (!t) return true;
    let r = t && this.output[t];
    if (!r || r.type !== "middleware") return this.status = 500, false;
    let s = await k(r, this.reqCtx, { path: this.path, searchParams: this.searchParams, headers: this.headers, status: this.status });
    return this.middlewareInvoked.push(t), s.status === 500 ? (this.status = s.status, false) : (this.processMiddlewareResp(s), true);
  }
  applyRouteOverrides(t) {
    !t.override || (this.status = void 0, this.headers.normal = new Headers(), this.headers.important = new Headers());
  }
  applyRouteHeaders(t, r, s) {
    !t.headers || (x(this.headers.normal, t.headers, { match: r, captureGroupKeys: s }), t.important && x(this.headers.important, t.headers, { match: r, captureGroupKeys: s }));
  }
  applyRouteStatus(t) {
    !t.status || (this.status = t.status);
  }
  applyRouteDest(t, r, s) {
    if (!t.dest) return this.path;
    let n = this.path, i = t.dest;
    this.wildcardMatch && /\$wildcard/.test(i) && (i = i.replace(/\$wildcard/g, this.wildcardMatch.value)), this.path = b(i, r, s);
    let a = /\/index\.rsc$/i.test(this.path), o = /^\/(?:index)?$/i.test(n), c = /^\/__index\.prefetch\.rsc$/i.test(n);
    a && !o && !c && (this.path = n);
    let d = /\.rsc$/i.test(this.path), p = /\.prefetch\.rsc$/i.test(this.path), y = this.path in this.output;
    d && !p && !y && (this.path = this.path.replace(/\.rsc/i, ""));
    let _ = new URL(this.path, this.url);
    return R(this.searchParams, _.searchParams), v(this.path) || (this.path = _.pathname), n;
  }
  applyLocaleRedirects(t) {
    if (!t.locale?.redirect || !/^\^(.)*$/.test(t.src) && t.src !== this.path || this.headers.normal.has("location")) return;
    let { locale: { redirect: s, cookie: n } } = t, i = n && this.cookies[n], a = O(i ?? ""), o = O(this.reqCtx.request.headers.get("accept-language") ?? ""), p = [...a, ...o].map((y) => s[y]).filter(Boolean)[0];
    if (p) {
      !this.path.startsWith(p) && (this.headers.normal.set("location", p), this.status = 307);
      return;
    }
  }
  getLocaleFriendlyRoute(t, r) {
    return !this.locales || r !== "miss" ? t : G(t.src, this.locales) ? { ...t, src: t.src.replace(/\/\(\.\*\)\$$/, "(?:/(.*))?$") } : t;
  }
  async checkRoute(t, r) {
    let s = this.getLocaleFriendlyRoute(r, t), { routeMatch: n, routeDest: i } = this.checkRouteMatch(s, { checkStatus: t === "error", checkIntercept: t === "rewrite" }) ?? {}, a = { ...s, dest: i };
    if (!n?.match || a.middlewarePath && this.middlewareInvoked.includes(a.middlewarePath)) return "skip";
    let { match: o, captureGroupKeys: c } = n;
    if (this.applyRouteOverrides(a), this.applyLocaleRedirects(a), !await this.runRouteMiddleware(a.middlewarePath)) return "error";
    if (this.body !== void 0 || this.headers.middlewareLocation) return "done";
    this.applyRouteHeaders(a, o, c), this.applyRouteStatus(a);
    let p = this.applyRouteDest(a, o, c);
    if (a.check && !v(this.path)) if (p === this.path) {
      if (t !== "miss") return this.checkPhase(j(t));
      this.status = 404;
    } else if (t === "miss") {
      if (!(this.path in this.output) && !(this.path.replace(/\/$/, "") in this.output)) return this.checkPhase("filesystem");
      this.status === 404 && (this.status = void 0);
    } else return this.checkPhase("none");
    return !a.continue || a.status && a.status >= 300 && a.status <= 399 ? "done" : "next";
  }
  async checkPhase(t) {
    if (this.checkPhaseCounter++ >= 50) return console.error(`Routing encountered an infinite loop while checking ${this.url.pathname}`), this.status = 500, "error";
    this.middlewareInvoked = [];
    let r = true;
    for (let i of this.routes[t]) {
      let a = await this.checkRoute(t, i);
      if (a === "error") return "error";
      if (a === "done") {
        r = false;
        break;
      }
    }
    if (t === "hit" || v(this.path) || this.headers.normal.has("location") || !!this.body) return "done";
    if (t === "none") for (let i of this.locales) {
      let a = new RegExp(`/${i}(/.*)`), c = this.path.match(a)?.[1];
      if (c && c in this.output) {
        this.path = c;
        break;
      }
    }
    let s = this.path in this.output;
    if (!s && this.path.endsWith("/")) {
      let i = this.path.replace(/\/$/, "");
      s = i in this.output, s && (this.path = i);
    }
    if (t === "miss" && !s) {
      let i = !this.status || this.status < 400;
      this.status = i ? 404 : this.status;
    }
    let n = "miss";
    return s || t === "miss" || t === "error" ? n = "hit" : r && (n = j(t)), this.checkPhase(n);
  }
  async run(t = "none") {
    this.checkPhaseCounter = 0;
    let r = await this.checkPhase(t);
    return this.headers.normal.has("location") && (!this.status || this.status < 300 || this.status >= 400) && (this.status = 307), r;
  }
};
async function ee(e, t, r, s) {
  let n = new M(t.routes, r, e, s, t.wildcard), i = await te(n);
  return Te(e, i, r);
}
__name(ee, "ee");
__name2(ee, "ee");
async function te(e, t = "none", r = false) {
  return await e.run(t) === "error" || !r && e.status && e.status >= 400 ? te(e, "error", true) : { path: e.path, status: e.status, headers: e.headers, searchParams: e.searchParams, body: e.body };
}
__name(te, "te");
__name2(te, "te");
async function Te(e, { path: t = "/404", status: r, headers: s, searchParams: n, body: i }, a) {
  let o = s.normal.get("location");
  if (o) {
    if (o !== s.middlewareLocation) {
      let p = [...n.keys()].length ? `?${n.toString()}` : "";
      s.normal.set("location", `${o ?? "/"}${p}`);
    }
    return new Response(null, { status: r, headers: s.normal });
  }
  let c;
  if (i !== void 0) c = new Response(i, { status: r });
  else if (v(t)) {
    let p = new URL(t);
    R(p.searchParams, n), c = await fetch(p, e.request);
  } else c = await k(a[t], e, { path: t, status: r, headers: s, searchParams: n });
  let d = s.normal;
  return x(d, c.headers), x(d, s.important), c = new Response(c.body, { ...c, status: r || c.status, headers: d }), c;
}
__name(Te, "Te");
__name2(Te, "Te");
u();
l();
h();
function se() {
  globalThis.__nextOnPagesRoutesIsolation ??= { _map: /* @__PURE__ */ new Map(), getProxyFor: Me };
}
__name(se, "se");
__name2(se, "se");
function Me(e) {
  let t = globalThis.__nextOnPagesRoutesIsolation._map.get(e);
  if (t) return t;
  let r = Ne();
  return globalThis.__nextOnPagesRoutesIsolation._map.set(e, r), r;
}
__name(Me, "Me");
__name2(Me, "Me");
function Ne() {
  let e = /* @__PURE__ */ new Map();
  return new Proxy(globalThis, { get: /* @__PURE__ */ __name2((t, r) => e.has(r) ? e.get(r) : Reflect.get(globalThis, r), "get"), set: /* @__PURE__ */ __name2((t, r, s) => Ie.has(r) ? Reflect.set(globalThis, r, s) : (e.set(r, s), true), "set") });
}
__name(Ne, "Ne");
__name2(Ne, "Ne");
var Ie = /* @__PURE__ */ new Set(["_nextOriginalFetch", "fetch", "__incrementalCache"]);
var Ae = Object.defineProperty;
var Le = /* @__PURE__ */ __name2((...e) => {
  let t = e[0], r = e[1], s = "__import_unsupported";
  if (!(r === s && typeof t == "object" && t !== null && s in t)) return Ae(...e);
}, "Le");
globalThis.Object.defineProperty = Le;
globalThis.AbortController = class extends AbortController {
  constructor() {
    try {
      super();
    } catch (t) {
      if (t instanceof Error && t.message.includes("Disallowed operation called within global scope")) return { signal: { aborted: false, reason: null, onabort: /* @__PURE__ */ __name2(() => {
      }, "onabort"), throwIfAborted: /* @__PURE__ */ __name2(() => {
      }, "throwIfAborted") }, abort() {
      } };
      throw t;
    }
  }
};
var Ss = { async fetch(e, t, r) {
  se(), X();
  let s = await __ALSes_PROMISE__;
  if (!s) {
    let a = new URL(e.url), o = await t.ASSETS.fetch(`${a.protocol}//${a.host}/cdn-cgi/errors/no-nodejs_compat.html`), c = o.ok ? o.body : "Error: Could not access built-in Node.js modules. Please make sure that your Cloudflare Pages project has the 'nodejs_compat' compatibility flag set.";
    return new Response(c, { status: 503 });
  }
  let { envAsyncLocalStorage: n, requestContextAsyncLocalStorage: i } = s;
  return n.run({ ...t, NODE_ENV: "production", SUSPENSE_CACHE_URL: P }, async () => i.run({ env: t, ctx: r, cf: e.cf }, async () => {
    if (new URL(e.url).pathname.startsWith("/_next/image")) return K(e, { buildOutput: m, assetsFetcher: t.ASSETS, imagesConfig: f.images });
    let o = B(e);
    return ee({ request: o, ctx: r, assetsFetcher: t.ASSETS }, f, m, g);
  }));
} };

// node_modules/wrangler/templates/pages-dev-util.ts
function isRoutingRuleMatch(pathname, routingRule) {
  if (!pathname) {
    throw new Error("Pathname is undefined.");
  }
  if (!routingRule) {
    throw new Error("Routing rule is undefined.");
  }
  const ruleRegExp = transformRoutingRuleToRegExp(routingRule);
  return pathname.match(ruleRegExp) !== null;
}
__name(isRoutingRuleMatch, "isRoutingRuleMatch");
function transformRoutingRuleToRegExp(rule) {
  let transformedRule;
  if (rule === "/" || rule === "/*") {
    transformedRule = rule;
  } else if (rule.endsWith("/*")) {
    transformedRule = `${rule.substring(0, rule.length - 2)}(/*)?`;
  } else if (rule.endsWith("/")) {
    transformedRule = `${rule.substring(0, rule.length - 1)}(/)?`;
  } else if (rule.endsWith("*")) {
    transformedRule = rule;
  } else {
    transformedRule = `${rule}(/)?`;
  }
  transformedRule = `^${transformedRule.replaceAll(/\./g, "\\.").replaceAll(/\*/g, ".*")}$`;
  return new RegExp(transformedRule);
}
__name(transformRoutingRuleToRegExp, "transformRoutingRuleToRegExp");

// .wrangler/tmp/pages-zN1i4F/zwlzaxx4b5.js
var define_ROUTES_default = { version: 1, description: "Built with @cloudflare/next-on-pages@1.13.12.", include: ["/*"], exclude: ["/_next/static/*"] };
var routes = define_ROUTES_default;
var pages_dev_pipeline_default = {
  fetch(request, env, context) {
    const { pathname } = new URL(request.url);
    for (const exclude of routes.exclude) {
      if (isRoutingRuleMatch(pathname, exclude)) {
        return env.ASSETS.fetch(request);
      }
    }
    for (const include of routes.include) {
      if (isRoutingRuleMatch(pathname, include)) {
        const workerAsHandler = Ss;
        if (workerAsHandler.fetch === void 0) {
          throw new TypeError("Entry point missing `fetch` handler");
        }
        return workerAsHandler.fetch(request, env, context);
      }
    }
    return env.ASSETS.fetch(request);
  }
};

// node_modules/wrangler/templates/middleware/middleware-ensure-req-body-drained.ts
var drainBody = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } finally {
    try {
      if (request.body !== null && !request.bodyUsed) {
        const reader = request.body.getReader();
        while (!(await reader.read()).done) {
        }
      }
    } catch (e) {
      console.error("Failed to drain the unused request body.", e);
    }
  }
}, "drainBody");
var middleware_ensure_req_body_drained_default = drainBody;

// node_modules/wrangler/templates/middleware/middleware-miniflare3-json-error.ts
function reduceError(e) {
  return {
    name: e?.name,
    message: e?.message ?? String(e),
    stack: e?.stack,
    cause: e?.cause === void 0 ? void 0 : reduceError(e.cause)
  };
}
__name(reduceError, "reduceError");
var jsonError = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } catch (e) {
    const error = reduceError(e);
    return Response.json(error, {
      status: 500,
      headers: { "MF-Experimental-Error-Stack": "true" }
    });
  }
}, "jsonError");
var middleware_miniflare3_json_error_default = jsonError;

// .wrangler/tmp/bundle-2rlCEs/middleware-insertion-facade.js
var __INTERNAL_WRANGLER_MIDDLEWARE__ = [
  middleware_ensure_req_body_drained_default,
  middleware_miniflare3_json_error_default
];
var middleware_insertion_facade_default = pages_dev_pipeline_default;

// node_modules/wrangler/templates/middleware/common.ts
var __facade_middleware__ = [];
function __facade_register__(...args) {
  __facade_middleware__.push(...args.flat());
}
__name(__facade_register__, "__facade_register__");
function __facade_invokeChain__(request, env, ctx, dispatch, middlewareChain) {
  const [head, ...tail] = middlewareChain;
  const middlewareCtx = {
    dispatch,
    next(newRequest, newEnv) {
      return __facade_invokeChain__(newRequest, newEnv, ctx, dispatch, tail);
    }
  };
  return head(request, env, ctx, middlewareCtx);
}
__name(__facade_invokeChain__, "__facade_invokeChain__");
function __facade_invoke__(request, env, ctx, dispatch, finalMiddleware) {
  return __facade_invokeChain__(request, env, ctx, dispatch, [
    ...__facade_middleware__,
    finalMiddleware
  ]);
}
__name(__facade_invoke__, "__facade_invoke__");

// .wrangler/tmp/bundle-2rlCEs/middleware-loader.entry.ts
var __Facade_ScheduledController__ = class ___Facade_ScheduledController__ {
  constructor(scheduledTime, cron, noRetry) {
    this.scheduledTime = scheduledTime;
    this.cron = cron;
    this.#noRetry = noRetry;
  }
  static {
    __name(this, "__Facade_ScheduledController__");
  }
  #noRetry;
  noRetry() {
    if (!(this instanceof ___Facade_ScheduledController__)) {
      throw new TypeError("Illegal invocation");
    }
    this.#noRetry();
  }
};
function wrapExportedHandler(worker) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return worker;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  const fetchDispatcher = /* @__PURE__ */ __name(function(request, env, ctx) {
    if (worker.fetch === void 0) {
      throw new Error("Handler does not export a fetch() function.");
    }
    return worker.fetch(request, env, ctx);
  }, "fetchDispatcher");
  return {
    ...worker,
    fetch(request, env, ctx) {
      const dispatcher = /* @__PURE__ */ __name(function(type, init) {
        if (type === "scheduled" && worker.scheduled !== void 0) {
          const controller = new __Facade_ScheduledController__(
            Date.now(),
            init.cron ?? "",
            () => {
            }
          );
          return worker.scheduled(controller, env, ctx);
        }
      }, "dispatcher");
      return __facade_invoke__(request, env, ctx, dispatcher, fetchDispatcher);
    }
  };
}
__name(wrapExportedHandler, "wrapExportedHandler");
function wrapWorkerEntrypoint(klass) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return klass;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  return class extends klass {
    #fetchDispatcher = /* @__PURE__ */ __name((request, env, ctx) => {
      this.env = env;
      this.ctx = ctx;
      if (super.fetch === void 0) {
        throw new Error("Entrypoint class does not define a fetch() function.");
      }
      return super.fetch(request);
    }, "#fetchDispatcher");
    #dispatcher = /* @__PURE__ */ __name((type, init) => {
      if (type === "scheduled" && super.scheduled !== void 0) {
        const controller = new __Facade_ScheduledController__(
          Date.now(),
          init.cron ?? "",
          () => {
          }
        );
        return super.scheduled(controller);
      }
    }, "#dispatcher");
    fetch(request) {
      return __facade_invoke__(
        request,
        this.env,
        this.ctx,
        this.#dispatcher,
        this.#fetchDispatcher
      );
    }
  };
}
__name(wrapWorkerEntrypoint, "wrapWorkerEntrypoint");
var WRAPPED_ENTRY;
if (typeof middleware_insertion_facade_default === "object") {
  WRAPPED_ENTRY = wrapExportedHandler(middleware_insertion_facade_default);
} else if (typeof middleware_insertion_facade_default === "function") {
  WRAPPED_ENTRY = wrapWorkerEntrypoint(middleware_insertion_facade_default);
}
var middleware_loader_entry_default = WRAPPED_ENTRY;
export {
  __INTERNAL_WRANGLER_MIDDLEWARE__,
  middleware_loader_entry_default as default
};
/*!
 * cookie
 * Copyright(c) 2012-2014 Roman Shtylman
 * Copyright(c) 2015 Douglas Christopher Wilson
 * MIT Licensed
 */
//# sourceMappingURL=zwlzaxx4b5.js.map
