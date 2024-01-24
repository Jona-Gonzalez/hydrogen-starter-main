import {useLoaderData} from '@remix-run/react';
import {defer, LoaderFunctionArgs, MetaArgs} from '@shopify/remix-oxygen';

export function meta({data}: MetaArgs) {
  return [];
}

export async function loader({params, context}: LoaderFunctionArgs) {
  //
  return defer({});
}

export default function FourZeroFour() {
  // const {} = useLoaderData<typeof loader>();

  return (
    <div>
      <h1>404</h1>
    </div>
  );
}
