import {useEffect, useMemo, useState} from 'react';
import {useLocation, useNavigate} from '@remix-run/react';
import {useSiteSettings} from '@pack/react';

import {Link, Spinner, Svg} from '~/components';
import {useCustomer} from '~/hooks';
import {useCustomerLogOut} from '~/lib/customer';

export function CustomerAccountLayout({children}) {
  const navigate = useNavigate();
  const {pathname} = useLocation();
  const {customer, customerStatus} = useCustomer();
  const {customerLogOut} = useCustomerLogOut();
  const siteSettings = useSiteSettings();

  const [menuOpen, setMenuOpen] = useState(false);

  const {helpHeading, helpItems, menuItems} = {
    ...siteSettings?.settings?.account?.menu,
  };

  const activeMenuItem = useMemo(() => {
    return menuItems?.find(({link}) => {
      return pathname.startsWith(link?.url);
    });
  }, [pathname, menuItems]);

  // If logged out, redirect to login page
  useEffect(() => {
    if (customerStatus === 'guest') {
      navigate('/account/login', {replace: true});
    }
  }, [customerStatus]);

  if (!customer) {
    return (
      <div className="flex h-[500px] items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <section
      className="px-contained py-contained"
      data-comp={CustomerAccountLayout.displayName}
    >
      <div className="mx-auto grid w-full max-w-[80rem] grid-cols-1 gap-8 md:grid-cols-[12rem_1fr] lg:grid-cols-[16rem_1fr]">
        <div>
          <div className="flex flex-row justify-between gap-6 pb-6 md:flex-col md:justify-start md:border-b md:border-b-border">
            <div className="flex-1">
              <h2 className="text-title-h4 md:text-title-h5 lg:text-title-h4 mb-1 break-words">
                Hi{customer?.firstName ? `, ${customer.firstName}` : ''}
              </h2>

              <p className="break-words text-xs">{customer?.email}</p>
            </div>

            <div>
              <button
                aria-label="Sign out"
                className="text-main-underline text-nav bg-[linear-gradient(var(--primary),var(--primary))] font-normal"
                onClick={customerLogOut}
                type="button"
              >
                Sign Out
              </button>
            </div>
          </div>

          <nav className="hidden border-b border-b-border py-6 md:block">
            <ul className="flex flex-col items-start md:gap-4 lg:gap-6">
              {menuItems?.map(({link}, index) => {
                return link?.text ? (
                  <li key={index}>
                    <Link
                      aria-label={link.text}
                      to={link.url}
                      newTab={link.newTab}
                      type={link.type}
                    >
                      <p className="text-title-h5 md:text-title-h4 lg:text-title-h3 hover-text-underline">
                        {link.text}
                      </p>
                    </Link>
                  </li>
                ) : null;
              })}
            </ul>
          </nav>

          <div className="relative w-full md:hidden">
            <button
              aria-label="Open account menu"
              className="flex h-14 w-full items-center justify-between gap-4 rounded-full border border-gray px-5 text-base"
              onClick={() => setMenuOpen(!menuOpen)}
              type="button"
            >
              <p>{activeMenuItem?.link?.text}</p>

              <Svg
                className={`w-4 text-text ${menuOpen ? 'rotate-180' : ''}`}
                src="/svgs/chevron-down.svg#chevron-down"
                title="Chevron Down"
                viewBox="0 0 24 24"
              />
            </button>

            <nav
              className={`absolute left-0 top-[calc(100%+0.5rem)] z-10 w-full rounded-[0.5rem] border border-gray bg-background text-base transition duration-100 ${
                menuOpen
                  ? 'pointer-events-auto translate-y-0 opacity-100'
                  : 'pointer-events-none -translate-y-1 opacity-0'
              }`}
            >
              <ul className="scrollbar-hide flex max-h-[18rem] flex-col gap-0 overflow-y-auto py-2">
                {menuItems?.map(({link}, index) => {
                  const isActive = link?.url === activeMenuItem?.link?.url;

                  return link?.text ? (
                    <li key={index} className="flex">
                      <Link
                        aria-hidden={menuOpen ? 'true' : 'false'}
                        aria-label={link.text}
                        aria-selected={isActive ? 'true' : 'false'}
                        className={`w-full px-5 py-1.5 transition md:hover:bg-offWhite ${
                          isActive ? 'bg-lightGray' : 'bg-transparent'
                        }`}
                        to={link.url}
                        newTab={link.newTab}
                        tabIndex={menuOpen ? '0' : '-1'}
                        type={link.type}
                      >
                        {link.text}
                      </Link>
                    </li>
                  ) : null;
                })}
              </ul>
            </nav>
          </div>

          <ul className="hidden flex-col items-start gap-2 py-6 md:flex">
            <h3 className="text-base font-normal">{helpHeading}</h3>

            {helpItems?.map(({link}, index) => {
              return link?.text ? (
                <li key={index}>
                  <Link
                    aria-label={link.text}
                    className="break-words text-xs"
                    to={link.url}
                    type={link.type}
                  >
                    {link.text}
                  </Link>
                </li>
              ) : null;
            })}
          </ul>
        </div>

        {children}
      </div>
    </section>
  );
}

CustomerAccountLayout.displayName = 'AccountLayout.Customer';
