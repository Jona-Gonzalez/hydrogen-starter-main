import {useEffect} from 'react';
import {useNavigate} from '@remix-run/react';

import {useCustomer} from '~/hooks';

export function GuestAccountLayout({children}) {
  const navigate = useNavigate();
  const {customerStatus} = useCustomer();

  // If logged in, redirect to orders page
  useEffect(() => {
    if (customerStatus === 'logged_in') {
      navigate('/account/orders', {replace: true});
    }
  }, [customerStatus]);

  return (
    <section
      className="px-contained py-contained"
      data-comp={GuestAccountLayout.displayName}
    >
      {children}
    </section>
  );
}

GuestAccountLayout.displayName = 'AccountLayout.Guest';
