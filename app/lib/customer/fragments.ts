const addressSummary = `#graphql
  fragment AddressSummary on MailingAddress {
    id
  }
`;

const moneyV2 = `#graphql
  fragment MoneyV2 on MoneyV2 {
    amount
    currencyCode
  }
`;

const discountApplication = `#graphql
  fragment DiscountApplication on DiscountApplication {
    allocationMethod
    targetSelection
    targetType
    value {
      ... on MoneyV2 {
        amount
        currencyCode
      }
      ... on PricingPercentageValue {
        percentage
      }
    }
  }
`;

const addressFull = `#graphql
  fragment AddressFull on MailingAddress {
    address1
    address2
    city
    company
    country
    countryCode: countryCodeV2
    firstName
    formattedArea
    id
    lastName
    latitude
    longitude
    name
    phone
    province
    provinceCode
    zip
  }
`;

const Image = `#graphql
  fragment Image on Image {
    altText
    height
    src: transformedSrc(maxHeight: 160)
    id
    width
  }
`;

const SellingPlanAllocation = `#graphql
  fragment SellingPlanAllocation on SellingPlanAllocation {
    priceAdjustments {
      compareAtPrice {
        ...MoneyV2
      }
      price {
        ...MoneyV2
      }
      perDeliveryPrice {
        ...MoneyV2
      }
      unitPrice {
        ...MoneyV2
      }
    }
  }
`;

const Variant = `#graphql
  fragment ProductVariant on ProductVariant {
    availableForSale
    compareAtPriceV2 {
      ...MoneyV2
    }
    currentlyNotInStock
    id
    image {
      ...Image
    }
    priceV2 {
      ...MoneyV2
    }
    product {
      handle
      id
      title
      tags
    }
    sellingPlanAllocations(first: 10) {
      edges {
        node {
          ...SellingPlanAllocation
        }
      }
    }
    quantityAvailable
    requiresShipping
    selectedOptions {
      name
      value
    }
    sku
    title
    unitPrice {
      ...MoneyV2
    }
    unitPriceMeasurement {
      measuredType
      quantityUnit
      quantityValue
    }
    weight
    weightUnit
  }
  ${Image}
  ${SellingPlanAllocation}
`;

const lineItemFull = `#graphql
  fragment LineItemFull on OrderLineItem {
    title
    quantity
    discountAllocations {
      allocatedAmount {
        ...MoneyV2
      }
      discountApplication {
        ...DiscountApplication
      }
    }
    originalTotalPrice {
      ...MoneyV2
    }
    discountedTotalPrice {
      ...MoneyV2
    }
    variant {
      ...ProductVariant
    }
  }
  ${Variant}
`;

const orderSummary = `#graphql
  fragment OrderSummary on Order {
    id
    name
    orderNumber
    statusUrl
    canceledAt
    cancelReason
    currencyCode
    processedAt
    financialStatus
    fulfillmentStatus
    totalPriceV2 {
      amount
    }
    subtotalPriceV2 {
      amount
    }
    lineItems(first: 100) {
      edges {
        node {
          title
        }
      }
    }
  }
`;

/**
  originalTotalDuties {
    ...MoneyV2
  }
  originalTotalPrice {
    ...MoneyV2
  }
 */

const orderFull = `#graphql
  fragment OrderFull on Order {
    id
    name
    orderNumber
    statusUrl
    canceledAt
    cancelReason
    currencyCode
    processedAt
    email
    phone
    financialStatus
    fulfillmentStatus
    customerLocale
    currentSubtotalPrice {
      ...MoneyV2
    }
    currentTotalTax {
      ...MoneyV2
    }
    currentTotalPrice {
      ...MoneyV2
    }
    currentTotalDuties {
      ...MoneyV2
    }
    totalTaxV2 {
      ...MoneyV2
    }
    totalRefundedV2 {
      ...MoneyV2
    }
    totalPriceV2 {
      ...MoneyV2
    }
    subtotalPriceV2 {
      ...MoneyV2
    }
    totalShippingPriceV2 {
      ...MoneyV2
    }
    shippingAddress {
      ...AddressFull
    }
    successfulFulfillments(first: 100) {
      trackingCompany
      trackingInfo(first: 100) {
        url
      }
    }
    discountApplications(first: 100) {
      edges {
        node {
          ...DiscountApplication
        }
      }
    }
    lineItems(first: 100) {
      edges {
        node {
          ...LineItemFull
        }
      }
    }
  }
  ${moneyV2}
  ${addressFull}
  ${discountApplication}
  ${lineItemFull}
`;

const metafield = `#graphql
  fragment Metafield on Metafield {
    namespace
    key
    value
    parentResource
    createdAt
    updatedAt
  }
`;

const customerSummary = `#graphql
  fragment CustomerSummary on Customer {
    acceptsMarketing
    createdAt
    defaultAddress {
      ...AddressFull
    }
    displayName
    email
    firstName
    id
    lastIncompleteCheckout {
      id
      webUrl
      updatedAt
    }
    lastName
    phone
    tags
    updatedAt
  }
  ${addressFull}
`;

const customerFull = `#graphql
  fragment CustomerFull on Customer {
    acceptsMarketing
    addresses(first: 8) {
      edges {
        node {
          ...AddressSummary
        }
      }
    }
    createdAt
    defaultAddress {
      ...AddressFull
    }
    displayName
    email
    firstName
    id
    lastIncompleteCheckout {
      id
      webUrl
      updatedAt
    }
    lastName
    orders(first: 5) {
      edges {
        node {
          ...OrderSummary
        }
      }
    }
    phone
    tags
    updatedAt
  }
  ${addressSummary}
  ${addressFull}
  ${orderSummary}
`;

const customerAddresses = `#graphql
  fragment Customer on Customer {
    addresses(first: 10) {
      edges {
        node {
          ...AddressSummary
        }
      }
    }
  }
  ${addressSummary}
`;

const customerOrders = `#graphql
  fragment Customer on Customer {
    orders(first: 5) {
      edges {
        node {
          ...OrderSummary
        }
      }
    }
    phone
    tags
    updatedAt
  }
  ${orderSummary}
`;

const customerError = `#graphql
  fragment CustomerUserError on CustomerUserError {
    code
    field
    message
  }
`;

const error = `#graphql
  fragment UserError on UserError {
    field
    message
  }
`;

const customerAccessToken = `#graphql
  fragment AccessToken on CustomerAccessToken {
    token: accessToken
    expires: expiresAt
  }
`;

export const fragments = {
  addressSummary,
  addressFull,
  orderFull,
  orderSummary,
  customerOrders,
  customerAddresses,
  metafield,
  customerFull,
  customerSummary,
  customerError,
  error,
  customerAccessToken,
};
