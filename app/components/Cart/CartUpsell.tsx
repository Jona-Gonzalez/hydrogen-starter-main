import {useMemo} from 'react';
import {Image, useCart} from '@shopify/hydrogen-react';

import {BackInStockModal, Link, Spinner} from '~/components';
import {useAddToCart, useProductByHandle, useVariantPrices} from '~/hooks';

export function CartUpsell({closeCart, settings}: any) {
  const {lines} = useCart();
  const {message, product: productFromCms} = {...settings?.upsell};

  const {product: fullProduct} = useProductByHandle(productFromCms?.handle);

  const selectedVariant = fullProduct?.variants?.nodes?.[0];

  const {
    state: {buttonText, cartIsUpdating, isAdding, isNotifyMe, isSoldOut},
    actions: {handleAddToCart, handleNotifyMe},
  } = useAddToCart({
    selectedVariant,
  });

  const {price, compareAtPrice} = useVariantPrices({
    variant: selectedVariant,
  });

  const showUpsell = lines?.length > 0 && !!selectedVariant?.id;
  const image = fullProduct?.featuredImage;

  const productIsInCart = useMemo(() => {
    if (!showUpsell) return null;
    return lines.some((line: any) => {
      return line.merchandise.product.handle === productFromCms?.handle;
    });
  }, [lines, productFromCms?.handle, showUpsell]);

  const isUpdatingClass = isAdding || cartIsUpdating ? 'cursor-default' : '';

  return showUpsell && !productIsInCart ? (
    <div className="flex flex-col gap-2 border-t border-t-border p-4">
      <h3 className="text-center text-xs font-normal">{message}</h3>

      <div className="flex items-center justify-center gap-4">
        <Link
          aria-label={fullProduct?.title}
          to={productFromCms?.path}
          onClick={closeCart}
          tabIndex="-1"
          className="w-10 bg-offWhite"
        >
          {image?.url && (
            <Image
              data={{
                altText: fullProduct?.title,
                url: image.url,
                height: Math.floor(40 / (image.width / image.height)),
                width: 40,
              }}
            />
          )}
        </Link>

        <div className="flex max-w-[25rem] flex-1 flex-col gap-2">
          <Link
            aria-label={fullProduct?.title}
            to={productFromCms?.path}
            onClick={closeCart}
          >
            <h4 className="text-xs font-bold">{fullProduct?.title}</h4>
          </Link>

          <div className="flex items-center justify-between gap-4">
            <button
              aria-label={buttonText}
              className={`text-label-sm text-main-underline ${isUpdatingClass}`}
              disabled={isSoldOut && !isNotifyMe}
              onClick={() => {
                if (isNotifyMe) {
                  handleNotifyMe(
                    <BackInStockModal selectedVariant={selectedVariant} />,
                  );
                } else {
                  handleAddToCart();
                }
              }}
              type="button"
            >
              {isAdding ? (
                <div className="flex h-4 items-center justify-center px-6">
                  <Spinner width="12" color="gray" />
                </div>
              ) : (
                buttonText
              )}
            </button>

            <div className="flex flex-1 flex-wrap justify-end gap-x-1">
              {compareAtPrice && (
                <p className="text-xs text-mediumDarkGray line-through">
                  {compareAtPrice}
                </p>
              )}
              <p className="text-xs">{price}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  ) : null;
}

CartUpsell.displayName = 'CartUpsell';
