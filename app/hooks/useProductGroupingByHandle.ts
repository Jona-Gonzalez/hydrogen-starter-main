import {useCallback, useMemo} from 'react';
import {useProductsContext} from '~/contexts';

// get product grouping object by handle from cache
export function useProductGroupingByHandle(handle: string | undefined) {
  const productsContext = useProductsContext();
  const {groupings, groupingIndexesMap} = {...productsContext?.state};

  const getProductGroupingByHandle = useCallback(
    (_handle: string) => {
      if (!_handle || !groupings?.length || !groupingIndexesMap)
        return undefined;
      return groupings[groupingIndexesMap[_handle]] || undefined;
    },
    [groupings, groupingIndexesMap],
  );

  const grouping = useMemo(() => {
    return getProductGroupingByHandle(handle);
  }, [handle, groupings, groupingIndexesMap]);

  return {grouping, getProductGroupingByHandle};
}
