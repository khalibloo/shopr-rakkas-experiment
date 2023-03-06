// import * as React from "react";
import { Form, Input, Button, Row, Col, notification, message, Select } from "antd";
// import { useIntl, ConnectRC, connect } from "umi";
import { useResponsive } from "ahooks";
import { countries as countriesObj, Country } from "countries-list";
import countries from "@/countries";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import Logger from "@/utils/logger";
// import { ConnectState, Loading } from "@/models/connect";
// import { AddressInput } from "@/globalTypes";
// import { UserAddressCreateMutation } from "@/mutations/types/UserAddressCreateMutation";
// import { APIException } from "@/apollo";
// import { AddressDetails } from "@/fragments/types/AddressDetails";
import { useTranslation } from "react-i18next";

interface Props {
  authenticated: boolean;
  id?: string;
  firstName?: string;
  lastName?: string;
  address?: AddressDetails;
  hideSubmit?: boolean;
  onSubmit?: (address: AddressInput) => void;
}

const AddressForm: React.FC<Props> = ({ authenticated, id, firstName, lastName, address, hideSubmit, onSubmit }) => {
  const { t } = useTranslation();
  const responsive = useResponsive();
  const isEditing = address?.id != null;

  const dispatch = (blah: any) => blah;
  const onFinish = (values) => {
    Logger.log("Success:", values);
    const addressData: AddressInput = {
      firstName: values.firstName.trim(),
      lastName: values.lastName.trim(),
      phone: parsePhoneNumberFromString(values.phone)?.formatInternational(),
      companyName: values.companyName,
      streetAddress1: values.streetAddress1,
      streetAddress2: values.streetAddress2,
      city: values.city,
      postalCode: values.postalCode,
      country: values.country,
      countryArea: values.countryArea,
    };

    if (!authenticated) {
      onSubmit?.(addressData);
      return;
    }
    dispatch?.({
      type: isEditing ? "auth/updateAddress" : "auth/createAddress",
      payload: {
        id: isEditing ? address?.id : undefined,
        address: addressData,
        onCompleted: (data) => {
          Logger.log(data);
          notification.success({
            message: t("misc.save.success"),
          });
          onSubmit?.(addressData);
        },
        onError: (err) => {
          if (err.errors?.find((e) => e.code === "INVALID" && e.field === "postalCode")) {
            message.error(t("form.address.postalCode.invalid"));
          } else {
            message.error(t("form.address.fail"));
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
      name="edit-name"
      layout="vertical"
      requiredMark={false}
      initialValues={{
        ...address,
        country: address?.country?.code,
        firstName: address?.firstName || firstName,
        lastName: address?.lastName || lastName,
      }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
    >
      <Row gutter={24}>
        <Col xs={24} sm={12}>
          <Form.Item
            label={t("who.signup.fname")}
            name="firstName"
            validateFirst
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
            validateFirst
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
      <Row gutter={24}>
        <Col xs={24} sm={12}>
          <Form.Item
            label={t("form.address.phone")}
            name="phone"
            validateFirst
            rules={[
              {
                required: true,
                whitespace: true,
                message: t("form.address.phone.required"),
              },
              () => ({
                validator(rule, value) {
                  if (!value || parsePhoneNumberFromString(value)?.isValid()) {
                    return Promise.resolve();
                  }
                  return Promise.reject(t("form.address.phone.invalid"));
                },
              }),
            ]}
          >
            <Input type="tel" />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12}>
          <Form.Item label={`${t("form.address.companyName")} (${t("form.optional")})`} name="companyName">
            <Input />
          </Form.Item>
        </Col>
      </Row>

      <Form.Item label={t("form.address.streetAddress1")} name="streetAddress1">
        <Input />
      </Form.Item>

      <Form.Item label={t("form.address.streetAddress2")} name="streetAddress2">
        <Input />
      </Form.Item>

      <Row gutter={24}>
        <Col xs={24} sm={12}>
          <Form.Item
            label={t("form.address.city")}
            name="city"
            rules={[
              {
                required: true,
                whitespace: true,
                message: t("form.address.city.required"),
              },
            ]}
          >
            <Input type="tel" />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12}>
          <Form.Item
            label={t("form.address.state")}
            name="countryArea"
            rules={[
              {
                required: true,
                whitespace: true,
                message: t("form.address.state.required"),
              },
            ]}
          >
            <Input />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={24}>
        <Col xs={24} sm={12}>
          <Form.Item
            label={t("form.address.postalCode")}
            name="postalCode"
            validateFirst
            rules={[
              {
                required: true,
                whitespace: true,
                message: t("form.address.postalCode.required"),
              },
              {
                len: 5,
                whitespace: true,
                message: t("form.address.postalCode.len"),
              },
              {
                pattern: /^\d+$/,
                message: t("form.address.postalCode.type"),
              },
            ]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12}>
          <Form.Item label={t("form.address.country")} name="country">
            <Select
              showSearch
              optionFilterProp="children"
              filterOption={(input, option) => {
                const optionStr = (countriesObj[option?.value] as Country).name.toLowerCase().substr(0, input.length);

                return (
                  new Intl.Collator(navigator.language.substr(0, 2), {
                    sensitivity: "base",
                    usage: "search",
                  }).compare(optionStr, input.toLowerCase()) === 0
                );
              }}
            >
              {countries.map((c) => (
                <Select.Option key={c.code} value={c.code}>
                  {c.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
      </Row>

      {!hideSubmit && (
        <Form.Item>
          <Button
            block={!responsive.md}
            type="primary"
            size="large"
            // loading={isLoading}
            htmlType="submit"
          >
            {t("misc.save")}
          </Button>
        </Form.Item>
      )}
    </Form>
  );
};

export default AddressForm;
