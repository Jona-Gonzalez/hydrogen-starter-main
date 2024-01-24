export type Customer = any; // TODO: add types from customer fragment

export type CustomerStatus =
  | 'uninitialized'
  | 'creating'
  | 'fetching'
  | 'logged_in'
  | 'guest';

export type AccessToken = {
  token: string;
  expires: string;
} | null;

export interface CustomerState {
  accessToken: AccessToken;
  customer: Customer;
  customerStatus: CustomerStatus;
}

export interface CustomerActions {
  setAccessToken: (accessToken: AccessToken) => void;
  setCustomer: (customer: Customer) => void;
  setCustomerStatus: (status: CustomerStatus) => void;
}
