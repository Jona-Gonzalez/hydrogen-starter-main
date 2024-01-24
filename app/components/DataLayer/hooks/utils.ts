// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable @typescript-eslint/naming-convention */
const STOREFRONT_NAME =
  (typeof window !== 'undefined' && window.ENV?.PUBLIC_SITE_TITLE) ||
  'Storefront';

export const mapProductItemProduct =
  (list = '') =>
  (product: any, index = 0) => {
    try {
      if (!product) return null;
      const firstVariant = product.variants?.nodes?.[0];

      return {
        sku: firstVariant?.sku || '',
        name: product.title || '',
        brand: product.vendor || STOREFRONT_NAME,
        category: product.productType || '',
        variant: firstVariant?.title || '',
        price: firstVariant?.price?.amount || '',
        list,
        product_id: product.id?.split('/').pop() || '',
        variant_id: firstVariant?.id?.split('/').pop() || '',
        compare_at_price: firstVariant?.compareAtPrice?.amount || '',
        image: product.featuredImage?.url || '',
        position: index + 1,
      };
    } catch (error: any) {
      console.error('DataLayer:mapProductItemProduct error', error.message);
      console.error('DataLayer:mapProductItemProduct product', product);
      return null;
    }
  };

export const mapProductItemVariant =
  (list = '') =>
  (variant: any, index = 0) => {
    try {
      if (!variant) return null;

      return {
        sku: variant.sku || '',
        name: variant.product.title || '',
        brand: variant.product.vendor || STOREFRONT_NAME,
        category: variant.product.productType || '',
        variant: variant.title || '',
        price: `${variant.price?.amount || ''}`,
        list,
        product_id: variant.product.id?.split('/').pop() || '',
        variant_id: variant.id?.split('/').pop() || '',
        compare_at_price: `${variant.compareAtPrice?.amount || ''}`,
        image: variant.image?.url || '',
        position: (variant.index ?? index) + 1,
      };
    } catch (error) {
      console.error('DataLayer:mapProductItemVariant error', error.message);
      console.error('DataLayer:mapProductItemVariant variant', variant);
      return null;
    }
  };

export const mapProductPageVariant =
  (list = '') =>
  (variant: any) => {
    try {
      if (!variant) return null;

      return {
        sku: variant.sku || '',
        name: variant.product.title || '',
        brand: variant.product.vendor || STOREFRONT_NAME,
        category: variant.product.productType || '',
        variant: variant.title || '',
        price: `${variant.price?.amount || ''}`,
        list,
        product_id: variant.product.id?.split('/').pop() || '',
        variant_id: variant.id?.split('/').pop() || '',
        compare_at_price: `${variant.compareAtPrice?.amount || ''}`,
        image: variant.image?.url || '',
      };
    } catch (error: any) {
      console.error('DataLayer:mapProductPageVariant error', error.message);
      console.error('DataLayer:mapProductPageVariant variant', variant);
      return null;
    }
  };

export const mapCartLine =
  (list = '') =>
  (line: {quantity?: number; merchandise?: any; index?: number}, index = 0) => {
    try {
      const {quantity, merchandise} = {...line};
      if (!merchandise) return null;

      return {
        sku: merchandise.sku || '',
        name: merchandise.product?.title || '',
        brand: merchandise.product?.vendor || STOREFRONT_NAME,
        category: merchandise.product?.productType || '',
        variant: merchandise.title || '',
        price: merchandise.price?.amount || '',
        quantity: `${quantity || ''}`,
        list,
        product_id: merchandise.product?.id?.split('/').pop() || '',
        variant_id: merchandise.id?.split('/').pop() || '',
        compare_at_price: merchandise.compareAtPrice?.amount || '',
        image: merchandise.image?.url || '',
        position: (line.index || index) + 1,
      };
    } catch (error: any) {
      console.error('DataLayer:mapCartLine error', error.message);
      console.error('DataLayer:mapCartLine line', line);
      return null;
    }
  };
