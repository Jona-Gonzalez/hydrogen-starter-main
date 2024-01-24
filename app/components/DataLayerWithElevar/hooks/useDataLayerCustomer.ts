// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable @typescript-eslint/naming-convention */
import {useCallback, useEffect, useRef, useState} from 'react';
import {useCart} from '@shopify/hydrogen-react';
import {useLocation} from '@remix-run/react';

import {mapCartLine} from './utils';

const IGNORED_PATHS = ['account', 'cart', 'collections', 'products', 'search'];
const LOGGED_OUT_ACCOUNT_PATHS = [
  '/account/login',
  '/account/register',
  '/account/reset',
  '/account/activate',
];

export function useDataLayerCustomer({
  currencyCode,
  DEBUG,
  userProperties,
}: {
  currencyCode?: string | undefined;
  DEBUG: boolean;
  userProperties: any;
}) {
  const pathnameRef = useRef<string | undefined>(undefined);
  const {cost, lines, status} = useCart();
  const {pathname} = useLocation();

  const [delayForContextIsFinished, setDelayForContextIsFinished] =
    useState(false);
  const [userDataEventTriggered, setUserDataEventTriggered] = useState(false);

  const userDataEvent = useCallback(
    ({
      currencyCode: passedCurrencyCode,
      userProperties: _userProperties,
    }: {
      currencyCode?: string;
      userProperties: any;
    }) => {
      const previousPath = sessionStorage.getItem('PREVIOUS_PATH');
      const list =
        (window.location.pathname.startsWith('/collections') &&
          window.location.pathname) ||
        (previousPath?.startsWith('/collections') && previousPath) ||
        '';
      const event = {
        event: 'dl_user_data',
        cart_total: cost?.totalAmount?.amount || '0.0',
        user_properties: _userProperties,
        ecommerce: {
          currencyCode:
            passedCurrencyCode ||
            cost?.totalAmount?.currencyCode ||
            currencyCode,
          cart_contents: {
            products: lines?.map(mapCartLine(list)) || [],
          },
        },
      };

      window.ElevarDataLayer = window.ElevarDataLayer ?? [];
      window.ElevarDataLayer.push(event);
      setUserDataEventTriggered(true);
      setDelayForContextIsFinished(false);
      if (DEBUG) console.log(`DataLayer:elevar:${event.event}`, event);
    },
    [status === 'idle', currencyCode],
  );

  // Force delay on user data event to allow for elevar context to be ready
  useEffect(() => {
    setTimeout(() => setDelayForContextIsFinished(true), 1000);
  }, [pathname]);

  // Trigger 'dl_user_data' event on path change after base data is ready,
  // excluding account and paths that trigger event directly before their respective events
  useEffect(() => {
    if (
      !delayForContextIsFinished ||
      !userProperties ||
      IGNORED_PATHS.includes(pathname.split('/')[1]) ||
      pathname.startsWith('/pages/search') ||
      pathname === pathnameRef.current
    )
      return undefined;

    userDataEvent({userProperties});

    pathnameRef.current = pathname;
    return () => {
      pathnameRef.current = undefined;
    };
  }, [pathname, delayForContextIsFinished, !!userProperties]);

  // Trigger 'dl_user_data' event on account pages after base data is ready,
  // excluding after login/register events
  useEffect(() => {
    if (
      !delayForContextIsFinished ||
      !userProperties ||
      !pathname.startsWith('/account') ||
      pathname === pathnameRef.current
    )
      return undefined;

    const prevPath = sessionStorage.getItem('PREVIOUS_PATH') || '';
    const currentPath = sessionStorage.getItem('CURRENT_PATH') || '';
    const prevPathInlcRefresh =
      sessionStorage.getItem('PREVIOUS_PATH_INLC_REFRESH') || '';

    // On login or register, prevent event as it triggers directly from the login/register events
    const isFromLoginOrRegisterEvent =
      (prevPath.startsWith('/account/login') ||
        prevPath.startsWith('/account/register')) &&
      currentPath !== prevPathInlcRefresh;
    const isLoggedOutAccountPath = LOGGED_OUT_ACCOUNT_PATHS.some((path) =>
      pathname.startsWith(path),
    );
    if (isFromLoginOrRegisterEvent && !isLoggedOutAccountPath) return undefined;

    // On log out, trigger event with guest visitor type
    const isFromLogoutEvent =
      pathname.startsWith('/account/login') && prevPath.startsWith('/account');
    const prevPathIsLoggedOutAccountPath = LOGGED_OUT_ACCOUNT_PATHS.some(
      (path) => prevPath.startsWith(path),
    );
    if (isFromLogoutEvent && !prevPathIsLoggedOutAccountPath) {
      userDataEvent({
        userProperties: {visitor_type: 'guest', user_consent: ''},
      });
    } else {
      // Else trigger event for all other instances
      userDataEvent({userProperties});
    }

    pathnameRef.current = pathname;
    return () => {
      pathnameRef.current = undefined;
    };
  }, [pathname, delayForContextIsFinished, !!userProperties]);

  return {userDataEvent, userDataEventTriggered};
}
