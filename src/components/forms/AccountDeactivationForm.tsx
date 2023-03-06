import * as React from "react";
import { Form, Input, Button, notification, message } from "antd";
import { useTranslation } from "react-i18next";
import { useResponsive } from "ahooks";
import Logger from "@/utils/logger";
import { FrownOutlined } from "@ant-design/icons";

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
      type: "auth/requestAccountDeactivation",
      payload: {
        onCompleted: (data) => {
          Logger.log(data);
          notification.error({
            message: t("account.deactivate.request.success"),
            description: t("account.deactivate.request.success.desc"),
            duration: 5,
            icon: <FrownOutlined />,
          });
          onSubmit?.();
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
      name="account-request-deactivation"
      layout="vertical"
      requiredMark={false}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
    >
      <Form.Item
        label={t("account.deactivate.challenge")}
        name="challenge"
        rules={[
          {
            required: true,
            message: t("account.deactivate.challenge.match"),
          },
          () => ({
            validator(rule, value) {
              if (!value || value.toLowerCase() === t("account.deactivate.challenge.answer").toLowerCase()) {
                return Promise.resolve();
              }
              return Promise.reject(t("account.deactivate.challenge.match"));
            },
          }),
        ]}
      >
        <Input placeholder="confirm" />
      </Form.Item>

      {!hideSubmit && (
        <Form.Item>
          <Button block={!responsive.md} type="primary" size="large" loading={isLoading} htmlType="submit">
            {t("settings.shutdownAccount")}
          </Button>
        </Form.Item>
      )}
    </Form>
  );
};

export default SignupForm;
