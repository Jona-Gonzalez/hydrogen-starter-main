const SECTION_FRAGMENT = `#graphql
  fragment section on Section {
    id
    title
    status
    data
    publishedAt
    createdAt
    updatedAt
    parentContentType
  }
`;

export const PRODUCT_PAGE_QUERY = `#graphql
  query ProductPage($handle: String!, $version: Version) {
    productPage: productPageByHandle(handle: $handle, version: $version) {
      id
      title
      handle
      description
      status
      sections(first: 25) {
        nodes {
          ...section
        }
        pageInfo {
          hasNextPage
          endCursor
        }
      }
      template {
        id
        title
        type
        status
        publishedAt
        createdAt
        updatedAt
      }
      publishedAt
      createdAt
      updatedAt
    }
  }
  ${SECTION_FRAGMENT}
`;

export const VARIANT_FRAGMENT = `#graphql
  fragment variantFragment on ProductVariant {
    id
    title
    availableForSale
    sku
    image {
      altText
      height
      id
      url
      width
    }
    price {
      currencyCode
      amount
    }
    compareAtPrice {
      currencyCode
      amount
    }
    selectedOptions {
      name
      value
    }
    product {
      handle
      id
      productType
      title
    }
  }
`;

export const PRODUCT_QUERY = `#graphql
  query product($handle: String!, $selectedOptions: [SelectedOptionInput!]!) {
    product(handle: $handle) {
      id
      title
      handle
      vendor
      description
      descriptionHtml
      productType
      publishedAt
      tags
      featuredImage {
        altText
        height
        id
        url
        width
      }
      priceRange {
        maxVariantPrice {
          amount
          currencyCode
        }
        minVariantPrice {
          amount
          currencyCode
        }
      }
      media(first: 100) {
        nodes {
          id
          mediaContentType
          ... on MediaImage {
            alt
            id
            image {
              altText
              height
              id
              url
              width
            }
          }
          ... on Video {
            alt
            id
            sources {
              mimeType
              url
            }
            previewImage {
              altText
              height
              id
              url
              width
            }
          }
          ... on ExternalVideo {
            alt
            id
            originUrl
            previewImage {
              altText
              height
              id
              url
              width
            }
          }
          ... on Model3d {
            alt
            id
            sources {
              mimeType
              url
            }
            previewImage {
              altText
              height
              id
              url
              width
            }
          }
        }
      }
      options {
        name,
        values
      }
      selectedVariant: variantBySelectedOptions(selectedOptions: $selectedOptions) {
        ... on ProductVariant {
            ...variantFragment
          }
      }
      variants(first: 100) {
        nodes {
          ... on ProductVariant {
            ...variantFragment
          }
        }
      }
    }
  }
  ${VARIANT_FRAGMENT}
`;

export const GROUPING_PRODUCT_QUERY = `#graphql
  query product($handle: String!) {
    product(handle: $handle) {
      id
      title
      handle
      productType
      tags
      options {
        name,
        values
      }
      variants(first: 100) {
        nodes {
          id
          title
          availableForSale
          sku
          image {
            altText
            height
            id
            url
            width
          }
          price {
            currencyCode
            amount
          }
          compareAtPrice {
            currencyCode
            amount
          }
          selectedOptions {
            name
            value
          }
          product {
            handle
          }
        }
      }
    }
  }
`;

export const PRODUCT_MINI_QUERY = `#graphql
  query product($handle: String!) {
    product(handle: $handle) {
      id
      title
      vendor
      productType
      priceRange {
        minVariantPrice {
          amount
        }
      }
    }
  }
`;
