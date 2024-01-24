import {useEffect, useRef} from 'react';
import {useLocation, useNavigate} from '@remix-run/react';

import {SearchAutocomplete} from './SearchAutocomplete';
import {Svg} from '~/components';

export function SearchInput({
  closeSearch,
  handleSuggestion,
  handleClear,
  handleInput,
  rawTerm,
  searchOpen,
  settings,
}) {
  const inputRef = useRef(null);
  const {search} = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!searchOpen) return;
    inputRef.current.focus();
  }, [searchOpen]);

  return (
    <div className="border-b border-b-border p-4">
      <div className="relative flex justify-between gap-3 rounded-full border border-border pl-3 pr-4">
        <Svg
          className="w-5 text-text"
          src="/svgs/search.svg#search"
          title="Search"
          viewBox="0 0 24 24"
        />

        <input
          aria-label="Search here"
          className="min-w-0 flex-1 py-3 text-base outline-none"
          onChange={handleInput}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !!e.target.value) {
              const params = new URLSearchParams(search);
              params.set('term', e.target.value);
              closeSearch();
              navigate({
                pathname: '/pages/search',
                search: `?${params.toString()}`,
              });
            }
          }}
          placeholder="Search here"
          ref={inputRef}
          value={rawTerm}
        />

        <button
          aria-label="Clear search"
          className={`${rawTerm ? '' : 'invisible'}`}
          onClick={handleClear}
          type="button"
        >
          <Svg
            className="w-4 text-text"
            src="/svgs/close.svg#close"
            title="Close"
            viewBox="0 0 24 24"
          />
        </button>
      </div>

      <SearchAutocomplete
        handleSuggestion={handleSuggestion}
        searchOpen={searchOpen}
        settings={settings}
        term={rawTerm}
      />
    </div>
  );
}

SearchInput.displayName = 'SearchInput';
