import React from "react";
import { Typography, Row, Col, Card, List, Button, Modal } from "antd";
import { EditOutlined, PlusOutlined } from "@ant-design/icons";
import AddOrEditAddress from "@/components/AddOrEditAddress";
import AddressCard from "@/components/AddressCard";
import EditNameForm from "@/components/forms/EditNameForm";
import { useBoolean } from "ahooks";
import { Head, PageProps, useSSQ } from "rakkasjs";
import { useTranslation } from "react-i18next";
import { getSdk } from "@adapters/saleor/generated/graphql";
import { GraphQLClient } from "graphql-request";
import config from "@/config";

const ProfilePage: React.FC<PageProps> = () => {
  const { t } = useTranslation();
  const [editNameModalOpen, { setTrue: openEditNameModal, setFalse: closeEditNameModal }] = useBoolean();

  const { data } = useSSQ(async (ctx) => {
    const client = new GraphQLClient(config.apiEndpoint, { fetch: ctx.fetch });
    const sdk = getSdk(client);
    const res = await sdk.profileQuery();
    return res;
  });

  return (
    <div className="pt-6 pb-12">
      <Head title={t("profile.title") as string} />
      <Modal
        destroyOnClose
        okText={t("misc.saveChanges")}
        okButtonProps={{
          form: "editname-form",
          htmlType: "submit",
          // loading: loading.effects["auth/updateName"],
        }}
        onCancel={closeEditNameModal}
        title={t("profile.editName")}
        open={editNameModalOpen}
      >
        <EditNameForm
          id="editname-form"
          firstName={data?.me?.firstName || ""}
          lastName={data?.me?.lastName || ""}
          hideSubmit
          onSubmit={closeEditNameModal}
        />
      </Modal>
      <Row justify="center">
        <Col span={22}>
          <Typography.Title id="page-heading" className="text-center" level={1}>
            {t("profile.heading")}
          </Typography.Title>
          <Row justify="center">
            <Col id="content-col" xs={24} md={16} lg={12} xxl={8}>
              <Card
                id="personal-info-card"
                className="mb-6"
                title={t("profile.personalInfo")}
                extra={
                  <Button onClick={openEditNameModal}>
                    <EditOutlined /> {t("misc.edit")}
                  </Button>
                }
              >
                <div>
                  <Typography.Text strong>{t("profile.name")}</Typography.Text>
                </div>
                <div>
                  <Typography.Text id="name">
                    {data?.me?.firstName} {data?.me?.lastName}
                  </Typography.Text>
                </div>
              </Card>
              <Card id="addresses-card" title={t("profile.addresses")}>
                <List
                  dataSource={[...(data?.me?.addresses || []), {}]}
                  grid={{ column: 2, xs: 1, sm: 2, gutter: 24 }}
                  renderItem={(item) => {
                    if (!item.id) {
                      return (
                        <List.Item key="plus">
                          <AddOrEditAddress
                            formId="profile-add-addr"
                            firstName={data?.me?.firstName}
                            lastName={data?.me?.lastName}
                            buttonProps={{
                              block: true,
                              style: { height: 120 },
                            }}
                          >
                            <PlusOutlined className="text-4xl" />
                          </AddOrEditAddress>
                        </List.Item>
                      );
                    }
                    return (
                      <List.Item key={item.id} className="address-list-items">
                        <AddressCard address={item} />
                      </List.Item>
                    );
                  }}
                />
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  );
};

export default ProfilePage;
