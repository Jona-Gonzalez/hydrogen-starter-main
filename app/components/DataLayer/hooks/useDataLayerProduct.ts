// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable @typescript-eslint/naming-convention */
import {useCallback, useEffect, useRef, useState} from 'react';
import {v4 as uuidv4} from 'uuid';

import {mapProductPageVariant} from './utils';
import {useGlobalContext} from '~/contexts';

export function useDataLayerProduct({
  DEBUG,
  userDataEvent,
  userProperties,
}: {
  DEBUG?: boolean;
  userDataEvent: (arg0: any) => void;
  userProperties: any;
}) {
  const productHandleRef = useRef<string | undefined>(undefined);
  const {
    state: {emitter},
  }: any = useGlobalContext();

  const [viewedProductVariant, setViewedProductVariant] =
    useState<any>(undefined);

  const viewProductEvent = useCallback(
    ({
      variant,
      userProperties: _userProperties,
    }: {
      variant?: any;
      userProperties: any;
    }) => {
      if (!variant) return;
      const previousPath = sessionStorage.getItem('PREVIOUS_PATH');
      const list = previousPath?.startsWith('/collections') ? previousPath : '';
      const event = {
        event: 'view_item',
        event_id: uuidv4(),
        event_time: new Date().toISOString(),
        user_properties: _userProperties,
        ecommerce: {
          currencyCode: variant.price?.currencyCode,
          detail: {
            actionField: {list, action: 'detail'},
            products: [variant].map(mapProductPageVariant(list)),
          },
        },
      };

      if (window.gtag) window.gtag('event', event.event, event);
      if (DEBUG) console.log(`DataLayer:gtag:${event.event}`, event);
    },
    [],
  );

  // Subscribe to EventEmitter topic for 'view_item' event
  useEffect(() => {
    emitter?.on('VIEW_PRODUCT_PAGE', (variant: any) => {
      setViewedProductVariant(variant);
    });
    return () => {
      emitter?.off('VIEW_PRODUCT_PAGE', (variant: any) => {
        setViewedProductVariant(variant);
      });
    };
  }, []);

  // Trigger 'user_data' and 'view_item' events on viewedProductVariant change after base data is ready
  useEffect(() => {
    const pageHandle = window.location.pathname.split('/').pop();
    if (
      !userProperties ||
      !viewedProductVariant ||
      productHandleRef.current === pageHandle
    )
      return;
    userDataEvent({userProperties});
    viewProductEvent({variant: viewedProductVariant, userProperties});
    productHandleRef.current = pageHandle;
  }, [viewedProductVariant?.product?.id, !!userProperties]);
}
