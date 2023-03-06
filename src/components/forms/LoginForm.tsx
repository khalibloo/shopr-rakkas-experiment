import { Form, Input, Checkbox, Button, notification, message, Row, Col } from "antd";
import { useResponsive } from "ahooks";
import Logger from "@/utils/logger";
import { useTranslation } from "react-i18next";

interface Props {
  id?: string;
  hideSubmit?: boolean;
  onSubmit?: () => void;
  onForgotPwd?: () => void;
}

const LoginForm: React.FC<Props> = ({ id, hideSubmit, onSubmit, onForgotPwd }) => {
  const { t } = useTranslation();
  const responsive = useResponsive();

  const dispatch = (blah: any) => blah;
  const onFinish = (values) => {
    Logger.log("Success:", values);
    dispatch?.({
      type: "auth/login",
      payload: {
        email: values.email.trim().toLowerCase(),
        password: values.password,
        remember: values.remember,
        onCompleted: (data) => {
          Logger.log(data);
          notification.success({
            message: t("who.login.success"),
          });
          onSubmit?.();
        },
        onError: (err) => {
          if (err.errors?.find((e) => e.code === "INVALID_CREDENTIALS")) {
            message.error(t("who.login.incorrect"));
          }
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
      name="login"
      layout="vertical"
      requiredMark={false}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
    >
      <Form.Item
        label={t("who.email")}
        name="email"
        rules={[
          {
            required: true,
            whitespace: true,
            message: t("who.signup.email.required"),
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label={t("who.pwd")}
        name="password"
        rules={[
          {
            required: true,
            message: t("who.signup.pwd.required"),
          },
        ]}
      >
        <Input.Password />
      </Form.Item>

      <Row justify="space-between" gutter={24}>
        <Col>
          <Form.Item name="remember" valuePropName="checked">
            <Checkbox>{t("who.login.remember")}</Checkbox>
          </Form.Item>
        </Col>
        <Col>
          <Button type="link" onClick={onForgotPwd}>
            {t("who.login.forgotPwd")}
          </Button>
        </Col>
      </Row>

      {!hideSubmit && (
        <Row justify="end">
          <Form.Item>
            <Button
              block={!responsive.md}
              type="primary"
              size="large"
              // loading={loading.effects["auth/login"]}
              htmlType="submit"
            >
              {t("who.login")}
            </Button>
          </Form.Item>
        </Row>
      )}
    </Form>
  );
};

export default LoginForm;
