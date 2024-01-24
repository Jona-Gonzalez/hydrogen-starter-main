import {ActionFunctionArgs, json, MetaArgs} from '@shopify/remix-oxygen';

import {CustomerAccountLayout, Orders} from '~/components';
import {customerOrdersAction} from '~/lib/customer';

export const meta = ({data, location}: MetaArgs) => {
  const {siteSettings}: any = data;
  const siteTitle = data.ENV?.PUBLIC_SITE_TITLE;
  const activeMenuItem = siteSettings?.settings?.account?.menu?.menuItems?.find(
    ({link}) => {
      return location.pathname.startsWith(link?.url);
    },
  );
  if (activeMenuItem?.link?.text) {
    return [
      {
        title: `${activeMenuItem.link.text}${
          siteTitle ? ` | ${siteTitle}` : ''
        }`,
      },
    ];
  }
};

export async function action({request, context}: ActionFunctionArgs) {
  const customerData = await customerOrdersAction({request, context});
  return json(customerData);
}

export default function OrdersRoute() {
  return (
    <CustomerAccountLayout>
      <Orders />
    </CustomerAccountLayout>
  );
}

OrdersRoute.displayName = 'OrdersRoute';
