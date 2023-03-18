import React, { useState, useEffect, useRef } from "react";
import { Typography, Row, Col, Button, Select, List, Affix, Card, Carousel, notification } from "antd";
import { Head, PageProps, usePageContext, useSSQ } from "rakkasjs";
import type { ListGridType } from "antd/lib/list";
import type { CarouselRef } from "antd/es/carousel";
import { useResponsive, useSize } from "ahooks";
import { last } from "lodash";
import { useTranslation } from "react-i18next";
import { GraphQLClient } from "graphql-request";
import clsx from "clsx";

import RichTextContent from "@/components/RichTextContent";
import AspectRatio from "@/components/AspectRatio";
import {
  formatPrice,
  formatTitle,
  getAttributeName,
  getAttributeValueName,
  getProductDescriptionJson,
  getProductName,
  getScreenSize,
} from "@/utils/utils";
import ProductCard from "@/components/ProductCard";
import { DownOutlined, UpOutlined } from "@ant-design/icons";
import NumberInput from "@/components/NumberInput";
import config from "@/config";
import { getSdk } from "@adapters/saleor/generated/graphql";

interface AttrValue {
  id: string;
  name: string;
  translation?: {
    id: string;
    name: string;
  };
}

interface VariantAttr {
  id: string;
  name: string;
  values: AttrValue[];
  translation?: {
    id: string;
    name: string;
  };
  selection: string | undefined;
}

interface Params {
  product: string;
}

const ProductDetailPage: React.FC<PageProps<Params>> = ({ params: { product: productSlug } }) => {
  const { lang } = usePageContext();
  const { t } = useTranslation();
  const dispatch = (x) => x;

  const {
    data: { product },
  } = useSSQ(async (ctx) => {
    const client = new GraphQLClient(config.apiEndpoint, { fetch: ctx.fetch });
    const sdk = getSdk(client);
    const res = await sdk.productDetailQuery({ productSlug, lang: lang.toUpperCase() as any });
    return res;
  });
  const [selectedImg, setSelectedImg] = useState(0);
  const [variantAttrs, setVariantAttrs] = useState<VariantAttr[]>([]);
  const [selectedVariant, setSelectedVariant] = useState<any>(null);
  const [qty, setQty] = useState(1);
  const responsive: any = useResponsive();
  const screenSize = getScreenSize(responsive);
  const carouselRef = useRef<CarouselRef>(null);
  const imgRef = useRef<HTMLDivElement>(null);
  const imgSize = useSize(imgRef);
  const thumbsContainer = useRef<HTMLDivElement>(null);
  const thumbsColRef = useRef<HTMLDivElement>(null);
  const thumbsColSize = useSize(thumbsColRef);

  useEffect(() => {
    // gather variant attributes
    let vAttrs: VariantAttr[] = [];
    product?.variants?.forEach((v) => {
      v?.attributes.forEach((attr) => {
        // if it's not an empty attribute
        if (attr.values.length > 0) {
          // if already in our array
          const matchIndex = vAttrs.findIndex((a) => a.id === attr.attribute.id);
          const entry = vAttrs[matchIndex];
          if (!entry) {
            vAttrs.push({
              id: attr.attribute.id,
              name: attr.attribute.name as string,
              values: [attr.values[0] as AttrValue],
              translation: attr.attribute.translation,
              selection: undefined,
            });
          } else if (!entry.values.find((entryValue) => entryValue.id === attr.values[0]?.id)) {
            vAttrs[matchIndex] = {
              ...entry,
              values: [...entry.values, attr.values[0] as AttrValue],
            };
          }
        }
      });
    });

    // set default selections
    vAttrs = vAttrs.map((vAttr) => ({
      ...vAttr,
      selection: vAttr.values.length === 1 ? vAttr.values[0].id : undefined,
    }));
    setVariantAttrs(vAttrs);
  }, [product]);

  // update selected variant when attribute selection changes
  useEffect(() => {
    setSelectedVariant(null);
    const variants = product?.variants;
    if (variants) {
      if (variants.length === 1) {
        setSelectedVariant(variants[0]);
        return;
      }
      const selectionLevels = [variants];
      variantAttrs.forEach((vAttr) => {
        if (vAttr.selection) {
          const matchingVariants =
            last(selectionLevels)?.filter(
              (variant) =>
                variant?.attributes.find((a) => a.attribute.id === vAttr.id)?.values?.[0]?.id === vAttr.selection
            ) || [];
          selectionLevels.push(matchingVariants);
        }
      });
      if (selectionLevels && last(selectionLevels)?.length === 1) {
        setSelectedVariant(last(selectionLevels)?.[0] || null);
      }
    }
  }, [variantAttrs]);

  // if we navigate to different product, scroll to top
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [productSlug]);

  // useEffect(() => {
  //   // Google Ecommerce - track detail view
  //   if (!config.gtmEnabled) {
  //     return;
  //   }
  //   if (!product) {
  //     return;
  //   }
  //   window.dataLayer.push({
  //     event: "view_item",
  //     ecommerce: {
  //       currency: product.pricing?.priceRange?.start?.gross.currency,
  //       items: [
  //         {
  //           item_name: product.name,
  //           item_id: selectedVariant?.sku,
  //           price: selectedVariant?.pricing?.price?.gross.amount || product.pricing?.priceRange?.start?.gross.amount,
  //           item_category: product.category?.name,
  //           item_variant: selectedVariant?.name,
  //           quantity: qty,
  //         },
  //       ],
  //     },
  //   });
  // }, [product, selectedVariant]);

  const productGrid: ListGridType = {
    gutter: 24,
    xs: 1,
    sm: 2,
    md: 3,
    lg: 3,
    xl: 4,
    xxl: 6,
  };
  const suggestions = product?.category?.products?.edges
    .filter((e) => e.node.id !== product.id)
    .slice(0, productGrid[screenSize]);

  // useEffect(() => {
  //   // Google Ecommerce - track suggestions view
  //   if (!config.gtmEnabled) {
  //     return;
  //   }
  //   if (!suggestions) {
  //     return;
  //   }
  //   window.dataLayer.push({
  //     event: "view_item_list",
  //     ecommerce: {
  //       currency: product?.pricing?.priceRange?.start?.gross.currency,
  //       items: suggestions.map((edge, i) => {
  //         const p = edge.node;
  //         return {
  //           item_name: p.name,
  //           price: p.pricing?.priceRange?.start?.gross.amount,
  //           item_category: p.category?.name,
  //           item_list_name: "Product Suggestions",
  //           item_list_id: data?.product?.category?.id,
  //           index: i,
  //         };
  //       }),
  //     },
  //   });
  // }, [suggestions]);

  const images = selectedVariant?.media?.length ? selectedVariant.media : product?.media;
  const currency = product?.pricing?.priceRange?.start?.gross.currency as string;
  const minPrice = selectedVariant
    ? (selectedVariant.pricing?.price?.gross.amount as number)
    : (product?.pricing?.priceRange?.start?.gross.amount as number);
  const maxPrice = selectedVariant ? undefined : (product?.pricing?.priceRange?.stop?.gross.amount as number);

  const priceLabel = (
    <Typography.Title id="price-lbl" className="text-center" level={3}>
      {formatPrice(currency, minPrice, maxPrice)}
    </Typography.Title>
  );

  const qtySelector = (
    <Row id="qty-row" justify="center" gutter={36}>
      <Col>
        <Typography.Title id="qty-lbl" level={4}>
          {t("misc.qty")}:{" "}
        </Typography.Title>
      </Col>
      <Col xs={16} sm={10} md={12} lg={14} xl={12} xxl={10}>
        <NumberInput
          id="qty-fld"
          defaultValue={1}
          disabled={!selectedVariant}
          min={1}
          max={selectedVariant?.quantityAvailable}
          maxLength={2}
          size="large"
          onChange={(value) => {
            if (typeof value === "number") {
              setQty(value);
            }
          }}
          decrementBtnProps={{ id: "qty-dec" }}
          incrementBtnProps={{ id: "qty-inc" }}
        />
      </Col>
    </Row>
  );

  const addToCartBtn = (
    <Button
      id="add-to-cart-btn"
      block
      disabled={!selectedVariant}
      // loading={loading.effects["cart/addItem"]}
      onClick={() =>
        dispatch({
          type: "cart/addItem",
          payload: {
            variantId: selectedVariant?.id,
            quantity: qty,
            product: product,
            variant: selectedVariant,
            onCompleted: () => {
              notification.success({
                message: t("cart.addItem.success"),
              });
            },
          },
        })
      }
      size="large"
      type="primary"
    >
      {t("products.detail.addToCart")}
    </Button>
  );

  return (
    <div className="flex flex-col flex-grow mb-12">
      <Head>
        <title>{formatTitle(getProductName(product))}</title>
        <meta name="description" content={getProductName(product)} />
      </Head>
      <Row className={clsx({ "mt-2": !responsive.lg, "mt-12": responsive.lg })} justify="center">
        <Col span={22}>
          <Row justify="center" gutter={24}>
            <Col xs={24} lg={12}>
              <Row gutter={[8, 8]}>
                <Col span={4}>
                  {thumbsColSize?.height && imgSize?.height && thumbsColSize.height > imgSize.height && (
                    <div className="mb-2">
                      <Button
                        block
                        id="thumbs-scroll-up-btn"
                        className="icon-btn"
                        onClick={() =>
                          thumbsContainer.current?.scrollBy({
                            top: -100,
                            behavior: "smooth",
                          })
                        }
                      >
                        <UpOutlined />
                      </Button>
                    </div>
                  )}
                  <div
                    id="thumbs-container"
                    className="overflow-y-auto"
                    style={{
                      height: imgSize?.height ? imgSize.height - 80 : undefined,
                    }}
                    ref={thumbsContainer}
                  >
                    <div ref={thumbsColRef}>
                      {images?.map((image, i) => (
                        <div key={image?.id || i} className="mb-2">
                          <AspectRatio width={1} height={1} noMask>
                            <Button
                              id={`thumb-btn-${i}`}
                              className={clsx(
                                "w-full h-full p-0 transition-transform ease-in-out duration-100",
                                "thumb-btns",
                                {
                                  ["border-2 border-primary"]: i === selectedImg,
                                  ["scale-90"]: i !== selectedImg,
                                }
                              )}
                              onClick={() => carouselRef.current?.goTo(i)}
                            >
                              <img className="w-full" alt={image?.alt || ""} src={image?.url} loading="lazy" />
                            </Button>
                          </AspectRatio>
                        </div>
                      ))}
                    </div>
                  </div>
                  {thumbsColSize?.height && imgSize?.height && thumbsColSize.height > imgSize.height && (
                    <div className="mt-2">
                      <Button
                        block
                        id="thumbs-scroll-down-btn"
                        className="icon-btn"
                        onClick={() =>
                          document.getElementById("thumbs-container")?.scrollBy({
                            top: 100,
                            behavior: "smooth",
                          })
                        }
                      >
                        <DownOutlined />
                      </Button>
                    </div>
                  )}
                </Col>
                <Col span={20}>
                  <div ref={imgRef} className="aspect-square">
                    <Carousel ref={carouselRef} beforeChange={(current, next) => setSelectedImg(next)}>
                      {images?.map((image, i) => (
                        <div key={image?.id}>
                          <img
                            id={`carousel-img-${i}`}
                            className="w-full carousel-imgs"
                            alt={image?.alt as string}
                            src={image?.url}
                            loading="lazy"
                          />
                        </div>
                      ))}
                    </Carousel>
                  </div>
                </Col>
              </Row>
            </Col>
            <Col span={12} xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
              <Typography.Title
                id="product-name"
                className={clsx({ "text-center": !responsive.lg, "mt-6": !responsive.lg })}
                level={1}
              >
                {getProductName(product)}
              </Typography.Title>
              <div id="product-desc">
                <RichTextContent contentJson={getProductDescriptionJson(product)} lines={10} />
              </div>
              <Row
                id="var-select-row"
                className={clsx({ "mt-2": !responsive.lg, "mt-9": responsive.lg })}
                justify="center"
              >
                <Col span={14} xs={18} sm={16} md={14} lg={14} xl={12} xxl={10}>
                  {variantAttrs.map((vAttr, i) => {
                    return (
                      <Select
                        id={`var-select-${i}`}
                        className={clsx("w-full", "var-select")}
                        key={vAttr.id}
                        size="large"
                        placeholder={getAttributeName(vAttr)}
                        onChange={(value) => {
                          const selection = [...variantAttrs];
                          selection[i] = { ...vAttr, selection: value };
                          setVariantAttrs(selection);
                        }}
                        value={vAttr.selection}
                      >
                        {vAttr.values.map((val) => (
                          <Select.Option className={`var-select-${i}-options`} key={val?.id} value={val?.id as string}>
                            {getAttributeValueName(val)}
                          </Select.Option>
                        ))}
                      </Select>
                    );
                  })}
                </Col>
              </Row>
              {responsive.lg && (
                <>
                  <div className="mt-12">{priceLabel}</div>
                  <Row className="mt-6" justify="center">
                    <Col span={14} md={22} lg={14} xl={12} xxl={10}>
                      {qtySelector}
                    </Col>
                  </Row>

                  <Row className="my-6" justify="center">
                    <Col span={14} md={22} lg={14} xl={12} xxl={10}>
                      {addToCartBtn}
                    </Col>
                  </Row>
                </>
              )}
            </Col>
          </Row>
        </Col>
      </Row>

      <Row className="mt-12" justify="center">
        <Col span={22}>
          <Row justify="center">
            <Typography.Title level={1} id="product-suggestions-title">
              {t("products.detail.suggestions")}
            </Typography.Title>
          </Row>
          <List
            dataSource={suggestions}
            grid={productGrid}
            renderItem={(edge, i) => {
              const productItem = edge.node;
              return (
                <List.Item className="suggestion-list-items" key={productItem?.id || i}>
                  <div className="w-full">
                    <Row justify="center">
                      <Col span={24} style={{ maxWidth: 240 }}>
                        <ProductCard product={productItem} listName="Product Suggestions" listIndex={i} />
                      </Col>
                    </Row>
                  </div>
                </List.Item>
              );
            }}
          />
        </Col>
      </Row>
      {!responsive.lg && (
        <Affix offsetBottom={0}>
          <Card className="shadow-md" bodyStyle={{ padding: 0 }} bordered={false}>
            <div className="p-4">
              {priceLabel}
              <Row justify="center">
                <Col span={20}>{qtySelector}</Col>
              </Row>
            </div>
            <Row>{addToCartBtn}</Row>
          </Card>
        </Affix>
      )}
    </div>
  );
};

export default ProductDetailPage;
