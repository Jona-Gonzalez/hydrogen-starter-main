import {useCallback} from 'react';
import {useNavigate} from '@remix-run/react';

import {CustomerActions} from '~/lib/types';
import {removeAccessTokenFromStorage} from '~/lib/customer';
import {useCustomerContext} from '~/contexts';

export function useCustomerLogOut() {
  const navigate = useNavigate();
  const {actions} = useCustomerContext();
  const {setAccessToken, setCustomer, setCustomerStatus} =
    actions as CustomerActions;

  const customerLogOut = useCallback(() => {
    setCustomer(null);
    setCustomerStatus('guest');
    setAccessToken(null);
    removeAccessTokenFromStorage();
    navigate('/account/login');
  }, []);

  return {customerLogOut};
}
