import {Swiper, SwiperSlide} from 'swiper/react';
import {A11y} from 'swiper/modules';

import {Link, Svg} from '~/components';
import {MenuNestedSidebar} from './MenuNestedSidebar';
import {ProductItem} from '../ProductItem';
import {useGlobalContext} from '~/contexts';

export function MenuSidebar({
  handleCloseSidebar,
  menuSidebarOpen,
  nestedSidebarContent,
  handleNestedSidebar,
  settings,
}) {
  const {
    actions: {openSearch},
  } = useGlobalContext();

  const {
    links: additionalLinks,
    menuItems,
    productsSlider,
  } = {...settings?.menu};
  const {products, heading: productsHeading} = {
    ...productsSlider,
  };

  return (
    <div
      className={`fixed left-0 top-0 z-[60] h-full w-full lg:hidden ${
        menuSidebarOpen ? 'pointer-events-auto' : 'pointer-events-none'
      }`}
    >
      {/* Overlay */}
      <div
        role="button"
        aria-hidden="true"
        aria-label="Close menu sidebar"
        tabIndex="-1"
        className={`absolute left-0 top-0 hidden h-full w-full bg-[rgba(0,0,0,0.3)] transition duration-200 md:block ${
          menuSidebarOpen ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={handleCloseSidebar}
      />

      <aside
        className={`absolute right-full top-0 flex h-full w-full flex-col overflow-hidden bg-background transition md:max-w-[var(--sidebar-width)] ${
          menuSidebarOpen ? 'translate-x-full' : '-translate-x-0'
        }`}
      >
        {menuSidebarOpen && (
          <>
            <div className="relative flex h-[var(--header-height)] items-center justify-center border-b border-b-border px-12">
              <button
                aria-label="Close menu sidebar"
                className="absolute left-4 top-1/2 -translate-y-1/2"
                onClick={handleCloseSidebar}
                type="button"
              >
                <Svg
                  className="w-5"
                  src="/svgs/close.svg#close"
                  title="Close"
                  viewBox="0 0 24 24"
                />
              </button>

              <Link
                aria-label="Go to homepage"
                to="/"
                onClick={handleCloseSidebar}
              >
                <Svg
                  className="h-10 text-text"
                  src="/svgs/logo.svg#logo"
                  title="Storefront logo"
                  viewBox="0 0 31 35"
                />
              </Link>

              <button
                aria-label="Open search sidebar"
                className="absolute right-4 top-1/2 -translate-y-1/2"
                onClick={() => {
                  handleCloseSidebar();
                  openSearch();
                }}
                type="button"
              >
                <Svg
                  className="w-5"
                  src="/svgs/search.svg#search"
                  title="Search"
                  viewBox="0 0 24 24"
                />
              </button>
            </div>

            <div className="relative w-full flex-1 overflow-x-hidden">
              <div
                className={`scrollbar-hide h-full w-full overflow-y-auto ${
                  nestedSidebarContent ? 'invisible' : 'visible'
                }`}
              >
                <nav className="mb-8 flex">
                  <ul className="w-full flex-col">
                    {menuItems?.map((item, index) => {
                      const hasContent =
                        item.links?.length > 0 || item.imageLinks?.length > 0;

                      return (
                        <li
                          key={index}
                          className="flex min-h-[3.5rem] w-full border-b border-b-border"
                        >
                          {hasContent ? (
                            <button
                              aria-label={item.menuItem.text}
                              className="flex h-14 w-full items-center justify-between gap-5 p-4"
                              onClick={() => handleNestedSidebar(index)}
                              type="button"
                            >
                              <p className="text-nav flex-1 text-left">
                                {item.menuItem.text}
                              </p>

                              <Svg
                                className="w-5"
                                src="/svgs/arrow-right.svg#arrow-right"
                                title="Arrow Right"
                                viewBox="0 0 24 24"
                              />
                            </button>
                          ) : (
                            <Link
                              aria-label={item.menuItem.text}
                              className="text-nav flex h-14 w-full items-center p-4"
                              to={item.menuItem.url}
                              onClick={handleCloseSidebar}
                              newTab={item.menuItem.newTab}
                              type={item.menuItem.type}
                            >
                              {item.menuItem.text}
                            </Link>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </nav>

                {products?.length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-title-h5 mb-2 px-4">
                      {productsHeading}
                    </h3>

                    <Swiper
                      modules={[A11y]}
                      slidesPerView={1.3}
                      spaceBetween={16}
                      slidesOffsetBefore={16}
                      slidesOffsetAfter={16}
                      grabCursor
                      className="mb-5"
                    >
                      {products.map(({product}, index) => {
                        return (
                          <SwiperSlide key={index}>
                            <ProductItem
                              handle={product.handle}
                              index={index}
                              onClick={handleCloseSidebar}
                            />
                          </SwiperSlide>
                        );
                      })}
                    </Swiper>
                  </div>
                )}

                {additionalLinks?.length > 0 && (
                  <ul className="mb-8 flex flex-col gap-[0.25rem] px-5">
                    {additionalLinks.map(({link}, index) => {
                      return (
                        <li key={index}>
                          <Link
                            aria-label={link?.text}
                            to={link?.url}
                            onClick={handleCloseSidebar}
                            newTab={link?.newTab}
                            type={link?.type}
                          >
                            {link?.text}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>

              <MenuNestedSidebar
                handleCloseSidebar={handleCloseSidebar}
                handleNestedSidebar={handleNestedSidebar}
                nestedSidebarContent={nestedSidebarContent}
              />
            </div>
          </>
        )}
      </aside>
    </div>
  );
}

MenuSidebar.displayName = 'MenuSidebar';
