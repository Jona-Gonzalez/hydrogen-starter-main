import {Image} from '@shopify/hydrogen-react';

import {PressSliderThumbProps} from './PressSlider.types';

export function PressSliderThumb({
  alt,
  image,
  isActive,
  onClick,
}: PressSliderThumbProps) {
  return (
    <div className="relative mx-auto flex w-full max-w-[8rem] justify-center pb-5">
      <button
        aria-label={alt}
        className="relative w-full overflow-hidden"
        onClick={onClick}
        style={{aspectRatio: image?.aspectRatio}}
        type="button"
      >
        {image?.src && (
          <Image
            data={{
              altText: alt || image.altText,
              url: image.src,
              width: 128,
              height: 128 / image.aspectRatio,
            }}
            className={`object-contain transition ${
              isActive ? 'opacity-100' : 'opacity-30'
            }`}
          />
        )}
      </button>

      <div
        className={`absolute bottom-0 left-0 h-px w-full origin-center bg-current transition ${
          isActive ? 'scale-100' : 'scale-0'
        }`}
      />
    </div>
  );
}

PressSliderThumb.displayName = 'PressSliderThumb';
