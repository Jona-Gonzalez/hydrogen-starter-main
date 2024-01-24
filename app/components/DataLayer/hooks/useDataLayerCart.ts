// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable @typescript-eslint/naming-convention */
import {useEffect, useCallback, useRef, useState} from 'react';
import {useCart} from '@shopify/hydrogen-react';
import {useLocation} from '@remix-run/react';
import equal from 'fast-deep-equal';
import {v4 as uuidv4} from 'uuid';

import {mapCartLine} from './utils';
import {useGlobalContext} from '~/contexts';

export function useDataLayerCart({
  currencyCode,
  DEBUG,
  userDataEvent,
  userDataEventTriggered,
  userProperties,
}: {
  currencyCode?: string | undefined;
  DEBUG?: boolean;
  userDataEvent: (arg0: any) => void;
  userDataEventTriggered: boolean;
  userProperties: any;
}) {
  const pathnameRef = useRef<string | undefined>(undefined);
  const {pathname} = useLocation();
  const {cost, lines, status, totalQuantity} = useCart();
  const {
    state: {cartOpen},
  }: any = useGlobalContext();

  const [mounted, setMounted] = useState(false);
  const [previousCartCount, setPreviousCartCount] = useState<
    number | undefined
  >(undefined);
  const [previousCartLines, setPreviousCartLines] = useState<any[] | undefined>(
    undefined,
  );
  const [previousCartLinesMap, setPreviousCartLinesMap] =
    useState<any>(undefined);

  const addToCartEvent = useCallback(
    ({
      lines,
      userProperties: _userProperties,
    }: {
      lines: any[];
      userProperties: any;
    }) => {
      if (!lines.length) return;
      const previousPath = sessionStorage.getItem('PREVIOUS_PATH');
      const list =
        (window.location.pathname.startsWith('/collections') &&
          window.location.pathname) ||
        (previousPath?.startsWith('/collections') && previousPath) ||
        '';
      const event = {
        event: 'add_to_cart',
        event_id: uuidv4(),
        event_time: new Date().toISOString(),
        user_properties: _userProperties,
        ecommerce: {
          currencyCode: lines[0].estimatedCost?.totalAmount?.currencyCode,
          add: {
            actionField: {list},
            products: lines.map(mapCartLine(list)),
          },
        },
      };

      if (window.gtag) window.gtag('event', event.event, event);
      if (DEBUG) console.log(`DataLayer:gtag:${event.event}`, event);
    },
    [],
  );

  const removeFromCartEvent = useCallback(
    ({
      lines,
      userProperties: _userProperties,
    }: {
      lines: any[];
      userProperties: any;
    }) => {
      if (!lines.length) return;
      const previousPath = sessionStorage.getItem('PREVIOUS_PATH');
      const list =
        (window.location.pathname.startsWith('/collections') &&
          window.location.pathname) ||
        (previousPath?.startsWith('/collections') && previousPath) ||
        '';
      const event = {
        event: 'remove_from_cart',
        event_id: uuidv4(),
        event_time: new Date().toISOString(),
        user_properties: _userProperties,
        ecommerce: {
          currencyCode: lines[0].estimatedCost?.totalAmount?.currencyCode,
          remove: {
            actionField: {list},
            products: lines.map(mapCartLine(list)),
          },
        },
      };

      if (window.gtag) window.gtag('event', event.event, event);
      if (DEBUG) console.log(`DataLayer:gtag:${event.event}`, event);
    },
    [],
  );

  const viewCartEvent = useCallback(
    ({
      cost: _cost,
      currencyCode: _currencyCode,
      lines: _lines,
      userProperties: _userProperties,
    }: {
      cost?: any;
      currencyCode?: string | undefined;
      lines: any[];
      userProperties: any;
    }) => {
      if (!_cost || !_lines) return;
      const previousPath = sessionStorage.getItem('PREVIOUS_PATH');
      const list =
        (window.location.pathname.startsWith('/collections') &&
          window.location.pathname) ||
        (previousPath?.startsWith('/collections') && previousPath) ||
        '';
      const event = {
        event: 'view_cart',
        event_id: uuidv4(),
        event_time: new Date().toISOString(),
        user_properties: _userProperties,
        cart_total: _cost.totalAmount?.amount || '0.0',
        ecommerce: {
          currencyCode: _cost.totalAmount?.currencyCode || _currencyCode,
          actionField: {list: 'Shopping Cart'},
          impressions: lines.slice(0, 7).map(mapCartLine(list)) || [],
        },
      };

      if (window.gtag) window.gtag('event', event.event, event);
      if (DEBUG) console.log(`DataLayer:gtag:${event.event}`, event);
    },
    [],
  );

  // Trigger 'dl_user_data' and 'dl_view_cart' events on cart page
  useEffect(() => {
    if (
      !pathname.startsWith('/cart') ||
      status !== 'idle' ||
      !currencyCode ||
      !userProperties ||
      pathname === pathnameRef.current
    )
      return undefined;
    userDataEvent({userProperties});
    viewCartEvent({cost, lines, userProperties});
    pathnameRef.current = pathname;
    return () => {
      pathnameRef.current = undefined;
    };
  }, [pathname, status, !!userProperties]);

  // Trigger 'view_cart' event when cart is opened
  useEffect(() => {
    if (!cartOpen || !currencyCode || !userDataEventTriggered) return;
    viewCartEvent({cost, currencyCode, lines, userProperties});
  }, [cartOpen, !!currencyCode, userDataEventTriggered]);

  // Determine if a cart item was added, removed, or updated for events
  useEffect(() => {
    if (!mounted) {
      setMounted(true);
      return;
    }
    if (
      status !== 'idle' ||
      !lines ||
      !userDataEventTriggered ||
      totalQuantity === previousCartCount
    )
      return;

    const cartLinesMap: any = lines.reduce((acc, line: any) => {
      if (!line.merchandise) return acc;
      const variantId = line.merchandise.id;
      if (!acc[variantId]) {
        return {...acc, [variantId]: [line]};
      }
      return {...acc, [variantId]: [...acc[variantId], line]};
    }, {});

    if (!previousCartLines || previousCartCount === totalQuantity) {
      setPreviousCartLines(lines);
      setPreviousCartCount(totalQuantity);
      setPreviousCartLinesMap(cartLinesMap);
      return;
    }

    const isAddedLines: any[] = [];
    const isIncreasedLines: any[] = [];
    const isRemovedLines: any[] = [];
    const isDecreasedLines: any[] = [];

    if (totalQuantity > previousCartCount) {
      lines.forEach((line: any, index) => {
        const variantId = line.merchandise?.id;
        if (!variantId) return;

        const previousLine = previousCartLinesMap[variantId]?.find(
          (prevLine: any) => {
            const hasSameSellingPlanSelection =
              (!prevLine.sellingPlanAllocation &&
                !line.sellingPlanAllocation) ||
              prevLine.sellingPlanAllocation?.sellingPlan?.id ===
                line.sellingPlanAllocation?.sellingPlan?.id;
            return (
              hasSameSellingPlanSelection &&
              equal(prevLine.attributes, line.attributes)
            );
          },
        );
        if (!previousLine) {
          isAddedLines.push({...line, index});
          return;
        }
        if (line.quantity > previousLine.quantity) {
          isIncreasedLines.push({
            ...line,
            quantity: line.quantity - previousLine.quantity,
            index,
          });
        }
      });
    } else if (totalQuantity < previousCartCount) {
      previousCartLines.forEach((prevLine: any, index: number) => {
        const variantId = prevLine.merchandise?.id;
        if (!variantId) return;

        const currentLine = cartLinesMap?.[variantId]?.find((line: any) => {
          const hasSameSellingPlanSelection =
            (!prevLine.sellingPlanAllocation && !line.sellingPlanAllocation) ||
            prevLine.sellingPlanAllocation?.sellingPlan?.id ===
              line.sellingPlanAllocation?.sellingPlan?.id;
          return (
            hasSameSellingPlanSelection &&
            equal(prevLine.attributes, line.attributes)
          );
        });
        if (!currentLine) {
          isRemovedLines.push({...prevLine, index});
          return;
        }
        if (currentLine.quantity < prevLine.quantity) {
          isDecreasedLines.push({
            ...prevLine,
            quantity: prevLine.quantity - currentLine.quantity,
            index,
          });
        }
      });
    }

    if (isAddedLines.length || isIncreasedLines.length) {
      addToCartEvent({
        lines: [...isAddedLines, ...isIncreasedLines],
        userProperties,
      });
    }
    if (isRemovedLines.length || isDecreasedLines.length) {
      removeFromCartEvent({
        lines: [...isRemovedLines, ...isDecreasedLines],
        userProperties,
      });
    }

    setPreviousCartLines(lines);
    setPreviousCartCount(totalQuantity);
    setPreviousCartLinesMap(cartLinesMap);
  }, [status, userDataEventTriggered]);
}
