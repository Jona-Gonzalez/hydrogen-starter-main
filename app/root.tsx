import {
  isRouteErrorResponse,
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useMatches,
  useRouteError,
} from '@remix-run/react';
import {Seo, ShopifySalesChannel} from '@shopify/hydrogen';
import {CartProvider, ShopifyProvider} from '@shopify/hydrogen-react';
import {
  ActionFunctionArgs,
  defer,
  json,
  LoaderFunctionArgs,
} from '@shopify/remix-oxygen';
import {PreviewProvider} from '@pack/react';

import favicon from '../public/favicon.svg';
import styles from '~/styles/app.css';

import {
  CustomerContextProvider,
  GlobalContextProvider,
  ProductsContextProvider,
} from '~/contexts';
import {customerGetAction} from '~/lib/customer';
import {DEFAULT_LOCALE} from '~/lib/constants';
import {
  CART_FRAGMENT,
  COLLECTION_MINI_QUERY,
  LAYOUT_QUERY,
  PRODUCT_GROUPINGS_QUERY,
  PRODUCT_MINI_QUERY,
  PRODUCTS_QUERY,
  SITE_SETTINGS_QUERY,
} from '~/lib/queries';

import {
  Analytics,
  Customer,
  DataLayer,
  GenericError,
  Layout,
  NotFound,
  RootSchemaMarkup,
  RootScripts,
} from '~/components';

import {registerSections} from '~/sections';
import {registerStorefrontSettings} from '~/settings';

registerSections();
registerStorefrontSettings();

export const links = () => {
  return [
    {rel: 'stylesheet', href: styles},
    {
      rel: 'preconnect',
      href: 'https://cdn.shopify.com',
    },
    {
      rel: 'preconnect',
      href: 'https://shop.app',
    },
    {rel: 'icon', type: 'image/svg+xml', href: favicon},
  ];
};

export async function action({request, context}: ActionFunctionArgs) {
  const customerData = await customerGetAction({request, context});
  return json(customerData);
}

export async function loader({context, request}: LoaderFunctionArgs) {
  const isPreviewModeEnabled = context.pack.isPreviewModeEnabled();

  const siteSettings = await context.pack.query(SITE_SETTINGS_QUERY);
  const layout = await context.storefront.query(LAYOUT_QUERY);
  const groupingsData = await context.pack.query(PRODUCT_GROUPINGS_QUERY, {
    variables: {first: 100},
  });

  const url = new URL(request.url);

  let product = undefined;
  if (url.pathname.startsWith('/products')) {
    const handle = url.pathname.split('/').pop();
    const {product: queriedProduct} = await context.storefront.query(
      PRODUCT_MINI_QUERY,
      {variables: {handle}},
    );
    product = queriedProduct;
  }

  let collection = undefined;
  if (url.pathname.startsWith('/collections')) {
    const handle = url.pathname.split('/').pop();
    const {collection: queriedCollection} = await context.storefront.query(
      COLLECTION_MINI_QUERY,
      {variables: {handle}},
    );
    collection = queriedCollection;
  }

  const getAllProducts: any = async ({
    products,
    cursor,
  }: {
    products: any[];
    cursor: string;
  }) => {
    const {products: queriedProducts} = await context.storefront.query(
      PRODUCTS_QUERY,
      {
        variables: {
          first: 250,
          cursor,
        },
      },
    );
    const {endCursor, hasNextPage} = queriedProducts.pageInfo;
    const compiledProducts = [...(products || []), ...queriedProducts.nodes];
    if (hasNextPage) {
      return getAllProducts({
        products: compiledProducts,
        cursor: endCursor,
      });
    }
    return compiledProducts;
  };
  const productsPromise = getAllProducts({
    products: null,
    cursor: null,
  });

  const analytics = {
    shopifySalesChannel: ShopifySalesChannel.hydrogen,
    shopId: layout.shop.id,
  };
  const ENV = Object.entries(context.env).reduce((acc: any, [key, value]) => {
    if (key.startsWith('PUBLIC_')) acc[key] = value;
    return acc;
  }, {});

  return defer({
    analytics,
    collection,
    ENV,
    groupings: groupingsData.data.groups.edges,
    isPreviewModeEnabled,
    layout,
    product,
    productsPromise,
    siteSettings,
    url: request.url,
  });
}

export function meta() {
  return [];
}

export default function App() {
  const {ENV, groupings, isPreviewModeEnabled, productsPromise, siteSettings} =
    useLoaderData<typeof loader>();

  return (
    <ShopifyProvider
      storeDomain={`https://${ENV.PUBLIC_STORE_DOMAIN}`}
      storefrontToken={ENV.PUBLIC_STOREFRONT_API_TOKEN}
      storefrontApiVersion={ENV.PUBLIC_STOREFRONT_API_VERSION}
      countryIsoCode={DEFAULT_LOCALE.country}
      languageIsoCode={DEFAULT_LOCALE.language}
    >
      <CartProvider cartFragment={CART_FRAGMENT}>
        <GlobalContextProvider>
          <CustomerContextProvider>
            <ProductsContextProvider
              productsPromise={productsPromise}
              groupings={groupings}
            >
              <html lang="en">
                <head>
                  <meta charSet="utf-8" />
                  <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                  />
                  <Seo />
                  <Meta />
                  <Links />
                </head>

                <body>
                  <PreviewProvider
                    isPreviewModeEnabled={isPreviewModeEnabled}
                    siteSettings={siteSettings}
                  >
                    <Layout>
                      <Outlet />
                    </Layout>
                  </PreviewProvider>
                  <LiveReload />
                  <ScrollRestoration />
                  <Customer />
                  <Analytics />
                  {/*for Elevar integration use DataLayerWithElevar instead*/}
                  <DataLayer />
                  <RootSchemaMarkup />
                  <RootScripts />
                  <Scripts />
                </body>
              </html>
            </ProductsContextProvider>
          </CustomerContextProvider>
        </GlobalContextProvider>
      </CartProvider>
    </ShopifyProvider>
  );
}

export function ErrorBoundary({error}: {error: Error}) {
  const loaderData = useLoaderData<typeof loader>();
  const {ENV, groupings, isPreviewModeEnabled, productsPromise, siteSettings} =
    {...loaderData};
  const [root] = useMatches();
  const locale = root?.data?.selectedLocale ?? DEFAULT_LOCALE;
  const routeError: any = useRouteError();
  const isRouteError = isRouteErrorResponse(routeError);

  let title = 'Error';
  let pageType = 'page';

  if (isRouteError) {
    title = 'Not found';
    if (routeError.status === 404) pageType = routeError.data || pageType;
  }

  if (routeError.status === 404) {
    return <NotFound type={pageType} />;
  }

  return (
    <ShopifyProvider
      storeDomain={`https://${ENV?.PUBLIC_STORE_DOMAIN}`}
      storefrontToken={ENV?.PUBLIC_STOREFRONT_API_TOKEN}
      storefrontApiVersion={ENV?.PUBLIC_STOREFRONT_API_VERSION}
      countryIsoCode={DEFAULT_LOCALE.country}
      languageIsoCode={DEFAULT_LOCALE.language}
    >
      <CartProvider cartFragment={CART_FRAGMENT}>
        <GlobalContextProvider>
          <CustomerContextProvider>
            <ProductsContextProvider
              productsPromise={productsPromise}
              groupings={groupings}
            >
              <html lang={locale.language}>
                <head>
                  <meta charSet="utf-8" />
                  <meta
                    name="viewport"
                    content="width=device-width,initial-scale=1"
                  />
                  <title>{title}</title>
                  <Meta />
                  <Links />
                </head>
                <body>
                  <PreviewProvider
                    isPreviewModeEnabled={isPreviewModeEnabled}
                    siteSettings={siteSettings}
                  >
                    <Layout key={`${locale.language}-${locale.country}`}>
                      {isRouteError ? (
                        <>
                          {routeError.status === 404 ? (
                            <NotFound type={pageType} />
                          ) : (
                            <GenericError
                              error={{
                                message: `${routeError.status} ${routeError.data}`,
                              }}
                            />
                          )}
                        </>
                      ) : (
                        <GenericError
                          error={error instanceof Error ? error : undefined}
                        />
                      )}
                    </Layout>
                  </PreviewProvider>
                  <LiveReload />
                  <ScrollRestoration />
                  <RootScripts />
                  <Scripts />
                </body>
              </html>
            </ProductsContextProvider>
          </CustomerContextProvider>
        </GlobalContextProvider>
      </CartProvider>
    </ShopifyProvider>
  );
}
