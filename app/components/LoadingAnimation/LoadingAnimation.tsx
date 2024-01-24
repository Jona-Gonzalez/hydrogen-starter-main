export function LoadingAnimation({
  type = 'dark',
  ...props
}: {
  type?: 'dark' | 'light';
}) {
  const activeColor = type === 'light' ? 'white' : '#2D2D2D';
  const animation =
    type === 'light'
      ? 'dot-flashing-light 0.65s infinite linear alternate'
      : 'dot-flashing 0.65s infinite linear alternate';

  return (
    <>
      <p>Loading</p>
      <div
        {...props}
        data-comp={LoadingAnimation.displayName}
        role="alert"
        aria-label="Loading"
        aria-live="assertive"
        className="relative h-[8px] w-[8px] animate-dot-flashing rounded-full bg-black text-black opacity-100 animate-delay-[425ms] before:absolute before:left-[-14px] before:top-0 before:inline-block before:h-[8px] before:w-[8px] before:animate-dot-flashing before:rounded-full before:bg-black before:text-black before:opacity-100 before:content-[''] after:absolute after:left-[14px] after:top-0 after:inline-block after:h-[8px] after:w-[8px] after:animate-dot-flashing after:rounded-full after:bg-black after:text-black after:opacity-100 after:content-[''] after:animate-delay-[850ms]"
      />
    </>
  );
}

LoadingAnimation.displayName = 'LoadingAnimation';
