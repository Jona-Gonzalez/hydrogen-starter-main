import {useSearchAutocomplete} from '~/hooks';

export function SearchAutocomplete({
  handleSuggestion,
  searchOpen,
  settings,
  term,
}) {
  const {autocompleteResults} = useSearchAutocomplete({
    enabled: settings?.autocomplete?.enabled,
    mounted: searchOpen,
    term,
  });

  const {enabled, heading, limit} = {...settings?.autocomplete};

  return enabled && autocompleteResults.length > 0 ? (
    <div className="mt-4">
      <h3 className="text-xs italic">{heading}</h3>

      <ul className="flex flex-wrap gap-x-2">
        {autocompleteResults.slice(0, limit || 5).map(({item, refIndex}) => {
          return (
            <li key={refIndex}>
              <button
                aria-label={item.suggestion}
                onClick={() => handleSuggestion(item.suggestion)}
                type="button"
              >
                <p className="text-underline text-xs">{item.suggestion}</p>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  ) : null;
}

SearchAutocomplete.displayName = 'SearchAutocomplete';
