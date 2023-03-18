import React, { useEffect } from "react";
import Loader from "@/components/Loader";
import { Button, notification, Result } from "antd";
import { FrownOutlined } from "@ant-design/icons";
import { Head, Link, navigate, useLocation } from "rakkasjs";
import { useTranslation } from "react-i18next";

const AccountDeactivatePage: React.FC = () => {
  const { t } = useTranslation();
  const {
    current: { searchParams },
  } = useLocation();
  const token = searchParams.get("token");

  const dispatch = (x) => x;
  useEffect(() => {
    if (token) {
      dispatch?.({
        type: "auth/confirmAccountDeactivation",
        payload: {
          token,
          onCompleted: () => {
            notification.error({
              message: t("account.deactivate.success"),
              description: t("account.deactivate.success.desc"),
              icon: <FrownOutlined />,
            });
            navigate("/");
          },
        },
      });
    }
  }, []);

  if (!token) {
    return (
      <div className="pt-6 pb-12">
        <Head title={t("account.deactivate.title") as string} />
        <Result
          status="error"
          extra={[
            <Link href="/" key="0">
              <Button type="primary">{t("misc.backToHome")}</Button>
            </Link>,
          ]}
          title={t("account.confirm.invalidUrl")}
          subTitle={t("account.confirm.invalidUrl.desc")}
        />
      </div>
    );
  }

  return <Loader />;
};

export default AccountDeactivatePage;
