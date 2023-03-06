import { AutoComplete, Input, Typography } from "antd";
import { InputProps } from "antd/lib/input";
import config from "@/config";
// import MeiliSearch, { Index } from "meilisearch";
import _ from "lodash";
import { useTranslation } from "react-i18next";
import React, { useEffect, useState } from "react";
import { Link, useLocation, navigate } from "rakkasjs";
import qs from "query-string";

interface ProductDocument {
  id: number;
  name: string;
  description: string;
  category: string;
  slug: string;
}

// let productsIndex: Index<ProductDocument>;
// if (config.meiliSearchUrl) {
//   const client = new MeiliSearch({
//     host: config.meiliSearchUrl.href,
//     apiKey: config.meiliSearchKey,
//   });
//   productsIndex = client.getIndex("products");
// }

interface Props extends InputProps {
  onSearch?: (query: string) => void;
}

const ProductSearch: React.FC<Props> = ({ onSearch, ...rest }) => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<ProductDocument[]>([]);
  const {
    current: { pathname, search: urlSearch },
  } = useLocation();
  const query = qs.parse(urlSearch);

  // monitor the search query in url for changes from other sources
  useEffect(() => {
    setResults([]);
    if (pathname === "/search") {
      setSearchQuery(query.q || "");
    } else {
      setSearchQuery("");
    }
  }, [pathname, query.q]);

  return (
    <AutoComplete
      dropdownMatchSelectWidth={252}
      className="w-full no-hover-border"
      options={results.map((hit) => ({
        value: hit.name,
        key: hit.slug,
        label: (
          <Link href={`/products/${hit.slug}`}>
            <div>
              <Typography.Text>{hit.name}</Typography.Text>
            </div>
          </Link>
        ),
      }))}
      onSelect={(value, option) => {
        navigate(`/products/${option.key}`);
      }}
      onSearch={_.debounce((val) => {
        if (config.meiliSearchUrl) {
          // productsIndex.search(val, { limit: 8 }).then((res) => setResults(res.hits));
        }
      }, 100)}
      onChange={(val) => setSearchQuery(val)}
      value={searchQuery}
    >
      <Input.Search
        id="product-search-fld"
        size="large"
        aria-label={t("navbar.search.placeholder")}
        placeholder={t("navbar.search.placeholder")}
        onSearch={(search) => {
          if (search.trim().length === 0) {
            return;
          }
          navigate(
            `/search?${qs.stringify({
              // preserve query filters if on search page
              ...(pathname === "/search" ? query : {}),
              q: search.trim(),
            })}`
          );
          document.getElementById("product-search-fld")?.blur();
          onSearch?.(query);
        }}
        {...rest}
      />
    </AutoComplete>
  );
};

export default ProductSearch;
