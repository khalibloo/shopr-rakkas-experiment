import { Typography, Row, Col, Card, Button, Modal } from "antd";
import { useBoolean } from "ahooks";
import ChangeEmailForm from "@/components/forms/ChangeEmailForm";
import ChangePasswordForm from "@/components/forms/ChangePasswordForm";
import AccountDeactivationForm from "@/components/forms/AccountDeactivationForm";
import { Head, useSSQ } from "rakkasjs";
import { useTranslation } from "react-i18next";
import { GraphQLClient } from "graphql-request";
import config from "@/config";
import { getSdk } from "@adapters/saleor/generated/graphql";

const SettingsPage = () => {
  const { t } = useTranslation();
  const [changeEmailModalOpen, { setTrue: openChangeEmailModal, setFalse: closeChangeEmailModal }] = useBoolean();
  const [changePwdModalOpen, { setTrue: openChangePwdModal, setFalse: closeChangePwdModal }] = useBoolean();
  const [deactivationModalOpen, { setTrue: openDeactivationModal, setFalse: closeDeactivationModal }] = useBoolean();

  const { data } = useSSQ(async (ctx) => {
    const client = new GraphQLClient(config.apiEndpoint, { fetch: ctx.fetch });
    const sdk = getSdk(client);
    const res = await sdk.profileQuery();
    return res;
  });

  return (
    <div className="pt-6 pb-12">
      <Head title={t("settings.title") as string} />
      <Modal
        destroyOnClose
        okText={t("misc.saveChanges")}
        okButtonProps={{
          form: "change-email-form",
          htmlType: "submit",
          // loading: loading.effects["auth/changeEmail"],
        }}
        onCancel={closeChangeEmailModal}
        title={t("settings.changeEmail")}
        visible={changeEmailModalOpen}
      >
        <ChangeEmailForm
          id="change-email-form"
          email={data?.me?.email || ""}
          hideSubmit
          onSubmit={closeChangeEmailModal}
        />
      </Modal>
      <Modal
        destroyOnClose
        okText={t("misc.saveChanges")}
        okButtonProps={{
          form: "change-pwd-form",
          htmlType: "submit",
          // loading: loading.effects["auth/changePassword"],
        }}
        onCancel={closeChangePwdModal}
        title={t("settings.changePwd")}
        visible={changePwdModalOpen}
      >
        <ChangePasswordForm id="change-pwd-form" hideSubmit onSubmit={closeChangePwdModal} />
      </Modal>
      <Modal
        destroyOnClose
        okText={t("settings.shutdownAccount")}
        okType="danger"
        okButtonProps={{
          form: "request-acc-deactivation-form",
          htmlType: "submit",
          // loading: loading.effects["auth/requestAccountDeactivation"],
        }}
        onCancel={closeDeactivationModal}
        title={t("settings.shutdownAccount")}
        visible={deactivationModalOpen}
      >
        <Typography.Text>{t("account.deactivate.challenge.info")}</Typography.Text>
        <AccountDeactivationForm id="request-acc-deactivation-form" hideSubmit onSubmit={closeDeactivationModal} />
      </Modal>
      <Row justify="center">
        <Col span={22}>
          <Typography.Title id="page-heading" className="text-center" level={1}>
            {t("settings.heading")}
          </Typography.Title>
          <Row justify="center">
            <Col xs={24} md={16} lg={12} xxl={8}>
              <Card id="security-card" className="mb-6" title={t("settings.security")}>
                <div>
                  <Typography.Text strong>{t("settings.email")}</Typography.Text>
                </div>
                <Row className="mb-2" gutter={24} align="middle">
                  <Col>
                    <Typography.Text id="email-lbl">{data?.me?.email.toLowerCase()}</Typography.Text>
                  </Col>
                  <Col>
                    <Button id="change-email-btn" onClick={openChangeEmailModal}>
                      {t("settings.changeEmail")}
                    </Button>
                  </Col>
                </Row>
                <div className="mb-2">
                  <Typography.Text id="pwd-text" strong>
                    {t("settings.pwd")}
                  </Typography.Text>
                </div>
                <div>
                  <Button id="change-pwd-btn" onClick={openChangePwdModal}>
                    {t("settings.changePwd")}
                  </Button>
                </div>
              </Card>
              <Card id="danger-zone-card" title={t("settings.dangerZone")}>
                <div>
                  <Button id="shutdown-account-btn" danger onClick={openDeactivationModal}>
                    {t("settings.shutdownAccount")}
                  </Button>
                </div>
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  );
};

export default SettingsPage;
