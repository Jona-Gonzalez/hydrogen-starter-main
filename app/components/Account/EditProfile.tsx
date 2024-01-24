import {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {useLocation} from '@remix-run/react';
import {useSiteSettings} from '@pack/react';

import {Spinner} from '~/components';

export function EditProfile({customer}) {
  const customerUpdateDetails = async () => null;
  const finished = false;
  const reset = () => null;
  const resetTimer = useRef(null);
  const started = false;
  const success = false;

  const [errors, setErrors] = useState([]);
  const {pathname} = useLocation();
  const siteSettings = useSiteSettings();
  const {menuItems} = {...siteSettings?.settings?.account?.menu};
  const heading = menuItems?.find(({link}) => pathname.startsWith(link?.url))
    ?.link?.text;

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  useEffect(() => {
    if (!customer) return;
    setFirstName(customer.firstName);
    setLastName(customer.lastName);
  }, [customer, finished]);

  const buttonText = useMemo(() => {
    if (finished) {
      resetTimer.current = setTimeout(() => {
        if (reset) reset();
        clearTimeout(resetTimer.current);
      }, 3000);
      return success ? 'Saved' : 'Failed';
    }
    return started ? 'Saving' : 'Save';
  }, [started, success, finished]);

  const handleUpdateCustomerDetails = useCallback(
    async (event) => {
      event.preventDefault();
      if (!customer || started) return;

      await customerUpdateDetails({
        acceptsMarketing: customer.acceptsMarketing,
        email: customer.email,
        firstName,
        lastName,
      });
    },
    [firstName, lastName, started, customer],
  );

  return (
    <div className="flex flex-col">
      <h1 className="text-title-h4 mb-8 md:mb-10">{heading}</h1>

      <form
        className="grid grid-cols-2 gap-3 rounded border border-border p-4 sm:p-6"
        onSubmit={handleUpdateCustomerDetails}
      >
        <label htmlFor="firstName" className="col-span-2 sm:col-span-1">
          <span className="input-label">First Name</span>
          <input
            className="input-text"
            name="firstName"
            onChange={({target}) => setFirstName(target.value)}
            placeholder="First Name"
            required
            type="text"
            value={firstName}
          />
        </label>

        <label htmlFor="lastName" className="col-span-2 sm:col-span-1">
          <span className="input-label">Last Name</span>
          <input
            className="input-text"
            name="lastName"
            onChange={({target}) => setLastName(target.value)}
            placeholder="Last Name"
            required
            type="text"
            value={lastName}
          />
        </label>

        <label htmlFor="email" className="col-span-2">
          <span className="input-label">Email</span>
          <input
            className="input-text text-mediumDarkGray"
            disabled
            name="email"
            placeholder="Email"
            required
            type="email"
            value={customer?.email}
          />
        </label>

        <div className="col-span-2 flex justify-center">
          <button
            aria-label="Save to update profile"
            className={`btn-primary mt-4 w-full min-w-[10rem] md:w-auto ${
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

EditProfile.displayName = 'EditProfile';
