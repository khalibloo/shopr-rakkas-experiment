import React from "react";
import { Row, Col, Carousel, Grid } from "antd";
import { getScreenSize } from "@/utils/utils";

import { HomeBannerConfig } from ".altrc";
import HomeBannerItem from "./HomeBannerItem";
import { useSSQ } from "rakkasjs";
import { GraphQLClient } from "graphql-request";
import { getSdk } from "@adapters/saleor/generated/graphql";
import config from "@/config";

const HomeBannerSection: React.FC<HomeBannerConfig> = ({ fullWidth, height, images, menuName, showTitleOverlay }) => {
  const { data } = useSSQ(async (ctx) => {
    if (menuName) {
      const client = new GraphQLClient(config.apiEndpoint, { fetch: ctx.fetch });
      const sdk = getSdk(client);
      const res = await sdk.homeBannerSectionQuery({ menuName, lang: "EN" });
      return res;
    }
  });
  const responsive = Grid.useBreakpoint();

  if (!menuName) {
    // improperly configured section
    return null;
  }

  const screenSize = getScreenSize(responsive);
  const h = typeof height === "object" ? height[screenSize] : height;

  let items = images?.map((image, i) => ({ ...image, id: `${i}` }));
  if (menuName) {
    items = data?.menu?.items
      ?.map((item) => {
        const linkUrl = item?.collection ? `/collections/${item?.collection?.id}` : `/categories/${item?.category?.id}`;
        const imageUrl = item?.collection ? item.collection.backgroundImage?.url : item?.category?.backgroundImage?.url;
        const alt = item?.collection ? item.collection.backgroundImage?.alt : item?.category?.backgroundImage?.alt;
        return {
          title: showTitleOverlay ? item?.name : undefined,
          id: item?.id,
          linkUrl,
          imageUrl,
          alt,
        };
      })
      .filter((item) => item.imageUrl != null);
  }

  return (
    <Row justify="center">
      <Col span={24} md={fullWidth ? 24 : 20} className="overflow-hidden relative" style={{ height: h || 500 }}>
        {items?.length === 1 ? (
          <HomeBannerItem {...items[0]} />
        ) : (
          <Carousel autoplay className="w-full">
            {items?.map((item) => (
              <div key={item.id}>
                <div style={{ height: h }}>
                  <HomeBannerItem {...item} />
                </div>
              </div>
            ))}
          </Carousel>
        )}
      </Col>
    </Row>
  );
};

export default HomeBannerSection;
