import {ReactNode} from 'react';
import {useSiteSettings} from '@pack/react';

import {Cart, Footer, Header, Modal, Overlay, Search} from '~/components';
import {useSetViewportHeightCssVar} from '~/hooks';

export function Layout({children}: {children: ReactNode}) {
  useSetViewportHeightCssVar();
  const siteSettings = useSiteSettings();

  const {promobar}: any = {...siteSettings?.settings?.header};
  const promobarDisabled =
    !!promobar && (!promobar.enabled || !promobar.messages?.length);
  const paddingTop = promobarDisabled
    ? 'pt-[var(--header-height)]'
    : 'pt-[calc(var(--header-height)+var(--promobar-height))]';

  return (
    <div
      className="flex h-[var(--viewport-height)] flex-col"
      data-comp={Layout.displayName}
    >
      <Header settings={siteSettings?.settings?.header} />

      <main role="main" id="mainContent" className={`flex-grow ${paddingTop}`}>
        {children}
      </main>

      <Footer settings={siteSettings?.settings?.footer} />

      <Overlay />

      <Cart settings={siteSettings?.settings?.cart} />

      <Search settings={siteSettings?.settings?.search} />

      <Modal />
    </div>
  );
}

Layout.displayName = 'Layout';
