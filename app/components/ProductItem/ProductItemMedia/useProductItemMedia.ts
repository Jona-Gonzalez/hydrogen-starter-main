import {useMemo} from 'react';

import {COLOR_OPTION_NAME} from '~/lib/constants';

export function useProductItemMedia({selectedProduct, selectedVariant}) {
  const colorOptions = useMemo(() => {
    return selectedProduct?.options?.find(
      (option) => option.name === COLOR_OPTION_NAME,
    )?.values;
  }, [selectedProduct?.options]);

  const hasNonGroupColorVariants =
    !selectedProduct?.isGrouped && colorOptions?.length > 1;

  // if multiple color variants from same product, use first media w/ color as alt
  const mediaMapByColor = useMemo(() => {
    if (!hasNonGroupColorVariants || !colorOptions) return null;

    const colorKeys = colorOptions.map((color) => color.toLowerCase());

    return colorOptions.reduce((acc, color) => {
      let firstMediaIndex = 0;
      let secondMediaIndex = 1;
      const medias = selectedProduct?.media?.nodes;
      const colorKey = color.toLowerCase();
      firstMediaIndex =
        medias.findIndex((item) => {
          const alt = (item.alt || item.altText)?.trim().toLowerCase();
          return alt === colorKey || !colorKeys.includes(alt);
        }) || 0;
      const secondMediaAlt = medias[firstMediaIndex + 1]?.alt
        ?.trim()
        .toLowerCase();
      secondMediaIndex =
        secondMediaAlt === colorKey || !colorKeys.includes(secondMediaAlt)
          ? firstMediaIndex + 1
          : -1;
      const media = [medias[firstMediaIndex], medias[secondMediaIndex]];
      return {...acc, [color]: media};
    }, {});
  }, [selectedProduct?.id]);

  const selectedMedia = useMemo(() => {
    if (hasNonGroupColorVariants && selectedVariant) {
      const color = selectedVariant.selectedOptions.find(
        (option) => option.name === COLOR_OPTION_NAME,
      )?.value;
      return mediaMapByColor?.[color];
    }
    return selectedProduct?.media?.nodes?.slice(0, 2);
  }, [mediaMapByColor, selectedProduct?.id, selectedVariant?.id]);

  return {
    primaryMedia: selectedMedia?.[0],
    hoverMedia: selectedMedia?.[1],
  };
}
