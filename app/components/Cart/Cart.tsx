import {useCart} from '@shopify/hydrogen-react';

import {CartEmpty} from './CartEmpty';
import {CartHeader} from './CartHeader';
import {CartLine} from './CartLine';
import {CartTotals} from './CartTotals';
import {CartUpsell} from './CartUpsell';
import {FreeShippingMeter} from './FreeShippingMeter';
import {useGlobalContext} from '~/contexts';

export function Cart({settings}) {
  const {lines, totalQuantity} = useCart();
  const {
    state: {cartOpen},
    actions: {closeCart},
  } = useGlobalContext();

  const enabledUpsell = settings?.upsell?.enabled;

  return (
    <aside
      className={`fixed left-full top-0 z-[70] flex h-full w-full flex-col justify-between overflow-hidden bg-background transition md:max-w-[var(--sidebar-width)] ${
        cartOpen
          ? 'pointer-events-auto -translate-x-full'
          : 'pointer-events-none translate-x-0'
      }`}
    >
      {cartOpen && (
        <>
          <CartHeader closeCart={closeCart} heading={settings?.heading} />

          <FreeShippingMeter settings={settings} />

          <ul className="scrollbar-hide relative flex-1 overflow-y-auto">
            {lines?.length ? (
              lines.map((line) => {
                return (
                  <li
                    key={line.id}
                    className="border-b border-b-border last:border-none"
                  >
                    <CartLine line={line} closeCart={closeCart} />
                  </li>
                );
              })
            ) : (
              <CartEmpty closeCart={closeCart} settings={settings} />
            )}
          </ul>

          {enabledUpsell && (
            <CartUpsell closeCart={closeCart} settings={settings} />
          )}

          {totalQuantity > 0 && <CartTotals settings={settings} />}
        </>
      )}
    </aside>
  );
}

Cart.displayName = 'Cart';
