import { Button, Col, Result, Row } from "antd";
import { useTranslation } from "react-i18next";
import { Head, Link } from "rakkasjs";

const NotFoundPage = () => {
  const { t } = useTranslation();

  return (
    <>
      <Head title={t("404.title") as string} />
      <div className="pt-6 pb-12">
        <Row justify="center" align="middle" className="h-full">
          <Col span={22} md={20} xl={18}>
            <Result
              status="404"
              title={t("404.heading")}
              subTitle={t("404.subheading")}
              extra={
                <Link href="/">
                  <Button size="large" type="primary">
                    {t("misc.backToHome")}
                  </Button>
                </Link>
              }
            />
          </Col>
        </Row>
      </div>
    </>
  );
};

export default NotFoundPage;
