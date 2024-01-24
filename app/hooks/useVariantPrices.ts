import {useMemo} from 'react';
import {useMoney} from '@shopify/hydrogen-react';

export function useVariantPrices({
  variant,
}: {
  variant: {id: string; price: any; compareAtPrice: any} | undefined;
}) {
  const {id, price, compareAtPrice} = {...variant};
  const formattedPrice = useMoney({
    amount: price?.amount,
    currencyCode: price?.currencyCode,
  });
  const formattedCompareAtPrice = useMoney({
    amount: compareAtPrice?.amount,
    currencyCode: compareAtPrice?.currencyCode,
  });

  return useMemo(() => {
    if (!price?.amount) {
      return {price: undefined, compareAtPrice: undefined};
    }
    ``;
    const amount = parseFloat(price.amount);
    const compareAtAmount = parseFloat(compareAtPrice?.amount || '0');

    return {
      price: formattedPrice.withoutTrailingZeros,
      compareAtPrice:
        compareAtAmount > amount
          ? formattedCompareAtPrice.withoutTrailingZeros
          : undefined,
    };
  }, [id]);
}
