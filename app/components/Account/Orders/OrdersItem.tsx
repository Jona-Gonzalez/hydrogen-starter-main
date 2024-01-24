import {useMemo} from 'react';
import startCase from 'lodash.startcase';

import {Link} from '~/components';

export function OrdersItem({order}) {
  const orderDate = useMemo(() => {
    const newDate = new Date(order.processedAt);
    return newDate.toLocaleDateString('default', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }, [order.processedAt]);

  const orders = useMemo(() => {
    return order.lineItems.edges.map(({node}) => node.title).join(', ');
  }, [order.id]);

  const financialStatus = startCase(order.financialStatus.toLowerCase());
  const fulfillmentStatus = startCase(order.fulfillmentStatus.toLowerCase());
  const total = `$${parseFloat(order.totalPriceV2.amount).toFixed(2)}`;

  return (
    <>
      {/* mobile */}
      <div className="flex flex-col gap-3 rounded border border-border p-6 md:hidden">
        <div className="flex justify-between">
          <Link
            aria-label={`Go to order page for order ${order.name}`}
            to={order.detailsUrl}
          >
            <p className="text-main-underline text-nav bg-[linear-gradient(var(--primary),var(--primary))] text-right font-normal">
              Order {order.name}
            </p>
          </Link>

          <p className="text-sm">{orderDate}</p>
        </div>

        <p className="text-title-h4">{total}</p>

        <p className="text-xs">{orders}</p>

        <p className="text-xs">
          Payment: <span className="font-medium">{financialStatus}</span> /
          Fufillment: <span className="font-medium">{fulfillmentStatus}</span>
        </p>
      </div>

      {/* tablet/desktop */}
      <div className="hidden grid-cols-[2fr_2fr_2fr_2fr_1fr] gap-3 text-sm md:grid">
        <div>
          <Link
            aria-label={`Go to order page for order ${order.name}`}
            to={order.detailsUrl}
          >
            <p className="text-main-underline text-nav bg-[linear-gradient(var(--primary),var(--primary))] font-normal">
              {order.name}
            </p>
          </Link>
        </div>

        <p>{orderDate}</p>

        <p>{financialStatus}</p>

        <p>{fulfillmentStatus}</p>

        <p>{total}</p>
      </div>
    </>
  );
}

OrdersItem.displayName = 'OrdersItem';
