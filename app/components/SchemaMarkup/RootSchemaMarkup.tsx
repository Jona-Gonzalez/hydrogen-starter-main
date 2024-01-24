import {useEffect, useMemo} from 'react';
import {Script} from '@shopify/hydrogen';
import {useLoaderData} from '@remix-run/react';

export function RootSchemaMarkup() {
  const {ENV, url: requestUrl} = useLoaderData<{ENV: any; url: string}>();
  const siteTitle = ENV.PUBLIC_SITE_TITLE;
  const {origin, pathname} = useMemo<any>(() => {
    try {
      return new URL(requestUrl);
    } catch (error) {
      return {};
    }
  }, [requestUrl]);
  const pageUrl = origin ? `${origin}${pathname}` : '';

  const mainSchemaMarkup = useMemo(() => {
    // Ensure correct logo path; if no logo, add one to public/images
    const logo = origin ? `${origin}/images/logo.png` : '';
    return {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: siteTitle || '',
      url: pageUrl,
      logo,
    };
  }, [pageUrl, siteTitle]);

  useEffect(() => {
    const script = document.querySelector('#schema-markup-org');
    if (!script) return;
    const mainSchemaMarkupJSON = JSON.stringify(mainSchemaMarkup);
    if (JSON.stringify(script.innerHTML) !== mainSchemaMarkupJSON) {
      script.innerHTML = mainSchemaMarkupJSON;
    }
  }, [pageUrl]);

  return (
    <Script
      id="schema-markup-org"
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(mainSchemaMarkup),
      }}
    />
  );
}

RootSchemaMarkup.displayName = 'RootSchemaMarkup';
