import {useMemo} from 'react';
import {
  AnalyticsEventName,
  getClientBrowserParameters,
  sendShopifyAnalytics,
  useShopifyCookies,
} from '@shopify/hydrogen-react';
import {useSiteSettings} from '@pack/react';
import {useLoaderData} from '@remix-run/react';

import {DEFAULT_LOCALE} from '~/lib/constants';
import {useCurrencyCode} from '~/hooks';
import {useAnalyticsAddToCart} from './useAnalyticsAddToCart';
import {useAnalyticsPageView} from './useAnalyticsPageView';

const DEBUG = true;

const sendShopifyAnalyticsEvent = async (
  analyticsPageData: any,
  eventName: string,
  callback?: any,
) => {
  try {
    const _AnalyticsEventName: any = AnalyticsEventName;
    if (!_AnalyticsEventName[eventName]) return;
    const payload = {
      ...getClientBrowserParameters(),
      ...analyticsPageData,
    };
    const event = {
      eventName: _AnalyticsEventName[eventName],
      payload,
    };

    await sendShopifyAnalytics(event);
    if (typeof callback === 'function') callback(event);
    if (DEBUG) console.log('sendShopifyAnalytics:event', event);
  } catch (error: any) {
    console.error('sendShopifyAnalyticsEvent:error', error.message);
  }
};

const hasUserConsent = true;

export function Analytics() {
  const {analytics, collection, product} = useLoaderData<any>();
  const currencyCode = useCurrencyCode();
  const siteSettings = useSiteSettings();
  const {enabled}: {enabled: boolean} = {...siteSettings?.settings?.analytics};

  const customer: any = null;
  const customerPending = false;

  const basePayload = useMemo(() => {
    if (!analytics || customerPending || !enabled) return undefined;

    return {
      ...analytics,
      hasUserConsent,
      currency: currencyCode || DEFAULT_LOCALE.currency,
      acceptedLanguage: DEFAULT_LOCALE.language,
      ...(customer ? {customerId: customer.id} : null),
    };
  }, [analytics, currencyCode, customer, enabled, hasUserConsent]);

  useShopifyCookies({hasUserConsent: hasUserConsent && !!enabled});

  useAnalyticsPageView({
    basePayload,
    collection,
    product,
    sendShopifyAnalyticsEvent,
  });

  useAnalyticsAddToCart({
    basePayload,
    sendShopifyAnalyticsEvent,
  });

  return null;
}

Analytics.displayName = 'Analytics';
