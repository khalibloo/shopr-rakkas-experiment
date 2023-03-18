import { PageRouteGuard } from "rakkasjs";

export const pageGuard: PageRouteGuard = () => {
  //   return { redirect: "/some/url" };
  return true;
};
