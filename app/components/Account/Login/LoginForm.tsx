import {useCallback, useEffect, useState} from 'react';
import {useLocation} from '@remix-run/react';

import {CustomerActions, CustomerState} from '~/lib/types';
import {Spinner} from '~/components';
import {useCustomerContext} from '~/contexts';
import {useDataLayerClickEvents} from '~/hooks';

export function LoginForm({
  fetcher,
  loginErrors,
  setIsForgotPassword,
  settings,
}) {
  const {pathname} = useLocation();
  const {sendLogInEvent} = useDataLayerClickEvents();
  const {state, actions} = useCustomerContext();
  const {customerStatus} = state as CustomerState;
  const {setCustomerStatus} = actions as CustomerActions;

  const [errors, setErrors] = useState([]);

  const isLoading = customerStatus === 'fetching';
  const {forgotText, heading, pageHeading, unidentifiedCustomerText} = {
    ...settings?.login,
  };

  const buttonText = 'Log In';

  const handleLogin = useCallback(
    async (event) => {
      if (isLoading) return;
      setErrors([]);
      setCustomerStatus('fetching');
      // sendLogInEvent();
    },
    [isLoading],
  );

  useEffect(() => {
    if (loginErrors?.length) {
      setErrors(loginErrors);
    }
  }, [loginErrors]);

  return (
    <div className="flex flex-col items-center rounded border border-border px-3 py-6 md:px-6 md:py-10">
      {pathname.startsWith('/account/login') && !pageHeading ? (
        <h1 className="text-title-h3 mb-6 text-center">{heading}</h1>
      ) : (
        <h2 className="text-title-h3 mb-6 text-center">{heading}</h2>
      )}

      <fetcher.Form
        className="mx-auto flex w-full max-w-[25rem] flex-col gap-4"
        id="customer-login-form"
        method="post"
        onSubmit={handleLogin}
      >
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

        <input value="login" name="request-type" readOnly hidden />

        <button
          aria-label="Log in to your account"
          className={`btn-primary mt-3 w-full min-w-[10rem] self-center md:w-auto ${
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

      <button
        aria-label={forgotText}
        className="text-underline mt-4 text-center text-sm font-bold"
        onClick={() => setIsForgotPassword(true)}
        type="button"
      >
        {forgotText}
      </button>

      {errors?.length > 0 && (
        <ul className="mt-4 flex flex-col items-center gap-1">
          {errors.map((error, index) => {
            return (
              <li key={index} className="text-center text-sm text-red-500">
                {error === 'Unidentified customer'
                  ? unidentifiedCustomerText
                  : error}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

LoginForm.displayName = 'LoginForm';
