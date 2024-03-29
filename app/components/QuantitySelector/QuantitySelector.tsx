import {Spinner, Svg} from '~/components';

export function QuantitySelector({
  disableDecrement = false,
  handleDecrement,
  handleIncrement,
  isUpdating = false,
  productTitle = 'product',
  quantity = 1,
}: {
  disableDecrement?: boolean;
  handleDecrement?: () => void;
  handleIncrement?: () => void;
  isUpdating?: boolean;
  productTitle?: string;
  quantity?: number;
}) {
  return (
    <div className="flex w-[6.5rem] items-center justify-between">
      <button
        aria-label={`Reduce quantity of ${productTitle} by 1 to ${
          quantity - 1
        }`}
        className={`relative h-8 w-8 rounded-full border border-border transition disabled:opacity-50 ${
          disableDecrement ? 'cursor-not-allowed' : 'md:hover:border-gray'
        }`}
        disabled={isUpdating || disableDecrement}
        onClick={handleDecrement}
        type="button"
      >
        <Svg
          className="absolute left-1/2 top-1/2 w-4 -translate-x-1/2 -translate-y-1/2 text-text"
          src="/svgs/minus.svg#minus"
          title="Minus"
          viewBox="0 0 24 24"
        />
      </button>

      <div className="relative flex flex-1 items-center justify-center">
        {isUpdating ? (
          <Spinner color="var(--gray)" width="20" />
        ) : (
          <p className="w-full text-center outline-none">{quantity}</p>
        )}
      </div>

      <button
        aria-label={`Increase quantity of ${productTitle} by 1 to ${
          quantity + 1
        }`}
        className="relative h-8 w-8 rounded-full border border-border transition disabled:opacity-50 md:hover:border-gray"
        disabled={isUpdating}
        onClick={handleIncrement}
        type="button"
      >
        <Svg
          className="absolute left-1/2 top-1/2 w-4 -translate-x-1/2 -translate-y-1/2 text-text"
          src="/svgs/plus.svg#plus"
          title="Plus"
          viewBox="0 0 24 24"
        />
      </button>
    </div>
  );
}

QuantitySelector.displayName = 'QuantitySelector';
