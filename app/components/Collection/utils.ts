export const productTypeKey = 'product_type';
export const sortKeys = ['default', 'highToLow', 'lowToHigh', 'aToZ', 'zToA'];

export const getFilteredProducts = ({
  activeFilters = {},
  colorGroups = [],
  filterByInStock = false,
  filtersMap = {},
  products = [],
}) => {
  const hasActiveFilters = Object.keys({...activeFilters}).length > 0;

  let filteredProducts = products.reduce((acc, product) => {
    // if in stock filter is selected while there are no active filters, return only in stock products
    if (!hasActiveFilters && filterByInStock) {
      if (product.variants.nodes.every((variant) => !variant.availableForSale))
        return acc;
    }

    const minReqLength = Object.keys(activeFilters).filter(
      (key) => key.startsWith('tag') || key.startsWith('option'),
    ).length;

    // filter by product option
    const optionMatches = [];
    const optionFilters = Object.keys(activeFilters).reduce(
      (optionsAcc, key) => {
        if (key.startsWith('option.')) {
          return [...optionsAcc, key.replace('option.', '')];
        }
        return optionsAcc;
      },
      [],
    );
    if (optionFilters.length) {
      const optionsMap = product.options.reduce((acc, option) => {
        return {...acc, [option.name]: option.values};
      }, {});
      optionFilters.forEach((filter) => {
        if (optionsMap[filter]) {
          const hasMatch = optionsMap[filter].some((value) => {
            let isMatch = false;
            // if option uses color groups, check if the value is in any of the color groups
            if (filtersMap[`option.${filter}`].usesColorGroups) {
              isMatch = colorGroups?.some(({name, colors}) => {
                return activeFilters[`option.${filter}`].some(
                  (activeFilter) => {
                    return name === activeFilter
                      ? colors?.some(
                          (color) =>
                            value.toLowerCase() === color.toLowerCase().trim(),
                        )
                      : false;
                  },
                );
              });
            } else {
              // all other options
              isMatch = activeFilters[`option.${filter}`].includes(value);
            }

            if (!isMatch) return false;
            if (!filterByInStock) return isMatch;
            const selectedVariant = product.variants?.nodes?.find((variant) => {
              return (
                variant.selectedOptions?.find(
                  (option) => option.name === filter,
                )?.value === value
              );
            });
            return selectedVariant?.availableForSale;
          });
          if (hasMatch) {
            optionMatches.push(filter);
          }
        }
      });
    }

    // filter by product tag
    const tagMatches = [];
    const tagFilters = product.tags
      ? Object.keys(activeFilters).reduce((tagsAcc, key) => {
          if (key.startsWith('tag.')) {
            return [...tagsAcc, key.replace('tag.', '')];
          }
          return tagsAcc;
        }, [])
      : [];
    if (tagFilters.length) {
      tagFilters.forEach((filter) => {
        const hasMatch = product.tags.some((tag) => {
          const [_key, _value] = tag.split('::');
          const key = _key.trim();
          const value = _value?.trim();
          let isMatch = false;
          if (value && filter === key) {
            isMatch = activeFilters[`tag.${filter}`].includes(value);
          }
          return isMatch;
        });
        if (hasMatch) {
          tagMatches.push(filter);
        }
      });
    }
    const matches = [...optionMatches, ...tagMatches];
    if (matches.length >= minReqLength) {
      return [...acc, product];
    }
    return acc;
  }, []);

  // filter by product type
  if (activeFilters[productTypeKey]?.length > 0) {
    filteredProducts = filteredProducts.filter(({handle, productType}) => {
      const isMatch = activeFilters[productTypeKey].includes(productType);
      if (filterByInStock) {
        const productIsAvailForSale = product.variants.nodes.some(
          (variant) => variant.availableForSale,
        );
        return isMatch && productIsAvailForSale;
      }
      return isMatch;
    });
  }

  // filter by price
  if (activeFilters.price?.length > 0) {
    const priceRangeMap = filtersMap.price.priceRanges.reduce((acc, range) => {
      return {...acc, [range.label]: range};
    }, {});
    filteredProducts = filteredProducts.filter(({handle, priceRange}) => {
      const price = parseFloat(priceRange?.min);
      const isMatch = activeFilters.price.some((option) => {
        return (
          price >= (priceRangeMap[option]?.min || 0) &&
          price < (priceRangeMap[option]?.max || Infinity)
        );
      });
      if (filterByInStock) {
        const productIsAvailForSale = product.variants.nodes.some(
          (variant) => variant.availableForSale,
        );
        return isMatch && productIsAvailForSale;
      }
      return isMatch;
    });
  }

  return filteredProducts;
};

export const getSortedProducts = ({products = [], sortBy = ''}) => {
  switch (sortBy) {
    case 'default':
      return products;
    case 'highToLow':
      return products.sort((a, b) => {
        const aPrice = parseFloat(a.priceRange?.maxVariantPrice?.amount);
        const bPrice = parseFloat(b.priceRange?.maxVariantPrice?.amount);
        if (aPrice > bPrice) return -1;
        if (aPrice < bPrice) return 1;
        return 0;
      });
    case 'lowToHigh':
      return products.sort((a, b) => {
        const aPrice = parseFloat(a.priceRange?.maxVariantPrice?.amount);
        const bPrice = parseFloat(b.priceRange?.maxVariantPrice?.amount);
        if (aPrice > bPrice) return 1;
        if (aPrice < bPrice) return -1;
        return 0;
      });
    case 'aToZ':
      return products.sort((a, b) => a.title?.localeCompare(b.title));
    case 'zToA':
      return products.sort((a, b) => b.title?.localeCompare(a.title));
    default:
      return products;
  }
};

export const updateFilterUrlParams = ({
  entriesToAdd = [],
  keysToRemove = [],
}) => {
  const {origin, search, pathname} = window.location;
  const params = new URLSearchParams(search);
  entriesToAdd.forEach(([key, value]) => {
    params.set(key, value.join(','));
  });
  keysToRemove.forEach((key) => {
    params.delete(key);
  });
  const updatedUrl = `${origin}${pathname}?${params}`;
  window.history.replaceState(window.history.state, '', updatedUrl);
};

export const sortAlphabetically = ({values = []}) => {
  return values?.slice().sort((a, b) => {
    if (a.value < b.value) return -1;
    if (a.value > b.value) return 1;
    return 0;
  });
};

export const sortNumerically = ({values = []}) => {
  return values?.slice().sort((a, b) => {
    const aNum = parseFloat(a.value);
    const bNum = parseFloat(b.value);
    if (aNum < bNum) return -1;
    if (aNum > bNum) return 1;
    return 0;
  });
};

export const sortByCount = ({values = []}) => {
  return values?.slice().sort((a, b) => {
    if (a.count < b.count) return 1;
    if (a.count > b.count) return -1;
    return 0;
  });
};

export const sortCustom = ({values = [], sortOrder = []}) => {
  if (!sortOrder?.length) return values;
  return values?.slice().sort((a, b) => {
    const _sortOrder = sortOrder.map((v) => v.trim());
    const aIndex = _sortOrder.indexOf(a.value);
    const bIndex = _sortOrder.indexOf(b.value);
    if (aIndex < bIndex) return -1;
    if (aIndex > bIndex) return 1;
    return 0;
  });
};
