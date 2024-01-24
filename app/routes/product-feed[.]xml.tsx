import {LoaderFunctionArgs} from '@shopify/remix-oxygen';

import {} from '~/lib/queries';

export async function loader({request, context}: LoaderFunctionArgs) {
  return {};
}

export default function ProductFeed() {
  return null;
}

ProductFeed.displayName = 'ProductFeed';
