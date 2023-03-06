import * as React from "react";
import { Link } from "rakkasjs";
import { Card, Typography, Image } from "antd";
import { formatPrice, getCategoryName, getProductName } from "@/utils/utils";
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

  return (
    <Link
      href={`/products/${product?.slug}`}
      onClick={() => {
        // trackClick();
        onClick?.();
      }}
    >
      <Card
        className={className}
        id={id}
        hoverable
        cover={
          <Image
            preview={false}
            className="w-full aspect-square"
            alt={product?.thumbnail?.alt || ""}
            src={product?.thumbnail?.url}
            loading="lazy"
          />
        }
      >
        <Card.Meta
          title={<Typography.Text>{getProductName(product)}</Typography.Text>}
          description={<Typography.Text type="secondary">{getCategoryName(product?.category)}</Typography.Text>}
        />
        {isOnSale && (
          <span>
            <Typography.Text className="text-xs line-through" type="secondary">
              {formatPrice(currency, minUndiscountedPrice, maxUndiscountedPrice)}
            </Typography.Text>{" "}
          </span>
        )}
        <Typography.Text strong>{formatPrice(currency, minPrice, maxPrice)}</Typography.Text>
      </Card>
    </Link>
  );
};

export default ProductCard;
