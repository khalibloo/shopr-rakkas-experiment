import { Form, Input, Button, notification, message } from "antd";
import { useResponsive } from "ahooks";
import Logger from "@/utils/logger";
import { useTranslation } from "react-i18next";

interface Props {
  id?: string;
  hideSubmit?: boolean;
  onSubmit?: () => void;
}

const ChangePasswordForm: React.FC<Props> = ({ id, hideSubmit, onSubmit }) => {
  const { t } = useTranslation();
  const responsive = useResponsive();

  const dispatch = (blah: any) => blah;
  const onFinish = (values) => {
    Logger.log("Success:", values);
    dispatch?.({
      type: "auth/changePassword",
      payload: {
        oldPassword: values.oldPassword,
        newPassword: values.password,
        onCompleted: (data) => {
          Logger.log(data);
          notification.success({
            message: t("misc.save.success"),
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
      name="change-password"
      layout="vertical"
      requiredMark={false}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
    >
      <Form.Item
        name="oldPassword"
        label={t("settings.changePwd.oldPwd")}
        rules={[
          {
            required: true,
            message: t("who.signup.pwd.required"),
          },
        ]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item
        name="password"
        label={t("settings.changePwd.newPwd")}
        dependencies={["oldPassword"]}
        rules={[
          {
            required: true,
            message: t("who.signup.pwd.required"),
          },
          {
            min: 8,
            message: t("who.signup.pwd.minLength"),
          },
          ({ getFieldValue }) => ({
            validator(rule, value) {
              if (!value || getFieldValue("oldPassword") !== value) {
                return Promise.resolve();
              }
              return Promise.reject(t("settings.changePwd.newPwd.match"));
            },
          }),
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
        <Form.Item>
          <Button
            block={!responsive.md}
            type="primary"
            size="large"
            // loading={loading.effects["auth/changePassword"]}
            htmlType="submit"
          >
            {t("misc.saveChanges")}
          </Button>
        </Form.Item>
      )}
    </Form>
  );
};

export default ChangePasswordForm;
