import * as React from "react";
import { Form, Input, Button, notification, message, Row, Col } from "antd";
import Logger from "@/utils/logger";
import { useTranslation } from "react-i18next";

interface Props {
  id?: string;
  onSubmit?: () => void;
}

const VoucherCodeForm: React.FC<Props> = ({ id, onSubmit }) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();

  const dispatch = (blah: any) => blah;
  const onFinish = (values) => {
    Logger.log("Success:", values);
    dispatch?.({
      type: "cart/addVoucher",
      payload: {
        voucherCode: values.code.trim(),
        onCompleted: () => {
          form.resetFields();
          notification.success({
            message: t("cart.voucherCode.success"),
          });
          onSubmit?.();
        },
        onError: (err) => {
          if (err.errors?.find((e) => e.code === "VOUCHER_NOT_APPLICABLE")) {
            message.error(t("cart.voucherCode.inapplicable"));
          } else if (err.errors?.find((e) => e.code === "INVALID")) {
            message.error(t("cart.voucherCode.invalid"));
          } else {
            message.error(t("misc.error.generic"));
          }
        },
      },
    });
  };

  return (
    <Form form={form} id={id} name="voucher-code" layout="vertical" requiredMark={false} onFinish={onFinish}>
      <Row className="flex-no-wrap">
        <Col flex="auto">
          <Form.Item
            className="m-0"
            name="code"
            placeholder={t("cart.voucherCode")}
            rules={[
              {
                required: true,
                whitespace: true,
                message: t("cart.voucherCode.required"),
              },
            ]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col>
          <Form.Item className="m-0">
            <Button
              block
              type="primary"
              // loading={loading.effects["cart/addVoucher"]}
              htmlType="submit"
            >
              {t("misc.apply")}
            </Button>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};

export default VoucherCodeForm;
