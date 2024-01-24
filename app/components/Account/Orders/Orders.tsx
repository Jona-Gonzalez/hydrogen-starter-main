import {useLocation} from '@remix-run/react';
import {useSiteSettings} from '@pack/react';

import {OrdersItem} from './OrdersItem';
import {Link, Spinner} from '~/components';

export function Orders() {
  const siteSettings = useSiteSettings();
  const {menuItems} = {...siteSettings?.settings?.account?.menu};
  const {buttonStyle, emptyOrdersButton, emptyOrdersText, ordersPerPage} = {
    ...siteSettings?.settings?.account?.orders,
  };
  const {pathname} = useLocation();
  const heading = menuItems?.find(({link}) => pathname.startsWith(link?.url))
    ?.link?.text;

  const getNext = () => null;
  const getPrevious = () => null;
  const hasNext = false;
  const hasPrevious = false;
  const orders = [];
  const status = {};

  const headers = [
    'Order',
    'Date',
    'Payment Status',
    'Fulfillment Status',
    'Total',
  ];

  return (
    <div className="flex flex-col gap-8 md:gap-10">
      <h1 className="text-title-h4">{heading}</h1>

      {status.started && !status.finished && (
        <div className="relative flex min-h-[12rem] items-center justify-center text-mediumDarkGray">
          <Spinner width="32" />
        </div>
      )}

      {status.finished && !orders?.length && (
        <div
          className="relative flex min-h-[12rem] flex-col items-center justify-center gap-4"
          role="status"
        >
          <p className="text-center">{emptyOrdersText}</p>

          {emptyOrdersButton?.text && (
            <Link className={`${buttonStyle}`} to={emptyOrdersButton.url}>
              {emptyOrdersButton.text}
            </Link>
          )}
        </div>
      )}

      {status.success && !!orders?.length && (
        <div className="flex flex-col gap-8">
          <div className="hidden grid-cols-[2fr_2fr_2fr_2fr_1fr] gap-3 md:grid">
            {headers.map((header) => {
              return (
                <h6 key={header} className="text-label">
                  {header}
                </h6>
              );
            })}
          </div>

          <ul className="flex flex-col gap-3 md:gap-8">
            {orders.map((order) => {
              return (
                <li key={order.id}>
                  <OrdersItem order={order} />
                </li>
              );
            })}
          </ul>

          <div className="flex justify-between gap-3">
            <div>
              {hasPrevious && (
                <button
                  aria-label="See previous orders"
                  className="text-underline text-xs"
                  onClick={() => {
                    getPrevious();
                    window.scrollTo({top: 0, behavior: 'smooth'});
                  }}
                  type="button"
                >
                  Previous
                </button>
              )}
            </div>

            <div>
              {hasNext && (
                <button
                  aria-label="See next orders"
                  className="text-underline text-xs"
                  onClick={() => {
                    getNext();
                    window.scrollTo({top: 0, behavior: 'smooth'});
                  }}
                  type="button"
                >
                  Next
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

Orders.displayName = 'Orders';
