import {useMemo} from 'react';
import {Image} from '@shopify/hydrogen-react';

import {Link, QuantitySelector, Spinner, Svg} from '~/components';
import {useCartLine} from './useCartLine';
import {useCartLineImage} from './useCartLineImage';
import {useCartLinePrices} from './useCartLinePrices';

export function CartLine({
  closeCart,
  line,
}: {
  closeCart: () => void;
  line: any;
}) {
  const {quantity, merchandise} = line;

  const {
    handleDecrement,
    handleIncrement,
    handleRemove,
    isRemovingLine,
    isUpdatingLine,
  } = useCartLine({line});

  const {price, compareAtPrice} = useCartLinePrices({line});

  const image = useCartLineImage({line});

  const url = useMemo(() => {
    return `/products/${merchandise.product.handle}?merchandise=${merchandise.id
      .split('/')
      .pop()}`;
  }, [merchandise.id]);

  return (
    <div className="relative grid grid-cols-[auto_1fr] items-center gap-3 p-4 ">
      <Link
        aria-label={`View ${merchandise.product.title}`}
        to={url}
        onClick={closeCart}
        tabIndex="-1"
      >
        {image?.url && (
          <Image
            data={{
              altText: merchandise.product.title,
              url: image.url,
            }}
            className="bg-offWhite"
            crop="center"
            height={Math.floor(88 / (image.width / image.height))}
            width="88"
          />
        )}
      </Link>

      <div className="flex min-h-[6.25em] flex-col justify-between gap-4">
        <div className="relative pr-6">
          <Link
            aria-label={`View ${merchandise.product.title}`}
            to={url}
            onClick={closeCart}
          >
            <h3 className="text-title-h6">{merchandise.product.title}</h3>
          </Link>

          {merchandise.title !== 'Default Title' && (
            <p className="text-sm text-mediumDarkGray">{merchandise.title}</p>
          )}

          <button
            aria-label={`Remove ${merchandise.product.title} from cart`}
            className="absolute right-0 top-0 w-3"
            onClick={handleRemove}
            type="button"
          >
            <Svg
              src="/svgs/close.svg#close"
              title="Close"
              viewBox="0 0 24 24"
            />
          </button>
        </div>

        <div className="flex items-center justify-between gap-3">
          <QuantitySelector
            handleDecrement={handleDecrement}
            handleIncrement={handleIncrement}
            isUpdating={isUpdatingLine}
            productTitle={merchandise.product.title}
            quantity={quantity}
          />

          <div className="flex flex-1 flex-wrap justify-end gap-x-2">
            {compareAtPrice && (
              <p className="text-mediumDarkGray line-through">{compareAtPrice}</p>
            )}
            <p>{price}</p>
          </div>
        </div>
      </div>

      {isRemovingLine && (
        <div className="absolute left-0 top-0 flex h-full w-full items-center justify-center bg-[rgba(255,255,255,0.6)] text-mediumDarkGray">
          <Spinner width="20" />
        </div>
      )}
    </div>
  );
}

CartLine.displayName = 'CartLine';
