import {useEffect, useMemo} from 'react';
import {Script} from '@shopify/hydrogen';

const IN_STOCK = 'https://schema.org/InStock';
const OUT_OF_STOCK = 'https://schema.org/OutOfStock';

const getAvailability = (variant: any) => {
  if (!variant) return '';
  return variant.availableForSale ? IN_STOCK : OUT_OF_STOCK;
};

export function ProductSchemaMarkup({
  product = {},
  siteTitle,
  url: requestUrl,
}: any) {
  const {origin, pathname} = useMemo<any>(() => {
    try {
      return new URL(requestUrl);
    } catch (error) {
      return {};
    }
  }, [requestUrl]);
  const pageUrl = origin ? `${origin}${pathname}` : '';

  const productSchemaMarkup = useMemo(() => {
    const variants = product.variants?.nodes || [];
    return {
      '@context': 'https://schema.org/',
      '@type': 'Product',
      name: product.title || '',
      image: product.featuredImage?.url,
      description: product.description,
      brand: {
        '@type': 'Brand',
        name: siteTitle || '',
      },
      offers:
        variants.length > 1
          ? variants.map((variant: any) => {
              return {
                '@type': 'Offer',
                url: `${pageUrl}?${variant.selectedOptions.reduce(
                  (acc: any, {name, value}: any, index: number, arr: []) => {
                    return `${acc}${name}=${value}${
                      index === arr.length - 1 ? '' : '&'
                    }`;
                  },
                  '',
                )}`,
                priceCurrency: variant.price?.currencyCode || 'USD',
                price: variant.price?.amount || '',
                sku: variant.sku || '',
                name: variant.title || '',
                availability: getAvailability(variant),
                itemCondition: 'https://schema.org/NewCondition',
              };
            })
          : {
              '@type': 'Offer',
              url: pageUrl || '',
              priceCurrency: variants[0]?.price?.currencyCode || 'USD',
              price: variants[0]?.price?.amount || '',
              sku: variants[0]?.sku || '',
              name: variants[0]?.title || '',
              availability: getAvailability(variants?.[0]),
              itemCondition: 'https://schema.org/NewCondition',
            },
    };
  }, [pageUrl, product, siteTitle]);

  useEffect(() => {
    const script = document.querySelector('#schema-markup-product');
    if (!script) return;
    script.innerHTML = JSON.stringify(productSchemaMarkup);
  }, [pageUrl]);

  return (
    <>
      <Script
        id="schema-markup-product-breadcrumb"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org/',
            '@type': 'BreadcrumbList',
            itemListElement: [
              {
                '@type': 'ListItem',
                position: 1,
                name: siteTitle || '',
                item: origin || '',
              },
              {
                '@type': 'ListItem',
                position: 2,
                name: product.title || '',
                item: pageUrl,
              },
            ],
          }),
        }}
      />

      <Script
        id="schema-markup-product"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productSchemaMarkup),
        }}
      />
    </>
  );
}

ProductSchemaMarkup.displayName = 'ProductSchemaMarkup';
