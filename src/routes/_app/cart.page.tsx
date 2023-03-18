import React, { useEffect, useState } from "react";
import {
  Typography,
  Col,
  Row,
  List,
  Button,
  Card,
  Select,
  Affix,
  notification,
  message,
  Modal,
  Result,
  Drawer,
  Checkbox,
  Grid,
  Image,
} from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import AspectRatio from "@/components/AspectRatio";
import { formatPrice, addressToInput, getProductName, getVariantName } from "@/utils/utils";
import AddressSelector from "@/components/AddressSelector";
import { useBoolean } from "ahooks";
// import lf from "localforage";

import _ from "lodash";
import NumberInput from "@/components/NumberInput";
import altConfig from "@/../.altrc";
import VoucherCodeForm from "@/components/forms/VoucherCodeForm";
import Logger from "@/utils/logger";
import config from "@/config";
import { Head, Link, navigate, PageProps, usePageContext, useSSQ } from "rakkasjs";
import { useTranslation } from "react-i18next";
import { GraphQLClient } from "graphql-request";
import { getSdk } from "@adapters/saleor/generated/graphql";

const CartPage: React.FC<PageProps> = () => {
  const { lang } = usePageContext();
  const { t } = useTranslation();
  const dispatch = (x) => x;
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>();
  const [thanksOpen, { setTrue: openThanks }] = useBoolean();
  const [mobileCheckoutOpen, { setTrue: openMobileCheckout, setFalse: closeMobileCheckout }] = useBoolean();
  // const [hasTrackedBeginCheckout, { setTrue: setHasTrackedBeginCheckout }] = useBoolean();
  const responsive = Grid.useBreakpoint();

  const authenticated = false;
  const {
    data: { cartData, guestCartData },
  } = useSSQ(async (ctx) => {
    const client = new GraphQLClient(config.apiEndpoint, { fetch: ctx.fetch });
    const sdk = getSdk(client);
    const guestCartToken = "";

    const [cartData, guestCartData] = await Promise.all([
      sdk.cartQuery({ lang: lang.toUpperCase() as any }),
      sdk.cartWithTokenQuery({ token: guestCartToken, lang: lang.toUpperCase() as any }),
    ]);
    return { cartData, guestCartData };
  });

  // const [fetchGuestCart, { loading: guestCartFetching, error: guestCartError, data: guestCartData }] =
  //   useLazyQuery<cartWithTokenQuery>(CART_PAGE_WITH_TOKEN_QUERY);

  // useEffect(() => {
  //   lf.getItem("guest_cart_token").then((guestCartToken) => {
  //     if (guestCartToken) {
  //       fetchGuestCart({
  //         variables: { token: guestCartToken, lang: getLangCode() },
  //       });
  //     }
  //   });
  // }, []);

  const addresses = cartData?.me?.addresses;
  const defaultShippingAddr = addresses?.find((a) => a?.isDefaultShippingAddress);
  const defaultBillingAddr = addresses?.find((a) => a?.isDefaultBillingAddress);
  // const checkout = authenticated ? cartData?.me?.checkout : guestCartData?.checkout;
  const checkout = guestCartData?.checkout;
  const checkoutLines = checkout?.lines;
  const currency = checkout?.totalPrice?.gross.currency;
  const subtotalPrice = checkout?.subtotalPrice?.gross.amount;
  const shippingPrice = checkout?.shippingPrice?.gross.amount;
  const discountPrice = checkout?.discount?.amount;
  const voucherCode = checkout?.voucherCode;
  const totalPrice = checkout?.totalPrice?.gross.amount;
  const shippingAddress = checkout?.shippingAddress;
  const billingAddress = checkout?.billingAddress;
  const shippingMethod = checkout?.shippingMethod;
  const paymentMethods = checkout?.availablePaymentGateways;
  const availableShippingMethods = checkout?.availableShippingMethods;

  const [sameAddr, setSameAddr] = useState(false);

  useEffect(() => {
    setSameAddr(
      Boolean(
        shippingAddress && billingAddress && _.isEqual(addressToInput(shippingAddress), addressToInput(billingAddress))
      )
    );
  }, [shippingAddress, billingAddress]);

  useEffect(() => {
    if (!shippingAddress && defaultShippingAddr) {
      const address = addressToInput(defaultShippingAddr);
      dispatch?.({
        type: "cart/setShippingAddress",
        payload: { address },
      });
    }

    if (!billingAddress && defaultBillingAddr) {
      const address = addressToInput(defaultBillingAddr);
      dispatch?.({
        type: "cart/setBillingAddress",
        payload: { address },
      });
    }
  }, []);

  // Google Ecommerce - track cart view
  // useEffect(() => {
  //   if (config.gtmEnabled && checkout) {
  //     window.dataLayer.push({
  //       event: "view_cart",
  //       ecommerce: {
  //         currency: checkout.totalPrice?.gross.currency,
  //         value: checkout.totalPrice?.gross.amount,
  //         items: checkout.lines?.map((line) => ({
  //           item_id: line?.variant.sku,
  //           item_name: line?.variant.product.name,
  //           item_category: line?.variant.product.category?.name,
  //           item_variant: line?.variant.name,
  //           price: line?.variant.pricing?.price?.gross.amount,
  //           quantity: line?.quantity,
  //         })),
  //       },
  //     });
  //   }
  // }, []);

  // Google Ecommerce - track begin checkout
  // const trackBeginCheckout = () => {
  //   // track when checkout options are modified, but only once
  //   if (config.gtmEnabled && checkout && !hasTrackedBeginCheckout) {
  //     window.dataLayer.push({
  //       event: "begin_checkout",
  //       ecommerce: {
  //         currency: checkout.totalPrice?.gross.currency,
  //         coupon: checkout.voucherCode || undefined,
  //         value: checkout.totalPrice?.gross.amount,
  //         items: checkout.lines?.map((line) => ({
  //           item_id: line?.variant.sku,
  //           item_name: line?.variant.product.name,
  //           item_category: line?.variant.product.category?.name,
  //           item_variant: line?.variant.name,
  //           price: line?.variant.pricing?.price?.gross.amount,
  //           quantity: line?.quantity,
  //         })),
  //       },
  //     });
  //     setHasTrackedBeginCheckout();
  //   }
  // };

  // Google Ecommerce - track add shipping info
  // useEffect(() => {
  //   if (config.gtmEnabled && checkout) {
  //     window.dataLayer.push({
  //       event: "add_shipping_info",
  //       ecommerce: {
  //         shipping_tier: shippingMethod?.name,
  //         currency: currency,
  //         coupon: voucherCode || undefined,
  //         value: totalPrice,
  //         items: checkout.lines?.map((line) => ({
  //           item_id: line?.variant.sku,
  //           item_name: line?.variant.product.name,
  //           item_category: line?.variant.product.category?.name,
  //           item_variant: line?.variant.name,
  //           price: line?.variant.pricing?.price?.gross.amount,
  //           quantity: line?.quantity,
  //         })),
  //       },
  //     });
  //   }
  // }, [shippingMethod]);

  // if there's a matching address in our address book
  const matchingShippingAddr = addresses?.find((a) => {
    if (shippingAddress && a) {
      return _.isEqual(addressToInput(shippingAddress), addressToInput(a));
    }
  });
  // if there's a matching address in our address book
  const matchingBillingAddr = addresses?.find((a) => {
    if (billingAddress && a) {
      return _.isEqual(addressToInput(billingAddress), addressToInput(a));
    }
  });
  // when shipping addr changes, shipping method can become invalid
  const invalidShippingMethod = availableShippingMethods?.find((sm) => sm?.id === shippingMethod?.id) === undefined;
  const isSummaryCompact = !responsive.lg;

  const setShippingAddress = (address: AddressInput) => {
    dispatch?.({
      type: "cart/setShippingAddress",
      payload: {
        address,
        onCompleted: () => {
          // trackBeginCheckout();
        },
        onError: (err) => {
          if (err.errors?.find((e) => e.code === "INVALID" && e.field === "postalCode")) {
            message.error(t("form.address.postalCode.invalid"));
          } else {
            message.error(t("cart.shippingAddress.fail"));
          }
        },
      },
    });
  };

  const setBillingAddress = (address: AddressInput) => {
    dispatch?.({
      type: "cart/setBillingAddress",
      payload: {
        address,
        onCompleted: () => {
          // trackBeginCheckout();
        },
        onError: (err) => {
          if (err.errors?.find((e) => e.code === "INVALID" && e.field === "postalCode")) {
            message.error(t("form.address.postalCode.invalid"));
          } else {
            message.error(t("cart.billingAddress.fail"));
          }
        },
      },
    });
  };

  const summary = (
    <>
      <Row className="mb-2" gutter={16}>
        <Col span={8}>
          <Typography.Text>{t("cart.shippingAddress")}:</Typography.Text>
        </Col>
        <Col span={16}>
          <AddressSelector
            id="shipping-address-select"
            // loading={loading.effects["cart/setShippingAddress"]}
            onAddOrEdit={(addr) => {
              setShippingAddress(addr);
              if (sameAddr) {
                setBillingAddress(addr);
              }
            }}
            onChange={(value) => {
              const addr = addresses?.find((a) => a?.id === value);
              if (addr) {
                const address = addressToInput(addr);
                if (address) {
                  setShippingAddress(address);
                  if (sameAddr) {
                    setBillingAddress(address);
                  }
                }
              }
            }}
            extraAddr={matchingShippingAddr ? undefined : shippingAddress}
            editMode={Boolean(!authenticated && shippingAddress)}
            value={matchingShippingAddr ? matchingShippingAddr.id : shippingAddress?.id}
          />
        </Col>
      </Row>
      <Row className="mb-2" gutter={16}>
        <Col span={8}>
          <Typography.Text>{t("cart.billingAddress")}:</Typography.Text>
        </Col>
        <Col span={16}>
          <div>
            <Checkbox
              checked={sameAddr}
              onChange={(e) => {
                setSameAddr(e.target.checked);
                if (
                  e.target.checked &&
                  shippingAddress &&
                  (!billingAddress || !_.isEqual(addressToInput(shippingAddress), addressToInput(billingAddress)))
                ) {
                  setBillingAddress(addressToInput(shippingAddress) as AddressInput);
                }
                // trackBeginCheckout();
              }}
            >
              {t("cart.billingAddress.same")}
            </Checkbox>
          </div>
          {!sameAddr && (
            <>
              <div className="mt-2">
                <AddressSelector
                  id="billing-address-select"
                  // loading={loading.effects["cart/setBillingAddress"]}
                  editMode={Boolean(!authenticated && billingAddress)}
                  onAddOrEdit={(addr) => setBillingAddress(addr)}
                  onChange={(value) => {
                    const addr = addresses?.find((a) => a?.id === value);
                    if (addr) {
                      const address = addressToInput(addr);
                      address && setBillingAddress(address);
                    }
                  }}
                  extraAddr={matchingBillingAddr ? undefined : billingAddress}
                  value={matchingBillingAddr ? matchingBillingAddr.id : billingAddress?.id}
                />
              </div>
            </>
          )}
        </Col>
      </Row>
      <Row className="mb-2" gutter={16}>
        <Col span={8}>
          <Typography.Text>{t("cart.shippingMethod")}:</Typography.Text>
        </Col>
        <Col span={16}>
          <Select
            id="shipping-method-select"
            className="w-full"
            disabled={shippingAddress === null && availableShippingMethods?.length === 0}
            placeholder={t("misc.pleaseSelect")}
            onChange={(value) => {
              dispatch?.({
                type: "cart/setShippingMethod",
                payload: {
                  shippingMethodId: value.toString(),
                  onCompleted: () => {
                    // trackBeginCheckout();
                  },
                  onError: () => {
                    message.error(t("cart.shippingMethod.fail"));
                  },
                },
              });
            }}
            value={invalidShippingMethod ? undefined : shippingMethod?.id}
          >
            {availableShippingMethods?.map((sm) => (
              <Select.Option key={sm?.id} value={sm.id}>
                {sm?.name} ({formatPrice(currency, sm?.price?.amount)})
              </Select.Option>
            ))}
          </Select>
        </Col>
      </Row>
      <Row className="mb-2" gutter={16}>
        <Col span={8}>
          <Typography.Text>{t("cart.vouchers")}:</Typography.Text>
        </Col>
        <Col span={16}>
          <VoucherCodeForm
          // onSubmit={trackBeginCheckout}
          />
        </Col>
      </Row>
      <Row className="mb-2" gutter={16}>
        <Col span={8}>
          <Typography.Text>{t("cart.subtotal")}:</Typography.Text>
        </Col>
        <Col span={16}>
          <Typography.Text id="subtotal-price">{formatPrice(currency, subtotalPrice)}</Typography.Text>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={8}>
          <Typography.Text>{t("cart.shippingFee")}:</Typography.Text>
        </Col>
        <Col span={16}>
          <Typography.Text id="shipping-fee-txt">
            {shippingMethod ? formatPrice(currency, shippingPrice) : "--"}
          </Typography.Text>
        </Col>
      </Row>
      {voucherCode && (
        <>
          <Row className="mt-2" gutter={16}>
            <Col span={8}>
              <Typography.Text>{t("cart.discount")}:</Typography.Text>
            </Col>
            <Col span={16}>
              <Typography.Text id="discount-fee-txt">
                {`-${formatPrice(currency, discountPrice)} (${voucherCode})`}
              </Typography.Text>
            </Col>
          </Row>
        </>
      )}
      <Row className="mt-2" gutter={16}>
        <Col span={8}>
          <Typography.Text strong>{t("cart.total")}:</Typography.Text>
        </Col>
        <Col span={16}>
          <Typography.Text id="total-price" strong>
            {formatPrice(currency, totalPrice)}
          </Typography.Text>
        </Col>
      </Row>
      <Row className="mt-2" gutter={16}>
        <Col span={8}>
          <Typography.Text>{t("cart.paymentMethod")}:</Typography.Text>
        </Col>
        <Col span={16}>
          <Select
            id="payment-method-select"
            className="w-full"
            placeholder={t("misc.pleaseSelect")}
            onChange={(value) => {
              setSelectedPaymentMethod(paymentMethods?.find((pm) => pm.id === value)?.id);
              // trackBeginCheckout();
            }}
            value={selectedPaymentMethod}
          >
            {paymentMethods?.map((pm) => (
              <Select.Option key={pm?.id} value={pm.id}>
                {pm?.name}
              </Select.Option>
            ))}
          </Select>
        </Col>
      </Row>
      <Button
        id="checkout-btn"
        className="mt-6"
        block
        disabled={invalidShippingMethod || !billingAddress || !selectedPaymentMethod}
        // loading={loading.effects["cart/createPayment"]}
        onClick={() => {
          const gateway = altConfig.paymentGateways?.find((gw) => gw.id === selectedPaymentMethod);
          gateway?.onPay?.(
            {
              checkout,
              checkoutToken: checkout?.token,
              email: checkout?.email,
              lines: checkoutLines,
              currency,
              totalPrice,
              shippingPrice,
              discountPrice,
              shippingMethod: shippingMethod?.name,
              billingAddress,
              shippingAddress,
              voucherCode,
              langCode: lang.toUpperCase() as any,
            },
            gateway.config,
            (token, billingAddr) => {
              dispatch?.({
                type: "cart/createPayment",
                payload: {
                  gateway: selectedPaymentMethod,
                  token,
                  billingAddress: billingAddr,
                  onCompleted: (res) => {
                    openThanks();
                    if (config.gtmEnabled && checkout) {
                      window.dataLayer.push({
                        event: "purchase",
                        ecommerce: {
                          shipping_tier: shippingMethod?.name,
                          shipping: shippingPrice,
                          currency: currency,
                          coupon: voucherCode || undefined,
                          value: totalPrice,
                          transaction_id: res.order?.number || undefined,
                          items: checkout.lines?.map((line) => ({
                            item_id: line?.variant.sku,
                            item_name: line?.variant.product.name,
                            item_category: line?.variant.product.category?.name,
                            item_variant: line?.variant.name,
                            price: line?.variant.pricing?.price?.gross.amount,
                            quantity: line?.quantity,
                          })),
                        },
                      });
                    }
                  },
                  onError: (err) => Logger.log(err),
                },
              });
            },
            (errMsg) => {
              message.error(errMsg, 10);
            },
            () => {}
          );
        }}
        size="large"
        shape="round"
        type="primary"
      >
        {t("cart.checkout")}
      </Button>
    </>
  );

  return (
    <div className="flex flex-col flex-grow pt-6 pb-12">
      <Head title={t("cart.title")} />
      <Modal
        onCancel={() => navigate("/")}
        footer={
          <Row justify="space-between">
            <Link href="/orders">
              <Button>{t("cart.viewOrders")}</Button>
            </Link>
            <Link href="/">
              <Button type="primary">{t("cart.continueShopping")}</Button>
            </Link>
          </Row>
        }
        title="Order Placed"
        open={thanksOpen}
      >
        <Result status="success" title="Thank You For Shopping With Us" />
      </Modal>
      <Row justify="center" className="flex-grow">
        <Col span={22}>
          <Typography.Title id="page-heading" className="text-center" level={1}>
            {t("cart.heading")}
          </Typography.Title>
          <Row gutter={24} justify="center">
            <Col xs={24} md={20} lg={16} xxl={12}>
              <List
                dataSource={checkoutLines || []}
                renderItem={(item) => {
                  const currency = item?.variant.pricing?.price?.gross.currency as string;
                  const price = item?.variant.pricing?.price?.gross.amount as number;
                  const qtyAvailable = item?.variant.quantityAvailable || 0;

                  return (
                    <List.Item className="product-list-items" key={item?.id}>
                      <div className="w-full">
                        <Card>
                          <Row gutter={24}>
                            <Col span={4} xs={8} sm={6} md={6} lg={4} xl={4} xxl={4}>
                              <Link href={`/products/${item?.variant.product.slug}`}>
                                <Image
                                  preview={false}
                                  className="w-full aspect-square"
                                  alt={
                                    item?.variant.images?.[0]?.alt || (item?.variant.product?.thumbnail?.alt as string)
                                  }
                                  src={item?.variant.images?.[0]?.url || item?.variant.product?.thumbnail?.url}
                                  loading="lazy"
                                />
                              </Link>
                            </Col>
                            <Col span={20} xs={16} sm={18} md={18} lg={20} xl={20} xxl={20}>
                              <Link href={`/products/${item?.variant.product.slug}`}>
                                <Typography.Title level={4}>
                                  {getProductName(item?.variant.product)}{" "}
                                  {item?.variant.name && <i>({getVariantName(item?.variant)})</i>}
                                </Typography.Title>
                              </Link>
                              <Typography.Title level={4}>{formatPrice(currency, price)}</Typography.Title>
                              <Row gutter={16}>
                                <Col>
                                  <Typography.Text>{t("misc.qty")}: </Typography.Text>
                                </Col>
                                <Col style={{ width: 160 }}>
                                  <NumberInput
                                    value={item?.quantity}
                                    // disabled={loading.effects["cart/updateItem"] || loading.effects["cart/deleteItem"]}
                                    min={1}
                                    max={qtyAvailable}
                                    maxLength={2}
                                    onChange={(value) => {
                                      dispatch?.({
                                        type: "cart/updateItem",
                                        payload: {
                                          variantId: item?.variant.id,
                                          quantity: value,
                                          variant: item?.variant,
                                          product: item?.variant.product,
                                          oldQuantity: item?.quantity,
                                        },
                                      });
                                    }}
                                  />
                                </Col>
                              </Row>
                              <Row justify="end">
                                <Col className="pt-2">
                                  <Button
                                    size="small"
                                    // loading={loading.effects["cart/updateItem"] || loading.effects["cart/deleteItem"]}
                                    onClick={() => {
                                      dispatch?.({
                                        type: "cart/deleteItem",
                                        payload: {
                                          checkoutLineId: item?.id,
                                          product: item?.variant.product,
                                          variant: item?.variant,
                                          quantity: item?.quantity,
                                          onCompleted: () => {
                                            notification.info({
                                              message: t("cart.deleteItem.success"),
                                            });
                                          },
                                        },
                                      });
                                    }}
                                  >
                                    <DeleteOutlined /> {t("misc.delete")}
                                  </Button>
                                </Col>
                              </Row>
                            </Col>
                          </Row>
                        </Card>
                      </div>
                    </List.Item>
                  );
                }}
              />
            </Col>
            <Col xs={0} lg={8}>
              <Card id="summary-card" className="shadow-md" bordered={false} title={t("cart.summary")}>
                {summary}
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>
      {isSummaryCompact && (
        <>
          <Drawer
            title={t("cart.summary")}
            visible={mobileCheckoutOpen}
            onClose={closeMobileCheckout}
            placement="bottom"
            height="auto"
          >
            {summary}
          </Drawer>
          <Affix offsetBottom={0}>
            <Button block type="primary" size="large" onClick={openMobileCheckout}>
              {t("cart.proceedToCheckout")}
            </Button>
          </Affix>
        </>
      )}
    </div>
  );
};

export default CartPage;
