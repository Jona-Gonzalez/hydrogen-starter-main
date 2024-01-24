import {useCallback, useEffect, useState} from 'react';
import Fuse from 'fuse.js';

import {COLOR_OPTION_NAME} from '~/lib/constants';
import {useProductsContext} from '~/contexts';

const trimWord = (word = '') => {
  if (!word) return '';
  let trimmedWord = word.trim();
  if (!/[a-z0-9]/.test(trimmedWord[0])) trimmedWord = trimmedWord.slice(1);
  if (!/[a-z0-9]/.test(trimmedWord[trimmedWord.length - 1]))
    trimmedWord = trimmedWord.slice(0, -1);
  return trimmedWord;
};

export function useSearchAutocomplete({
  enabled = true,
  mounted = true,
  term = '',
}) {
  const productsContext = useProductsContext();
  const {products}: any = {...productsContext?.state};

  const [autocompleteFuse, setAutocompleteFuse] = useState<any>(undefined);
  const [autocompleteResults, setAutocompleteResults] = useState([]);

  const propertyKeys = ['title', COLOR_OPTION_NAME];

  const setAutocompleteFuseOnMount = useCallback(async () => {
    try {
      if (autocompleteFuse || !products?.length) return;

      const termsTable = products.reduce((table: any, product: any) => {
        propertyKeys.forEach((key) => {
          if (key === COLOR_OPTION_NAME) {
            const colors = product.optionsMap?.[COLOR_OPTION_NAME];
            if (!colors) return;
            colors.forEach((color: string) => {
              if (table[color]) {
                table[color] += 1;
              } else {
                table[color] = 1;
              }
            });
          } else {
            const property = product[key];
            if (!property) return;

            property
              .split(' ')
              .forEach((item: any, index: number, arr: any[]) => {
                const word = item.toLowerCase();

                if (!/[a-z0-9]/.test(word)) return;

                const trimmedWord = trimWord(word);
                if (table[trimmedWord]) {
                  table[trimmedWord] += 1;
                } else {
                  table[trimmedWord] = 1;
                }
                const nextWord = arr[index + 1]?.toLowerCase();
                if (nextWord && /[a-z0-9]/.test(nextWord)) {
                  const twoWords = `${word} ${nextWord}`;
                  const trimmedTwoWords = trimWord(twoWords);
                  if (table[trimmedTwoWords]) {
                    table[trimmedTwoWords] += 1;
                  } else {
                    table[trimmedTwoWords] = 1;
                  }
                }
              });
          }
        });
        return table;
      }, {});

      const sortedList = [...Object.keys(termsTable)].sort((a, b) => {
        return termsTable[a] - termsTable[b];
      });
      const formattedList = sortedList.map((suggestion) => ({
        suggestion,
      }));

      setAutocompleteFuse(
        new Fuse(formattedList, {
          keys: ['suggestion'],
          ignoreLocation: true,
          minMatchCharLength: 3,
          threshold: 0.3,
        }),
      );
    } catch (error: any) {
      console.error(error.message);
    }
  }, [autocompleteFuse, products, propertyKeys]);

  useEffect(() => {
    if (!enabled || !mounted) return;
    setAutocompleteFuseOnMount();
  }, [enabled, mounted, products, propertyKeys]);

  useEffect(() => {
    if (!enabled || !autocompleteFuse) return;
    if (!term) {
      setAutocompleteResults([]);
      return;
    }
    const results = autocompleteFuse.search(term);
    setAutocompleteResults(results);
  }, [autocompleteFuse, enabled, term]);

  return {autocompleteResults};
}
