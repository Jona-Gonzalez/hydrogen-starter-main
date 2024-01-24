import {fragments} from './fragments';

/*
  accessToken ——————————————————————————————————————————————————————————————————————————————————————————
*/
const accessTokenCreate = `#graphql
  mutation accessTokenCreate(
    $country: CountryCode
    $input: CustomerAccessTokenCreateInput!
  ) @inContext(country: $country) {
    login: customerAccessTokenCreate(input: $input) {
      errors: customerUserErrors {
        ...CustomerUserError
      }
      accessToken: customerAccessToken {
        ...AccessToken
      }
    }
  }
  ${fragments.customerError}
  ${fragments.customerAccessToken}
`;

const accessTokenRenew = `#graphql
  mutation accessTokenRenew($country: CountryCode, $accessToken: String!)
  @inContext(country: $country) {
    renew: customerAccessTokenRenew(customerAccessToken: $accessToken) {
      errors: userErrors {
        ...UserError
      }
      accessToken: customerAccessToken {
        ...AccessToken
      }
    }
  }
  ${fragments.error}
  ${fragments.customerAccessToken}
`;

/*
  address  ——————————————————————————————————————————————————————————————————————————————————————————
*/
const addressCreate = `#graphql
  mutation addressCreate(
    $country: CountryCode
    $accessToken: String!
    $address: MailingAddressInput!
  ) @inContext(country: $country) {
    create: customerAddressCreate(
      customerAccessToken: $accessToken
      address: $address
    ) {
      errors: customerUserErrors {
        ...CustomerUserError
      }
      address: customerAddress {
        ...AddressFull
      }
    }
  }
  ${fragments.customerError}
  ${fragments.addressFull}
`;

const addressDelete = `#graphql
  mutation addressDelete($country: CountryCode, $accessToken: String!, $id: ID!)
  @inContext(country: $country) {
    delete: customerAddressDelete(id: $id, customerAccessToken: $accessToken) {
      errors: customerUserErrors {
        ...CustomerUserError
      }
      deletedCustomerAddressId
    }
  }
  ${fragments.customerError}
`;

const addressUpdate = `#graphql
  mutation addressUpdate(
    $country: CountryCode
    $id: ID!
    $accessToken: String!
    $address: MailingAddressInput!
  ) @inContext(country: $country) {
    update: customerAddressUpdate(
      customerAccessToken: $accessToken
      id: $id
      address: $address
    ) {
      errors: customerUserErrors {
        ...CustomerUserError
      }
      address: customerAddress {
        ...AddressFull
      }
    }
  }
  ${fragments.customerError}
  ${fragments.addressFull}
`;

const addressDefaultUpdate = `#graphql
  mutation addressDefaultUpdate(
    $country: CountryCode
    $accessToken: String!
    $id: ID!
  ) @inContext(country: $country) {
    default: customerDefaultAddressUpdate(
      customerAccessToken: $accessToken
      addressId: $id
    ) {
      errors: customerUserErrors {
        ...CustomerUserError
      }
      customer {
        defaultAddress {
          ...AddressFull
        }
      }
    }
  }
  ${fragments.customerError}
  ${fragments.addressFull}
`;

/*
  customer  ——————————————————————————————————————————————————————————————————————————————————————————
*/
const customerActivate = `#graphql
  mutation customerActivate(
    $country: CountryCode
    $id: ID!
    $input: CustomerActivateInput!
  ) @inContext(country: $country) {
    customerActivate(id: $id, input: $input) {
      errors: customerUserErrors {
        ...CustomerUserError
      }
      accessToken: customerAccessToken {
        ...AccessToken
      }
      customer {
        ...CustomerSummary
      }
    }
  }
  ${fragments.customerSummary}
  ${fragments.customerError}
  ${fragments.customerAccessToken}
`;

const customerLogin = `#graphql
  mutation customerLogin(
    $country: CountryCode
    $input: CustomerAccessTokenCreateInput!
  ) @inContext(country: $country) {
    login: customerAccessTokenCreate(input: $input) {
      errors: customerUserErrors {
        ...CustomerUserError
      }
      customerAccessToken {
        ...AccessToken
      }
    }
  }
  ${fragments.customerError}
  ${fragments.customerAccessToken}
`;

const customerCreate = `#graphql
  mutation customerCreate($country: CountryCode, $input: CustomerCreateInput!)
  @inContext(country: $country) {
    customerCreate(input: $input) {
      errors: customerUserErrors {
        ...CustomerUserError
      }
      customer {
        ...CustomerSummary
      }
    }
  }
  ${fragments.customerSummary}
  ${fragments.customerError}
`;

const customerUpdate = `#graphql
  mutation customerUpdate(
    $country: CountryCode
    $accessToken: String!
    $customer: CustomerUpdateInput!
  ) @inContext(country: $country) {
    customerUpdate(customerAccessToken: $accessToken, customer: $customer) {
      errors: customerUserErrors {
        ...CustomerUserError
      }
      customer {
        ...CustomerSummary
      }
    }
  }
  ${fragments.customerSummary}
  ${fragments.customerError}
`;

/*
  password  ——————————————————————————————————————————————————————————————————————————————————————————
*/
const passwordRecover = `#graphql
  mutation passwordRecover($country: CountryCode, $email: String!)
  @inContext(country: $country) {
    recover: customerRecover(email: $email) {
      errors: customerUserErrors {
        ...CustomerUserError
      }
    }
  }
  ${fragments.customerError}
`;

const passwordReset = `#graphql
  mutation passwordReset(
    $country: CountryCode
    $resetUrl: URL!
    $password: String!
  ) @inContext(country: $country) {
    reset: customerResetByUrl(resetUrl: $resetUrl, password: $password) {
      errors: customerUserErrors {
        ...CustomerUserError
      }
      accessToken: customerAccessToken {
        ...AccessToken
      }
      customer {
        ...CustomerSummary
      }
    }
  }
  ${fragments.customerError}
  ${fragments.customerAccessToken}
  ${fragments.customerSummary}
`;

export const mutations = {
  accessTokenCreate,
  accessTokenRenew,

  addressCreate,
  addressDelete,
  addressUpdate,
  addressDefaultUpdate,

  customerActivate,
  customerLogin,
  customerCreate,
  customerUpdate,

  passwordRecover,
  passwordReset,
};
