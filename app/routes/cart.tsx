import {CartPage} from '~/components';

export default function CartRoute() {
  return (
    <div data-comp={CartRoute.displayName}>
      <CartPage />
    </div>
  );
}

CartRoute.displayName = 'CartRoute';
