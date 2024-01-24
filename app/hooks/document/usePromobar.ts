import {useState} from 'react';
import {useLocation} from '@remix-run/react';

const PROMOBAR_HEIGHT = 48;

export function usePromobar({settings}: {settings?: Record<string, any>}) {
  const {pathname} = useLocation();

  const [promobarHidden, setPromobarHidden] = useState(null);
  // ensures promobar doesn't flash between pdp product grouping variant changes
  const [hidePromobarOnTransition] = useState(
    pathname.startsWith('/products') &&
      typeof window !== 'undefined' &&
      window.scrollY > PROMOBAR_HEIGHT,
  );

  const promobar = settings?.promobar;
  const promobarDisabled =
    !!promobar && (!promobar.enabled || !promobar.messages?.length);
  const mainClassName = promobarDisabled
    ? 'pt-[var(--header-height)]'
    : 'pt-[calc(var(--header-height)+var(--promobar-height))]';

  return {
    hidePromobarOnTransition:
      hidePromobarOnTransition &&
      typeof promobarHidden !== 'boolean' &&
      !!promobar?.autohide,
    mainClassName,
    promobarDisabled,
    promobarHeight: PROMOBAR_HEIGHT,
    promobarHidden,
    setPromobarHidden,
  };
}
