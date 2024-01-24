import {useCart} from '@shopify/hydrogen-react';

import {Svg} from '~/components';

export function CartHeader({closeCart, heading}) {
  const {totalQuantity} = useCart();
  // const totalQuantity = 0;

  return (
    <div className="relative flex h-[var(--header-height)] items-center justify-center border-b border-b-border px-16">
      <button
        aria-label="Close cart"
        className="absolute left-4 top-1/2 -translate-y-1/2"
        onClick={closeCart}
        type="button"
      >
        <Svg
          className="w-5 text-text"
          src="/svgs/arrow-left.svg#arrow-left"
          title="Arrow Left"
          viewBox="0 0 24 24"
        />
      </button>

      <h3 className="text-center text-lg">{heading || 'My Cart'}</h3>

      <div className="absolute right-4 top-1/2 flex -translate-y-1/2 items-center">
        <Svg
          className="w-5 text-text"
          src="/svgs/cart.svg#cart"
          title="Cart"
          viewBox="0 0 24 24"
        />

        <p className="text-label-sm w-4 whitespace-nowrap pl-px font-bold">
          ({totalQuantity || 0})
        </p>
      </div>
    </div>
  );
}

CartHeader.displayName = 'CartHeader';
