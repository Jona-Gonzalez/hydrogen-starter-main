import {useMemo} from 'react';
import {useMoney} from '@shopify/hydrogen-react';

export function useCartLinePrices({line}) {
  const {cost, id} = {...line};
  const formattedPrice = useMoney({
    amount: cost?.amountPerQuantity?.amount,
    currencyCode: cost?.amountPerQuantity?.currencyCode,
  });
  const formattedCompareAtPrice = useMoney({
    amount: cost?.compareAtAmountPerQuantity?.amount,
    currencyCode: cost?.compareAtAmountPerQuantity?.currencyCode,
  });

  return useMemo(() => {
    if (!cost?.amountPerQuantity) return {price: null, compareAtPrice: null};
    const amount = parseFloat(cost.amountPerQuantity.amount);
    const compareAtAmount = parseFloat(
      cost.compareAtAmountPerQuantity?.amount || '0',
    );

    return {
      price: formattedPrice.withoutTrailingZeros,
      compareAtPrice:
        compareAtAmount > amount
          ? formattedCompareAtPrice.withoutTrailingZeros
          : null,
    };
  }, [cost, id]);
}
