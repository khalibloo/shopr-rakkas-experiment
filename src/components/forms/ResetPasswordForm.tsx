import { Form, Input, Button, notification, message, Row } from "antd";
import { useResponsive } from "ahooks";
import Logger from "@/utils/logger";
import { useTranslation } from "react-i18next";

interface Props {
  email: string;
  token: string;
  id?: string;
  hideSubmit?: boolean;
  onSubmit?: () => void;
}

const ResetPasswordForm: React.FC<Props> = ({ email, token, id, hideSubmit, onSubmit }) => {
  const { t } = useTranslation();
  const responsive = useResponsive();

  const dispatch = (blah: any) => blah;
  const onFinish = (values) => {
    Logger.log("Success:", values);
    dispatch?.({
      type: "auth/confirmPasswordReset",
      payload: {
        email,
        password: values.password,
        token,
        onCompleted: (data) => {
          Logger.log(data);
          notification.success({
            message: t("who.resetPwd.success"),
            description: t("who.resetPwd.success.desc"),
          });
          onSubmit?.();
        },
        onError: (err) => {
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
      name="reset-password"
      layout="vertical"
      requiredMark={false}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
    >
      <Form.Item
        name="password"
        label={t("settings.changePwd.newPwd")}
        rules={[
          {
            required: true,
            message: t("who.signup.pwd.required"),
          },
          {
            min: 8,
            message: t("who.signup.pwd.minLength"),
          },
        ]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item
        name="confirm"
        label={t("who.signup.pwd2")}
        dependencies={["password"]}
        rules={[
          {
            required: true,
            message: t("who.signup.pwd2.required"),
          },
          ({ getFieldValue }) => ({
            validator(rule, value) {
              if (!value || getFieldValue("password") === value) {
                return Promise.resolve();
              }
              return Promise.reject(t("who.signup.pwd2.match"));
            },
          }),
        ]}
      >
        <Input.Password />
      </Form.Item>

      {!hideSubmit && (
        <Row justify="end">
          <Form.Item>
            <Button
              block={!responsive.md}
              type="primary"
              size="large"
              // loading={loading.effects["auth/confirmPasswordReset"]}
              htmlType="submit"
            >
              {t("misc.saveChanges")}
            </Button>
          </Form.Item>
        </Row>
      )}
    </Form>
  );
};

export default ResetPasswordForm;
