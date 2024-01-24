import {useMemo, useState} from 'react';

import {CollectionDropdownFilter} from './CollectionDropdownFilter';
import {CollectionFiltersSummary} from './CollectionFiltersSummary';
import {CollectionMenuSidebar} from '../CollectionMenuSidebar';
import {Svg} from '~/components';

export function CollectionMobileFilters({
  activeFilters,
  addFilter,
  clearFilters,
  collectionCount,
  filterByInStock,
  filters,
  filtersMap,
  inStockFilterEnabled,
  inStockLabel,
  optionsMaxCount,
  removeFilter,
  setFilterByInStock,
  showCount,
  swatchesMap,
}) {
  const [isOpen, setIsOpen] = useState(false);

  const totalFilters = useMemo(() => {
    return Object.values(activeFilters || {}).reduce((acc, filterValues) => {
      return acc + filterValues.length;
    }, 0);
  }, [activeFilters]);

  return (
    <>
      <button
        aria-label="Open filters sidebar"
        className="relative flex h-14 w-full items-center justify-between border-y border-border pl-4 pr-2.5 text-left"
        onClick={() => setIsOpen(!isOpen)}
        type="button"
      >
        <div className="flex flex-1 items-center gap-2 overflow-hidden xs:gap-3">
          <h2 className="text-nav">Filters</h2>

          {totalFilters > 0 && (
            <p className="truncate text-xs text-mediumDarkGray xs:text-sm">
              {totalFilters} Selected
            </p>
          )}
        </div>

        <Svg
          className="w-5 text-black"
          src="/svgs/chevron-right.svg#chevron-right"
          title="Arrow Right"
          viewBox="0 0 24 24"
        />
      </button>

      <CollectionMenuSidebar
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        title="Filters"
      >
        <div className="sticky top-0 z-[1] border-b border-border bg-background p-4 pt-5">
          <div className="mb-4 flex justify-between gap-2">
            <h3 className="text-nav">
              Filters Summary{' '}
              <span className="text-xs">
                {totalFilters ? `(${totalFilters})` : ''}
              </span>
            </h3>

            {totalFilters > 0 && (
              <button
                className="text-label text-main-underline"
                onClick={clearFilters}
                type="button"
              >
                Clear All
              </button>
            )}
          </div>

          <div className="scrollbar-hide max-h-[4.5rem] min-h-[2rem] overflow-y-auto">
            {totalFilters ? (
              <CollectionFiltersSummary
                activeFilters={activeFilters}
                filtersMap={filtersMap}
                removeFilter={removeFilter}
              />
            ) : (
              <p className="leading-[2rem] text-mediumDarkGray">
                No filters selected yet
              </p>
            )}
          </div>
        </div>

        {inStockFilterEnabled && (
          <button
            aria-label={inStockLabel}
            className="flex h-14 w-full items-center gap-2 border-b border-border px-4 text-left"
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

            <p className="flex-1">{inStockLabel}</p>
          </button>
        )}

        <ul>
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
                  defaultOpen={filter.defaultOpenMobile}
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
      </CollectionMenuSidebar>
    </>
  );
}

CollectionMobileFilters.displayName = 'CollectionMobileFilters';
