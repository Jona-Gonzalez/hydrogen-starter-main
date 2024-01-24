import {useEffect, useMemo, useState} from 'react';

import {Select, Spinner} from '~/components';
import {useCountriesList} from '~/hooks';

const blankForm = {
  firstName: '',
  lastName: '',
  company: '',
  address1: '',
  address2: '',
  city: '',
  province: '',
  country: '',
  zip: '',
  phone: '',
};

export function AddressForm({
  buttonText,
  closeForm,
  defaultAddress,
  errors,
  initialAddress,
  onSubmit = () => {},
  started,
  title,
}) {
  const {countryNames, countryNamesData} = useCountriesList({
    firstCountries: ['United States', 'Canada', 'United Kingdom', 'Australia'],
  });

  const [isDefault, setIsDefault] = useState(false);
  const [form, setForm] = useState(blankForm);

  const countries = useMemo(() => {
    return countryNames.map((name) => ({label: name, value: name}));
  }, [countryNames]);

  const provinces = useMemo(() => {
    return countryNamesData
      ?.find(({countryName}) => {
        return countryName === form.country;
      })
      ?.regions?.map(({name}) => ({label: name, value: name}));
  }, [form.country, countryNamesData?.length]);

  useEffect(() => {
    if (!initialAddress) {
      setForm({...blankForm, country: 'United States'});
      setIsDefault(false);
      return;
    }

    setForm({
      firstName: initialAddress.firstName || '',
      lastName: initialAddress.lastName || '',
      company: initialAddress.company || '',
      address1: initialAddress.address1 || '',
      address2: initialAddress.address2 || '',
      city: initialAddress.city || '',
      province: initialAddress.province || '',
      country: initialAddress.country || '',
      zip: initialAddress.zip || '',
      phone: initialAddress.phone || '',
    });
    setIsDefault(
      defaultAddress?.id?.split('?')[0] === initialAddress.id?.split('?')[0],
    );
  }, [initialAddress, defaultAddress?.id]);

  return (
    <div className="rounded border border-border p-4 sm:p-8">
      <div className="mb-8 flex items-start justify-between gap-3">
        <h2 className="text-title-h5">{title}</h2>

        <button
          aria-label="Cancel"
          className="text-nav text-main-underline font-normal"
          onClick={closeForm}
          type="button"
        >
          Cancel
        </button>
      </div>

      <form
        className="grid grid-cols-2 gap-3"
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit({form, isDefault});
        }}
      >
        <label htmlFor="firstName" className="col-span-2 sm:col-span-1">
          <span className="input-label">First Name</span>
          <input
            className="input-text"
            name="firstName"
            onChange={(e) => setForm({...form, firstName: e.target.value})}
            placeholder="First Name"
            required
            type="text"
            value={form.firstName}
          />
        </label>

        <label htmlFor="lastName" className="col-span-2 sm:col-span-1">
          <span className="input-label">Last Name</span>
          <input
            className="input-text"
            name="lastName"
            onChange={(e) => setForm({...form, lastName: e.target.value})}
            placeholder="Last Name"
            required
            type="text"
            value={form.lastName}
          />
        </label>

        <label htmlFor="company" className="col-span-2">
          <span className="input-label">Company</span>
          <input
            className="input-text"
            name="company"
            onChange={(e) => setForm({...form, company: e.target.value})}
            placeholder="Company"
            type="text"
            value={form.company}
          />
        </label>

        <label htmlFor="address1" className="col-span-2">
          <span className="input-label">Address 1</span>
          <input
            className="input-text"
            name="address1"
            onChange={(e) => setForm({...form, address1: e.target.value})}
            placeholder="Address 1"
            required
            type="text"
            value={form.address1}
          />
        </label>

        <label htmlFor="address2" className="col-span-2">
          <span className="input-label">Address 2</span>
          <input
            className="input-text"
            name="address2"
            onChange={(e) => setForm({...form, address2: e.target.value})}
            placeholder="Address 2"
            type="text"
            value={form.address2}
          />
        </label>

        <label htmlFor="city" className="col-span-2 sm:col-span-1">
          <span className="input-label">City</span>
          <input
            className="input-text"
            name="city"
            onChange={(e) => setForm({...form, city: e.target.value})}
            placeholder="City"
            required
            type="text"
            value={form.city}
          />
        </label>

        <div className="col-span-2 sm:col-span-1">
          <p className="input-label">State/Province</p>

          <Select
            onSelect={({value}) => setForm({...form, province: value})}
            options={provinces || []}
            placeholder="Select State/Province"
            selectedOption={{label: form.province, value: form.province}}
          />
        </div>

        <label htmlFor="zip" className="col-span-2 sm:col-span-1">
          <span className="input-label">Zip</span>
          <input
            className="input-text"
            name="zip"
            onChange={(e) => setForm({...form, zip: e.target.value})}
            placeholder="Zip"
            required
            type="text"
            value={form.zip}
          />
        </label>

        <div className="col-span-2 sm:col-span-1">
          <p className="input-label">Country</p>

          <Select
            onSelect={({value}) => {
              setForm({
                ...form,
                country: value,
                province: value !== form.country ? '' : form.province,
              });
            }}
            options={countries}
            placeholder="Select Country"
            selectedOption={{label: form.country, value: form.country}}
          />
        </div>

        <label htmlFor="phone" className="col-span-2 sm:col-span-1">
          <span className="input-label">Phone</span>
          <input
            className="input-text"
            name="phone"
            onChange={(e) => setForm({...form, phone: e.target.value})}
            placeholder="Phone"
            type="tel"
            value={form.phone}
          />
        </label>

        <label
          htmlFor="isDefault"
          className="col-span-2 mt-2 flex items-center"
        >
          <input
            checked={isDefault}
            name="isDefault"
            onChange={(e) => setIsDefault(e.target.checked)}
            type="checkbox"
          />
          <span className="ml-2 text-sm">Set as default address</span>
        </label>

        <div className="col-span-2 mt-4 flex justify-center">
          <button
            aria-label={initialAddress ? 'Update Address' : 'Add Address'}
            className={`btn-primary w-full min-w-[12rem] md:w-auto ${
              started ? 'cursor-default' : ''
            }`}
            type="submit"
          >
            {started ? <Spinner width="20" /> : buttonText}
          </button>
        </div>

        {errors?.length > 0 && (
          <ul className="col-span-2 mt-4 flex flex-col items-center gap-1">
            {errors.map((error, index) => {
              return (
                <li key={index} className="text-center text-sm text-red-500">
                  {error}
                </li>
              );
            })}
          </ul>
        )}
      </form>
    </div>
  );
}

AddressForm.displayname = 'AddressForm';
