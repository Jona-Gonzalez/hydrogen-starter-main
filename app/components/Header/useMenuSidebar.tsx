import {useCallback, useState} from 'react';

import {useBodyScrollLock} from '~/hooks';

export function useMenuSidebar({settings}) {
  const {lockBodyScroll, unlockBodyScroll} = useBodyScrollLock();
  const {menuItems} = {...settings?.menu};

  const [menuSidebarOpen, setMenuSidebarOpen] = useState(false);
  const [nestedSidebarIndex, setNestedSidebarIndex] = useState(null);

  const handleOpenSidebar = useCallback(() => {
    setMenuSidebarOpen(true);
    lockBodyScroll();
  }, []);

  const handleCloseSidebar = useCallback(() => {
    setMenuSidebarOpen(false);
    setNestedSidebarIndex(null);
    unlockBodyScroll();
  }, []);

  const handleNestedSidebar = useCallback((index) => {
    setNestedSidebarIndex(typeof index === 'number' ? index : null);
  }, []);

  return {
    state: {
      menuSidebarOpen,
      nestedSidebarContent:
        typeof nestedSidebarIndex === 'number'
          ? menuItems?.[nestedSidebarIndex] || null
          : null,
    },
    actions: {
      handleOpenSidebar,
      handleCloseSidebar,
      handleNestedSidebar,
    },
  };
}
