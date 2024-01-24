import {useCallback, useMemo} from 'react';
import {useProductsContext} from '~/contexts';

// get product object by handle from cache
export function useProductByHandle(handle?: string | undefined) {
  const productsContext = useProductsContext();
  const {products, productIndexesMap}: any = {...productsContext?.state};

  const getProductByHandle: any = useCallback(
    (_handle: string) => {
      if (!_handle || !products?.length || !productIndexesMap) return undefined;
      return products[productIndexesMap[_handle]] || undefined;
    },
    [products, productIndexesMap],
  );

  const product = useMemo(() => {
    return getProductByHandle(handle);
  }, [handle, products, productIndexesMap]);

  return {product, getProductByHandle};
}
