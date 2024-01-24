// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable @typescript-eslint/naming-convention */
import {useEffect, useRef} from 'react';
import {useLocation} from '@remix-run/react';
import {ShopifyPageViewPayload} from '@shopify/hydrogen-react';

const PAGE_TYPES: any = {
  '/': 'home',
  '/account': 'customersAccount',
  '/account/activate': 'customersActivateAccount',
  '/account/address-book': 'customersAddresses',
  '/account/login': 'customersLogin',
  '/account/orders/': 'customersOrders',
  '/account/register': 'customersRegister',
  '/account/reset-password': 'customersResetPassword',
  '/articles': 'article',
  '/blogs': 'blog',
  '/cart': 'cart',
  '/collections': 'collection',
  '/not-found': 'notFound',
  '/pages': 'page',
  '/pages/privacy-policy': 'policy',
  '/pages/search': 'search',
  '/products': 'product',
  '/search': 'search',
};

export function useAnalyticsPageView({
  basePayload,
  collection,
  product,
  sendShopifyAnalyticsEvent,
}: {
  basePayload: any;
  collection?: any;
  product?: any;
  sendShopifyAnalyticsEvent: (arg0?: any, arg1?: any, arg3?: any) => void;
}) {
  const pathnameRef = useRef<string | undefined>(undefined);
  const {pathname, search} = useLocation();
  let searchString = '';
  if (pathname === '/pages/search') {
    const params = new URLSearchParams(search);
    searchString = params.get('term') || '';
  }

  useEffect(() => {
    if (!basePayload || pathnameRef.current === pathname) return undefined;

    const payload: ShopifyPageViewPayload = {
      ...basePayload,
      canonicalUrl: `${window.location.origin}${
        window.location.pathname === '/' ? '' : window.location.pathname
      }`,
      pageType: pathname.startsWith('/account/orders/')
        ? PAGE_TYPES['/account/orders/']
        : PAGE_TYPES[pathname] ||
          PAGE_TYPES[pathname.split('/').slice(0, -1).join('/')] ||
          '',
      ...(searchString ? {searchString} : null),
      ...(collection
        ? {collectionHandle: collection.handle, resourceId: collection.id}
        : null),
      ...(product
        ? {
            totalValue: parseFloat(product.priceRange.minVariantPrice.amount),
            resourceId: product.id,
            products: [
              {
                productGid: product.id,
                name: product.title,
                brand: product.vendor,
                price: product.priceRange.minVariantPrice.amount,
                category: product.productType,
              },
            ],
          }
        : null),
    };

    sendShopifyAnalyticsEvent(payload, 'PAGE_VIEW');

    pathnameRef.current = pathname;
    return () => {
      pathnameRef.current = pathname;
    };
  }, [basePayload, pathname, searchString]);
}
