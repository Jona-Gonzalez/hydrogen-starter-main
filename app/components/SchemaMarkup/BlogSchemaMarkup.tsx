import {useEffect, useMemo} from 'react';
import {Script} from '@shopify/hydrogen';

export function BlogSchemaMarkup({blog = {}, siteTitle, url: requestUrl}: any) {
  const {origin, pathname} = useMemo<any>(() => {
    try {
      return new URL(requestUrl);
    } catch (error) {
      return {};
    }
  }, [requestUrl]);
  const pageUrl = origin ? `${origin}${pathname}` : '';

  const blogSchemaMarkup = useMemo(() => {
    // Ensure correct logo path; if no logo, add one to public/images
    const logo = origin ? `${origin}/images/logo.png` : '';
    return {
      '@context': 'https://schema.org',
      '@type': 'Blog',
      '@id': pageUrl,
      mainEntityOfPage: pageUrl,
      name: blog.seo?.title || '',
      description: blog.seo?.description || '',
      publisher: {
        '@type': 'Organization',
        '@id': origin || '',
        name: siteTitle || '',
        logo: {
          '@type': 'ImageObject',
          '@id': logo,
          url: logo,
        },
      },
    };
  }, [blog, pageUrl, siteTitle]);

  useEffect(() => {
    const script = document.querySelector('#schema-markup-blog');
    if (!script) return;
    const blogSchemaMarkupJSON = JSON.stringify(blogSchemaMarkup);
    if (JSON.stringify(script.innerHTML) !== blogSchemaMarkupJSON) {
      script.innerHTML = blogSchemaMarkupJSON;
    }
  }, [pageUrl]);

  return (
    <Script
      id="schema-markup-blog"
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(blogSchemaMarkup),
      }}
    />
  );
}

BlogSchemaMarkup.displayName = 'BlogSchemaMarkup';
