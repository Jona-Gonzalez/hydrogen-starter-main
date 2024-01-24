// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable @typescript-eslint/naming-convention */
import {useCallback, useEffect, useRef, useState} from 'react';
import {v4 as uuidv4} from 'uuid';

import {mapProductItemProduct, mapProductItemVariant} from './utils';
import {useGlobalContext} from '~/contexts';

export function useDataLayerCollection({
  DEBUG,
  userDataEvent,
  userDataEventTriggered,
  userProperties,
}: {
  DEBUG?: boolean;
  userDataEvent: (arg0: any) => void;
  userDataEventTriggered: boolean;
  userProperties: any;
}) {
  const collectionHandleRef = useRef<string | undefined>(undefined);
  const {
    state: {emitter},
  }: any = useGlobalContext();

  const [collectionProducts, setCollectionProducts] = useState(null);
  const [clickedCollectionItem, setClickedCollectionItem] = useState(null);

  const viewCollectionEvent = useCallback(
    ({
      products,
      userProperties: _userProperties,
    }: {
      products?: any;
      userProperties: any;
    }) => {
      if (!products?.length) return;
      const list = window.location.pathname.startsWith('/collections')
        ? window.location.pathname
        : '';
      const event = {
        event: 'view_item_list',
        event_id: uuidv4(),
        event_time: new Date().toISOString(),
        user_properties: _userProperties,
        ecommerce: {
          currencyCode: products[0].variants?.nodes?.[0]?.price?.currencyCode,
          impressions: products.slice(0, 7).map(mapProductItemProduct(list)),
        },
      };

      if (window.gtag) window.gtag('event', event.event, event);
      if (DEBUG) console.log(`DataLayer:gtag:${event.event}`, event);
    },
    [],
  );

  const clickCollectionItemEvent = useCallback(
    ({variant}: {variant?: any}) => {
      if (!variant) return;
      const list = variant.list || '';
      const event = {
        event: 'select_item',
        event_id: uuidv4(),
        event_time: new Date().toISOString(),
        user_properties: userProperties,
        ecommerce: {
          currencyCode: variant.price?.currencyCode,
          click: {
            actionField: {
              list,
              action: 'click',
            },
            products: [variant].map(mapProductItemVariant(list)),
          },
        },
      };

      if (window.gtag) window.gtag('event', event.event, event);
      if (DEBUG) console.log(`DataLayer:gtag:${event.event}`, event);
    },
    [userProperties],
  );

  // Subscribe to EventEmitter topic for 'dl_view_item_list' and 'dl_select_item' events
  useEffect(() => {
    emitter?.on('VIEW_COLLECTION_PAGE', (products: any) => {
      setCollectionProducts(products);
    });
    emitter?.on('CLICK_COLLECTION_ITEM', (variant: any) => {
      setClickedCollectionItem(variant);
    });
    return () => {
      emitter?.off('VIEW_COLLECTION_PAGE', (products: any) => {
        setCollectionProducts(products);
      });
      emitter?.off('CLICK_COLLECTION_ITEM', (variant: any) => {
        setClickedCollectionItem(variant);
      });
    };
  }, []);

  // Trigger 'user_data' and view 'view_item_list'
  // events on collection page and after base data is ready
  useEffect(() => {
    const pageHandle = window.location.pathname.split('/').pop();
    if (
      !collectionProducts?.length ||
      !userProperties ||
      collectionHandleRef.current === pageHandle
    )
      return;
    userDataEvent({userProperties});
    viewCollectionEvent({products: collectionProducts, userProperties});
    collectionHandleRef.current = pageHandle;
  }, [collectionProducts, !!userProperties]);

  // Trigger 'select_item' event on clicked collection
  // item and after user event
  useEffect(() => {
    if (!clickedCollectionItem || !userDataEventTriggered) return;
    clickCollectionItemEvent({variant: clickedCollectionItem});
  }, [clickedCollectionItem, userDataEventTriggered]);
}
