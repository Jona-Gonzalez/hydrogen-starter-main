import {useCallback, useMemo} from 'react';
import {Image} from '@shopify/hydrogen-react';

import {COLOR_OPTION_NAME} from '~/lib/constants';
import {Link} from '~/components';
import {useDataLayerClickEvents, useVariantPrices} from '~/hooks';

export function SearchItem({closeSearch, index, item: product}) {
  const firstVariant = product.variants.nodes[0];
  const {price, compareAtPrice} = useVariantPrices({
    variant: firstVariant,
  });
  const {sendClickProductItemEvent} = useDataLayerClickEvents();
  const localized = null;

  const handleClick = useCallback(() => {
    sendClickProductItemEvent({
      isSearchResult: true,
      listIndex: index,
      product,
      selectedVariant: firstVariant,
    });
    closeSearch();
  }, [index, localized, product.id]);

  const color = useMemo(() => {
    return firstVariant?.selectedOptions.find(
      (option) => option.name === COLOR_OPTION_NAME,
    )?.value;
  }, [firstVariant?.id]);

  const image = useMemo(() => {
    return product.media.nodes.find((media) => {
      return media.mediaContentType === 'IMAGE';
    })?.previewImage;
  }, [product]);

  const url = `/products/${product.handle}`;

  return (
    <Link
      aria-label={`View ${product.title}`}
      className="relative grid grid-cols-[5.5rem_1fr] items-center gap-3"
      to={url}
      onClick={handleClick}
    >
      <div
        className="bg-offWhite"
        style={{
          aspectRatio:
            image?.width && image?.height
              ? image.width / image.height
              : 'var(--product-image-aspect-ratio)',
        }}
      >
        {image?.url && (
          <Image
            data={{
              altText: product.title,
              url: image.url,
              height: Math.floor(88 / (image.width / image.height)),
              width: 88,
            }}
          />
        )}
      </div>

      <div className="flex flex-col justify-between gap-3">
        <div>
          <h4 className="text-title-h6">{product.title}</h4>

          <p className="min-h-[1.25rem] text-sm text-mediumDarkGray">{color}</p>
        </div>

        <div className="flex flex-wrap gap-x-1.5">
          {compareAtPrice && (
            <p className="text-sm text-mediumDarkGray line-through">
              {compareAtPrice}
            </p>
          )}
          <p className="min-h-[1.25rem] text-sm">{price}</p>
        </div>
      </div>
    </Link>
  );
}

SearchItem.displayName = 'SearchItem';
