import { ConfigProvider } from "antd";
import type { CommonHooks } from "rakkasjs";
import { configResponsive } from "ahooks";

import "antd/dist/reset.css";
import "@/styles/global.css";
import "./i18n";

configResponsive({
  xs: 0,
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
  xxl: 1600,
});

declare module "rakkasjs" {
  interface PageContext {
    lang: "en" | "fr";
  }
}

const hooks: CommonHooks = {
  beforePageLookup(ctx, url) {
    const lang = url.pathname.split("/")[1];

    if (lang === "en" || lang === "fr") {
      ctx.lang = lang;
      const newUrl = new URL(url);
      newUrl.pathname = url.pathname.slice(lang.length + 1);
      return { rewrite: newUrl };
    } else if (url.pathname === "/") {
      let lang = "en"; // Default language

      if (import.meta.env.SSR) {
        // Detect language from Accept-Language header
        const header = ctx.requestContext!.request.headers.get("accept-language");
        if (header?.startsWith("fr")) {
          lang = "fr";
        }
      } else {
        // Detect language from browser language(s)
        const navLang = (navigator.languages ?? [navigator.language])[0];
        if (navLang?.startsWith("fr")) {
          lang = "fr";
        }
      }

      const newUrl = new URL(url);
      newUrl.pathname = `/${lang}`;

      return { redirect: newUrl };
    }

    return true;
  },
  wrapApp: (app) => (
    <ConfigProvider theme={{ components: { Layout: { colorBgHeader: "#fff" } } }}>{app}</ConfigProvider>
  ),
};

export default hooks;
