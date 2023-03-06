import * as React from "react";
import { Row, Col, Typography, Select, Button } from "antd";
import { FilterOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";

interface Props {
  id?: string;
  hideFilters?: boolean;
  onSortChange?: (val: string) => void;
  onOpenFilterDrawer?: () => void;
  value?: string;
}
const FilterBar: React.FC<Props> = ({ id, value, hideFilters, onSortChange, onOpenFilterDrawer }) => {
  const { t } = useTranslation();
  return (
    <Row className="py-4" justify={hideFilters ? "end" : "space-between"} align="bottom">
      {!hideFilters && (
        <Col>
          <Button id="filters-btn" onClick={onOpenFilterDrawer}>
            <FilterOutlined /> {t("search.filters")}
          </Button>
        </Col>
      )}

      <Col className="w-40">
        <div>
          <Typography.Text>{t("search.sortby")}</Typography.Text>
        </div>
        <div>
          <Select
            id={id}
            className="w-full"
            defaultValue="RELEVANCE"
            value={value}
            onChange={(value) => onSortChange?.(value)}
          >
            <Select.Option value="RELEVANCE">{t("search.sort.relevance")}</Select.Option>
            <Select.Option value="PRICE_ASC">{t("search.sort.price.lowtohigh")}</Select.Option>
            <Select.Option value="PRICE_DESC">{t("search.sort.price.hightolow")}</Select.Option>
            <Select.Option value="DATE_DESC">{t("search.sort.newest")}</Select.Option>
          </Select>
        </div>
      </Col>
    </Row>
  );
};

export default FilterBar;
