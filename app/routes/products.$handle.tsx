import {useLoaderData} from '@remix-run/react';
import {ProductProvider} from '@shopify/hydrogen-react';
import {defer, LoaderFunctionArgs, MetaArgs} from '@shopify/remix-oxygen';
import {AnalyticsPageType, ShopifyAnalyticsProduct} from '@shopify/hydrogen';
import {RenderSections} from '@pack/react';

import {formatGroupingWithOptions} from '~/lib/utils';
import {
  GROUPING_PRODUCT_QUERY,
  PRODUCT_GROUPINGS_QUERY,
  PRODUCT_PAGE_QUERY,
  PRODUCT_QUERY,
} from '~/lib/queries';
import {Product, ProductSchemaMarkup} from '~/components';

export function meta({data}: MetaArgs) {
  return [
    {title: data?.product?.title ?? 'Pack Hydrogen Demo'},
    {description: data?.product?.description},
  ];
}

export async function loader({params, context, request}: LoaderFunctionArgs) {
  const {handle} = params;
  const storeDomain = context.storefront.getShopifyDomain();
  const isPreview = context.pack.isPreviewModeEnabled();

  const searchParams = new URL(request.url).searchParams;
  const selectedOptions: any = [];

  // set selected options from the query string
  searchParams.forEach((value, name) => {
    selectedOptions.push({name, value});
  });

  const pageData = await context.pack.query(PRODUCT_PAGE_QUERY, {
    variables: {handle},
  });

  if (!pageData.data.productPage) {
    throw new Response(null, {status: 404});
  }

  const {product: queriedProduct} = await context.storefront.query(
    PRODUCT_QUERY,
    {
      variables: {
        handle,
        selectedOptions,
      },
    },
  );

  const groupingsData = await context.pack.query(PRODUCT_GROUPINGS_QUERY, {
    variables: {first: 100},
  });

  let grouping = groupingsData.data.groups.edges.find(({node}) => {
    const groupingProducts = [
      ...node.products,
      ...node.subgroups.flatMap(({products}) => products),
    ];
    return groupingProducts.some(
      (groupProduct) => groupProduct.handle === handle,
    );
  })?.node;

  if (grouping) {
    const productsToQuery = [
      ...grouping.products,
      ...grouping.subgroups.flatMap(({products}) => products),
    ];
    const groupingProductsPromises = productsToQuery.map(async (product) => {
      if (product.handle === handle) return null;
      const data = await context.storefront.query(GROUPING_PRODUCT_QUERY, {
        variables: {
          handle: product.handle,
        },
      });
      return data.product;
    });

    let groupingProducts = await Promise.all(groupingProductsPromises);
    groupingProducts = groupingProducts.filter(Boolean);

    const groupingProductsByHandle = groupingProducts.reduce((acc, product) => {
      acc[product.handle] = product;
      return acc;
    }, {});
    groupingProductsByHandle[queriedProduct.handle] = queriedProduct;

    const groupingWithOptions = formatGroupingWithOptions({
      grouping,
      getProductByHandle: (handle) => groupingProductsByHandle[handle],
    });

    delete groupingProductsByHandle[queriedProduct.handle];

    grouping = {
      ...groupingWithOptions,
      productsMap: groupingProductsByHandle,
    };
  }

  const product = {
    ...queriedProduct,
    ...(grouping?.products.length || grouping?.subgroups.length
      ? {grouping, isGrouped: true}
      : null),
  };

  // optionally set a default variant, so you always have an "orderable" product selected
  const selectedVariant = product.selectedVariant ?? product.variants?.nodes[0];

  delete product.selectedVariant;

  const productAnalytics: ShopifyAnalyticsProduct = {
    productGid: product.id,
    variantGid: selectedVariant.id,
    name: product.title,
    variantName: selectedVariant.title,
    brand: product.vendor,
    price: selectedVariant.price.amount,
  };
  const analytics = {
    pageType: AnalyticsPageType.product,
    resourceId: product.id,
    products: [productAnalytics],
    totalValue: parseFloat(selectedVariant.price.amount),
  };

  return defer({
    analytics,
    product,
    productPage: pageData.data.productPage,
    selectedVariant,
    siteTitle: context.env.PUBLIC_SITE_TITLE,
    storeDomain,
    url: request.url,
  });
}

export default function ProductRoute() {
  const {product, productPage, selectedVariant, siteTitle, url} =
    useLoaderData<typeof loader>();

  return (
    <ProductProvider
      data={product}
      initialVariantId={selectedVariant?.id || null}
    >
      <div data-comp={ProductRoute.displayName}>
        <Product product={product} />

        <RenderSections content={productPage} />

        <ProductSchemaMarkup
          product={product}
          siteTitle={siteTitle}
          url={url}
        />
      </div>
    </ProductProvider>
  );
}

ProductRoute.displayName = 'ProductRoute';
