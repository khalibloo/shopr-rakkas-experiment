import { BasicProductFragment } from "@adapters/saleor/generated/graphql";
import { Link } from "rakkasjs";
import { Card, Typography, Row, Col, Image } from "antd";
import { formatPrice, getProductName } from "@/utils/utils";

interface Props {
  id?: string;
  product: BasicProductFragment;
}

const ProductListItem: React.FunctionComponent<Props> = ({ product, id }) => {
  const currency = product.pricing?.priceRange?.start?.gross.currency as string;
  const minPrice = product.pricing?.priceRange?.start?.gross.amount as number;
  const maxPrice = product.pricing?.priceRange?.stop?.gross.amount as number;
  const minUndiscountedPrice = product?.pricing?.priceRangeUndiscounted?.start?.gross.amount as number;
  const maxUndiscountedPrice = product?.pricing?.priceRangeUndiscounted?.stop?.gross.amount as number;
  const isOnSale = product?.pricing?.onSale;

  return (
    <Card className="w-full" id={id}>
      <Row gutter={24}>
        <Col xs={8} sm={6} lg={4}>
          <Link href={`/products/${product.slug}`}>
            <Image
              preview={false}
              className="w-full aspect-square"
              alt={product.thumbnail?.alt || ""}
              src={product.thumbnail?.url}
              loading="lazy"
            />
          </Link>
        </Col>
        <Col xs={16} sm={18} lg={20}>
          <Link href={`/products/${product.slug}`}>
            <Typography.Title level={4}>{getProductName(product)}</Typography.Title>
          </Link>
          <Typography.Title level={4}>
            {isOnSale && (
              <span>
                <Typography.Text className="text-sm line-through" type="secondary">
                  {formatPrice(currency, minUndiscountedPrice, maxUndiscountedPrice)}
                </Typography.Text>{" "}
              </span>
            )}
            {formatPrice(currency, minPrice, maxPrice)}
          </Typography.Title>
        </Col>
      </Row>
    </Card>
  );
};

export default ProductListItem;
