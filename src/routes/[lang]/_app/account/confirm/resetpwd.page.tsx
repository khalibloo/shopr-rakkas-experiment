import { Button, Card, Col, Result, Row, Typography } from "antd";
import ResetPasswordForm from "@/components/forms/ResetPasswordForm";
import { useTranslation } from "react-i18next";
import { Head, Link, useLocation } from "rakkasjs";

const PasswordResetPage: React.FC = () => {
  const { t } = useTranslation();
  const {
    current: { searchParams },
  } = useLocation();
  const email = searchParams.get("email");
  const token = searchParams.get("token");

  return (
    <div className="pt-6 pb-12">
      <Head title={t("account.resetpwd.title")} />
      {!token || !email ? (
        <Result
          status="error"
          extra={[
            <Link href="/" key="0">
              <Button type="primary">{t("misc.backToHome")}</Button>
            </Link>,
          ]}
          title={t("account.confirm.invalidUrl")}
          subTitle={t("account.confirm.invalidUrl.desc")}
        />
      ) : (
        <Row justify="center">
          <Col span={22}>
            <Typography.Title id="page-heading" className="text-center" level={1}>
              {t("account.resetpwd.heading")}
            </Typography.Title>
            <Row justify="center">
              <Col xs={24} md={16} lg={12} xl={10} xxl={8}>
                <Card>
                  <ResetPasswordForm email={email} token={token} />
                </Card>
              </Col>
            </Row>
          </Col>
        </Row>
      )}
    </div>
  );
};

export default PasswordResetPage;
