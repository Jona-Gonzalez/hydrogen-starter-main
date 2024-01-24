import {useCallback, useEffect, useMemo, useState} from 'react';

import {COLOR_OPTION_NAME} from '~/lib/constants';
import {ColorVariantOption} from './ColorVariantOption';

export function ColorVariantOptions({
  enabledColorNameOnHover,
  getProductByHandle,
  grouping,
  initialProduct,
  initialProductColorOptions,
  selectedVariant,
  setProductFromColorSelector,
  setVariantFromColorSelector,
  swatchesMap,
}) {
  const [maxCount, setMaxCount] = useState(7);
  const [productMapByColor, setProductMapByColor] = useState(null);
  const [variantMapByColor, setVariantMapByColor] = useState(null);

  const colorOptions = useMemo(() => {
    const originalColor = initialProductColorOptions[0];
    return grouping
      ? [
          originalColor,
          ...grouping.optionsMap?.[COLOR_OPTION_NAME].filter(
            (color) => color !== originalColor,
          ),
        ]
      : initialProductColorOptions;
  }, [grouping, initialProductColorOptions]);

  const selectedVariantColor = useMemo(() => {
    return selectedVariant?.selectedOptions.find(
      (option) => option.name === COLOR_OPTION_NAME,
    )?.value;
  }, [selectedVariant]);

  const generateProductMapByColor = useCallback(async () => {
    if (!grouping) return;
    const productHandles = [
      ...grouping.products,
      ...grouping.subgroups.flatMap((subgroup) => subgroup.products),
    ];
    const products = productHandles.map((handle) => {
      return getProductByHandle(handle);
    });
    setProductMapByColor(
      products.reduce((acc, groupProduct) => {
        return {
          ...acc,
          [groupProduct.optionsMap?.[COLOR_OPTION_NAME]?.[0]]: groupProduct,
        };
      }, {}),
    );
  }, [grouping]);

  const generateVariantMapByColor = useCallback(() => {
    if (grouping) return;
    setVariantMapByColor(
      initialProduct.variants?.nodes?.reduce((acc, variant) => {
        const variantColor = variant.selectedOptions.find((option) => {
          return option.name === COLOR_OPTION_NAME;
        })?.value;
        if (acc[variantColor]) return acc;
        return {
          ...acc,
          [variantColor]: variant,
        };
      }, {}),
    );
  }, [grouping, initialProduct]);

  const handleOptionClick = useCallback(
    (color) => {
      if (grouping) {
        if (!productMapByColor) return;
        setProductFromColorSelector(productMapByColor[color]);
        setVariantFromColorSelector(
          productMapByColor[color]?.variants?.nodes?.[0],
        );
      } else {
        setProductFromColorSelector(initialProduct);
        setVariantFromColorSelector(variantMapByColor?.[color]);
      }
    },
    [grouping, productMapByColor, variantMapByColor],
  );

  useEffect(() => {
    generateProductMapByColor();
    generateVariantMapByColor();
  }, [grouping, initialProduct]);

  const slicedColorOptions = colorOptions.slice(0, maxCount);
  const remainingColorCount = colorOptions.length - slicedColorOptions.length;

  return (
    <ul className="flex flex-wrap gap-1">
      {slicedColorOptions.map((color, index) => {
        return (
          <li key={index}>
            <ColorVariantOption
              color={color}
              enabledColorNameOnHover={enabledColorNameOnHover}
              onClick={() => handleOptionClick(color)}
              selectedVariantColor={selectedVariantColor}
              swatchesMap={swatchesMap}
            />
          </li>
        );
      })}

      {remainingColorCount > 0 && (
        <li className="flex">
          <button
            aria-label={`Show ${remainingColorCount} more color options`}
            className="whitespace-nowrap text-2xs"
            onClick={() => setMaxCount(colorOptions.length)}
            type="button"
          >
            + {remainingColorCount} more
          </button>
        </li>
      )}
    </ul>
  );
}

ColorVariantOptions.displayName = 'ColorVariantOptions';
