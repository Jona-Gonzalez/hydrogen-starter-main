import {useMemo} from 'react';

const formatAmount = (amount) => {
  if (!amount && amount !== 0) return null;
  return `$${(amount === 'number' ? amount : parseFloat(amount)).toFixed(2)}`;
};

export function OrderTotals({order}) {
  const totals = useMemo(() => {
    let subtotalAmount = order.subtotalPriceV2?.amount;
    let discountAmount;

    if (order.discountApplications?.[0]?.targetType === 'LINE_ITEM') {
      let subtotal = 0;
      let discountTotal = 0;
      order.lineItems.forEach((item) => {
        subtotal += parseFloat(
          item.discountedTotalPrice?.amount ||
            item.originalTotalPrice?.amount ||
            '0',
        );
        discountTotal += parseFloat(
          item.discountAllocations?.[0]?.allocatedAmount.amount || '0',
        );
      });
      subtotalAmount = subtotal;
      discountAmount = discountTotal;
    }

    return [
      {
        label: 'Subtotal',
        amount: formatAmount(subtotalAmount),
      },
      ...(discountAmount
        ? [
            {
              label: 'Discount',
              amount: `-${formatAmount(discountAmount)}`,
            },
          ]
        : []),
      {
        label: 'Shipping',
        amount: formatAmount(order.totalShippingPriceV2?.amount),
      },
      {label: 'Tax', amount: formatAmount(order.totalTaxV2?.amount)},
      {label: 'Total', amount: formatAmount(order.totalPriceV2?.amount)},
      ...(parseFloat(order.totalRefundedV2?.amount) > 0
        ? [
            {
              label: 'Refunded',
              amount: `-${formatAmount(order.totalRefundedV2.amount)}`,
            },
          ]
        : []),
    ];
  }, [order.id]);

  return (
    <div>
      {totals.map(({label, amount}) => {
        return (
          <div
            key={label}
            className="grid grid-cols-[10fr_auto] items-center gap-3 border-b border-b-border py-5 last:border-none md:grid-cols-[10fr_1fr] md:gap-12"
          >
            <p className="text-label">{label}</p>

            <p
              className={`${
                label === 'Total' ? 'text-lg font-bold' : 'text-sm'
              }`}
            >
              {amount}
            </p>
          </div>
        );
      })}
    </div>
  );
}

OrderTotals.displayName = 'OrderTotals';
