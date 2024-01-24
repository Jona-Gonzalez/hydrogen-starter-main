import {useSiteSettings} from '@pack/react';

import {CollectionDropdownFilter} from './CollectionDropdownFilter';
import {CollectionFiltersSummary} from './CollectionFiltersSummary';
import {CollectionMobileFilters} from './CollectionMobileFilters';
import {Svg} from '~/components';

export function CollectionFilters({
  collectionCount,
  collectionFiltersContext,
  swatchesMap,
}) {
  const siteSettings = useSiteSettings();
  const {enabled: inStockFilterEnabled, label: inStockLabel} = {
    ...siteSettings?.settings?.collection?.inStockFilter,
  };
  const {optionsMaxCount, showCount, sticky} = {
    ...siteSettings?.settings?.collection?.filters,
  };
  const stickyPromobar =
    siteSettings?.settings?.header?.promobar?.enabled &&
    !siteSettings?.settings?.header?.promobar?.autohide;
  const stickyTopClass = stickyPromobar
    ? 'md:top-[calc(var(--header-height)+var(--promobar-height)+1.5rem)]'
    : 'md:top-[calc(var(--header-height)+1.5rem)]';
  const {
    state: {activeFilters, filterByInStock, filters, filtersMap},
    actions: {addFilter, removeFilter, clearFilters, setFilterByInStock},
  } = collectionFiltersContext;

  return (
    <div
      className={`flex flex-col gap-5 md:sticky ${
        sticky ? stickyTopClass : ''
      }`}
    >
      {/* desktop */}
      <div className="max-md:hidden">
        <ul className={`border-border ${filters.length ? 'border-b' : ''}`}>
          {filters.map((filter, index) => {
            if (
              !filter.values.length ||
              (filter.values.length === 1 &&
                filter.values[0].count === collectionCount)
            )
              return null;

            return (
              <li key={index}>
                <CollectionDropdownFilter
                  activeFilters={activeFilters}
                  addFilter={addFilter}
                  defaultOpen={filter.defaultOpenDesktop}
                  filter={filter}
                  optionsMaxCount={optionsMaxCount}
                  removeFilter={removeFilter}
                  showCount={showCount}
                  swatchesMap={swatchesMap}
                />
              </li>
            );
          })}
        </ul>

        {inStockFilterEnabled && filters.length > 0 && (
          <div className="mt-4 flex flex-col">
            <button
              aria-label={inStockLabel}
              className="flex gap-2 text-left"
              onClick={() => setFilterByInStock(!filterByInStock)}
              type="button"
            >
              <div
                className={`relative flex h-5 w-5 items-center justify-center overflow-hidden rounded border border-border transition md:mt-[3px] md:h-[18px] md:w-[18px] group-hover:md:border-text ${
                  filterByInStock ? 'border-text bg-black' : 'bg-offWhite'
                }`}
              >
                <div
                  className={`absolute left-1/2 top-1/2 h-full w-full -translate-x-1/2 -translate-y-1/2 rounded-[1px] border-white transition-[border-width] duration-100 ${
                    filterByInStock
                      ? 'border-[0px] md:border-[0px]'
                      : 'border-[0px]'
                  }`}
                />

                <Svg
                  src="/svgs/checkmark.svg#checkmark"
                  viewBox="0 0 24 24"
                  className={`pointer-events-none w-6 text-white transition md:w-5 ${
                    filterByInStock ? 'opacity-100' : 'opacity-0'
                  }`}
                />
              </div>

              <p className="flex-1 pt-1 text-xs">{inStockLabel}</p>
            </button>
          </div>
        )}
      </div>

      {/* mobile */}
      <div className="md:hidden">
        <CollectionMobileFilters
          activeFilters={activeFilters}
          addFilter={addFilter}
          clearFilters={clearFilters}
          collectionCount={collectionCount}
          filterByInStock={filterByInStock}
          filters={filters}
          filtersMap={filtersMap}
          inStockFilterEnabled={inStockFilterEnabled}
          inStockLabel={inStockLabel}
          optionsMaxCount={optionsMaxCount}
          removeFilter={removeFilter}
          setFilterByInStock={setFilterByInStock}
          showCount={showCount}
          swatchesMap={swatchesMap}
        />
      </div>

      <div className="hidden md:block">
        <CollectionFiltersSummary
          activeFilters={activeFilters}
          clearFilters={clearFilters}
          filtersMap={filtersMap}
          removeFilter={removeFilter}
        />
      </div>
    </div>
  );
}

CollectionFilters.displayName = 'CollectionFilters';
