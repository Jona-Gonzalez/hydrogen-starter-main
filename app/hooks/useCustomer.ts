import {useCustomerContext} from '~/contexts';
import {CustomerState} from '~/lib/types';

export function useCustomer() {
  const {state} = useCustomerContext();
  const {accessToken, customer, customerStatus} = state as CustomerState;

  return {accessToken, customer, customerStatus};
}
