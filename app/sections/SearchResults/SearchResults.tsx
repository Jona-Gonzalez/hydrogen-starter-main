import {useLocation} from '@remix-run/react';

import {Collection, Spinner} from '~/components';
import {Schema} from './SearchResults.schema';
import {useDataLayerViewSearchResults, useSearchProductResults} from '~/hooks';

export function SearchResults() {
  const {search} = useLocation();
  let term = '';
  if (search) {
    const params = new URLSearchParams(search);
    term = params.get('term');
  }

  const {productResults} = useSearchProductResults({term});

  useDataLayerViewSearchResults({
    products: productResults,
    isSearchPage: true,
  });

  return (
    <div className="md:px-contained py-contained">
      {productResults?.length > 0 && (
        <>
          <h1 className="text-title-h3 mx-auto mb-6 max-w-[50rem] text-center max-md:px-4 lg:mb-8">
            {term
              ? `Found ${productResults.length} ${
                  productResults.length === 1 ? 'result' : 'results'
                } for "${term}"`
              : null}
          </h1>

          <Collection
            allProductsLoaded={!!productResults}
            collection={{
              handle: 'search',
              products: {nodes: productResults},
            }}
            showHeading={false}
          />
        </>
      )}

      {productResults?.length === 0 && (
        <h1 className="text-title-h3 mx-auto mb-6 max-w-[50rem] text-center max-md:px-4 lg:mb-8">
          {`Found 0 results for "${term || ''}"`}
        </h1>
      )}

      {!Array.isArray(productResults) && (
        <div className="flex min-h-[20rem] items-center justify-center">
          <Spinner width="32" />
        </div>
      )}
    </div>
  );
}

SearchResults.displayName = 'SearchResults';
SearchResults.Schema = Schema;
