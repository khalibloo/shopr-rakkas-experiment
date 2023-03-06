import React, { useEffect } from "react";
import { useIntl, useLocation, history, connect, ConnectRC, Link } from "umi";
import { Button, message, notification, Result } from "antd";
import { ConnectState } from "@/models/connect";
import VSpacing from "@/components/VSpacing";
import Loader from "@/components/Loader";
import { APIException } from "@/apollo";

interface Props {
  authenticated: boolean;
}
const EmailChangePage: React.FC<Props> = ({ authenticated, dispatch }) => {
  const { t } = useTranslation();
  const location = useLocation();
  const query = location.query || {};
  const { token } = query;
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
            history.push("/profile");
          },
          onError: (err: APIException) => {
            // check if token expired or is invalid
            message.error(t("misc.error.generic"));
          },
        },
      });
    }
  }, []);

  if (!token) {
    return (
      <>
        <VSpacing height={24} />
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

const ConnectedPage = connect((state: ConnectState) => ({
  authenticated: state.auth.authenticated,
}))(EmailChangePage);
ConnectedPage.title = "account.emailchange.title";

export default ConnectedPage;
