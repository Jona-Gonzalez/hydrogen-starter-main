import {fragments} from './fragments';

/*
  Queries ——————————————————————————————————————————————————————————————————————————————————————————
*/

const getAddresses = `#graphql
  query getAddresses($country: CountryCode, $accessToken: String!)
  @inContext(country: $country) {
    customer(customerAccessToken: $accessToken) {
      addresses(first: 250) {
        edges {
          node {
            ...AddressFull
          }
        }
      }
    }
  }
  ${fragments.addressFull}
`;

const getCustomer = `#graphql
  query getCustomer($country: CountryCode, $accessToken: String!)
  @inContext(country: $country) {
    customer(customerAccessToken: $accessToken) {
      ...CustomerSummary
    }
  }
  ${fragments.customerSummary}
`;

const getMetafield = `#graphql
  query getMetafield($country: CountryCode, $accessToken: String!, $namespace: String!, $key: String!)
  @inContext(country: $country) {
    customer(customerAccessToken: $accessToken) {
      id
      metafield(namespace: $namespace, key: $key){
        ...Metafield
      }
    }
  }
  ${fragments.metafield}
`;

const getOrderById = `#graphql
  query getOrderById($country: CountryCode, $id: ID!)
  @inContext(country: $country) {
    order: node(id: $id) {
      ...OrderFull
    }
  }
  ${fragments.orderFull}
`;

const getOrdersNext = `#graphql
  query getOrdersNext($country: CountryCode, $accessToken: String!, $first: Int!, $after: String)
  @inContext(country: $country) {
    customer(customerAccessToken: $accessToken) {
      orders(first: $first, after: $after, reverse: true) {
        pageInfo {
          hasNextPage
          hasPreviousPage
        }
        page: edges {
          cursor
          order: node {
            ...OrderSummary
          }
        }
      }
    }
  }
  ${fragments.orderSummary}
`;

const getOrdersPrevious = `#graphql
  query getOrdersPrevious($country: CountryCode, $accessToken: String!, $last: Int!, $before: String)
  @inContext(country: $country) {
    customer(customerAccessToken: $accessToken) {
      orders(last: $last, before: $before, reverse: true) {
        pageInfo {
          hasNextPage
          hasPreviousPage
        }
        page: edges {
          cursor
          order: node {
            ...OrderSummary
          }
        }
      }
    }
  }
  ${fragments.orderSummary}
`;

export const queries = {
  getAddresses,
  getCustomer,
  getMetafield,
  getOrderById,
  getOrdersNext,
  getOrdersPrevious,
};
