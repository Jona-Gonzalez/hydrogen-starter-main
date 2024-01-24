import {useCallback, useMemo, useState} from 'react';
import PropTypes from 'prop-types';

import {COLOR_OPTION_NAME} from '~/lib/constants';
import {ColorVariantSelector} from './ColorVariantSelector';
import {Link} from '~/components';
import {ProductItemMedia} from './ProductItemMedia/ProductItemMedia';
import {ProductItemPrice} from './ProductItemPrice';
import {ProductStars} from '../ProductStars';
import {QuickShop} from './QuickShop';
import {
  useDataLayerClickEvents,
  useProductByHandle,
  useProductGroupingByHandle,
} from '~/hooks';

interface ProductItemProps {
  enabledColorNameOnHover?: boolean;
  enabledColorSelector?: boolean;
  enabledQuickShop?: boolean;
  enabledStarRating?: boolean;
  handle?: string;
  index: number;
  isSearchResults?: boolean;
  onClick?: () => void;
  priority?: boolean;
  product?: any;
  swatchesMap?: any;
}

export function ProductItem({
  enabledColorNameOnHover,
  enabledColorSelector,
  enabledQuickShop,
  enabledStarRating,
  handle,
  index,
  isSearchResults,
  onClick,
  priority,
  product: passedProduct,
  swatchesMap,
}: ProductItemProps) {
  const {sendClickProductItemEvent} = useDataLayerClickEvents();
  const {product: cachedProduct, getProductByHandle} =
    useProductByHandle(handle);
  const {grouping} = useProductGroupingByHandle(handle);

  const [productFromColorSelector, setProductFromColorSelector] =
    useState(null);
  const [variantFromColorSelector, setVariantFromColorSelector] =
    useState(null);

  const initialProduct = useMemo(() => {
    return passedProduct || cachedProduct;
  }, [passedProduct, cachedProduct]);

  const selectedProduct = useMemo(() => {
    return productFromColorSelector || initialProduct;
  }, [productFromColorSelector, initialProduct]);

  const selectedVariant = useMemo(() => {
    return variantFromColorSelector || selectedProduct?.variants?.nodes?.[0];
  }, [variantFromColorSelector, selectedProduct]);

  const color = useMemo(() => {
    return selectedVariant?.selectedOptions.find(
      (option) => option.name === COLOR_OPTION_NAME,
    )?.value;
  }, [selectedVariant]);

  const productUrl = selectedProduct
    ? `/products/${selectedProduct.handle}`
    : '';
  const title = selectedProduct?.title;

  const handleClick = useCallback(() => {
    sendClickProductItemEvent({
      isSearchResult: isSearchResults,
      listIndex: index,
      product: selectedProduct,
      selectedVariant,
    });
    if (typeof onClick === 'function') onClick();
  }, [index, selectedProduct?.id, selectedVariant?.id]);

  return (
    <div className="group flex h-full flex-col justify-between">
      <div className="flex flex-col items-start">
        <Link
          aria-label={title}
          className="mb-3 w-full"
          to={productUrl}
          onClick={handleClick}
          tabIndex="-1"
        >
          <ProductItemMedia
            priority={priority}
            selectedProduct={selectedProduct}
            selectedVariant={selectedVariant}
          />
        </Link>

        {enabledStarRating && initialProduct?.id && (
          <div className="mb-1.5">
            <Link
              aria-label={`Reviews for ${title}`}
              to={productUrl}
              onClick={handleClick}
              tabIndex="-1"
            >
              <ProductStars id={initialProduct.id} />
            </Link>
          </div>
        )}

        <Link aria-label={title} to={productUrl} onClick={handleClick}>
          <h3 className="text-bold min-h-[1.5rem] text-base">{title}</h3>
        </Link>

        {color && <p className="text-sm text-mediumDarkGray">{color}</p>}

        <ProductItemPrice selectedVariant={selectedVariant} />

        {enabledColorSelector && (
          <ColorVariantSelector
            enabledColorNameOnHover={enabledColorNameOnHover}
            getProductByHandle={getProductByHandle}
            grouping={grouping}
            initialProduct={initialProduct}
            selectedVariant={selectedVariant}
            setProductFromColorSelector={setProductFromColorSelector}
            setVariantFromColorSelector={setVariantFromColorSelector}
            swatchesMap={swatchesMap}
          />
        )}
      </div>

      {enabledQuickShop && (
        <QuickShop
          enabledColorSelector={enabledColorSelector}
          selectedProduct={selectedProduct}
          selectedVariant={selectedVariant}
        />
      )}
    </div>
  );
}

ProductItem.displayName = 'ProductItem';
ProductItem.propTypes = {
  enabledColorNameOnHover: PropTypes.bool,
  enabledColorSelector: PropTypes.bool,
  enabledQuickShop: PropTypes.bool,
  enabledStarRating: PropTypes.bool,
  handle: PropTypes.string,
  index: PropTypes.number,
  isSearchResults: PropTypes.bool,
  onClick: PropTypes.func,
  swatchesMap: PropTypes.object,
};
