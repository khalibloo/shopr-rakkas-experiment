import React, { useEffect } from "react";
import { Typography, Row, Col } from "antd";
import { Helmet } from "react-helmet";

import { useIntl, useLocation } from "umi";
import VSpacing from "@/components/VSpacing";
import Products from "@/components/Products";
import config from "@/config";

const SearchPage = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const query = location.query?.q || null;

  useEffect(() => {
    if (config.gtmEnabled && query) {
      window.dataLayer.push({ event: "search", search_term: query });
    }
  }, [query]);

  return (
    <div>
      <Helmet>
        <meta name="description" content={t("search.meta")} />
      </Helmet>
      <VSpacing height={24} />
      <Row justify="center">
        <Col span={22}>
          <Typography.Title id="page-heading" className="text-center" level={1}>
            {t("search.heading")}
          </Typography.Title>
          {query && (
            <Typography.Title id="page-subheading" className="text-center" level={3}>
              <i>"{query}"</i>
            </Typography.Title>
          )}
          <Products showCategoryFilter showCollectionFilter view="list" listName="Search Results" />
        </Col>
      </Row>
      <VSpacing height={48} />
    </div>
  );
};

SearchPage.title = "search.title";
export default SearchPage;
