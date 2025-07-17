// <define:__ROUTES__>
var define_ROUTES_default = { version: 1, description: "Built with @cloudflare/next-on-pages@1.13.12.", include: ["/*"], exclude: ["/_next/static/*"] };

// node_modules/wrangler/templates/pages-dev-pipeline.ts
import worker from "/Users/shimodairaaonin/jugyo/jugyoGai/bunkasai-board/.wrangler/tmp/pages-zN1i4F/bundledWorker-0.4044258597897734.mjs";
import { isRoutingRuleMatch } from "/Users/shimodairaaonin/jugyo/jugyoGai/bunkasai-board/node_modules/wrangler/templates/pages-dev-util.ts";
export * from "/Users/shimodairaaonin/jugyo/jugyoGai/bunkasai-board/.wrangler/tmp/pages-zN1i4F/bundledWorker-0.4044258597897734.mjs";
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
        const workerAsHandler = worker;
        if (workerAsHandler.fetch === void 0) {
          throw new TypeError("Entry point missing `fetch` handler");
        }
        return workerAsHandler.fetch(request, env, context);
      }
    }
    return env.ASSETS.fetch(request);
  }
};
export {
  pages_dev_pipeline_default as default
};
//# sourceMappingURL=zwlzaxx4b5.js.map
