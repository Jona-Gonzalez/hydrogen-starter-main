import {useEffect} from 'react';

import {useBodyScrollLock} from '~/hooks';
import {useGlobalContext} from '~/contexts';

export function Overlay() {
  const {
    state: {overlayOpen},
    actions: {closeOverlay},
  } = useGlobalContext();
  const {lockBodyScroll, unlockBodyScroll} = useBodyScrollLock();

  useEffect(() => {
    if (overlayOpen) {
      lockBodyScroll();
    } else {
      unlockBodyScroll();
    }
  }, [overlayOpen]);

  return (
    <div
      role="button"
      aria-hidden="true"
      aria-label="Close menu sidebar"
      tabIndex="-1"
      className={`fixed top-0 left-0 z-40 h-full w-full cursor-pointer bg-[rgba(0,0,0,0.3)] transition duration-200 ${
        overlayOpen
          ? 'pointer-events-auto opacity-100'
          : 'pointer-events-none opacity-0'
      }`}
      onClick={closeOverlay}
    />
  );
}

Overlay.displayName = 'Overlay';
