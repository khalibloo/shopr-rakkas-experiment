import React, { useEffect } from "react";
import { Button, message, notification, Result } from "antd";
import Loader from "@/components/Loader";
import { Head, Link, navigate, useLocation } from "rakkasjs";
import { useTranslation } from "react-i18next";

const EmailChangePage: React.FC = () => {
  const { t } = useTranslation();
  const {
    current: { searchParams },
  } = useLocation();
  const token = searchParams.get("token");
  const dispatch = (x) => x;
  useEffect(() => {
    if (token) {
      dispatch?.({
        type: "auth/confirmEmailChange",
        payload: {
          token,
          onCompleted: () => {
            notification.success({
              message: t("who.emailchange.success"),
              description: t("who.emailchange.success.desc"),
            });
            navigate("/profile");
          },
          onError: (err) => {
            // check if token expired or is invalid
            message.error(t("misc.error.generic"));
          },
        },
      });
    }
  }, []);

  if (!token) {
    return (
      <div className="pt-6 pb-12">
        <Head title={t("account.emailchange.title")} />
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

export default EmailChangePage;
