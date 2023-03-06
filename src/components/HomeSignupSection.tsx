import React from "react";
import { Typography, Row, Col, Button } from "antd";
import { HomeSignupConfig } from ".altrc";
// import config from "@/config";
import { useTranslation } from "react-i18next";

interface Props extends HomeSignupConfig {}
const HomeSignupSection: React.FC<Props> = ({ buttonText, message, googleAnalyticsPromoData }) => {
  const { t } = useTranslation();

  // Google Ecommerce - track promo view
  // useEffect(() => {
  //   if (config.gtmEnabled && googleAnalyticsPromoData) {
  //     window.dataLayer.push({
  //       event: "view_promotion",
  //       ecommerce: {
  //         ...googleAnalyticsPromoData,
  //       },
  //     });
  //   }
  // }, []);

  // Google Ecommerce - track promo click
  // const trackPromoClick = () => {
  //   if (config.gtmEnabled && googleAnalyticsPromoData) {
  //     window.dataLayer.push({
  //       event: "select_promotion",
  //       ecommerce: {
  //         ...googleAnalyticsPromoData,
  //       },
  //     });
  //   }
  // };

  const dispatch = (x) => x;
  const authenticated = false;
  if (authenticated) {
    return null;
  }

  return (
    <Row className="signup-container" justify="center">
      <Col className="text-center my-8">
        <div className="mb-8">
          <Typography.Text className="text-center text-2xl">{message || "Create Your Account Today"}</Typography.Text>
        </div>
        <Button
          type="primary"
          onClick={() => {
            dispatch({
              type: "auth/setAuthModalOpen",
              payload: { open: true },
            });
            // trackPromoClick();
          }}
          shape="round"
          size="large"
        >
          {buttonText || t("who.signup")}
        </Button>
      </Col>
    </Row>
  );
};

export default HomeSignupSection;
