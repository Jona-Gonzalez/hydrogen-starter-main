import {useEffect, useMemo} from 'react';
import {Script} from '@shopify/hydrogen';

export function CollectionSchemaMarkup({
  collection = {},
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

  const collectionSchemaMarkup = useMemo(() => {
    return {
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
          name: collection.title || '',
          item: pageUrl || '',
        },
      ],
    };
  }, [collection.title, pageUrl, siteTitle]);

  useEffect(() => {
    const script = document.querySelector(
      '#schema-markup-collection-breadcrumb',
    );
    if (!script) return;
    const collectionSchemaMarkupJSON = JSON.stringify(collectionSchemaMarkup);
    if (JSON.stringify(script.innerHTML) !== collectionSchemaMarkupJSON) {
      script.innerHTML = collectionSchemaMarkupJSON;
    }
  }, [pageUrl]);

  return (
    <Script
      id="schema-markup-collection-breadcrumb"
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(collectionSchemaMarkup),
      }}
    />
  );
}

CollectionSchemaMarkup.displayName = 'CollectionSchemaMarkup';
