import React from "react";
import { Button, Modal } from "antd";

import { useBoolean } from "ahooks";
import { ButtonProps } from "antd/lib/button";
import { useTranslation } from "react-i18next";
import AddressForm from "@/components/forms/AddressForm";

interface Props {
  formId: string;
  address?: AddressDetails;
  firstName?: string;
  lastName?: string;
  isLoading?: boolean;
  onClick: () => void;
  onAddOrEdit?: (address: AddressInput) => void;
  buttonProps: ButtonProps;
  children: React.ReactElement;
}

const AddOrEditAddress: React.FC<Props> = ({
  formId,
  address,
  firstName,
  lastName,
  buttonProps,
  onAddOrEdit,
  onClick,
  children,
  isLoading,
}) => {
  const { t } = useTranslation();
  const [modalOpen, { setTrue: openModal, setFalse: closeModal }] = useBoolean();

  return (
    <>
      <Modal
        destroyOnClose
        okText={t("misc.save")}
        okButtonProps={{
          htmlType: "submit",
          form: formId,
          loading: isLoading,
        }}
        onCancel={closeModal}
        title={t("misc.address.createNew")}
        visible={modalOpen}
      >
        <AddressForm
          id={formId}
          address={address}
          firstName={firstName}
          lastName={lastName}
          hideSubmit
          onSubmit={(addr: AddressInput) => {
            closeModal();
            onAddOrEdit?.(addr);
          }}
        />
      </Modal>
      <Button
        {...buttonProps}
        onClick={() => {
          openModal();
          onClick?.();
        }}
      >
        {children}
      </Button>
    </>
  );
};

export default AddOrEditAddress;
