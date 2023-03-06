import React from "react";
import { Typography, Row, Col } from "antd";
import { useTranslation } from "react-i18next";

import config from "@/config";
import FooterMenuItem from "./FooterMenuItem";

const Footer: React.FC = () => {
  const { t } = useTranslation();
  const conf = config.altConfig.footerLayout;

  return (
    <>
      <Row justify={conf.justify} gutter={conf.gutter} className={conf.className}>
        {conf.columns.map((column, i) => (
          <Col span={column.span} key={i}>
            {column.menuName ? <div /> : column.items?.map((item, j) => <FooterMenuItem {...item} key={j} />)}
          </Col>
        ))}
      </Row>
      <Row justify="center" className="pt-4">
        <Col>
          <Typography.Text className="text-center">{t("footer.createdby")}</Typography.Text>
        </Col>
      </Row>
    </>
  );
};

export default Footer;
