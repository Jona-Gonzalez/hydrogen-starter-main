import {LoaderFunctionArgs} from '@shopify/remix-oxygen';

import {} from '~/lib/queries';

const renderXML = (slugs: {slug?: string}[]) => {
  const url = 'https://hydrogen-starter-8a95933599cb5240ec76.o2.myshopify.dev';

  const sourceXML = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${slugs.filter(Boolean).map(
      (item) => `<url>
      <loc>${url}/${item.slug}</loc>
    </url>`,
    )}
  </urlset>`;

  return sourceXML;
};

export async function loader({request, context}: LoaderFunctionArgs) {
  // const slugs = await context.storefront.query(SLUGS_QUERY);
  const slugs = [];

  return [
    new Response(renderXML(slugs), {
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'x-content-type-options': 'nosniff',
        'Cache-Control': `public, max-age=${60 * 10}, s-maxage=${60 * 60 * 24}`,
      },
    }),
  ];
}

export default function SiteMap() {
  return null;
}

SiteMap.displayName = 'SiteMap';
