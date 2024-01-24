import {useEffect, useMemo, useState} from 'react';
import {useLoaderData} from '@remix-run/react';
import {defer, LoaderFunctionArgs, MetaArgs} from '@shopify/remix-oxygen';
import {AnalyticsPageType} from '@shopify/hydrogen';
import {RenderSections} from '@pack/react';

import {Collection, CollectionSchemaMarkup} from '~/components';
import {COLLECTION_QUERY, COLLECTION_PAGE_QUERY} from '~/lib/queries';

const seo = ({data}: any) => {
  return {
    title: data?.collection?.title,
    description: data?.collection?.description.substr(0, 154),
  };
};

export const handle = {
  seo,
};

export function meta({data}: MetaArgs) {
  return [
    {title: data?.collection?.title ?? 'Pack Hydrogen Demo'},
    {description: data?.collection?.description},
  ];
}

export async function loader({params, context, request}: LoaderFunctionArgs) {
  const {handle} = params;
  const searchParams = new URL(request.url).searchParams;
  const cursor = searchParams.get('cursor');

  const pageData = await context.pack.query(COLLECTION_PAGE_QUERY, {
    variables: {handle},
  });

  // Handle 404s
  if (!pageData.data.collectionPage) {
    throw new Response(null, {status: 404});
  }

  const {collection: resolveFirstCollection} = await context.storefront.query(
    COLLECTION_QUERY,
    {
      variables: {
        first: parseInt(context.env.COLLECTIONS_RESOLVE_FIRST || '12', 10),
        handle,
        cursor,
      },
    },
  );

  const getFullCollection: any = async ({collection, cursor}: any) => {
    const {collection: queriedCollection} = await context.storefront.query(
      COLLECTION_QUERY,
      {
        variables: {
          first: 250,
          handle,
          cursor,
        },
      },
    );
    const {endCursor, hasNextPage} = queriedCollection.products.pageInfo;
    const compiledCollection = {
      ...queriedCollection,
      products: {
        nodes: [
          ...(collection?.products?.nodes || []),
          ...queriedCollection.products.nodes,
        ],
        pageInfo: {endCursor, hasNextPage},
      },
    };
    if (hasNextPage) {
      return getFullCollection({
        collection: compiledCollection,
        cursor: endCursor,
      });
    }
    return compiledCollection;
  };
  const fullCollectionPromise = getFullCollection({
    collection: null,
    cursor: null,
  });
  const analytics = {
    pageType: AnalyticsPageType.collection,
    handle,
    resourceId: resolveFirstCollection.id,
  };

  return defer({
    analytics,
    collectionPage: pageData.data.collectionPage,
    fullCollectionPromise,
    resolveFirstCollection,
    siteTitle: context.env.PUBLIC_SITE_TITLE,
    url: request.url,
  });
}

export default function CollectionRoute() {
  const {
    collectionPage,
    fullCollectionPromise,
    resolveFirstCollection,
    siteTitle,
    url,
  } = useLoaderData<typeof loader>();

  const [collection, setCollection] = useState(resolveFirstCollection);
  const [allProductsLoaded, setAllProductsLoaded] = useState(false);

  // determines if default collection heading should be shown
  const hasVisibleHeroSection = useMemo(() => {
    if (!collectionPage) return false;
    const HERO_KEYS = ['hero', 'collection-hero'];
    return collectionPage.sections.nodes.some(({data}: any) => {
      return HERO_KEYS.includes(data?._template);
    });
  }, [collectionPage]);

  useEffect(() => {
    const loadFullCollection = async () => {
      try {
        const fullCollection = await fullCollectionPromise;
        setCollection((_collection: any) => ({
          ..._collection,
          products: {
            nodes: [
              ...new Set([
                ..._collection.products.nodes,
                ...fullCollection.products.nodes,
              ]),
            ],
          },
        }));
        setAllProductsLoaded(true);
      } catch (error: any) {
        console.error(error.message);
      }
    };
    loadFullCollection();
  }, [fullCollectionPromise]);

  return (
    <div data-comp={CollectionRoute.displayName}>
      {collectionPage && <RenderSections content={collectionPage} />}

      <section data-comp="collection">
        <Collection
          allProductsLoaded={allProductsLoaded}
          collection={collection}
          showHeading={!hasVisibleHeroSection}
        />
      </section>

      <CollectionSchemaMarkup
        collection={collection}
        siteTitle={siteTitle}
        url={url}
      />
    </div>
  );
}

CollectionRoute.displayName = 'CollectionRoute';
