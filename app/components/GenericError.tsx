export function GenericError({error}: {error?: {message: string}}) {
  // TODO hide error in prod?
  if (error) {
    console.error(error.message);
  }

  return (
    <section className="flex justify-center p-5" data-comp="error">
      <div className="container flex items-center justify-center rounded-lg border border-dashed border-red-400 py-56 text-center">
        <pre className="text-red-400" aria-live="assertive" role="alert">
          An error has occurred on this page
          <br />
          Check console for more details
        </pre>
      </div>
    </section>
  );
}

GenericError.displayName = 'GenericError';
