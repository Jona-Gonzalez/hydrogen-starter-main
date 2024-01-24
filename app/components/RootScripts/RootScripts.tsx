import {Script} from '@shopify/hydrogen';
import {useLoaderData} from '@remix-run/react';

export function RootScripts() {
  const data = useLoaderData<any>();
  const ENV = data?.ENV;

  return (
    <>
      <Script
        dangerouslySetInnerHTML={{
          __html: `window.ENV = ${JSON.stringify(ENV)}`,
        }}
      />

      {ENV?.GTM_CONTAINER_ID && (
        <Script
          id="gtm-script"
          type="text/javascript"
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer', '${ENV.GTM_CONTAINER_ID}');`,
          }}
        />
      )}

      {/* other scripts */}
    </>
  );
}

RootScripts.displayName = 'RootScripts';
