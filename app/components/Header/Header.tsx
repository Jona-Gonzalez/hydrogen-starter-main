import {Menu} from './Menu';
import {MenuDrawer} from './MenuDrawer';
import {MenuSidebar} from './MenuSidebar';
import {Promobar} from './Promobar';
import {usePromobar} from '../../hooks';
import {useMenuDrawer} from './useMenuDrawer';
import {useMenuSidebar} from './useMenuSidebar';

export function Header({settings}) {
  const {
    state: {menuDrawerContent},
    actions: {
      handleMenuDrawerClose,
      handleMenuDrawerStayOpen,
      handleMenuHoverIn,
      handleMenuHoverOut,
    },
  } = useMenuDrawer({settings});
  const {
    hidePromobarOnTransition,
    promobarDisabled,
    promobarHeight,
    promobarHidden,
    setPromobarHidden,
  } = usePromobar({settings});
  const {
    state: {menuSidebarOpen, nestedSidebarContent},
    actions: {handleCloseSidebar, handleNestedSidebar, handleOpenSidebar},
  } = useMenuSidebar({settings});

  return (
    <header
      className={`fixed right-0 top-0 left-0 z-20 flex flex-col bg-background transition-[height] duration-300 ease-out ${
        promobarHidden || promobarDisabled || hidePromobarOnTransition
          ? 'h-[var(--header-height)]'
          : 'h-[calc(var(--header-height)+var(--promobar-height))]'
      }`}
    >
      <Promobar
        hidePromobarOnTransition={hidePromobarOnTransition}
        promobarDisabled={promobarDisabled}
        promobarHeight={promobarHeight}
        promobarHidden={promobarHidden}
        setPromobarHidden={setPromobarHidden}
        settings={settings}
      />

      <Menu
        handleOpenSidebar={handleOpenSidebar}
        handleMenuDrawerClose={handleMenuDrawerClose}
        handleMenuHoverIn={handleMenuHoverIn}
        handleMenuHoverOut={handleMenuHoverOut}
        menuDrawerContent={menuDrawerContent}
        settings={settings}
      />

      <MenuDrawer
        handleMenuDrawerClose={handleMenuDrawerClose}
        handleMenuDrawerStayOpen={handleMenuDrawerStayOpen}
        handleMenuHoverOut={handleMenuHoverOut}
        menuDrawerContent={menuDrawerContent}
      />

      <MenuSidebar
        handleCloseSidebar={handleCloseSidebar}
        handleNestedSidebar={handleNestedSidebar}
        menuSidebarOpen={menuSidebarOpen}
        nestedSidebarContent={nestedSidebarContent}
        settings={settings}
      />
    </header>
  );
}

Header.displayName = 'Header';
