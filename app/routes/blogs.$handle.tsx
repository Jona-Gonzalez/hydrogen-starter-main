import {useLoaderData} from '@remix-run/react';
import {defer, LoaderFunctionArgs, MetaArgs} from '@shopify/remix-oxygen';
import {AnalyticsPageType} from '@shopify/hydrogen';
import {RenderSections} from '@pack/react';

import {BLOG_QUERY} from '~/lib/queries';
import {BlogSchemaMarkup} from '~/components';

export function meta({data}: MetaArgs) {
  return [
    {title: data?.blog?.title ?? 'Pack Hydrogen Demo'},
    {description: data?.blog?.description},
  ];
}

export async function loader({params, context, request}: LoaderFunctionArgs) {
  const {handle} = params;
  const {data} = await context.pack.query(BLOG_QUERY, {variables: {handle}});
  const analytics = {pageType: AnalyticsPageType.blog};

  if (!data.blog) {
    throw new Response(null, {status: 404});
  }

  return defer({
    analytics,
    blog: data.blog,
    siteTitle: context.env.PUBLIC_SITE_TITLE,
    url: request.url,
  });
}

export default function BlogRoute() {
  const {blog, siteTitle, url} = useLoaderData<typeof loader>();

  return (
    <div data-comp={BlogRoute.displayName}>
      <RenderSections content={blog} />

      <BlogSchemaMarkup blog={blog} siteTitle={siteTitle} url={url} />
    </div>
  );
}

BlogRoute.displayName = 'BlogRoute';
