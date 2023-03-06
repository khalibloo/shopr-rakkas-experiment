import { Form, Input, Button, notification, message, Row, Alert } from "antd";
import { useResponsive } from "ahooks";
import Logger from "@/utils/logger";
import { useTranslation } from "react-i18next";

interface Props {
  id?: string;
  hideSubmit?: boolean;
  onSubmit?: () => void;
}

const ResetPasswordRequestForm: React.FC<Props> = ({ id, hideSubmit, onSubmit }) => {
  const { t } = useTranslation();
  const responsive = useResponsive();
  const [form] = Form.useForm();

  const dispatch = (blah: any) => blah;
  const onFinish = (values) => {
    Logger.log("Success:", values);
    dispatch?.({
      type: "auth/requestPasswordReset",
      payload: {
        email: values.email.trim().toLowerCase(),
        onCompleted: (data) => {
          Logger.log(data);
          notification.success({
            message: t("who.reqResetPwd.success"),
            description: t("who.reqResetPwd.success.desc"),
          });
          form.resetFields();
          onSubmit?.();
        },
        onError: (err) => {
          if (err.errors?.find((e) => e.code === "NOT_FOUND")) {
            notification.success({
              message: t("who.reqResetPwd.success"),
              description: t("who.reqResetPwd.success.desc"),
            });
            form.resetFields();
            onSubmit?.();
            return;
          }
          message.error(t("misc.error.generic"));
        },
      },
    });
  };

  const onFinishFailed = (errorInfo) => {
    Logger.log("Failed:", errorInfo);
    message.error(t("form.invalid"));
  };

  return (
    <Form
      id={id}
      form={form}
      name="reset-pwd"
      layout="vertical"
      requiredMark={false}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
    >
      <Alert type="info" message={t("who.reqResetPwd.info")} />
      <Form.Item
        label={t("who.email")}
        name="email"
        rules={[
          {
            required: true,
            whitespace: true,
            message: t("who.signup.email.required"),
          },
          {
            type: "email",
            message: t("who.signup.email.invalid"),
          },
        ]}
      >
        <Input />
      </Form.Item>

      {!hideSubmit && (
        <Row justify="end">
          <Form.Item>
            <Button
              block={!responsive.md}
              type="primary"
              size="large"
              // loading={loading.effects["auth/requestPasswordReset"]}
              htmlType="submit"
            >
              {t("who.resetPwd")}
            </Button>
          </Form.Item>
        </Row>
      )}
    </Form>
  );
};

export default ResetPasswordRequestForm;
