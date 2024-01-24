import {Script} from '@shopify/hydrogen';
import {useLoaderData} from '@remix-run/react';

import {useCurrencyCode} from '~/hooks';
import {
  useDataLayerAccount,
  useDataLayerCart,
  useDataLayerCollection,
  useDataLayerCustomer,
  useDataLayerInit,
  useDataLayerProduct,
  useDataLayerSearch,
  useDataLayerSubscribe,
} from './hooks';

// Debug via Elevar's Data Layer Listener, add to the console:
// Turn on: window.ElevarDebugMode(true)
// Turn off: window.ElevarDebugMode(false)

// Envs to set:
// * PUBLIC_SITE_TITLE // provides backup brand name
// * PUBLIC_ELEVAR_SIGNING_KEY

const DEBUG = true; // local debugging (logs whether passed or failed with elevar)

// IMPORTANT: Elevar version 3.9.0+ required for this specific integration
// For integration for earlier versions, reference codebase of previous stater kit: https://app.gitbook.com/o/-MaVT_K8VIPo7BLBVUfs/s/Ppd8OcidzJxwuOIIChl2/developer-handbook/starter-kit

export function DataLayerWithElevar() {
  const {ENV} = useLoaderData<{ENV: any}>();
  const currencyCode = useCurrencyCode();

  const {generateUserProperties, userProperties} = useDataLayerInit({
    DEBUG,
  });

  const {userDataEvent, userDataEventTriggered} = useDataLayerCustomer({
    currencyCode,
    DEBUG,
    userProperties,
  });

  useDataLayerAccount({
    currencyCode,
    DEBUG,
    generateUserProperties,
    userDataEvent,
    userDataEventTriggered,
  });

  useDataLayerCart({
    currencyCode,
    DEBUG,
    userDataEvent,
    userDataEventTriggered,
    userProperties,
  });

  useDataLayerProduct({
    DEBUG,
    userDataEvent,
    userProperties,
  });

  useDataLayerCollection({
    DEBUG,
    userDataEvent,
    userDataEventTriggered,
    userProperties,
  });

  useDataLayerSearch({
    DEBUG,
    userDataEvent,
    userDataEventTriggered,
    userProperties,
  });

  useDataLayerSubscribe({
    DEBUG,
    userDataEventTriggered,
  });

  return ENV.PUBLIC_ELEVAR_SIGNING_KEY ? (
    <>
      {/* Non-Shopify Subdomains Source */}
      <Script type="module" id="elevar-script">
        {`try {
            const response = await fetch("${`https://shopify-gtm-suite.getelevar.com/configs/${ENV.PUBLIC_ELEVAR_SIGNING_KEY}/config.json`}");
            const config = await response.json();
            const scriptUrl = config.script_src_custom_pages;

            if (scriptUrl) {
              const { handler } = await import(scriptUrl);
              await handler(config);
            }
          } catch (error) {
            console.error("Elevar Error:", error);
        }`}
      </Script>
    </>
  ) : null;
}

DataLayerWithElevar.displayName = 'DataLayerWithElevar';
