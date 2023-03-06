import React from "react";
import { Typography, Row, Col } from "antd";
import { Head, PageProps, useLocation } from "rakkasjs";
import { useTranslation } from "react-i18next";

import Products from "@/components/Products";
// import config from "@/config";

interface Params {
  lang: string;
}

const SearchPage: React.FC<PageProps<Params>> = ({ params: { lang } }) => {
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
      <Head title={t("search.title")} meta={[{ name: "description", content: t("search.meta") }]} />
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
          <Products showCategoryFilter showCollectionFilter view="list" listName="Search Results" lang={lang} />
        </Col>
      </Row>
    </div>
  );
};

export default SearchPage;
