import { Form, Input, Button, message } from "antd";
import Logger from "@/utils/logger";
import { useTranslation } from "react-i18next";

interface Props {
  id?: string;
  hideSubmit?: boolean;
  onSubmit?: () => void;
}

const GuestForm: React.FC<Props> = ({ id, hideSubmit, onSubmit }) => {
  const { t } = useTranslation();

  const dispatch = (blah: any) => blah;
  const onFinish = (values) => {
    Logger.log("Success:", values);
    dispatch?.({
      type: "auth/setGuestEmail",
      payload: {
        email: values.email.trim().toLowerCase(),
        onCompleted: () => {
          onSubmit?.();
        },
        onError: (err) => {
          message.error(t("misc.error"));
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
      name="guest"
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
          {
            type: "email",
            message: t("who.signup.email.invalid"),
          },
        ]}
      >
        <Input />
      </Form.Item>

      {!hideSubmit && (
        <Form.Item>
          <Button
            htmlType="submit"
            // loading={loading.effects["auth/setGuestEmail"]}
            shape="round"
            onClick={() =>
              dispatch?.({
                type: "cart/setGuestCartModalOpen",
                payload: { open: false },
              })
            }
          >
            Continue as a guest
          </Button>
        </Form.Item>
      )}
    </Form>
  );
};

export default GuestForm;
