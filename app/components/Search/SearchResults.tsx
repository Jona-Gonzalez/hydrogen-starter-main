import {Link} from '~/components';
import {SearchItem} from './SearchItem';
import {useDataLayerViewSearchResults} from '~/hooks';

export function SearchResults({
  closeSearch,
  collectionResults,
  productResults,
  settings,
}) {
  const {productsEnabled, collectionsEnabled} = {...settings?.results};

  useDataLayerViewSearchResults({
    products: productResults,
  });

  return (
    <div className="scrollbar-hide relative flex flex-1 flex-col gap-4 overflow-y-auto pt-4">
      {productsEnabled && productResults?.length > 0 && (
        <div>
          <h3 className="text-title-h5 px-4">Products</h3>

          <ul>
            {productResults.slice(0, 10).map((item, index) => {
              return (
                <li
                  key={index}
                  className="border-b border-b-border p-4 last:border-none"
                >
                  <SearchItem
                    closeSearch={closeSearch}
                    index={index}
                    item={item}
                  />
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {collectionsEnabled && collectionResults?.length > 0 && (
        <div className="mb-8 px-4">
          <h3 className="text-title-h5 mb-3">Collections</h3>

          <ul className="flex flex-col items-start gap-3">
            {collectionResults.map((item, index) => {
              return (
                <li key={index}>
                  <Link
                    aria-label={item.title}
                    to={`/collections/${item.handle}`}
                  >
                    <p className="text-underline">{item.title}</p>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}

SearchResults.displayName = 'SearchResults';
