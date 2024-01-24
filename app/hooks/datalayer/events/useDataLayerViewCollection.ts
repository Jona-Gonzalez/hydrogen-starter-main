import {useEffect} from 'react';

import {useGlobalContext} from '~/contexts';

export function useDataLayerViewCollection({collection}: {collection: any}) {
  const {
    state: {emitter},
  }: any = useGlobalContext();

  useEffect(() => {
    if (!emitter?._events['VIEW_COLLECTION_PAGE']) return;
    if (!collection?.products?.nodes?.length) return;
    emitter?.emit(
      'VIEW_COLLECTION_PAGE',
      collection.products.nodes.slice(0, 7),
    );
  }, [
    emitter?._eventsCount,
    `${collection?.id}${!!collection?.products?.length}`,
  ]);
}
