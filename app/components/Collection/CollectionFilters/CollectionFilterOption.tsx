import {useMemo} from 'react';
import {Image} from '@shopify/hydrogen-react';

import {isLightHexColor} from '~/lib/utils';
import {Svg} from '~/components';

export function CollectionFilterOption({
  activeFilters,
  addFilter,
  count,
  isColor,
  name,
  removeFilter,
  showCount,
  swatchesMap,
  value,
}) {
  const isActive = useMemo(() => {
    return Object.entries(activeFilters).some(([key, values]) => {
      return key === name && values.some((v) => v === value);
    });
  }, [activeFilters, value]);

  let swatch = null;
  let hasImage = false;

  if (isColor) {
    swatch = swatchesMap[value.toLowerCase().trim()];
    hasImage = swatch?.startsWith('http');
  }

  const checkmarkColor = useMemo(() => {
    if (!isColor) return 'text-white';
    if (!swatch) return 'text-black';
    return isLightHexColor(swatch) ? 'text-black' : 'text-white';
  }, [isColor, swatch]);

  const colorBackground = swatch || 'var(--off-white)';
  const nonColorBackground = isActive ? 'var(--black)' : 'var(--off-white)';

  return (
    <button
      aria-label={`Add ${value} to filters`}
      className={`group flex gap-3 text-left text-base transition max-md:h-11 max-md:w-full max-md:items-center max-md:px-4 md:gap-2 hover:md:text-text ${
        isActive ? 'text-text max-md:font-bold' : 'text-mediumDarkGray'
      }`}
      onClick={() => {
        if (isActive) {
          removeFilter({key: name, value});
        } else {
          addFilter({key: name, value});
        }
      }}
      type="button"
    >
      <div
        className={`relative flex h-5 w-5 items-center justify-center overflow-hidden rounded border border-border transition md:mt-[3px] md:h-[18px] md:w-[18px] group-hover:md:border-text ${
          isActive ? 'border-text' : ''
        }`}
        style={{
          backgroundColor: isColor ? colorBackground : nonColorBackground,
        }}
      >
        {hasImage && (
          <Image
            data={{
              altText: value,
              url: swatch,
              height: 24,
              width: 24,
            }}
            className="absolute left-1/2 top-1/2 h-full w-full -translate-x-1/2 -translate-y-1/2 object-cover"
          />
        )}

        <div
          className={`absolute top-1/2 left-1/2 h-full w-full -translate-x-1/2 -translate-y-1/2 rounded-[1px] border-white transition-[border-width] duration-100 ${
            isActive ? 'border-[0px] md:border-[0px]' : 'border-[0px]'
          }`}
        />

        <Svg
          src="/svgs/checkmark.svg#checkmark"
          viewBox="0 0 24 24"
          className={`pointer-events-none w-6 transition md:w-5 ${checkmarkColor} ${
            isActive ? 'opacity-100' : 'opacity-0'
          }`}
        />
      </div>

      <p className="flex-1">
        {value}{' '}
        <span className={`text-xs ${showCount ? 'inline' : 'hidden'}`}>
          ({count})
        </span>
      </p>
    </button>
  );
}

CollectionFilterOption.displayName = 'CollectionFilterOption';
