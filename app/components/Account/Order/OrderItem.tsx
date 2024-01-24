import {useMemo} from 'react';
import {Image} from '@shopify/hydrogen-react';

import {Link} from '~/components';

export function OrderItem({item}) {
  const {discountedTotalPrice, originalTotalPrice, quantity, variant} = item;

  const prices = useMemo(() => {
    const discountedFloat = parseFloat(discountedTotalPrice?.amount);
    const originalFloat = parseFloat(originalTotalPrice?.amount);
    const isDiscounted = discountedFloat < originalFloat;

    const formatPrice = (price) => {
      return `$${price.toFixed(2)}`;
    };

    return {
      originalPrice: formatPrice(originalFloat / quantity),
      discountedPrice: isDiscounted
        ? formatPrice(discountedFloat / quantity)
        : null,
      originalTotal: formatPrice(originalFloat),
      discountedTotal: isDiscounted ? formatPrice(discountedFloat) : null,
    };
  }, [discountedTotalPrice?.amount, originalTotalPrice?.amount, quantity]);

  return (
    <div className="grid grid-cols-[10fr_auto] items-center gap-3 border-b border-b-border py-4 text-sm md:grid-cols-[6fr_2fr_1fr_1fr_1fr]">
      <div className="grid grid-cols-[3rem_1fr] items-center gap-4">
        {/* mobile/desktop product image */}
        <div
          className="bg-offWhite"
          style={{
            aspectRatio:
              variant?.image?.width && variant?.image?.height
                ? variant.image.width / variant.image.height
                : 'var(--product-image-aspect-ratio)',
          }}
        >
          {variant?.image?.src && (
            <Image
              data={{
                altText: variant.product?.title,
                url: variant.image.src,
                height: Math.floor(
                  48 / (variant.image.width / variant.image.height),
                ),
                width: 48,
              }}
            />
          )}
        </div>

        <div className="flex flex-1 flex-col items-start gap-2">
          {/* mobile/desktop product title */}
          {variant?.product ? (
            <Link
              aria-label={variant.product.title}
              to={`/products/${variant.product.handle}`}
            >
              <p className="break-words font-semibold">
                {variant.product.title}
              </p>
            </Link>
          ) : (
            <p className="break-words font-semibold">{item.title}</p>
          )}

          {/* mobile variant title */}
          {variant?.title !== 'Default Title' && (
            <p className="text-xss md:hidden">{variant?.title}</p>
          )}

          {/* mobile price per qty and quantity */}
          <div className="flex gap-1 text-xs md:hidden">
            {prices.discountedTotal && (
              <p className="text-mediumDarkGray line-through">
                {prices.discountedTotal}
              </p>
            )}
            <p>{prices.originalPrice}</p>
            <p>x {quantity}</p>
          </div>
        </div>
      </div>

      {/* desktop variant title */}
      <p className="hidden md:block">
        {variant?.title !== 'Default Title' ? '' : variant?.title}
      </p>

      {/* desktop price per qty */}
      <div className="hidden md:block">
        {prices.discountedPrice && (
          <p className="text-mediumDarkGray line-through">
            {prices.discountedPrice}
          </p>
        )}
        <p>{prices.originalPrice}</p>
      </div>

      {/* desktop quantity */}
      <p className="hidden md:block">{quantity}</p>

      {/* mobile/desktop total price */}
      <div>
        {prices.discountedTotal && (
          <p className="text-mediumDarkGray line-through">
            {prices.discountedTotal}
          </p>
        )}
        <p>{prices.originalTotal}</p>
      </div>
    </div>
  );
}

OrderItem.displayName = 'OrderItem';
