import {Svg} from '~/components';
import {useGlobalContext} from '~/contexts';

export function Modal() {
  const {
    state: {modal},
    actions: {closeModal},
  } = useGlobalContext();

  const {className, ...props} = {...modal.props};

  return modal.children ? (
    <div
      className={`fixed top-1/2 left-1/2 z-50 max-h-[calc(var(--viewport-height)-2rem)] w-[calc(100%-2rem)] max-w-[48rem] -translate-x-1/2 -translate-y-1/2 overflow-hidden bg-background ${className}`}
      {...props}
    >
      <button
        aria-label="Close modal"
        className="absolute right-0 top-0  z-10 flex h-7 w-7 items-center justify-center bg-offWhite"
        onClick={closeModal}
        type="button"
      >
        <Svg
          className="w-5 text-text"
          src="/svgs/close.svg#close"
          title="Close"
          viewBox="0 0 24 24"
        />
      </button>

      <div className="scrollbar-hide px-contained py-contained max-h-[calc(var(--viewport-height)-2rem)] overflow-y-auto">
        {modal.children}
      </div>
    </div>
  ) : null;
}

Modal.displayName = 'Modal';
