import {VARIANT_FRAGMENT} from './Product.queries';

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

export const COLLECTION_PAGE_QUERY = `#graphql
  query CollectionPage($handle: String!, $version: Version) {
    collectionPage: collectionPageByHandle(handle: $handle, version: $version) {
      id
      title
      handle
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

export const PRODUCT_ITEM_FRAGMENT = `#graphql
  fragment productItemFragment on Product {
    id
    title
    handle
    vendor
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
    media(first: 2) {
      nodes {
        mediaContentType
          previewImage {
            url
            width
            height
            altText
          }
          ... on Video {
          sources {
            height
            mimeType
            url
            width
          }
        }
      }
    }
    options {
      values
      name
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
    variants(first: 50) {
      nodes {
        ... on ProductVariant {
            ...variantFragment
          }
      }
    }
  }
  ${VARIANT_FRAGMENT}
`;

const COLLECTION_FRAGMENT = `#graphql
  fragment collectionFragment on Collection {
    id
    title
    description
    handle
    products(first: $first, after: $cursor) {
      pageInfo {
        hasNextPage
        endCursor
      }
      nodes {
        ... on Product {
          ...productItemFragment
        }
      }
    }
  }
`;

export const COLLECTION_QUERY = `#graphql
  query CollectionDetails($first: Int!, $handle: String!, $cursor: String) {
    collection(handle: $handle) {
      ... on Collection {
        ...collectionFragment
      }
    }
  }
  ${COLLECTION_FRAGMENT}
  ${PRODUCT_ITEM_FRAGMENT}
`;

export const COLLECTION_MINI_QUERY = `#graphql
  query CollectionDetails($handle: String!) {
    collection(handle: $handle) {
      id
      handle
    }
  }
`;
