import React, { useEffect } from "react";
import { Typography, Row, Col, Card, Grid, Image } from "antd";
import { Link, useSSQ } from "rakkasjs";
import { getScreenSize } from "@/utils/utils";

import { HomeCatalogListConfig } from ".altrc";
import config from "@/config";
import { getSdk } from "@adapters/saleor/generated/graphql";

const HomeCatalogListSection: React.FC<HomeCatalogListConfig> = ({
  menuName,
  justify,
  gap,
  rows,
  showNames,
  title,
  useMenuNameAsTitle,
  googleAnalyticsPromoData,
}) => {
  const { data } = useSSQ(async (ctx) => {
    if (menuName) {
      const client = new GraphQLClient(config.apiEndpoint, { fetch: ctx.fetch });
      const sdk = getSdk(client);
      const res = await sdk.homeBannerSectionQuery({ menuName, lang: "EN" });
      return res;
    }
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

  if (!menuName) {
    // improperly configured section
    return null;
  }

  let titleText = title;
  if (!title && useMenuNameAsTitle) {
    titleText = data?.menu?.name;
  }
  let items = data?.menu?.items?.filter((item) => item?.category || item?.collection);
  const rowSizes = {
    xs: 1,
    sm: 2,
    md: 3,
    lg: 3,
    xl: 4,
    xxl: 6,
  };
  const collections = items?.slice(0, Math.min(items.length, rows[screenSize] * rowSizes[screenSize])).map((item) => ({
    ...(item?.collection || item?.category),
    url: item?.collection ? `/collections/${item.collection.id}` : `/categories/${item?.category?.id}`,
  }));

  if (!collections?.length) {
    // empty menu
    return null;
  }

  return (
    <Row justify="center">
      <Col span={22} md={20}>
        {titleText && (
          <Typography.Title className="text-center" level={1}>
            {titleText}
          </Typography.Title>
        )}
        <div
          className="grid"
          style={{
            justifyContent: justify || "center",
            gap: gap || 32,
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 240px))",
          }}
        >
          {collections?.map((item) => (
            <Link
              key={item.id}
              href={item.url}
              //  onClick={trackPromoClick}
            >
              <Card
                hoverable
                className="w-full"
                cover={
                  <Image
                    preview={false}
                    className="w-full h-full aspect-square object-cover"
                    src={item.backgroundImage?.url}
                    alt={item.backgroundImage?.alt || ""}
                    loading="lazy"
                  />
                }
              >
                {showNames && <Card.Meta title={item.name} />}
              </Card>
            </Link>
          ))}
        </div>
      </Col>
    </Row>
  );
};

export default HomeCatalogListSection;
