import {ActionFunctionArgs, json, MetaArgs} from '@shopify/remix-oxygen';

import {GuestAccountLayout, Register} from '~/components';
import {
  customerLoginRegisterAction,
  useLoginRegisterFetcher,
} from '~/lib/customer';

export const meta = ({data}: MetaArgs) => {
  const siteTitle = data?.ENV?.PUBLIC_SITE_TITLE;
  return [
    {
      title: `Register${siteTitle ? ` | ${siteTitle}` : ''}`,
    },
  ];
};

export async function action({request, context}: ActionFunctionArgs) {
  const actionData = await customerLoginRegisterAction({request, context});
  return json(actionData);
}

export default function RegisterRoute() {
  const {fetcher, loginErrors, registerErrors} = useLoginRegisterFetcher();

  return (
    <GuestAccountLayout>
      <Register
        fetcher={fetcher}
        loginErrors={loginErrors}
        registerErrors={registerErrors}
      />
    </GuestAccountLayout>
  );
}

RegisterRoute.displayName = 'RegisterRoute';
