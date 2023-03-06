import React, { useEffect } from "react";
import { useIntl, useLocation, history, connect, ConnectRC, Link } from "umi";
import Loader from "@/components/Loader";
import { Button, notification, Result } from "antd";
import { FrownOutlined } from "@ant-design/icons";
import VSpacing from "@/components/VSpacing";

const AccountDeactivatePage: ConnectRC = ({ dispatch }) => {
  const { t } = useTranslation();
  const location = useLocation();
  const token = location.query?.token || null;
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
            history.push("/");
          },
        },
      });
    }
  }, []);

  if (!token) {
    return (
      <>
        <VSpacing height={48} />
        <Result
          status="error"
          extra={[
            <Link to="/">
              <Button type="primary" key="0">
                {t("misc.backToHome")}
              </Button>
            </Link>,
          ]}
          title={t("account.confirm.invalidUrl")}
          subTitle={t("account.confirm.invalidUrl.desc")}
        />
        <VSpacing height={48} />
      </>
    );
  }

  return <Loader />;
};

const ConnectedPage = connect()(AccountDeactivatePage);
ConnectedPage.title = "account.deactivate.title";

export default ConnectedPage;
