import {useLoaderData} from '@remix-run/react';
import {defer, LoaderFunctionArgs, MetaArgs} from '@shopify/remix-oxygen';
import {AnalyticsPageType} from '@shopify/hydrogen';
import {RenderSections} from '@pack/react';

import {HOME_PAGE_QUERY} from '~/lib/queries';

export function meta({data}: MetaArgs) {
  return [
    {title: data?.page?.title ?? 'Pack Hydrogen Demo'},
    {description: data?.page?.description},
  ];
}

export async function loader({context}: LoaderFunctionArgs) {
  const {data} = await context.pack.query(HOME_PAGE_QUERY);
  const analytics = {pageType: AnalyticsPageType.home};

  return defer({
    page: data.page,
    analytics,
  });
}

export default function Index() {
  const {page} = useLoaderData<typeof loader>();

  return <RenderSections content={page} />;
}
