import {ActionFunctionArgs, json, MetaArgs} from '@shopify/remix-oxygen';

import {GuestAccountLayout, Login} from '~/components';
import {
  customerLoginRegisterAction,
  useLoginRegisterFetcher,
} from '~/lib/customer';

export const meta = ({data}: MetaArgs) => {
  const siteTitle = data?.ENV?.PUBLIC_SITE_TITLE;
  return [
    {
      title: `Login${siteTitle ? ` | ${siteTitle}` : ''}`,
    },
  ];
};

export async function action({request, context}: ActionFunctionArgs) {
  const actionData = await customerLoginRegisterAction({request, context});
  return json(actionData);
}

export default function LoginRoute() {
  const {fetcher, loginErrors, registerErrors} = useLoginRegisterFetcher();

  return (
    <GuestAccountLayout>
      <Login
        fetcher={fetcher}
        loginErrors={loginErrors}
        registerErrors={registerErrors}
      />
    </GuestAccountLayout>
  );
}

LoginRoute.displayName = 'LoginRoute';
