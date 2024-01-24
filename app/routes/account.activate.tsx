import {MetaArgs} from '@shopify/remix-oxygen';

import {Activate, GuestAccountLayout} from '~/components';

export const meta = ({data}: MetaArgs) => {
  const siteTitle = data?.ENV?.PUBLIC_SITE_TITLE;
  return [
    {
      title: `Activate${siteTitle ? ` | ${siteTitle}` : ''}`,
    },
  ];
};

export default function ActivateRoute() {
  return (
    <GuestAccountLayout>
      <Activate />
    </GuestAccountLayout>
  );
}

ActivateRoute.displayName = 'ActivateRoute';
