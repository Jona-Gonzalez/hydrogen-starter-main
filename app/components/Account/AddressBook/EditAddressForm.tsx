import {useMemo, useRef, useState} from 'react';

import {AddressForm} from './AddressForm';

export function EditAddressForm({
  defaultAddress,
  initialAddress,
  setInitialAddress,
}) {
  const updateAddress = async () => null;
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
      return success ? 'Address Updated' : 'Failed';
    }
    return started ? 'Updating Address' : 'Update Address';
  }, [started, success, finished]);

  return (
    <AddressForm
      buttonText={buttonText}
      closeForm={() => setInitialAddress(null)}
      defaultAddress={defaultAddress}
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
        await updateAddress({
          address: form,
          id: initialAddress?.id,
          isDefault,
        });
        setInitialAddress(null);
      }}
      initialAddress={initialAddress}
      started={started}
      title="Edit Address"
    />
  );
}

EditAddressForm.displayname = 'EditAddressForm';
