// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable @typescript-eslint/naming-convention */
import {useCallback, useEffect, useRef, useState} from 'react';

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

  const [collectionProducts, setCollectionProducts] = useState<
    any[] | undefined
  >(undefined);
  const [clickedCollectionItem, setClickedCollectionItem] = useState<
    any | undefined
  >(undefined);

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
        event: 'dl_view_item_list',
        user_properties: _userProperties,
        ecommerce: {
          currencyCode: products[0].variants?.nodes?.[0]?.price?.currencyCode,
          impressions: products.slice(0, 7).map(mapProductItemProduct(list)),
        },
      };

      window.ElevarDataLayer = window.ElevarDataLayer ?? [];
      window.ElevarDataLayer.push(event);
      if (DEBUG) console.log(`DataLayer:elevar:${event.event}`, event);
    },
    [],
  );

  const clickCollectionItemEvent = useCallback(
    ({variant}: {variant?: any}) => {
      if (!variant) return;
      const list = variant.list || '';
      const event = {
        event: 'dl_select_item',
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

      window.ElevarDataLayer = window.ElevarDataLayer ?? [];
      window.ElevarDataLayer.push(event);
      if (DEBUG) console.log(`DataLayer:elevar:${event.event}`, event);
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

  // Trigger 'dl_user_data' and view 'dl_view_item_list'
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

  // Trigger 'dl_select_item' event on clicked collection
  // item and after user event
  useEffect(() => {
    if (!clickedCollectionItem || !userDataEventTriggered) return;
    clickCollectionItemEvent({variant: clickedCollectionItem});
  }, [clickedCollectionItem, userDataEventTriggered]);
}
