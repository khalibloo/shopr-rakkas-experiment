import React from "react";
import { Card, Typography, Button, Modal, notification, Switch, Space } from "antd";
import { EditOutlined, DeleteOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import { useBoolean } from "ahooks";
import AddressForm from "@/components/forms/AddressForm";
import Logger from "@/utils/logger";
import { useTranslation } from "react-i18next";

interface Props {
  address: AddressDetails;
  hideActions: boolean;
  hideCard: boolean;
}

const AddressCard: React.FC<Props> = ({ address, hideActions, hideCard }) => {
  const { t } = useTranslation();
  const [editAddrModalOpen, { setTrue: openEditAddrModal, setFalse: closeEditAddrModal }] = useBoolean();
  const dispatch = (x) => x;

  const content = (
    <>
      <div>
        <Typography.Text>{address.firstName + " " + address.lastName}</Typography.Text>
      </div>
      <div>
        <Typography.Text>{address.streetAddress1}</Typography.Text>
      </div>
      <div>
        <Typography.Text>{address.streetAddress2}</Typography.Text>
      </div>
      <div>
        <Typography.Text>{address.cityArea}</Typography.Text>
      </div>
      <div>
        <Typography.Text>{address.city}</Typography.Text>
      </div>
      <div>
        <Typography.Text>{address.postalCode}</Typography.Text>
      </div>
      <div>
        <Typography.Text>{address.countryArea}</Typography.Text>
      </div>
      <div>
        <Typography.Text>{address.country?.country}</Typography.Text>
      </div>
      <div>
        <Typography.Text>
          {t("profile.phone")}: {address.phone}
        </Typography.Text>
      </div>
      {!hideActions && (
        <>
          <div className="mt-4">
            <Space>
              <Switch
                checked={Boolean(address.isDefaultShippingAddress)}
                disabled={Boolean(address.isDefaultShippingAddress)}
                // loading={loading.effects["auth/setDefaultAddress"]}
                onChange={(checked) => {
                  if (checked) {
                    dispatch?.({
                      type: "auth/setDefaultAddress",
                      payload: {
                        id: address.id,
                        type: AddressTypeEnum.SHIPPING,
                        onCompleted: () => {
                          notification.success({
                            message: t("misc.save.success"),
                          });
                        },
                      },
                    });
                  }
                }}
              />
              <Typography.Text>{t("profile.addresses.defaultShipping")}</Typography.Text>
            </Space>
          </div>
          <div className="mt-2">
            <Space>
              <Switch
                checked={Boolean(address.isDefaultBillingAddress)}
                disabled={Boolean(address.isDefaultBillingAddress)}
                // loading={loading.effects["auth/setDefaultAddress"]}
                onChange={(checked) => {
                  if (checked) {
                    dispatch?.({
                      type: "auth/setDefaultAddress",
                      payload: {
                        id: address.id,
                        type: AddressTypeEnum.BILLING,
                        onCompleted: () => {
                          notification.success({
                            message: t("misc.save.success"),
                          });
                        },
                      },
                    });
                  }
                }}
              />
              <Typography.Text>{t("profile.addresses.defaultBilling")}</Typography.Text>
            </Space>
          </div>
        </>
      )}
    </>
  );

  return (
    <>
      <Modal
        destroyOnClose
        okText={t("misc.saveChanges")}
        okButtonProps={{
          form: "edit-addr-form-" + address.id,
          htmlType: "submit",
          // loading: loading.effects["auth/updateAddress"],
        }}
        onCancel={closeEditAddrModal}
        title={t("profile.editAddress")}
        visible={editAddrModalOpen}
      >
        <AddressForm id={"edit-addr-form-" + address.id} address={address} hideSubmit onSubmit={closeEditAddrModal} />
      </Modal>
      {hideCard ? (
        content
      ) : (
        <Card
          actions={
            hideActions
              ? undefined
              : [
                  <Button block className="icon-btn" key="edit" onClick={openEditAddrModal}>
                    <EditOutlined /> {t("misc.edit")}
                  </Button>,
                  <Button
                    block
                    className="icon-btn"
                    key="delete"
                    onClick={() =>
                      Modal.confirm({
                        title: t("profile.address.delete.confirm"),
                        icon: <ExclamationCircleOutlined />,
                        maskClosable: true,
                        okText: t("misc.delete"),
                        onOk: () => {
                          return new Promise((resolve, reject) => {
                            dispatch({
                              type: "auth/deleteAddress",
                              payload: {
                                id: address.id,
                                onCompleted: () => {
                                  notification.success({
                                    message: t("misc.save.success"),
                                  });
                                  resolve(true);
                                },
                                onError: (err) => reject(err),
                              },
                            }).catch((err) => Logger.log("Failed to delete address"));
                          });
                        },
                        okButtonProps: {
                          // loading: loading.effects["auth/deleteAddress"],
                        },
                        okType: "danger",
                      })
                    }
                  >
                    <DeleteOutlined /> {t("misc.delete")}
                  </Button>,
                ]
          }
        >
          {content}
        </Card>
      )}
    </>
  );
};

export default AddressCard;
