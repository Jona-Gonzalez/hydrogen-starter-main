import {useCallback, useEffect, useRef, useState} from 'react';
import {useLocation} from '@remix-run/react';
import {useInView} from 'react-intersection-observer';
import {useSiteSettings} from '@pack/react';

import {getFilteredProducts, getSortedProducts} from './utils';

export function useCollectionProducts({
  activeFilters = {},
  filterByInStock = false,
  filtersMap = {},
  handle = null,
  pagination = {},
  products = [],
  promoTiles = [],
}) {
  const pathnameRef = useRef(null);
  const siteSettings = useSiteSettings();
  const {pathname} = useLocation();
  const {ref: loadMoreRef, inView} = useInView({
    rootMargin: '600px',
    triggerOnce: false,
  });

  const [filteredProducts, setFilteredProducts] = useState(products);
  const [filteredProductsColHandle, setFilteredProductsColHandle] =
    useState(handle);
  const [productsLimit, setProductsLimit] = useState(filteredProducts?.length);
  const [selectedSort, setSelectedSort] = useState(null);

  const enabledPagination = pagination?.enabled || true;
  const resultsPerPage = pagination?.resultsPerPage || 24;
  const isInfiniteScroll =
    pagination?.enabled && pagination?.loadType === 'infinite';
  const {colorGroups} = {...siteSettings?.settings?.collection?.filters};

  const selectSort = useCallback((sort) => {
    setSelectedSort(sort || null);
  }, []);

  const loadMoreProducts = useCallback(() => {
    if (productsLimit >= filteredProducts?.length) return;
    const numOfPromoTilesInLoad = promoTiles?.reduce((acc, {position}) => {
      const index = position - 1;
      if (index >= productsLimit && index < productsLimit + resultsPerPage) {
        return acc + 1;
      }
      return acc;
    }, 0);
    setProductsLimit(
      productsLimit + resultsPerPage - (numOfPromoTilesInLoad || 0),
    );
  }, [filteredProducts?.length, productsLimit, promoTiles, resultsPerPage]);

  // sets products limit on collection cms changes
  useEffect(() => {
    if (!enabledPagination || !resultsPerPage) {
      setProductsLimit(filteredProducts?.length);
      return undefined;
    }
    if (!promoTiles) {
      setProductsLimit(resultsPerPage);
      return undefined;
    }
    const numOfPromoTilesInLoad = promoTiles.reduce((acc, {position}) => {
      const index = position - 1;
      if (pathname !== pathnameRef.current && index < resultsPerPage) {
        return acc + 1;
      }
      if (index >= productsLimit && index < productsLimit + resultsPerPage) {
        return acc + 1;
      }
      return acc;
    }, 0);
    setProductsLimit(resultsPerPage - (numOfPromoTilesInLoad || 0));
    pathnameRef.current = pathname;
    return () => {
      pathnameRef.current = null;
    };
  }, [pathname, enabledPagination, resultsPerPage, promoTiles]);

  // filters and sorts products
  useEffect(() => {
    const _filteredProducts = getFilteredProducts({
      activeFilters,
      colorGroups,
      filterByInStock,
      filtersMap,
      products,
    });
    const sortedProducts = getSortedProducts({
      products: _filteredProducts,
      sortBy: selectedSort?.value,
    });
    setFilteredProducts(sortedProducts);
    setFilteredProductsColHandle(handle);
  }, [
    activeFilters,
    colorGroups,
    enabledPagination,
    filterByInStock,
    handle,
    products,
    resultsPerPage,
    selectedSort?.value,
  ]);

  // auto loads more products if infinite scroll is enabled
  useEffect(() => {
    if (!inView || !isInfiniteScroll) return;
    loadMoreProducts();
  }, [inView, isInfiniteScroll]);

  // clear products and sort state on unmount
  useEffect(() => {
    return () => {
      setFilteredProducts([]);
      setFilteredProductsColHandle(null);
      // 100 is arbitrary, just a high number if no pagination; gets re-set on mount
      setProductsLimit(enabledPagination ? resultsPerPage : 100);
      setSelectedSort(null);
    };
  }, []);

  return {
    state: {
      // if collection handle for cached products does match current handle on mount, use products directly from collection instead
      filteredProducts:
        filteredProductsColHandle === handle ? filteredProducts : products,
      isInfiniteScroll,
      productsLimit,
      selectedSort,
    },
    actions: {
      loadMoreProducts,
      selectSort,
    },
    refs: {
      loadMoreRef,
    },
  };
}
