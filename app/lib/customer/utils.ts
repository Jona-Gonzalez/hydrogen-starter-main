import {AccessToken} from '~/lib/types';

const isBrowser = typeof window !== 'undefined';
const SHOPIFY_NAME = isBrowser
  ? window.ENV?.PUBLIC_STORE_DOMAIN?.split('.')[0] || ''
  : '';
const CUSTOMER_TOKEN_KEY = `CustomerToken|${SHOPIFY_NAME}`;

export const getAccessTokenFromStorage = () => {
  if (!isBrowser) return null;
  const localAccessToken = window.localStorage.getItem(CUSTOMER_TOKEN_KEY);
  const accessToken = localAccessToken ? JSON.parse(localAccessToken) : null;

  // If there is no access token or it has expired, return null
  if (
    !accessToken ||
    (!!accessToken?.expires && parseInt(accessToken.expires, 10) < Date.now())
  ) {
    return null;
  }

  return accessToken;
};

export const setAccessTokenInStorage = (accessToken: AccessToken) => {
  if (!isBrowser) return null;
  let _accessToken = accessToken;

  if (!accessToken?.token || !accessToken?.expires) {
    _accessToken = null;
  }

  // If access token has expired, set to null in storage
  if (!!accessToken && parseInt(accessToken.expires, 10) < Date.now()) {
    _accessToken = null;
  }

  window.localStorage.setItem(CUSTOMER_TOKEN_KEY, JSON.stringify(_accessToken));
  return _accessToken;
};

export const removeAccessTokenFromStorage = () => {
  if (!isBrowser) return;
  window.localStorage.removeItem(CUSTOMER_TOKEN_KEY);
};
