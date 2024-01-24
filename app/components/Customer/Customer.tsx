import {useEffect} from 'react';
import {useFetcher} from '@remix-run/react';

import {CustomerActions} from '~/lib/types';
import {getAccessTokenFromStorage} from '~/lib/customer';
import {useCustomerContext} from '~/contexts';

export function Customer() {
  const {data, Form, submit} = useFetcher();
  const {actions} = useCustomerContext();
  const {setAccessToken, setCustomer, setCustomerStatus} =
    actions as CustomerActions;

  // Fetch customer on page load if accessToken is in localStorage
  useEffect(() => {
    const accessToken = getAccessTokenFromStorage();
    if (accessToken) {
      setCustomerStatus('fetching');
      const formData = new FormData();
      formData.append('accessToken', JSON.stringify(accessToken));
      submit(formData, {method: 'POST'});
    } else {
      setCustomerStatus('guest');
    }
  }, []);

  useEffect(() => {
    if (!data?.customer) return;
    const accessToken = getAccessTokenFromStorage();
    setAccessToken(accessToken);
    setCustomer(data.customer);
    setCustomerStatus('logged_in');
  }, [data?.customer]);

  useEffect(() => {
    if (!data?.errors?.length) return;
    data.errors.forEach((error) => {
      console.error('Customer:error', error);
    });
  }, [data?.errors]);

  return (
    <Form method="post">
      <input type="hidden" name="accessToken" value="" />
    </Form>
  );
}

Customer.displayName = 'Customer';
