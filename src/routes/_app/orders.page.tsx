import { Typography, Row, Col, List } from "antd";
import OrderCard from "@/components/OrderCard";
import { useTranslation } from "react-i18next";
import { Head, PageProps, usePageContext, useSSQ } from "rakkasjs";
import { GraphQLClient } from "graphql-request";
import config from "@/config";
import { getSdk } from "@adapters/saleor/generated/graphql";

const OrdersPage: React.FC<PageProps> = () => {
  const { lang } = usePageContext();
  const { t } = useTranslation();
  const { data } = useSSQ(async (ctx) => {
    const client = new GraphQLClient(config.apiEndpoint, { fetch: ctx.fetch });
    const sdk = getSdk(client);
    const res = await sdk.ordersQuery({ lang: lang.toUpperCase() as any });
    return res;
  });

  return (
    <div className="pt-6 pb-12">
      <Head title={t("orders.title") as string} />
      <Row justify="center">
        <Col span={22}>
          <Typography.Title id="page-heading" className="text-center" level={1}>
            {t("orders.heading")}
          </Typography.Title>
          <Row justify="center">
            <Col xs={24} md={18} lg={16} xxl={12}>
              <List
                dataSource={data?.me?.orders?.edges}
                renderItem={(orderEdge) => {
                  const order = orderEdge.node;
                  return (
                    <List.Item className="order-list-items" key={order.id}>
                      <div className="w-full pb-6">
                        <OrderCard order={order} />
                      </div>
                    </List.Item>
                  );
                }}
              />
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  );
};

export default OrdersPage;
