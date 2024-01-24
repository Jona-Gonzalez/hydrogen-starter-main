import {useEffect} from 'react';

import {useGlobalContext} from '~/contexts';

export function useDataLayerViewSearchResults({
  isSearchPage,
  products,
}: {
  isSearchPage?: boolean;
  products: any;
}) {
  const {
    state: {emitter},
  }: any = useGlobalContext();

  const SEARCH_EVENT = isSearchPage
    ? 'VIEW_SEARCH_PAGE_RESULTS'
    : 'VIEW_SEARCH_RESULTS';

  useEffect(() => {
    if (!emitter?._events[SEARCH_EVENT]) return;
    if (!products?.length) return;

    emitter?.emit(SEARCH_EVENT, products);
  }, [emitter?._eventsCount, products]);
}
