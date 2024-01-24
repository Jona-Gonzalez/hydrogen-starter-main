import {Image} from '@shopify/hydrogen-react';

import {Link} from '~/components';

export function MenuDrawer({
  handleMenuDrawerClose,
  handleMenuDrawerStayOpen,
  handleMenuHoverOut,
  menuDrawerContent,
}) {
  const {imageLinks, links, mainLink} = {...menuDrawerContent};
  const hasContent = imageLinks?.length > 0 || links?.length > 0;

  return (
    <div
      className={`absolute left-0 top-[100%] hidden w-full origin-top border-border bg-background transition duration-200 lg:block ${
        hasContent ? 'scale-y-100 border-b' : 'scale-y-0'
      }`}
      onMouseEnter={handleMenuDrawerStayOpen}
      onMouseLeave={handleMenuHoverOut}
    >
      {hasContent && (
        <div className="mx-[auto] grid max-w-[70rem] grid-cols-[12rem_1fr] gap-5 p-8 md:p-12">
          <div>
            <ul className="flex flex-col gap-2">
              {links?.map(({link}, index) => {
                return (
                  <li key={index}>
                    <Link
                      aria-hidden={!hasContent}
                      aria-label={link?.text}
                      className="hover-text-underline"
                      to={link?.url}
                      newTab={link?.newTab}
                      onClick={handleMenuDrawerClose}
                      tabIndex={hasContent ? '0' : '-1'}
                      type={link?.type}
                    >
                      {link?.text}
                    </Link>
                  </li>
                );
              })}
            </ul>

            {mainLink?.text && (
              <Link
                aria-hidden={!hasContent}
                aria-label={mainLink.text}
                className="btn-primary mt-5"
                to={mainLink.url}
                newTab={mainLink.newTab}
                onClick={handleMenuDrawerClose}
                tabIndex={hasContent ? '0' : '-1'}
                type={mainLink.type}
              >
                {mainLink.text}
              </Link>
            )}
          </div>

          <ul className="grid grid-cols-2 gap-5">
            {imageLinks?.map(({alt, caption, image, link}, index) => {
              return (
                <li key={index}>
                  <Link
                    aria-hidden={!hasContent}
                    aria-label={caption}
                    to={link?.url}
                    newTab={link?.newTab}
                    onClick={handleMenuDrawerClose}
                    tabIndex={hasContent ? '0' : '-1'}
                    type={link?.type}
                  >
                    <div className="relative aspect-[16/9] w-full overflow-hidden bg-offWhite">
                      {image?.src && (
                        <Image
                          data={{
                            altText: alt || image.altText,
                            url: image.src,
                            height: Math.floor(400 / (16 / 9)),
                            width: 400,
                          }}
                          className="absolute left-1/2 top-1/2 h-full w-full -translate-x-1/2 -translate-y-1/2 object-cover"
                          crop="center"
                        />
                      )}
                    </div>

                    <p className="mt-3 text-sm">{caption}</p>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}

MenuDrawer.displayName = 'MenuDrawer';
