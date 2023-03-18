import React, { useState } from "react";
import { Typography, Row, Col, Card, Tabs, Button } from "antd";
import AuthTabs from "@/components/AuthTabs";
import ResetPasswordRequestForm from "@/components/forms/ResetPasswordRequestForm";
import { LeftOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { Head } from "rakkasjs";

const WhoPage = () => {
  const { t } = useTranslation();
  // const {
  //   current: { searchParams },
  // } = useLocation();
  const [activeTab, setActiveTab] = useState("0");

  // TODO: replace with route guard
  // if (authenticated) {
  //   const redirect = searchParams.get("redirect") || "/";
  //   return <Redirect to={redirect} />;
  // }

  return (
    <div className="pt-6 pb-12">
      <Head title={t("who.title") as string} meta={[{ name: "description", content: t("who.meta") as string }]} />
      <Row justify="center">
        <Col span={22}>
          <Typography.Title id="page-heading" className="text-center" level={1}>
            {t("who.heading")}
          </Typography.Title>
          <Row justify="center">
            <Col xs={24} md={16} lg={12} xl={10} xxl={8}>
              <Card>
                <Tabs activeKey={activeTab}>
                  <Tabs.TabPane key="0">
                    <AuthTabs
                      loginFormId="who-login-form"
                      signupFormId="who-signup-form"
                      onForgotPwd={() => setActiveTab("1")}
                    />
                  </Tabs.TabPane>
                  <Tabs.TabPane key="1">
                    <Row className="mb-6">
                      <Button onClick={() => setActiveTab("0")}>
                        <LeftOutlined /> {t("misc.back")}
                      </Button>
                    </Row>
                    <ResetPasswordRequestForm />
                  </Tabs.TabPane>
                </Tabs>
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  );
};

export default WhoPage;
