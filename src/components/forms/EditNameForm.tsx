import { Form, Input, Button, Row, Col, notification, message } from "antd";
import { useResponsive } from "ahooks";
import Logger from "@/utils/logger";
import { useTranslation } from "react-i18next";

interface Props {
  id?: string;
  firstName: string;
  lastName: string;
  hideSubmit?: boolean;
  onSubmit?: () => void;
}

const EditNameForm: React.FC<Props> = ({ id, firstName, lastName, hideSubmit, onSubmit }) => {
  const { t } = useTranslation();
  const responsive = useResponsive();
  const dispatch = (blah: any) => blah;

  const onFinish = (values) => {
    Logger.log("Success:", values);
    dispatch?.({
      type: "auth/updateName",
      payload: {
        firstName: values.firstName.trim(),
        lastName: values.lastName.trim(),
        onCompleted: (data) => {
          Logger.log(data);

          notification.success({
            message: t("misc.save.success"),
          });
          onSubmit?.();
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
      name="edit-name"
      layout="vertical"
      requiredMark={false}
      initialValues={{ firstName, lastName }}
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

      {!hideSubmit && (
        <Form.Item>
          <Button
            block={!responsive.md}
            type="primary"
            size="large"
            // loading={loading.effects["auth/updateName"]}
            htmlType="submit"
          >
            {t("misc.saveChanges")}
          </Button>
        </Form.Item>
      )}
    </Form>
  );
};

export default EditNameForm;
