// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable @typescript-eslint/naming-convention */
import {useCallback, useEffect, useState} from 'react';

import {useGlobalContext} from '~/contexts';

export function useDataLayerSubscribe({
  DEBUG,
  userDataEventTriggered,
}: {
  DEBUG?: boolean;
  userDataEventTriggered: boolean;
}) {
  const {
    state: {emitter},
  }: any = useGlobalContext();

  const [subscribedEmail, setSubscribedEmail] = useState('');
  const [subscribedPhone, setSubscribedPhone] = useState('');

  const subscribeEmailEvent = useCallback(({email}: {email: string}) => {
    if (!email) return;
    const event = {
      event: 'dl_subscribe',
      lead_type: 'email',
      user_properties: {customer_email: email},
    };

    window.ElevarDataLayer = window.ElevarDataLayer ?? [];
    window.ElevarDataLayer.push(event);
    if (DEBUG) console.log(`DataLayer:elevar:${event.event}`, event);
  }, []);

  const subscribePhoneEvent = useCallback(({phone}: {phone: string}) => {
    if (!phone) return;
    const event = {
      event: 'dl_subscribe',
      lead_type: 'phone',
      user_properties: {customer_phone: phone},
    };

    window.ElevarDataLayer = window.ElevarDataLayer ?? [];
    window.ElevarDataLayer.push(event);
    if (DEBUG) console.log(`DataLayer:elevar:${event.event}`, event);
  }, []);

  // Subscribe to EventEmitter topic for 'subscribe' event
  useEffect(() => {
    emitter?.on('SUBSCRIBE_EMAIL', (email: string) => {
      setSubscribedEmail(email);
    });
    emitter?.on('SUBSCRIBE_PHONE', (phone: string) => {
      setSubscribedPhone(phone);
    });
    return () => {
      emitter?.off('SUBSCRIBE_EMAIL', (email: string) => {
        setSubscribedEmail(email);
      });
      emitter?.off('SUBSCRIBE_PHONE', (phone: string) => {
        setSubscribedPhone(phone);
      });
    };
  }, []);

  // Trigger 'dl_subscribe' event after email submission
  useEffect(() => {
    if (!subscribedEmail || !userDataEventTriggered) return;
    subscribeEmailEvent({email: subscribedEmail});
  }, [subscribedEmail, userDataEventTriggered]);

  // Trigger 'dl_subscribe' event after phone submission
  useEffect(() => {
    if (!subscribedPhone || !userDataEventTriggered) return;
    subscribePhoneEvent({phone: subscribedPhone});
  }, [subscribedPhone, userDataEventTriggered]);
}
