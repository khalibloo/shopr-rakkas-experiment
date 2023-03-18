import { Head, Link, Layout as RakkasLayout, usePageContext } from "rakkasjs";
import { Affix, Button, Col, Layout, Row, Space, Typography } from "antd";
// import lf from "localforage";
import { useBoolean } from "ahooks";
import { useTranslation } from "react-i18next";
import { clsx } from "clsx";

import NavBar from "@/components/layout/NavBar";
import Footer from "@/components/layout/Footer";
// import config from "@/config";

const AppLayout: RakkasLayout = ({ children }) => {
  const { lang } = usePageContext();
  const { t } = useTranslation();
  const [
    cookieDrawerOpen,
    // { setTrue: openCookieDrawer, setFalse: closeCookieDrawer }
  ] = useBoolean();
  // const [acceptedCookies, setAcceptedCookies] = useCookieState('accepted-cookie-notice');

  // useEffect(() => {
  //   dispatch?.({ type: "auth/initialize" });
  // }, []);

  // useEffect(() => {
  //   if (config.altConfig.showCookieNotice) {
  //     lf.getItem("accepted_cookie_notice").then((accepted) => {
  //       if (!accepted) {
  //         openCookieDrawer();
  //       }
  //     });
  //   }
  // }, [acceptedCookies]);

  // if (loading.effects["auth/initialize"]) {
  //   return <Loader />;
  // }

  return (
    <>
      <Head htmlAttributes={{ lang }} />
      <Layout className="min-h-full">
        <Layout.Header className={clsx("w-full p-0 fixed z-10 shadow-md")}>
          <NavBar />
        </Layout.Header>
        <Layout.Content className="mt-16 flex flex-col">{children}</Layout.Content>
        <Layout.Footer>
          <Footer />
        </Layout.Footer>
      </Layout>
      {cookieDrawerOpen && (
        <Affix offsetBottom={0} target={() => window}>
          <Row justify="space-around" align="middle" className="h-full bg-default p-6 shadow-md">
            <Col span={16} xs={22} sm={22} md={20} lg={16}>
              <Typography.Paragraph className="text-center text-lg">{t("cookies.notice")}</Typography.Paragraph>
              <Row justify="center">
                <Col>
                  <Space>
                    <Link href="/pages/privacy">
                      <Button size="large">{t("cookies.privacyPolicy")}</Button>
                    </Link>
                    <Button
                      type="primary"
                      size="large"
                      onClick={() => {
                        // lf.setItem("accepted_cookie_notice", true).then((value) => {
                        //   if (value) {
                        //     closeCookieDrawer();
                        //   }
                        // });
                      }}
                    >
                      {t("cookies.accept")}
                    </Button>
                  </Space>
                </Col>
              </Row>
            </Col>
          </Row>
        </Affix>
      )}
    </>
  );
};

export default AppLayout;
