// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable @typescript-eslint/naming-convention */
import {useCallback, useEffect, useState} from 'react';

import {useGlobalContext} from '~/contexts';

export function useDataLayerAccount({
  currencyCode,
  DEBUG,
  generateUserProperties,
  userDataEvent,
  userDataEventTriggered,
}: {
  currencyCode?: string | undefined;
  DEBUG?: boolean;
  generateUserProperties: (arg0: any) => any;
  userDataEvent: (arg0: any) => void;
  userDataEventTriggered: boolean;
}) {
  const {
    state: {emitter},
  }: any = useGlobalContext();
  const customer = null;

  const [loggedIn, setLoggedIn] = useState(false);
  const [registered, setRegistered] = useState(false);

  const loggedInEvent = useCallback(({userProperties}: any) => {
    const event = {
      event: 'dl_login',
      user_properties: userProperties,
    };

    window.ElevarDataLayer = window.ElevarDataLayer ?? [];
    window.ElevarDataLayer.push(event);
    if (DEBUG) console.log(`DataLayer:elevar:${event.event}`, event);
    setLoggedIn(false);
  }, []);

  const registeredEvent = useCallback(({userProperties}: any) => {
    const event = {
      event: 'dl_sign_up',
      user_properties: userProperties,
    };

    window.ElevarDataLayer = window.ElevarDataLayer ?? [];
    window.ElevarDataLayer.push(event);
    if (DEBUG) console.log(`DataLayer:elevar:${event.event}`, event);
    setRegistered(false);
  }, []);

  const getUserPropertiesAndTriggerLoggedInEvents = useCallback(
    async ({
      customer: _customer,
      currencyCode: _currencyCode,
    }: {
      customer: any;
      currencyCode?: string | undefined;
    }) => {
      const userProperties = await generateUserProperties({
        customer: _customer,
      });
      loggedInEvent({userProperties});
      setTimeout(() => {
        userDataEvent({currencyCode: _currencyCode, userProperties});
      }, 1000);
    },
    [],
  );

  const getUserPropertiesAndTriggerRegisterEvents = useCallback(
    async ({
      customer: _customer,
      currencyCode: _currencyCode,
    }: {
      customer: any;
      currencyCode?: string | undefined;
    }) => {
      const userProperties = await generateUserProperties({
        customer: _customer,
      });
      registeredEvent({userProperties});
      setTimeout(() => {
        userDataEvent({currencyCode: _currencyCode, userProperties});
      }, 1000);
    },
    [],
  );

  // Subscribe to EventEmitter topics for 'login' and 'sign_up' events
  useEffect(() => {
    emitter?.on('CUSTOMER_LOGGED_IN', () => {
      setLoggedIn(true);
    });
    emitter?.on('CUSTOMER_REGISTERED', () => {
      setRegistered(true);
    });
    return () => {
      emitter?.off('CUSTOMER_LOGGED_IN', () => {
        setLoggedIn(true);
      });
      emitter?.off('CUSTOMER_REGISTERED', () => {
        setRegistered(true);
      });
    };
  }, []);

  // Generate new base data after customer login and customer profile is ready
  // Trigger 'dl_user_data' and 'dl_login' events
  useEffect(() => {
    if (!customer || !currencyCode || !loggedIn || !userDataEventTriggered)
      return;
    getUserPropertiesAndTriggerLoggedInEvents({
      customer,
      currencyCode,
    });
  }, [!!customer, !!currencyCode, loggedIn, userDataEventTriggered]);

  // Generate new base data after customer register and customer profile is ready
  // Trigger 'dl_user_data' and 'dl_sign_up' events
  useEffect(() => {
    if (!customer || !currencyCode || !registered || !userDataEventTriggered)
      return;
    getUserPropertiesAndTriggerRegisterEvents({
      customer,
      currencyCode,
    });
  }, [!!customer, !!currencyCode, registered, userDataEventTriggered]);
}
