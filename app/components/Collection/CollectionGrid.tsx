import {Fragment, useMemo} from 'react';

import {CollectionPromoTile} from './CollectionPromoTile';
import {ProductItem} from '~/components';

export function CollectionGrid({
  activeFilters,
  collectionProductsContext,
  enabledFilters,
  isSearchResults,
  promoTiles,
  settings,
  swatchesMap,
}) {
  const {pagination, productItem} = {...settings};

  const {
    state: {filteredProducts, productsLimit},
    actions: {loadMoreProducts},
    refs: {loadMoreRef},
  } = collectionProductsContext;

  const hasActiveFilters = Object.keys(activeFilters).length > 0;
  const hasMoreProducts = filteredProducts?.length > productsLimit;

  const progressMessage = useMemo(() => {
    if (!pagination?.progressMessage || !hasMoreProducts) return null;
    return pagination.progressMessage
      .replace('{{total}}', filteredProducts?.length)
      .replace('{{loaded}}', productsLimit);
  }, [filteredProducts?.length, pagination?.progressMessage, productsLimit]);

  return (
    <>
      {filteredProducts?.length > 0 && (
        <ul
          className={`mx-auto grid grid-cols-2 gap-x-4 gap-y-8 px-4 xs:gap-x-5 ${
            enabledFilters ? 'md:grid-cols-2 lg:grid-cols-3' : 'md:grid-cols-3'
          } md:px-0`}
        >
          {filteredProducts.slice(0, productsLimit).map((product, index) => {
            const promoTile = promoTiles?.find(
              ({position}) => position === index + 1,
            );
            return (
              <Fragment key={index}>
                {promoTile && (
                  <li key={`promo-tile-${index}`}>
                    <CollectionPromoTile tile={promoTile} />
                  </li>
                )}
                <li key={`collection-tile-${index}`}>
                  <ProductItem
                    enabledColorNameOnHover={
                      productItem?.enabledColorNameOnHover
                    }
                    enabledColorSelector={productItem?.enabledColorSelector}
                    enabledQuickShop={productItem?.enabledQuickShop}
                    enabledStarRating={productItem?.enabledStarRating}
                    handle={product.handle}
                    index={index}
                    isSearchResults={isSearchResults}
                    product={product}
                    priority={index < 8}
                    swatchesMap={swatchesMap}
                  />
                </li>
              </Fragment>
            );
          })}
        </ul>
      )}

      {hasMoreProducts && pagination && (
        <div
          className="mt-10 flex flex-col items-center gap-3"
          ref={loadMoreRef}
        >
          {progressMessage && (
            <p className="text-label text-center">{progressMessage}</p>
          )}

          <button
            className={`${pagination.buttonStyle}`}
            onClick={loadMoreProducts}
            type="button"
          >
            {pagination.loadText}
          </button>
        </div>
      )}

      {!filteredProducts?.length && hasActiveFilters && (
        <div className="flex min-h-[12rem] items-center justify-center text-center">
          <p>No products found matching these filters.</p>
        </div>
      )}
    </>
  );
}

CollectionGrid.displayName = 'CollectionGrid';
