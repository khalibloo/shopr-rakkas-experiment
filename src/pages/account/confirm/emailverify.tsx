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
const EmailVerifyPage: React.FC<Props> = ({ authenticated, dispatch }) => {
  const { t } = useTranslation();
  const location = useLocation();
  const query = location.query || {};
  const { email, token } = query;
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
            history.push("/");
          },
          onError: (err: APIException) => {
            // check if token expired or is invalid
            message.error(t("misc.error.generic"));
          },
        },
      });
    }
  }, []);

  if (!token || !email) {
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
}))(EmailVerifyPage);
ConnectedPage.title = "account.emailverify.title";

export default ConnectedPage;
