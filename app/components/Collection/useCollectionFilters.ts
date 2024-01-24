import {useCallback, useEffect, useMemo, useState} from 'react';
import {useSearchParams} from '@remix-run/react';

import {
  productTypeKey,
  sortAlphabetically,
  sortByCount,
  sortCustom,
  sortNumerically,
  updateFilterUrlParams,
} from './utils';

export function useCollectionFilters({
  allProductsLoaded,
  enabledFilters = true,
  products = [],
  settings,
}) {
  const [searchParams] = useSearchParams();
  const filtersSettings = {...settings?.filters};

  const [activeFilters, setActiveFilters] = useState({});
  const [filters, setFilters] = useState([]);
  const [filtersMap, setFiltersMap] = useState({});
  const [filterByInStock, setFilterByInStock] = useState(false);

  const addFilter = useCallback(
    ({key, value}) => {
      const updatedActiveFilters = {...activeFilters};
      updatedActiveFilters[key] = updatedActiveFilters[key]
        ? [...updatedActiveFilters[key], value]
        : [value];
      setActiveFilters(updatedActiveFilters);
      updateFilterUrlParams({
        entriesToAdd: Object.entries(updatedActiveFilters),
      });
    },
    [activeFilters],
  );

  const removeFilter = useCallback(
    ({key, value}) => {
      const updatedActiveFilters = {...activeFilters};
      updatedActiveFilters[key] = updatedActiveFilters[key].filter(
        (item) => item !== value,
      );
      if (updatedActiveFilters[key]?.length === 0)
        delete updatedActiveFilters[key];
      setActiveFilters(updatedActiveFilters);

      if (activeFilters[key]?.length === 1) {
        updateFilterUrlParams({
          keysToRemove: [key],
        });
      } else {
        updateFilterUrlParams({
          entriesToAdd: Object.entries(updatedActiveFilters),
        });
      }
    },
    [activeFilters],
  );

  const clearFilters = useCallback(() => {
    setActiveFilters({});
    updateFilterUrlParams({keysToRemove: Object.keys(activeFilters)});
  }, [activeFilters]);

  const initialFiltersData = useMemo(() => {
    if (!enabledFilters || !filtersSettings.filters?.length) return null;

    // array of tag and option filter names set in customizer
    const tagFilters = [];
    const optionFilters = [];
    // set up initial filters map
    const _filtersMap = filtersSettings.filters.reduce(
      (
        acc,
        {
          customOrder,
          defaultOpenDesktop,
          defaultOpenMobile,
          isColor,
          label,
          name,
          orderValuesBy,
          ranges: priceRanges,
          _template: source,
          usesColorGroups,
        },
      ) => {
        // ignore option and tag filters with no name
        if ((source === 'option' || source === 'tag') && !name) return acc;

        // filter name key
        let filterName;
        if (source === 'productType') {
          filterName = productTypeKey;
        } else if (source === 'price') {
          filterName = 'price';
        } else if (source === 'tag') {
          const _name = name?.trim();
          filterName = `${source}.${_name}`;
          tagFilters.push(_name);
        } else if (source === 'option') {
          const _name = name?.trim();
          filterName = `${source}.${_name}`;
          optionFilters.push(_name);
        }
        const filter = {
          name: filterName,
          label,
          isColor: isColor || false,
          usesColorGroups: usesColorGroups || false,
          defaultOpenDesktop: defaultOpenDesktop || false,
          defaultOpenMobile: defaultOpenMobile || false,
          orderValuesBy,
          customOrder,
          ...(source === 'price' ? {priceRanges} : null),
          source,
          values: [],
          valuesMap: {},
        };
        return {...acc, [filter.name]: filter};
      },
      {},
    );

    return {
      tagFilters,
      optionFilters,
      filtersMap: _filtersMap,
    };
  }, [enabledFilters, filtersSettings.filters]);

  // sets up filters and options on collection load
  useEffect(() => {
    if (
      !allProductsLoaded ||
      !enabledFilters ||
      !initialFiltersData ||
      !products.length
    )
      return;
    const {
      tagFilters,
      optionFilters,
      filtersMap: _filtersMap,
    } = initialFiltersData;
    const colorGroups = filtersSettings.colorGroups || [];

    products.forEach(({options, priceRange, productType, tags}) => {
      // product type options
      if (_filtersMap[productTypeKey] && productType) {
        _filtersMap[productTypeKey].valuesMap = {
          ..._filtersMap[productTypeKey].valuesMap,
          [productType]: {
            value: productType,
            count:
              (_filtersMap[productTypeKey].valuesMap[productType]?.count || 0) +
              1,
          },
        };
      }
      // price range options
      if (_filtersMap.price && priceRange?.minVariantPrice?.amount) {
        const price = parseFloat(priceRange.minVariantPrice.amount);
        const range = _filtersMap.price.priceRanges?.find(({min, max}) => {
          return price >= (min || 0) && price < (max || Infinity);
        })?.label;
        _filtersMap.price.valuesMap = {
          ..._filtersMap.price.valuesMap,
          [range]: {
            value: range,
            count: (_filtersMap.price.valuesMap[range]?.count || 0) + 1,
          },
        };
      }
      // tag filter options
      if (tagFilters?.length && tags?.length) {
        tags.forEach((tag) => {
          const [_key, _value] = tag.split('::');
          const key = _key.trim();
          const value = _value?.trim();
          if (value && tagFilters.includes(key)) {
            const filter = _filtersMap[`tag.${key}`];
            filter.valuesMap = {
              ...filter.valuesMap,
              [value]: {
                value,
                count: (filter.valuesMap[value]?.count || 0) + 1,
              },
            };
          }
        });
      }
      // option filter options
      options.forEach(({name, values}) => {
        const key = name.trim();
        if (optionFilters.includes(key)) {
          const filter = _filtersMap[`option.${key}`];
          filter.valuesMap = {
            ...filter.valuesMap,
            ...values.reduce((acc, valueItem) => {
              let value = valueItem;
              // if option filter uses color groups, find matching color group
              if (filter.usesColorGroups) {
                const colorGroup = colorGroups.find((group) =>
                  group?.colors?.some(
                    (color) =>
                      color.toLowerCase().trim() === value.toLowerCase(),
                  ),
                );
                if (!colorGroup) return acc;
                value = colorGroup.name;
              }

              return {
                ...acc,
                [value]: {
                  value,
                  count: (filter.valuesMap[value]?.count || 0) + 1,
                },
              };
            }, {}),
          };
        }
      });
    });
    // sort options
    Object.values(_filtersMap).forEach((filter) => {
      const values = Object.values(filter.valuesMap);
      if (filter.source === 'price') {
        _filtersMap[filter.name].values = sortCustom({
          values,
          sortOrder: filter.priceRanges?.map(({label}) => label) || [],
        });
      } else if (filter.orderValuesBy === 'priceRange') {
        _filtersMap[filter.name].values = sortCustom({
          values,
          sortOrder: filter.priceRanges.map(({label}) => label),
        });
      } else if (filter.orderValuesBy === 'alphabet') {
        _filtersMap[filter.name].values = sortAlphabetically({values});
      } else if (filter.orderValuesBy === 'number') {
        _filtersMap[filter.name].values = sortNumerically({values});
      } else if (filter.orderValuesBy === 'count') {
        _filtersMap[filter.name].values = sortByCount({values});
      } else if (filter.orderValuesBy === 'custom') {
        _filtersMap[filter.name].values = sortCustom({
          values,
          sortOrder: filter.customOrder,
        });
      } else {
        _filtersMap[filter.name].values = values;
      }
      delete _filtersMap[filter.name].orderValuesBy;
      delete _filtersMap[filter.name].customOrder;
    });

    setFilters(Object.values(_filtersMap));
    setFiltersMap(_filtersMap);
  }, [
    allProductsLoaded,
    enabledFilters,
    filtersSettings.colorGroups,
    initialFiltersData,
    products,
  ]);

  // sets filters on page load
  useEffect(() => {
    if (!Object.keys({...filtersMap}).length) return;
    const filtersFromParams = {};
    searchParams.forEach((value, key) => {
      if (key === 'handle') return;
      const values = value.split(',');
      const valuesMap = filtersMap[key]?.valuesMap;
      values.forEach((valuesItem) => {
        if (!valuesMap?.[valuesItem]) return;
        if (!filtersFromParams[key]) filtersFromParams[key] = [];
        filtersFromParams[key] = [...filtersFromParams[key], valuesItem];
      });
    });
    setActiveFilters(filtersFromParams);
  }, [searchParams]);

  // clear filters state on unmount
  useEffect(() => {
    return () => {
      setActiveFilters({});
      setFilterByInStock(false);
      setFilters([]);
      setFiltersMap({});
    };
  }, []);

  return {
    state: {
      activeFilters,
      filterByInStock,
      filters,
      filtersMap,
    },
    actions: {
      addFilter,
      clearFilters,
      removeFilter,
      setFilterByInStock,
    },
  };
}
