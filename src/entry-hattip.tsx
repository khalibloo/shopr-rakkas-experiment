import { extractStyle, createCache, StyleProvider } from "@ant-design/cssinjs";
import { createRequestHandler } from "rakkasjs";

export default createRequestHandler({
  createPageHooks: () => {
    const cache = createCache();
    let sent = new Set();

    return {
      emitBeforeSsrChunk() {
        const toSend = new Map([...cache.cache.entries()].filter(([k]) => !sent.has(k)));
        const style = extractStyle({ cache: toSend } as any);
        sent = new Set(cache.cache.keys());
        return style;
      },
      wrapApp(app) {
        return <StyleProvider cache={cache}>{app}</StyleProvider>;
      },
    };
  },
});
