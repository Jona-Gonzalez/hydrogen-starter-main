import {useCallback, useEffect, useState} from 'react';
import {useCart} from '@shopify/hydrogen-react';

export const useCartLine = ({line}) => {
  const {id, quantity} = {...line};
  const {linesRemove, linesUpdate, status} = useCart();

  const [isUpdatingLine, setIsUpdatingLine] = useState(false);
  const [isRemovingLine, setIsRemovingLine] = useState(false);

  const handleDecrement = useCallback(() => {
    if (quantity > 1) {
      setIsUpdatingLine(true);
      linesUpdate([{id, quantity: quantity - 1}]);
    } else {
      linesRemove([id]);
    }
  }, [id, quantity]);

  const handleIncrement = useCallback(() => {
    setIsUpdatingLine(true);
    linesUpdate([{id, quantity: quantity + 1}]);
  }, [id, quantity]);

  const handleRemove = useCallback(() => {
    setIsRemovingLine(true);
    linesRemove([id]);
  }, [id]);

  useEffect(() => {
    if (isUpdatingLine && status === 'idle') {
      setIsUpdatingLine(false);
    }
    if (isRemovingLine && status === 'idle') {
      setIsRemovingLine(false);
    }
  }, [status, isRemovingLine, isUpdatingLine]);

  return {
    handleDecrement,
    handleIncrement,
    handleRemove,
    isRemovingLine,
    isUpdatingLine,
  };
};
