import {useEffect, useState} from 'react';
import equal from 'fast-deep-equal';
import {ShopifyAddToCartPayload, useCart} from '@shopify/hydrogen-react';

export function useAnalyticsAddToCart({
  basePayload,
  sendShopifyAnalyticsEvent,
}: {
  basePayload: any;
  sendShopifyAnalyticsEvent: (arg0?: any, arg1?: any, arg3?: any) => void;
}) {
  const {id, lines, status, totalQuantity} = useCart();

  const [mounted, setMounted] = useState(false);
  const [previousCartCount, setPreviousCartCount] = useState<
    number | undefined
  >(undefined);
  const [previousCartLines, setPreviousCartLines] = useState<any[] | undefined>(
    undefined,
  );
  const [previousCartLinesMap, setPreviousCartLinesMap] =
    useState<any>(undefined);

  useEffect(() => {
    if (!mounted) {
      setMounted(true);
      return;
    }
    if (!basePayload || !lines || status !== 'idle') return;

    const cartItemsMap = lines.reduce((acc: any, line: any) => {
      if (!line.merchandise) return acc;
      const variantId = line.merchandise.id;
      if (!acc[variantId]) {
        return {...acc, [variantId]: [line]};
      }
      return {...acc, [variantId]: [...acc[variantId], line]};
    }, {});

    if (!previousCartLines || totalQuantity <= previousCartCount) {
      setPreviousCartLines(lines);
      setPreviousCartCount(totalQuantity);
      setPreviousCartLinesMap(cartItemsMap);
      return;
    }

    const isAddedItems: any[] = [];
    const isIncreasedItems: any[] = [];

    lines.forEach((line: any, index) => {
      const variantId = line.merchandise?.id;
      if (!variantId) return;

      const previousLine = previousCartLinesMap[variantId]?.find(
        (prevLine: any) => {
          return equal(prevLine.attributes, line.attributes);
        },
      );
      if (!previousLine) {
        isAddedItems.push({
          ...line,
          index,
          quantityAdded: line.quantity,
          totalPrice: line.estimatedCost?.totalAmount?.amount,
        });
        return;
      }
      if (line.quantity > previousLine.quantity) {
        const quantityAdded = line.quantity - previousLine.quantity;
        const totalAmount = line.estimatedCost?.totalAmount?.amount || '0';
        isIncreasedItems.push({
          ...line,
          index,
          quantityAdded,
          totalPrice: (
            (parseFloat(totalAmount) / line.quantity) *
            quantityAdded
          ).toFixed(2),
        });
      }
    });

    const updatedCartItems = [...isAddedItems, ...isIncreasedItems];

    if (!updatedCartItems.length) return;

    const totalValue = updatedCartItems.reduce((acc, line) => {
      return acc + parseFloat(line.totalPrice || '0');
    }, 0);
    const products = updatedCartItems.map((line) => {
      return {
        productGid: line.merchandise.product.id,
        name: line.merchandise.product.title,
        price: line.totalPrice,
        variantGid: line.merchandise.id,
        variantName: line.merchandise.title,
        category: line.merchandise.product.productType,
        brand: line.merchandise.product.vendor,
        ...(line.merchandise.sku ? {sku: line.merchandise.sku} : null),
        quantity: line.quantityAdded,
      };
    });

    const payload: ShopifyAddToCartPayload = {
      ...basePayload,
      cartId: id,
      totalValue,
      products,
    };

    sendShopifyAnalyticsEvent(payload, 'ADD_TO_CART', () => {
      setPreviousCartLines(lines);
      setPreviousCartCount(totalQuantity);
      setPreviousCartLinesMap(cartItemsMap);
    });
  }, [basePayload, status]);
}
