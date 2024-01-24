import {useEffect, useMemo} from 'react';
import {Script} from '@shopify/hydrogen';

export function ArticleSchemaMarkup({
  article = {},
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

  const articleSchemaMarkup = useMemo(() => {
    // Ensure correct logo path; if no logo, add one to public/images
    const logo = origin ? `${origin}/images/logo.png` : '';
    return {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      '@id': pageUrl,
      mainEntityOfPage: pageUrl,
      headline: article.seo?.title || '',
      name: article.seo?.title || '',
      description: article.seo?.description || '',
      datePublished: article.publishedAt || '',
      dateModified: article.createdAt || '',
      author: [
        {
          '@type': 'Person',
          name: article.author || '',
        },
      ],
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
      image: {
        '@type': 'ImageObject',
        '@id': article.seo?.image || '',
        url: article.seo?.image || '',
      },
      url: pageUrl,
      isPartOf: {
        '@type': 'Blog',
        '@id': `${origin}/blogs/${article.blog?.handle}`,
        name: article.blog?.title,
        publisher: {
          '@type': 'Organization',
          '@id': origin || '',
          name: siteTitle || '',
        },
      },
    };
  }, [article, pageUrl, siteTitle]);

  useEffect(() => {
    const script = document.querySelector('#schema-markup-article');
    if (!script) return;
    const articleSchemaMarkupJSON = JSON.stringify(articleSchemaMarkup);
    if (JSON.stringify(script.innerHTML) !== articleSchemaMarkupJSON) {
      script.innerHTML = articleSchemaMarkupJSON;
    }
  }, [pageUrl]);

  return (
    <Script
      id="schema-markup-article"
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(articleSchemaMarkup),
      }}
    />
  );
}

ArticleSchemaMarkup.displayName = 'ArticleSchemaMarkup';
