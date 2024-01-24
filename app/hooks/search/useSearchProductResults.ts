import {useCallback, useEffect, useState} from 'react';
import Fuse from 'fuse.js';

import {COLOR_OPTION_NAME} from '~/lib/constants';
import {useProductsContext} from '~/contexts';

// info on further search index options: https://fusejs.io/api/options.html

export function useSearchProductResults({
  enabled = true,
  mounted = true,
  term = '',
}: {
  enabled?: boolean;
  mounted?: boolean;
  term: string | undefined;
}) {
  const productsContext = useProductsContext();
  const {products}: any = {...productsContext?.state};
  const [productsFuse, setProductsFuse] = useState<any>(undefined);
  const [productResults, setProductResults] = useState<any[] | undefined>(
    undefined,
  );

  const setProductsFuseOnMount = useCallback(async () => {
    try {
      if (!products?.length || productsFuse) return;
      setProductsFuse(
        new Fuse(products, {
          keys: [
            {name: 'title', weight: 2},
            'productType',
            `optionsMap.${COLOR_OPTION_NAME}`,
          ],
          ignoreLocation: true,
          minMatchCharLength: 3,
          threshold: 0.3,
        }),
      );
    } catch (error: any) {
      console.error(error.message);
    }
  }, [products]);

  const searchProductsOnTermChange = useCallback(() => {
    if (!productsFuse) return;
    if (!term) {
      setProductResults([]);
      return;
    }
    const results = productsFuse.search(term);
    setProductResults(
      results.reduce((acc: any[], {item}: {item: any}) => {
        // TODO: logic to filter out draft products on production
        // if (item.status !== 'ACTIVE') return acc;
        return [...acc, item];
      }, []),
    );
  }, [productsFuse, term]);

  useEffect(() => {
    if (!mounted || !enabled) return;
    setProductsFuseOnMount();
  }, [mounted, enabled, products]);

  useEffect(() => {
    searchProductsOnTermChange();
  }, [term, productsFuse]);

  return {productResults};
}
