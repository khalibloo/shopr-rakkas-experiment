import { ConfigProvider } from "antd";
import type { CommonHooks } from "rakkasjs";
import { configResponsive } from "ahooks";

import "./i18n";

configResponsive({
  xs: 0,
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
  xxl: 1600,
});

const hooks: CommonHooks = {
  wrapApp: (app) => <ConfigProvider>{app}</ConfigProvider>,
};

export default hooks;
