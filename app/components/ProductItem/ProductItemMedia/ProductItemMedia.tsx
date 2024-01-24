import {useRef} from 'react';
import {Image} from '@shopify/hydrogen-react';

import {Badges, Spinner} from '~/components';
import {ProductItemVideo} from './ProductItemVideo';
import {useProductItemMedia} from './useProductItemMedia';

export function ProductItemMedia({priority, selectedProduct, selectedVariant}) {
  const hoverVideoRef = useRef(null);

  const {primaryMedia, hoverMedia} = useProductItemMedia({
    selectedProduct,
    selectedVariant,
  });

  const {width, height} = {...primaryMedia?.previewImage};

  return (
    <div
      className="group/media relative bg-offWhite"
      // for a static/consistent aspect ratio, delete style below and add 'aspect-[var(--product-image-aspect-ratio)]' to className
      style={{
        aspectRatio:
          width && height
            ? width / height
            : 'var(--product-image-aspect-ratio)',
      }}
      onMouseEnter={() => {
        if (hoverMedia?.mediaContentType !== 'VIDEO') return;
        hoverVideoRef.current.play();
      }}
      onMouseLeave={() => {
        if (hoverMedia?.mediaContentType !== 'VIDEO') return;
        hoverVideoRef.current.pause();
      }}
    >
      {/* media w/o hover element */}
      {primaryMedia &&
        !hoverMedia &&
        (primaryMedia.mediaContentType === 'VIDEO' ? (
          <ProductItemVideo autoPlay media={primaryMedia} />
        ) : (
          <Image
            data={{
              altText: selectedProduct?.title,
              url: primaryMedia.previewImage.url,
            }}
            className="media-fill"
            loading={priority ? 'eager' : 'lazy'}
            sizes="(min-width: 768px) 33vw, 50vw"
          />
        ))}

      {/* media w/ hover element */}
      {primaryMedia && hoverMedia && (
        <>
          <div className="opacity-100 transition duration-300 md:group-hover/media:opacity-0">
            {primaryMedia.mediaContentType === 'VIDEO' ? (
              <ProductItemVideo autoPlay media={primaryMedia} />
            ) : (
              <Image
                data={{
                  altText: selectedProduct?.title,
                  url: primaryMedia.previewImage.url,
                }}
                className="media-fill"
                sizes="(min-width: 768px) 33vw, 50vw"
              />
            )}
          </div>

          <div className="hidden opacity-0 transition duration-300 md:block md:group-hover/media:opacity-100">
            {hoverMedia.mediaContentType === 'VIDEO' ? (
              <ProductItemVideo
                autoPlay={false}
                media={hoverMedia}
                ref={hoverVideoRef}
              />
            ) : (
              <Image
                data={{
                  altText: selectedProduct?.title,
                  url: hoverMedia.previewImage.url,
                }}
                className="media-fill"
                sizes="(min-width: 768px) 33vw, 50vw"
              />
            )}
          </div>
        </>
      )}

      {/* loader */}
      {!primaryMedia && (
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-gray">
          <Spinner width="20" />
        </div>
      )}

      <div className="pointer-events-none absolute left-0 top-0 z-[1] p-2.5 xs:p-3 xl:p-4">
        <Badges
          className="max-xl:text-label-sm gap-2 xs:gap-2 [&_div]:max-xl:px-1.5 [&_div]:max-xl:py-0.5"
          isDraft={selectedProduct?.publishedAt === null}
          tags={selectedProduct?.tags}
        />
      </div>
    </div>
  );
}

ProductItemMedia.displayName = 'ProductItemMedia';
