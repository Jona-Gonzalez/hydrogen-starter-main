import {useMemo} from 'react';
import {useSiteSettings} from '@pack/react';
import PropTypes from 'prop-types';

import {CollectionFilters} from './CollectionFilters';
import {CollectionGrid} from './CollectionGrid';
import {CollectionSort} from './CollectionSort';
import {useCollectionFilters} from './useCollectionFilters';
import {useCollectionProducts} from './useCollectionProducts';
import {useColorSwatches, useDataLayerViewCollection} from '~/hooks';

export function Collection({allProductsLoaded, collection, showHeading}) {
  const {handle, products, title} = collection;
  const {swatchesMap} = useColorSwatches();
  const siteSettings = useSiteSettings();

  const settings = siteSettings?.settings?.collection;
  const {
    filters: filtersSettings,
    sort: sortSettings,
    pagination,
    promotion,
  } = {...settings};
  const enabledFilters = filtersSettings?.enabled;
  const enabledSort = sortSettings?.enabled;
  const isSearchResults = handle === 'search';

  const promoTiles = useMemo(() => {
    if (!promotion?.campaigns?.length) return null;
    const campaign = promotion.campaigns.find(({collections, enabled}) => {
      if (!enabled) return false;
      return collections?.some((colHandle) => colHandle.trim() === handle);
    });
    return campaign?.promoTiles || null;
  }, [handle, promotion?.campaigns]);

  const collectionFiltersContext = useCollectionFilters({
    allProductsLoaded,
    enabledFilters,
    products: products.nodes,
    settings,
  });

  const collectionProductsContext = useCollectionProducts({
    activeFilters: collectionFiltersContext.state.activeFilters,
    filterByInStock: collectionFiltersContext.state.filterByInStock,
    filtersMap: collectionFiltersContext.state.filtersMap,
    handle,
    pagination,
    products: products.nodes,
    promoTiles,
  });

  useDataLayerViewCollection({collection});

  return (
    <div
      className={`md:px-contained py-contained mx-auto grid w-full max-w-[var(--content-max-width)] grid-cols-2 max-md:!pt-0 ${
        enabledFilters
          ? 'md:grid-cols-[12rem_1fr] md:gap-x-6'
          : 'md:grid-cols-1'
      }`}
    >
      {showHeading && (
        <h1
          className={`text-title-h3 max-md:col-span-2 max-md:mb-4 max-md:mt-8 max-md:px-4 md:whitespace-nowrap ${
            !enabledSort ? 'md:col-span-2 md:mb-6' : ''
          }`}
        >
          {title}
        </h1>
      )}

      {enabledSort && (
        <div
          className={`max-md:order-2 md:mb-6 ${
            showHeading ? '' : 'md:col-span-2'
          } ${enabledFilters ? '' : 'max-md:col-span-2'}`}
        >
          <CollectionSort
            selectedSort={collectionProductsContext.state.selectedSort}
            selectSort={collectionProductsContext.actions.selectSort}
            settings={settings}
          />
        </div>
      )}

      {enabledFilters && (
        <div
          className={`${
            enabledSort
              ? 'max-md:order-1 max-md:border-r max-md:border-border'
              : 'max-md:col-span-2'
          }`}
        >
          <CollectionFilters
            collectionFiltersContext={collectionFiltersContext}
            collectionCount={products?.nodes?.length}
            swatchesMap={swatchesMap}
          />
        </div>
      )}

      <div className="max-md:order-3 max-md:col-span-2 max-md:mt-6">
        <CollectionGrid
          activeFilters={collectionFiltersContext.state.activeFilters}
          collectionProductsContext={collectionProductsContext}
          enabledFilters={enabledFilters}
          isSearchResults={isSearchResults}
          promoTiles={promoTiles}
          settings={settings}
          swatchesMap={swatchesMap}
        />
      </div>
    </div>
  );
}

Collection.displayName = 'Collection';
Collection.defaultProps = {
  handle: undefined,
  products: [],
  productsReady: true,
  showHeading: false,
  title: '',
};
Collection.propTypes = {
  handle: PropTypes.string,
  products: PropTypes.arrayOf(PropTypes.object),
  productsReady: PropTypes.bool,
  showHeading: PropTypes.bool,
  title: PropTypes.string,
};
