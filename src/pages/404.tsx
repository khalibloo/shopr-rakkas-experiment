import React from "react";
import { Button, Col, Result, Row } from "antd";
import { Link, useIntl } from "umi";
import VSpacing from "@/components/VSpacing";

const NotFoundPage = () => {
  const { t } = useTranslation();
  return (
    <div>
      <VSpacing height={24} />
      <Row justify="center" align="middle" className="h-full">
        <Col span={22} md={20} xl={18}>
          <Result
            status="404"
            title="404"
            subTitle={t("404.subheading")}
            extra={
              <Link to="/">
                <Button size="large" type="primary">
                  {t("misc.backToHome")}
                </Button>
              </Link>
            }
          />
        </Col>
      </Row>
      <VSpacing height={48} />
    </div>
  );
};

NotFoundPage.title = "404.title";
export default NotFoundPage;
