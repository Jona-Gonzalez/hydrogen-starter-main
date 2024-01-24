import {useState} from 'react';
import {useLocation} from '@remix-run/react';
import {useSiteSettings} from '@pack/react';

import {AddressBookItem} from './AddressBookItem';
import {CreateAddressForm} from './CreateAddressForm';
import {EditAddressForm} from './EditAddressForm';
import {Spinner} from '~/components';

export function AddressBook() {
  const addresses = [];
  const status = {};
  const defaultAddress = {};
  const {pathname} = useLocation();
  const siteSettings = useSiteSettings();

  const [initialAddress, setInitialAddress] = useState(null);
  const [isCreateAddress, setIsCreateAddress] = useState(false);

  const {menuItems} = {...siteSettings?.settings?.account?.menu};
  const heading = menuItems?.find(({link}) => pathname.startsWith(link?.url))
    ?.link?.text;
  const defaultAddressId = defaultAddress?.id?.split('?')[0];
  const addressesWithDefaultFirst = addresses?.reduce((acc, address) => {
    const isDefault = address.id?.split('?')[0] === defaultAddressId;
    return isDefault ? [address, ...acc] : [...acc, address];
  }, []);

  return (
    <div className="flex flex-col gap-8 md:gap-10">
      <div className="flex flex-col items-start justify-start gap-4 md:flex-row md:justify-between">
        <h1 className="text-title-h4">{heading}</h1>

        <button
          aria-label="Add a new address"
          className="text-main-underline text-nav bg-[linear-gradient(var(--primary),var(--primary))] font-normal"
          onClick={() => {
            setIsCreateAddress(true);
            setInitialAddress(null);
          }}
          type="button"
        >
          + Add A New Address
        </button>
      </div>

      {initialAddress && !isCreateAddress && (
        <EditAddressForm
          defaultAddress={defaultAddress}
          initialAddress={initialAddress}
          setInitialAddress={setInitialAddress}
        />
      )}

      {isCreateAddress && !initialAddress && (
        <CreateAddressForm setIsCreateAddress={setIsCreateAddress} />
      )}

      {status.started && !status.finished && (
        <div className="relative flex min-h-[12rem] items-center justify-center text-mediumDarkGray">
          <Spinner width="32" />
        </div>
      )}

      {status.finished && !addressesWithDefaultFirst?.length && (
        <div
          role="status"
          className="relative flex min-h-[12rem] items-center justify-center"
        >
          You don&#39;t have any addresses saved yet
        </div>
      )}

      {status.finished && !!addressesWithDefaultFirst?.length && (
        <ul className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {addressesWithDefaultFirst.map((address) => {
            return (
              <li key={address.id}>
                <AddressBookItem
                  address={address}
                  defaultAddress={defaultAddress}
                  initialAddress={initialAddress}
                  setIsCreateAddress={setIsCreateAddress}
                  setInitialAddress={setInitialAddress}
                />
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

AddressBook.displayName = 'AddressBook';
