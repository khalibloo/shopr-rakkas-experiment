import { Form, Input, Checkbox, Button, Row, Col, notification, message } from "antd";
import { useResponsive } from "ahooks";
import Logger from "@/utils/logger";
import { useTranslation } from "react-i18next";

interface Props {
  id?: string;
  hideSubmit?: boolean;
  onSubmit?: () => void;
}

const SignupForm: React.FC<Props> = ({ id, hideSubmit, onSubmit }) => {
  const { t } = useTranslation();
  const responsive = useResponsive();

  const dispatch = (blah: any) => blah;
  const onFinish = (values) => {
    Logger.log("Success:", values);
    dispatch?.({
      type: "auth/signup",
      payload: {
        firstName: values.firstName.trim(),
        lastName: values.lastName.trim(),
        email: values.email.trim().toLowerCase(),
        password: values.password,
        remember: values.remember,
        onCompleted: (data) => {
          Logger.log(data);
          notification.success({
            message: t("who.signup.success"),
          });
          if (data.accountRegister?.requiresConfirmation) {
            notification.success({
              message: t("who.signup.success.confirm"),
              description: t("who.signup.success.confirm.desc"),
              duration: 5,
            });
          }
          onSubmit?.();
        },
        onError: (err: APIException) => {
          if (err.errors?.find((e) => e.code === "UNIQUE")) {
            message.error(t("who.signup.email.unique"));
          }
        },
      },
    });
  };

  const onFinishFailed = (errorInfo) => {
    Logger.log("Failed:", errorInfo);
    message.error(t("misc.form.invalid"));
  };

  return (
    <Form
      id={id}
      name="signup"
      layout="vertical"
      requiredMark={false}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
    >
      <Row gutter={24}>
        <Col xs={24} sm={12}>
          <Form.Item
            label={t("who.signup.fname")}
            name="firstName"
            rules={[
              {
                required: true,
                whitespace: true,
                message: t("who.signup.fname.required"),
              },
              {
                min: 2,
                transform: (value) => value.trim(),
                message: t("who.signup.name.min"),
              },
              {
                max: 100,
                transform: (value) => value.trim(),
                message: t("who.signup.name.max"),
              },
            ]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12}>
          <Form.Item
            label={t("who.signup.lname")}
            name="lastName"
            rules={[
              {
                required: true,
                whitespace: true,
                message: t("who.signup.lname.required"),
              },
              {
                min: 2,
                transform: (value) => value.trim(),
                message: t("who.signup.name.min"),
              },
              {
                max: 100,
                transform: (value) => value.trim(),
                message: t("who.signup.name.max"),
              },
            ]}
          >
            <Input />
          </Form.Item>
        </Col>
      </Row>

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

      <Row gutter={24}>
        <Col xs={24} sm={12}>
          <Form.Item
            label={t("who.pwd")}
            name="password"
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
        </Col>
        <Col xs={24} sm={12}>
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
        </Col>
      </Row>

      <Form.Item
        name="agree"
        valuePropName="checked"
        rules={[
          {
            validator: (rule, value) => (value ? Promise.resolve() : Promise.reject(t("who.signup.agree.required"))),
          },
        ]}
      >
        <Checkbox>
          {t("who.signup.agree", {
            terms: (
              <a href="/pages/terms" target="_blank" rel="noreferrer noopener">
                {t("who.terms")}
              </a>
            ),
            priv: (
              <a href="/pages/privacy" target="_blank" rel="noreferrer noopener">
                {t("who.privacyPolicy")}
              </a>
            ),
          })}
        </Checkbox>
      </Form.Item>

      {!hideSubmit && (
        <Row justify="end">
          <Form.Item>
            <Button
              block={!responsive.md}
              type="primary"
              size="large"
              // loading={loading.effects["auth/signup"]}
              htmlType="submit"
            >
              {t("who.signup")}
            </Button>
          </Form.Item>
        </Row>
      )}
    </Form>
  );
};

export default SignupForm;
