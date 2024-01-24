import {useEffect} from 'react';
import {useFetcher} from '@remix-run/react';

import {CustomerActions} from '~/lib/types';
import {setAccessTokenInStorage} from '~/lib/customer';
import {useCustomerContext} from '~/contexts';

export function useLoginRegisterFetcher() {
  const fetcher = useFetcher();
  const {actions} = useCustomerContext();
  const {accessToken, customer, loginErrors, registerErrors} = {
    ...fetcher.data,
  };
  const {setAccessToken, setCustomer, setCustomerStatus} =
    actions as CustomerActions;

  useEffect(() => {
    if (customer) {
      setCustomer(customer);
      setCustomerStatus('logged_in');
      setAccessToken(accessToken);
      setAccessTokenInStorage(accessToken);
    }
  }, [customer]);

  useEffect(() => {
    if (fetcher.data && !fetcher.data.customer) {
      setCustomerStatus('guest');
    }
  }, [fetcher.data]);

  return {fetcher, loginErrors, registerErrors};
}
