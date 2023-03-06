import { Typography, Row, Col } from "antd";

import VSpacing from "@/components/VSpacing";
import { formatTitle, getCategoryName, getCategorySeoDesc } from "@/utils/utils";
import { Head, PageProps, useQuery, useSSQ } from "rakkasjs";
import config from "@/config";
import { GraphQLClient } from "graphql-request";
import { getSdk } from "@adapters/saleor/generated/graphql";
import Products from "@/components/Products";

interface Params {
  category: string;
  lang: string;
}

const CategoryDetailPage: React.FC<PageProps<Params>> = ({ params }) => {
  const { category: categorySlug, lang } = params;
  // const qKey = JSON.stringify(["category", { id: categorySlug, lang }]);
  const { data } = useSSQ(async (ctx) => {
    const client = new GraphQLClient(config.apiEndpoint, { fetch: ctx.fetch });
    const sdk = getSdk(client);
    const res = await sdk.categoryDetailQuery({ category: categorySlug, lang: lang.toUpperCase() as any });
    return res;
  });

  return (
    <div>
      {data?.category?.name && (
        <Head
          title={formatTitle(getCategoryName(data.category))}
          meta={[{ name: "description", content: getCategorySeoDesc(data.category) }]}
        />
      )}
      <div className="overflow-hidden relative" style={{ height: 300 }}>
        <img
          className="w-full h-full absolute top-0 left-0 object-cover"
          src={data?.category?.backgroundImage?.url}
          alt={data?.category?.backgroundImage?.alt || ""}
          loading="lazy"
        />
        {data?.category?.name && (
          <Row className="h-full" justify="center" align="middle">
            <Col
              className="py-2 px-8"
              style={{
                backgroundImage: "linear-gradient(to left, #3330, #333c, #333c, #3330)",
              }}
            >
              <Typography.Title id="title" className="text-center m-0 inverse-text" level={1}>
                {getCategoryName(data.category)}
              </Typography.Title>
            </Col>
          </Row>
        )}
      </div>
      <Products
        categoryID={data?.category?.id}
        showCollectionFilter
        showCategoryFilter
        listName={data?.category?.name}
        lang={lang}
      />
      <VSpacing height={48} />
    </div>
  );
};

export default CategoryDetailPage;
