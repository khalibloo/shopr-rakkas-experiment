import React, { useEffect } from "react";
import { Typography, Row, Col, List, Drawer, Collapse, Tree, Checkbox, Select, Slider, Input, Grid } from "antd";
import { useBoolean } from "ahooks";

import VSpacing from "@/components/VSpacing";
import ProductCard from "@/components/ProductCard";
import FilterBar from "@/components/FilterBar";
import _ from "lodash";
import ProductListItem from "./ProductListItem";
import { getAttributeName, getAttributeValueName, getCategoryName, getCollectionName } from "@/utils/utils";
import { useTranslation } from "react-i18next";
import { navigate, useLocation, useQuery, useSSQ } from "rakkasjs";
import qs from "query-string";
import { GraphQLClient } from "graphql-request";
import config from "@/config";
import { getSdk } from "@adapters/saleor/generated/graphql";

interface Props {
  showCategoryFilter?: boolean;
  showCollectionFilter?: boolean;
  categoryID?: string;
  collectionID?: string;
  view?: "grid" | "list";
  lang: string;
  listName: string;
}

interface QueryParams {
  q?: string;
  priceGte?: string;
  priceLte?: string;
  sortBy?: string;
  cats?: string[];
  colls?: string[];
  attrs?: string;
}

const Products: React.FC<Props> = ({
  showCategoryFilter,
  showCollectionFilter,
  categoryID,
  collectionID,
  lang,
  view = "grid",
  listName,
}) => {
  const { t } = useTranslation();
  const sortMap: { [key: string]: any } = {
    RELEVANCE: {
      field: "NAME",
      direction: "ASC",
    },
    PRICE_ASC: {
      field: "MINIMAL_PRICE",
      direction: "ASC",
    },
    PRICE_DESC: {
      field: "MINIMAL_PRICE",
      direction: "DESC",
    },
    DATE_DESC: {
      field: "DATE",
      direction: "DESC",
    },
  };
  const {
    current: { pathname, search: urlSearch },
  } = useLocation();
  const query = qs.parse(urlSearch);
  const { q: search, priceGte, priceLte, sortBy = "RELEVANCE", cats, colls, attrs } = query as QueryParams;

  // categories list
  const categoryList: string[] = categoryID ? [categoryID] : [];
  if (Array.isArray(cats)) {
    categoryList.push(...(cats as string[]));
  }

  // collections list
  const collectionList: string[] = collectionID ? [collectionID] : [];
  if (Array.isArray(colls)) {
    categoryList.push(...(colls as string[]));
  }

  // attributes list
  const attributes: { slug: string; values: string[] }[] = [] as any[];

  // fetch products
  const fetchProductsVars = {
    categoryID,
    collectionID,
    categoryList,
    collectionList,
    search: search || "",
    priceGte: priceGte ? Number(priceGte) : undefined,
    priceLte: priceLte ? Number(priceLte) : undefined,
    attributes,
    sortBy: sortMap[sortBy],
    prodsPerPage: 50,
    cursor: undefined,
    lang: lang.toUpperCase() as any,
  };

  const {
    data: { productsData, catTreeData, catSubtreeData, collectionsData },
  } = useSSQ(async (ctx) => {
    const client = new GraphQLClient(config.apiEndpoint, { fetch: ctx.fetch });
    const sdk = getSdk(client);
    const [productsData, catTreeData, catSubtreeData, collectionsData] = await Promise.all([
      sdk.productsQuery(fetchProductsVars),
      showCategoryFilter && !categoryID && sdk.categoryTreeQuery({ lang: lang.toUpperCase() as any }),
      showCategoryFilter &&
        categoryID &&
        sdk.categorySubtreeQuery({ categoryId: categoryID, lang: lang.toUpperCase() as any }),
      showCollectionFilter && sdk.collectionsQuery({ lang: lang.toUpperCase() as any }),
    ]);
    return {
      productsData,
      catTreeData: catTreeData || undefined,
      catSubtreeData: catSubtreeData || undefined,
      collectionsData: collectionsData || undefined,
    };
  });

  // categories filter data
  // const [fetchCatTree, { loading: catTreeFetching, data: catTreeData }] = useLazyQuery<categoryTreeQuery>(
  //   CATEGORY_TREE_QUERY,
  //   {
  //     variables: { lang: getLangCode() },
  //   }
  // );
  // const [fetchCatSubtree, { loading: catSubtreeFetching, data: catSubtreeData }] = useLazyQuery<
  //   categorySubtreeQuery,
  //   categorySubtreeQueryVariables
  // >(CATEGORY_SUBTREE_QUERY, { variables: { lang: getLangCode(), categoryId: categoryID as string } });

  // // collections filter data
  // const [fetchCollections, { loading: collectionsFetching, data: collectionsData }] = useLazyQuery<collectionsQuery>(
  //   COLLECTIONS_QUERY,
  //   {
  //     variables: { lang: getLangCode() },
  //   }
  // );

  const [filterDrawerOpen, { setTrue: openFilterDrawer, setFalse: closeFilterDrawer }] = useBoolean();
  const responsive = Grid.useBreakpoint();

  // useEffect(() => {
  //   // fetch categories tree
  //   if (showCategoryFilter) {
  //     if (categoryID) {
  //       fetchCatSubtree();
  //     } else {
  //       fetchCatTree();
  //     }
  //   }
  // }, []);

  // useEffect(() => {
  //   // fetch collections
  //   if (showCollectionFilter) {
  //     fetchCollections();
  //   }
  // }, []);

  // useEffect(() => {
  //   // Google Ecommerce - track product list view
  //   if (!config.gtmEnabled) {
  //     return;
  //   }
  //   if (!data?.products?.edges || data.products.edges.length === 0) {
  //     // no products fetched
  //     return;
  //   }
  //   const items = data.products.edges.map((edge, i) => {
  //     const p = edge.node;
  //     return {
  //       item_name: p.name,
  //       price: p.pricing?.priceRange?.start?.gross.amount.toString(),
  //       item_category: p.category?.name,
  //       item_list_name: listName,
  //       item_list_id: categoryID || collectionID,
  //       index: i,
  //     };
  //   });
  //   window.dataLayer.push({
  //     event: "view_item_list",
  //     ecommerce: {
  //       currency:
  //         data.products.edges[0].node.pricing?.priceRange?.start?.gross
  //           .currency,
  //       items,
  //     },
  //   });
  // }, [data?.products?.edges]);

  // price slider data
  const minPrice = productsData?.minPrice?.edges[0]?.node.pricing?.priceRange?.start?.gross.amount || 0;
  const maxPrice = productsData?.maxPrice?.edges[0]?.node.pricing?.priceRange?.start?.gross.amount;

  // transform categories tree to match ant Tree component data structure
  const mapCatTree = (catChildren) =>
    catChildren.edges.map((catEdge) => ({
      title: getCategoryName(catEdge.node),
      key: catEdge.node.id,
      children: mapCatTree(catEdge.node.children),
    }));

  const categoryTreeData = (categoryID ? catSubtreeData?.category?.children : catTreeData?.categories)?.edges.map(
    (catEdge) => ({
      title: getCategoryName(catEdge.node),
      key: catEdge.node.id,
      children: mapCatTree(catEdge.node.children),
    })
  );

  const filters = (
    <>
      <Collapse defaultActiveKey={["basic", "categories", "collections", "attributes"]} expandIconPosition="right">
        <Collapse.Panel id="basic-panel" header="Basic" key="basic">
          <div>
            <Input.Search
              id="filters-search-fld"
              allowClear
              onChange={(e) => navigate(`${pathname}?${qs.stringify({ ...query, q: e.target.value })}`)}
              placeholder="Filter by name..."
              value={search}
            />
          </div>
          <VSpacing height={16} />
          <div>
            <label>{t("search.filters.priceRange")}</label>
            <Slider
              id="filters-price-sldr"
              range
              defaultValue={[
                priceGte ? Number(priceGte) : minPrice,
                priceLte ? Number(priceLte) : (maxPrice as number),
              ]}
              onAfterChange={(value) =>
                navigate(`${pathname}?${qs.stringify({ ...query, priceGte: value[0], priceLte: value[1] })}`)
              }
              min={minPrice}
              max={maxPrice}
              step={0.01}
            />
          </div>
        </Collapse.Panel>
        {showCategoryFilter && categoryTreeData && (
          <Collapse.Panel id="cats-panel" header="Categories" key="categories">
            <Tree
              className="cats-tree"
              checkable
              autoExpandParent
              treeData={categoryTreeData}
              checkedKeys={categoryList}
              onCheck={(newSelection) =>
                navigate(`${pathname}?${qs.stringify({ ...query, cats: JSON.stringify(newSelection) })}`)
              }
              selectable={false}
            />
          </Collapse.Panel>
        )}
        {showCollectionFilter && collectionsData && (
          <Collapse.Panel id="colls-panel" header="Collections" key="collections">
            {collectionsData?.collections?.edges.map((collEdge) => (
              <div key={collEdge.node.id}>
                <Checkbox
                  id={`colls-checkbox-${collEdge.node.slug}`}
                  checked={collectionList.includes(collEdge.node.id)}
                  onChange={(e) => {
                    const newSelection = [...collectionList];
                    if (e.target.checked) {
                      if (!newSelection.includes(collEdge.node.id)) {
                        newSelection.push(collEdge.node.id);
                      }
                    } else {
                      _.remove(newSelection, (item) => item === collEdge.node.id);
                    }
                    navigate(
                      `${pathname}?${qs.stringify({
                        ...query,
                        colls: JSON.stringify(newSelection),
                      })}`
                    );
                  }}
                >
                  {getCollectionName(collEdge.node)}
                </Checkbox>
              </div>
            ))}
          </Collapse.Panel>
        )}
        <Collapse.Panel id="attrs-panel" header="Attributes" key="attributes">
          {productsData?.attributes?.edges.map((attrEdge) => {
            const attr = attrEdge.node;
            return (
              <div key={attr.id}>
                <label className="attrs-labels">{getAttributeName(attr)}</label>
                <Select
                  id={`attr-select-${attr.slug}`}
                  allowClear
                  autoClearSearchValue
                  className="w-full"
                  mode="multiple"
                  showArrow
                  onChange={(values) => {
                    const newAttrs = [...attributes];
                    const entry = {
                      slug: attr.slug as string,
                      values: values as string[],
                    };
                    const index = newAttrs.findIndex((a) => a.slug === attr.slug);
                    if (index === -1) {
                      newAttrs.push(entry);
                    } else {
                      if (values.length > 0) {
                        newAttrs[index] = entry;
                      } else {
                        _.remove(newAttrs, (a) => a.slug === attr.slug);
                      }
                    }
                    navigate(
                      `${pathname}?${{
                        ...query,
                        attrs: JSON.stringify(newAttrs),
                      }}`
                    );
                  }}
                >
                  {attr.choices?.edges.map((val) => {
                    if (!val) {
                      return null;
                    }
                    return (
                      <Select.Option
                        id={`attrs-${attr.slug}-${val.node.slug}`}
                        key={val.node.id}
                        value={val.node.slug as string}
                      >
                        {getAttributeValueName(val)}
                      </Select.Option>
                    );
                  })}
                </Select>
                <VSpacing height={16} />
              </div>
            );
          })}
        </Collapse.Panel>
      </Collapse>
    </>
  );
  return (
    <>
      <Drawer
        title={t("search.filters")}
        open={filterDrawerOpen}
        onClose={closeFilterDrawer}
        placement="left"
        width={responsive.md ? "40%" : "60%"}
      >
        {filters}
      </Drawer>
      <Row justify="center">
        <Col span={22}>
          <Row gutter={24} align="bottom">
            <Col xs={0} lg={6} xxl={8}>
              <VSpacing height={24} />
              <Typography.Title level={4}>{t("search.filters")}</Typography.Title>
            </Col>
            <Col xs={24} lg={18} xxl={16}>
              <FilterBar
                id="sort-select"
                hideFilters={responsive.lg}
                onSortChange={(val) => navigate(`${pathname}?${qs.stringify({ ...query, sortBy: val })}`)}
                value={sortBy}
                onOpenFilterDrawer={openFilterDrawer}
              />
            </Col>
          </Row>
          <Row gutter={24}>
            <Col id="filters-col" xs={0} lg={6} xxl={8}>
              {filters}
            </Col>
            <Col xs={24} lg={18} xxl={16}>
              <List
                dataSource={productsData?.products?.edges}
                grid={
                  view === "grid"
                    ? {
                        gutter: 24,
                        xs: 1,
                        sm: 2,
                        md: 3,
                        lg: 3,
                        xl: 4,
                        xxl: 6,
                      }
                    : undefined
                }
                // loading={fetching}
                renderItem={(edge, i) => {
                  const product = edge.node;
                  return (
                    <List.Item className="product-list-items" id={`product-list-item-${i}`} key={product.id}>
                      <div className="w-full">
                        {view === "grid" ? (
                          <Row justify="center">
                            <Col span={24} style={{ maxWidth: 240 }}>
                              <ProductCard
                                className="product-grid-cards"
                                product={product}
                                listName={listName}
                                listID={categoryID || collectionID}
                                listIndex={i}
                              />
                            </Col>
                          </Row>
                        ) : (
                          <ProductListItem className="product-list-cards" product={product} />
                        )}
                      </div>
                    </List.Item>
                  );
                }}
              />
            </Col>
          </Row>
        </Col>
      </Row>
    </>
  );
};

export default Products;
