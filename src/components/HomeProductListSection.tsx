import React, { useEffect } from "react";
import { Typography, Row, Col, List, Grid } from "antd";
import { Link, useSSQ } from "rakkasjs";
import { useResponsive } from "ahooks";
import { getCategoryName, getCollectionName, getScreenSize } from "@/utils/utils";

import _ from "lodash";
import { HomeProductListConfig } from ".altrc";
import ProductCard from "./ProductCard";
import config from "@/config";
import { GraphQLClient } from "graphql-request";
import {
  FeaturedCategoryProductsQuery,
  FeaturedCollectionProductsQuery,
  getSdk,
} from "@adapters/saleor/generated/graphql";

const HomeProductListSection: React.FC<HomeProductListConfig> = ({
  categorySlug,
  collectionSlug,
  firstNProducts,
  rows,
  showTitle,
  shuffle,
  title,
  // googleAnalyticsPromoData,
}) => {
  const {
    data: { catData, collData },
  } = useSSQ(async (ctx) => {
    const client = new GraphQLClient(config.apiEndpoint, { fetch: ctx.fetch });
    const sdk = getSdk(client);
    const res: { catData?: FeaturedCategoryProductsQuery; collData?: FeaturedCollectionProductsQuery } = {};
    if (categorySlug) {
      res.catData = await sdk.featuredCategoryProducts({
        lang: "EN" as any,
        slug: categorySlug,
        first: firstNProducts,
      });
    }
    if (collectionSlug) {
      res.collData = await sdk.featuredCollectionProducts({
        lang: "EN" as any,
        slug: collectionSlug,
        first: firstNProducts,
      });
    }
    return res;
  });

  const responsive = Grid.useBreakpoint();
  const screenSize = getScreenSize(responsive);

  // Google Ecommerce - track promo view
  // useEffect(() => {
  //   if (config.gtmEnabled && googleAnalyticsPromoData) {
  //     window.dataLayer.push({
  //       event: "view_promotion",
  //       ecommerce: {
  //         ...googleAnalyticsPromoData,
  //       },
  //     });
  //   }
  // }, []);

  // Google Ecommerce - track promo click
  // const trackPromoClick = () => {
  //   if (config.gtmEnabled && googleAnalyticsPromoData) {
  //     window.dataLayer.push({
  //       event: "select_promotion",
  //       ecommerce: {
  //         ...googleAnalyticsPromoData,
  //       },
  //     });
  //   }
  // };

  if (!categorySlug && !collectionSlug) {
    // improperly configured section
    return null;
  }

  let name: string | undefined;
  let products: featuredCategoryProducts_category_products_edges[] | undefined;
  let titleUrl;
  if (categorySlug) {
    name = getCategoryName(catData?.category) || "";
    products = catData?.category?.products?.edges;
    const catID = catData?.category?.id;
    titleUrl = catID ? `/categories/${catID}` : "#";
  } else if (collectionSlug) {
    name = getCollectionName(collData?.collection) || "";
    products = collData?.collection?.products?.edges;
    const collID = collData?.collection?.id;
    titleUrl = collID ? `/collections/${collID}` : "#";
  }
  const titleText = title || name;

  const rowSizes = {
    xs: 1,
    sm: 2,
    md: 3,
    lg: 3,
    xl: 4,
    xxl: 6,
  };
  if (products && products.length > 0) {
    if (shuffle) {
      products = _.shuffle(products);
    }
    products = products.slice(0, Math.min(rows[screenSize] * rowSizes[screenSize], products.length));
  }

  if (!products?.length) {
    // empty collection/category
    return null;
  }

  return (
    <Row justify="center">
      <Col span={22} lg={20}>
        {showTitle && titleText && (
          <Link
            href={titleUrl}
            //  onClick={trackPromoClick}
          >
            <Typography.Title className="text-center" level={1}>
              {titleText}
            </Typography.Title>
          </Link>
        )}
        <div>
          <List
            dataSource={products}
            grid={{ ...rowSizes, gutter: 24 }}
            renderItem={(edge, i) => {
              const product = edge.node;
              return (
                <List.Item className="product-list-items" id={`product-list-item-${i}`} key={product.id}>
                  <div className="w-full">
                    <Row justify="center">
                      <Col span={24} style={{ maxWidth: 240 }}>
                        <ProductCard
                          className="product-grid-cards"
                          product={product}
                          listName="Featured Products"
                          listIndex={i}
                          // onClick={trackPromoClick}
                        />
                      </Col>
                    </Row>
                  </div>
                </List.Item>
              );
            }}
          />
        </div>
      </Col>
    </Row>
  );
};

export default HomeProductListSection;
