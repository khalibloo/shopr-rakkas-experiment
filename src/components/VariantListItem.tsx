import * as React from "react";
import { Link, useIntl } from "umi";
import { Card, Typography, Row, Col } from "antd";
import AspectRatio from "./AspectRatio";
import { formatPrice, getProductName } from "@/utils/utils";

interface Props {
  variant: any; //VariantListItemType;
  qty?: number;
}
const VariantListItem: React.FunctionComponent<Props> = ({ variant, qty }) => {
  const { t } = useTranslation();
  const thumbnail = variant.images[0] ? variant.images[0] : variant.product?.thumbnail;
  const currency = variant.pricing?.price?.gross.currency as string;
  const price = variant.pricing?.price?.gross.amount as number;
  return (
    <Card>
      <Row gutter={24}>
        <Col span={4} xs={8} md={6} lg={4}>
          <Link to={`/products/${variant.product.slug}`}>
            <AspectRatio width={1} height={1}>
              <img className="w-full" alt={thumbnail?.alt} src={thumbnail?.url} loading="lazy" />
            </AspectRatio>
          </Link>
        </Col>
        <Col span={20} xs={16} md={18} lg={20}>
          <Link to={`/products/${variant.product.slug}`}>
            <Typography.Title level={4}>{getProductName(variant.product)}</Typography.Title>
          </Link>
          <Typography.Title level={4}>{formatPrice(currency, price)}</Typography.Title>
          {qty !== undefined && (
            <div>
              <Typography.Text>
                {t("misc.qty")}: {qty}
              </Typography.Text>
            </div>
          )}
        </Col>
      </Row>
    </Card>
  );
};

export default VariantListItem;
