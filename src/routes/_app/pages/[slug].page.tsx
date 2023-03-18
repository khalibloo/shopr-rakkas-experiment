import { Col, Row, Typography } from "antd";
import RichTextContent from "@/components/RichTextContent";
import { formatTitle } from "@/utils/utils";
import { Head, PageProps, usePageContext, useSSQ } from "rakkasjs";
import { GraphQLClient } from "graphql-request";
import { getSdk } from "@adapters/saleor/generated/graphql";
import config from "@/config";

interface Params {
  slug: string;
}

const PageDetailPage: React.FC<PageProps<Params>> = ({ params: { slug } }) => {
  const { lang } = usePageContext();
  const { data } = useSSQ(async (ctx) => {
    const client = new GraphQLClient(config.apiEndpoint, { fetch: ctx.fetch });
    const sdk = getSdk(client);
    const res = await sdk.pageQuery({ slug, lang: lang.toUpperCase() as any });
    return res;
  });

  return (
    <div className="pt-6 pb-12">
      {data?.page?.title && (
        <Head title={formatTitle(data.page.title)} meta={[{ name: "description", content: data.page.title }]} />
      )}
      <Row justify="center">
        <Col className="text-lg" span={22} md={20} xl={18}>
          <Typography.Title id="page-heading" className="text-center" level={1}>
            {data?.page?.title}
          </Typography.Title>
          <RichTextContent contentJson={data.page!.content} />
        </Col>
      </Row>
    </div>
  );
};

export default PageDetailPage;
