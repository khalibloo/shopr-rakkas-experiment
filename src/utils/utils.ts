import type { DataProp } from "editorjs-blocks-react-renderer";
import config from "@/config";
// import { AddressDetails } from "@/fragments/types/AddressDetails";
// import { AddressInput, CountryCode } from "@/globalTypes";

// export const addressToInput = (
//   address: AddressDetails,
// ): AddressInput | undefined => {
//   if (!address) {
//     return;
//   }
//   const addr = _.omit(address, [
//     "id",
//     "__typename",
//     "isDefaultBillingAddress",
//     "isDefaultShippingAddress",
//     "country",
//   ]) as AddressInput;
//   addr.country = address.country?.code as CountryCode;
//   return addr;
// };

export const getScreenSize = (responsive: {
  xs: boolean;
  sm: boolean;
  md: boolean;
  lg: boolean;
  xl: boolean;
  xxl: boolean;
}): ScreenSize => {
  if (responsive.xxl) {
    return "xxl";
  }
  if (!responsive.xxl && responsive.xl) {
    return "xl";
  }
  if (!responsive.xl && responsive.lg) {
    return "lg";
  }
  if (!responsive.lg && responsive.md) {
    return "md";
  }
  if (!responsive.md && responsive.sm) {
    return "sm";
  }
  if (!responsive.sm && responsive.xs) {
    return "xs";
  }
  return "xs";
};

export const formatTitle = (title: string) => `${title} | ${config.siteName}`;

export const formatPrice = (currency: string, minPrice: number, maxPrice?: number) => {
  if (!currency || minPrice == null) {
    return null;
  }

  const nf = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const minPriceFormatted = nf.format(minPrice);
  const maxPriceFormatted = maxPrice && nf.format(maxPrice);
  if (!maxPrice || minPrice === maxPrice) {
    return minPriceFormatted;
  }
  return `${minPriceFormatted} - ${maxPriceFormatted}`;
};

// export const getLangCode = () =>
//   getLocale()
//     .substring(0, 2)
//     .toUpperCase();

// export const formatAsMoney = (amount = 0, currency = "USD", locale = "en-US") =>
//   new Intl.NumberFormat(locale, {
//     style: "currency",
//     currency,
//   }).format(amount);

export const parseEditorJSData = (jsonStringData?: string): DataProp | null => {
  if (!jsonStringData) {
    return null;
  }
  let data;
  try {
    data = JSON.parse(jsonStringData);
  } catch (e) {
    return null;
  }

  if (!data.blocks?.length) {
    // No data to render
    return null;
  }

  // Path for compatibility with data from older version od EditorJS
  if (!data.time) {
    data.time = Date.now().toString();
  }
  if (!data.version) {
    data.version = "2.22.2";
  }

  return data;
};

export const getProductName = (product) => product?.translation?.name || product?.name;
export const getProductDescriptionJson = (product) => product?.translation?.descriptionJson || product?.descriptionJson;
export const getVariantName = (variant) => variant?.translation?.name || variant?.name;
export const getCategoryName = (category) => category?.translation?.name || category?.name;
export const getCategorySeoDesc = (category) =>
  category?.translation?.seoDescription || category?.seoDescription || getCategoryName(category);
export const getCollectionName = (collection) => collection?.translation?.name || collection?.name;
export const getCollectionSeoDesc = (collection) =>
  collection?.translation?.seoDescription || collection?.seoDescription || getCollectionName(collection);
export const getAttributeName = (attribute) => attribute?.translation?.name || attribute?.name;
export const getAttributeValueName = (attributeValue) => attributeValue?.translation?.name || attributeValue?.name;
