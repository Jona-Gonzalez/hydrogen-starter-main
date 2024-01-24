import {useCallback, useEffect, useState} from 'react';
import {useCart} from '@shopify/hydrogen-react';
import {useSiteSettings} from '@pack/react';

import {useGlobalContext} from '~/contexts';

export function useAddToCart({
  addToCartText: addToCartTextOverride = '',
  attributes,
  quantity = 1,
  selectedVariant = null,
  sellingPlanId,
}: {
  addToCartText?: string;
  attributes?: any;
  quantity?: number;
  selectedVariant?: any;
  sellingPlanId?: string;
}) {
  const {error, linesAdd, status} = useCart();
  const {
    actions: {openCart, openModal},
  }: any = useGlobalContext();
  const siteSettings = useSiteSettings();

  const [isAdding, setIsAdding] = useState(false);

  const enabledNotifyMe = siteSettings?.settings?.product?.backInStock?.enabled;
  const variantIsSoldOut = selectedVariant && !selectedVariant.availableForSale;
  const variantIsPreorder = false; // add logic to determine preorder if applicable

  let buttonText = '';
  if (variantIsPreorder) {
    buttonText =
      siteSettings?.settings?.product?.addToCart?.preorderText || 'Preorder';
  } else if (variantIsSoldOut) {
    buttonText = enabledNotifyMe
      ? siteSettings?.settings?.product?.backInStock?.notifyMeText ||
        'Notify Me'
      : siteSettings?.settings?.product?.addToCart?.soldOutText || 'Sold Out';
  } else {
    buttonText =
      addToCartTextOverride ||
      siteSettings?.settings?.product?.addToCart?.addToCartText ||
      'Add To Cart';
  }

  const cartIsUpdating = status === 'creating' || status === 'updating';

  const handleAddToCart = useCallback(() => {
    if (!selectedVariant?.id || isAdding || cartIsUpdating) return;
    setIsAdding(true);
    linesAdd([
      {
        attributes,
        merchandiseId: selectedVariant.id,
        quantity,
        sellingPlanId,
      },
    ]);
  }, [
    attributes,
    cartIsUpdating,
    isAdding,
    quantity,
    selectedVariant?.id,
    sellingPlanId,
  ]);

  const handleNotifyMe = useCallback(
    (component: any) => {
      if (!selectedVariant?.id) return;
      openModal(component);
    },
    [selectedVariant?.id],
  );

  useEffect(() => {
    if (isAdding && status === 'idle') {
      setIsAdding(false);
      openCart();
    }
  }, [status, isAdding]);

  useEffect(() => {
    if (!error) return;
    console.error('@shopify/hydrogen-react:useCart', error);
  }, [error]);

  return {
    state: {
      buttonText,
      cartIsUpdating, // cart is updating
      isAdding, // line is adding
      isNotifyMe: variantIsSoldOut && enabledNotifyMe,
      isSoldOut: variantIsSoldOut,
      subtext: siteSettings?.settings?.product?.addToCart?.subtext,
    },
    actions: {
      handleAddToCart,
      handleNotifyMe,
    },
  };
}
