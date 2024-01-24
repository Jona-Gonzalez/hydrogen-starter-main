import {MetaArgs} from '@shopify/remix-oxygen';

import {CustomerAccountLayout, Order} from '~/components';

export const meta = ({data, location}: MetaArgs) => {
  const {siteSettings} = data;
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

export default function OrderRoute() {
  return (
    <CustomerAccountLayout>
      <Order />
    </CustomerAccountLayout>
  );
}

OrderRoute.displayName = 'OrderRoute';
