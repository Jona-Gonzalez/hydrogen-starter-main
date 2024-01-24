import {useState} from 'react';

import {CollectionFilterOption} from './CollectionFilterOption';
import {Svg} from '~/components';

export function CollectionDropdownFilter({
  activeFilters,
  addFilter,
  defaultOpen = false,
  filter,
  optionsMaxCount,
  removeFilter,
  showCount,
  swatchesMap,
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [maxOptions, setMaxOptions] = useState(
    optionsMaxCount || filter.values.length,
  );
  const totalSelectedOptions = activeFilters[filter.name]?.length || 0;

  return (
    <div className="border-border max-md:border-b md:border-t">
      <button
        aria-label={filter.label}
        className="relative flex h-14 w-full items-center justify-between gap-4 text-left max-md:px-4"
        onClick={() => setIsOpen(!isOpen)}
        type="button"
      >
        <div className="flex flex-1 items-center">
          <h3 className="text-nav">{filter.label}</h3>

          {totalSelectedOptions > 0 && (
            <p className="ml-1 text-xs text-mediumDarkGray">
              ({totalSelectedOptions})
            </p>
          )}
        </div>

        <Svg
          className={`w-4 text-text ${isOpen ? 'rotate-180' : ''}`}
          src="/svgs/chevron-down.svg#chevron-down"
          title="Chevron"
          viewBox="0 0 24 24"
        />
      </button>

      <div
        className={`flex-col md:items-start md:gap-2 md:pb-4 ${
          isOpen ? 'flex' : 'hidden'
        }`}
      >
        <ul className="flex flex-col md:items-start md:gap-2">
          {filter.values.slice(0, maxOptions).map(({count, value}, index) => {
            return (
              <li
                key={index}
                className="max-md:border-b max-md:border-border max-md:last:border-none"
              >
                <CollectionFilterOption
                  activeFilters={activeFilters}
                  addFilter={addFilter}
                  count={count}
                  isColor={filter.isColor}
                  name={filter.name}
                  removeFilter={removeFilter}
                  showCount={showCount}
                  swatchesMap={swatchesMap}
                  value={value}
                />
              </li>
            );
          })}
        </ul>

        {maxOptions < filter.values.length && (
          <button
            type="button"
            className="h-6 text-left text-sm font-bold uppercase max-md:h-11 max-md:px-4 md:text-xs"
            aria-label="Show all options"
            onClick={() => setMaxOptions(filter.values.length)}
          >
            + {filter.values.length - maxOptions} More
          </button>
        )}
      </div>
    </div>
  );
}

CollectionDropdownFilter.displayName = 'CollectionDropdownFilter';
