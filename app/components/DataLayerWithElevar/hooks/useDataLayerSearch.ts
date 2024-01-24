// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable @typescript-eslint/naming-convention */
import {useCallback, useEffect, useRef, useState} from 'react';
import {useLocation} from '@remix-run/react';

import {mapProductItemProduct, mapProductItemVariant} from './utils';
import {useGlobalContext} from '~/contexts';

export function useDataLayerSearch({
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
  const pathnameRef = useRef<string | undefined>(undefined);
  const {pathname} = useLocation();
  const {
    state: {emitter},
  }: any = useGlobalContext();

  const [searchPageResults, setSearchPageResults] = useState<any[] | undefined>(
    undefined,
  );
  const [searchResults, setSearchResults] = useState<any[] | undefined>(
    undefined,
  );
  const [clickedSearchResultsItem, setClickedSearchResultsItem] = useState<
    any | undefined
  >(undefined);

  const viewSearchResultsEvent = useCallback(
    ({
      results,
      userProperties: _userProperties,
    }: {
      results?: any[];
      userProperties: any;
    }) => {
      if (!results?.length) return;
      const event = {
        event: 'dl_view_search_results',
        user_properties: _userProperties,
        ecommerce: {
          currencyCode: results[0].variants?.nodes?.[0]?.price?.currencyCode,
          actionField: {list: 'search results'},
          impressions: results.slice(0, 7).map(mapProductItemProduct()),
        },
      };

      window.ElevarDataLayer = window.ElevarDataLayer ?? [];
      window.ElevarDataLayer.push(event);
      if (DEBUG) console.log(`DataLayer:elevar:${event.event}`, event);
    },
    [],
  );

  const clickSearchResultsItemEvent = useCallback(
    ({
      userProperties: _userProperties,
      variant,
    }: {
      userProperties: any;
      variant?: any;
    }) => {
      if (!variant) return;
      const event = {
        event: 'dl_select_item',
        user_properties: _userProperties,
        ecommerce: {
          currencyCode: variant.price?.currencyCode,
          click: {
            actionField: {list: 'search results', action: 'click'},
            products: [variant].map(mapProductItemVariant()),
          },
        },
      };

      window.ElevarDataLayer = window.ElevarDataLayer ?? [];
      window.ElevarDataLayer.push(event);
      if (DEBUG) console.log(`DataLayer:elevar:${event.event}`, event);
    },
    [],
  );

  // Subscribe to EventEmitter topics for 'view_search_results' and 'select_item' events
  useEffect(() => {
    emitter?.on('VIEW_SEARCH_PAGE_RESULTS', (results: any[]) => {
      setSearchPageResults(results);
    });
    emitter?.on('VIEW_SEARCH_RESULTS', (results: any[]) => {
      setSearchResults(results);
    });
    emitter?.on('CLICK_SEARCH_ITEM', (variant: any) => {
      setClickedSearchResultsItem(variant);
    });
    return () => {
      emitter?.off('VIEW_SEARCH_PAGE_RESULTS', (results: any[]) => {
        setSearchPageResults(results);
      });
      emitter?.off('VIEW_SEARCH_RESULTS', (results: any[]) => {
        setSearchResults(results);
      });
      emitter?.off('CLICK_SEARCH_ITEM', (variant: any) => {
        setClickedSearchResultsItem(variant);
      });
    };
  }, []);

  // Trigger 'dl_user_data' and 'dl_view_search_results' events after
  // new sidebar search results and base data is ready
  useEffect(() => {
    if (
      !pathname.startsWith('/pages/search') ||
      !pathname.startsWith('/search') ||
      !searchPageResults?.length ||
      !userProperties ||
      pathname === pathnameRef.current
    )
      return undefined;
    userDataEvent({userProperties});
    viewSearchResultsEvent({results: searchPageResults, userProperties});
    pathnameRef.current = pathname;
    return () => {
      pathnameRef.current = undefined;
    };
  }, [
    pathname,
    searchPageResults?.map((p) => p?.handle).join(''),
    !!userProperties,
  ]);

  // Trigger 'dl_user_data' and 'dl_view_search_results' events after
  // new search page results and base data is ready
  useEffect(() => {
    if (!searchResults || !userDataEventTriggered) return;
    viewSearchResultsEvent({results: searchResults, userProperties});
  }, [searchResults, userDataEventTriggered]);

  // Trigger 'dl_select_item' after clicked search item and user event
  useEffect(() => {
    if (!clickedSearchResultsItem || !userDataEventTriggered) return;
    clickSearchResultsItemEvent({
      userProperties,
      variant: clickedSearchResultsItem,
    });
  }, [clickedSearchResultsItem, userDataEventTriggered]);
}
