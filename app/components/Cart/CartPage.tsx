import {useSiteSettings} from '@pack/react';
import {useCart} from '@shopify/hydrogen-react';

import {CartEmpty} from './CartEmpty';
import {CartLine} from './CartLine';
import {CartTotals} from './CartTotals';
import {CartUpsell} from './CartUpsell';
import {FreeShippingMeter} from './FreeShippingMeter';

export function CartPage() {
  const siteSettings = useSiteSettings();
  const {lines, totalQuantity} = useCart();
  const settings = siteSettings?.settings?.cart;
  const heading = settings?.cart?.heading;
  const hasCartLines = totalQuantity > 0;

  return (
    <section
      className="md:px-contained py-contained"
      data-comp={CartPage.displayName}
    >
      <div className="mx-auto max-w-[80rem]">
        <h1 className="text-title-h2 mb-4 px-4">{heading || 'My Cart'}</h1>

        <div
          className={`grid gap-x-4 md:grid-flow-col-dense md:grid-rows-[auto_1fr] md:gap-y-4 ${
            hasCartLines
              ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-[3fr_2fr]'
              : 'grid-cols-1'
          }`}
        >
          <div className="md:row-span-2">
            <ul
              className={`relative border-y border-border ${
                hasCartLines ? '' : 'min-h-[20rem] py-12 md:min-h-[30rem]'
              }`}
            >
              {hasCartLines ? (
                lines.map((line) => {
                  return (
                    <li
                      key={line.id}
                      className="border-b border-b-border last:border-none"
                    >
                      <CartLine line={line} />
                    </li>
                  );
                })
              ) : (
                <CartEmpty settings={settings} />
              )}
            </ul>
          </div>

          {hasCartLines && (
            <div className="flex flex-col md:gap-4">
              <div className="[&>div]:max-md:border-t-0 [&>div]:md:rounded [&>div]:md:border [&>div]:md:border-border">
                <CartTotals settings={settings} />
              </div>

              <div className="[&>div]:border-b-0 [&>div]:border-t [&>div]:border-border [&>div]:md:rounded [&>div]:md:border [&>div]:md:border-b">
                <FreeShippingMeter settings={settings} />
              </div>

              <div className="[&>div]:border-border [&>div]:md:rounded [&>div]:md:border">
                <CartUpsell settings={settings} />
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

CartPage.displayName = 'CartPage';
