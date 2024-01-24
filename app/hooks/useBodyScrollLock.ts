import {useCallback, useRef} from 'react';

export function useBodyScrollLock() {
  const scrollY = useRef(0);

  const lockBodyScroll = useCallback(() => {
    try {
      scrollY.current = window.scrollY;
      document.body.style.top = `-${scrollY.current}px`;
      document.body.style.position = 'fixed';
    } catch (error) {
      console.error(error);
    }
  }, []);

  const unlockBodyScroll = useCallback(() => {
    try {
      document.body.style.removeProperty('top');
      document.body.style.removeProperty('position');
      window.scrollTo({
        top: scrollY.current,
        left: 0,
        behavior: 'instant',
      });
      scrollY.current = 0;
    } catch (error) {
      console.error(error);
    }
  }, []);

  return {lockBodyScroll, unlockBodyScroll};
}
