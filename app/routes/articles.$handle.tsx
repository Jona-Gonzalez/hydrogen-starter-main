import {useMemo} from 'react';
import {useLoaderData} from '@remix-run/react';
import {defer, LoaderFunctionArgs, MetaArgs} from '@shopify/remix-oxygen';
import {AnalyticsPageType} from '@shopify/hydrogen';
import {RenderSections} from '@pack/react';

import {ARTICLE_QUERY} from '~/lib/queries';
import {ArticleSchemaMarkup} from '~/components';

export function meta({data}: MetaArgs) {
  return [
    {title: data?.article?.title ?? 'Pack Hydrogen Demo'},
    {description: data?.article?.description},
  ];
}

export async function loader({params, context, request}: LoaderFunctionArgs) {
  const {handle} = params;
  const {data} = await context.pack.query<any>(ARTICLE_QUERY, {
    variables: {handle},
  });

  const analytics = {pageType: AnalyticsPageType.article};

  if (!data.article) {
    throw new Response(null, {status: 404});
  }

  return defer({
    analytics,
    article: data.article,
    siteTitle: context.env.PUBLIC_SITE_TITLE,
    url: request.url,
  });
}

export default function ArticleRoute() {
  const {article, siteTitle, url} = useLoaderData<typeof loader>();

  const date = useMemo(() => {
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    return new Date(
      article.publishedAt || article.createdAt,
    ).toLocaleDateString('en-US', options);
  }, [article.createdAt, article.publishedAt]);

  return (
    <div className="py-contained" data-comp={ArticleRoute.displayName}>
      <section
        className="px-contained mb-8 flex flex-col items-center gap-3 text-center md:mb-10"
        data-comp="article-header"
      >
        <p className="text-sm md:text-base">
          {article.author ? `${article.author} | ` : ''}
          {date}
        </p>

        <h1 className="text-title-h2 max-w-[60rem]">{article.title}</h1>

        {article.category && (
          <p className="btn-text flex h-8 items-center justify-center rounded-full bg-lightGray px-4 text-text">
            {article.category}
          </p>
        )}
      </section>

      <RenderSections content={article} />

      <ArticleSchemaMarkup article={article} siteTitle={siteTitle} url={url} />
    </div>
  );
}

ArticleRoute.displayName = 'ArticleRoute';
