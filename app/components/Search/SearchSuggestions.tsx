export function SearchSuggestions({handleSuggestion, settings, term}) {
  const {noResultsText} = {...settings?.results};
  const {enabled, heading, terms} = {...settings?.suggestions};

  return (
    <div className="scrollbar-hide flex flex-1 flex-col gap-8 overflow-y-auto p-8">
      {term && <h3 className="text-base font-normal">{noResultsText}</h3>}

      {enabled && terms?.length > 0 && (
        <div>
          <h3 className="text-title-h5 mb-3">{heading}</h3>

          <ul className="flex flex-col items-start gap-3">
            {terms.map((suggestion) => {
              return (
                <li key={suggestion}>
                  <button
                    aria-label={suggestion}
                    onClick={() => handleSuggestion(suggestion)}
                    type="button"
                  >
                    <p className="hover-text-underline">{suggestion}</p>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}

SearchSuggestions.displayName = 'SearchSuggestions';
