import React from "react";
import { Typography, Row, Col, List, Card, Button } from "antd";
import dayjs from "dayjs";
import { formatPrice } from "@/utils/utils";
import VariantListItem from "@/components/VariantListItem";
import { useTranslation } from "react-i18next";

interface Props {
  order: any;
}

const OrderCard: React.FC<Props> = ({ order }) => {
  const { t } = useTranslation();
  const currency = order.total?.gross.currency as string;
  const totalPrice = order.total?.gross.amount as number;
  let invoice;
  // get latest invoice for order
  if (order.invoices?.length) {
    invoice = order.invoices?.reduce((a, b) => {
      return new Date(a?.createdAt) > new Date(b?.createdAt) ? a : b;
    });
  }

  return (
    <Card
      title={
        <Row justify="space-between">
          <Col>
            <div>
              <Typography.Text>
                {t("orders.placedOn")}: {dayjs(order.created).format("Do MMMM, YYYY")}
              </Typography.Text>
            </div>
            <div>
              <Typography.Text>
                {t("orders.total")}: {formatPrice(currency, totalPrice)}
              </Typography.Text>
            </div>
          </Col>
          <Col>
            <div>
              <Typography.Text>
                {t("orders.orderID")}:{" #"}
                {order.number}
              </Typography.Text>
            </div>
            <div>
              <Typography.Text>
                {t("orders.status")}: {t("orders.status." + order.status.toLowerCase())}
              </Typography.Text>
            </div>
            {invoice && invoice.status === "SUCCESS" && (
              <div className="mt-2">
                <a href={invoice.url} target="_blank" rel="noreferrer noopener">
                  <Button size="small">{t("orders.invoice.download")}</Button>
                </a>
              </div>
            )}
          </Col>
        </Row>
      }
    >
      <List
        dataSource={order.lines}
        pagination={order.lines.length > 3 ? { pageSize: 3 } : undefined}
        renderItem={(line: any) => {
          return (
            <List.Item className="product-list-items" key={line?.id}>
              <div className="w-full">
                <VariantListItem variant={line?.variant} qty={line?.quantity} />
              </div>
            </List.Item>
          );
        }}
      />
    </Card>
  );
};

export default OrderCard;
