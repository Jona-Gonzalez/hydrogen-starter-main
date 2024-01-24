import {useCallback, useEffect, useRef, useState, useMemo} from 'react';
import debounce from 'lodash.debounce';

import {Link} from '~/components';
import {SearchHeader} from './SearchHeader';
import {SearchInput} from './SearchInput';
import {SearchResults} from './SearchResults';
import {SearchSuggestions} from './SearchSuggestions';
import {useSearchCollectionResults, useSearchProductResults} from '~/hooks';
import {useGlobalContext} from '~/contexts';

export function Search({settings}) {
  const {
    state: {searchOpen},
    actions: {closeSearch},
  } = useGlobalContext();

  const [rawTerm, setRawTerm] = useState('');
  const [term, setTerm] = useState(rawTerm);

  const {productResults} = useSearchProductResults({
    enabled: settings?.results?.productsEnabled,
    mounted: searchOpen,
    term,
  });
  const {collectionResults} = useSearchCollectionResults({
    enabled: settings?.results?.collectionsEnabled,
    mounted: searchOpen,
    term,
  });

  const hasProductResults = productResults?.length > 0;
  const hasCollectionResults = collectionResults?.length > 0;
  const hasResults = hasProductResults || hasCollectionResults;

  const handleDebouncedInput = useCallback(() => {
    setTerm(rawTerm);
  }, [rawTerm]);

  const debouncedInputRef = useRef(handleDebouncedInput);

  useEffect(() => {
    debouncedInputRef.current = handleDebouncedInput;
  }, [handleDebouncedInput]);

  const doCallbackWithDebounce = useMemo(() => {
    const callback = () => debouncedInputRef.current();
    return debounce(callback, 300);
  }, []);

  const handleInput = useCallback(
    (e) => {
      doCallbackWithDebounce();
      setRawTerm(e.target.value);
    },
    [doCallbackWithDebounce],
  );

  const handleClear = useCallback(() => {
    setRawTerm('');
    setTerm('');
  }, []);

  const handleSuggestion = useCallback((suggestion: string) => {
    setRawTerm(suggestion);
    setTerm(suggestion);
  }, []);

  return (
    <aside
      className={`fixed left-full top-0 z-[70] flex h-full w-full flex-col justify-between overflow-hidden bg-background transition md:max-w-[23.5rem] ${
        searchOpen
          ? 'pointer-events-auto -translate-x-full'
          : 'pointer-events-none translate-x-0'
      }`}
    >
      {searchOpen && (
        <>
          <SearchHeader closeSearch={closeSearch} />

          <SearchInput
            closeSearch={closeSearch}
            handleSuggestion={handleSuggestion}
            handleClear={handleClear}
            handleInput={handleInput}
            rawTerm={rawTerm}
            searchOpen={searchOpen}
            settings={settings}
          />

          {hasResults ? (
            <SearchResults
              closeSearch={closeSearch}
              collectionResults={collectionResults}
              productResults={productResults}
              settings={settings}
            />
          ) : (
            <SearchSuggestions
              handleSuggestion={handleSuggestion}
              settings={settings}
              term={term}
            />
          )}

          {hasProductResults && (
            <div className="border-t border-t-border p-4">
              <Link
                aria-label="See all search results"
                className="btn-primary w-full"
                to={`/pages/search?term=${term}`}
                onClick={closeSearch}
              >
                See All {productResults.length} Results
              </Link>
            </div>
          )}
        </>
      )}
    </aside>
  );
}

Search.displayName = 'Search';
