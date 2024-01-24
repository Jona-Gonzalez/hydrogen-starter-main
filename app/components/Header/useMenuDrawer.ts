import {useCallback, useState} from 'react';

export function useMenuDrawer({settings}) {
  const {menuItems} = {...settings?.menu};

  const [menuDrawerIndex, setMenuDrawerIndex] = useState(null);

  const clearUnHoverTimer = useCallback(() => {
    if (window.unHover) {
      clearTimeout(window.unHover);
      window.unHover = null;
    }
  }, []);

  const handleMenuDrawerClose = useCallback(() => {
    setMenuDrawerIndex(null);
  }, []);

  const handleMenuDrawerStayOpen = useCallback(() => {
    clearUnHoverTimer();
    setMenuDrawerIndex(menuDrawerIndex);
  }, [menuDrawerIndex]);

  const handleMenuHoverIn = useCallback((index) => {
    clearUnHoverTimer();
    setMenuDrawerIndex(typeof index === 'number' ? index : null);
  }, []);

  const handleMenuHoverOut = useCallback(() => {
    clearUnHoverTimer();
    window.unHover = setTimeout(() => {
      setMenuDrawerIndex(null);
      clearUnHoverTimer();
    }, 100);
  }, []);

  return {
    state: {
      menuDrawerContent:
        typeof menuDrawerIndex === 'number'
          ? menuItems?.[menuDrawerIndex] || null
          : null,
      menuDrawerIndex,
    },
    actions: {
      handleMenuDrawerClose,
      handleMenuDrawerStayOpen,
      handleMenuHoverIn,
      handleMenuHoverOut,
    },
  };
}
