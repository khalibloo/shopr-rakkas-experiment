import React, { useEffect } from "react";
import { Button, message, notification, Result } from "antd";
import { useTranslation } from "react-i18next";
import { Head, Link, navigate, useLocation } from "rakkasjs";
import Loader from "@/components/Loader";

const EmailVerifyPage: React.FC = () => {
  const { t } = useTranslation();
  const {
    current: { searchParams },
  } = useLocation();
  const email = searchParams.get("email");
  const token = searchParams.get("token");
  const dispatch = (x) => x;
  useEffect(() => {
    if (email && token) {
      dispatch?.({
        type: "auth/verifyEmail",
        payload: {
          email,
          token,
          onCompleted: () => {
            notification.success({
              message: t("who.emailVerify.success"),
              description: t("who.emailVerify.success.desc"),
            });
            navigate("/");
          },
          onError: () => {
            // check if token expired or is invalid
            message.error(t("misc.error.generic"));
          },
        },
      });
    }
  }, []);

  if (!token || !email) {
    return (
      <div className="pt-6 pb-12">
        <Head title={t("account.emailverify.title") as string} />
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

export default EmailVerifyPage;
