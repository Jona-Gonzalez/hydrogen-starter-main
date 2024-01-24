import {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {useNavigate} from '@remix-run/react';
import {useSiteSettings} from '@pack/react';

import {Link, Spinner} from '~/components';

export function ResetPassword({params}) {
  const resetPassword = async () => null;
  const finished = false;
  const reset = () => null;
  const resetTimer = useRef(null);
  const started = false;
  const success = false;

  const [errors, setErrors] = useState([]);
  const navigate = useNavigate();
  const siteSettings = useSiteSettings();

  const {heading, subtext} = {...siteSettings?.settings?.account?.reset};
  const {customerId, resetToken} = params;
  const resetUrl = `https://${process.env.SHOPIFY_DOMAIN}/account/reset/${customerId}/${resetToken}`;

  const buttonText = useMemo(() => {
    if (finished) {
      resetTimer.current = setTimeout(() => {
        if (reset) reset();
        clearTimeout(resetTimer.current);
      }, 3000);
      return success ? 'Password Reset' : 'Failed';
    }
    return started ? 'Resetting Password' : 'Reset Password';
  }, [started, success, finished]);

  const handleResetPassword = useCallback(
    async (event) => {
      event.preventDefault();
      if (started) return;

      const {password, passwordConfirm} = event.target;
      if (password.value !== passwordConfirm.value) {
        setErrors(['Passwords do not match. Please try again.']);

        if (finished) {
          resetTimer.current = setTimeout(() => {
            if (reset) reset();
            clearTimeout(resetTimer.current);
          }, 3000);
        }
        return;
      }

      await resetPassword({
        password: password.value,
        url: resetUrl,
      });
    },
    [finished, reset, resetUrl, started],
  );

  useEffect(() => {
    if (finished && success) {
      setTimeout(() => navigate('/account/login'), 3000);
    }
  }, [finished, success]);

  return (
    <div className="flex flex-col items-center">
      <div className="mx-auto flex w-full max-w-[28rem] flex-col items-center rounded border border-border px-3 py-6 md:px-6 md:py-10">
        <div className="mb-6 flex flex-col gap-4">
          <h1 className="text-title-h3 text-center">{heading}</h1>

          {subtext && (
            <p className="max-w-[20rem] text-center text-sm">{subtext}</p>
          )}
        </div>

        <form
          className="mx-auto flex w-full max-w-[25rem] flex-col gap-4"
          onSubmit={handleResetPassword}
        >
          <label htmlFor="password">
            <span className="text-title-h6 block pb-1 pl-5">Password</span>
            <input
              className="input-text"
              name="password"
              placeholder="••••••••"
              required
              type="password"
            />
          </label>

          <label htmlFor="passwordConfirm">
            <span className="text-title-h6 block pb-1 pl-5">
              Confirm Password
            </span>
            <input
              className="input-text"
              name="passwordConfirm"
              placeholder="••••••••"
              required
              type="password"
            />
          </label>

          <button
            aria-label="Submit to reset password"
            className={`btn-primary mt-3 min-w-[10rem] self-center ${
              started ? 'cursor-default' : ''
            }`}
            type="submit"
          >
            {started ? <Spinner width="20" /> : buttonText}
          </button>
        </form>

        <Link
          aria-label="Go back to login page"
          className="text-underline mt-4 text-center text-sm font-bold"
          to="/account/login"
        >
          Cancel
        </Link>

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
    </div>
  );
}

ResetPassword.displayName = 'ResetPassword';
