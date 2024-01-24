import {useCallback} from 'react';
import {useGlobalContext} from '~/contexts';

export const useDataLayerClickEvents = () => {
  const {
    state: {emitter},
  }: any = useGlobalContext();

  const sendClickProductItemEvent = useCallback(
    ({
      isSearchResult,
      listIndex,
      product,
      selectedVariant: _selectedVariant,
    }: {
      isSearchResult?: boolean;
      listIndex?: number;
      product?: any;
      selectedVariant?: any;
    }) => {
      if (!_selectedVariant || typeof listIndex !== 'number') return;

      const selectedVariant = {
        ..._selectedVariant,
        image: _selectedVariant.image || product?.featuredImage || '',
        index: listIndex,
        product: {
          ..._selectedVariant.product,
          vendor: product?.vendor,
        },
        list: window.location.pathname.startsWith('/collections')
          ? window.location.pathname
          : '',
      };

      emitter?.emit(
        isSearchResult ? 'CLICK_SEARCH_ITEM' : 'CLICK_COLLECTION_ITEM',
        selectedVariant,
      );
    },
    [emitter?._eventsCount],
  );

  const sendSubscribeEvent = useCallback(
    ({
      email,
      phone,
    }: {
      email?: string | undefined;
      phone?: string | undefined;
    }) => {
      if (email) {
        emitter?.emit('SUBSCRIBE_EMAIL', email);
      }
      if (phone) {
        emitter?.emit('SUBSCRIBE_PHONE', phone);
      }
    },
    [emitter?._eventsCount],
  );

  const sendLogInEvent = useCallback(() => {
    emitter?.emit('CUSTOMER_LOGGED_IN');
  }, [emitter?._eventsCount]);

  const sendRegisterEvent = useCallback(() => {
    emitter?.emit('CUSTOMER_REGISTERED');
  }, [emitter?._eventsCount]);

  return {
    sendClickProductItemEvent,
    sendSubscribeEvent,
    sendLogInEvent,
    sendRegisterEvent,
  };
};
