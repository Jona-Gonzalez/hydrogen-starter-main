import {useMemo, useState} from 'react';

import {CollectionMenuSidebar} from './CollectionMenuSidebar';
import {Select, Svg} from '~/components';
import {sortKeys} from './utils';

export function CollectionSort({selectedSort, selectSort, settings}) {
  const sortOptions = {...settings?.sort};

  const [isOpen, setIsOpen] = useState(false);

  const options = useMemo(() => {
    return sortKeys.map((key) => ({
      value: key,
      label: sortOptions[`${key}Label`],
    }));
  }, [sortOptions, sortKeys]);

  return (
    <>
      {/* desktop */}
      <div className="ml-auto hidden max-w-[11rem] md:block">
        <Select
          onSelect={(option) => selectSort(option)}
          options={options}
          placeholder="Sort"
          selectedOption={selectedSort}
          placeholderClass="text-text"
        />
      </div>

      {/* mobile */}
      <button
        aria-label="Open sort sidebar"
        className="flex h-14 w-full items-center justify-between border-y border-border pl-4 pr-2.5 text-left md:hidden md:px-0"
        onClick={() => setIsOpen(!isOpen)}
        type="button"
      >
        <div className="flex flex-1 items-center gap-2 overflow-hidden xs:gap-3">
          <h2 className="text-nav">Sort</h2>

          {selectedSort?.value && (
            <p className="truncate text-xs text-mediumDarkGray xs:text-sm">
              {selectedSort.label}
            </p>
          )}
        </div>

        <Svg
          className="w-5 text-text"
          src="/svgs/chevron-right.svg#chevron-right"
          title="Arrow Right"
          viewBox="0 0 24 24"
        />
      </button>

      <CollectionMenuSidebar title="Sort" isOpen={isOpen} setIsOpen={setIsOpen}>
        <ul className="overflow-y-auto">
          {options.map((option, index) => {
            const isActive = option.value === selectedSort?.value;
            return (
              <li key={index}>
                <button
                  aria-label={option.label}
                  className={`flex h-14 w-full items-center gap-4 border-b border-border px-4 text-left text-text ${
                    isActive ? 'font-bold text-text' : 'text-mediumDarkGray'
                  }`}
                  onClick={() => {
                    selectSort(option);
                    setIsOpen(false);
                  }}
                  type="button"
                >
                  <div
                    className={`relative flex h-6 w-6 items-center justify-center overflow-hidden rounded-[50%] border border-border transition md:hover:border-text ${
                      isActive ? 'border-text' : ''
                    }`}
                  >
                    <div
                      className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-[50%] transition-[height,width] ${
                        isActive
                          ? 'h-[calc(100%-5px)] w-[calc(100%-5px)] bg-black'
                          : 'h-full w-full bg-offWhite'
                      }`}
                    />
                  </div>

                  <span className="flex-1">{option.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </CollectionMenuSidebar>
    </>
  );
}

CollectionSort.displayName = 'CollectionSort';
