import {BackInStockModal, Spinner} from '~/components';
import {useAddToCart} from '~/hooks';

export function AddToCart({
  addToCartText = '',
  className = '',
  isPdp = false,
  quantity = 1,
  selectedVariant,
}: {
  addToCartText?: string;
  className?: string;
  isPdp?: boolean;
  quantity: number;
  selectedVariant: any;
}) {
  const {
    state: {
      buttonText,
      cartIsUpdating,
      isAdding,
      isNotifyMe,
      isSoldOut,
      subtext,
    },
    actions: {handleAddToCart, handleNotifyMe},
  } = useAddToCart({
    addToCartText,
    quantity,
    selectedVariant,
  });

  const isUpdatingClass = isAdding || cartIsUpdating ? 'cursor-default' : '';
  const isNotifyMeClass = isNotifyMe ? 'btn-inverse-dark' : 'btn-primary';

  return (
    <div>
      <button
        aria-label={buttonText}
        className={`${isNotifyMeClass} relative w-full ${isUpdatingClass} ${className}`}
        disabled={isSoldOut && !isNotifyMe}
        onClick={() => {
          if (isNotifyMe) {
            handleNotifyMe(
              <BackInStockModal selectedVariant={selectedVariant} />,
            );
          } else {
            handleAddToCart();
          }
        }}
        type="button"
      >
        {isAdding ? <Spinner width="20" /> : buttonText}
      </button>

      {isPdp && subtext && (
        <p className="mt-1 text-center text-xs">{subtext}</p>
      )}
    </div>
  );
}

AddToCart.displayName = 'AddToCart';
