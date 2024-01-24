import {useCart} from '@shopify/hydrogen-react';
import {useMoney} from '@shopify/hydrogen-react';

import {Link} from '~/components';

export function CartTotals({settings}) {
  const {checkoutUrl, cost, totalQuantity} = useCart();
  const formattedTotal = useMoney({
    amount: cost?.totalAmount?.amount,
    currencyCode: cost?.totalAmount?.currencyCode,
  });
  const {checkoutText, subtext, subtotalText} = {
    ...settings?.totals,
  };

  return (
    <div
      className={`flex-col gap-4 border-t border-t-border p-4 ${
        totalQuantity ? 'flex' : 'hidden'
      }`}
    >
      <div>
        <div className="flex justify-between">
          <p className="font-bold">{subtotalText || 'Subtotal'}</p>
          {formattedTotal && <p>{formattedTotal.withoutTrailingZeros}</p>}
        </div>

        {subtext && <p className="mt-1 text-xs">{subtext}</p>}
      </div>

      <Link
        aria-label="Go to checkout page"
        className="btn-primary w-full"
        to={checkoutUrl}
      >
        {checkoutText || 'Checkout'}
      </Link>
    </div>
  );
}

CartTotals.displayName = 'CartTotals';
