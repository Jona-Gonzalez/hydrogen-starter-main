import {useMemo, useRef, useState} from 'react';

import {AddressForm} from './AddressForm';

export function CreateAddressForm({setIsCreateAddress}) {
  const createAddress = async () => null;
  const finished = false;
  const reset = () => null;
  const resetTimer = useRef(null);
  const started = false;
  const success = false;

  const [errors, setErrors] = useState([]);

  const buttonText = useMemo(() => {
    if (finished) {
      resetTimer.current = setTimeout(() => {
        if (reset) reset();
        clearTimeout(resetTimer.current);
      }, 3000);
      return success ? 'Address Added' : 'Failed';
    }
    return started ? 'Adding Address' : 'Add Address';
  }, [started, success, finished]);

  return (
    <AddressForm
      buttonText={buttonText}
      closeForm={() => setIsCreateAddress(false)}
      errors={errors}
      onSubmit={async ({form, isDefault}) => {
        if (!form.country) {
          setErrors(['Missing country']);
          return;
        }
        if (!form.province) {
          setErrors(['Missing state/province']);
          return;
        }
        await createAddress({
          address: form,
          isDefault,
        });
        setIsCreateAddress(false);
      }}
      started={started}
      title="Add a New Address"
    />
  );
}

CreateAddressForm.displayname = 'CreateAddressForm';
