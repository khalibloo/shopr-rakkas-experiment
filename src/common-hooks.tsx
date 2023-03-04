import { ConfigProvider } from "antd";
import type { CommonHooks } from "rakkasjs";

const hooks: CommonHooks = {
  wrapApp: (app) => <ConfigProvider>{app}</ConfigProvider>,
};

export default hooks;
