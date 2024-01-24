import {useMemo} from 'react';

import {Svg} from '~/components';

export function CollectionFiltersSummary({
  activeFilters,
  clearFilters,
  filtersMap,
  removeFilter,
}) {
  const activeFiltersList = useMemo(() => {
    const filterEntries = Object.entries(activeFilters);
    if (!filterEntries.length) return [];

    return filterEntries.reduce((acc, [filterKey, filterValues]) => {
      return [
        ...acc,
        ...filterValues.map((value) => {
          return {
            key: filterKey,
            value,
          };
        }),
      ];
    }, []);
  }, [activeFilters]);

  return activeFiltersList.length ? (
    <div>
      <ul className="flex flex-wrap gap-2">
        {activeFiltersList.map(({key, value}, index) => {
          return (
            <li key={index} className="max-w-full">
              <button
                className="flex max-w-full items-center rounded-full bg-offWhite py-2 pl-2.5 pr-3 text-xs transition md:hover:bg-lightGray"
                onClick={() => removeFilter({key, value})}
                type="button"
              >
                <div className="flex-1 truncate">
                  <span className="font-bold">{filtersMap[key]?.label}:</span>{' '}
                  {value}
                </div>

                <Svg
                  className="ml-1 w-2.5 text-text"
                  src="/svgs/close.svg#close"
                  title="Close"
                  viewBox="0 0 24 24"
                />
              </button>
            </li>
          );
        })}
      </ul>

      {clearFilters && (
        <button
          className="text-label text-main-underline mt-4 md:mt-6"
          onClick={clearFilters}
          type="button"
        >
          Clear All
        </button>
      )}
    </div>
  ) : null;
}

CollectionFiltersSummary.displayName = 'CollectionFiltersSummary';
