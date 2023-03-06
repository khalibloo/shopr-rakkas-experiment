import { Card, Typography, Row, Col, Image } from "antd";
import { formatPrice, getProductName } from "@/utils/utils";
import { useTranslation } from "react-i18next";
import { Link } from "rakkasjs";

interface Props {
  variant: any; //VariantListItemType;
  qty?: number;
}

const VariantListItem: React.FC<Props> = ({ variant, qty }) => {
  const { t } = useTranslation();
  const thumbnail = variant.images[0] ? variant.images[0] : variant.product?.thumbnail;
  const currency = variant.pricing?.price?.gross.currency as string;
  const price = variant.pricing?.price?.gross.amount as number;
  return (
    <Card>
      <Row gutter={24}>
        <Col xs={8} md={6} lg={4}>
          <Link href={`/products/${variant.product.slug}`}>
            <Image
              preview={false}
              className="w-full aspect-square"
              alt={thumbnail?.alt}
              src={thumbnail?.url}
              loading="lazy"
            />
          </Link>
        </Col>
        <Col span={20} xs={16} md={18} lg={20}>
          <Link href={`/products/${variant.product.slug}`}>
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
