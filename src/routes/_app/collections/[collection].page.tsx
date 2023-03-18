import React from "react";
import { Typography, Row, Col } from "antd";
import { Head, PageProps, usePageContext, useSSQ } from "rakkasjs";
import { GraphQLClient } from "graphql-request";

import { formatTitle, getCollectionName, getCollectionSeoDesc } from "@/utils/utils";
import Products from "@/components/Products";
import config from "@/config";
import { getSdk } from "@adapters/saleor/generated/graphql";

interface Params {
  collection: string;
}

const CollectionDetailPage: React.FC<PageProps<Params>> = ({ params: { collection: collectionSlug } }) => {
  const { lang } = usePageContext();
  // const qKey = JSON.stringify(["category", { id: categorySlug, lang }]);
  const { data } = useSSQ(async (ctx) => {
    const client = new GraphQLClient(config.apiEndpoint, { fetch: ctx.fetch });
    const sdk = getSdk(client);
    const res = await sdk.collectionDetailQuery({
      collection: collectionSlug,
      channel: "default-channel",
      lang: lang.toUpperCase() as any,
    });
    return res;
  });

  return (
    <div className="pb-12">
      {data?.collection?.name && (
        <Head
          title={formatTitle(getCollectionName(data.collection))}
          meta={[{ name: "description", content: getCollectionSeoDesc(data.collection) }]}
        />
      )}
      <div className="overflow-hidden relative" style={{ height: 300 }}>
        <img
          id="banner-img"
          className="w-full h-full absolute top-0 left-0 object-cover"
          src={data?.collection?.backgroundImage?.url}
          alt={data?.collection?.backgroundImage?.alt || ""}
          loading="lazy"
        />
        {data?.collection?.name && (
          <Row className="h-full" justify="center" align="middle">
            <Col
              className="py-2 px-8"
              style={{
                backgroundImage: "linear-gradient(to left, #3330, #333c, #333c, #3330)",
              }}
            >
              <Typography.Title id="title" className="text-center m-0 inverse-text" level={1}>
                {getCollectionName(data.collection)}
              </Typography.Title>
            </Col>
          </Row>
        )}
      </div>
      <Products collectionID={data?.collection?.id} showCategoryFilter listName={data.collection!.name} />
    </div>
  );
};

export default CollectionDetailPage;
