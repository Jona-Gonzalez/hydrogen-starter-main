import {useMemo} from 'react';
import {useCart} from '@shopify/hydrogen-react';
import {useProductsContext} from '~/contexts';

export function useCurrencyCode() {
  const {cost} = useCart();
  const productsContext = useProductsContext();
  const cartCurrencyCode = cost?.totalAmount?.currencyCode;
  const {products}: any = {...productsContext?.state};

  return useMemo(() => {
    return (
      cartCurrencyCode ||
      products?.slice(0, 10).find(({variants}: {variants: any}) => {
        return variants?.nodes?.[0]?.price?.currencyCode;
      })?.variants?.nodes?.[0]?.price?.currencyCode ||
      undefined
    );
  }, [cartCurrencyCode, products]);
}
