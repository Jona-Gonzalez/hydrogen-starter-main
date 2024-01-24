import {useCallback, useEffect, useMemo, useState} from 'react';
import {Spinner} from '~/components';

export function ForgotPasswordForm({setIsForgotPassword, settings}) {
  const [message, setMessage] = useState('');

  const {heading, postSubmissionText, subtext} = {
    ...settings?.forgot,
  };

  const recoverPassword = () => null;
  const buttonText = 'Submit';
  const started = false;
  const finished = false;

  const handleRecoverPassword = useCallback(async (event) => {
    event.preventDefault();
    const {email} = event.target;
    await recoverPassword({email: email.value});
  }, []);

  useEffect(() => {
    if (finished) {
      setMessage(postSubmissionText);
      setTimeout(() => {
        setMessage('');
        setIsForgotPassword(false);
      }, 3000);
    }
  }, [finished]);

  return (
    <div className="flex flex-col items-center rounded border border-border px-3 py-6 md:px-6 md:py-10">
      <div className="mb-6 flex flex-col gap-4">
        <h2 className="text-title-h3 text-center">{heading}</h2>

        {subtext && (
          <p className="max-w-[20rem] text-center text-sm">{subtext}</p>
        )}
      </div>

      <form
        className="mx-auto flex w-full max-w-[25rem] flex-col gap-4"
        onSubmit={handleRecoverPassword}
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

        <button
          aria-label="Submit email for password recovery"
          className={`btn-primary mt-3 min-w-[10rem] self-center ${
            started ? 'cursor-default' : ''
          }`}
          type="submit"
        >
          {started ? <Spinner width="20" /> : buttonText}
        </button>
      </form>

      <button
        aria-label="Cancel"
        className="text-underline mt-4 text-center text-sm font-bold"
        onClick={() => setIsForgotPassword(false)}
        type="button"
      >
        Cancel
      </button>

      {message && <p className="mt-4 text-center text-sm">{message}</p>}
    </div>
  );
}

ForgotPasswordForm.displayName = 'ForgotPasswordForm';
