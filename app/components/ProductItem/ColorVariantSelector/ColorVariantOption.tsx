import {Image} from '@shopify/hydrogen-react';

export function ColorVariantOption({
  color,
  enabledColorNameOnHover,
  onClick,
  selectedVariantColor,
  swatchesMap,
}) {
  const isActive = color === selectedVariantColor;
  const swatch = swatchesMap?.[color?.toLowerCase().trim()];
  const hasImage = swatch?.startsWith('http');
  const backgroundColor =
    isActive && swatch === '#FFFFFF'
      ? 'var(--off-white)'
      : swatch || 'var(--off-white)';

  return (
    <div className="group/color relative">
      <button
        aria-label={`Select ${color} color variant`}
        className={`relative flex h-4 w-4 items-center justify-center overflow-hidden rounded-[50%] border border-border transition md:hover:border-text ${
          isActive ? 'border-text' : ''
        }`}
        onClick={onClick}
        style={{backgroundColor}}
        type="button"
      >
        {hasImage && (
          <Image
            data={{
              altText: color,
              url: swatch,
              height: 24,
              width: 24,
            }}
            className="absolute left-1/2 top-1/2 h-full w-full -translate-x-1/2 -translate-y-1/2 object-cover"
          />
        )}

        <div
          className={`absolute left-1/2 top-1/2 h-full w-full -translate-x-1/2 -translate-y-1/2 rounded-[50%] border-white transition-[border-width] duration-100 ${
            isActive ? 'border-[2px]' : 'border-[0px]'
          }`}
        />
      </button>

      {enabledColorNameOnHover && (
        <p className="pointer-events-none absolute bottom-[calc(100%+2px)] left-[25%] hidden whitespace-nowrap rounded bg-offWhite px-1 text-2xs leading-[14px] text-mediumDarkGray opacity-0 transition duration-75 md:block group-hover/color:md:opacity-100">
          {color}
        </p>
      )}
    </div>
  );
}

ColorVariantOption.displayName = 'ColorVariantOption';
