import {useMemo} from 'react';
import {useCart} from '@shopify/hydrogen-react';

export function FreeShippingMeter({settings}) {
  const {cost, totalQuantity} = useCart();
  // const cost = '';
  // const totalQuantity = 0;
  const {
    enabled,
    minCartSpend,
    progressBarColor,
    progressMessage,
    qualifiedMessage,
  } = {...settings?.freeShipping};
  const showMeter = enabled && totalQuantity > 0 && minCartSpend > 0;

  const progress = useMemo(() => {
    if (!showMeter) return null;

    const total = parseFloat(cost?.total);
    const fraction = total / minCartSpend;
    const remainder = minCartSpend - total;

    if (fraction >= 1) {
      return {
        percent: 100,
        message: qualifiedMessage,
      };
    }

    return {
      percent: fraction * 100,
      message: progressMessage?.replace(
        '{{amount}}',
        `$${remainder.toFixed(2).replace('.00', '')}`,
      ),
    };
  }, [cost?.total, minCartSpend, progressMessage, qualifiedMessage, showMeter]);

  return showMeter ? (
    <div className="border-b border-b-border p-4">
      <p className="mb-2 text-center text-xs">{progress.message}</p>

      <div className="h-1.5 w-full overflow-hidden rounded bg-lightGray">
        <div
          className="h-full w-full origin-left transition"
          style={{
            transform: `scaleX(${progress.percent}%)`,
            backgroundColor: progressBarColor,
          }}
        />
      </div>
    </div>
  ) : null;
}

FreeShippingMeter.displayName = 'FreeShippingMeter';
