import {defer, LoaderFunctionArgs, MetaArgs} from '@shopify/remix-oxygen';
import {useLoaderData} from '@remix-run/react';
import {AnalyticsPageType} from '@shopify/hydrogen';
import {RenderSections} from '@pack/react';

import {PAGE_QUERY} from '~/lib/queries';

export function meta({data}: MetaArgs) {
  return [
    {title: data?.page?.title ?? 'Pack Hydrogen Demo'},
    {description: data?.page?.description},
  ];
}

export async function loader({params, context}: LoaderFunctionArgs) {
  const {handle} = params;
  const {data} = await context.pack.query(PAGE_QUERY, {
    variables: {handle},
  });
  const analytics = {pageType: AnalyticsPageType.page};

  if (!data.page) {
    throw new Response(null, {status: 404, statusText: 'Not found'});
  }

  return defer({page: data.page, analytics});
}

export default function PageRoute() {
  const {page} = useLoaderData<typeof loader>();

  return (
    <div data-comp={PageRoute.displayName}>
      <RenderSections content={page} />
    </div>
  );
}

PageRoute.displayName = 'PageRoute';
