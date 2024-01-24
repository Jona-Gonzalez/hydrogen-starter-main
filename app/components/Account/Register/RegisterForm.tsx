import {useCallback, useEffect, useRef, useState} from 'react';
import {useLocation} from '@remix-run/react';

import {CustomerActions, CustomerState} from '~/lib/types';
import {Spinner} from '~/components';
import {useCustomerContext} from '~/contexts';
import {useDataLayerClickEvents} from '~/hooks';

export function RegisterForm({fetcher, registerErrors, settings}) {
  const formRef = useRef(null);
  const {pathname} = useLocation();
  const {sendRegisterEvent} = useDataLayerClickEvents();
  const {state, actions} = useCustomerContext();
  const {customerStatus} = state as CustomerState;
  const {setCustomerStatus} = actions as CustomerActions;

  const [errors, setErrors] = useState<string[]>([]);

  const isLoading = customerStatus === 'creating';
  const {heading, pageHeading} = {...settings?.register};

  const buttonText = 'Create Account';

  const handleCustomerCreate = useCallback(
    async (event) => {
      event.preventDefault();
      if (isLoading) return;
      setErrors([]);
      setCustomerStatus('creating');
      const {password, passwordConfirm} = event.target;
      if (password.value !== passwordConfirm.value) {
        setErrors(['Passwords do not match. Please try again.']);
        return;
      }
      fetcher.submit(formRef.current, {method: 'POST'});
    },
    [isLoading],
  );

  useEffect(() => {
    if (registerErrors?.length) {
      setErrors(registerErrors);
    }
  }, [registerErrors]);

  return (
    <div className="rounded border border-border px-3 py-6 md:px-6 md:py-10">
      {pathname.startsWith('/account/register') && !pageHeading ? (
        <h1 className="text-title-h3 mb-6 text-center">{heading}</h1>
      ) : (
        <h2 className="text-title-h3 mb-6 text-center">{heading}</h2>
      )}

      <fetcher.Form
        className="mx-auto flex w-full max-w-[25rem] flex-col gap-4"
        id="customer-create-form"
        method="post"
        onSubmit={handleCustomerCreate}
        ref={formRef}
      >
        <label htmlFor="firstName">
          <span className="input-label">First Name</span>
          <input
            className="input-text"
            name="firstName"
            placeholder="First Name"
            required
            type="text"
          />
        </label>

        <label htmlFor="lastName">
          <span className="input-label">Last Name</span>
          <input
            className="input-text"
            name="lastName"
            placeholder="Last Name"
            required
            type="text"
          />
        </label>

        <label htmlFor="email">
          <span className="input-label">Email</span>
          <input
            className="input-text"
            name="email"
            placeholder="email@email.com"
            required
            type="email"
          />
        </label>

        <label htmlFor="password">
          <span className="input-label">Password</span>
          <input
            className="input-text"
            name="password"
            placeholder="••••••••"
            required
            type="password"
          />
        </label>

        <label htmlFor="passwordConfirm">
          <span className="input-label">Confirm Password</span>
          <input
            className="input-text"
            name="passwordConfirm"
            placeholder="••••••••"
            required
            type="password"
          />
        </label>

        <input value="register" name="request-type" readOnly hidden />

        <button
          aria-label="Create Account"
          className={`btn-primary mt-3 w-full min-w-[10rem] self-center md:w-auto  ${
            isLoading ? 'cursor-default' : ''
          }`}
          type="submit"
        >
          <span className={`${isLoading ? 'invisible' : 'visible'}`}>
            {buttonText}
          </span>

          {isLoading && (
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <Spinner width="20" />
            </span>
          )}
        </button>
      </fetcher.Form>

      {errors?.length > 0 && (
        <ul className="mt-4 flex flex-col items-center gap-1">
          {errors.map((error, index) => {
            return (
              <li key={index} className="text-center text-sm text-red-500">
                {error}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

RegisterForm.displayName = 'RegisterForm';
