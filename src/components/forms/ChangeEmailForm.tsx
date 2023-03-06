import { Form, Input, Button, notification, message } from "antd";
import { useResponsive } from "ahooks";
import Logger from "@/utils/logger";
import { useTranslation } from "react-i18next";

interface Props {
  id?: string;
  email: string;
  hideSubmit?: boolean;
  onSubmit?: () => void;
}

const ChangeEmailForm: React.FC<Props> = ({ id, email, hideSubmit, onSubmit }) => {
  const { t } = useTranslation();
  const responsive = useResponsive();

  const dispatch = (blah: any) => blah;
  const onFinish = (values) => {
    Logger.log("Success:", values);
    dispatch?.({
      type: "auth/requestEmailChange",
      payload: {
        email: values.email.trim().toLowerCase(),
        password: values.password,
        onCompleted: (data) => {
          Logger.log(data);
          notification.success({
            message: t("misc.save.success"),
            description: t("who.signup.success.confirm.desc"),
          });
          onSubmit?.();
        },
        onError: (err) => {
          if (err.errors?.find((e) => e.code === "INVALID_PASSWORD")) {
            message.error(t("settings.changePwd.oldPwd.incorrect"));
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
      name="change-email"
      layout="vertical"
      requiredMark={false}
      initialValues={{ email }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
    >
      <Form.Item
        label={t("profile.changeEmail.newEmail")}
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
          () => ({
            validator(rule, value) {
              if (!value || value.toLowerCase().trim() !== email.toLowerCase().trim()) {
                return Promise.resolve();
              }
              return Promise.reject(t("profile.changeEmail.newEmail.match"));
            },
          }),
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label={t("who.pwd.reenter")}
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

      {!hideSubmit && (
        <Form.Item>
          <Button
            block={!responsive.md}
            type="primary"
            size="large"
            // loading={loading.effects["auth/requestEmailChange"]}
            htmlType="submit"
          >
            {t("misc.saveChanges")}
          </Button>
        </Form.Item>
      )}
    </Form>
  );
};

export default ChangeEmailForm;
