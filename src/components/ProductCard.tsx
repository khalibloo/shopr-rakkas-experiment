import * as React from "react";
import { Link } from "rakkasjs";
import { Card, Typography, Skeleton } from "antd";
import AspectRatio from "./AspectRatio";
import { formatPrice, getCategoryName, getProductName } from "@/utils/utils";
import SkeletonDiv from "./SkeletonDiv";
import type { BasicProductFragment } from "@adapters/saleor/generated/graphql";
// import config from "@/config";

interface Props {
  id?: string;
  className?: string;
  product?: BasicProductFragment;
  listName?: string;
  listID?: string;
  listIndex?: number;
  loading?: boolean;
  onClick?: () => void;
}

const ProductCard: React.FC<Props> = ({
  product,
  id,
  className,
  // listName,
  // listID,
  // listIndex,
  loading,
  onClick,
}) => {
  const currency = product?.pricing?.priceRange?.start?.gross.currency as string;
  const minPrice = product?.pricing?.priceRange?.start?.gross.amount as number;
  const maxPrice = product?.pricing?.priceRange?.stop?.gross.amount as number;
  const minUndiscountedPrice = product?.pricing?.priceRangeUndiscounted?.start?.gross.amount as number;
  const maxUndiscountedPrice = product?.pricing?.priceRangeUndiscounted?.stop?.gross.amount as number;
  const isOnSale = product?.pricing?.onSale;

  // Google Ecommerce - track product clicks
  // const trackClick = () => {
  //   if (!config.gtmEnabled) {
  //     return;
  //   }
  //   if (!product) {
  //     return;
  //   }
  //   window.dataLayer.push({
  //     event: "select_item",
  //     ecommerce: {
  //       currency: product.pricing?.priceRange?.start?.gross.currency,
  //       items: [
  //         {
  //           item_name: product.name,
  //           item_category: product.category?.name,
  //           item_list_name: listName,
  //           item_list_id: listID,
  //           index: listIndex,
  //           price: minPrice.toString(),
  //         },
  //       ],
  //     },
  //   });
  // };

  const card = (
    <Card
      className={className}
      id={id}
      hoverable
      cover={
        <AspectRatio width={1} height={1}>
          <SkeletonDiv active loading={loading}>
            <img
              className="w-full"
              alt={product?.thumbnail?.alt as string}
              src={product?.thumbnail?.url}
              loading="lazy"
            />
          </SkeletonDiv>
        </AspectRatio>
      }
    >
      <Card.Meta
        title={
          <Skeleton active loading={loading} avatar={false} paragraph={{ rows: 1, width: "100%" }} title={false}>
            <Typography.Text>{getProductName(product)}</Typography.Text>
          </Skeleton>
        }
        description={
          <Skeleton active loading={loading} avatar={false} paragraph={{ rows: 1, width: "70%" }} title={false}>
            <Typography.Text type="secondary">{getCategoryName(product?.category)}</Typography.Text>
          </Skeleton>
        }
      />
      <Skeleton active loading={loading} avatar={false} paragraph={{ rows: 1, width: "30%" }} title={false}>
        {isOnSale && (
          <span>
            <Typography.Text className="text-xs line-through" type="secondary">
              {formatPrice(currency, minUndiscountedPrice, maxUndiscountedPrice)}
            </Typography.Text>{" "}
          </span>
        )}
        <Typography.Text strong>{formatPrice(currency, minPrice, maxPrice)}</Typography.Text>
      </Skeleton>
    </Card>
  );
  if (loading) {
    return card;
  }
  return (
    <Link
      href={`/products/${product?.slug}`}
      onClick={() => {
        // trackClick();
        onClick?.();
      }}
    >
      {card}
    </Link>
  );
};

export default ProductCard;
