import {Image} from '@shopify/hydrogen-react';

import {Svg} from '~/components';

export function ProductMediaThumbnail({
  alt,
  index,
  isActive,
  mediaContentType = 'IMAGE',
  src,
  swiper,
}) {
  return (
    <button
      aria-label={`Slide to product image ${index + 1}`}
      className={`relative flex aspect-square w-full items-center justify-center overflow-hidden rounded border transition ${
        isActive ? ' border-black' : 'border-transparent'
      }`}
      onClick={() => swiper?.slideTo(index)}
      type="button"
    >
      {src && (
        <Image
          data={{
            altText: alt || image.altText,
            url: src,
            height: 80,
            width: 80,
          }}
          className="object-cover"
          sizes="80px"
          // priority={index < 6}
        />
      )}

      {mediaContentType === 'VIDEO' && (
        <Svg
          className="absolute left-1/2 top-1/2 w-1/3 -translate-x-1/2 -translate-y-1/2 text-white"
          src="/svgs/play.svg#play"
          title="Play"
          viewBox="0 0 24 24"
        />
      )}
    </button>
  );
}

ProductMediaThumbnail.displayName = 'ProductMediaThumbnail';
