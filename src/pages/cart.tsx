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
} from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { useIntl, Link, connect, ConnectRC, history } from "umi";
import VSpacing from "@/components/VSpacing";
import AspectRatio from "@/components/AspectRatio";
import { formatPrice, addressToInput, getLangCode, getProductName, getVariantName } from "@/utils/utils";
import AddressSelector from "@/components/AddressSelector";
import { useBoolean, useResponsive } from "ahooks";
import { ConnectState, Loading } from "@/models/connect";
import { cartQuery } from "@/queries/types/cartQuery";
import { CART_PAGE_QUERY, CART_PAGE_WITH_TOKEN_QUERY } from "@/queries/cart";
import { useLazyQuery, useQuery } from "@apollo/client";
import { APIException } from "@/apollo";
import lf from "localforage";
import _ from "lodash";
import NumberInput from "@/components/NumberInput";
import altConfig from "@/../.altrc";
import VoucherCodeForm from "@/components/VoucherCodeForm";
import { cartWithTokenQuery } from "@/queries/types/cartWithTokenQuery";
import { AddressInput } from "@/globalTypes";
import Logger from "@/utils/logger";
import config from "@/config";
import { CartCompleteMutation_checkoutComplete } from "@/mutations/types/CartCompleteMutation";

interface Props {
  authenticated: boolean;
  loading: Loading;
}
const CartPage: React.FC<Props> = ({ authenticated, loading, dispatch }) => {
  const { t } = useTranslation();
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>();
  const { state: thanksOpen, setTrue: openThanks } = useBoolean();
  const { state: mobileCheckoutOpen, setTrue: openMobileCheckout, setFalse: closeMobileCheckout } = useBoolean();
  const { state: hasTrackedBeginCheckout, setTrue: setHasTrackedBeginCheckout } = useBoolean();
  const responsive = useResponsive();
  const {
    loading: fetching,
    error,
    data,
  } = useQuery<cartQuery>(CART_PAGE_QUERY, { variables: { lang: getLangCode() } });
  const [fetchGuestCart, { loading: guestCartFetching, error: guestCartError, data: guestCartData }] =
    useLazyQuery<cartWithTokenQuery>(CART_PAGE_WITH_TOKEN_QUERY);
  useEffect(() => {
    lf.getItem("guest_cart_token").then((guestCartToken) => {
      if (guestCartToken) {
        fetchGuestCart({
          variables: { token: guestCartToken, lang: getLangCode() },
        });
      }
    });
  }, []);
  const addresses = data?.me?.addresses;
  const defaultShippingAddr = addresses?.find((a) => a?.isDefaultShippingAddress);
  const defaultBillingAddr = addresses?.find((a) => a?.isDefaultBillingAddress);
  const checkout = authenticated ? data?.me?.checkout : guestCartData?.checkout;
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
  useEffect(() => {
    if (config.gtmEnabled && checkout) {
      window.dataLayer.push({
        event: "view_cart",
        ecommerce: {
          currency: checkout.totalPrice?.gross.currency,
          value: checkout.totalPrice?.gross.amount,
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
  }, []);

  // Google Ecommerce - track begin checkout
  const trackBeginCheckout = () => {
    // track when checkout options are modified, but only once
    if (config.gtmEnabled && checkout && !hasTrackedBeginCheckout) {
      window.dataLayer.push({
        event: "begin_checkout",
        ecommerce: {
          currency: checkout.totalPrice?.gross.currency,
          coupon: checkout.voucherCode || undefined,
          value: checkout.totalPrice?.gross.amount,
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
      setHasTrackedBeginCheckout();
    }
  };

  // Google Ecommerce - track add shipping info
  useEffect(() => {
    if (config.gtmEnabled && checkout) {
      window.dataLayer.push({
        event: "add_shipping_info",
        ecommerce: {
          shipping_tier: shippingMethod?.name,
          currency: currency,
          coupon: voucherCode || undefined,
          value: totalPrice,
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
  }, [shippingMethod]);

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
          trackBeginCheckout();
        },
        onError: (err: APIException) => {
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
          trackBeginCheckout();
        },
        onError: (err: APIException) => {
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
      <Row gutter={16}>
        <Col span={8}>
          <Typography.Text>{t("cart.shippingAddress")}:</Typography.Text>
        </Col>
        <Col span={16}>
          <AddressSelector
            id="shipping-address-select"
            loading={loading.effects["cart/setShippingAddress"]}
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
      <VSpacing height={8} />
      <Row gutter={16}>
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
                trackBeginCheckout();
              }}
            >
              {t("cart.billingAddress.same")}
            </Checkbox>
          </div>
          {!sameAddr && (
            <>
              <VSpacing height={8} />
              <div>
                <AddressSelector
                  id="billing-address-select"
                  loading={loading.effects["cart/setBillingAddress"]}
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
      <VSpacing height={8} />
      <Row gutter={16}>
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
                    trackBeginCheckout();
                  },
                  onError: (err: APIException) => {
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
      <VSpacing height={8} />
      <Row gutter={16}>
        <Col span={8}>
          <Typography.Text>{t("cart.vouchers")}:</Typography.Text>
        </Col>
        <Col span={16}>
          <VoucherCodeForm onSubmit={trackBeginCheckout} />
        </Col>
      </Row>
      <VSpacing height={8} />
      <Row gutter={16}>
        <Col span={8}>
          <Typography.Text>{t("cart.subtotal")}:</Typography.Text>
        </Col>
        <Col span={16}>
          <Typography.Text id="subtotal-price">{formatPrice(currency, subtotalPrice)}</Typography.Text>
        </Col>
      </Row>
      <VSpacing height={8} />
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
          <VSpacing height={8} />
          <Row gutter={16}>
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
      <VSpacing height={16} />
      <Row gutter={16}>
        <Col span={8}>
          <Typography.Text strong>{t("cart.total")}:</Typography.Text>
        </Col>
        <Col span={16}>
          <Typography.Text id="total-price" strong>
            {formatPrice(currency, totalPrice)}
          </Typography.Text>
        </Col>
      </Row>
      <VSpacing height={8} />
      <Row gutter={16}>
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
              trackBeginCheckout();
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
      <VSpacing height={24} />
      <Button
        id="checkout-btn"
        block
        disabled={invalidShippingMethod || !billingAddress || !selectedPaymentMethod}
        loading={loading.effects["cart/createPayment"]}
        onClick={() => {
          const gateway = altConfig.paymentGateways.find((gw) => gw.id === selectedPaymentMethod);
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
              langCode: getLangCode(),
            },
            gateway.config,
            (token, billingAddr) => {
              dispatch?.({
                type: "cart/createPayment",
                payload: {
                  gateway: selectedPaymentMethod,
                  token,
                  billingAddress: billingAddr,
                  onCompleted: (res: CartCompleteMutation_checkoutComplete) => {
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
    <div className="flex flex-col flex-grow">
      <VSpacing height={24} />
      <Modal
        onCancel={() => history.push("/")}
        footer={
          <Row justify="space-between">
            <Link to="/orders">
              <Button>{t("cart.viewOrders")}</Button>
            </Link>
            <Link to="/">
              <Button type="primary">{t("cart.continueShopping")}</Button>
            </Link>
          </Row>
        }
        title="Order Placed"
        visible={thanksOpen}
      >
        <Result status="success" title="Thank You For Shopping With Us" />
      </Modal>
      <Row justify="center" className="flex-grow">
        <Col span={22}>
          <Typography.Title id="page-heading" className="text-center" level={1}>
            {t("cart.heading")}
          </Typography.Title>
          <Row gutter={24} justify="center">
            <Col span={16} xs={24} sm={24} md={20} lg={16} xl={16} xxl={12}>
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
                              <Link to={`/products/${item?.variant.product.slug}`}>
                                <AspectRatio width={1} height={1}>
                                  <img
                                    className="w-full"
                                    alt={
                                      item?.variant.images?.[0]?.alt ||
                                      (item?.variant.product?.thumbnail?.alt as string)
                                    }
                                    src={item?.variant.images?.[0]?.url || item?.variant.product?.thumbnail?.url}
                                    loading="lazy"
                                  />
                                </AspectRatio>
                              </Link>
                            </Col>
                            <Col span={20} xs={16} sm={18} md={18} lg={20} xl={20} xxl={20}>
                              <Link to={`/products/${item?.variant.product.slug}`}>
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
                                    disabled={loading.effects["cart/updateItem"] || loading.effects["cart/deleteItem"]}
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
                                <Col>
                                  <VSpacing height={8} />
                                  <Button
                                    size="small"
                                    loading={loading.effects["cart/updateItem"] || loading.effects["cart/deleteItem"]}
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
            <Col span={8} xs={0} sm={0} md={0} lg={8} xl={8} xxl={8}>
              <Card id="summary-card" className="shadow-md" bordered={false} title={t("cart.summary")}>
                {summary}
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>
      <VSpacing height={48} />
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

const ConnectedPage = connect((state: ConnectState) => ({
  authenticated: state.auth.authenticated,
  localCheckout: state.cart.checkout,
  loading: state.loading,
}))(CartPage);
ConnectedPage.title = "cart.title";

export default ConnectedPage;
