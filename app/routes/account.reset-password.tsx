import {MetaArgs} from '@shopify/remix-oxygen';

import {GuestAccountLayout, ResetPassword} from '~/components';

export const meta = ({data}: MetaArgs) => {
  const siteTitle = data?.ENV?.PUBLIC_SITE_TITLE;
  return [
    {
      title: `Reset Password${siteTitle ? ` | ${siteTitle}` : ''}`,
    },
  ];
};
export default function ResetPasswordRoute() {
  return (
    <GuestAccountLayout>
      <ResetPassword />
    </GuestAccountLayout>
  );
}

ResetPasswordRoute.displayName = 'ResetPasswordRoute';
