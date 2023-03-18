import React from "react";
import { Typography, Row, Col } from "antd";
import { Head, PageProps, useLocation } from "rakkasjs";
import { useTranslation } from "react-i18next";

import Products from "@/components/Products";
// import config from "@/config";

const SearchPage: React.FC<PageProps> = () => {
  const { t } = useTranslation();
  const {
    current: { searchParams },
  } = useLocation();
  const query = searchParams.get("q");

  // useEffect(() => {
  //   if (config.gtmEnabled && query) {
  //     window.dataLayer.push({ event: "search", search_term: query });
  //   }
  // }, [query]);

  return (
    <div className="pt-6 pb-12">
      <Head title={t("search.title") as string} meta={[{ name: "description", content: t("search.meta") as string }]} />
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
    </div>
  );
};

export default SearchPage;
