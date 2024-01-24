import {useMemo} from 'react';

export function ProductOptionValue({
  isSelected,
  name,
  product,
  setSelectedOption,
  value,
}) {
  const variantFromOptionValue = useMemo(() => {
    return product.variants.nodes.find(({selectedOptions}) => {
      return selectedOptions.find((option) => {
        return option.name === name && option.value === value;
      });
    });
  }, [name, product, value]);

  const disabled = !variantFromOptionValue;
  const optionValueIsAvailable = !!variantFromOptionValue?.availableForSale;

  const validClass = !disabled ? 'md:hover:border-text' : 'cursor-not-allowed';
  const unavailableClass =
    !optionValueIsAvailable && !disabled
      ? 'after:h-px after:w-[150%] after:rotate-[135deg] after:absolute after:top-1/2 after:left-1/2 after:-translate-x-1/2 after:-translate-y-1/2 after:bg-mediumGray text-gray overflow-hidden'
      : '';
  const selectedClass = isSelected ? 'border-text' : '';

  return (
    <button
      aria-label={value}
      className={`relative h-10 min-w-[3.5rem] rounded border border-border px-3 transition ${validClass} ${unavailableClass} ${selectedClass}`}
      disabled={disabled}
      onClick={() => {
        if (isSelected) return;
        setSelectedOption(name, value);
      }}
      type="button"
    >
      {value}
    </button>
  );
}

ProductOptionValue.displayName = 'ProductOptionValue';
