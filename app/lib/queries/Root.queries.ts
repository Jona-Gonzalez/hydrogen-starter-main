import {PRODUCT_ITEM_FRAGMENT} from './Collection.queries';

export const SITE_SETTINGS_QUERY = `#graphql
  query SiteSettings($version: Version) {
    siteSettings(version: $version) {
      id
      status
      settings
      publishedAt
      createdAt
      updatedAt
    }
  }
`;

export const LAYOUT_QUERY = `#graphql
  query layout {
    shop {
      id
      name
      description
    }
  }
`;

export const PRODUCT_GROUPINGS_QUERY = `#graphql
  query ProductGroupings($first: Int!, $after: String) {
    groups(first: $first, after: $after) {
      pageInfo {
        hasNextPage
      }
      edges {
        node {
          id
          title
          description
          products {
            handle
          }
          subgroups {
            id
            title
            description
            products {
              handle
            }
          }
        }
      }
    }
  }
`;

export const PRODUCTS_QUERY = `#graphql
  query Products($first: Int!, $cursor: String) {
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
  ${PRODUCT_ITEM_FRAGMENT}
`;
